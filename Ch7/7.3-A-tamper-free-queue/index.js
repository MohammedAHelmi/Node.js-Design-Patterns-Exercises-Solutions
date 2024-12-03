import { createServer } from 'http';
import Queue from "./Queue.js";


const queueExec = (enqueue) => {
    const server = createServer((req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', () => {
            enqueue(body);

            res.writeHead(200);
            res.end();
        })
    })

    const port = 8001;
    server.listen(port, () => console.log(`server is running at port ${port}`))
};

const queue = new Queue(queueExec);
const consumeMassages = async function(){
    while(true){
        const msg = await queue.dequeue();
        console.log(`Message: ${msg}`);
    }
};

consumeMassages();