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
import { createMessage, getMessageFirstTime, getMessagePagination } from '../../redux/actions/conversation-action';
import { isMessageSeen } from '../../util/is-message-seen';
import ImageCard from '../card/image-card';
import DivScrollHorizontal from '../div-scroll-horizontal/div-scroll-horizontal';
import { toastError } from '../../util/toast';
import { VscLoading } from 'react-icons/vsc';
import { ImageDetailContainer } from '../image/image-detail-container';
import { shortHash } from '../../util/short-hash';

interface Props {
    conversationId: string;
    participants: IParticipant[];
}

export default function ChatContainer({ conversationId, participants }: Props) {
    const { register, handleSubmit, setValue } = useForm();
    const dispatch = useAppDispatch();

    const sUser = useAppSelector(selectUser).data;
    const sMessages = useAppSelector(selectConversations).find((item) => item._id === conversationId)?.messages || [];
    const sAfter = useAppSelector(selectConversations).find((item) => item._id === conversationId)?.after;
    const refInfinityScroll = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<RefSwiper>(null);

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<IImageStore[]>([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [messImages, setMessImages] = useState<IAlbum[]>([]);
    let first = true;

    const fetchMessages = async () => {
        if (sAfter !== 'end') {
            await dispatch(
                getMessagePagination({
                    limit: 10,
                    after: sAfter,
                    conversationId,
                }),
            );
        }
    };

    const onSubmit = async (value: any) => {
        try {
            setIsSubmit(true);
            if (value.message) {
                await dispatch(
                    createMessage({
                        conversationId,
                        type: 'text',
                        text: value.message,
                    }),
                );
            }
            if (images.length > 0) {
                await dispatch(
                    createMessage({
                        conversationId,
                        type: 'image',
                        images: images.map((item) => item.file) as File[],
                    }),
                );
                setImages([]);
            }
            setValue('message', '');
            setIsSubmit(false);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const chooseAnotherImages = (other: IImageStore[]) => {
        setImages((value) => [...value, ...other]);
    };

    const onImageClick = (value: string) => () => {
        const hash = shortHash(value);
        const index = messImages.findIndex((item) => shortHash(item.url) === hash);
        if (index > -1 && swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.hidden = false;
            swiperRef.current.slideTo(index);
        }
    };

    useEffect(() => {
        const result: IAlbum[] = [];
        for (const mess of sMessages) {
            for (const subMess of mess.message) {
                if (subMess.messType === 'image') {
                    for (const image of subMess.images as string[]) {
                        result.push({
                            publicId: shortHash(image),
                            url: image,
                        });
                    }
                }
            }
        }
        setMessImages(result);
    }, [sMessages]);

    useEffect(() => {
        if (sAfter === '') {
            setLoading(true);
            dispatch(getMessageFirstTime(conversationId)).finally(() => setLoading(false));
        }
    }, [conversationId]);

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="flex gap-x-4 px-5 py-2 border-b-[1px] border-secondary-20">
                <Avatar size="small" url={participants[0].avatar} />
                <aside className="flex flex-col justify-center">
                    <p className="font-semibold">{participants[0].name.fullName}</p>
                    <p>Active now</p>
                </aside>
            </div>

            <div
                id="chat"
                ref={refInfinityScroll}
                className="flex flex-col-reverse flex-auto px-5 overflow-y-auto hover:scrollbar-show"
            >
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
                        {sMessages.map((item, index) => {
                            if (first && item.sender === sUser?._id && isMessageSeen(item)) {
                                console.log('item._id: ', item._id);
                                console.log('isMessageSeen(item): ', isMessageSeen(item));
                                console.log('item.sender === sUser?._id: ', item.sender === sUser?._id);
                                console.log('first: ', first);
                                first = false;
                                return (
                                    <ChatItemMe
                                        onImageClick={onImageClick}
                                        key={item._id}
                                        message={item}
                                        participants={participants}
                                    />
                                );
                            }

                            if (item.sender === sUser?._id) {
                                return <ChatItemMe onImageClick={onImageClick} key={item._id} message={item} />;
                            } else {
                                return (
                                    <ChatItemFriend
                                        onImageClick={onImageClick}
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
            <div className="px-5 py-2 flex border-t-[1px] border-secondary-20 gap-x-4 w-full">
                <form
                    id="chatMessage"
                    className={`w-4/5 grow border-[1px] rounded-2xl space-y-2 ${isSubmit && 'cursor-not-allowed'}`}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {images.length > 0 && (
                        <DivScrollHorizontal className="flex px-2 py-1 overflow-x-auto rounded-2xl bg-secondary-20 hover:scrollbar-show gap-x-2">
                            {images.map((image) => (
                                <ImageCard
                                    key={image.id}
                                    id={image.id}
                                    src={image.url}
                                    onClose={setImages}
                                    disabled={isSubmit}
                                />
                            ))}
                        </DivScrollHorizontal>
                    )}
                    <Input
                        name="message"
                        isTextArea
                        placeholder="Aa..."
                        isHasEmojiIcon
                        isHasPhotoIcon
                        isMultipleImages
                        disabled={isSubmit}
                        type="text"
                        onChangeImages={chooseAnotherImages}
                        register={register}
                    />
                </form>
                <button
                    type="submit"
                    form="chatMessage"
                    disabled={isSubmit}
                    className={`self-end h-full bg-blue-200 max-h-14 aspect-square rounded-2xl hover:bg-blue-300 grow-0 shrink-0 ${
                        isSubmit && 'cursor-not-allowed'
                    }`}
                >
                    {isSubmit ? (
                        <VscLoading size={24} className="mx-auto text-blue-600 animate-spin" />
                    ) : (
                        <RiSendPlane2Line className="mx-auto text-blue-600" size={24} />
                    )}
                </button>
            </div>
            <ImageDetailContainer ref={swiperRef} images={messImages} />
        </div>
    );
}
