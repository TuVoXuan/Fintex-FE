import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import userApi from '../../api/user-api';
import { useAppDispatch } from '../../hook/redux';
import { addMember } from '../../redux/actions/conversation-action';
import { toastError } from '../../util/toast';
import { Button } from '../button/button';
import FriendConvCard from '../card/friend-conv-card';

interface Props {
    conversationId: string;
    participants: IParticipant[];
    onClose: () => void;
}

export default function AddMemeberModal({ participants, conversationId, onClose }: Props) {
    const [friends, setFriends] = useState<IParticipant[]>([]);
    const [selectedFriends, seteSelectedFriends] = useState<string[]>([]);

    const disaptch = useAppDispatch();

    const handleChooseFriend = (id: string) => () => {
        seteSelectedFriends((value) => [...value, id]);
    };

    const handleAdd = async () => {
        try {
            await disaptch(
                addMember({
                    conversationId,
                    members: selectedFriends,
                }),
            ).unwrap();
            onClose();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        userApi
            .getSuggestMeber(participants.map((item) => item._id))
            .then((data) => setFriends(data))
            .catch((error) => toastError((error as IResponseError).error));
    }, []);

    return (
        <section className="fixed top-0 bottom-0 overflow-hidden left-0 right-0 z-10 flex items-center justify-center bg-secondary-80/60">
            <div className="w-1/3 flex flex-col overflow-hidden bg-white rounded-lg h-4/5 space-y-2">
                <h3 className="text-center px-4 pt-4">Thêm thành viên</h3>
                <div className="flex border-[1px] border-secondary-30 py-2 gap-x-2 rounded-lg px-4 mx-4">
                    <FiSearch size={24} />
                    <input className="outline-none grow" placeholder="Tìm kiếm tại đây" />
                </div>
                <p className="px-4">Gợi ý</p>
                <div className="overflow-y-auto hover:scrollbar-show grow">
                    {friends.map((item) => (
                        <FriendConvCard
                            key={item._id}
                            avatar={item.avatar}
                            name={item.name.fullName}
                            selected={selectedFriends.includes(item._id)}
                            onClick={handleChooseFriend(item._id)}
                        />
                    ))}
                </div>
                <div className="flex gap-x-4 px-4 pb-4">
                    <Button color="secondary-light" title="Hủy" onClick={onClose} />
                    <Button color="primary" title="Thêm" onClick={handleAdd} />
                </div>
            </div>
        </section>
    );
}
