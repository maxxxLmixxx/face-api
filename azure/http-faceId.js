const sendToAzure = require('./sendToAzure');

function httpFaceId(data, service = 'face/v1.0/detect') {           
    return sendToAzure({
        contentType: "application/octet-stream",
        service,
        parametres: {
            "returnFaceId": "true",
        },
        data
    });
}

module.exports = httpFaceId;