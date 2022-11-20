import React from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface Props {
    id: string;
    src: string;
    onClose: Function;
    disabled?: boolean;
}

export default function ImageCard({ id, src, onClose, disabled }: Props) {
    const handleClose = () => {
        onClose((value: IImageStore[]) => value.filter((item) => item.id !== id));
    };

    return (
        <div className="relative flex-none w-24 overflow-hidden rounded-md">
            <div
                className={`absolute border-[1px] border-solid border-secondary-35 z-10 flex items-center justify-center w-5 h-5 bg-white rounded-full top-1 right-1 ${
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={handleClose}
            >
                <IoClose size={12} />
            </div>
            <Image
                alt="image card"
                src={src}
                width={100}
                height={100}
                layout="responsive"
                objectFit="cover"
                objectPosition="center"
            />
        </div>
    );
}
