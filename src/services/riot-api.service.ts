import axios, { AxiosResponse } from "axios";
import { ByPuuidResponse, ByRiotIdResponse, Ranking } from "../interfaces/riot-api-structures.interface";

export class RiotAPI {
  public apiKey: string = process.env["RiotAPIKey"] as string;

  public riotApi: string = "";

  public async get<T>(path: string, base: "riot" | "lol" = "lol"): Promise<AxiosResponse<T>> {
    return await axios.get<T>(this.createPath(`${path}`, base));
  }

  public createPath(path: string, base: "riot" | "lol"): string {
    const urlBase = base === "riot" ? "https://americas.api.riotgames.com" : "https://na1.api.riotgames.com";
    return `${urlBase}${path}?api_key=${this.apiKey}`;
  }
  
  public async getBasicInfoByRiotId(summonerName: string, tag: string): Promise<ByRiotIdResponse> {
    return (await this.get<ByRiotIdResponse>(`/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}`, "riot")).data;
  }

  public async getSummonerId(puuid: string): Promise<string> {
    return (await this.get<ByPuuidResponse>(`/lol/summoner/v4/summoners/by-puuid/${puuid}`)).data.id;
  }

  public async getRankedInfo(summonerId: string): Promise<Array<Ranking>> {
    return (await this.get<Array<Ranking>>(`/lol/league/v4/entries/by-summoner/${summonerId}`)).data
  }
}
