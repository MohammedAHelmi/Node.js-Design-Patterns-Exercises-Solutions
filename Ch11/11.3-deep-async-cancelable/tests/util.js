export const cancelAtEvent = (eventEmitter, eventName, promise) => {
    const eventListener = (actionName) => {
        if(actionName === eventName)
            promise.cancel();
        eventEmitter.off(eventListener);
    }
    eventEmitter.on('action', eventListener);
} 