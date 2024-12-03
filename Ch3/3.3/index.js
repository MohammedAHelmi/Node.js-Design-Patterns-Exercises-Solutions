import { EventEmitter } from 'events'
const fun = function(num, callback){
    const emitter = new EventEmitter()
    process.nextTick(()=>emitter.emit('tick'))
    const tickFun = (remainingTime, tickcount)=>{
        emitter.emit('tick')
        tickcount++
        if(remainingTime >= 50)
            setTimeout(tickFun.bind(null, remainingTime-50, tickcount), 50)
        else callback(tickcount)
    }
    if(num >= 50)
        setTimeout(tickFun.bind(null, num-50, 1), 50)
    else callback(0)
    return emitter
}
let tickNum = 1
fun(240, (tickcount)=>console.log(`total tick count is ${tickcount}`)).on('tick', ()=>{
    console.log(`Tick number ${tickNum++}`)
})