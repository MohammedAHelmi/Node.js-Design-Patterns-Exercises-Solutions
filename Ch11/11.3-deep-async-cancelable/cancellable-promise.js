import { CancellationError } from "./cancel-error.js";

export class CancellablePromise{
    #promise;
    #onCancel;
    #reject;

    constructor(promiseConstructor){
        this.#onCancel = async () => this.#reject(new Error('Promise Cancelled'));

        this.#promise = new Promise((resolve, reject) => {
            this.#reject = reject;
            promiseConstructor(resolve, reject, this.#registerCancelHook.bind(this));
        });
    }
    
    #registerCancelHook(fn){
        this.#onCancel = async () => {
            await fn();
            this.#reject(new CancellationError('Promise Canceled'));
        }
    }

    then(onResolve, onReject){
        return this.#promise.then(onResolve, onReject);
    }

    catch(onReject){
        return this.#promise.catch(onReject);
    }

    finally(onFinally){
        return this.#promise.finally(onFinally);
    }

    async cancel(){
        await this.#onCancel();
    }
}