import { https } from "firebase-functions";
import { sendOK } from "../../shared/helpers";

export const ping = https.onRequest((req, res) => {
    return sendOK(res, { msg: "pong" });
});
