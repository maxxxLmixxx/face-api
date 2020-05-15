const sendToAzure = require('./sendToAzure');

function httpFaceParametres(data, service = 'face/v1.0/detect') {           
    const parametres = {
        "returnFaceId": "true",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    return sendToAzure({
        contentType: "application/octet-stream",
        service,
        parametres,
        data
    });
}

module.exports = httpFaceParametres;