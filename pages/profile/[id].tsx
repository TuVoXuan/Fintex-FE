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
import postApi from '../../api/post-api';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectPost } from '../../redux/reducers/post-slice';
import { postPersonLoadMore } from '../../redux/actions/post-action';
import friendReqApi from '../../api/friend-req-api';
import { Button } from '../../components';
import { friendReqCreate } from '../../redux/actions/friend-req-action';
import { VscLoading } from 'react-icons/vsc';

interface Props {
    personId: string;
}

export default function Profile({ personId }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const sPost = useAppSelector(selectPost);
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<IUserProfileRes>();
    const [loading, setLoading] = useState<boolean>(true);
    const [relationship, setRelationship] = useState<Relationship>();
    const [loadingMakeFriendReq, setLoadingMakeFriendReq] = useState<boolean>(false);

    // const id = router.query.id as string;
    // console.log('id: ', id);

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
            // setRelationship('requesting');
            toastSuccess('Gửi lời mời kết bạn thành công');
            setLoadingMakeFriendReq(false);
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
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
                        <div className="w-full overflow-hidden rounded-t-xl image-container h-96">
                            <Image
                                src={user?.coverPhoto || ''}
                                alt="image"
                                width={100}
                                height={100}
                                layout="fill"
                                objectFit="cover"
                                objectPosition="top"
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
                                <button className="btn btn-primary ripple-bg-primary-80">Nhắn tin</button>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-[30px] px-20 rounded-[15px] bg-secondary-10 mt-7 flex">
                    <div className="sticky w-1/3 px-5 py-6 space-y-4 bg-white rounded-2xl h-fit top-3">
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
