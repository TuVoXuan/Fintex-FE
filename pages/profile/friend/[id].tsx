import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import InfiniteScroll from 'react-infinite-scroll-component';
import userApi from '../../../api/user-api';
import Avatar from '../../../components/avatar/avatar';
import FriendCard from '../../../components/card/friend-card';
import { ImageDetailContainer } from '../../../components/image/image-detail-container';
import LoadingImage from '../../../components/loading/loading-image';
import { useAppDispatch, useAppSelector } from '../../../hook/redux';
import { MainLayout } from '../../../layouts/main-layout';
import { userGetFriends } from '../../../redux/actions/user-action';
import { selectFriend } from '../../../redux/reducers/friend-slice';
import { selectUser } from '../../../redux/reducers/user-slice';
import { toastError } from '../../../util/toast';

interface Props {
    personId: string;
}

export default function FriendsPage({ personId }: Props) {
    const sUser = useAppSelector(selectUser);
    const sFriend = useAppSelector(selectFriend).friends;
    const dispatch = useAppDispatch();

    const [user, setUser] = useState<IUserProfileRes>();
    const [after, setAfter] = useState<string>();
    const [friends, setFriends] = useState<IFriend[]>([]);

    const fetchUser = () => {
        if (sUser.data && sUser.data._id !== personId) {
            userApi
                .getProfile(personId)
                .then((data) => setUser(data.data.data))
                .catch((error) => toastError(error));
        }
    };

    const fetchFriends = () => {
        if (sUser.data?._id === personId) {
            if (sFriend.after !== 'end')
                dispatch(userGetFriends({ limit: 10, after: sFriend.after })).catch((error) => toastError(error));
        } else {
            if (after !== 'end') {
                userApi
                    .getFriendsOfFriend({ limit: 10, after: after, id: personId })
                    .then((data) => {
                        setFriends((value) => [...value, ...data.friends]);
                        setAfter(data.after);
                    })
                    .catch((error) => toastError(error));
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, [sUser]);

    useEffect(() => {
        fetchFriends();
    }, [sUser.data, sFriend]);

    return (
        <MainLayout>
            <section className="relative flex flex-col h-full overflow-y-auto hover:scrollbar-show" id="friends">
                <section className="rounded-xl shadow-right">
                    <div className="relative">
                        <div className="w-full overflow-hidden rounded-t-xl image-container h-96">
                            <Image
                                src={user?.coverPhoto || sUser.data?.coverPhoto || ''}
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
                                <Avatar
                                    url={user?.avatar || sUser.data?.avatar || ''}
                                    size="large"
                                    className="border-2 border-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-8 px-7">
                        <h2 className="text-secondary-80">
                            {(user && `${user.name.firstName} ${user.name.lastName}`) ||
                                (sUser.data && `${sUser.data.name.firstName} ${sUser.data.name.lastName}`)}
                        </h2>
                    </div>
                </section>
                <section className="py-[30px] px-12 rounded-[15px] bg-secondary-10 mt-7 flex cursor-default">
                    <div className="w-full p-8 space-y-4 bg-white rounded-lg">
                        <h3>Bạn bè</h3>

                        <InfiniteScroll
                            next={() => {
                                if (after && after !== 'ended') {
                                    fetchFriends();
                                }
                            }}
                            hasMore={after !== 'end' && after !== ''}
                            loader={<LoadingImage />}
                            dataLength={friends.length}
                            scrollableTarget="friends"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {friends.map((friend) => (
                                    <FriendCard
                                        key={friend._id}
                                        id={friend._id}
                                        avatar={friend.avatar}
                                        name={friend.name.fullName}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
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
