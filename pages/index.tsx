import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { RiUserSmileLine } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../components/avatar/avatar';
import { MainLayout } from '../layouts/main-layout';
import Post from '../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { resetPost, selectPost } from '../redux/reducers/post-slice';
import { postLoadMore } from '../redux/actions/post-action';
import { toastError } from '../util/toast';
import LoadingPost from '../components/post/loading-post';
import { selectUser } from '../redux/reducers/user-slice';
import { NextPage } from 'next';
import 'swiper/css';
import 'swiper/css/navigation';
import { FormPost } from '../components/post/form-post/form-post';
import OnlineCard from '../components/card/online-card';
import { selectFriend } from '../redux/reducers/friend-slice';
import Image from 'next/image';
import { resetComments } from '../redux/reducers/comments-slice';
import { getConversations } from '../redux/actions/conversation-action';
import { selectConversations } from '../redux/reducers/conversation-slice';

const Home: NextPage = () => {
    const dispatch = useAppDispatch();
    const sPost = useAppSelector(selectPost);
    const sUser = useAppSelector(selectUser);
    const sConversation = useAppSelector(selectConversations);
    const onlineFriends = useAppSelector(selectFriend).onlineFriends;

    const [loading, setLoading] = useState<boolean>(true);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);

    const postsRef = useRef<HTMLDivElement>(null);
    const scrollTopRef = useRef<HTMLButtonElement>(null);

    const handleForcus = () => {
        setIsShowModal(true);
    };

    const handleColseModal = () => {
        setIsShowModal(false);
    };

    const handleScrollToTop = () => {
        if (postsRef.current) {
            postsRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

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

    const fetchConversations = async () => {
        try {
            if (sConversation.length === 0) {
                await dispatch(getConversations()).unwrap();
            }
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const fetchPost = async (limit: number, after?: string) => {
        try {
            await dispatch(postLoadMore({ limit, after })).unwrap();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        if (sPost.posts.length === 0 && !sPost.after && !sPost.ended) {
            const limit = +(process.env.LIMIT as string);

            fetchPost(limit);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

        if (sPost.posts.length > 0) {
            setLoading(false);
        }

        fetchConversations();
    }, []);

    return (
        <MainLayout>
            <section className="relative flex h-full">
                <div
                    id="feetPosts"
                    onScroll={handleShowScrollTop}
                    ref={postsRef}
                    className="w-3/4 hover:scrollbar-show overflow-y-auto"
                >
                    <InfiniteScroll
                        next={() => {
                            if (!sPost.ended) {
                                const limit = +(process.env.LIMIT as string);
                                if (sPost.after) {
                                    fetchPost(limit, sPost.after);
                                }
                            }
                        }}
                        hasMore={!sPost.ended}
                        loader={<LoadingPost />}
                        dataLength={sPost.posts.length}
                        scrollableTarget="feetPosts"
                        className="relative py-[30px] px-40 rounded-[15px] bg-secondary-10 space-y-5"
                    >
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <div className="flex gap-3">
                                <Avatar
                                    size="medium"
                                    url={
                                        sUser.data
                                            ? sUser.data.avatar
                                            : 'https://res.cloudinary.com/cake-shop/image/upload/v1663325246/Fintex/default-avatar_vpm7pw.jpg'
                                    }
                                />
                                <div className="w-full flex items-center bg-secondary-10 overflow-hidden rounded-[10px] pr-[10px]">
                                    <input
                                        onFocus={handleForcus}
                                        type="text"
                                        className="w-full items-center bg-secondary-10 text-secondary-40 px-[10px] focus:outline-none"
                                        placeholder="Hôm nay bản cảm thấy thế nào?"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-7">
                                    <button className="flex items-center gap-2">
                                        <BsCameraVideo size={16} />
                                        Trực tiếp
                                    </button>
                                    <button className="flex items-center gap-2">
                                        <BsImage size={16} />
                                        Ảnh/Video
                                    </button>
                                    <button className="flex items-center gap-2">
                                        <RiUserSmileLine size={16} />
                                        Cảm xúc
                                    </button>
                                </div>

                                <button className="rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center">
                                    <h4>Đăng</h4>
                                </button>
                            </div>
                        </div>

                        {isShowModal && (
                            <FormPost
                                imageUrl={sUser.data?.avatar || (process.env.DEFAULT_AVATAR as string)}
                                name={sUser.data?.name || { firstName: 'Võ', lastName: 'Xuân Tú' }}
                                onClose={handleColseModal}
                                type="create"
                            />
                        )}
                        {!loading ? sPost.posts.map((post) => <Post key={post._id} post={post} />) : <LoadingPost />}

                        <div className="absolute w-10 h-10 bottom-3 right-3">
                            <button
                                ref={scrollTopRef}
                                onClick={handleScrollToTop}
                                className="fixed p-2 bg-white border rounded-md bottom-3 hover:bg-secondary-30"
                            >
                                <IoIosArrowUp size={20} />
                            </button>
                        </div>
                    </InfiniteScroll>
                </div>
                <aside className="w-1/4 h-full overflow-y-auto hover:scrollbar-show">
                    <p className="ml-5 text-xl font-semibold">Friends</p>

                    {onlineFriends.length > 0 ? (
                        onlineFriends.map((friend) => (
                            <OnlineCard
                                key={friend._id}
                                id={friend._id}
                                url={friend.avatar}
                                name={
                                    friend.name.lastName
                                        ? `${friend.name.firstName} ${friend.name.lastName}`
                                        : friend.name.firstName
                                }
                            />
                        ))
                    ) : (
                        <div className="px-6 pt-4">
                            <Image
                                src={'/images/online-user.svg'}
                                height={100}
                                width={100}
                                alt={'no one onlines'}
                                layout="responsive"
                                objectFit="contain"
                                placeholder="blur"
                                blurDataURL="/images/avatar.jpg"
                            />
                            <p className="mt-3 text-center">Không có bạn online</p>
                        </div>
                    )}
                </aside>
            </section>
            {isShowModal && (
                <div
                    onClick={handleColseModal}
                    className="fixed top-0 bottom-0 left-0 right-0 z-10 opacity-60 bg-secondary-80 blur-sm"
                ></div>
            )}
        </MainLayout>
    );
};

export default Home;
