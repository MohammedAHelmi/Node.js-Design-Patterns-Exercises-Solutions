class Logger{
    constructor(writer, options){
        this.writer = writer;
        this.options = {
            info: true,
            warn: true,
            error: true,
            debug: true
        };

        if(typeof options === 'object')
            this.options = {...this.options, ...options};
    }

    async info(msg){
        if(!this.options.info)
            return;

        await this.writer.log(msg);
    }

    async warn(msg){
        if(!this.options.warn)
            return;
        
        await this.writer.log(msg)
    }

    async error(msg){
        if(!this.options.error)
            return;
        
        await this.writer.log(msg)
    }

    async debug(msg){
        if(!this.options.debug)
            return;
        
        await this.writer.log(msg);
    }
};

export default Logger;