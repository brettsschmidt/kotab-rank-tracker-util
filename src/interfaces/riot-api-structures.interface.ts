export interface ByRiotIdResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface ByPuuidResponse {
  id: string;
  accountId: string;
  // Has other stuff we don't care about
}

export interface Ranking {
  leagueId: string,
  queueType: string,
  tier: string,
  rank: string,
  summonerId: string,
  leaguePoints: number,
  wins: number,
  losses: number,
}
