import { imageFromCanvas, imageToCanvas } from './__module_convert_canvas-image.js'

{

    setTimeout( () => {
        globalVariables.imageSerial = localStorage.getItem('imageSerial');
        globalVariables.currentImage = localStorage.getItem('currentImage');
    }, 0);

    const root = document.querySelector('.left-aside--root');
    const canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');

    const borderStyle = `border: 5px solid hsla(200, 50%, 42%, 1.0)`;
    canvas.style.cssText = 'border: none; pointer-events: none;';
    
    if (localStorage.getItem('canvas')) {
        globalVariables.isFirst = false;
        canvas.style.cssText = 'border: none;';
    } else easterEgg();


    renderCanvas();
    insertPictures();
    preloadBorder();

    setTimeout(renderCanvas(), 0);
    setTimeout(preloadBorder(), 0);

    function easterEgg(text = 'Love Kaguya-sama...') {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, .5)';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    function renderCanvas(canvasData = localStorage.getItem('canvas')) {
        imageToCanvas(canvas, canvasData);
    }

    function insertPictures(picturesLength = localStorage.getItem('pictures-length')) {
        if (picturesLength != 0) {
            for (let i = picturesLength - 1; i >= 0; i--) {
                canvas.insertAdjacentHTML('afterend', localStorage.getItem(`pictures-${i}`));
            }
        }
    }

    function preloadBorder(imageSerial = localStorage.getItem('imageSerial')) {
        if (imageSerial) {
            const target = root.querySelector(`.picture-in-root:nth-child(${imageSerial})`);

            target.style.cssText = borderStyle;
            target.setAttribute('id', 'target');

            if (target.tagName == 'CANVAS') {
                globalVariables.currentImage = imageFromCanvas(canvas, 'string');
            } else {
                globalVariables.currentImage = target.outerHTML;
            }
        }
    }

}

