import Image from 'next/image';
import { useState } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { useAppDispatch } from '../../hook/redux';
import { friendReqAccept, friendReqDelete } from '../../redux/actions/notify-action';
import { toastError } from '../../util/toast';
import { Button } from '../button/button';

interface Props {
    user: IUserSimple;
    friendReqId: string;
}

export default function FriendReqCard({ user, friendReqId }: Props) {
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
            await dispatch(friendReqDelete(friendReqId)).unwrap();
            setLoadingDelete(false);
        } catch (error) {
            setLoadingDelete(false);
            toastError((error as IResponseError).error);
        }
    };

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
