import { request } from 'http';
import { Readable } from 'stream';

export default class RequestBuilder{
    #method;
    #protocol
    #host;
    #port;
    #pathname;
    #queries;
    #body;
    #headers;

    constructor(){
        this.#queries = new Array();
        this.#headers = new Array();
    }

    /**
    * @param {'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'} method 
    */
    setMethod(method){
        if(typeof method !== 'string')
            throw new TypeError('Expected "method" to be a string')

        const methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];
        if(!methods.includes(method))
            throw new Error(`Invalid Method ${method}`);

        this.#method = method;
        return this;
    }

    /**
     * 
     * @param {string} protocol
     */
    setProtocol(protocol){
        if(typeof protocol !== 'string')
            throw new TypeError("Protocol must be a string");

        this.#protocol = protocol;

        return this;
    }

    /**
     * @param {string} url 
     */
    setURL(link){
        if(typeof link !== 'string')
            throw new TypeError('Expected "URL" to be a string');

        const url = new URL(link);
        this.#protocol = url.protocol ?? this.#protocol;
        this.#host = url.host;
        this.#port = url.port ?? this.#port;
        this.#queries.push(...url.searchParams.entries());
        this.#pathname = url.pathname ?? this.#pathname;
        
        return this;
    }

    /**
     * @param {string} key 
     * @param {string} value 
     */
    setQuery(key, value){
        if(typeof key !== 'string' || typeof value !== 'string')
            throw new TypeError('Expected "key" and "value" to be strings');

        this.#queries.push([key, value]);
        return this;
    }

    /**
     * @param {string} header 
     * @param {string} value 
     */
    setHeader(header, value){
        if(typeof header !== 'string' || typeof value !== 'string')
            throw new TypeError('Expected "header" and "value" to be strings');

        this.#headers.push([header, value]);
        return this;
    }

    /**
     * 
     * @param {string | ReadableStream} body 
     */
    setBody(body){
        if(typeof body !== 'string' && body instanceof Readable === false)
            throw new TypeError('Expected "body" to be a string or a readable stream');

        this.#body = body;
        return this;
    }

    #buildQuery(){
        if(this.#queries.length === 0) 
            return '';

        return this.#queries.reduce((fullQuery, [query, val], idx) => {
            if(idx > 0) fullQuery += '&';
            return fullQuery + `${encodeURIComponent(query)}=${encodeURIComponent(val)}`;
        }, '?');
    }

    #getFullPath(){
        return `${this.#pathname?this.#pathname:''}${this.#buildQuery()}`;
    }

    #getHeaders(){
        return Object.fromEntries(this.#headers);
    }

    invoke(){
        return new Promise((resolve, reject) => {
            const options = {
                method: this.#method,
                protocol: this.#protocol ?? 'http',
                host: this.#host,
                port: this.#port,
                path: this.#getFullPath(),
                headers: this.#getHeaders()
            };

            const req = request(options, resolve);

            if(typeof this.#body === 'string'){
                req.write(this.#body);
                req.end();
            }
            else if(this.#body instanceof Readable){
                this.#body.pipe(req);
            }
            else req.end();

            req.on('error', reject);
        });
    }
}