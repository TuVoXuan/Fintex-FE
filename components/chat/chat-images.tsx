import React from 'react';
import Image from 'next/image';

interface Props {
    position: 'first' | 'middle' | 'last';
    me?: boolean;
    className?: string;
    images: IAlbum[];
}

export default function ChatImages({ position, me, images, className }: Props) {
    const getMessageClasses = () => {
        switch (position) {
            case 'first':
                if (me) {
                    return 'rounded-l-3xl rounded-tr-3xl';
                }
                return 'rounded-r-3xl rounded-tl-3xl';
            case 'middle':
                if (me) {
                    return 'rounded-l-3xl';
                }
                return 'rounded-r-3xl';
            case 'last':
                if (me) {
                    return 'rounded-l-3xl rounded-br-3xl';
                }
                return 'rounded-r-3xl rounded-bl-3xl';
            default:
                break;
        }
    };

    if (images.length % 3 === 0) {
        return (
            <div className={`${me && 'justify-end'} flex`}>
                <div
                    className={`${getMessageClasses()} ${
                        images.length > 3 && 'gap-y-1'
                    } w-1/2 grid grid-cols-3 gap-x-1 overflow-hidden rounded-md`}
                >
                    {images.map((item) => (
                        <Image
                            key={item.publicId}
                            src={item.url}
                            className="rounded-md"
                            alt="image"
                            width={90}
                            height={160}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    ))}
                </div>
            </div>
        );
    } else if (images.length % 3 === 1) {
        return (
            <div className={`${me && 'justify-end'} flex`}>
                <div
                    className={`${getMessageClasses()}  ${
                        images.length > 3 && 'space-y-1'
                    } w-1/2 overflow-hidden rounded-md`}
                >
                    {images.length >= 3 && (
                        <div className="grid grid-cols-3 gap-1">
                            {images.map((item, index) => {
                                if (index < images.length - 1) {
                                    return (
                                        <Image
                                            key={item.publicId}
                                            src={item.url}
                                            className="rounded-md"
                                            alt="image"
                                            width={90}
                                            height={160}
                                            layout="responsive"
                                            objectFit="cover"
                                            objectPosition="center"
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                    <div>
                        <Image
                            src={images[images.length - 1].url}
                            className="rounded-md"
                            alt="image"
                            width={160}
                            height={90}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </div>
                </div>
            </div>
        );
    } else if (images.length % 3 === 2) {
        return (
            <div className={`${me && 'justify-end'} flex`}>
                <div
                    className={`${getMessageClasses()}  ${
                        images.length > 3 && 'space-y-1'
                    } w-1/2 overflow-hidden rounded-md`}
                >
                    {images.length >= 3 && (
                        <div className="grid grid-cols-3 gap-1">
                            {images.map((item, index) => {
                                if (index < images.length - 2) {
                                    return (
                                        <Image
                                            key={item.publicId}
                                            src={item.url}
                                            className="rounded-md"
                                            alt="image"
                                            width={90}
                                            height={160}
                                            layout="responsive"
                                            objectFit="cover"
                                            objectPosition="center"
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-1">
                        <Image
                            src={images[images.length - 2].url}
                            className="rounded-md"
                            alt="image"
                            width={100}
                            height={100}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition="center"
                        />
                        <Image
                            src={images[images.length - 1].url}
                            className="rounded-md"
                            alt="image"
                            width={100}
                            height={100}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </div>
                </div>
            </div>
        );
    }
    return <></>;
}
