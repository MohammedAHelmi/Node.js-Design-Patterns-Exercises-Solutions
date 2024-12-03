import timestampedConsole from "./timestamped-console.js";

timestampedConsole.log('Hi There');

timestampedConsole.info('some info');

timestampedConsole.error('A random error just to annoy you');

timestampedConsole.debug('Debugging the error');

timestampedConsole.table({message: `This shouldn't be timestamped` });