import { Router } from "express";

import { validateFirebaseIdToken } from "../../shared/helpers";

import { getDefaultAssists } from "./functions/getDefaultAssists";
import { newDefaultAssistsValidators, newDefaultAssists } from "./functions/newDefaultAssists";


const settingsRouter = Router();

settingsRouter.get("/settings/assists", validateFirebaseIdToken, getDefaultAssists);
settingsRouter.post("/settings/assists", validateFirebaseIdToken, ...newDefaultAssistsValidators, newDefaultAssists);

export { settingsRouter };
