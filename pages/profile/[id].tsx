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

interface Props {
    personId: string;
}

export default function Profile({ personId }: Props) {
    const mqtt = useMQTT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const sPost = useAppSelector(selectPost);
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<RefSwiper>(null);
    const sConversations = useAppSelector(selectConversations);
    const sUser = useAppSelector(selectUser);

    const [user, setUser] = useState<IUserProfileRes>();
    const [loading, setLoading] = useState<boolean>(true);
    const [album, setAlbum] = useState<IAlbum[]>([]);
    const [relationship, setRelationship] = useState<Relationship>();
    const [loadingMakeFriendReq, setLoadingMakeFriendReq] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);

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

    const fetchPost = async (personId: string, limit: number, after?: string) => {
        try {
            await dispatch(postPersonLoadMore({ loadMore: { limit, after }, personId }));
        } catch (error) {
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

    const getRelationship = async (personId: string) => {
        try {
            const response = await friendReqApi.getRelationship(personId);
            setRelationship(response.data.data);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
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

    const getImageClasses = (index: number, arrayLength: number, col: number): string => {
        let className = 'overflow-hidden image-container';
        const row = Math.floor(arrayLength / col);

        if (index === 0) {
            className += ' rounded-tl-lg';
            if (arrayLength <= col) {
                className += ' rounded-bl-lg';
            }
        }
        if (index === col - 1) {
            className += ' rounded-tr-lg';
        }
        if (index === arrayLength - 1) {
            className += ' rounded-br-lg';
            if (row === 0) {
                className += ' rounded-tr-lg';
            }
        }
        if (index === row * col) {
            className += ' rounded-bl-lg';
        }
        if (arrayLength - 1 >= row * col && arrayLength < row * col + col && index === row * col - 1) {
            className += ' rounded-br-lg';
        }

        if (index === 1) {
            // console.log(className);
        }

        return className;
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

    useEffect(() => {
        getUserProfile(personId);
        getRelationship(personId);
        const limit = +(process.env.LIMIT as string);

        if (sPost.posts.length === 0 && !sPost.after && !sPost.ended) {
            fetchPost(personId, limit);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

        if (sPost.posts.length > 0) {
            setLoading(false);
        }

        userApi
            .getAlbum({ limit: 9, after: '', id: personId })
            .then((data) => setAlbum(data.album))
            .catch((error) => toastError(error));

        return () => {
            setUser(undefined);
            setAlbum([]);
            setRelationship(undefined);
            dispatch(resetPost());
            dispatch(resetComments());
        };
    }, [personId]);

    return (
        <MainLayout>
            <section
                className="relative flex flex-col h-full overflow-y-auto hover:scrollbar-show"
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
                </section>

                <section className="py-[30px] px-20 rounded-[15px] bg-secondary-10 mt-7 flex">
                    <div className="sticky w-1/3 space-y-4 top-3">
                        <div className="px-5 py-6 space-y-4 bg-white rounded-2xl h-fit">
                            <h3>Giới thiệu</h3>
                            <div className="flex items-center gap-3 ">
                                <BsGenderAmbiguous size={20} />
                                {user?.gender === 'male' && 'Nam'}
                                {user?.gender === 'female' && 'Nữ'}
                                {user?.gender === 'other' && 'Khác'}
                            </div>
                            <div className="flex items-center gap-3 ">
                                <HiOutlineCake size={20} />
                                {new Date(user?.birthday || '').toLocaleDateString('vi', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit',
                                })}
                            </div>
                            {user?.address && (
                                <div className="flex items-center gap-3 ">
                                    <GrLocation size={20} />
                                    {user.address}
                                </div>
                            )}
                            {user?.education && (
                                <div className="flex items-center gap-3 ">
                                    <HiOutlineAcademicCap size={20} />
                                    {user.education.name}
                                </div>
                            )}
                        </div>
                        <div className="px-5 py-6 space-y-4 bg-white rounded-2xl">
                            <div className="flex items-end justify-between">
                                <h3>Ảnh</h3>
                                <p
                                    onClick={() => {
                                        router.push(`${APP_PATH.ALBUM}/${user?._id}`);
                                    }}
                                    className="cursor-pointer hover:text-blue-500"
                                >
                                    Xem tất cả ảnh
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
                                {album.map((image, index, array) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                if (swiperRef.current) {
                                                    swiperRef.current.swiper.hidden = false;
                                                    swiperRef.current.slideTo(index);
                                                }
                                            }}
                                            key={image.publicId}
                                            className={`${getImageClasses(
                                                index,
                                                array.length,
                                                3,
                                            )} relative after:absolute after:content-[""] after:top-0 after:bottom-0 after:left-0 after:right-0 hover:after:bg-gray-500 hover:after:opacity-40 cursor-pointer`}
                                        >
                                            <Image
                                                src={image.url}
                                                key={image.publicId}
                                                alt="image"
                                                width={100}
                                                height={100}
                                                layout="responsive"
                                                objectFit="cover"
                                                objectPosition="center"
                                                placeholder="blur"
                                                blurDataURL="/images/avatar.jpg"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3">
                        <InfiniteScroll
                            next={() => {
                                if (!sPost.ended) {
                                    const limit = +(process.env.LIMIT as string);
                                    if (sPost.after) {
                                        fetchPost(personId, limit, sPost.after);
                                    }
                                }
                            }}
                            hasMore={!sPost.ended}
                            loader={<LoadingPost />}
                            dataLength={sPost.posts.length}
                            scrollableTarget="profile"
                            className="relative rounded-[15px] bg-secondary-10 space-y-5 px-10"
                        >
                            {!loading ? (
                                sPost.posts.map((post) => <Post key={post._id} post={post} />)
                            ) : (
                                <LoadingPost />
                            )}
                        </InfiniteScroll>
                        <div className="absolute w-10 h-10 bottom-3 right-3">
                            <button
                                ref={scrollTopRef}
                                onClick={handleScrollToTop}
                                className="fixed p-2 bg-white border rounded-md bottom-3 hover:bg-secondary-30"
                            >
                                <IoIosArrowUp size={20} />
                            </button>
                        </div>
                    </div>
                </section>
            </section>
            {/* <div hidden ref={swiperRef} className="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black">
                <IoClose
                    onClick={() => {
                        if (swiperRef.current) {
                            swiperRef.current.hidden = true;
                        }
                    }}
                    size={48}
                    className="fixed z-40 p-2 bg-white rounded-full cursor-pointer drop-shadow-md right-6 top-6"
                />
                <Swiper
                    onSwiper={(e) => {
                        setSwiper(e);
                    }}
                    navigation={true}
                    modules={[Navigation]}
                    className="w-full h-full"
                >
                    {album.map((item) => (
                        <SwiperSlide key={item.publicId}>
                            <Image
                                src={item.url}
                                layout="fill"
                                alt="post image"
                                objectFit="contain"
                                placeholder="blur"
                                blurDataURL="/images/avatar.jpg"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div> */}
            <ImageDetailContainer images={album} ref={swiperRef} />
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
