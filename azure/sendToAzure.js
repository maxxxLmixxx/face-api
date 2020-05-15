const fetch = require('node-fetch');
const urlMaker = require('./urlMaker');

async function sendToAzure(options, method = "POST") {
    const { contentType, service, parametres, data } = options;

    const subscriptionKey = '53ce54103e294a429aa8efb01328230e',
          urlBase = `https://maxxxlmixxx.cognitiveservices.azure.com/${service}`;

    const response = await fetch(urlMaker(urlBase, parametres), {
        method,
        headers: {
            'Content-Type': contentType,
            'Ocp-Apim-Subscription-Key': subscriptionKey
        },
        credentials: 'same-origin',
        body: data
    });

    return response.json();
}

module.exports = sendToAzure;
