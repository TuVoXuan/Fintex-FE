import React from 'react';
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
    if (participants) {
        console.log('participants: ', participants);
    }
    timeago.register('vi', vi);
    const length = message.message.length;

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
                                className={`text-white bg-primary-80 ${length === 1 && 'rounded-3xl'}`}
                            />
                        );
                    } else {
                        return (
                            <ChatImages
                                key={item._id}
                                position={locate(index)}
                                me
                                className={(length === 1 && 'rounded-3xl') || 'haha'}
                                images={item.images || []}
                            />
                        );
                    }
                })}
            </section>
            {participants && (
                <div className="flex justify-end">
                    {participants.map((item) => {
                        console.log('message.seen.includes(item._id): ', message.seen.includes(item._id));
                        if (message.seen.includes(item._id)) {
                            return <Avatar size="super-nano" url={item.avatar} key={item._id} />;
                        }
                    })}
                </div>
            )}
            <div className="flex justify-end">
                <TimeAgo className="text-sm" datetime={new Date(message.updatedAt)} locale="vi" />
            </div>
        </div>
    );
}
