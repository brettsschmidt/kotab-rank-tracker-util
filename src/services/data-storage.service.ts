import { getDefaultPlayers } from "../helpers/default-players.helpers";
import { HotDogCounter } from "../interfaces/hot-dog-counter.interface";
import fs from "fs/promises";

export class DataStorageService {
  private jsonFilePath = "./src/data/hot-dog-data.json";

  public async getHotDogCount(): Promise<HotDogCounter> {
    try {
      await fs.access(this.jsonFilePath, fs.constants.F_OK);

      return JSON.parse(await fs.readFile(this.jsonFilePath, "utf-8")) as HotDogCounter;
    } catch (ex) {
      console.warn("Failed to get data from JSON. Seeding default")

      throw("bad");
    }
  }

  public async updateUpdateHotDogCount(hotDogCounter: HotDogCounter): Promise<void> {
    return await fs.writeFile(this.jsonFilePath, JSON.stringify(hotDogCounter, null, 2), "utf-8");
  }
}
