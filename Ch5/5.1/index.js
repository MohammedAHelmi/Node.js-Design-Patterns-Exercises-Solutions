const myPromiseAll = function(promises){
    return new Promise(async (resolve, reject)=>{
        promises = promises.map(promise => promise.catch(reject))
        for(const promise of promises)
            await promise
        resolve(promises)
    })
}


const delayFun = () => new Promise(resolve => setTimeout(() => {
    console.log(`After Delay`)
    resolve()
}, 1000))
const rejectFun = () => Promise.reject('A random error just to annoy you')


const l1 = [delayFun(), rejectFun(), delayFun()]

// Promise.all(l1)
// .then(()=>console.log(`Promise.all: All excuted Successfully`))
// .catch(err=>console.error(`Promise.all: An Error Occured "${err}"`))

myPromiseAll(l1)
.then(()=>console.log(`myPromiseAll: All excuted Successfully`))
.catch(err=>console.error(`myPromiseAll: An Error Occured "${err}"`))