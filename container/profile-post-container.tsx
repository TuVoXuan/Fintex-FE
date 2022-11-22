import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { GrLocation } from 'react-icons/gr';
import { HiOutlineCake, HiOutlineAcademicCap } from 'react-icons/hi';
import { IoIosArrowUp } from 'react-icons/io';
import InfiniteScroll from 'react-infinite-scroll-component';
import educationApi from '../api/education-api';
import userApi from '../api/user-api';
import MiniFriendCard from '../components/card/mini-friend-card';
import { ImageDetailContainer } from '../components/image/image-detail-container';
import DeleteModal from '../components/modal/delete-modal';
import { FormPost } from '../components/post/form-post/form-post';
import LoadingPost from '../components/post/loading-post';
import Post from '../components/post/post';
import APP_PATH from '../constants/app-path';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { deleteAllCommentsPost } from '../redux/actions/comment-action';
import { postDelete, postMineLoadMore } from '../redux/actions/post-action';
import { userGetFriends } from '../redux/actions/user-action';
import { selectFriend } from '../redux/reducers/friend-slice';
import { selectPost } from '../redux/reducers/post-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastSuccess, toastError } from '../util/toast';
import Image from 'next/image';

interface Props {
    onSwitchPage: (value: 'post' | 'album' | 'friend') => () => void;
}

export default function ProfilePostContainer({ onSwitchPage }: Props) {
    const swiperRef = useRef<RefSwiper>(null);
    const sFriends = useAppSelector(selectFriend).friends;
    const sPost = useAppSelector(selectPost);
    const formPostRef = useRef<HTMLDivElement>(null);
    const sUser = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(true);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isShowsDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [postEdit, setPostEdit] = useState<IPost | undefined>();
    const [educations, setEducations] = useState<IEducation[]>([]);
    const [album, setAlbum] = useState<IAlbum[]>([]);
    const [deletePostId, setDeletePostId] = useState<string>('');

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

    const fetchPost = async (limit: number, after?: string) => {
        try {
            await dispatch(postMineLoadMore({ limit, after })).unwrap();
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

        educationApi
            .getEducations()
            .then((data) => setEducations(data))
            .catch((error) => toastError(error));

        userApi
            .getMyAlbum({ limit: 9 })
            .then((data) => setAlbum(data.album))
            .catch((error) => toastError(error));
    }, []);

    useEffect(() => {
        if (sFriends.data.length === 0) {
            dispatch(userGetFriends({ limit: 9 })).catch((error) => toastError(error));
        }
    }, [sFriends]);

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
            console.log(className);
        }

        return className;
    };

    return (
        <>
            <section className="py-[30px] px-12 rounded-[15px] bg-secondary-10 mt-7 flex cursor-default">
                <div className="sticky w-1/3 space-y-4 -top-full h-fit">
                    <div className="px-5 py-6 space-y-4 bg-white rounded-2xl">
                        <h3>Giới thiệu</h3>
                        <div className="flex items-center gap-3 ">
                            <BsGenderAmbiguous size={20} />
                            {sUser.data?.gender === 'male' && 'Nam'}
                            {sUser.data?.gender === 'female' && 'Nữ'}
                            {sUser.data?.gender === 'other' && 'Khác'}
                        </div>
                        <div className="flex items-center gap-3 ">
                            <HiOutlineCake size={20} />
                            {new Date(sUser.data?.birthday || '').toLocaleDateString('vi', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit',
                            })}
                        </div>
                        {sUser.data?.address && (
                            <div className="flex items-center gap-3 ">
                                <GrLocation size={20} />
                                {sUser.data.address}
                            </div>
                        )}
                        {sUser.data?.education && (
                            <div className="flex items-center gap-3 ">
                                <HiOutlineAcademicCap size={20} />
                                {educations.find((item) => item._id === sUser.data?.education)?.name}
                            </div>
                        )}
                    </div>
                    <div className="px-5 py-6 space-y-4 bg-white rounded-2xl">
                        <div className="flex items-center justify-between">
                            <h3>Ảnh</h3>
                            <p onClick={onSwitchPage('album')} className="cursor-pointer hover:text-blue-500">
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
                    <div className="px-5 py-6 space-y-4 bg-white rounded-2xl">
                        <div className="flex items-center justify-between">
                            <h3>Bạn bè</h3>
                            <p onClick={onSwitchPage('friend')} className="cursor-pointer hover:text-blue-500">
                                Xem tất cả bạn bè
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {sFriends.data.map((item) => (
                                <MiniFriendCard
                                    key={item._id}
                                    id={item._id}
                                    avatar={item.avatar}
                                    name={item.name.fullName}
                                />
                            ))}
                        </div>
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
                                    showActionPost
                                    editPost={handleEditPost}
                                    deletePost={handleShowDeleteModal}
                                />
                            ))
                        ) : (
                            <LoadingPost />
                        )}
                    </InfiniteScroll>
                </div>
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
            <ImageDetailContainer images={album} ref={swiperRef} />
        </>
    );
}
