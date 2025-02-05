import moment from "moment";
import { MessageEvents } from "../interfaces/message-events.interface";
import { WatchedAccount } from "../interfaces/watched-account.interface";

export class MessageHelperService {
  public nameChangeMessage(oldPlayer: WatchedAccount, newPlayer: WatchedAccount): string {
    return `${oldPlayer.gameName}#${oldPlayer.tagLine} changed their name to ${newPlayer.gameName}#${newPlayer.tagLine}`;
  }

  public lpChangeMessage(player: WatchedAccount, tier: string, rank: string, lp: string, change: string): string {
    return `${player.gameName}#${player.tagLine}: ${tier} ${rank} ${lp} (${change})`;
  }

  public addSection(currentMessage: string, heading: string, contents?: string | Array<string>): string {
    let finalContents: string = "";
    const messageParts: Array<string> = [];
    
    if (contents != null) {
      finalContents = typeof contents !== "string" ? contents.join("\n") : contents;
    }

    if (currentMessage.length > 0) {
      messageParts.push(`${currentMessage}\n`);
      messageParts.push(`__**${heading}**__`);
    } else {
      messageParts.push("-Rank Update\n");
      messageParts.push(`__**${heading}**__`);
      return messageParts.join("");
    }

    if (finalContents.length > 0) {
      messageParts.push(`${finalContents}`);
    }

    return messageParts.join(`\n`);
  }

  public discordBotMessage(eventMessages: MessageEvents): string {
    let message = this.addSection("", moment(new Date()).format("MM/DD/YYYY"));

    if (eventMessages.general.length > 0) {
      message = this.addSection(message, "General Events", eventMessages.general);
    }

    message = this.addSection(message, "Solo Duo Ranks", eventMessages.soloQueueTracking);
    message = this.addSection(message, "Flex Ranks", eventMessages.flexQueueTracking);

    return message;
  }
}