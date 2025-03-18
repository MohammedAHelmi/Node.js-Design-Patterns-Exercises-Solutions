import { EventEmitter } from 'events';

class Logger extends EventEmitter{
    info(msg){
        console.info(`\x1b[36m${msg}\x1b[0m`);
    }

    error(msg){
        console.error(`\x1b[31m${msg}\x1b[0m`);
    }
}

export default Logger;