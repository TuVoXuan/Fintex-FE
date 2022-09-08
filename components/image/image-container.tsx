import Image from 'next/image';
import { useState } from 'react';

interface Props {
    quantity: 'single' | 'multiple';
    url: string;
    className?: string;
}

export default function ImageContainer({ quantity, url, className }: Props) {
    const [ratio, setRatio] = useState(1);

    if (quantity === 'single') {
        return (
            <div className={`overflow-hidden rounded-[15px] bg-slate-200 ${className}`}>
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
        <div className={`w-full overflow-hidden image-container rounded-3xl ${className}`}>
            <Image
                src={url}
                alt="image"
                width={100}
                height={100}
                layout="responsive"
                objectFit="cover"
                objectPosition="center"
            />
        </div>
    );
}
