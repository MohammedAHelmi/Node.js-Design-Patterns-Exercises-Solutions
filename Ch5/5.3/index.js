class TaskQueuePC{
    #tasks
    #consumers
    constructor(concurrency){
        this.#tasks = []
        this.#consumers = []
        for(let i = 0; i < concurrency; ++i)
            this.#consume()
    }
    async #consume(){
        this.#getNextTask()
        .then(task=>task())
        .catch(err => console.error(`A Task Failed With An Error "${err}"`))
        .finally(()=>{ this.#consume() })
    }
    #getNextTask(){
        return new Promise(resolve=>{
            if(this.#tasks.length)
                return resolve(this.#tasks.shift())
            this.#consumers.push(resolve)
        })
    }
    runTask(task){
        return new Promise((resolve, reject)=>{
            const taskWrapper = ()=>{
                const taskPromise = task()
                taskPromise.then(resolve, reject)
                return taskPromise
            }
            if(this.#consumers.length){
                const consumer = this.#consumers.shift()
                consumer(taskWrapper)
            }
            else{
                this.#tasks.push(taskWrapper)
            }
        })
    }
}

const delayFun = (delay=1) =>new Promise(resolve => setTimeout(()=>resolve(`After Delay`), delay*1000))
const rejectFun = ()=>Promise.reject('A random error just to annoy you')

const taskQueuePC = new TaskQueuePC(1)

taskQueuePC
.runTask(rejectFun)
.catch(console.error)

taskQueuePC
.runTask(delayFun)
.then(console.log)

//note that error is handled twice (the first is in the queue class and the other using catch on the promise returned by runTask)
//note that we don't want to propagate the error backwards in consume() recursion because we want to run new tasks any way