import { MdMoreHoriz } from 'react-icons/md';
import Avatar from '../avatar/avatar';

interface Props {
    avatarUrl: string;
    displayName: string;
    timeAgo: string | number;
    visibleFor: 'public' | 'only me' | 'friends';
}

export default function HeaderPost({ avatarUrl, displayName, timeAgo, visibleFor }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar size="medium" url={avatarUrl} />
                <div>
                    <h4 className="font-semibold text-secondary-80">{displayName}</h4>
                    <h5 className="font-medium capitalize text-secondary-40">
                        {timeAgo}. {visibleFor}
                    </h5>
                </div>
            </div>
            <button>
                <MdMoreHoriz size={24} />
            </button>
        </div>
    );
}
