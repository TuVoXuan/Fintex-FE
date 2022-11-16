import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FriendReqCard from '../../components/card/friend-req-card';
import LoadingFriendReqCard from '../../components/loading/loading-friend-req-card';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import SettingLayout from '../../layouts/setting-layout';
import { userGetSendFriendReq } from '../../redux/actions/user-action';
import { selectFriend } from '../../redux/reducers/friend-slice';
import { toastError } from '../../util/toast';
import Image from 'next/image';

export default function FriendRequest() {
    const sendFriendReq = useAppSelector(selectFriend).friendReq;
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(true);

    const fetchFriendReq = async (limit: number, after?: string) => {
        try {
            await dispatch(userGetSendFriendReq({ limit, after, type: 'send' })).unwrap();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        if (sendFriendReq.data.length === 0 || (!sendFriendReq.after && !sendFriendReq.ended)) {
            const limit = +(process.env.LIMIT_SFQ as string);

            fetchFriendReq(limit);
        }
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <SettingLayout>
            <div id="friendReqDiv" className="h-full overflow-y-auto bg-white">
                {loading ? (
                    <div className="px-12 py-4 space-y-3">
                        <h3 className="mb-3">Lời mời kết bạn</h3>
                        <LoadingFriendReqCard type="send" />
                        <LoadingFriendReqCard type="send" />
                    </div>
                ) : (
                    <>
                        {sendFriendReq.data.length > 0 ? (
                            <InfiniteScroll
                                next={() => {
                                    if (!sendFriendReq.ended) {
                                        const limit = +(process.env.LIMIT_SFQ as string);
                                        console.log('limit: ', limit);
                                        if (sendFriendReq.after) {
                                            fetchFriendReq(limit, sendFriendReq.after);
                                        }
                                    }
                                }}
                                hasMore={!sendFriendReq.ended}
                                loader={
                                    <div className="space-y-3">
                                        <LoadingFriendReqCard type="send" />
                                        <LoadingFriendReqCard type="send" />
                                    </div>
                                }
                                dataLength={sendFriendReq.data.length}
                                scrollableTarget="friendReqDiv"
                                className="px-12 py-4 space-y-3"
                            >
                                <h3 className="mb-3">Lời mời kết bạn</h3>
                                <div className="space-y-3">
                                    {loading ? (
                                        <>
                                            <LoadingFriendReqCard type="send" />
                                            <LoadingFriendReqCard type="send" />
                                        </>
                                    ) : (
                                        sendFriendReq.data.map((req) => (
                                            <FriendReqCard
                                                type="send"
                                                key={req._id}
                                                user={req.user}
                                                friendReqId={req._id}
                                            />
                                        ))
                                    )}
                                </div>
                            </InfiniteScroll>
                        ) : (
                            <div className="flex flex-col justify-center px-12 py-4">
                                <h3 className="mb-3">Lời mời kết bạn</h3>
                                <Image
                                    src={'/images/friend-request.svg'}
                                    height={300}
                                    width={300}
                                    objectFit="contain"
                                />
                                <p className="pt-5 text-center">Không có lời mời kết bạn</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </SettingLayout>
    );
}
