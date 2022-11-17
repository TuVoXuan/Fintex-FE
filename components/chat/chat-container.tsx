import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Input } from '..';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectUser } from '../../redux/reducers/user-slice';
import Avatar from '../avatar/avatar';
import LoadingMessages from '../loading/loading-messages';
import ChatItemFriend from './chat-item-friend';
import ChatItemMe from './chat-item-me';
import { selectConversations } from '../../redux/reducers/conversation-slice';
import { createMessage, getMessageFirstTime } from '../../redux/actions/conversation-action';

interface Props {
    conversationId: string;
    participants: IParticipant[];
}

export default function ChatContainer({ conversationId, participants }: Props) {
    const { register, handleSubmit } = useForm();
    const dispatch = useAppDispatch();

    const sUser = useAppSelector(selectUser).data;
    const sMessages = useAppSelector(selectConversations).find((item) => item._id === conversationId)?.messages || [];
    const sAfter = useAppSelector(selectConversations).find((item) => item._id === conversationId)?.after;

    const refInfinityScroll = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    // const [isFirst, setIsFirst] = useState(true);
    let first = true;

    const fetchMessages = () => {
        if (sAfter !== 'end') {
            return 'haha';
        }
    };

    const onSubmit = async (value: any) => {
        dispatch(
            createMessage({
                conversationId,
                type: 'text',
                text: value.message,
            }),
        ).catch((error) => console.log('error: ', error));
    };

    useEffect(() => {
        if (sAfter === '') {
            setLoading(true);
            dispatch(getMessageFirstTime(conversationId)).finally(() => setLoading(false));
        }
    }, [conversationId]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex gap-x-4 px-5 py-2 border-b-[1px] border-secondary-20">
                <Avatar size="small" url={participants[0].avatar} />
                <aside className="flex flex-col justify-center">
                    <p className="font-semibold">{participants[0].name.fullName}</p>
                    <p>Active now</p>
                </aside>
            </div>

            <div id="chat" ref={refInfinityScroll} className="flex flex-col-reverse flex-auto px-5 overflow-y-auto">
                {loading ? (
                    <LoadingMessages />
                ) : (
                    <InfiniteScroll
                        next={fetchMessages}
                        hasMore={sAfter !== 'end'}
                        dataLength={sMessages.length}
                        inverse={true}
                        loader={<LoadingMessages />}
                        className="flex flex-col-reverse gap-y-5"
                        scrollableTarget="chat"
                    >
                        {sMessages.map((item) => {
                            if (first && item.sender === sUser?._id && item.seen.length > 0) {
                                first = false;
                                return <ChatItemMe key={item._id} message={item} participants={participants} />;
                            }

                            if (item.sender === sUser?._id) {
                                return <ChatItemMe key={item._id} message={item} />;
                            } else {
                                return (
                                    <ChatItemFriend
                                        key={item._id}
                                        message={item}
                                        senderAvatar={
                                            participants.find((part) => part._id === item.sender)?.avatar || ''
                                        }
                                    />
                                );
                            }
                        })}
                    </InfiniteScroll>
                )}
            </div>
            <div className="px-5 py-2 flex border-t-[1px] border-secondary-20 w-full gap-x-4">
                <form id="chatMessage" className="grow shrink-0" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        name="message"
                        border={true}
                        isTextArea
                        placeholder="Aa..."
                        isHasEmojiIcon
                        isHasPhotoIcon
                        type="text"
                        register={register}
                    />
                </form>
                <button
                    type="submit"
                    form="chatMessage"
                    className="self-end h-full bg-blue-200 max-h-14 aspect-square rounded-2xl hover:bg-blue-300 grow-0 shrink-0"
                >
                    <RiSendPlane2Line className="mx-auto text-blue-600" size={24} />
                </button>
            </div>
        </div>
    );
}
