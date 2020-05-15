import { imageFromCanvas } from './__module_convert_canvas-image.js'

{
    const canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
    const root = document.querySelector('.left-aside--root');
    const trashButton = document.querySelector('.hide-button');
    const styleText = `border: 5px solid hsla(200, 50%, 42%, 1.0)`;

    { // element selection
        root.addEventListener('click', (e) => {
            if (e.target.className == 'picture-in-root') {
                const allPictureInRoot = root.querySelectorAll(`.picture-in-root`);

                // if element with no selection
                if (e.target.style.cssText != styleText) {
                    allPictureInRoot.forEach(el => {
                        el.style.cssText = 'border: none;';
                        el.removeAttribute('id');
                    });
                    e.target.style.cssText = styleText;
                    e.target.id = 'target';

                    (function () { //save position of target in root
                        allPictureInRoot.forEach((el, i) => {
                            if (e.target == el) globalVariables.imageSerial = ++i;
                        });
                    })();

                    (function () { // save e.target to globalVariables
                        if (e.target.tagName == 'CANVAS') {
                            globalVariables.currentImage = imageFromCanvas(canvas, 'string');
                        } else {
                            globalVariables.currentImage = e.target.outerHTML;
                        }
                    })();
                }

                if (globalVariables.isFirst) {
                    canvas.style.cssText = 'border: none; pointer-events: none;';
                    canvas.removeAttribute('id');
                    globalVariables.currentImage = null;
                }

                localStorage.setItem('currentImage', globalVariables.currentImage);
                localStorage.setItem('imageSerial', globalVariables.imageSerial);
            }

        });

    }

    { // delete button
        trashButton.addEventListener('click', () => {
            document.querySelectorAll('img.picture-in-root').forEach(el => {
                root.removeChild(el);
            });

            canvas.removeAttribute('id');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.cssText = 'border: none; pointer-events: none;';

            globalVariables.isFirst = true;
            globalVariables.currentImage = null;
            globalVariables.imageSerial = null;
            
            localStorage.clear();
        });

    }

}