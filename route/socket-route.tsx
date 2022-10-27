import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import APP_PATH from '../constants/app-path';
import { useSocket } from '../context/socket-context';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { notifyHandleSee } from '../redux/actions/notify-action';
import { addOnlineFriends, removeFriendReq, removeOfflineFriend } from '../redux/reducers/friend-slice';
import { addNotifi, addReceiveFriendReq, addSeeNotifi } from '../redux/reducers/notification-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastError, toastSuccess } from '../util/toast';

interface Props {
    children: React.ReactNode;
}

export default function SocketRoute({ children }: Props) {
    const dispatch = useAppDispatch();
    const sUser = useAppSelector(selectUser);
    const socket = useSocket();
    const router = useRouter();

    const handleSocketResponse = async (data: any) => {
        switch (data.typeSocket) {
            case 'friendReq':
                toastSuccess('Ai đó gửi lời mời kết bạn');
                console.log('data: ', data);
                dispatch(addReceiveFriendReq(data.friendReq));
                break;
            case 'friendsOnline':
                console.log('data: ', data);
                dispatch(addOnlineFriends(data.onlineFriends));
                if (data.onlineFriends.length > 0) {
                    toastSuccess('Có bạn mới online');
                }
                break;
            case 'friendOffline':
                console.log('data: ', data);
                dispatch(removeOfflineFriend(data.offlineUser));
                toastSuccess('Có bạn mới offline');
                break;
            case 'notify':
                console.log('data: ', data);

                if (window.location.pathname !== APP_PATH.NOTIFICATION) {
                    dispatch(addNotifi(data.notify));
                } else {
                    try {
                        dispatch(addSeeNotifi(data.notify));
                        await dispatch(notifyHandleSee([{ id: data.notify._id }])).unwrap();
                    } catch (error) {
                        toastError((error as IResponseError).error);
                    }
                }
                if (data.friendReqId) {
                    dispatch(removeFriendReq(data.friendReqId));
                }
                break;
            default:
                toastSuccess('you receive socket response from server');
                break;
        }
    };

    useEffect(() => {
        const userId = sUser.data?._id || '';

        if (sUser.isLogin && userId) {
            console.log('kich hoat socket');
            socket?.connect();
            // console.log('socket: ', socket);
            socket?.on(userId, function (data: any) {
                console.log('lang nghe socket tai : ', userId);
                handleSocketResponse(data);
            });
        }

        return () => {
            socket?.disconnect();
        };
    }, [socket]);

    return <>{children}</>;
}
