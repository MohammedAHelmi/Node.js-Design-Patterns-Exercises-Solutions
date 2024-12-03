import { EventEmitter } from 'events'
/**
 * a function that returns an event emitter that emits an event called tick every 50 milliseconds until the number of milliseconds is passed
 * @param {number} num 
 * @param {function} callback 
 * @returns {EventEmitter}
 */
const fun = function(num, callback){
    const emitter = new EventEmitter()
    const tickFun = (remainingTime, tickcount)=>{
        emitter.emit('tick')
        tickcount++
        if(remainingTime < 50){
            callback(tickcount)
            return
        }
        setTimeout(tickFun.bind(null, remainingTime-50, tickcount), 50)
    }
    if(num >= 50)
        setTimeout(tickFun.bind(null, num-50, 0), 50)
    else process.nextTick(()=>callback(0))
    return emitter
}
let tickNum = 1
fun(50, (tickcount)=>console.log(`total tick count is ${tickcount}`)).on('tick', ()=>{
    console.log(`Tick number ${tickNum++}`)
})