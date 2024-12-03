class TaskQueue{
    #queue
    #running
    #concurrency
    constructor(concurrency){
        this.#queue = []
        this.#running = 0
        this.#concurrency = concurrency
    }
    #next(){
        while(this.#running < this.#concurrency && this.#queue.length){
            const task = this.#queue.shift()
            task().then(()=>{
                this.#running--
                this.#next()
            })
            this.#running++
        }
    }
    runTask(task){
        return new Promise((resolve, reject)=>{
            this.#queue.push(async ()=>{
                try{
                    await task()
                    resolve()
                }
                catch(err){
                    reject(err)
                }
            })
            process.nextTick(this.#next.bind(this))
        })
    }
}

const delayFun = (delay=1) => new Promise(resolve => setTimeout(()=>{
    console.log(`After Delay`)
    resolve()
}, delay*1000))
const rejectFun = ()=>Promise.reject('A random error just to annoy you')


const taskQueue = new TaskQueue(2)

taskQueue
.runTask(delayFun)
.then(()=>console.log('Task completed successfully'))

taskQueue
.runTask(delayFun.bind(null, 2))
.then(()=>console.log('Task completed successfully'))

taskQueue
.runTask(delayFun.bind(null, 3))
.then(()=>console.log('Task completed successfully'))

taskQueue
.runTask(rejectFun)
.catch(()=>console.log('Task rejected'))

taskQueue
.runTask(rejectFun)
.catch(()=>console.log('Task rejected'))
