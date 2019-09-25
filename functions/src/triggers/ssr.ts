import { https } from 'firebase-functions';

const universal = require(`../../dist/server`).app;

// SSR function
export const ssr = https.onRequest(universal);
