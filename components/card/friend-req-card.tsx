import Image from 'next/image';
import { useState } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { useAppDispatch } from '../../hook/redux';
import { friendReqAccept, friendReqDelete } from '../../redux/actions/notify-action';
import { userDeleteSendFriendReq } from '../../redux/actions/user-action';
import { toastError, toastSuccess } from '../../util/toast';
import Avatar from '../avatar/avatar';
import { Button } from '../button/button';

interface Props {
    user: IUserSimple;
    friendReqId: string;
    type: 'send' | 'receive';
}

export default function FriendReqCard({ user, friendReqId, type }: Props) {
    const dispatch = useAppDispatch();
    const [loadingAccept, setLoadingAccept] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const handleAccept = async () => {
        try {
            setLoadingAccept(true);
            await dispatch(friendReqAccept(friendReqId)).unwrap();
            setLoadingAccept(false);
        } catch (error) {
            setLoadingAccept(false);
            toastError((error as IResponseError).error);
        }
    };

    const handleDelete = async () => {
        try {
            setLoadingDelete(true);
            if (type === 'receive') {
                await dispatch(friendReqDelete(friendReqId)).unwrap();
            } else {
                await dispatch(userDeleteSendFriendReq(friendReqId)).unwrap();
            }
            setLoadingDelete(false);
            toastSuccess('Xóa lời mời kết bạn thành công');
        } catch (error) {
            setLoadingDelete(false);
            toastError((error as IResponseError).error);
        }
    };

    if (type === 'send') {
        return (
            <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-light">
                <div className="flex items-center gap-x-3">
                    <Avatar size="semi-large" url={user.avatar} />
                    <h4>{user.name.fullName}</h4>
                </div>
                {loadingDelete ? (
                    <button disabled className="cursor-not-allowed btn bg-secondary-20 text-secondary-80">
                        <VscLoading className="animate-spin" size={18} />
                    </button>
                ) : (
                    <button onClick={handleDelete} className="btn btn-primary ripple-bg-primary-80">
                        Xoá
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg drop-shadow-md">
            <div className="w-full aspect-square image-container">
                <Image src={user.avatar} alt="avatar" layout="fill" objectFit="cover" />
            </div>
            <div className="p-4 space-y-2 bg-white">
                <p className="text-xl font-semibold">{user.name.fullName}</p>

                {loadingAccept ? (
                    <button disabled className="w-full cursor-not-allowed btn btn-primary">
                        <VscLoading className="animate-spin" size={18} />
                    </button>
                ) : (
                    <Button onClick={handleAccept} disable={loadingDelete} color="primary" title="Xác nhận" />
                )}

                {loadingDelete ? (
                    <button disabled className="w-full cursor-not-allowed btn bg-secondary-20 text-secondary-80">
                        <VscLoading className="animate-spin" size={18} />
                    </button>
                ) : (
                    <Button onClick={handleDelete} disable={loadingAccept} color="secondary-light" title="Xóa" />
                )}
            </div>
        </div>
    );
}
