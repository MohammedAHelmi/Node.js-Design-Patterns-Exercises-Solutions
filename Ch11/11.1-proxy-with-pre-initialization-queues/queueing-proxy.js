/**
 * 
 * @param {Object} obj 
 * @param {string[]} methodNames
 * @param {string} event 
 * @returns {Proxy}
 */
function queueingProxyFactory(obj, methodNames, event){
    let waitingQueue = [];
    let isEventTriggered = false;

    obj.once(event, () => {
        isEventTriggered = true;
        waitingQueue.forEach(waitingFn => waitingFn());
        waitingQueue = null;
    });

    return new Proxy(obj, {
        get(target, prop, receiver){
            const value = target[prop];

            if(typeof value !== 'function')
                return value;

            return function(...args){
                if(this !== receiver) // the caller is not the proxied object
                    return value.apply(this, args)

                if(!methodNames.includes(prop)) // not one of the proxied functions
                    return value.apply(target, args)
                
                if(isEventTriggered)
                    return Promise.resolve(value.apply(target, args)); // To Avoid Zalgo

                console.log(`\x1b[32mQueueing ${prop} call for "${args}"\x1b[0m`);
                return new Promise((resolve, reject) => {
                    waitingQueue.push(() => {
                        Promise
                        .resolve(value.apply(target, args))
                        .then(resolve, reject);
                    });
                });
            }
        }
    })
}

export default queueingProxyFactory;