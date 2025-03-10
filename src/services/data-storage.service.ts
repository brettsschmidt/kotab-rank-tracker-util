import { getDefaultPlayers } from "../helpers/default-players.helpers";
import { WatchedAccount } from "../interfaces/watched-account.interface";
import fs from "fs/promises";

export class DataStorageService {
  private jsonFilePath = "./src/data/hot-dog-data.json";

  public async getAccountsToWatch(): Promise<Array<WatchedAccount>> {
    try {
      await fs.access(this.jsonFilePath, fs.constants.F_OK);

      return JSON.parse(await fs.readFile(this.jsonFilePath, "utf-8")) as Array<WatchedAccount>;
    } catch (ex) {
      console.warn("Failed to get data from JSON. Seeding default")

      return getDefaultPlayers();
    }
  }

  public async updateAccountsToWatch(playersToWatch: Array<WatchedAccount>): Promise<void> {
    return await fs.writeFile(this.jsonFilePath, JSON.stringify(playersToWatch, null, 2), "utf-8");
  }
}
