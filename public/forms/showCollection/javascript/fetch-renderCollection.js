import imageToBinary from '/javascript/__module_imageToBinary.js'
import binaryToImage from '/javascript/__module_binaryToImage.js'
import http_postRequest from '/javascript/__module_httpPostRequest.js'
import Form from './__componenta_html_form.js'

(async function() {
    const storedFaceId = {};

    const changedRenderElements = addLoading();
  
    const usersCollection = await getCollection('/return-collection');  

    if (!usersCollection) {
       setTimeout(() => {   
        changedRenderElements[0].parentNode.removeChild(changedRenderElements[0]);
        alert('No collection...');
      }, 500);
    return;
    }

    if(usersCollection) { 
        renderCollection(usersCollection);
        changedRenderElements[0].parentNode.removeChild(changedRenderElements[0]); 
        const collectionContainer = document.querySelector('.collection-container');
        collectionContainer.addEventListener('click', submitListener);
        collectionContainer.addEventListener('click', deleteListener);
    }

    function addLoading() {
        const loaderStyles = `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            position: absolute;
            z-intex: 1;              
            background-color: rgba(255, 255, 255, 0.1);
        `;

        document.body.insertAdjacentHTML("afterbegin",
            `<div class="loader-container" style="${loaderStyles}">
                <div class="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>`);
        return([document.querySelector('.loader-container')]);
    }

    async function getCollection(service) { // get { Response } // parse { Response } // return { Promise }  
        const data = await fetch(`${globalVariables.baseUrl}${service}`);
        const parsedData = await data.json(); 
        if ('error' in parsedData) return null;
        return parsedData["message"]["usersCollection"]; 
    }

    function renderCollection(collection) {
        collection.forEach( (user, index) => {            
            const { name, accessLevel, faceParametres, imageData, description } = user;
            storedFaceId[index] = faceParametres;

            const root = document.querySelector(`.accessLevel-group-${accessLevel}`);
            root.style.cssText = `
            display: flex;
            background-color: rgba(0, 0, 0, 0.5);
            /* background-color: ${ accessLevel == 1 ? 'rgba(0, 0, 0, 0.5)' : accessLevel == 2 ? 'yellow' : 'red' };*/
            `;
            root.querySelector('span').style.cssText = '';

            const image = binaryToImage(imageData[0]);
            image.style.cssText = `
                width: 100%;
                margin-top: -8px;
                border: 1px solid #ccc;
                cursor: pointer;
            `;
            image.classList.add(`img-${index}`);

            const formComponenta = Form({ index, name, accessLevel, description, image: image.outerHTML });
            root.insertAdjacentHTML('beforeend', formComponenta);

            const input = document.querySelector(`#name-${index}`);
            // input.addEventListener('focus', inputFocusEventListener);
            input.addEventListener('blur', inputBlurEventListener);
            document.body.addEventListener('input', inputFocusEventListener);
        });
    }

    async function submitListener(e) {
        if(e.target.tagName == 'IMG') {
            const serialNum = e.target.className.slice(-1);
            const elementFaceId = storedFaceId[serialNum];
            
            const opWindow = window.open("data:application/json," 
            + encodeURIComponent(JSON.stringify(elementFaceId)),
                    '_blank');
            opWindow.focus();

            // download file : <a id="downloadJSON" style="display: none"></a>
            // const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(elementFaceId))}`;
            // const downloadElement = document.getElementById('downloadJSON');
            // downloadElement.setAttribute("href", dataString);
            // downloadElement.setAttribute("download", `face-${serialNum}.json`);
            // downloadElement.click();
        }

        if(e.target.className.split(` `)[0] == 'add-user-submit') {
            const serialNum = e.target.className.split(` `)[1].slice(-1);
            const formData = new FormData(document.querySelector(`.add-user-${serialNum}`));

            if(!nameValidation(formData.get(`name`), true)) return;
            e.target.style.cssText = 'pointer-events: none';

            const changedRenderElements = await new Promise((resolve, reject) => {
                const loaderStyles = `
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        z-intex: 1;              
                        background-color: rgba(255, 255, 255, 0.1);
                `;
    
                setTimeout(() => {
                    document.querySelector(`.container-${serialNum}`).insertAdjacentHTML("afterbegin",
                        `<div class="loader-container" style="${loaderStyles}">
                            <div class="lds-facebook">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>`);
                    resolve([
                        document.querySelector('.loader-container'),
                        document.querySelector(`.container-${serialNum}`)
                    ]);
                }, 200);
            });
            
            const http_updateUser_responseData = await http_postRequest({
                baseUrl: globalVariables.baseUrl, // 'http://127.0.0.1:3000'
                serviceUrl: '/add-user/modified=true',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: document.querySelector(`.add-user-${serialNum} h3`).innerHTML.split(` `)[1].toLocaleLowerCase(),
                    updateName: formData.get(`name`),
                    accessLevel: Number(formData.get(`accessLevel`)),
                    imageData: imageToBinary( document.querySelector(`.img-${serialNum}`) ),
                    description: String(formData.get(`description`))
                })
            });
            
            changedRenderElements[0].parentNode.removeChild(changedRenderElements[0]);
            changedRenderElements[1].style.cssText = ``;

            location.reload();
        }
    }

    async function deleteListener(e) {
        if (e.target.className.includes('delete-button')) {
            const confirmationString = prompt('Enter confirmation string.');
            if (!confirmationString) return;
            
            const serialNum = e.target.className.split(` `)[1].slice(-1);
            const name = document.querySelector(`.add-user-${serialNum} h3`).innerHTML.split(` `)[1].toLocaleLowerCase();
    
            const returnData = await fetch(`${globalVariables.baseUrl}/delete/${name}/${confirmationString}`, {
                method: 'DELETE'
            });
    
            location.reload();
        }
    }

    function inputFocusEventListener(e) {
        if(e.target.tagName != 'INPUT') return;
        if(!nameValidation(e.target.value)) {
            e.target.style.cssText = 'border: 1px solid red;';
            e.target.placeholder = '1st \\w, then only \\w or \\d {[3...20] symbols}';
        } else {
            e.target.style.cssText = 'border: 1px solid green;';
        }
    }

    function inputBlurEventListener(e) {
        e.target.placeholder = 'Change your name...'; 
        e.target.style.cssText = '';
    }
    
    function nameValidation(name = ``, doMessage = false) {
        if(!/^[a-z]{1}[a-z\d-]{2,20}$/i.test(name) || name.trim() == '') {
            if(doMessage) alert('Wrong input...');
            // alert('Name:\n1. Starts from letter.\n2. Includes only \\w or \\d.\n3. [3...20] symbols ');
            return false;
        }
        return true;
    }

    document.querySelector('.copy-i-container').addEventListener('click', e => {
        const el = document.createElement('textarea');
        el.value = globalVariables.http_deleteAll;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        const tooltip = document.querySelector('#my-tooltip');
        if (tooltip.innerHTML == 'Copy') {
            
            tooltip.innerHTML = 'Copied';
            tooltip.style.cssText = 'color: black; background-color: yellow;';
            
            setTimeout(() => {
                tooltip.innerHTML = 'Copy'; 
                tooltip.style.cssText = ''; 
            }, 5000);
        }        
    });

})();