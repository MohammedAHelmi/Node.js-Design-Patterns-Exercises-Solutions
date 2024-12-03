import FileLogger from "./loggers/FileLogger.js";
import ConsoleLogger from "./loggers/ConsoleLogger.js";

const fileLogger = new FileLogger('logging-file', { info: false });
fileLogger.info('some info');
fileLogger.warn('some warning');
fileLogger.error('some error');
fileLogger.debug('some debugging');

const consoleLogger = new ConsoleLogger({ info: false });
consoleLogger.info('some info');
consoleLogger.warn('some warning');
consoleLogger.error('some error');
consoleLogger.debug('some debugging');