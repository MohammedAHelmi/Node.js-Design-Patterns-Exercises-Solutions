export default class Queue{
    #dataQueue;
    #promisesQueue;

    /**
     * @param {Function} fn
     * @param {Function} fn.enqueue 
     */
    constructor(fn){
        this.#dataQueue = new Array();
        this.#promisesQueue = new Array();
        fn(this.#enqueue.bind(this));
    }

    #consumeData(){
        if(this.#promisesQueue.length === 0 || this.#dataQueue.length === 0) return;

        const data = this.#dataQueue.shift();
        const resolve = this.#promisesQueue.shift();

        resolve(data);
    }

    #enqueue(data){
        this.#dataQueue.push(data);
        this.#consumeData();
    }

    dequeue(){
        const promise = new Promise(resolve => this.#promisesQueue.push(resolve))
        this.#consumeData();
        return promise;
    }
}