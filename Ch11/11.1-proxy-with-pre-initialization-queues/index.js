import Logger from "./async-initialized-logger.js";
import queueingProxyFactory from "./queueing-proxy.js";

const proxiedLogger = queueingProxyFactory(new Logger(), ['error'], 'ready');

proxiedLogger.error('That is a Delayed Error ⏰').then(() => console.log(`Error 1 written`));

proxiedLogger.error('Another Delayed Error ⏳').then(() => console.log(`Error 2 written`));

proxiedLogger.info('Some Piece of Information 🤓');

console.log('Getting Ready In 3 Seconds...');
setTimeout(() => {
    proxiedLogger.emit('ready');
    proxiedLogger.error('This Should Never Be Queued ☄️').then(() => console.log(`Error 3 written`));
}, 3*1000);

