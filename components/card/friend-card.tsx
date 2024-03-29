import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import router, { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { createConversation } from '../../redux/actions/conversation-action';
import { selectConversations } from '../../redux/reducers/conversation-slice';
import { toastError, toastSuccess } from '../../util/toast';
import { useMQTT } from '../../context/mqtt-context';
import { VscLoading } from 'react-icons/vsc';
import { resetComments } from '../../redux/reducers/comments-slice';
import { resetPost } from '../../redux/reducers/post-slice';
import { selectUser } from '../../redux/reducers/user-slice';
import friendReqApi from '../../api/friend-req-api';
import LoadingButton from '../loading/loading-button';
import { userDeleteFriend } from '../../redux/actions/user-action';
import { friendReqCreate } from '../../redux/actions/notify-action';

interface Props {
    avatar: string;
    name: string;
    id: string;
}

export default function FriendCard({ avatar, name, id }: Props) {
    const mqtt = useMQTT();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const sConversations = useAppSelector(selectConversations);
    const sUser = useAppSelector(selectUser).data;

    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const [relationship, setRelationship] = useState<Relationship>();
    const [loadingRelationship, setLoadingRelationship] = useState<boolean>(false);
    const [loadingMakeFriendReq, setLoadingMakeFriendReq] = useState<boolean>(false);

    const handleChat = async () => {
        try {
            setLoadingChat(true);
            const conversation = sConversations.find((conv) => {
                const hasCurrFriend = conv.participants.findIndex((item) => item._id === id);
                if (hasCurrFriend >= 0) {
                    return conv;
                }
                return null;
            });

            if (conversation) {
                if (mqtt) {
                    mqtt.setConversation(conversation._id);
                    router.push(APP_PATH.CHAT);
                }
            } else {
                await dispatch(createConversation(id)).unwrap();
                if (mqtt && mqtt.activedConversation.current) {
                    mqtt.setConversation('');
                }
                router.push(APP_PATH.CHAT);
            }
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
            setLoadingChat(false);
        }
    };

    const getRelationship = async (personId: string) => {
        try {
            setLoadingRelationship(true);
            const response = await friendReqApi.getRelationship(personId);
            setRelationship(response.data.data);
            setLoadingRelationship(false);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
            setLoadingRelationship(false);
        }
    };

    const handleClick = () => {
        dispatch(resetPost());
        dispatch(resetComments());
        router.push(`${APP_PATH.PROFILE}/${id}`);
    };

    const handleDeleteFriend = async () => {
        try {
            await dispatch(userDeleteFriend(id)).unwrap();
            setRelationship('notFriend');
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleMakeFriendReq = async () => {
        try {
            setLoadingMakeFriendReq(true);
            await dispatch(friendReqCreate(id));
            setRelationship('requesting');
            toastSuccess('Gửi lời mời kết bạn thành công');
            setLoadingMakeFriendReq(false);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        getRelationship(id);
    }, []);

    return (
        <div className="p-4 flex border-[1px] drop-shadow-sm rounded-lg bg-white items-center gap-4">
            <div className="w-24 h-24 overflow-hidden rounded-lg cursor-pointer" onClick={handleClick}>
                <Image
                    alt="friend avatar"
                    src={avatar}
                    width={100}
                    height={100}
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL="/images/avatar.jpg"
                />
            </div>
            <div className="content-center space-y-2 grow">
                <p className="text-lg font-semibold cursor-pointer" onClick={handleClick}>
                    {name}
                </p>
                {loadingRelationship ? (
                    <div className="flex gap-x-2">
                        <LoadingButton />
                        <LoadingButton />
                    </div>
                ) : (
                    sUser?._id !== id && (
                        <div className="flex gap-x-4">
                            {relationship !== 'isFriend' ? (
                                relationship === 'requesting' ? (
                                    <button
                                        onClick={handleMakeFriendReq}
                                        className="p-3 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300"
                                    >
                                        Đã gửi kết bạn
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleMakeFriendReq}
                                        className="p-3 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300"
                                    >
                                        Kết bạn
                                    </button>
                                )
                            ) : (
                                <>
                                    {loadingChat ? (
                                        <button className="p-2 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300">
                                            <VscLoading size={20} className="text-blue-600 animate-spin" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleChat}
                                            className="p-3 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300"
                                        >
                                            Nhắn tin
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDeleteFriend}
                                        className="p-3 font-semibold rounded-md text-secondary-80 bg-secondary-20 hover:bg-secondary-30"
                                    >
                                        Hủy kết bạn
                                    </button>
                                </>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
