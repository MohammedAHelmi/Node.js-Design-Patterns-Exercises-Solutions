const { createGzip, createBrotliCompress, createDeflate } = await import('zlib');
const { createReadStream } = await import('fs');
const { Transform, pipeline } = await import('stream')
const fs = await import('fs');

const getMeasures = (filePath, compressionAlgoFn) => {
    const measureStream = new Transform({
        objectMode: false,
        transform(chunk, enc, cb){
            this.totalSize = this.totalSize ?? 0;
            this.totalSize += chunk.length;
            cb();
        },
    });

    return new Promise((accept, reject) => {
        const start = performance.now()
        pipeline(
            createReadStream(filePath), 
            compressionAlgoFn(),
            measureStream,
            (err) => {
                if(err) return reject(err);
                const end = performance.now();

                accept([end-start, measureStream.totalSize]);
            }
        );
    });
} 


const filePath = process.argv[2]; //change this if you are going to run from terminal
const stats = fs.statSync(filePath);
console.log(`Original Path size is: ${stats.size}`)


const algos = {
    'Gzip': createGzip,
    'Brotli': createBrotliCompress,
    'Deflate': createDeflate
}

const promises = [];
const result = {};
for (const [name, fn] of Object.entries(algos)) {
    const p = getMeasures(filePath, fn)
        .then((results) => {
            const [time, size] = results;
            result[name] = { 
                time: `${time/1000} sec(s)`,
                size: `${size} btye(s)` 
            };
        })
        .catch(err => console.error(err));

    promises.push(p);
}

await Promise.all(promises);
console.table(result);