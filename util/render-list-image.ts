export const getImageClasses = (index: number, arrayLength: number, col: number) => {
    let className = 'overflow-hidden image-container ';
    const row = Math.floor(arrayLength / col);

    if (index === 0) {
        className += ' rounded-tl-lg';
        if (arrayLength <= col) {
            className += ' rounded-bl-lg';
        }
    }
    if (index === col - 1) {
        className += ' rounded-tr-lg';
    }
    if (index === arrayLength - 1) {
        className += ' rounded-br-lg';
        if (row === 0) {
            className += ' rounded-tr-lg';
        }
    }
    if (index === row * col) {
        className += ' rounded-bl-lg';
    }
    if (arrayLength - 1 >= row * col && arrayLength < row * col + col && index === row * col - 1) {
        className += ' rounded-br-lg';
    }

    if (index === 1) {
        console.log(className);
    }

    return className;
};
