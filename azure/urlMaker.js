function urlMaker(url, params = '') {            
    
    if(!params) return url;
    
    url += '?';

    for (key in params) {
        url += `${key}=${params[key]}&`; 
    }
    
    url = url.slice(0, -1);
    
    return url;
}

module.exports = urlMaker;