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
                <div className="max-h-[520px] -translate-y-1/2 image-container top-1/2">
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
        <div className={`overflow-hidden rounded-[15px] bg-slate-200}`}>
            <div className="-translate-y-1/2 image-container top-1/2 max-h-[520px]">
                <Image
                    src={url}
                    alt="image post"
                    width={100}
                    height={100 / ratio}
                    layout="responsive"
                    onLoadingComplete={({ naturalWidth, naturalHeight }) => setRatio(naturalWidth / naturalHeight)}
                />
            </div>
        </div>
    );
}
