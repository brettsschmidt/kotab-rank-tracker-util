import axios from "axios";
import { DiscordMessage } from "../interfaces/discord-message.interface";

export class DiscordWebhookAPIService {
  private discordWebhookURL = process.env["DiscordWebhook"] as string;

  public async post(message: DiscordMessage): Promise<void> {
    await axios.post(this.discordWebhookURL, message);
  }
}