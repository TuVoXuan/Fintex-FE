import { PostAction } from './post-action/post-action';
import { FiMessageSquare } from 'react-icons/fi';
import { Commnent } from './comment/comment';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectComments } from '../../redux/reducers/comments-slice';
import { ISuccess, NewComment } from '..';
import { getComments } from '../../redux/actions/comment-action';
import { selectUser } from '../../redux/reducers/user-slice';
import ImageContainer from '../image/image-container';
import { AiOutlineLike } from 'react-icons/ai';
import Image from 'next/image';
import { postDeleteReaction, postReaction } from '../../redux/actions/post-action';
import { toastError } from '../../util/toast';
import { selectPost } from '../../redux/reducers/post-slice';

interface Props {
    postId: string;
    numsComment: number;
    mineReaction?: string;
}

export const FooterPost = ({ postId, numsComment, mineReaction }: Props) => {
    const sCommentsRef = useRef<IComment[]>([]);
    sCommentsRef.current = useAppSelector(selectComments);
    const sUser = useAppSelector(selectUser);
    const post = useAppSelector(selectPost).posts.find((item) => item._id === postId);

    const refComment = useRef<HTMLDivElement>(null);
    const refReact = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();

    const [comments, setComment] = useState<string[]>([]);
    const [after, setAfter] = useState<string | undefined>();
    const [ended, setEnded] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [reactionType, setReactionType] = useState(mineReaction);
    const [reactionList, setReactionList] = useState<ReactionTypeList | undefined>();

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

    const handleShowReaction = () => {
        console.log('haha');
        if (refReact.current) {
            if (refReact.current.classList.contains('hidden')) {
                refReact.current.classList.remove('hidden');
                setIsClose(false);
            }
        }
    };

    const handleCloseReaction = () => {
        console.log('leave out');
        setIsClose(true);
    };

    const handleHoverReaction = () => {
        setIsClose(false);
    };

    const handleLoadReaction = () => {
        switch (reactionType) {
            case 'like':
                return <Image src={'/emoji/like.svg'} height={24} width={24} alt="icon" />;
            case 'angry':
                return <Image src={'/emoji/angry.svg'} height={24} width={24} alt="icon" />;
            case 'haha':
                return <Image src={'/emoji/haha.svg'} height={24} width={24} alt="icon" />;
            case 'love':
                return <Image src={'/emoji/love.svg'} height={24} width={24} alt="icon" />;
            case 'sad':
                return <Image src={'/emoji/sad.svg'} height={24} width={24} alt="icon" />;
            case 'wow':
                return <Image src={'/emoji/wow.svg'} height={24} width={24} alt="icon" />;
            default:
                return <AiOutlineLike size={24} />;
        }
    };

    const handleCloseImmediatelyReaction = () => {
        if (refReact.current && !refReact.current.classList.contains('hidden')) {
            refReact.current.classList.add('hidden');
        }
    };

    const handleDefaultReaction = async () => {
        if (reactionType) {
            try {
                await dispatch(postDeleteReaction(postId));
                setReactionType('');
                handleCloseImmediatelyReaction();
                return;
            } catch (error) {
                toastError((error as IResponseError).error);
            }
        }

        try {
            await dispatch(postReaction({ postId, type: 'like' }));
            setReactionType('like');
            handleCloseImmediatelyReaction();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleReaction = (type: string) => async () => {
        try {
            await dispatch(postReaction({ postId, type }));
            setReactionType(type);
            handleCloseImmediatelyReaction();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleReactionTypeList = () => {
        const reactionTypeList: ReactionTypeList = {
            angry: [],
            haha: [],
            like: [],
            love: [],
            sad: [],
            wow: [],
        };

        if (post) {
            for (let item of post.reactions) {
                console.log('item: ', item);
                switch (item.type) {
                    case 'angry':
                        reactionTypeList.angry.push(`${item.user.name.firstName} ${item.user.name.lastName}`);
                        break;
                    case 'haha':
                        reactionTypeList.haha.push(`${item.user.name.firstName} ${item.user.name.lastName}`);
                        break;
                    case 'like':
                        reactionTypeList.like.push(`${item.user.name.firstName} ${item.user.name.lastName}`);
                        break;
                    case 'love':
                        reactionTypeList.love.push(`${item.user.name.firstName} ${item.user.name.lastName}`);
                        break;
                    case 'sad':
                        reactionTypeList.sad.push(`${item.user.name.firstName} ${item.user.name.lastName}`);
                        break;
                    case 'wow':
                        reactionTypeList.wow.push(`${item.user.name.firstName} ${item.user.name.lastName}`);
                        break;
                    default:
                        break;
                }
            }
        }

        setReactionList(reactionTypeList);
    };

    useEffect(() => {
        handleLoadReaction();
        handleReactionTypeList();
    }, [reactionType]);

    useEffect(() => {
        console.log('isClose: ', isClose);
        const timer = setTimeout(() => {
            if (refReact.current && !refReact.current.classList.contains('hidden')) {
                refReact.current.classList.add('hidden');
            }
        }, 2000);

        if (!isClose) clearTimeout(timer);

        return () => clearTimeout(timer);
    }, [isClose]);

    return (
        <section className="space-y-3">
            <div className="flex">
                <div className="flex w-1/2 -space-x-2">
                    {reactionList && reactionList.like.length > 0 && (
                        <div className="relative z-[6] border-2 border-white rounded-full w-7 h-7">
                            <Image src={'/emoji/like.svg'} height={24} width={24} alt="icon" />
                        </div>
                    )}
                    {reactionList && reactionList.love.length > 0 && (
                        <div className="relative z-[5] border-2 border-white rounded-full w-7 h-7">
                            <Image src={'/emoji/love.svg'} height={24} width={24} alt="icon" />
                        </div>
                    )}
                    {reactionList && reactionList.haha.length > 0 && (
                        <div className="relative z-[4] border-2 border-white rounded-full w-7 h-7">
                            <Image src={'/emoji/haha.svg'} height={24} width={24} alt="icon" />
                        </div>
                    )}
                    {reactionList && reactionList.wow.length > 0 && (
                        <div className="relative z-[3] border-2 border-white rounded-full w-7 h-7">
                            <Image src={'/emoji/wow.svg'} height={24} width={24} alt="icon" />
                        </div>
                    )}
                    {reactionList && reactionList.angry.length > 0 && (
                        <div className="relative z-[2] border-2 border-white rounded-full w-7 h-7">
                            <Image src={'/emoji/angry.svg'} height={24} width={24} alt="icon" />
                        </div>
                    )}
                    {reactionList && reactionList.sad.length > 0 && (
                        <div className="relative z-[1] border-2 border-white rounded-full w-7 h-7">
                            <Image src={'/emoji/sad.svg'} height={24} width={24} alt="icon" />
                        </div>
                    )}
                </div>
                {numsComment !== 0 && (
                    <div className="flex justify-end w-1/2 pt-2">
                        <button className="self-end hover:underline" onClick={handdleShowComment}>
                            {numsComment} comments
                        </button>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <div ref={refReact} className="hidden">
                    <div
                        onMouseLeave={handleCloseReaction}
                        onMouseEnter={handleHoverReaction}
                        className="absolute flex p-3 -translate-y-full bg-white -top-3 rounded-3xl gap-x-3 drop-shadow-md w-fit"
                    >
                        <button
                            onClick={handleReaction('like')}
                            className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 "
                        >
                            <ImageContainer url="/emoji-gif/like.gif" quantity="multiple" />
                        </button>
                        <button
                            onClick={handleReaction('love')}
                            className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 "
                        >
                            <ImageContainer url="/emoji-gif/love.gif" quantity="multiple" />
                        </button>
                        <button
                            onClick={handleReaction('haha')}
                            className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 "
                        >
                            <ImageContainer url="/emoji-gif/haha.gif" quantity="multiple" />
                        </button>
                        <button
                            onClick={handleReaction('wow')}
                            className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 "
                        >
                            <ImageContainer url="/emoji-gif/wow.gif" quantity="multiple" />
                        </button>
                        <button
                            onClick={handleReaction('sad')}
                            className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 "
                        >
                            <ImageContainer url="/emoji-gif/sad.gif" quantity="multiple" />
                        </button>
                        <button
                            onClick={handleReaction('angry')}
                            className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 "
                        >
                            <ImageContainer url="/emoji-gif/angry.gif" quantity="multiple" />
                        </button>
                    </div>
                </div>
                <div className="border-t-[1px] border-b-[1px] grid grid-cols-2 justify-items-center py-2">
                    <PostAction
                        name={reactionType || 'like'}
                        icon={handleLoadReaction()}
                        onMouseEnter={handleShowReaction}
                        onMouseLeave={handleCloseReaction}
                        mineReaction={reactionType}
                        onClick={handleDefaultReaction}
                    />
                    <PostAction name="Comment" icon={<FiMessageSquare size={24} />} />
                </div>
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
