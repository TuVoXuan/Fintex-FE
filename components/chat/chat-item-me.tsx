import React, { useEffect, useState } from 'react';
import ChatText from './chat-text';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import ChatImages from './chat-images';
import Avatar from '../avatar/avatar';

interface Props {
    message: IMessage;
    participants?: IParticipant[];
}

export default function ChatItemMe({ message, participants }: Props) {
    timeago.register('vi', vi);
    const length = message.message.length;
    const [id, setId] = useState<string>('');
    if (participants) {
        console.log('id: ', id);
    }

    const locate = (index: number) => {
        switch (index) {
            case 0:
                return 'first';
            case length - 1:
                return 'last';
            default:
                return 'middle';
        }
    };

    useEffect(() => {
        let index = -1;
        message.message.forEach((item, itemIndex) => {
            if (item.seen.length > 0) {
                index = itemIndex;
            }
        });
        if (index > -1) {
            setId(message.message[index]._id);
        }
    }, [participants, message]);

    return (
        <div className="space-y-1">
            <section className="space-y-1">
                {message.message.map((item, index) => {
                    if (item.messType === 'text') {
                        return (
                            <ChatText
                                key={item._id}
                                position={locate(index)}
                                text={item.text || ''}
                                me
                                participants={item._id === id ? participants : undefined}
                                seen={item._id === id ? item.seen : undefined}
                                className={`text-white bg-primary-80 ${length === 1 && 'rounded-3xl'}`}
                            />
                        );
                    } else {
                        return (
                            <ChatImages
                                key={item._id}
                                position={locate(index)}
                                me
                                participants={item._id === id ? participants : undefined}
                                seen={item._id === id ? item.seen : undefined}
                                className={(length === 1 && 'rounded-3xl') || 'haha'}
                                images={item.images || []}
                            />
                        );
                    }
                })}
            </section>
            <div className="flex justify-end">
                <TimeAgo className="text-sm" datetime={new Date(message.updatedAt)} locale="vi" />
            </div>
        </div>
    );
}
function useSate<T>(arg0: string): [any, any] {
    throw new Error('Function not implemented.');
}
