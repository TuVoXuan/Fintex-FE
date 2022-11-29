import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Input } from '..';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectUser } from '../../redux/reducers/user-slice';
import LoadingMessages from '../loading/loading-messages';
import ChatItemFriend from './chat-item-friend';
import ChatItemMe from './chat-item-me';
import { selectConversations } from '../../redux/reducers/conversation-slice';
import {
    createMessage,
    getMessageFirstTime,
    getMessagePagination,
    leaveConv,
} from '../../redux/actions/conversation-action';
import { isMessageSeen } from '../../util/is-message-seen';
import ImageCard from '../card/image-card';
import DivScrollHorizontal from '../div-scroll-horizontal/div-scroll-horizontal';
import { toastError } from '../../util/toast';
import { VscLoading } from 'react-icons/vsc';
import AvatarChat from '../avatar/avatar-chat';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { selectFriend } from '../../redux/reducers/friend-slice';
import { ImageDetailContainer } from '../image/image-detail-container';
import { shortHash } from '../../util/short-hash';
import { BsThreeDots } from 'react-icons/bs';
import SettingGroupChatModal from '../modal/setting-group-chat-modal';
import ChatNotify from './chat-notify';
import NormalModal from '../modal/normal-modal';

interface Props {
    conversationId: string;
    name: string;
    participants: IParticipant[];
    removedMember: IParticipant[];
}

