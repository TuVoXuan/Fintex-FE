import React, { memo, useEffect, useState } from 'react';
import Avatar from '../avatar/avatar';
import ChatImages from './chat-images';
import ChatText from './chat-text';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { useAppSelector } from '../../hook/redux';
import { selectUser } from '../../redux/reducers/user-slice';

interface Props {
    message: IMessage;
    senderAvatar: string;
    onImageClick: (value: string) => () => void;
    participants?: IParticipant[];
}

function ChatItemFriend({ message, senderAvatar, onImageClick, participants }: Props) {
    timeago.register('vi', vi);
    const length = message.message.length;
    const [id, setId] = useState<string>('');
    console.log('id: ', id);
    const userId = useAppSelector(selectUser).data?._id || '';

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
            <div className="flex gap-x-2">
                <div className={`flex items-end ${participants ? 'mb-[18px]' : ''}`}>
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
                                        participants={item._id === id ? participants : undefined}
                                        seen={
                                            item._id === id
                                                ? [message.sender, ...item.seen.filter((item) => userId !== item)]
                                                : undefined
                                        }
                                    />
                                );
                            } else {
                                return (
                                    <ChatImages
                                        key={item._id}
                                        onClick={onImageClick}
                                        className={(length === 1 && 'rounded-3xl') || 'haha'}
                                        images={item.images || []}
                                        position={locate(index)}
                                        participants={item._id === id ? participants : undefined}
                                        seen={
                                            item._id === id
                                                ? [message.sender, ...item.seen.filter((item) => userId !== item)]
                                                : undefined
                                        }
                                    />
                                );
                            }
                        })}
                    </section>
                </aside>
            </div>
            <div className={`ml-12 ${participants ? 'absolute -translate-y-full' : ''}`}>
                <TimeAgo className="text-xs" datetime={new Date(message.updatedAt)} locale="vi" />
            </div>
        </div>
    );
}

export default memo(ChatItemFriend, (prevProps, nextProps) => {
    if (
        prevProps.message === nextProps.message &&
        prevProps.onImageClick === nextProps.onImageClick &&
        prevProps.senderAvatar === nextProps.senderAvatar
    ) {
        return true;
    }
    return false;
});
