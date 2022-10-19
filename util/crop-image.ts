import { Area } from 'react-easy-crop';

const createImage = (url: string) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export const getCroppedImg = async (imageSrc: string, crop: Area) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = crop.width;
    canvas.height = crop.height;

    if (!ctx) {
        return null;
    }

    ctx.drawImage(image as any, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
};
