import { PostAction } from './post-action/post-action';
import { RiHeart2Line } from 'react-icons/ri';
import { FiMessageSquare } from 'react-icons/fi';
import Avatar from '../avatar/avatar';
import { Commnent } from './comment/comment';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectComments } from '../../redux/reducers/comments-slice';
import { ISuccess, NewComment } from '..';
import { getComments } from '../../redux/actions/comment-action';
import { selectUser } from '../../redux/reducers/user-slice';

interface Props {
    postId: string;
    numsComment: number;
}

export const FooterPost = ({ postId, numsComment }: Props) => {
    const sCommentsRef = useRef<IComment[]>([]);
    sCommentsRef.current = useAppSelector(selectComments);
    const sUser = useAppSelector(selectUser);

    const refComment = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const [comments, setComment] = useState<string[]>([]);
    const [after, setAfter] = useState<string | undefined>();
    const [ended, setEnded] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [loading, setLoading] = useState(false);

    const handdleShowComment = () => {
        if (refComment.current) {
            if (refComment.current.classList.contains('hidden')) {
                if (isFirstTime) {
                    handleLoadCommentsNoParent();
                    setIsFirstTime(false);
                }
                refComment.current.classList.remove('hidden');
            } else {
                refComment.current.classList.add('hidden');
            }
        }
    };

    const handleLoadCommentsNoParent = async () => {
        if (!ended) {
            setLoading(true);
            const res = (
                await dispatch(
                    getComments({
                        postId: postId,
                        limit: +(process.env.LIMIT_CM as string),
                        after: after,
                    }),
                )
            ).payload as ICommentPagination;

            setAfter(res.after);
            setEnded(res.ended);
            const comments = sCommentsRef.current
                .filter((item) => item.postId === postId && !item.parentId)
                .map((item) => item._id);
            setComment(comments);
            setLoading(false);
        }
    };

    const handleNewCommentSuccess = async (data?: ISuccess) => {
        if (data) {
            const comments = sCommentsRef.current
                .filter((item) => item.postId === data.postId && !item.parentId)
                .map((item) => item._id);
            setComment(comments);
            setLoading(false);
            refComment.current?.classList.remove('hidden');
            setAfter((value) => {
                if (value) return value;
                return data.id;
            });
            if (!data.id) {
                setEnded(true);
            }
            setIsFirstTime(false);
        }
    };

    return (
        <section className="space-y-3">
            <div className="flex justify-between">
                <div className="flex -space-x-3">
                    <Avatar url="/images/avatar1.jpg" size="tiny" className="border-2 border-white" />
                    <Avatar url="/images/avatar1.jpg" size="tiny" className="border-2 border-white" />

                    <div className="z-10 flex items-center justify-center w-8 h-8 overflow-hidden border-2 border-white rounded-full bg-slate-400">
                        <p className="text-white">+2</p>
                    </div>
                </div>
                {numsComment !== 0 && (
                    <button className="hover:underline" onClick={handdleShowComment}>
                        {numsComment} comments
                    </button>
                )}
            </div>
            <div className="border-t-[1px] border-b-[1px] flex justify-around py-2">
                <PostAction name="Like" icon={<RiHeart2Line size={24} />} />
                <PostAction name="Comment" icon={<FiMessageSquare size={24} />} />
            </div>
            <NewComment
                avatar={
                    sUser.data?.avatar ||
                    'https://res.cloudinary.com/cake-shop/image/upload/v1663325246/Fintex/default-avatar_vpm7pw.jpg'
                }
                postId={postId}
                inputName="commentReply"
                handleSuccess={handleNewCommentSuccess}
            />
            <div ref={refComment} className="hidden space-y-3">
                {comments.length === 0 ? (
                    <div className="flex w-full space-x-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                        <div className="w-4/5 h-20 rounded-lg bg-slate-200"></div>
                    </div>
                ) : (
                    comments.map((item) => <Commnent key={item} id={item} />)
                )}
                {!ended &&
                    (loading ? (
                        <div className="flex w-full space-x-4 animate-pulse">
                            <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                            <div className="w-4/5 h-20 rounded-lg bg-slate-200"></div>
                        </div>
                    ) : (
                        <div className="text-center cursor-pointer" onClick={handleLoadCommentsNoParent}>
                            Load more
                        </div>
                    ))}
            </div>
        </section>
    );
};
