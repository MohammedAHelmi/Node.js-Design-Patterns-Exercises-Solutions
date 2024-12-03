import { createLazyBuffer } from "./lazy-buffer.js";

const lazyBuf = createLazyBuffer(5);

// console.log(lazyBuf.toString); // returns null

lazyBuf.write('Hello');

console.log(lazyBuf.toString('utf8'));