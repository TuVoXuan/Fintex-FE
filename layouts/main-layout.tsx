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

interface Props {
    children?: Array<JSX.Element> | JSX.Element;
}

interface FormData {
    search: string;
}

export const MainLayout = ({ children }: Props) => {
    const { register, watch, getValues } = useForm<FormData>();
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const path = router.asPath;
    const [loading, setLoading] = useState<boolean>(true);

    console.log('render');

    useEffect(() => {
        console.log('change');
        let delayDebounceFn: any;
        let isFirst = true;
        const subscription = watch((value, { name, type }) => {
            console.log('loading 1', loading);
            if (isFirst) {
                setLoading(true);
                isFirst = false;
            }
            clearTimeout(delayDebounceFn);

            delayDebounceFn = setTimeout(() => {
                console.log(getValues('search'));
                setLoading(false);
                isFirst = true;
                // Send Axios request here
            }, 3000);

            if (value.search?.length !== 0) {
                if (ref.current) {
                    ref.current.classList.remove('hidden');
                }
            } else {
                console.log('vo 2');
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
            onClick={() => {
                if (ref.current) {
                    ref.current.classList.add('hidden');
                }
            }}
        >
            <div className="grid grid-cols-6 p-4 h-[12vh]">
                <div className="w-full">
                    <div className="w-1/2 h-full mx-auto cursor-pointer image-container">
                        <Image src={'/logo-and-brand-name.svg'} alt="logo" layout="fill" />
                    </div>
                </div>
                <div className="relative col-span-3">
                    <Input
                        name="search"
                        placeholder="Tìm kiếm tại đây..."
                        icon={<FiSearch size={24} />}
                        type="text"
                        register={register}
                    />
                    <div
                        ref={ref}
                        className="absolute hidden w-full p-4 space-y-1 bg-white rounded-md drop-shadow-lg top-14"
                    >
                        {!loading ? (
                            <>
                                <section className="flex items-center gap-3 p-2 rounded-md cursor-pointer ripple-bg-white">
                                    <div className="h-12 overflow-hidden rounded-full image-container aspect-square">
                                        <Image src={'/avatar1.jpg'} alt="avatar" layout="fill" />
                                    </div>
                                    <p>Nguyen Van Thang</p>
                                </section>
                                <section className="flex items-center gap-3 p-2 rounded-md cursor-pointer ripple-bg-white">
                                    <div className="h-12 overflow-hidden rounded-full image-container aspect-square">
                                        <Image src={'/avatar1.jpg'} alt="avatar" layout="fill" />
                                    </div>
                                    <p>Nguyen Van Thang</p>
                                </section>
                                <section className="flex items-center gap-3 p-2 rounded-md cursor-pointer ripple-bg-white">
                                    <div className="h-12 overflow-hidden rounded-full image-container aspect-square">
                                        <Image src={'/avatar1.jpg'} alt="avatar" layout="fill" />
                                    </div>
                                    <p>Nguyen Van Thang</p>
                                </section>
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
                    <div className="flex items-center justify-end h-full rounded-md cursor-pointer overflow-hidde drop-shadow-sm">
                        <p className="h-full p-3 bg-white rounded-l-md">nguyen van a</p>
                        <div className="h-full overflow-hidden rounded-md aspect-square image-container">
                            <Image
                                src="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                alt="avatar"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full px-4">
                <div className="w-1/6 space-y-2.5 h-full">
                    <div className="pl-1 pr-5">
                        <MenuItem
                            icon={<HiOutlineViewGrid size={20} />}
                            title={'Feed'}
                            isActive={path === APP_PATH.HOME}
                            link={APP_PATH.HOME}
                        />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem
                            icon={<FiUsers size={20} />}
                            title={'My community'}
                            isActive={path === APP_PATH.MY_COMMUNITY}
                            link={APP_PATH.MY_COMMUNITY}
                        />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<RiChatSmileLine size={20} />} title={'Message'} isActive={false} link={'#'} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem
                            icon={<RiNotification3Line size={20} />}
                            title={'Notification'}
                            isActive={false}
                            link={'#'}
                        />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<FiUser size={20} />} title={'Profile'} isActive={false} link={'#'} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem
                            icon={<IoSettingsOutline size={20} />}
                            title={'Setting'}
                            isActive={false}
                            link={'#'}
                        />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<FiLogOut size={20} />} title={'Log out'} isActive={false} link={'#'} />
                    </div>
                </div>
                <div className="w-5/6 overflow-y-auto">{children}</div>
            </div>
        </section>
    );
};
