import Image from 'next/image';
import { useState } from 'react';

interface Props {
    quantity: 'single' | 'multiple';
    url: string;
    className?: string;
    moreImage?: number;
    background?: string;
}

export default function ImageContainer({ quantity, url, className, moreImage, background }: Props) {
    const [ratio, setRatio] = useState(1);

    if (quantity === 'single') {
        return (
            <div className={`overflow-hidden rounded-[15px] ${background ? background : `bg-slate-200`} ${className}`}>
                <div>
                    <Image
                        src={url}
                        alt="image post"
                        width={100}
                        height={100 / ratio}
                        layout="responsive"
                        objectFit="contain"
                        onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                            if (naturalWidth >= naturalHeight) {
                                setRatio(naturalWidth / naturalHeight);
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
    return (
        <div className={`w-full overflow-hidden image-container rounded-lg ${className}`}>
            <Image
                src={url}
                alt="image"
                width={100}
                height={100}
                layout="responsive"
                objectFit="cover"
                objectPosition="center"
            />
            {moreImage && (
                <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-secondary-80/50">
                    <p className="text-3xl text-white">+{moreImage}</p>
                </div>
            )}
        </div>
    );
}
