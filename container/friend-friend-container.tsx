import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import userApi from '../api/user-api';
import FriendCard from '../components/card/friend-card';
import LoadingFriend from '../components/loading/loading-friend';
import LoadingImage from '../components/loading/loading-image';
import { toastError } from '../util/toast';

interface Props {
    personId: string;
}

export default function FriendFriendContainer({ personId }: Props) {
    const [after, setAfter] = useState<string>('');
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFriends = () => {
        if (after !== 'end') {
            userApi
                .getFriendsOfFriend({ limit: 10, after: after, id: personId })
                .then((data) => {
                    setFriends((value) => [...value, ...data.friends]), setAfter(data.after);
                })
                .catch((error) => toastError(error))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchFriends();
    }, []);

    return (
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
                        {loading ? (
                            <>
                                <LoadingFriend />
                                <LoadingFriend />
                                <LoadingFriend />
                                <LoadingFriend />
                            </>
                        ) : (
                            friends.map((friend) => (
                                <FriendCard
                                    key={friend._id}
                                    id={friend._id}
                                    avatar={friend.avatar}
                                    name={friend.name.fullName}
                                />
                            ))
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        </section>
    );
}
