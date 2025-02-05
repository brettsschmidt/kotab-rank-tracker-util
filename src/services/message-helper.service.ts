import moment from "moment";
import { WatchedAccount, WatchedAccountRank } from "../interfaces/watched-account.interface";
import { RankChangeInfo } from "../interfaces/rank-change-info.interface";
import { DiscordEmbed, DiscordEmbedField, DiscordMessage } from "../interfaces/discord-message.interface";
import { MessageEvents } from "../interfaces/message-events.interface";
import { capitalizeFirstLetter } from "../helpers/string.helpers";

export class MessageHelperService {
  // These are custom, so we configure via env. They all have defaults that discord supports
  // but you can make them look way better by adding custom ones.
  public gainEmoji: string = process.env["GainEmoji"] as string || ":heavy_plus_sign:";
  public lossEmoji: string = process.env["LossEmoji"] as string || ":small_red_triangle:";
  public neutralEmoji: string = process.env["NeutralEmoji"] as string || ":heavy_minus_sign:";

  public nameChangeMessage(oldPlayer: WatchedAccount, newPlayer: WatchedAccount): string {
    return `${oldPlayer.gameName}#${oldPlayer.tagLine} changed their name to ${newPlayer.gameName}#${newPlayer.tagLine}`;
  }

  public buildRanksMessage(eventMessages: MessageEvents): DiscordMessage {
    return {
      embeds: [
        this.buildQueueEmbedForPlayers("Solo Duo", eventMessages.soloQueueTracking),
        this.buildQueueEmbedForPlayers("Flex Queue", eventMessages.flexQueueTracking),
      ]
    }
  }

  private buildQueueEmbedForPlayers(queueName: string, messages: Array<RankChangeInfo>): DiscordEmbed {
    const fields: Array<DiscordEmbedField> = [];

    messages.forEach((rankChange, idx) => {
      fields.push(this.buildRankEmbedForPlayer(rankChange.player, rankChange));
      if ((idx+1) % 2 === 0 && idx > 0) {
        fields.push({name: "", value: "", inline: false});
      }
    })

    return {
      title: `${queueName} ${moment(new Date()).format("MM/DD/YYYY")}`,
      fields
    };
  }

  private buildRankEmbedForPlayer(player: WatchedAccount, change: RankChangeInfo): DiscordEmbedField {
    return {
      name: `${player.gameName}#${player.tagLine}`,
      value: this.rankDescriptionForPlayer(change),
      inline: true
    };
  }
  
  private rankDescriptionForPlayer(change: RankChangeInfo): string
  {
    let emoji: string = this.neutralEmoji;

    if (change.changeDirection === "up") {
      emoji = this.gainEmoji;
    } else if (change.changeDirection === "down") {
      emoji = this.lossEmoji;
    }

    return `
**Current Rank:** ${capitalizeFirstLetter(change.currentSnapshot.tier)} ${change.currentSnapshot.rank} ${change.currentSnapshot.lp} LP
**Total Games:** ${change.currentSnapshot.games} (${change.currentSnapshot.wins}W/${change.currentSnapshot.losses}L)
**Recent Games:** ${change.gamesPlayed} Games
**${emoji} ${change.changeMessage}:** ${change.changeAmount} LP`;
  }
}