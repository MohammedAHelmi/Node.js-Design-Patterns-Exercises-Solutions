import { fetch, store } from './cache.js';

const fetchFromCache = function(options){
    const completeURL = new URL(options.url, options.baseURL);
    return fetch({...options, url: completeURL});
}

const storeInCache = function(options, res){
    const completeURL = new URL(options.url, options.baseURL);
    store({...options, url: completeURL}, res);
}

const createNewMethod = function(methodName){
    return async function(url, options){
        return this.request({...options, method: methodName, url});
    }
}

const createNewRequest = function(originalRequest){
    return async function(options){
        options.method = options.method ?? 'GET';

        if(options.method.toUpperCase() !== 'GET' && options.method.toUpperCase() !== 'HEAD')
            return originalRequest(options);


        if(!options.forceUpdate){
            const res = fetchFromCache(options);
            if(res !== undefined)
                return Promise.resolve(res);
        }

        return originalRequest(options)
        .then(res => {
            if(!options.dontCache)
                storeInCache(options, res)
            return res;
        });
    }
}

export default function(axios){
    if(!axios)
        throw new TypeError('Expected an instance of axios');

    const originalRequest = axios.request;
    axios.request = createNewRequest(originalRequest);

    axios.get = createNewMethod('GET');
    axios.head = createNewMethod('HEAD');
    
    return axios;
}