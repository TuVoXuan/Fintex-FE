import { useForm } from 'react-hook-form';
import { Input, MenuItem } from '../components';
import { FiSearch } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { RiChatSmileLine, RiNotification3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import APP_PATH from '../constants/app-path';
import { useRouter } from 'next/router';
import ImageContainer from '../components/image/image-container';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { selectUser, signOut } from '../redux/reducers/user-slice';
import { resetPost } from '../redux/reducers/post-slice';
import { resetComments } from '../redux/reducers/comments-slice';
import { deleteCookie } from 'cookies-next';
import { userGetStranger } from '../redux/actions/user-action';
import Stranger from '../components/stranger/stranger';
import { useMainLayout } from '../context/main-layout-contex';
import { useSocket } from '../context/socket-context';
import { selectNotification } from '../redux/reducers/notification-slice';
import { notifyGetPagination, notifyHandleSee } from '../redux/actions/notify-action';
import { toastError } from '../util/toast';
import { selectConversations } from '../redux/reducers/conversation-slice';
import { getConversations } from '../redux/actions/conversation-action';

interface Props {
    children?: React.ReactNode;
}

interface FormData {
    search: string;
}

export const MainLayout = ({ children }: Props) => {
    const { register, watch, getValues } = useForm<FormData>();
    const ref = useRef<HTMLDivElement>(null);
    const sUser = useAppSelector(selectUser);
    const sConversation = useAppSelector(selectConversations);
    const sNotify = useAppSelector(selectNotification).notify;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const path = router.asPath;
    const socket = useSocket();

    const { setName } = useMainLayout();

    const [loading, setLoading] = useState<boolean>(true);
    const [strangers, setStrangers] = useState<Stranger[]>([]);
    const [after, setAfter] = useState<string>();
    const [notSeenConversation, setNotSeenConversation] = useState<number>(0);

    const handleSignOut = () => {
        try {
            socket?.disconnect();
            deleteCookie('Authorization');
            dispatch(signOut());
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleGoProfile = () => {
        dispatch(resetPost());
        dispatch(resetComments());
        router.push(`${APP_PATH.PROFILE}`);
    };

    const handleSearch = () => {
        console.log('router.basePath: ', router.pathname);
        if (router.pathname === APP_PATH.FIND_FRIENDS) {
            setName(getValues('search'));
        } else {
            router.push({
                pathname: APP_PATH.FIND_FRIENDS,
            });
        }
    };

    const handleSeeNotify = async () => {
        try {
            const arrId: { id: string }[] = [];
            sNotify.data.forEach((notify) => {
                if (!notify.isSeen) {
                    arrId.push({ id: notify._id });
                }
            });
            if (arrId.length > 0) {
                await dispatch(notifyHandleSee(arrId));
            }
            dispatch(resetComments());
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

    const handleNotSeenCoversation = () => {
        let num = 0;
        for (const conv of sConversation) {
            if (conv.messages.length > 0) {
                const isSeen = conv.messages[0].message[conv.messages[0].message.length - 1].seen.includes(
                    sUser.data?._id || '',
                );
                if (conv.messages.length > 0 && !isSeen && conv.messages[0].sender !== sUser.data?._id) {
                    num++;
                    break;
                }
            }
        }
        return num;
    };

    const fetchConversations = async () => {
        try {
            if (sConversation.length === 0) {
                await dispatch(getConversations()).unwrap();
            }
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        setNotSeenConversation(handleNotSeenCoversation());
    }, [sConversation]);

    useEffect(() => {
        let delayDebounceFn: any;
        let isFirst = true;
        const subscription = watch((value, { name, type }) => {
            // console.log('loading 1', loading);
            if (isFirst) {
                setLoading(true);
                isFirst = false;
            }
            clearTimeout(delayDebounceFn);

            delayDebounceFn = setTimeout(async () => {
                isFirst = true;
                try {
                    if (value.search) {
                        setName(getValues('search'));

                        const { data, after } = await dispatch(
                            userGetStranger({
                                name: value.search || '',
                                limit: 5,
                                after: '',
                            }),
                        ).unwrap();
                        setStrangers(data);
                        setAfter(after);
                    }
                } catch (error) {
                    console.log('error: ', error);
                }
                setLoading(false);
            }, 1000);

            if (value.search?.length !== 0) {
                if (ref.current) {
                    ref.current.classList.remove('hidden');
                }
            } else {
                if (ref.current) {
                    ref.current.classList.add('hidden');
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch]);

    useEffect(() => {
        if (sNotify.data.length === 0 && !sNotify.after && !sNotify.ended) {
            const limit = +(process.env.LIMIT_NOTIFY as string);
            fetchNotify(limit);
        }

        fetchConversations();
    }, []);

    return (
        <section
            className="flex justify-center h-screen"
            onClick={() => {
                if (ref.current) {
                    setTimeout(() => {
                        if (ref.current) {
                            ref.current.classList.add('hidden');
                        }
                    }, 500);
                }
            }}
        >
            <section className="max-w-[1366px] w-full flex flex-col">
                <div className="grid items-center grid-cols-6 p-4">
                    <div className="w-full">
                        <div className="w-2/3 h-full mx-auto cursor-pointer image-container">
                            <ImageContainer url="/logo-and-brand-name.svg" background="bg-white" quantity="single" />
                        </div>
                    </div>
                    <div className="relative col-span-3">
                        <Input
                            name="search"
                            border={true}
                            onKeyPress={handleSearch}
                            placeholder="Tìm kiếm tại đây..."
                            icon={<FiSearch size={24} />}
                            type="text"
                            register={register}
                        />
                        <div
                            ref={ref}
                            className="absolute z-10 hidden w-full p-4 space-y-1 bg-white rounded-md drop-shadow-lg top-14"
                        >
                            {!loading ? (
                                <>
                                    {strangers.map((item) => (
                                        <Stranger
                                            key={item._id}
                                            userId={item._id}
                                            name={item.fullName}
                                            avatar={item.avatar}
                                        />
                                    ))}
                                    {after ? (
                                        <div
                                            onClick={handleSearch}
                                            className="p-2 rounded-md cursor-pointer hover:bg-secondary-20"
                                        >
                                            <p className="text-center text-primary-80">
                                                Xem thêm kết quả tìm kiếm tại đây
                                            </p>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <section className="flex items-center gap-3 p-2 rounded-md cursor-pointer animate-pulse ripple-bg-white">
                                        <div className="h-12 overflow-hidden rounded-full bg-slate-200 image-container aspect-square"></div>
                                        <div className="w-1/2 h-6 rounded bg-slate-200"></div>
                                    </section>
                                    <section className="flex items-center gap-3 p-2 rounded-md cursor-pointer animate-pulse ripple-bg-white">
                                        <div className="h-12 overflow-hidden rounded-full bg-slate-200 image-container aspect-square"></div>
                                        <div className="w-1/2 h-6 rounded bg-slate-200"></div>
                                    </section>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div
                            onClick={handleGoProfile}
                            className="flex items-center justify-end h-full rounded-md cursor-pointer overflow-hidde drop-shadow-sm"
                        >
                            <p className="h-full p-3 bg-white rounded-l-md">
                                {sUser.data?.name.lastName
                                    ? `${sUser.data.name.firstName} ${sUser.data.name.lastName}`
                                    : sUser.data?.name.firstName}
                            </p>
                            <div className="w-12">
                                <ImageContainer
                                    url={sUser.data?.avatar || (process.env.DEFAULT_AVATAR as string)}
                                    quantity="multiple"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex-1">
                    <div className="absolute top-0 bottom-0 left-0 right-0 flex px-4">
                        <div className="gap-y-2.5 w-1/5">
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<HiOutlineViewGrid size={20} />}
                                    title={'Feed'}
                                    isActive={path === APP_PATH.HOME}
                                    link={APP_PATH.HOME}
                                    onClick={() => dispatch(resetPost())}
                                />
                            </div>
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<RiChatSmileLine size={20} />}
                                    title={'Message'}
                                    isActive={path === APP_PATH.CHAT}
                                    link={APP_PATH.CHAT}
                                    notSeenNum={notSeenConversation}
                                />
                            </div>
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<RiNotification3Line size={20} />}
                                    title={'Notification'}
                                    isActive={path === APP_PATH.NOTIFICATION}
                                    link={APP_PATH.NOTIFICATION}
                                    notSeenNum={sNotify.notSeen}
                                    onClick={handleSeeNotify}
                                />
                            </div>
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<IoSettingsOutline size={20} />}
                                    title={'Setting'}
                                    isActive={path.includes('/setting')}
                                    link={APP_PATH.EDIT_PROFILE}
                                />
                            </div>
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<FiLogOut size={20} />}
                                    title={'Sign out'}
                                    isActive={false}
                                    link={'/sign-in'}
                                    onClick={handleSignOut}
                                />
                            </div>
                        </div>
                        <div className="w-full">{children}</div>
                    </div>
                </div>
            </section>
        </section>
    );
};
