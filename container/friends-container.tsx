import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import userApi from '../api/user-api';
import FriendCard from '../components/card/friend-card';
import LoadingImage from '../components/loading/loading-image';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { userGetFriends } from '../redux/actions/user-action';
import { selectFriend } from '../redux/reducers/friend-slice';
import { toastError } from '../util/toast';

export default function FriendsContainer() {
    const sFriend = useAppSelector(selectFriend).friends;
    const dispatch = useAppDispatch();

    const fetchFriends = () => {
        if (sFriend.after !== 'end')
            dispatch(userGetFriends({ limit: 10, after: sFriend.after })).catch((error) => toastError(error));
    };

    return (
        <section className="py-[30px] px-12 rounded-[15px] bg-secondary-10 mt-7 flex cursor-default">
            <div className="w-full p-8 space-y-4 bg-white rounded-lg">
                <h3>Bạn bè</h3>

                <InfiniteScroll
                    next={() => {
                        if (sFriend.after !== 'ended') {
                            fetchFriends();
                        }
                    }}
                    hasMore={sFriend.after !== 'end'}
                    loader={<LoadingImage />}
                    dataLength={sFriend.data.length}
                    scrollableTarget="friends"
                >
                    <div className="grid grid-cols-2 gap-4">
                        {sFriend.data.map((friend) => (
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
    );
}
