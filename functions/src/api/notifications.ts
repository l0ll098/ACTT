import { Router } from "express";

import { validateFirebaseIdToken } from "../../shared/helpers";
import { getNotifications, markNotificationAsReadValidators, markNotificationAsRead, getNotificationByIdValidators, getNotificationById } from "./functions/notifications";


const notificationsRouter = Router();

notificationsRouter.get("/notifications", validateFirebaseIdToken, getNotifications);
notificationsRouter.get("/notifications/:id", validateFirebaseIdToken, ...getNotificationByIdValidators, getNotificationById);
notificationsRouter.post("/notifications/:id", validateFirebaseIdToken, ...markNotificationAsReadValidators, markNotificationAsRead);

export { notificationsRouter };
