const cache = {};

const keygen = (req) => JSON.stringify({
    method: req.method,
    url: req.url,
    params: req.params,
    headers: req.headers
}); // we may also add other options such as timeout, maxContentLength & various tokens


export const fetch = function(req){
    return cache[keygen(req)];
}

export const store = function(req, res){
    cache[keygen(req)] = res;
}