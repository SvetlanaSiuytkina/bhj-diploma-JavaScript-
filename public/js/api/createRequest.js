function createRequest(options) {
    const xhr = new XMLHttpRequest();

    const url = options.url;
    const data = options.data;
    const method = options.method;
    const callback = options.callback;

    if (method === "GET" && Object.keys(data).length > 0) {
    } else {

    }
    
    xhr.open(method, url);
    xhr.responseType = "json";

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(xhr.response);
        } else {
            const error = new Error(`HTTP error! status: &{xhr.status}`);
            callback(error);
        }
    }
}