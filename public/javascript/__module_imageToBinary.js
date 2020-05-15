// convert before sending to server
export default function imageToUint8Array(image) {
    if(!image) return;
    if(typeof image == 'string') image = stringToHTML(image);

    const IMAGE_FORMAT = 'jpeg';
    const dataUri = image.tagName == 'CANVAS' ?  
            image.toDataURL(`image/${IMAGE_FORMAT}`) :
            image.src;

    // ... (data:image/png)
    const mimeType = dataUri.split(';')[0].replace('^data:', ''),
          base64Data = dataUri.split(',')[1];

    const convertToBinary = (base64Data) => {
        const bytes = window.atob(base64Data); //raw binary data
      
        const allocatedMemory = new ArrayBuffer(bytes.length);
        const uint8Array = new Uint8Array(allocatedMemory);
    
        return uint8Array.map((item, index) => {
            return bytes.charCodeAt(index)
        });
    }
    
    return convertToBinary(base64Data);
    
    function stringToHTML(str) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        return doc.body.firstChild;
    }
}