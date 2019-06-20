// Doing so, it will import only the code really needed, based on the function name
switch (process.env.FUNCTION_NAME) {
    case "ssr":
        exports.ssr = require("./triggers/ssr");
        break;
    case "api":
        exports.api = require("./triggers/api");
        break;
    default:
        console.log(`process.env.FUNCTION_NAME was not recognized. Exporting all functions`);

        exports.ssr = require("./triggers/ssr").ssr;
        exports.api = require("./triggers/api").api;
}
