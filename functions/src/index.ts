// * Enum value have to match file and const name
enum Functions {
    Ping = "ping",
    Ssr = "ssr",
    Api = "api",
    NewUser = "newUser"
};

// Foreach entry in the enum
Object.keys(Functions).forEach((key: string) => {
    // get its value
    const fnName = Functions[key as any];
    // If process.env.FUNCTION_NAME is not defined or it's equal to the function name we are examinating 
    if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === fnName) {
        // export it.
        // * Doing so, it will import only the code really needed, based on the function name
        exports[fnName] = require(`./triggers/${fnName}`)[fnName];
    }
});
