import { toCancellableAsync } from '../to-cancellable-async.js';

const sleep = (sec) => new Promise(resolve => setTimeout(resolve), sec*1000);

const wakeUp = toCancellableAsync(function*(eventEmitter){
    eventEmitter.emit('action', 'alarm');
    yield sleep(2);
    eventEmitter.emit('action', 'wake up');
    yield sleep(2);
    eventEmitter.emit('action', 'ponder');
});

const morningRoutine = toCancellableAsync(function*(eventEmitter){
    yield wakeUp(eventEmitter);
    yield sleep(1);
    eventEmitter.emit('action', 'shower');
});

export const commute = toCancellableAsync(function*(eventEmitter){
    yield morningRoutine(eventEmitter);
    eventEmitter.emit('action', 'heading to work');
    yield sleep(3);
    eventEmitter.emit('action', 'arrived');
});

export const work = toCancellableAsync(function*(eventEmitter){
    yield commute(eventEmitter);
    eventEmitter.emit('action', 'working');
    throw new Error("Tasks are Hard")
});

export const workHard = toCancellableAsync(function*(eventEmitter){
    try{
        yield work(eventEmitter);
    }catch(err){
        eventEmitter.emit('action', 'extreme focus');
    }
    return "Have A Nice Day :)";
});
