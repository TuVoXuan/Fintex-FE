import React from 'react';

interface Props {
    actived?: boolean;
    title: string;
    onClick?: () => void;
}

export default function NavItem({ title, actived, onClick }: Props) {
    return (
        <div className="inline-block cursor-pointer" onClick={onClick}>
            <p
                className={`p-4 transition-all ease-in-out duration-150 font-semibold   ${
                    actived ? 'text-blue-600' : 'hover:bg-gray-100 hover:rounded-lg text-gray-600'
                }`}
            >
                {title}
            </p>
            <p
                className={`h-1 transition-all ease-in-out duration-150 rounded-md ${
                    actived ? 'bg-blue-600' : 'bg-transparent'
                }`}
            ></p>
        </div>
    );
}
