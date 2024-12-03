import { createWriteStream } from "fs";
import { createDecipheriv, scryptSync } from "crypto";
import { createServer } from "net";
import { join, basename } from "path";

const recieveFilesCount = (socket) => {
    let resolve = null;
    const countPromise = new Promise(res => resolve = res);

    const onReadable = () => {
        const chunk = socket.read(1);
        
        if(!chunk) return;
        resolve(chunk.readUInt8(0));

        socket.off('readable', onReadable);
    }

    socket.on('readable', onReadable);

    return countPromise;
};

const recieveFileName = (socket) => {
    let currentFile = null;
    let fileNameSize = null;
    let fileName = null;

    let resolve;
    const fileNameAndIdPromise = new Promise(accept => resolve = accept); 

    const onReadable = () => {
        let chunk;

        if(currentFile === null){
            chunk = socket.read(1);

            if(!chunk) return;
            currentFile = chunk && chunk.readUInt8(0);
        }

        if(fileNameSize === null){
            chunk = socket.read(4);

            if(!chunk) return;
            fileNameSize = chunk.readUInt32BE(0);
        }

        chunk = socket.read(fileNameSize);

        if(!chunk) return;
        fileName = chunk.toString();

        socket.off("readable", onReadable);

        resolve([currentFile, fileName]);
    }

    socket.on('readable', onReadable);

    return fileNameAndIdPromise;
};

const recieveFilesNames = async (socket, count) => {
    const filesArr = new Array(count);
    for(let i = 0; i < count; i++){
        const [idx, name] = await recieveFileName(socket);
        filesArr[idx] = name;
    }
    return filesArr;
};

const recieveIV = async (socket) => {
    let resolve
    const ivPromise = new Promise(accept => resolve = accept);

    const onReadable = () => {
        const chunk = socket.read(16);

        if(!chunk) return;
        resolve(chunk);

        socket.off("readable", onReadable);
    }

    socket.on("readable", onReadable)
    
    return ivPromise;
}

const getWriteStreams = (fileNamesArr, password, iv) => fileNamesArr.map((fileName) => {
    const decipher = createDecipheriv('aes192', password, iv);

    decipher
    .pipe(createWriteStream( join('./recieved-files', basename(fileName)) ));

    return decipher;
});

const demux = (socket, fileStreams) => {
    let currentFile = null;
    let bufferSize = null;
    socket
    .on('readable', () => {
        let chunk;

        if(currentFile === null){
            chunk = socket.read(1);

            if(!chunk) return;
            currentFile = chunk.readUInt8(0);
        }

        if(bufferSize === null){
            chunk = socket.read(4);

            if(!chunk) return;
            bufferSize = chunk.readUInt32BE(0);
        }

        chunk = socket.read(bufferSize);

        if(!chunk) return;
        fileStreams[currentFile].write(chunk);
        
        currentFile = null;
        bufferSize = null;
    })
    .on('end', () => { 
        fileStreams.forEach(stream => stream.end());
        console.log(`Channeled is closed`)
    });
};

const recieveFiles = async (socket) => {
    socket.on('end', () => console.log('socket ended'));
    
    const count = await recieveFilesCount(socket);
    const fileNamesArr = await recieveFilesNames(socket, count);
    const password = scryptSync(process.argv[2], 'salt', 24);
    const iv = await recieveIV(socket);
    const writeStreams = getWriteStreams(fileNamesArr, password, iv);
    demux(socket, writeStreams);
};

const server = createServer(recieveFiles);
server.listen(9000, () => console.log(`server started...`))