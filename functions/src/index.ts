// Expose Express API as a single Cloud Function:
export { api } from "./triggers/api";
// module.exports.api = require("./triggers/api");

// SSR function
export { ssr } from "./triggers/ssr";
// module.exports.ssr = require("./triggers/ssr");
