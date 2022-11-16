import { useRouter } from 'next/router';
import { useState } from 'react';
import APP_PATH from '../../constants/app-path';
import { useAppDispatch } from '../../hook/redux';
import { friendReqCreate } from '../../redux/actions/notify-action';
import { resetComments } from '../../redux/reducers/comments-slice';
import { resetPost } from '../../redux/reducers/post-slice';
import { toastError, toastSuccess } from '../../util/toast';
import Avatar from '../avatar/avatar';

interface Props {
    stranger: Stranger;
}

export default function StrangerCard({ stranger }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { avatar, fullName, address, _id } = stranger;
    const [relationship, setRelationship] = useState<string>(stranger.relationship);

    const handleButton = () => {
        switch (relationship) {
            case 'requesting':
                return (
                    <button className="p-3 font-semibold rounded-md text-secondary-80 bg-secondary-20 hover:cursor-not-allowed">
                        Đã gửi kết bạn
                    </button>
                );
            case 'isFriend':
                return (
                    <button className="p-3 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300">
                        Nhắn tin
                    </button>
                );
            case 'notFriend':
                return (
                    <button
                        onClick={handleClick}
                        className="p-3 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-300"
                    >
                        Kết bạn
                    </button>
                );
            default:
                break;
        }
    };

    const handleClick = async () => {
        try {
            await dispatch(friendReqCreate(_id));
            setRelationship('requesting');
            toastSuccess('Gửi lời mời kết bạn thành công');
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    const handleSeeProfilePage = () => {
        dispatch(resetComments());
        dispatch(resetPost());
        router.push(`${APP_PATH.PROFILE}/${stranger._id}`);
    };

    return (
        <div className="flex items-center justify-between px-4 py-4 bg-white rounded-lg shadow-light">
            <div className="flex items-center gap-3">
                <Avatar size="semi-large" url={avatar} />
                <div>
                    <p onClick={handleSeeProfilePage} className="font-semibold hover:underline hover:cursor-pointer">
                        {fullName}
                    </p>
                    <p>{address}</p>
                </div>
            </div>
            {handleButton()}
        </div>
    );
}
