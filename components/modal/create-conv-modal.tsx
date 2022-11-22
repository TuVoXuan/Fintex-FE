import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Avatar from '../avatar/avatar';
import { Button } from '../button/button';
import FriendConvCard from '../card/friend-conv-card';
import { Input } from '../input/input';

interface Props {
    onClose: () => void;
}

interface FormData {
    search: string;
}

export default function CreateConvModal({ onClose }: Props) {
    const { register, watch, getValues } = useForm<FormData>();

    const deleteModalRef = useRef<HTMLDivElement>(null);

    const handleClickOutSideModal = (event: any) => {
        const { target } = event;

        if (deleteModalRef.current && target && 'nodeType' in target) {
            if (!deleteModalRef.current.contains(target)) {
                onClose();
            }
        }
    };
    return (
        <section
            onClick={handleClickOutSideModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-secondary-80/60"
        >
            <div className="w-1/3 py-4 space-y-3 bg-white rounded-lg h-2/3">
                <div className="flex items-center justify-between px-4">
                    <h3>Tạo nhóm chat</h3>
                    <button className="p-2 transition-colors duration-150 ease-linear rounded-full hover:bg-secondary-10">
                        <IoClose size={20} />
                    </button>
                </div>
                <div className="px-4">
                    <Input
                        name="search"
                        border={true}
                        placeholder="Tìm kiếm tại đây..."
                        icon={<FiSearch size={20} />}
                        type="text"
                        register={register}
                    />
                </div>
                <div className="px-4 overflow-y-auto h-60 hover:scrollbar-show">
                    <FriendConvCard />
                    <FriendConvCard />
                    <FriendConvCard />
                    <FriendConvCard />
                    <FriendConvCard />
                    <FriendConvCard />
                </div>
                <div className="flex px-4 gap-x-3">
                    <input
                        type="text"
                        name="chat-name"
                        id="chat-name"
                        placeholder="Tên nhóm chat"
                        className="w-full border-[1px] rounded-lg px-2 focus:outline-none"
                    />
                    <Button color="primary" title="Tạo" className="w-fit" />
                </div>
            </div>
        </section>
    );
}
