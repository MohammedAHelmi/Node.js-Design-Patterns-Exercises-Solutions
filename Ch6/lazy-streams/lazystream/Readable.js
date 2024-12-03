import { PassThrough } from 'stream'

class LazyReadable extends PassThrough{
    constructor(fn){
        super();
        this.fn = fn;
        this.wasConsumed = false;
    }

    _read(){
        if(this.wasConsumed) return;
        this.wasConsumed = true;
        
        
        const readableStream = this.fn();

        const emitError = this.emit.bind(this, 'error');
        readableStream.on('error', emitError);
        
        readableStream.pipe(this);
    }
}

export default LazyReadable;