import { MainLayout } from '../../layouts/main-layout';
import Image from 'next/image';
import Avatar from '../../components/avatar/avatar';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { HiOutlineAcademicCap, HiOutlineCake } from 'react-icons/hi';
import { GrLocation } from 'react-icons/gr';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingPost from '../../components/post/loading-post';
import { toastError, toastSuccess } from '../../util/toast';
import { useEffect, useRef, useState } from 'react';
import Post from '../../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';
import { useRouter } from 'next/router';
import userApi from '../../api/user-api';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { resetPost, selectPost } from '../../redux/reducers/post-slice';
import { postPersonLoadMore } from '../../redux/actions/post-action';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoClose } from 'react-icons/io5';
import SwiperCore from 'swiper';
import APP_PATH from '../../constants/app-path';
import friendReqApi from '../../api/friend-req-api';
import { friendReqCreate } from '../../redux/actions/notify-action';
import { VscLoading } from 'react-icons/vsc';
import { resetComments } from '../../redux/reducers/comments-slice';
import { selectConversations } from '../../redux/reducers/conversation-slice';
import { selectUser } from '../../redux/reducers/user-slice';
import { createConversation } from '../../redux/actions/conversation-action';
import { useMQTT } from '../../context/mqtt-context';
import { ImageDetailContainer } from '../../components/image/image-detail-container';
import MiniFriendCard from '../../components/card/mini-friend-card';
import FriendProfilePostContainer from '../../container/friend-profile-post-container';
import AlbumContainer from '../../container/album-container';
import FriendsContainer from '../../container/friends-container';
import FriendFriendContainer from '../../container/friend-friend-container';
import NavItem from '../../components/nav-item/nav-item';

interface Props {
    personId: string;
}

export default function Profile({ personId }: Props) {
    const mqtt = useMQTT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);
    const sConversations = useAppSelector(selectConversations);

    const [user, setUser] = useState<IUserProfileRes>();
    const [loading, setLoading] = useState<boolean>(true);
    const [relationship, setRelationship] = useState<Relationship>();
    const [loadingMakeFriendReq, setLoadingMakeFriendReq] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const [container, setContainer] = useState<'post' | 'album' | 'friend'>('post');

    const handleShowScrollTop = (e: any) => {
        if (e.target.scrollTop > 400) {
            if (scrollTopRef.current) {
                scrollTopRef.current.hidden = false;
            }
        } else {
            if (scrollTopRef.current) {
                scrollTopRef.current.hidden = true;
            }
        }
    };

    const handleScrollToTop = () => {
        if (postsRef.current) {
            postsRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleMakeFriendReq = async () => {
        try {
            setLoadingMakeFriendReq(true);
            await dispatch(friendReqCreate(personId));
            setRelationship('requesting');
            toastSuccess('Gửi lời mời kết bạn thành công');
            setLoadingMakeFriendReq(false);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const handleChat = async () => {
        try {
            setLoading(true);
            const conversation = sConversations.find((conv) => {
                const hasCurrFriend = conv.participants.findIndex((item) => item._id === user?._id);
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
                if (user) {
                    await dispatch(createConversation(user._id)).unwrap();
                    if (mqtt && mqtt.activedConversation.current) {
                        mqtt.setConversation('');
                    }
                    router.push(APP_PATH.CHAT);
                }
            }
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
            setLoading(false);
        }
    };

    const getRelationship = async (personId: string) => {
        try {
            const response = await friendReqApi.getRelationship(personId);
            setRelationship(response.data.data);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const getUserProfile = async (personId: string) => {
        try {
            const response = await userApi.getProfile(personId);
            setUser(response.data.data);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const handleSwitchPage = (value: 'post' | 'album' | 'friend') => () => {
        setContainer(value);
    };

    const handleRenderPage = () => {
        switch (container) {
            case 'post':
                return (
                    <FriendProfilePostContainer
                        personId={personId}
                        address={user?.address}
                        birthday={user?.birthday || new Date().toISOString()}
                        gender={user?.gender || 'male'}
                        education={user?.education.name}
                        onSwitchPage={handleSwitchPage}
                    />
                );
            case 'album':
                return <AlbumContainer personId={user?._id || ''} />;
            case 'friend':
                return <FriendFriendContainer personId={user?._id || ''} />;
            default:
                return <></>;
        }
    };

    useEffect(() => {
        getUserProfile(personId);
        getRelationship(personId);
    }, []);

    return (
        <MainLayout>
            <section
                className="relative flex flex-col h-full overflow-y-auto scroll-smooth hover:scrollbar-show"
                id="profile"
                ref={postsRef}
                onScroll={handleShowScrollTop}
            >
                <section className="rounded-xl shadow-right">
                    <div className="relative">
                        <div className="w-full overflow-hidden rounded-t-xl image-container h-96">
                            <Image
                                src={user?.coverPhoto || ''}
                                alt="image"
                                width={100}
                                height={100}
                                layout="fill"
                                objectFit="cover"
                                objectPosition="top"
                                placeholder="blur"
                                blurDataURL="/images/avatar.jpg"
                            />
                        </div>

                        <div className="absolute bottom-0 left-7 translate-y-[20%]">
                            <div className="relative">
                                <Avatar url={user?.avatar || ''} size="large" className="border-2 border-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between py-8 px-7">
                            <h2 className="text-secondary-80">
                                {user && `${user.name.firstName} ${user.name.lastName}`}
                            </h2>
                        </div>

                        <div className="pr-4">
                            {relationship === 'notFriend' && (
                                <>
                                    {loadingMakeFriendReq ? (
                                        <button disabled className="px-14 btn btn-primary">
                                            <VscLoading className="animate-spin" size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleMakeFriendReq}
                                            className="btn btn-primary ripple-bg-primary-80"
                                        >
                                            Kết bạn
                                        </button>
                                    )}
                                </>
                            )}
                            {relationship === 'requesting' && (
                                <button
                                    disabled
                                    className="btn bg-secondary-20 ripple-bg-secondary-20 text-secondary-80"
                                >
                                    Đã gửi kết bạn
                                </button>
                            )}
                            {relationship === 'isFriend' && (
                                <>
                                    {loadingChat ? (
                                        <button disabled className="px-14 btn btn-primary">
                                            <VscLoading className="animate-spin" size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={handleChat} className="btn btn-primary ripple-bg-primary-80">
                                            Nhắn tin
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <nav className="px-4 space-x-4 overflow-hidden rounded-xl">
                        <NavItem title="Bài viết" actived={container === 'post'} onClick={handleSwitchPage('post')} />
                        <NavItem title="Ảnh" actived={container === 'album'} onClick={handleSwitchPage('album')} />
                        <NavItem title="Bạn bè" actived={container === 'friend'} onClick={handleSwitchPage('friend')} />
                    </nav>
                </section>
                {handleRenderPage()}
                <div className="absolute w-10 h-10 bottom-3 right-3">
                    <button
                        ref={scrollTopRef}
                        onClick={handleScrollToTop}
                        className="fixed p-2 bg-white border rounded-md bottom-3 hover:bg-secondary-30"
                    >
                        <IoIosArrowUp size={20} />
                    </button>
                </div>
            </section>
        </MainLayout>
    );
}

export async function getServerSideProps(context: any) {
    const id = context.query.id;

    return {
        props: {
            personId: id,
        },
    };
}
