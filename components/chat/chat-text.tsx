import React from 'react';
import Avatar from '../avatar/avatar';

interface Props {
    position?: 'first' | 'middle' | 'last';
    me?: boolean;
    text: string;
    className?: string;
    seen?: string[];
    participants?: IParticipant[];
}

export default function ChatText({ position, me, text, className, seen, participants }: Props) {
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

    if (seen && participants && seen.length === 1) {
        console.log('participants: ', participants);
        console.log('seen: ', seen);
        console.log('text: ', text);
    }

    return (
        <>
            <div className={`${me && 'justify-end'} flex gap-x-1`}>
                <p className={`inline max-w-[80%] rounded-md p-3 ${getMessageClasses()} ${className}`}>{text}</p>
                <div className="flex items-end w-4">
                    {seen && participants && seen.length === 1 && (
                        <Avatar
                            size="super-nano"
                            url={participants.find((item) => item._id === seen[0])?.avatar || ''}
                        />
                    )}
                </div>
            </div>
            {seen && participants && seen.length > 1 && (
                <div className="flex justify-end">
                    {seen.map((item) => {
                        const participant = participants.find((p) => p._id === item);
                        return <Avatar key={item} size="super-nano" url={participant?.avatar || ''} />;
                    })}
                </div>
            )}
        </>
    );
}
