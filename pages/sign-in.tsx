import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { RiUserSmileLine } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../components/avatar/avatar';
import { MainLayout } from '../layouts/main-layout';
import CreatePost from '../components/post/creat-post/create-post';
import { posts } from '../fake-data/fake-data';
import Post from '../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';

export default function SignIn() {
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

    const postsRef = useRef<HTMLDivElement>(null);

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
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    return (
        <MainLayout>
            <section className="grid grid-cols-3 ">
                <div
                    onScroll={handleShowScrollTop}
                    ref={postsRef}
                    className="h-[88vh] xl:h-[90vh] 2xl:h-[94vh] col-span-2 overflow-y-auto"
                >
                    <div className="relative py-[30px] px-20 rounded-[15px] bg-secondary-10 space-y-7">
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <div className="flex gap-3">
                                <Avatar
                                    size="medium"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662612184/avatar2_kin9jc.jpg"
                                />
                                <div className="w-full flex items-center bg-secondary-10 overflow-hidden rounded-[10px] pr-[10px]">
                                    <input
                                        onFocus={handleForcus}
                                        type="text"
                                        className="w-full items-center bg-secondary-10 text-secondary-40 px-[10px] focus:outline-none"
                                        placeholder="what's happening?"
                                    />
                                    {/* <RiUserSmileLine size={24} /> */}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-7">
                                    <button className="flex items-center gap-2">
                                        <BsCameraVideo size={16} />
                                        Live video
                                    </button>
                                    <button className="flex items-center gap-2">
                                        <BsImage size={16} />
                                        Photo/Video
                                    </button>
                                    <button className="flex items-center gap-2">
                                        <RiUserSmileLine size={16} />
                                        Feeling
                                    </button>
                                </div>

                                <button className="rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center">
                                    <h4>Post</h4>
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
                        {posts.map((post) => (
                            <Post post={post} />
                        ))}
                        {showScrollTop && (
                            <div className="absolute w-10 h-10 bottom-3 right-3">
                                <button
                                    onClick={handleScrollToTop}
                                    className="fixed p-2 bg-white border rounded-md bottom-3 hover:bg-secondary-30"
                                >
                                    <IoIosArrowUp size={20} />
                                </button>
                            </div>
                        )}
                    </div>
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
