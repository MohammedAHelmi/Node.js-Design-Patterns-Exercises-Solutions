import Logger from "./Logger.js";

class ConsoleLogger extends Logger{
    async _log(msg){
        console.log(msg);
    }
}

export default ConsoleLogger;