import React, { useEffect, useRef, useState } from 'react';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { GrLocation } from 'react-icons/gr';
import { HiOutlineCake, HiOutlineAcademicCap } from 'react-icons/hi';
import InfiniteScroll from 'react-infinite-scroll-component';
import MiniFriendCard from '../components/card/mini-friend-card';
import { ImageDetailContainer } from '../components/image/image-detail-container';
import LoadingPost from '../components/post/loading-post';
import Post from '../components/post/post';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { postPersonLoadMore } from '../redux/actions/post-action';
import { resetComments } from '../redux/reducers/comments-slice';
import { resetPost, selectPost } from '../redux/reducers/post-slice';
import { toastError } from '../util/toast';
import Image from 'next/image';
import userApi from '../api/user-api';

interface Props {
    personId: string;
    gender: 'male' | 'female' | 'other';
    birthday: string;
    address?: string;
    education?: string;
    onSwitchPage: (value: 'post' | 'album' | 'friend') => () => void;
}

export default function FriendProfilePostContainer({
    personId,
    gender,
    birthday,
    address,
    education,
    onSwitchPage,
}: Props) {
    const swiperRef = useRef<RefSwiper>(null);
    const sPost = useAppSelector(selectPost);

    const dispatch = useAppDispatch();

    const [friends, setFriends] = useState<IFriend[]>([]);
    const [album, setAlbum] = useState<IAlbum[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPost = async (personId: string, limit: number, after?: string) => {
        try {
            await dispatch(postPersonLoadMore({ loadMore: { limit, after }, personId }));
        } catch (error) {
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

    useEffect(() => {
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

        userApi
            .getFriendsOfFriend({ limit: 9, id: personId })
            .then((data) => setFriends(data.friends))
            .catch((error) => toastError(error));

        return () => {
            setAlbum([]);
            dispatch(resetPost());
            dispatch(resetComments());
        };
    }, [personId]);

    return (
        <section className="py-[30px] px-12 rounded-[15px] bg-secondary-10 mt-7 flex cursor-default">
            <div className="sticky w-1/3 space-y-4 -top-3/4 h-fit">
                <div className="p-6 space-y-4 bg-white rounded-2xl h-fit">
                    <h3>Giới thiệu</h3>
                    <div className="flex items-center gap-3 ">
                        <BsGenderAmbiguous size={20} />
                        {gender === 'male' && 'Nam'}
                        {gender === 'female' && 'Nữ'}
                        {gender === 'other' && 'Khác'}
                    </div>
                    <div className="flex items-center gap-3 ">
                        <HiOutlineCake size={20} />
                        {new Date(birthday || '').toLocaleDateString('vi', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                        })}
                    </div>
                    {address && (
                        <div className="flex items-center gap-3 ">
                            <GrLocation size={20} />
                            {address}
                        </div>
                    )}
                    {education && (
                        <div className="flex items-center gap-3 ">
                            <HiOutlineAcademicCap size={20} />
                            {education}
                        </div>
                    )}
                </div>
                <div className="p-6 space-y-4 bg-white rounded-2xl">
                    <div className="flex items-end justify-between">
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
                <div className="p-6 space-y-4 bg-white rounded-2xl">
                    <div className="flex items-center justify-between">
                        <h3>Bạn bè</h3>
                        <p onClick={onSwitchPage('friend')} className="cursor-pointer hover:text-blue-500">
                            Xem tất cả bạn bè
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {friends.map((item) => (
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
                    {!loading ? sPost.posts.map((post) => <Post key={post._id} post={post} />) : <LoadingPost />}
                </InfiniteScroll>
            </div>
            <ImageDetailContainer images={album} ref={swiperRef} />
        </section>
    );
}
