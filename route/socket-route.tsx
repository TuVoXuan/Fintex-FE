import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSocket } from '../context/socket-context';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { addOnlineFriends, removeOfflineFriend } from '../redux/reducers/friend-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastSuccess } from '../util/toast';

interface Props {
    children: React.ReactNode;
}

export default function SocketRoute({ children }: Props) {
    const dispatch = useAppDispatch();
    const sUser = useAppSelector(selectUser);
    const socket = useSocket();
    const router = useRouter();

    const handleSocketResponse = (data: any) => {
        switch (data.type) {
            case 'friendReq':
                toastSuccess('Ai đó gửi lời mời kết bạn');
                console.log('data: ', data);
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
