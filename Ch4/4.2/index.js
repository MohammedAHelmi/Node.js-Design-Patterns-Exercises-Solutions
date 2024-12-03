import {readdir} from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

const listNestedFiles = function(dir, cb){
    readdir(dir, {withFileTypes:true}, (err, files)=>{
        if(err)
            return cb(err)

        const subdirs = files.filter(file=>file.isDirectory()).map(file=>join(dir, file.name))
        const dirFiles = files.filter(file=>!file.isDirectory()).map(file=>join(dir, file.name))
        
        if(subdirs.length === 0)
            return cb(null, dirFiles)

        let completed = 0
        let errorHappened = false
        subdirs.forEach(subdir=>listNestedFiles(subdir, (err, subdirFiles)=>{
            if(err && !errorHappened){
                errorHappened = true
                return cb(err)
            }
            dirFiles.push(...subdirFiles)
            if(++completed == subdirs.length && !errorHappened)
                return cb(null, dirFiles)
        }))
    })
}

listNestedFiles(dirname(dirName), (err, files)=>console.log(err?err:files))