export default function ChatContainer({ conversationId, participants, removedMember, name }: Props) {
    timeago.register('vi', vi);
    const { register, handleSubmit, setValue } = useForm();
    const dispatch = useAppDispatch();

    const sUser = useAppSelector(selectUser).data;
    const sConv = useAppSelector(selectConversations).find((item) => item._id === conversationId);
    const sOnlineFriends = useAppSelector(selectFriend).onlineFriends;
    const refInfinityScroll = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<RefSwiper>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<IImageStore[]>([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [messImages, setMessImages] = useState<IAlbum[]>([]);
    const [showSettingGroupChatModal, setShowSettingGroupChatModal] = useState<boolean>(false);
    const [showPopup, setshowPopup] = useState<boolean>(false);
    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState<boolean>(false);

    let first = true;

    const handleShowSettingModal = () => {
        setShowSettingGroupChatModal(true);
    };

    const handleCloseSettingModal = () => {
        setShowSettingGroupChatModal(false);
    };

    const handleShowPopup = () => {
        setshowPopup(!showPopup);
    };

    const handleShowLeaveGroupModal = () => {
        setShowLeaveGroupModal(!showLeaveGroupModal);
    };

    const handleLeaveConv = async () => {
        try {
            await dispatch(leaveConv(conversationId)).unwrap();
            setShowLeaveGroupModal(false);
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const fetchMessages = async () => {
        if (sConv?.after !== 'end') {
            await dispatch(
                getMessagePagination({
                    limit: 10,
                    after: sConv?.after,
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

    const onImageClick = useCallback(
        (value: string) => () => {
            const hash = shortHash(value);
            const index = messImages.findIndex((item) => shortHash(item.url) === hash);
            if (index > -1 && swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.hidden = false;
                swiperRef.current.slideTo(index);
            }
        },
        [messImages],
    );

    useEffect(() => {
        const result: IAlbum[] = [];
        if (sConv) {
            for (const mess of sConv.messages) {
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
        }
        setMessImages(result);
    }, [sConv?.messages]);

    useEffect(() => {
        if (sConv?.after === '') {
            setLoading(true);
            dispatch(getMessageFirstTime(conversationId)).finally(() => setLoading(false));
        }
    }, [conversationId]);

    return (
        <>
            <div className="flex flex-col w-full h-full overflow-hidden">
                <div className="flex gap-x-4 px-5 py-2 border-b-[1px] border-secondary-20">
                    <AvatarChat onlyDisplay conversationId={conversationId} participants={participants} size="small" />
                    {/* <Avatar size="small" url={participants[0].avatar} /> */}
                    <aside className="flex items-center justify-between w-full">
                        <div className="flex flex-col justify-center">
                            <p className="font-semibold">{name ? name : participants[0].name.fullName}</p>
                            {sConv && (
                                <>
                                    {sConv.isOnline ? (
                                        <p>Đang hoạt động</p>
                                    ) : (
                                        <>{sConv.lastActive && <TimeAgo datetime={sConv.lastActive} locale="vi" />}</>
                                    )}
                                </>
                            )}
                        </div>
                        {sConv && sConv.participants.length > 1 && (
                            <button
                                onClick={handleShowPopup}
                                className="relative p-2 transition-colors duration-300 ease-linear bg-white rounded-full bg-secondary-2 hover:bg-secondary-20"
                            >
                                <BsThreeDots size={20} />
                                {showPopup && (
                                    <div
                                        ref={popupRef}
                                        className="absolute right-[50%] top-[50%] border-[1.5px] rounded-lg bg-secondary-10 z-10"
                                    >
                                        <div className="p-1 border-b-[1.5px]">
                                            <button
                                                onClick={handleShowSettingModal}
                                                className="w-full px-3 py-2 transition-colors duration-300 ease-linear rounded-lg hover:bg-secondary-20 whitespace-nowrap"
                                            >
                                                Cài đặt
                                            </button>
                                        </div>
                                        <div className="p-1 border-b-[1.5px]">
                                            <button
                                                onClick={() => alert('thêm thành viên')}
                                                className="w-full px-3 py-2 transition-colors duration-300 ease-linear rounded-lg hover:bg-secondary-20 whitespace-nowrap"
                                            >
                                                Thêm thành viên
                                            </button>
                                        </div>
                                        <div className="p-1">
                                            <button
                                                onClick={handleShowLeaveGroupModal}
                                                className="w-full px-3 py-2 transition-colors duration-300 ease-linear rounded-lg whitespace-nowrap hover:bg-secondary-20"
                                            >
                                                Rời nhóm
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </button>
                        )}
                    </aside>
                </div>

                <div
                    id="chat"
                    ref={refInfinityScroll}
                    className="flex flex-col-reverse flex-auto px-5 pb-2 overflow-y-auto hover:scrollbar-show"
                >
                    {loading ? (
                        <LoadingMessages />
                    ) : (
                        <InfiniteScroll
                            next={fetchMessages}
                            hasMore={sConv?.after !== 'end'}
                            dataLength={sConv?.messages.length || 0}
                            inverse={true}
                            loader={<LoadingMessages />}
                            className="flex flex-col-reverse gap-y-5"
                            scrollableTarget="chat"
                        >
                            {sConv &&
                                sConv.messages.map((item, index) => {
                                    if (item.message[0].messType === 'notify') {
                                        return (
                                            <ChatNotify
                                                avatar={
                                                    participants.find((part) => part._id === item.sender)?.avatar ||
                                                    removedMember.find((part) => part._id === item.sender)?.avatar ||
                                                    ''
                                                }
                                                name={
                                                    participants.find((part) => part._id === item.sender)?.name
                                                        .fullName ||
                                                    removedMember.find((part) => part._id === item.sender)?.name
                                                        .fullName ||
                                                    ''
                                                }
                                                message={item.message[0].text || ''}
                                            />
                                        );
                                    }

                                    if (first && item.sender === sUser?._id && isMessageSeen(item)) {
                                        first = false;
                                        return (
                                            <ChatItemMe
                                                onImageClick={onImageClick}
                                                key={item._id}
                                                message={item}
                                                participants={[...participants, ...removedMember]}
                                            />
                                        );
                                    }

                                    if (first && item.sender !== sUser?._id) {
                                        first = false;
                                        return (
                                            <ChatItemFriend
                                                onImageClick={onImageClick}
                                                key={item._id}
                                                message={item}
                                                senderAvatar={
                                                    participants.find((part) => part._id === item.sender)?.avatar ||
                                                    removedMember.find((part) => part._id === item.sender)?.avatar ||
                                                    ''
                                                }
                                                participants={[...participants, ...removedMember]}
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
                                                    participants.find((part) => part._id === item.sender)?.avatar ||
                                                    removedMember.find((part) => part._id === item.sender)?.avatar ||
                                                    ''
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
            </div>
            {showSettingGroupChatModal && sConv && (
                <SettingGroupChatModal convId={conversationId} onClose={handleCloseSettingModal} />
            )}
            {showLeaveGroupModal && (
                <NormalModal
                    acceptBtnTitle="Rời nhóm"
                    cancleBtnTitle="Hủy bỏ"
                    onAccept={handleLeaveConv}
                    onCancle={handleShowLeaveGroupModal}
                    subTitle="Khi rời nhóm bạn sẽ không nhận được bất kì tin nhắn mới nào nữa."
                    title="Rời nhóm"
                />
            )}
        </>
    );
}
