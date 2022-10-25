import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getCookie } from 'cookies-next';
import { useAppSelector } from '../hook/redux';
import { selectUser } from '../redux/reducers/user-slice';

export const SocketContext = createContext<Socket | null>(null);

interface Props {
    children: React.ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
    const token = getCookie('Authorization');
    const sUser = useAppSelector(selectUser);
    const socketRef = useRef<Socket>(io(`${process.env.API_HOST}/notifications`));
    // console.log('process.env.API_HOST: ', process.env.API_HOST);
    // const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        if (token) {
            socketRef.current = io(`${process.env.API_HOST}/notifications`, {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                autoConnect: false,
            });
            // setSocket(
            //     io(`${process.env.API_HOST}/notifications`, {
            //         extraHeaders: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //         autoConnect: false,
            //     }),
            // );
        }
    }, [token, sUser.data]);

    return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};
