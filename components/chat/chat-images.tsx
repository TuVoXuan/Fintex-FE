import React, { useState } from 'react';
import Image from 'next/image';
import Avatar from '../avatar/avatar';

interface Props {
    position: 'first' | 'middle' | 'last';
    me?: boolean;
    className?: string;
    images: string[];
    seen?: string[];
    participants?: IParticipant[];
    onClick: (value: string) => () => void;
}

export default function ChatImages({ position, me, images, className, seen, participants, onClick }: Props) {
    const [ratio, setRatio] = useState(1);

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

    const handleRender = () => {
        if (images.length % 3 === 0) {
            return (
                <>
                    <div className={`${me && 'justify-end'} flex`}>
                        <div
                            className={`${getMessageClasses()} ${
                                images.length > 3 && 'gap-y-1'
                            } w-1/3 max-w-1/2 grid grid-cols-3 gap-x-1 overflow-hidden rounded-md ${className}`}
                        >
                            {images.map((item) => (
                                <div
                                    onClick={onClick(item)}
                                    key={item}
                                    className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                >
                                    <Image
                                        src={item}
                                        className="rounded-md"
                                        alt="image"
                                        width={90}
                                        height={160}
                                        layout="responsive"
                                        objectFit="cover"
                                        objectPosition="center"
                                        placeholder="blur"
                                        blurDataURL="/images/avatar.jpg"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="w-4 h-4">
                            {seen && participants && seen.length === 1 && (
                                <Avatar
                                    size="super-nano"
                                    url={participants.find((item) => item._id === seen[0])?.avatar || ''}
                                />
                            )}
                        </div>
                    </div>
                    {seen && participants && seen.length > 1 && (
                        <div className="flex justify-end gap-x-2">
                            {seen.map((item) => {
                                const participant = participants.find((p) => p._id === item);
                                return <Avatar key={item} size="super-nano" url={participant?.avatar || ''} />;
                            })}
                        </div>
                    )}
                </>
            );
        } else if (images.length % 3 === 1) {
            return (
                <>
                    <div className={`${me && 'justify-end'} flex`}>
                        <div
                            className={`${getMessageClasses()}  ${
                                images.length > 3 && 'space-y-1'
                            } w-1/3 overflow-hidden rounded-md ${className}`}
                        >
                            {images.length >= 3 && (
                                <div className="grid grid-cols-3 gap-1">
                                    {images.map((item, index) => {
                                        if (index < images.length - 1) {
                                            return (
                                                <div
                                                    onClick={onClick(item)}
                                                    key={item}
                                                    className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                                >
                                                    <Image
                                                        src={item}
                                                        className="rounded-md"
                                                        alt="image"
                                                        width={90}
                                                        height={160}
                                                        layout="responsive"
                                                        objectFit="cover"
                                                        objectPosition="center"
                                                        placeholder="blur"
                                                        blurDataURL="/images/avatar.jpg"
                                                    />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            )}
                            <div>
                                {images.length === 1 ? (
                                    <div
                                        onClick={onClick(images[0])}
                                        className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                    >
                                        <Image
                                            src={images[0]}
                                            className="rounded-md"
                                            alt="image"
                                            width={100}
                                            height={100 / ratio}
                                            layout="responsive"
                                            objectFit="cover"
                                            objectPosition="center"
                                            placeholder="blur"
                                            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                                                setRatio(naturalWidth / naturalHeight);
                                            }}
                                            blurDataURL="/images/avatar.jpg"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={onClick(images[images.length - 1])}
                                        className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                    >
                                        <Image
                                            src={images[images.length - 1]}
                                            className="rounded-md"
                                            alt="image"
                                            width={160}
                                            height={90}
                                            layout="responsive"
                                            objectFit="cover"
                                            objectPosition="center"
                                            placeholder="blur"
                                            blurDataURL="/images/avatar.jpg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-4 h-4">
                            {seen && participants && seen.length === 1 && (
                                <Avatar
                                    size="super-nano"
                                    url={participants.find((item) => item._id === seen[0])?.avatar || ''}
                                />
                            )}
                        </div>
                    </div>
                    {seen && participants && seen.length > 1 && (
                        <div className="flex justify-end gap-x-2">
                            {seen.map((item) => {
                                const participant = participants.find((p) => p._id === item);
                                return <Avatar key={item} size="super-nano" url={participant?.avatar || ''} />;
                            })}
                        </div>
                    )}
                </>
            );
        } else if (images.length % 3 === 2) {
            return (
                <>
                    <div className={`${me && 'justify-end'} flex`}>
                        <div
                            className={`${getMessageClasses()}  ${
                                images.length > 3 && 'space-y-1'
                            } w-1/3 overflow-hidden rounded-md ${className}`}
                        >
                            {images.length >= 3 && (
                                <div className="grid grid-cols-3 gap-1">
                                    {images.map((item, index) => {
                                        if (index < images.length - 2) {
                                            return (
                                                <div
                                                    onClick={onClick(item)}
                                                    key={item}
                                                    className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                                >
                                                    <Image
                                                        key={item}
                                                        src={item}
                                                        className="rounded-md"
                                                        alt="image"
                                                        width={90}
                                                        height={160}
                                                        layout="responsive"
                                                        objectFit="cover"
                                                        objectPosition="center"
                                                        placeholder="blur"
                                                        blurDataURL="/images/avatar.jpg"
                                                    />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-x-1">
                                <div
                                    onClick={onClick(images[images.length - 2])}
                                    className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                >
                                    <Image
                                        src={images[images.length - 2]}
                                        className="rounded-md"
                                        alt="image"
                                        width={100}
                                        height={100}
                                        layout="responsive"
                                        objectFit="cover"
                                        objectPosition="center"
                                        placeholder="blur"
                                        blurDataURL="/images/avatar.jpg"
                                    />
                                </div>
                                <div
                                    onClick={onClick(images[images.length - 1])}
                                    className='relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer'
                                >
                                    <Image
                                        src={images[images.length - 1]}
                                        className="rounded-md"
                                        alt="image"
                                        width={100}
                                        height={100}
                                        layout="responsive"
                                        objectFit="cover"
                                        objectPosition="center"
                                        placeholder="blur"
                                        blurDataURL="/images/avatar.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-4 h-4">
                            {seen && participants && seen.length === 1 && (
                                <Avatar
                                    size="super-nano"
                                    url={participants.find((item) => item._id === seen[0])?.avatar || ''}
                                />
                            )}
                        </div>
                    </div>
                    {seen && participants && seen.length > 1 && (
                        <div className="flex justify-end gap-x-2">
                            {seen.map((item) => {
                                const participant = participants.find((p) => p._id === item);
                                return <Avatar key={item} size="super-nano" url={participant?.avatar || ''} />;
                            })}
                        </div>
                    )}
                </>
            );
        }
    };

    return <>{handleRender()}</>;
}
