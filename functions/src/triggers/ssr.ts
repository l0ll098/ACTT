import { https } from 'firebase-functions';

const universal = require(`${process.cwd()}/dist/server`).app;

// SSR function
export const ssr = https.onRequest(universal);
// exports = module.exports = https.onRequest(universal);
