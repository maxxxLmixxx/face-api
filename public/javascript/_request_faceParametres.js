import jsonRender from './__module_jsonRender.js'
import imageToBinary from './__module_imageToBinary.js'
import http_postRequest from './__module_httpPostRequest.js'

{
    const uploadButton = document.querySelector(`#face-parametres`);

    uploadButton.addEventListener('click', () => {
        if (globalVariables.uploadWait) {
            globalVariables.uploadWait = false;

            const imageBinary = imageToBinary(document.querySelector('#target'));

            const deleteEl = document.querySelector('pre');
            if (deleteEl) deleteEl.parentNode.removeChild(deleteEl);

            document.querySelector('.information-menu')
                .insertAdjacentHTML("afterBegin",
                    `<div class="lds-facebook" style="align-self: center;"><div></div><div></div><div></div></div>`);

            http_postRequest({
                baseUrl: globalVariables.baseUrl, // 'http://127.0.0.1:3000'
                serviceUrl: '/faceParametres',
                contentType: 'application/octet-stream',
                data: imageBinary
            }).then(data => {
                const deleteEl = document.querySelector('.lds-facebook');
                deleteEl.parentNode.removeChild(deleteEl);

                jsonRender(data);
                globalVariables.uploadWait = true;
            });

        }
    });
    
}





