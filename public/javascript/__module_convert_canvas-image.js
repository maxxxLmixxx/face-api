export function imageFromCanvas(canvas, outputType = 'tag') {
    if (canvas.tagName == 'CANVAS') {
        const image = document.createElement('img');
        image.src = canvas.toDataURL();
        
        switch (outputType) {
            case 'tag':
                return image;
            case 'string':
                return image.outerHTML;
        }
    } console.log('CavasToImage: wrong input...');
}

export function imageToCanvas(canvas, image) {
    if (canvas.tagName == 'CANVAS' && !!image) {
        const ctx = canvas.getContext('2d');
        const imageData = image.src || image;
        
        const img = new Image();
        img.src = imageData;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }
        return image;
    } console.log('ImageToCanvas: wrong input...');
}