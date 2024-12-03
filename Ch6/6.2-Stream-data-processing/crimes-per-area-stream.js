import { Transform } from 'stream';

class CrimesPerArea extends Transform{
    #resultsPromise;
    #resolve;

    constructor(options){
        super({...options, objectMode: true});
        this.crimesPerAreaMap = {};
        
        this.#resultsPromise = new Promise(resolve => this.#resolve = resolve);
    }
    
    _transform(row, enc, cb){
        this.crimesPerAreaMap[row.borough] = this.crimesPerAreaMap[row.borough] ?? {};
        this.crimesPerAreaMap[row.borough][row.major_category] = this.crimesPerAreaMap[row.borough][row.major_category] ?? 0; 
        this.crimesPerAreaMap[row.borough][row.major_category] += Number.parseInt(row.value); 
        cb();
    }

    _flush(cb){
        this.#resolve(this.crimesPerAreaMap);
        cb()
    }

    async getCrimeCountPerArea(){
        return await this.#resultsPromise;
    }
}

export default CrimesPerArea;