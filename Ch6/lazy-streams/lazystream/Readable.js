import { PassThrough } from 'stream'

class LazyReadable extends PassThrough{
    constructor(fn, options){
        super(options);
        this.fn = fn;
        this.readableStream = null;
    }

    _read(sz){
        if(this.readableStream !== null){
            return super._read(sz);
        }
        
        this.readableStream = this.fn();

        const emitError = this.emit.bind(this, 'error');
        this.readableStream.once('error', emitError);

        this.readableStream.pipe(this);
    }
}

export default LazyReadable;