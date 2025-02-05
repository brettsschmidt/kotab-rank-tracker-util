import axios from "axios";

export class DiscordWebhookAPIService {
  private discordWebhookURL = process.env["DiscordWebhook"] as string;

  public async post(message: string) {
    console.log("Posting discord message on webhook");
    console.log(message);
    await axios.post(this.discordWebhookURL, {content: message});
  }
}