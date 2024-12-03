import { EventEmitter } from 'events'
import { readdir, readFile } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

class TaskQueue extends EventEmitter{
    #running
    #tasks
    #concurency
    constructor(concurency){
        super()
        this.#running = 0
        this.#tasks = []
        this.#concurency = concurency
    }
    push(task){
        this.#tasks.push(task)
        process.nextTick(this.#next.bind(this))
        return this
    }
    #next(){
        if(this.#tasks.length === 0 && this.#running === 0)
            return this.emit('empty')

        while(this.#running < this.#concurency && this.#tasks.length > 0){
            const task = this.#tasks.shift()
            task((err)=>{
                if(err)
                    this.emit('error', err)
                this.#running--
                process.nextTick(this.#next.bind(this))
            })
            this.#running++
        }
    }
}

const recursiveDirTask = function(dir, keyword, queue, matchFiles, next){
    readdir(dir, {withFileTypes:true}, (err, files)=>{
        if(err)
            return next(err)

        files
        .filter(file=>!file.isDirectory())
        .map(file=>join(dir, file.name))
        .forEach(fileName => queue.push((next) =>
            readFile(fileName, (err, data)=>{
                if(err)
                    return next(err)
                if(data.toString().includes(keyword))
                    matchFiles.push(fileName)
                next()
            })
        ));

        files
        .filter(file=>file.isDirectory())
        .map(file=>join(dir, file.name))
        .forEach(subdir => queue.push(recursiveDirTask.bind(null, subdir, keyword, queue, matchFiles)));

        next()
    })
}

const recursiveFind = function(dir, keyword, cb){
    const taskQueue = new TaskQueue(1)
    const matchFiles = []
    taskQueue
    .push(recursiveDirTask.bind(null, dir, keyword, taskQueue, matchFiles))
    .on('error', (err)=>cb(err))
    .on('empty', ()=>cb(matchFiles))
}

console.time("Timer")
recursiveFind(dirname(dirName), 'foo', (files)=>{
    console.timeEnd("Timer")
    console.log(files)
})
