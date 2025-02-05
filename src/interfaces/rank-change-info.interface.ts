import { WatchedAccount, WatchedAccountRank } from "./watched-account.interface";

export type RankChangeDirection = "up" | "down" | "none";

export interface RankChangeInfo {
  player: WatchedAccount,
  currentSnapshot: WatchedAccountRank,
  gamesPlayed: number,
  changeMessage: string,
  changeAmount: number,
  changeDirection: RankChangeDirection,
}