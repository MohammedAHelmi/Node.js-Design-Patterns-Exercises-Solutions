export default new Proxy(console, {
    get: (target, prop) => {
        if(!['log', 'error', 'debug', 'info'].includes(prop))
            return target[prop];
        
        return (...args) => target[prop].call(target, new Date(), ...args); 
    }
})