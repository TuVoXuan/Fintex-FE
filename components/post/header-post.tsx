import { MdMoreHoriz } from 'react-icons/md';
import Avatar from '../avatar/avatar';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { translateVisibleFor } from '../../util/handle-visible-for';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectUser } from '../../redux/reducers/user-slice';
import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import { resetPost } from '../../redux/reducers/post-slice';
import { resetComments } from '../../redux/reducers/comments-slice';

interface Props {
    avatarUrl: string;
    displayName: string;
    userId: string;
    timeAgo: string | number;
    visibleFor: 'public' | 'only me' | 'friends';
    postId: string;
    feeling?: IFeeling;
    postType: 'avatar' | 'cover' | 'normal';
    showActionPost: boolean;
    editPost?: (postId: string) => () => void;
    deletePost?: (postId: string) => () => void;
}

export default function HeaderPost({
    avatarUrl,
    displayName,
    userId,
    timeAgo,
    visibleFor,
    postId,
    feeling,
    postType,
    editPost,
    deletePost,
    showActionPost,
}: Props) {
    const dispatch = useAppDispatch();
    timeago.register('vi', vi);
    const refPostSetting = useRef<HTMLDivElement>(null);
    const mine = useAppSelector(selectUser).data;
    const router = useRouter();

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

    const handleDeletePost = () => {
        handleShowCommentSetting();
        if (deletePost) {
            deletePost(postId)();
        }
    };

    const handleSeeProfile = () => {
        dispatch(resetPost());
        dispatch(resetComments());
        if (mine) {
            if (mine._id === userId) {
                router.push(APP_PATH.PROFILE);
            } else {
                router.push(`${APP_PATH.PROFILE}/${userId}`);
            }
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar size="medium" url={avatarUrl} />
                <div>
                    <div className=" text-secondary-80">
                        <span onClick={handleSeeProfile} className="font-semibold hover:underline hover:cursor-pointer">
                            {displayName}
                        </span>
                        {postType === 'normal' && feeling && (
                            <>
                                {' '}
                                đang <span className="text-xl">{feeling.emoji}</span> cảm thấy {feeling.name}.
                            </>
                        )}
                        {postType === 'avatar' && ' đã cập nhập ảnh đại diện'}
                        {postType === 'cover' && ' đã cập nhập ảnh ảnh bìa'}
                    </div>
                    <h5 className="font-medium capitalize text-secondary-40">
                        <TimeAgo datetime={timeAgo} locale="vi" />. {translateVisibleFor(visibleFor)}
                    </h5>
                </div>
            </div>

            {showActionPost && (
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
                            <p onClick={handleDeletePost} className="p-2 rounded-md cursor-pointer hover:bg-slate-100">
                                Xóa
                            </p>
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
