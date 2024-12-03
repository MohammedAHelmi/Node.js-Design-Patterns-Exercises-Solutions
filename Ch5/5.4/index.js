const mapAsync = async function(iter, cb, concurrency){
    let nextItemIdx = 0;
    const results = new Array(iter.length);
    
    const work = async () => {
        let currentItemIdx = nextItemIdx++;
        
        while(currentItemIdx < iter.length){
            try{
                results[currentItemIdx] = await cb(iter[currentItemIdx]);
            }
            catch(err){
                results[currentItemIdx] = err;
            }
            
            currentItemIdx = nextItemIdx++;
        }
    };
    
    const workers = [];
    for(let _ = 0; _ < concurrency; _++) workers.push(work());
    
    await Promise.all(workers);
    
    return results;
}

const arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const cb = elem => new Promise( resolve => setTimeout(() => resolve(elem), elem*100) )


console.time("Concurrency is 2")
const mappedArr = await mapAsync(arr, cb, 2)
console.timeEnd("Concurrency is 2")
console.log(...mappedArr)


console.time("Concurrency is 5")
const mappedArr2 = await mapAsync(arr, cb, 5)
console.timeEnd("Concurrency is 5")
console.log(...mappedArr2)