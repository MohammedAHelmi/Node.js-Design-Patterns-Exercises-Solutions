import { PassThrough } from 'stream'

class LazyWritable extends PassThrough{
    constructor(fn, options){
        super(options);
        this.fn = fn;
        this.wasConsumed = false;
        this.writableStream = null;
    }

    _write(chunk, enc, cb){
        if(this.writableStream === null){
            this.writableStream = this.fn();
        }

        const shouldContinue = this.writableStream.write(chunk, enc);

        //handling backpressure
        if(!shouldContinue) return this.writableStream.once('drain', cb);
        
        cb();
    }
}

export default LazyWritable;