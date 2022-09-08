import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Input, MenuItem } from '../components';
import { FiSearch } from 'react-icons/fi';
import { useEffect } from 'react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
import { RiChatSmileLine, RiNotification3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';

interface Props {
    children?: Array<JSX.Element> | JSX.Element;
}

export const MainLayout = ({ children }: Props) => {
    const { register } = useForm();

    return (
        <section>
            <div className="grid grid-cols-6 h-[20%] p-4">
                <div className="w-full h-full">
                    <div className="w-1/2 h-full mx-auto image-container">
                        <Image src={'/logo-and-brand-name.svg'} alt="logo" layout="fill" />
                    </div>
                </div>
                <div className="col-span-3">
                    <Input
                        name="search"
                        placeholder="Tìm kiếm tại đây..."
                        icon={<FiSearch size={24} />}
                        type="text"
                        register={register}
                    />
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-end h-full rounded-md overflow-hidde drop-shadow-sm">
                        <p className="h-full p-3 bg-white rounded-l-md">nguyen van a</p>
                        <div className="h-full overflow-hidden rounded-md aspect-square image-container">
                            <Image src={'/avatar1.jpg'} alt="avatar" layout="fill" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-6 h-[20%] px-4">
                <div className="space-y-2.5">
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<HiOutlineViewGrid size={20} />} title={'Feed'} isActive={true} link={'/'} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<FiUsers size={20} />} title={'My community'} isActive={false} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<RiChatSmileLine size={20} />} title={'Message'} isActive={false} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<RiNotification3Line size={20} />} title={'Notification'} isActive={false} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<FiUser size={20} />} title={'Profile'} isActive={false} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<IoSettingsOutline size={20} />} title={'Setting'} isActive={false} />
                    </div>
                    <div className="pl-1 pr-5">
                        <MenuItem icon={<FiLogOut size={20} />} title={'Log out'} isActive={false} />
                    </div>
                </div>
            </div>
        </section>
    );
};
