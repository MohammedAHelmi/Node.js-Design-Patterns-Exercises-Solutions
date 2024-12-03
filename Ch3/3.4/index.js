import { EventEmitter } from 'events'
const fun = function(num, callback){
    const emitter = new EventEmitter()
    const now = Date.now()
    if(now%5 == 0){
        process.nextTick(()=>{
            emitter.emit('error')
            callback(new Error(`Time ${now} is divisable by 5!`))
        })
    }
    else {
        process.nextTick(()=>emitter.emit('tick'))
        const tickFun = (remainingTime, tickcount)=>{
            const now = Date.now()
            if(now%5 == 0){
                emitter.emit('error')
                callback(new Error(`Time ${now} is divisable by 5!`))
            }
            else{
                emitter.emit('tick')
                tickcount++
                if(remainingTime >= 50)
                    setTimeout(tickFun.bind(null, remainingTime-50, tickcount), 50)
                else callback(null, tickcount)
            }
        }
        if(num >= 50)
            setTimeout(tickFun.bind(null, num-50, 1), 50)
        else callback(null, 0)
    }
    return emitter
}
let tickNum = 1
fun(240, (err, tickcount)=>{
    if(err)
        console.log(`An Error happend ${err}`)
    else console.log(`total tick count is ${tickcount}`)
})
.on('tick', ()=>console.log(`Tick number ${tickNum++}`))
.on('error', ()=>{
    console.log(`An error occured`)
})