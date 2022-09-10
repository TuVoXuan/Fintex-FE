import { MdMoreHoriz } from 'react-icons/md';
import Avatar from '../avatar/avatar';

interface Props {
    avatarUrl: string;
    displayName: string;
    timeAgo: string | number;
    visibleFor: 'public' | 'only me' | 'friends';
    feeling?: IFeeling;
}

export default function HeaderPost({ avatarUrl, displayName, timeAgo, visibleFor, feeling }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar size="medium" url={avatarUrl} />
                <div>
                    <div className=" text-secondary-80">
                        <span className="font-semibold hover:underline hover:cursor-pointer">{displayName}</span>
                        {feeling && (
                            <>
                                {' '}
                                đang <span className="text-xl">{feeling.emoji}</span> cảm thấy {feeling.name}.
                            </>
                        )}
                    </div>
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
