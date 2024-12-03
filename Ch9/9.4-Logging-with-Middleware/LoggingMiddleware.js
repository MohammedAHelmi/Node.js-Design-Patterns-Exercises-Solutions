export default class LoggingMiddleWare{
    constructor(){
        this.processingFns = [];
    }

    use(fn){
        this.processingFns.push(fn);
    }

    async log(msg){
        console.log(msg);
        this.executePostProcessing(msg);
    }
    
    async executePostProcessing(msg){
        for(const fn of this.processingFns){
            msg = fn(msg);
        }
    }
}