
export const queryParams = (url, key) => {

    let queries = url.split('?').pop().split('&');

    for(let query of queries){
        let querySp = query.split('=');
        if(querySp[0] === key){
            return querySp[1];
        }
    }
    return "";

}