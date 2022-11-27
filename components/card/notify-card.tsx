import Avatar from '../avatar/avatar';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { BsFilePost, BsPeopleFill } from 'react-icons/bs';
import { FaCommentAlt, FaSmileWink, FaUserMinus } from 'react-icons/fa';
import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';

interface Props {
    notify: INotify;
}

export default function NotifyCard({ notify }: Props) {
    timeago.register('vi', vi);
    const router = useRouter();

    const handleNotifyIcon = () => {
        switch (notify.type) {
            case 'createFriendReq':
            case 'acceptFriendReq':
                return <BsPeopleFill size={18} fill="#fff" />;
            case 'createPost':
                return <BsFilePost size={18} fill="#fff" />;
            case 'reactionPost':
            case 'reactionComment':
                return <FaSmileWink size={18} fill="#fff" />;
            case 'replyComment':
            case 'commentPost':
                return <FaCommentAlt size={18} fill="#fff" />;
            case 'deleteFriend':
                return <FaUserMinus size={18} fill="#fff" />;
            default:
                break;
        }
    };

    const handleClick = () => {
        if (notify.postId) {
            router.push(`${APP_PATH.DETAIL_POST}/${notify.postId}?postPersonId=${notify.postPersonId}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`flex overflow-hidden bg-white rounded-2xl shadow-light ${
                notify.postId ? 'cursor-pointer' : null
            }`}
        >
            <div className="flex items-center p-3 bg-blue-400">{handleNotifyIcon()}</div>
            <div className="flex items-center p-3 gap-x-3">
                <Avatar size="semi-large" url={notify.from.avatar} />
                <div>
                    <p className="font-semibold">{notify.content}</p>
                    <TimeAgo className="text-secondary-30" datetime={notify.createdAt} locale="vi" />
                </div>
            </div>
        </div>
    );
}
