import dotenvFlow from 'dotenv-flow';

import { DataStorageService } from "./services/data-storage.service";
import { RankTrackerService } from "./services/rank-tracker.service";

dotenvFlow.config();

const dataStorage = new DataStorageService();
const trackingService = new RankTrackerService();

const playersToWatch = await dataStorage.getHotDogCount();

// Send our message now
await trackingService.postUpdateMessage();

// Handle committing the data to whever we're storing it
await dataStorage.updateUpdateHotDogCount(playersToWatch);

