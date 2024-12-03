import axios from "axios";
import cachifyAxios from './cache/interceptors.js';

cachifyAxios(axios);

console.time('normal');
await axios.request({
    url: 'https://example.com/',
    dontCache: true
});
console.timeEnd('normal');

console.time('cached');
await axios.request({
    url: 'https://example.com/',
});
console.timeEnd('cached');


console.time('normal head');
await axios.head('https://example.com/');
console.timeEnd('normal head');

console.time('cached head');
await axios.head('https://example.com/');
console.timeEnd('cached head');