import imageToBinary from '/javascript/__module_imageToBinary.js'
import http_postRequest from '/javascript/__module_httpPostRequest.js'

//localstorage can store types: [string, DOM element] 
const currentImage = localStorage.getItem('currentImage');
const submitButton = document.querySelector(`#add-user-submit`);

if (currentImage == `null` || currentImage == null) {
    alert('Select image at main page and try again...');
    window.close();
} else {
    const input = document.createElement('input');

    (function () { // input image
        input.setAttribute('type', 'image');
        input.setAttribute('alt', 'submit-face');
        input.setAttribute('name', 'image');
        input.setAttribute('id', 'image');
        input.setAttribute('src', String(currentImage.match(/\"[^"]*\"/)).slice(1, -1));
    })();

    document.querySelector('#image-placer').innerHTML = input.outerHTML;
    document.querySelector('#image-placer input').style.cssText = `border: 5px solid hsla(200, 50%, 42%, 1.0)`;
}

document.addEventListener("DOMContentLoaded", function () {
    // only first execution
    submitButton.addEventListener('click', submitButtonListener);
    const input = document.querySelector('#name');
    // input.addEventListener('focus', inputFocusEventListener);
    input.addEventListener('blur', inputBlurEventListener);
    input.addEventListener('input', inputFocusEventListener);
});

async function submitButtonListener(e) {
    let changedRenderElements;
    try {
        const formData = new FormData(document.querySelector('#add-user'));
        if(!nameValidation(formData.get(`name`), true)) return;
    
        changedRenderElements = await new Promise((resolve, reject) => {
            document.querySelector('.container').style.cssText = "position: absolute; z-index: -1;"
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

            setTimeout(() => {
                document.body.insertAdjacentHTML("afterbegin",
                    `<div class="loader-container" style="${loaderStyles}">
                        <div class="lds-facebook">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>`);
                resolve([
                    document.querySelector('.loader-container'),
                    document.querySelector('.container')
                ]);
            }, 200);
        });


        const http_addUser_responseData  = await http_postRequest({
            baseUrl: globalVariables.baseUrl, // 'http://127.0.0.1:3000'
            serviceUrl: '/add-user',
            contentType: 'application/json',
            data: JSON.stringify({
                name: String(formData.get('name')).trim(),
                accessLevel: Number(formData.get('accessLevel')),
                imageData: imageToBinary(currentImage),
                description: String(formData.get('description')).trim()
            })
        });

        const addUser_response = http_addUser_responseData[Object.keys(http_addUser_responseData)[0]];
        const responseMessage = addUser_response.message || addUser_response.code;
        console.log(responseMessage);
        if (responseMessage == 'Invalid user data.') {
            closeWindow(responseMessage);
        }

        if (responseMessage == 'There is user with the same name.') {
            if (confirm('There is user with the same name. Modify?')) {

                document.body.insertAdjacentHTML("afterbegin",
                    `<div class="not-close" style="
                        position: absolute;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100vw;
                        height: 100vh;
                        pointer-events: none;">
                     <h2 style="
                        color: white;
                        position: relative;
                        top: 75px;
                        padding-bottom: 8px;
                        font-size: 17pt;">
                    PLEASE, WAIT FOR RESPONSE<br>TO CONFIRM OPERATION
                    </h2></div>`);

                const http_updateUser_responseData = await http_postRequest({
                    baseUrl: globalVariables.baseUrl, // 'http://127.0.0.1:3000'
                    serviceUrl: '/add-user/modified=true',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: String(formData.get('name')).trim(),
                        accessLevel: Number(formData.get('accessLevel')),
                        imageData: imageToBinary(currentImage),
                        description: String(formData.get('description')).trim()
                    })
                });
                // console.log(http_updateUser_responseData "" )
                closeWindow(http_updateUser_responseData.message.code);
            };
        }

        closeWindow();
        
    } catch (e) {
        console.log(e);
        closeWindow(`Unexpected error...`);
    }

    function closeWindow(text = `It's done.`) {
        changedRenderElements[0].parentNode.removeChild(changedRenderElements[0]);
        changedRenderElements[1].style.cssText = ``;

        // .not-use
        document.querySelector('.container').style.cssText =
            "position: absolute; z-index: -1;";
        alert(text);
        window.close();
    }

    submitButton.removeEventListener('click', submitButtonListener);
}

function inputFocusEventListener(e) {
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
