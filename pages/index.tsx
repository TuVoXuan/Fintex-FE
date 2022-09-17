import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { RiUserSmileLine } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../components/avatar/avatar';
import { MainLayout } from '../layouts/main-layout';
import CreatePost from '../components/post/creat-post/create-post';
import Post from '../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { selectPost } from '../redux/reducers/post-slice';
import { postLoadMore } from '../redux/actions/post-action';
import { toastError } from '../util/toast';
import LoadingPost from '../components/post/loading-post';
import { selectUser } from '../redux/reducers/user-slice';

export default function SignIn() {
    const dispatch = useAppDispatch();
    const sPost = useAppSelector(selectPost);
    const sUser = useAppSelector(selectUser);
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
        }
    }, []);

    return (
        <MainLayout>
            <section className="grid grid-cols-3 ">
                <div
                    id="feetPosts"
                    onScroll={handleShowScrollTop}
                    ref={postsRef}
                    className="h-[80vh] lg:h-[89vh] xl:h-[91vh] 2xl:h-[94vh] col-span-2 overflow-y-auto"
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
                        className="relative py-[30px] px-20 rounded-[15px] bg-secondary-10 space-y-5"
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
                            <CreatePost
                                imageUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662819438/image18_xwgv8v.jpg"
                                name={{ firstName: 'Võ', lastName: 'Xuân Tú' }}
                                onClose={handleColseModal}
                            />
                        )}
                        {sPost.posts.length > 0 ? (
                            sPost.posts.map((post) => <Post key={post._id} post={post} />)
                        ) : (
                            <LoadingPost />
                        )}

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
                <div className="relative">
                    <div className="bg-yellow-300">
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                    </div>
                </div>
            </section>
            {isShowModal && (
                <div
                    onClick={handleColseModal}
                    className="fixed top-0 bottom-0 left-0 right-0 z-10 opacity-60 bg-secondary-80 blur-sm"
                ></div>
            )}
        </MainLayout>
    );
}
