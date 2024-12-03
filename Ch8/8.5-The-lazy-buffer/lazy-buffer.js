import { Buffer } from 'buffer';

class LazyBuffer{
    constructor(){
        this.buffer = null;
    }

    instantiateBuffer(size){
        this.buffer = Buffer.alloc(size);
    }
};

export const createLazyBuffer = function(size){
    let buf = new LazyBuffer();

    return new Proxy(buf, {
        get: (target, prop) => {
            if(target.buffer === null && prop.startsWith('write'))
                target.instantiateBuffer(size);

            if(target.buffer === null)
                return null;

            if(typeof target.buffer[prop] === 'function')
                return target.buffer[prop].bind(target.buffer);

            return target.buffer[prop];
        }
    });
}