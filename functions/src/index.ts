// Doing so, it will import only the code really needed, based on the function name
switch (process.env.FUNCTION_NAME) {
    case "ssr":
        exports.ssr = require("./triggers/ssr");
    case "api":
        exports.api = require("./triggers/api");
        break;
    default:
        console.log(`Unrecognized function '${process.env.FUNCTION_NAME}'`);
}
