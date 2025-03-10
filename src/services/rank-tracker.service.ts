import { rankToLP } from "../helpers/rank.helpers";
import { MessageEvents } from "../interfaces/message-events.interface";
import { RankChangeDirection, RankChangeInfo } from "../interfaces/rank-change-info.interface";
import { DiscordWebhookAPIService } from "./discord-webhook-api.service";
import { MessageHelperService } from "./message-helper.service";

export class RankTrackerService {

  public discordApi: DiscordWebhookAPIService = new DiscordWebhookAPIService();
  public messageService: MessageHelperService = new MessageHelperService();

  public async postUpdateMessage(): Promise<void> {
    await this.discordApi.post({embeds: [{title: "Hot Dog Counter", fields: [{
      name: `Matt`,
      value: "20 weiners this week",
      inline: true
    }, {
      name: `Crew`,
      value: "Some amount of hot dogs",
      inline: true
    }]}]});
  }
}