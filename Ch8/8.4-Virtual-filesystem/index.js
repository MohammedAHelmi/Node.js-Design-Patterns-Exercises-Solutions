import { createFSAdapter } from "./fs-adapter.js";

const fs = createFSAdapter();

fs.writeFile('file.txt', 'Hello ');

fs.writeFile('file.txt', 'Node.js!', { flag: 'a' }, () => {
    fs.readFile('file.txt', { encoding: 'utf8' }, (err, res) => {
        if(err)
            return console.error(err)
    
        console.log(res);
    });
});

fs.readFile('missing.txt', { encoding: 'utf8' }, (err, res) => {
    if(err)
        return console.error(err)

    console.log(res);
})