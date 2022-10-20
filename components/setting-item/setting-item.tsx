import { useRouter } from 'next/router';
import React from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

interface Props {
    icon: React.ReactNode;
    title: string;
    actived?: boolean;
    linkTo: string;
}

export default function SettingItem({ icon, title, actived, linkTo }: Props) {
    const router = useRouter();

    const handleClick = () => {
        router.push(linkTo);
    };

    return (
        <div
            className="flex items-center pb-3 border-b-2 border-gray-200 border-solid cursor-pointer gap-x-5"
            onClick={handleClick}
        >
            {icon}
            <p className={actived ? 'font-semibold' : 'font-medium'}>{title}</p>
            {actived && <RiArrowRightSLine size={24} />}
        </div>
    );
}
