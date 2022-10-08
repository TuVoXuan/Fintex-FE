import { RiUploadCloud2Line } from 'react-icons/ri';
import { MainLayout } from '../../layouts/main-layout';
import Image from 'next/image';
import Avatar from '../../components/avatar/avatar';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { HiOutlineCake } from 'react-icons/hi';
import { GrLocation } from 'react-icons/gr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectPost } from '../../redux/reducers/post-slice';
import LoadingPost from '../../components/post/loading-post';
import { postMineLoadMore } from '../../redux/actions/post-action';
import { toastError } from '../../util/toast';
import { useEffect, useRef, useState } from 'react';
import Post from '../../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';
import { selectUser } from '../../redux/reducers/user-slice';

export default function Profile() {
    const sUser = useAppSelector(selectUser);
    const sPost = useAppSelector(selectPost).mine;
    const dispatch = useAppDispatch();
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const handleScrollToTop = () => {
        if (postsRef.current) {
            postsRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const fetchPost = async (limit: number, after?: string) => {
        try {
            await dispatch(postMineLoadMore({ limit, after })).unwrap();
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
    }, []);

    return (
        <MainLayout>
            <section className="relative flex flex-col h-full overflow-y-auto" id="profile" ref={postsRef}>
                <section className="rounded-xl shadow-right">
                    <div className="relative">
                        <div className="w-full overflow-hidden cursor-pointer rounded-t-xl image-container h-80">
                            <Image
                                src="/images/cover-photo.jpg"
                                alt="image"
                                width={100}
                                height={100}
                                layout="responsive"
                                objectFit="cover"
                                objectPosition="center"
                            />
                        </div>

                        <button className="absolute flex items-center px-2 py-1 bg-white rounded-md bottom-3 right-3 gap-x-2">
                            <RiUploadCloud2Line size={24} />
                            Upload Cover Photo
                        </button>

                        <div className="absolute bottom-0 left-7 translate-y-[20%]">
                            <div className="relative">
                                <Avatar url={sUser.data?.avatar || ''} size="large" className="border-2 border-white" />
                                <button className="absolute p-1 bg-white rounded-full bottom-[20%] right-0 translate-y-[50%]">
                                    <RiUploadCloud2Line size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-8 px-7">
                        <h2 className="text-secondary-80">
                            {sUser.data && `${sUser.data.name.firstName} ${sUser.data.name.lastName}`}
                        </h2>
                        <button className="px-4 py-1 rounded bg-secondary-20">Edit info</button>
                    </div>
                </section>

                <section className="py-[30px] px-20 rounded-[15px] bg-secondary-10 mt-7 flex gap-x-16">
                    <div className="sticky w-1/3 px-5 py-6 space-y-4 bg-white rounded-2xl h-fit top-3">
                        <h3>INTRO</h3>
                        <div className="flex items-center gap-3 ">
                            <BsGenderAmbiguous size={20} />
                            {sUser.data?.gender}
                        </div>
                        <div className="flex items-center gap-3 ">
                            <HiOutlineCake size={20} />
                            {new Date(sUser.data?.birthday || '').toDateString()}
                        </div>
                        <div className="flex items-center gap-3 ">
                            <GrLocation size={20} />
                            {sUser.data?.address}
                        </div>
                    </div>

                    <div className="w-2/3">
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
                            scrollableTarget="profile"
                            className="relative rounded-[15px] bg-secondary-10 space-y-5"
                        >
                            {!loading ? (
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
                </section>
            </section>
        </MainLayout>
    );
}
