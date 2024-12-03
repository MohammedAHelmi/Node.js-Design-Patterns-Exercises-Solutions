import LoggingMiddleWare from "./LoggingMiddleware.js";
import { writeFileSync } from 'fs'

const loggingMW = new LoggingMiddleWare();

const serialize = (msg) => {
    if(typeof msg === 'string') return msg;
    if(typeof msg === "object") return JSON.stringify(msg);
    return String(msg);
}

loggingMW.use(serialize)
loggingMW.use((msg) => writeFileSync('logging-file', `${msg}\n`, { flag: 'a' }));

loggingMW.log(`what's up`)
loggingMW.log(5);
loggingMW.log({ a: 4 })