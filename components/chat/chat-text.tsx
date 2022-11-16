import React from 'react';

interface Props {
    position?: 'first' | 'middle' | 'last';
    me?: boolean;
    text: string;
    className?: string;
}

export default function ChatText({ position, me, text, className }: Props) {
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
                return '';
        }
    };

    return (
        <div className={`${me && 'justify-end'} flex`}>
            <p className={`inline max-w-[80%] rounded-md p-3 ${getMessageClasses()} ${className}`}>{text}</p>
        </div>
    );
}
