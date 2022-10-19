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
import { postDelete, postMineLoadMore } from '../../redux/actions/post-action';
import { toastError, toastSuccess } from '../../util/toast';
import { useEffect, useRef, useState } from 'react';
import Post from '../../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';
import { selectUser } from '../../redux/reducers/user-slice';
import { FormPost } from '../../components/post/form-post/form-post';
import DeleteModal from '../../components/modal/delete-modal';
import { deleteAllCommentsPost } from '../../redux/actions/comment-action';
import UploadAvatarModal from '../../components/modal/upload-avatar-modal';

const postTemp: IPost = {
    _id: '123',
    avatar: 'https://res.cloudinary.com/cake-shop/image/upload/v1666171462/avatar/cvnjyfjhgxdwz2zzth4n.jpg',
    createdAt: '2020-10-19',
    images: [
        {
            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666171462/avatar/cvnjyfjhgxdwz2zzth4n.jpg',
            orientation: 'vertical',
        },
        {
            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1665307479/cover/default-cover_jyhbec.jpg',
            orientation: 'horizontal',
        },
    ],
    name: {
        firstName: 'Vo Xuan',
        lastName: 'Tu',
    },
    reactions: [],
    comments: 0,
    visibleFor: 'public',
    userId: '123',
    postType: 'avatar',
};

export default function Profile() {
    const sUser = useAppSelector(selectUser);
    const sPost = useAppSelector(selectPost);
    const dispatch = useAppDispatch();
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);
    const formPostRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isShowsDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
    const [isShowsUpdateAvatarModal, setIsShowUpdateAvatarModal] = useState<boolean>(false);

    const [deletePostId, setDeletePostId] = useState<string>('');
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const [postEdit, setPostEdit] = useState<IPost | undefined>();

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
            await dispatch(postMineLoadMore({ limit, after })).unwrap();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleEditPost = (postId: string) => () => {
        setPostEdit(sPost.posts.find((item) => item._id === postId));
        setIsShowModal(true);
    };

    const handleShowDeleteModal = (postId: string) => () => {
        setDeletePostId(postId);
        setIsShowDeleteModal(true);
    };

    const handleDeletePost = async () => {
        try {
            setLoadingDelete(true);
            //delete comment
            await dispatch(deleteAllCommentsPost(deletePostId)).unwrap();
            //delete post
            await dispatch(postDelete(deletePostId)).unwrap();

            setIsShowDeleteModal(false);
            setLoadingDelete(false);

            toastSuccess('Xóa bài post thành công!');
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleColseModal = () => {
        setIsShowModal(false);
    };

    const handleClickOutSideFormPost = (event: any) => {
        const { target } = event;

        if (formPostRef.current && target && 'nodeType' in target) {
            if (!formPostRef.current.contains(target)) {
                setIsShowModal(false);
            }
        }
    };

    const handleShowUpdateAvatarModal = () => {
        setIsShowUpdateAvatarModal(true);
    };

    const handleCloseUpdateAvatarModal = () => {
        setIsShowUpdateAvatarModal(false);
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
            <section
                className="relative flex flex-col h-full overflow-y-auto"
                id="profile"
                ref={postsRef}
                onScroll={handleShowScrollTop}
            >
                <section className="rounded-xl shadow-right">
                    <div className="relative">
                        <div className="w-full overflow-hidden rounded-t-xl image-container h-80">
                            <Image
                                src={sUser.data?.coverPhoto || ''}
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
                                <button
                                    onClick={handleShowUpdateAvatarModal}
                                    className="absolute p-1 bg-white rounded-full bottom-[20%] right-0 translate-y-[50%]"
                                >
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

                <section className="py-[30px] px-20 rounded-[15px] bg-secondary-10 mt-7 flex">
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
                            className="relative rounded-[15px] bg-secondary-10 space-y-5 px-10"
                        >
                            {!loading ? (
                                sPost.posts.map((post) => (
                                    <Post
                                        key={post._id}
                                        post={post}
                                        loadInPage="profile"
                                        editPost={handleEditPost}
                                        deletePost={handleShowDeleteModal}
                                    />
                                ))
                            ) : (
                                <LoadingPost />
                            )}
                        </InfiniteScroll>
                        {/* <div className="relative rounded-[15px] bg-secondary-10 space-y-5 px-10">
                            <Post key={postTemp._id} post={postTemp} loadInPage="profile" />
                        </div> */}
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
            {isShowModal && (
                <div
                    onClick={handleClickOutSideFormPost}
                    className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center bg-secondary-80/60"
                >
                    <FormPost
                        ref={formPostRef}
                        imageUrl={sUser.data?.avatar || (process.env.DEFAULT_AVATAR as string)}
                        name={sUser.data?.name || { firstName: 'Võ', lastName: 'Xuân Tú' }}
                        onClose={handleColseModal}
                        type="update"
                        post={postEdit}
                    />
                </div>
            )}
            {isShowsDeleteModal && (
                <DeleteModal
                    objectName="bài post"
                    loading={loadingDelete}
                    onDelete={handleDeletePost}
                    onClose={() => setIsShowDeleteModal(false)}
                />
            )}
            {isShowsUpdateAvatarModal && <UploadAvatarModal onClose={handleCloseUpdateAvatarModal} />}
        </MainLayout>
    );
}
