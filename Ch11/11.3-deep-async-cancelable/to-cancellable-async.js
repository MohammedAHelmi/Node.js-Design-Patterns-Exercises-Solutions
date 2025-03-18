import { CancellationError } from "./cancel-error.js";
import { CancellablePromise } from "./cancellable-promise.js";

class CancellableFunction{
    #isCancelled;
    #cancelNested;
    #fn;

    constructor(asyncFn){
        this.#fn = asyncFn;
        this.#isCancelled = false;
        this.#cancelNested = null;
    }

    async execute(...args){
        const generator = this.#fn(...args);
        let currentStep = {};
        
        while(!currentStep.done){
            if(this.#isCancelled)
                throw new CancellationError("Cancelled");
            
            this.#registerNestedCancel(currentStep.value)
            currentStep = await this.#runNextStep(generator, currentStep.value)
        }

        return currentStep.value;
    }

    #registerNestedCancel(promise){
        if(promise instanceof CancellableFunction){
            this.#cancelNested = () => lastValue.cancel();
        }
        else this.#cancelNested = null;
    }

    async #runNextStep(generator, stepPromise){
        try{
            return generator.next(await stepPromise);
        }
        catch(err){
            return generator.throw(err)
        }
    }

    cancel(){
        this.#isCancelled = true;
        this.#cancelNested && this.#cancelNested();
    }
}

export const toCancellableAsync = function(fn){
    const cancellableFn = new CancellableFunction(fn);
    
    return function(...args){
        return new CancellablePromise((resolve, reject, onCancel) => {
            cancellableFn.execute(...args)
            .then(resolve, reject);

            onCancel(() => cancellableFn.cancel());
        });
    }
}