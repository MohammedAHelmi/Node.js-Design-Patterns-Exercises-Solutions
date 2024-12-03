import { createReadStream } from 'fs';
import { randomBytes, createCipheriv, scryptSync } from 'crypto';
import { connect } from 'net'
import { basename } from 'path';
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';

const createPacketFormatter = (fileId) => new Transform({
        objectMode: true,
        transform(chunk, enc, cb){
            const outBuff = Buffer.alloc(1+4+chunk.length);
            
            outBuff.writeUInt8(fileId, 0);
            outBuff.writeUInt32BE(chunk.length, 1);
            chunk.copy(outBuff, 5);
            
            this.push(outBuff);
            cb();
        }
    });

const sendFilesNumber = (filesNum, dest) => {
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(filesNum);
    dest.write(buffer);
} 

const sendFilesNamesAndIDs = async (files, dest) => {
    const src = Readable.from(files.entries());

    const formatPacket = new Transform({
        objectMode: true,
        transform(chunk, enc, cb){
            let [idx, name] = chunk;
            name = Buffer.from(basename(name));

            const outBuff = Buffer.alloc(1+4+name.length);
            outBuff.writeInt8(idx, 0);
            outBuff.writeInt32BE(name.length, 1);
            name.copy(outBuff, 5);

            this.push(outBuff);
            cb();
        }
    });

    await pipeline(
        src,
        formatPacket,
        dest,
        { end: false }
    );
}

const sendFiles = async function(filesPathes, password, dest){
    //send files' number
    sendFilesNumber(filesPathes.length, dest);

    //send each file ID (index) / name.size / name
    await sendFilesNamesAndIDs(filesPathes, dest);

    //create IV & send it
    const iv = randomBytes(16);
    dest.write(iv);

    //encrypt password
    password = scryptSync(password, 'salt', 24);

    //send files
    let filesNum = filesPathes.length;
    filesPathes.forEach(async (path, idx) => {
        try{
            await pipeline(
                createReadStream(path),
                createCipheriv('aes192', password, iv),
                createPacketFormatter(idx),
                dest,
                { end: false },
            );
        }
        catch(err){
            console.error(`Error at ${path}: ${err}`);
        }
        finally{
            if(--filesNum === 0) 
                dest.end();
        }
    });
}

const socket = connect(9000, "41.34.12.187", () => {
    try{
        sendFiles(process.argv.slice(3), process.argv[2], socket);
    }
    catch(err){
        console.error(err);
        socket.end();
    }
});