import { Router } from "express";

import { validateFirebaseIdToken } from "../../shared/helpers";
import { getNotifications, markNotificationAsReadValidators, markNotificationAsRead } from "./functions/notifications";


const notificationsRouter = Router();

notificationsRouter.get("/notifications", validateFirebaseIdToken, getNotifications);
notificationsRouter.post("/notifications/:id", validateFirebaseIdToken, ...markNotificationAsReadValidators, markNotificationAsRead);

export { notificationsRouter };
