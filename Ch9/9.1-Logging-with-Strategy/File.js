import { writeFile } from 'fs/promises'

class File{
    constructor(filePath){
        if(typeof filePath !== 'string' || filePath === '') // we can add more validation to ensure the path is correct
            throw new TypeError('Expect a non-empty string as the logging file path');

        this.filePath = filePath;
    }

    async log(msg){
        await writeFile(this.filePath, `${msg}\n`, { flag: 'a' });
    }
};

export default File;