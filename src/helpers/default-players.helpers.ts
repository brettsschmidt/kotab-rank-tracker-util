import { WatchedAccount } from "../interfaces/watched-account.interface";

/**
 * This is to be used for seed data
 * @returns An array of default watched accounts
 */
export function getDefaultPlayers(): Array<WatchedAccount> {
  return [
    fromOnlyName("Slikayce", "NA1"),
    fromOnlyName("The Holy Vible", "001"),
    fromOnlyName("Pisi", "NA1"),
    fromOnlyName("GG l AM INTING", "NA1"),
    fromOnlyName("Corey", "NA3"),
  ]
}

function fromOnlyName(name: string, tagLine: string): WatchedAccount {
  return {
    gameName: name,
    tagLine: tagLine,
    lastRanks: [],
    puuid: "",
    summonerId: ""
  };
}