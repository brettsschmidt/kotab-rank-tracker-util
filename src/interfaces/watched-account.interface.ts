export interface WatchedAccount {
  gameName: string;
  tagLine: string;
  puuid: string;
  summonerId: string;

  lastRanks: Array<{
    date: Date,
    soloDuo: WatchedAccountRank,
    flex: WatchedAccountRank
  }>
}

export interface WatchedAccountRank {
  wins: number;
  losses: number;
  games: number;
  tier: string;
  rank: string;
  lp: number;
}
