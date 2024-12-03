import LazyReadable from "./lazystream/Readable.js";
import LazyWritable from "./lazystream/Writable.js";
import { createReadStream, createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import wait from "./helpers/wait.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const readablestream = new LazyReadable( () => createReadStream( join(__dirname, 'files/input.txt') ));

const writeablestream = new LazyWritable( () => createWriteStream( join(__dirname, 'files/output.txt') ));

await wait(5);

readablestream.pipe(writeablestream);