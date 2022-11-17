import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FriendReqCard from '../components/card/friend-req-card';
import NotifyCard from '../components/card/notify-card';
import LoadingFriendReqCard from '../components/loading/loading-friend-req-card';
import LoadingNotify from '../components/loading/loading-nofity';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { MainLayout } from '../layouts/main-layout';
import { friendReqGetPagination, notifyGetPagination } from '../redux/actions/notify-action';
import { selectNotification } from '../redux/reducers/notification-slice';
import { toastError } from '../util/toast';
import Image from 'next/image';

export default function Notification() {
    const dispatch = useAppDispatch();
    const sFriendReq = useAppSelector(selectNotification).friendReq;
    const sNotify = useAppSelector(selectNotification).notify;

    const [loading, setLoading] = useState<boolean>(true);

    const fetchFriendReq = async (limit: number, after?: string) => {
        try {
            await dispatch(friendReqGetPagination({ limit, after })).unwrap();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const fetchNotify = async (limit: number, after?: string) => {
        try {
            await dispatch(notifyGetPagination({ limit, after })).unwrap();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        if (sFriendReq.data.length === 0 && !sFriendReq.after && !sFriendReq.ended) {
            const limit = +(process.env.LIMIT_FQ as string);

            fetchFriendReq(limit);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

        if (sNotify.data.length === 0 && !sNotify.after && !sNotify.ended) {
            const limit = +(process.env.LIMIT_NOTIFY as string);
            fetchNotify(limit);
        }

        if (sFriendReq.data.length > 0) {
            setLoading(false);
        }
    }, []);

    return (
        <MainLayout>
            <div className="flex h-full bg-secondary-10 rounded-[15px] p-7 gap-x-3">
                <div id="nofifyDiv" className="w-1/2 h-full overflow-y-auto bg-white rounded-l-[15px]">
                    {sNotify.data.length > 0 ? (
                        <InfiniteScroll
                            next={() => {
                                if (!sNotify.ended) {
                                    const limit = +(process.env.LIMIT_NOTIFY as string);
                                    console.log('limit: ', limit);
                                    if (sNotify.after) {
                                        fetchNotify(limit, sNotify.after);
                                    }
                                }
                            }}
                            hasMore={!sNotify.ended}
                            loader={<LoadingNotify />}
                            dataLength={sNotify.data.length}
                            scrollableTarget="nofifyDiv"
                            className="p-5"
                        >
                            <h3 className="mb-3">Thông báo</h3>
                            <div className="space-y-3">
                                {sNotify.data.map((req) => (
                                    <NotifyCard key={req._id} notify={req} />
                                ))}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        <div className="flex flex-col justify-center p-5">
                            <h3 className="mb-3">Thông báo</h3>
                            <Image src={'/images/notification.svg'} height={300} width={300} objectFit="contain" />
                            <p className="pt-5 text-center">Không có thông báo</p>
                        </div>
                    )}
                </div>
                <div id="friendReqDiv" className="w-1/2 h-full overflow-y-auto bg-white rounded-l-[15px]">
                    {sFriendReq.data.length > 0 ? (
                        <InfiniteScroll
                            next={() => {
                                if (!sFriendReq.ended) {
                                    const limit = +(process.env.LIMIT_FQ as string);
                                    console.log('limit: ', limit);
                                    if (sFriendReq.after) {
                                        fetchFriendReq(limit, sFriendReq.after);
                                    }
                                }
                            }}
                            hasMore={!sFriendReq.ended}
                            loader={
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <LoadingFriendReqCard />
                                    <LoadingFriendReqCard />
                                </div>
                            }
                            dataLength={sFriendReq.data.length}
                            scrollableTarget="friendReqDiv"
                            className="p-5"
                        >
                            <h3 className="mb-3">Lời mời kết bạn</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {loading ? (
                                    <>
                                        <LoadingFriendReqCard />
                                        <LoadingFriendReqCard />
                                    </>
                                ) : (
                                    sFriendReq.data.map((req) => (
                                        <FriendReqCard key={req._id} user={req.user} friendReqId={req._id} />
                                    ))
                                )}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        <div className="flex flex-col justify-center p-5">
                            <h3 className="mb-3">Lời mời kết bạn</h3>
                            <Image src={'/images/friend-request.svg'} height={300} width={300} objectFit="contain" />
                            <p className="pt-5 text-center">Không có lời mời kết bạn</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
