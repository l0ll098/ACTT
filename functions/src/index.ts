// Expose Express API as a single Cloud Function:
module.exports.api = require("./triggers/api").api;

// SSR function
module.exports.ssr = require("./triggers/ssr").ssr;

module.exports.newUser = require("./triggers/newUser").newUser;
module.exports.ping = require("./triggers/ping").ping;
