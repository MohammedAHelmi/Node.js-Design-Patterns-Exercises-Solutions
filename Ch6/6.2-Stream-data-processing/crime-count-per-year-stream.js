import { Transform } from 'stream';

class CrimesPerYear extends Transform{
    #resultsPromise;
    #resolve;

    constructor(options){
        super({...options, objectMode: true});
        this.crimesPerYearMap = {};
        
        this.#resultsPromise = new Promise(resolve => this.#resolve = resolve);
    }
    
    _transform(row, enc, cb){
        this.crimesPerYearMap[row.year] = this.crimesPerYearMap[row.year] ?? 0;
        this.crimesPerYearMap[row.year] += Number.parseInt(row.value); 
        cb();
    }

    _flush(cb){
        this.#resolve(this.crimesPerYearMap);
        cb()
    }

    async getCrimeCountPerYear(){
        return await this.#resultsPromise;
    }
}

export default CrimesPerYear;