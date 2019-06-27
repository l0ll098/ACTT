import { Router } from "express";

import { validateFirebaseIdToken } from "../../shared/helpers";

import { deleteLapTimeValidators, deleteLapTime } from "./functions/deleteLapTime";
import { getLapTimesValidators, getLapTime, getLapTimeByIdValidators, getLapTimeById } from "./functions/getLapTimes";
import { newLapTime, newLapTimeValidators } from "./functions/newLapTime";
import { upgradeLapTimeValidators, upgradeAllLapTimes, upgradeLapTime } from "./functions/upgradeLapTime";

const lapTimesRouter = Router();

// Create an alias, it will be reachable with and without the /new piece
lapTimesRouter.post(["/lapTimes", "/lapTimes/new"], validateFirebaseIdToken, ...newLapTimeValidators, newLapTime);
lapTimesRouter.post("/lapTimes/upgrade", validateFirebaseIdToken, ...upgradeLapTimeValidators, upgradeLapTime);
lapTimesRouter.post("/lapTimes/upgradeAll", validateFirebaseIdToken, upgradeAllLapTimes);
lapTimesRouter.get("/lapTimes", validateFirebaseIdToken, ...getLapTimesValidators, getLapTime);
lapTimesRouter.get("/lapTimes/:id", validateFirebaseIdToken, ...getLapTimeByIdValidators, getLapTimeById);
lapTimesRouter.delete("/lapTimes/:id?", validateFirebaseIdToken, ...deleteLapTimeValidators, deleteLapTime);

export { lapTimesRouter };
