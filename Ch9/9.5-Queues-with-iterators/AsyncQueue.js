export default class AsyncQueue{
    #tasks;
    #consumers;
    #done;

    constructor(){
        this.#tasks = [];
        this.#consumers = [];
        this.#done = false;
    }

    #getTask(){
        if(this.#done && !this.#tasks.length)
            return Promise.resolve(null);
            
        if(this.#tasks.length)
            return Promise.resolve(this.#tasks.shift());

        return new Promise(resolve => this.#consumers.push(resolve));
    }

    enqueue(task){
        if(typeof task !== 'function')
            throw new Error(`Expected a function`);

        if(this.#done)
            throw new Error(`You have already called done() on this queue`)

        if(this.#consumers.length > 0){
            const consumer = this.#consumers.shift();
            consumer(task);
        }
        else this.#tasks.push(task);
    }

    async * [Symbol.asyncIterator](){
        while(true){
            const task = await this.#getTask();
            
            if(task === null) return;
            
            yield await task();
        }
    }

    done(){
        this.#done = true;
        this.#consumers.forEach(consumer => consumer(null));
    }
}