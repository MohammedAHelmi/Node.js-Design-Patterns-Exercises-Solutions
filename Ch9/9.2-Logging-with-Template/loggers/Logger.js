class Logger{
    constructor(options){
        this.options = {
            info: true,
            warn: true,
            error: true,
            debug: true
        };

        if(typeof options === 'object')
            this.options = {...this.options, ...options};
    }
    async _log(){
        throw new Error('This function must be implemented');
    }

    async info(msg){
        if(!this.options.info)
            return;

        await this._log(msg);
    }

    async warn(msg){
        if(!this.options.warn)
            return;
        
        await this._log(msg)
    }

    async error(msg){
        if(!this.options.error)
            return;
        
        await this._log(msg)
    }

    async debug(msg){
        if(!this.options.debug)
            return;
        
        await this._log(msg);
    }
};

export default Logger;