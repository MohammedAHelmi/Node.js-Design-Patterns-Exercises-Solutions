import {readFile, writeFile} from 'fs'
const writeATDest = function(data, destFile, cb){
    writeFile(destFile, data.join(''), cb)
}
const appendFiles = function(idx, content, sourceFiles, destFile, cb){
    if(idx === sourceFiles.length)
        return writeATDest(content, destFile, cb)
    readFile(sourceFiles[idx], (err, data)=>{
        if(err)
            return cb(err)
        content.push(data)
        appendFiles(idx+1, content, sourceFiles, destFile, cb)
    })
}
const concatFiles = function(sourceFiles, destFile, cb){
    appendFiles(0, [], sourceFiles, destFile, cb);
}
concatFiles(['foo.txt', 'bar.txt'], 'foobar.txt', (err)=>console.log(err?err:'done'))