import { useRouter } from 'next/router';
import React from 'react';
import { BsPeople } from 'react-icons/bs';
import { FiLock, FiUser } from 'react-icons/fi';
import SettingItem from '../components/setting-item/setting-item';
import APP_PATH from '../constants/app-path';
import { MainLayout } from './main-layout';

interface Props {
    children: React.ReactNode | React.ReactNode[];
}

export default function SettingLayout({ children }: Props) {
    const router = useRouter();
    const path = router.asPath;

    return (
        <MainLayout>
            <div className="flex h-full bg-secondary-10 rounded-[15px] p-7 gap-x-1">
                <div className="w-1/3 h-full bg-white rounded-l-[15px] p-5 space-y-3">
                    <SettingItem
                        icon={<FiUser size={24} />}
                        title="Thông tin cá nhân"
                        actived={path === APP_PATH.EDIT_PROFILE}
                        linkTo={APP_PATH.EDIT_PROFILE}
                    />
                    <SettingItem
                        icon={<FiLock size={24} />}
                        title="Mật khẩu"
                        actived={path === APP_PATH.CHANGE_PASS}
                        linkTo={APP_PATH.CHANGE_PASS}
                    />
                    <SettingItem
                        icon={<BsPeople size={24} />}
                        title="Lời mời kết bạn"
                        actived={path === APP_PATH.FRIEND_REQ}
                        linkTo={APP_PATH.FRIEND_REQ}
                    />
                </div>
                <div className="w-full h-full bg-white rounded-r-[15px]">{children}</div>
            </div>
        </MainLayout>
    );
}
