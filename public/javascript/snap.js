import { imageFromCanvas } from './__module_convert_canvas-image.js'

{
    const snapButton = document.querySelector('#add-picture'),
        root = document.querySelector('.left-aside--root'),
        video = document.querySelector('#video'),
        canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');

    const imageSizes = { width: 320, height: 240 };
    canvas.width = imageSizes.width;
    canvas.height = imageSizes.height;

    snapButton.addEventListener('click', () => {
        if (localStorage.getItem('pictures-length') == 13) {
            alert('LocalStorage limit exceeded...');
            return;
        }

        if (globalVariables.isFirst) {
            ctx.drawImage(video, 0, 0, imageSizes.width, imageSizes.height);
            globalVariables.isFirst = false;
        } else {
            const image = imageFromCanvas(canvas, 'tag');
            image.className = 'picture-in-root';
            root.insertBefore(image, root.firstElementChild.nextSibling);
            ctx.drawImage(video, 0, 0, imageSizes.width, imageSizes.height);
        }
        canvas.style.cssText = canvas.style.cssText.replace(/pointer-events:(\ )*none/, ``);

        (function() { // save images collection to localstorage
            localStorage.setItem('canvas', canvas.toDataURL());
            const pictures = root.querySelectorAll('.picture-in-root:not(canvas)');
    
            localStorage.setItem('pictures-length', pictures.length);
            pictures.forEach((el, i) => {
                localStorage.setItem(`pictures-${i}`, pictures[i].outerHTML);
            });
        })();
        
        (function() { // save target to { globalVariables }
            const target = document.querySelector('#target');
            if (target.tagName == 'CANVAS') {
                globalVariables.currentImage = imageFromCanvas(canvas, 'string');
            } else {
                globalVariables.imageSerial++;
                globalVariables.currentImage = target.outerHTML;
            }
        })();

        localStorage.setItem('imageSerial', globalVariables.imageSerial);
        localStorage.setItem('currentImage', globalVariables.currentImage);
    
    });
    
}