import { randomBytes } from "crypto";
import { Readable } from 'stream';
import { createWriteStream } from "fs";

const generatorStream = new Readable({
    read(size){
        if(typeof this.totalWrittenSize === "undefined") this.totalWrittenSize = 0;
        if(this.totalWrittenSize >= 10_000_000) return this.push(null);

        this.push(randomBytes(size));
        this.totalWrittenSize += size;
    }
});

generatorStream
.pipe(createWriteStream('./big-file'));