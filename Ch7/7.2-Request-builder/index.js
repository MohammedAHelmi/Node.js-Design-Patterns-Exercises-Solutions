import RequestBuilder from "./RequestBuilder.js";

const response = await new RequestBuilder()
.setMethod('POST')
.setURL('http://jsonplaceholder.typicode.com/posts')
.setHeader('Content-Type', 'application/json')
.setBody(JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }))
.invoke();

response.pipe(process.stdout);