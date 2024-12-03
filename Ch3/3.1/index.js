import {EventEmitter} from 'events'
import {readFile} from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

class FindRegex extends EventEmitter{
    constructor(regex){
        super()
        this.regex = regex
        this.files = []
    }

    addFile(file){
        this.files.push(file)
        return this
    }

    find(){
        process.nextTick(()=>this.emit('start-finding', this.files))
        for(const file of this.files){
            readFile(file, 'utf8', (err, data)=>{
                if(err)
                    return this.emit('error', err)
    
                this.emit('fileread', file)
                const match = data.match(this.regex)
                if(match)
                    match.forEach(elem => this.emit('found', file, elem))
            })
        }
        return this
    }
}
const findRegexInstance = new FindRegex(/hello \w+/g)
findRegexInstance
.addFile(`${dirName}/file1.txt`)
.addFile(`${dirName}/file2.txt`)
.find()
.on('found', (file, match)=>console.log(`Matched "${match}" in file ${file}`))
.on('error', err=>console.error(`Error emitted ${err.message}`))
.on('start-finding', files=>console.log(`files are ${files}`))