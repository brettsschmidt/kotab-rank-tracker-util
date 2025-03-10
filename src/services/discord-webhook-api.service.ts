import axios from "axios";
import { DiscordMessage } from "../interfaces/discord-message.interface";

export class DiscordWebhookAPIService {
  private discordWebhookURL = "https://discord.com/api/webhooks/1348720647332954152/WnYJCQ21aDtot-t-Smo_-NkU0zsihzBqG8z7wLuC3Rlc_37TGmt5o2Jgwp5iF7OXW2pS" as string;

  public async post(message: DiscordMessage): Promise<void> {
    await axios.post(this.discordWebhookURL, message);
  }
}