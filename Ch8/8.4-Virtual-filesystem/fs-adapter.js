import { resolve } from 'path';

const fs = {};

const readFile = (filename, options, cb) => {
    if(typeof options === 'function'){
        cb = options;
        options = {};
    }
    else if(typeof options === 'string'){
        options = { encoding: options};
    }

    filename = resolve(filename);

    if(!fs[filename]){
        const err = new Error(`ENOENT, open "${filename}"`);
        err.code = 'ENOENT';
        err.errno = 34;
        err.path = filename;

        return cb && cb(err);
    }

    return cb && cb(null, fs[filename]);
};

const writeFile = (filename, contents, options, cb) => {
    if(typeof options === 'function'){
        cb = options;
        options = {};
    }
    else if(typeof options === 'string'){
        options = { encoding: options};
    }
    
    filename = resolve(filename);

    if(options?.flag === 'a')
        contents = (fs[filename]?fs[filename]:'') + contents;

    fs[filename] = contents;
    return cb && cb(null);
}

export const createFSAdapter = () => {
    return {
        readFile,
        writeFile
    }
};