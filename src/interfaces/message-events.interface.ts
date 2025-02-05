import { RankChangeInfo } from "./rank-change-info.interface";

export interface MessageEvents {
  general: Array<string>;
  soloQueueTracking: Array<RankChangeInfo>;
  flexQueueTracking: Array<RankChangeInfo>;
}
