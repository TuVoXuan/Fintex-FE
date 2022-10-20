import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Input, MenuItem } from '../components';
import { FiSearch } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
import { RiChatSmileLine, RiNotification3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import APP_PATH from '../constants/app-path';
import { useRouter } from 'next/router';
import ImageContainer from '../components/image/image-container';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { selectUser, signOut } from '../redux/reducers/user-slice';
import { resetPost } from '../redux/reducers/post-slice';
import { resetComments } from '../redux/reducers/comments-slice';
import { resetFeeling } from '../redux/reducers/feeling-slice';
import { resetOtp } from '../redux/reducers/otp-slice';
import { deleteCookie } from 'cookies-next';
import { userGetStranger } from '../redux/actions/user-action';
import Stranger from '../components/stranger/stranger';
import { useMainLayout } from '../context/main-layout-contex';

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
    const dispatch = useAppDispatch();
    const router = useRouter();
    const path = router.asPath;

    const { setName } = useMainLayout();

    const [loading, setLoading] = useState<boolean>(true);
    const [strangers, setStrangers] = useState<Stranger[]>([]);

    const handleSignOut = () => {
        try {
            deleteCookie('Authorization');
            dispatch(signOut());
            dispatch(resetPost());
            dispatch(resetComments());
            dispatch(resetFeeling());
            dispatch(resetOtp());
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleGoProfile = () => {
        dispatch(resetPost());
        router.push(`${APP_PATH.PROFILE}/${sUser.data?._id}`);
    };

    const handleGoEditInfo = () => {
        router.push(APP_PATH.EDIT_PROFILE);
    };

    const handleEnter = () => {
        console.log('router.basePath: ', router.pathname);
        if (router.pathname === APP_PATH.FIND_FRIENDS) {
            setName(getValues('search'));
        } else {
            router.push({
                pathname: APP_PATH.FIND_FRIENDS,
            });
        }
    };

    useEffect(() => {
        let delayDebounceFn: any;
        let isFirst = true;
        const subscription = watch((value, { name, type }) => {
            console.log('loading 1', loading);
            if (isFirst) {
                setLoading(true);
                isFirst = false;
            }
            clearTimeout(delayDebounceFn);

            delayDebounceFn = setTimeout(async () => {
                isFirst = true;
                try {
                    if (value.search) {
                        const { data } = await dispatch(
                            userGetStranger({
                                name: value.search || '',
                                limit: 10,
                                after: '',
                            }),
                        ).unwrap();
                        setStrangers(data);
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

    return (
        <section
            className="flex justify-center h-screen"
            onClick={() => {
                if (ref.current) {
                    ref.current.classList.add('hidden');
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
                            onKeyPress={handleEnter}
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
                                strangers.map((item) => (
                                    <Stranger key={item._id} name={item.fullName} avatar={item.avatar} />
                                ))
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
                            {/* <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<FiUsers size={20} />}
                                    title={'My community'}
                                    isActive={path === APP_PATH.MY_COMMUNITY}
                                    link={APP_PATH.MY_COMMUNITY}
                                />
                            </div> */}
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<RiChatSmileLine size={20} />}
                                    title={'Message'}
                                    isActive={false}
                                    link={'#'}
                                />
                            </div>
                            <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<RiNotification3Line size={20} />}
                                    title={'Notification'}
                                    isActive={false}
                                    link={'#'}
                                />
                            </div>
                            {/* <div className="pl-1 pr-5">
                                <MenuItem
                                    icon={<FiUser size={20} />}
                                    title={'Profile'}
                                    isActive={path === APP_PATH.PROFILE}
                                    link={APP_PATH.PROFILE}
                                />
                            </div> */}
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
