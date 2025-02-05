import dotenvFlow from 'dotenv-flow';

import { DataStorageService } from "./services/data-storage.service";
import { RankTrackerService } from "./services/rank-tracker.service";

dotenvFlow.config();

const dataStorage = new DataStorageService();
const trackingService = new RankTrackerService();

const playersToWatch = await dataStorage.getAccountsToWatch();

// Update our data and do LP comparisons
for (const player of playersToWatch) {
  // Handle getting all of the information we need to get rank info from Riot's APIs
  // Also handle name changes
  await trackingService.updateBasicSummonerInfo(player);

  // Handle getting the latest rank information for solo duo and flex
  await trackingService.updateRanks(player);
  
  // Do the comparisons and generate the LP diff messages
  trackingService.compareRanks(player);
}

// Send our message now
await trackingService.postUpdateMessage();

// Handle committing the data to whever we're storing it
await dataStorage.updateAccountsToWatch(playersToWatch);

