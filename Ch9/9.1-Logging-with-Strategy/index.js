import File from "./File.js";
import Logger from "./logger.js";

//logging into file
const file = new File('logging-file');

let logger = new Logger(file, {
    info: false
});

logger.info('some info');
logger.warn('some warn');
logger.error('some error');
logger.debug('some debugging');


//logging to console
logger = new Logger(console, {
    info: false
});

logger.info('some info');
logger.warn('some warn');
logger.error('some error');
logger.debug('some debugging');
