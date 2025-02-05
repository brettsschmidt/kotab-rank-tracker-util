import { rankToLP } from "../helpers/rank.helpers";
import { MessageEvents } from "../interfaces/message-events.interface";
import { WatchedAccount, WatchedAccountRank } from "../interfaces/watched-account.interface";
import { DiscordWebhookAPIService } from "./discord-webhook-api.service";
import { MessageHelperService } from "./message-helper.service";
import { RiotAPI } from "./riot-api.service";

export class RankTrackerService {
  public pruneRankSnapshotsAfterCount: number = parseInt(process.env["PruneRankSnapshotsAfterCount"] || "10");
  public pruneRankSnapshotsEnabled: boolean = process.env["PruneRankSnapshotsEnabled"] === "true";

  public eventsToLog: MessageEvents = {
    general: [],
    soloQueueTracking: [],
    flexQueueTracking: [],
  }

  public riotApi: RiotAPI = new RiotAPI();
  public discordApi: DiscordWebhookAPIService = new DiscordWebhookAPIService();
  public messageService: MessageHelperService = new MessageHelperService();

  public async updateBasicSummonerInfo(player: WatchedAccount): Promise<void> {
    const basicInfo = await this.riotApi.getBasicInfoByRiotId(player.gameName, player.tagLine);

    // In case we just started scraping info
    if (player.puuid == null || player.puuid === "") {
      player.puuid = basicInfo.puuid;
    }

    // In case someone update's their name/tag (@Corey)
    if (player.gameName !== basicInfo.gameName || player.tagLine !== basicInfo.tagLine) {
      let newPlayer: WatchedAccount = {...player, gameName: basicInfo.gameName, tagLine: basicInfo.tagLine};

      this.eventsToLog.general.push(this.messageService.nameChangeMessage(player, newPlayer));

      player.gameName = basicInfo.gameName;
      player.tagLine = basicInfo.tagLine;
    }

    if (player.summonerId == null || player.summonerId === "") {
      player.summonerId = await this.riotApi.getSummonerId(player.puuid);
    }
  }

  public async updateRanks(player: WatchedAccount): Promise<void> {
    const rankedInfo = await this.riotApi.getRankedInfo(player.summonerId);
    const soloDuo = rankedInfo.find(x => x.queueType === "RANKED_SOLO_5x5");
    const flex = rankedInfo.find(x => x.queueType === "RANKED_FLEX_SR");

    if (player.lastRanks == null) {
      player.lastRanks = [];
    }

    if (this.pruneRankSnapshotsEnabled && player.lastRanks.length >= this.pruneRankSnapshotsAfterCount) {
      player.lastRanks.shift();
    }

    player.lastRanks.push({
      date: new Date(),
      soloDuo: {
        wins: soloDuo!.wins,
        losses: soloDuo!.losses,
        games: soloDuo!.wins + soloDuo!.losses,
        tier: soloDuo!.tier,
        rank: soloDuo!.rank,
        lp: soloDuo!.leaguePoints
      },
      flex: {
        wins: flex!.wins,
        losses: flex!.losses,
        games: flex!.wins + flex!.losses,
        tier: flex!.tier,
        rank: flex!.rank,
        lp: flex!.leaguePoints
      }
    });
  }

  private compareRank(currentSnapshot: WatchedAccountRank, lastSnapshot: WatchedAccountRank): string {
    const snapshotLp = rankToLP(lastSnapshot.tier, lastSnapshot.rank, lastSnapshot.lp);
    const newLp = rankToLP(currentSnapshot.tier, currentSnapshot.rank, currentSnapshot.lp);
    const lpDiff = newLp - snapshotLp;;

    if (lpDiff > 0) {
      return `Up ${lpDiff}`;
    } else if (lpDiff < 0) {
      return `Down ${Math.abs(lpDiff)}`;
    } else if (lpDiff === 0 && currentSnapshot.games > lastSnapshot.games) {
      return "Neutral Gains";
    }

    return "No Change";
  }

  public compareRanks(player: WatchedAccount): void {
    // If there's only 1 entry, then we'll use that for both (showing no change)
    // by defaulting the last index to 0. This state only happens if you just 
    // started using this utility. Otherwise, we'll default the index to the one
    // right before our most recent snapshot (length -2)
    const lastIndex = player.lastRanks.length > 1 ? player.lastRanks.length - 2 : 0;

    // Get the snapshot right before this one, then the most recent snapshot and do comparisons
    const lastSnapshot = player.lastRanks[lastIndex];
    const currentSnapshot = player.lastRanks[player.lastRanks.length - 1];

    this.eventsToLog.soloQueueTracking.push(
      this.messageService.lpChangeMessage(
        player,
        currentSnapshot.soloDuo.tier,
        currentSnapshot.soloDuo.rank,
        currentSnapshot.soloDuo.lp.toString(),
        this.compareRank(currentSnapshot.soloDuo, lastSnapshot.soloDuo)
      )
    );

    this.eventsToLog.flexQueueTracking.push(
      this.messageService.lpChangeMessage(
        player,
        currentSnapshot.flex.tier,
        currentSnapshot.flex.rank,
        currentSnapshot.flex.lp.toString(),
        this.compareRank(currentSnapshot.flex, lastSnapshot.flex)
      )
    );
  }

  public async postUpdateMessage(): Promise<void> {
    await this.discordApi.post(this.messageService.discordBotMessage(this.eventsToLog));
  }
}