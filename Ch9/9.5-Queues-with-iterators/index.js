import AsyncQueue from "./AsyncQueue.js";

const returnNumAfterSecs = (num, secs) => new Promise(resolve => setTimeout(() => resolve(num), secs*1000));

const consumeTaskResult = async (asyncQueue, label) => {
    for await (const result of asyncQueue){
        console.log(`${label}: ${result}`)
    }
    console.log(`end of ${label}`);
}

const asyncQueue = new AsyncQueue();
for(let i = 1; i <= 12; i++){
    asyncQueue.enqueue(returnNumAfterSecs.bind(null, i, 2));
}
asyncQueue.done(); // if this is commented out node will terminate even though the iterators are bending (try it yourself with and without commenting and notice the difference) because nothing will keep the event loop alive.
// asyncQueue.enqueue(returnNumAfterSecs.bind(null, 20, 1)); // uncommenting this will cause an error if the previous line is not commented out

consumeTaskResult(asyncQueue, 'fn 1');
consumeTaskResult(asyncQueue, 'fn 2');
consumeTaskResult(asyncQueue, 'fn 3');
consumeTaskResult(asyncQueue, 'fn 4');