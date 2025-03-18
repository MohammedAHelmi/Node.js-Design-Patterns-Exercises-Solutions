import { EventEmitter } from 'events';
import { cancelAtEvent } from './util.js';
import { CancellationError } from '../cancel-error.js';
import { work, workHard } from './nested-operations-example.js';

test("Promise resolves no cancellation", async() => {
    const eventEmitter = new EventEmitter();
    expect(await workHard(eventEmitter)).toBe("Have A Nice Day :)");
});

test("Promise rejects no cancelling", async () => {
    await expect(work(new EventEmitter()))
    .rejects.toThrow(new Error("Tasks are Hard")); 
});

test("Cancelling in the top level function", async () => {
    const fn = async () => {
        const eventEmitter = new EventEmitter();
        const commutingPromise = workHard(eventEmitter);
        cancelAtEvent(eventEmitter, 'extreme focus', commutingPromise);
        await commutingPromise;
    }

    await expect(fn()).rejects.toThrow(CancellationError);
});

test("Cancelling in a nested function", async () => {
    const fn = async () => {
        const eventEmitter = new EventEmitter();
        const commutingPromise = await workHard(eventEmitter);
        cancelAtEvent(eventEmitter, 'working', commutingPromise);
        await commutingPromise;
    }
    
    await expect(fn()).rejects.toThrow(CancellationError);
});


test("Cancelling in a deeply nested function", async () => {
    const fn = async () => {
        const eventEmitter = new EventEmitter();
        const commutingPromise = await workHard(eventEmitter);
        cancelAtEvent(eventEmitter, 'alarm', commutingPromise);
        await commutingPromise;
    }
    
    await expect(fn()).rejects.toThrow(CancellationError);
});