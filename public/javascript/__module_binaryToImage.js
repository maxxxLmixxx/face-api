// "deconvert" after fetching from server
export default function uint8ArrayToImageTag(imageData) {
    const image = new Image();
    image.src = `data:image/png;base64,${
        btoa(
            new Uint8Array(imageData)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )}`;
    return image;
}
