const sendToAzure = require('./sendToAzure');

function httpCompare2Faces(data, service = 'face/v1.0/verify') {

    if (!Array.isArray(data)) {
        return { error: { code: `Invalid input`, message: `Should be: [faceId1, faceId2].` } };
    }

    // const regCheck = /\w{8}(\-\w{4}){3}\-\w{12}/;
    // if(!regCheck.test(data[0]) || !regCheck.test(data[1]))
    //     return { error: { code: `Invalid input`, message: `Regexp pattern doesn't match string` } };

    return sendToAzure({
        contentType: "application/json",
        service,
        parametres: '',
        data: JSON.stringify({
            "faceId1": data[0],
            "faceId2": data[1]
        })
    });
}

module.exports = httpCompare2Faces;