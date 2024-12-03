import { PassThrough } from 'stream'

class LazyWritable extends PassThrough{
    constructor(cb){
        super();
        this.cb = cb;
        this.wasConsumed = false;
        this.writableStream = null;
    }

    _write(chunk, enc, cb){
        if(!this.wasConsumed){
            this.wasConsumed = true;
            this.writableStream = this.cb();
        }

        const shouldContinue = this.writableStream.write(chunk, enc);

        //handling backpressure
        if(!shouldContinue) return this.writableStream.once('drain', cb);
        
        cb();
    }
}

export default LazyWritable;