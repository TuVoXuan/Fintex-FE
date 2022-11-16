import React from 'react';
import Avatar from '../avatar/avatar';
import ChatImages from './chat-images';
import ChatText from './chat-text';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';

interface Props {
    message: IMessage;
    senderAvatar: string;
}

export default function ChatItemFriend({ message, senderAvatar }: Props) {
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
            <div className="flex gap-x-2">
                <div className="flex items-end">
                    <Avatar size="tiny" url={senderAvatar} />
                </div>
                <aside className="w-full space-y-1">
                    <section className="space-y-1">
                        {message.message.map((item, index) => {
                            if (item.messType === 'text') {
                                return (
                                    <ChatText
                                        key={item._id}
                                        position={locate(index)}
                                        text={item.text || ''}
                                        className={`bg-secondary-10 ${length === 1 && 'rounded-3xl'}`}
                                    />
                                );
                            } else {
                                return (
                                    <ChatImages
                                        key={item._id}
                                        className={(length === 1 && 'rounded-3xl') || 'haha'}
                                        images={item.images || []}
                                        position={locate(index)}
                                    />
                                );
                            }
                        })}
                    </section>
                </aside>
            </div>
            <div className="ml-12">
                <TimeAgo className="text-sm" datetime={new Date(message.updatedAt)} locale="vi" />
            </div>
        </div>
    );
}
