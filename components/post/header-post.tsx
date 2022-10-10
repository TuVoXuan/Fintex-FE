import { MdMoreHoriz } from 'react-icons/md';
import Avatar from '../avatar/avatar';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { translateVisibleFor } from '../../util/handle-visible-for';
import { useRef } from 'react';

interface Props {
    avatarUrl: string;
    displayName: string;
    timeAgo: string | number;
    visibleFor: 'public' | 'only me' | 'friends';
    isMine: boolean;
    postId: string;
    feeling?: IFeeling;
    editPost?: (postId: string) => () => void;
}

export default function HeaderPost({
    avatarUrl,
    displayName,
    timeAgo,
    visibleFor,
    postId,
    feeling,
    editPost,
    isMine,
}: Props) {
    timeago.register('vi', vi);
    const refPostSetting = useRef<HTMLDivElement>(null);

    const handleShowCommentSetting = () => {
        if (refPostSetting.current) {
            if (refPostSetting.current.classList.contains('hidden')) {
                refPostSetting.current.classList.remove('hidden');
            } else {
                refPostSetting.current.classList.add('hidden');
            }
        }
    };

    const handleEditPost = () => {
        handleShowCommentSetting();
        if (editPost) {
            editPost(postId)();
        }
    };

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
                        <TimeAgo datetime={timeAgo} locale="vi" />. {translateVisibleFor(visibleFor)}
                    </h5>
                </div>
            </div>

            {isMine && (
                <div className="relative">
                    <button
                        onClick={handleShowCommentSetting}
                        className="p-2 transition-colors duration-300 ease-linear bg-white rounded-full hover:bg-secondary-20"
                    >
                        <MdMoreHoriz size={24} />
                    </button>
                    <div
                        ref={refPostSetting}
                        className="absolute z-20 hidden w-20 right-[50%] translate-x-[50%] drop-shadow-2xl"
                    >
                        <div className="self-center">
                            <div className="mx-auto triangle"></div>
                        </div>
                        <div className="p-1 space-y-1 bg-white rounded-lg ">
                            <p className="p-2 rounded-md cursor-pointer hover:bg-slate-100">Xóa</p>
                            <p onClick={handleEditPost} className="p-2 rounded-md cursor-pointer hover:bg-slate-100">
                                Sửa
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
