function createRequest(options) {
    const xhr = new XMLHttpRequest();

    const url = options.url;
    const data = options.data;
    const method = options.method;
    const callback = options.callback;

    let requestUrl = url;
    let requestData = null;

    if (method === "GET" && Object.keys(data).length > 0) {
        const queryParams = new URLSearchParams(data);
        requestUrl = `${url}?${queryParams.toString()}`;         //
    } else {
        requestData = new FormData();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                requestData.append(key, data[key]);
            }
        }
    }
    
    xhr.open(method, requestUrl);
    xhr.responseType = "json";

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.response);
        } else {
            const error = new Error(`HTTP error! status: ${xhr.status}`);
            callback(error, null);
        }
    }

    xhr.send(requestData);
}