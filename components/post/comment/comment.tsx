import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import { ReactionEnum } from '../../../constants/reaction';
import { useAppDispatch, useAppSelector } from '../../../hook/redux';
import { findReaction } from '../../../util/find-reactioin';
import Avatar from '../../avatar/avatar';
import ImageContainer from '../../image/image-container';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { useStore } from 'react-redux';
import { RootState } from '../../../app/store';
import { ISuccess, NewComment } from './new-comment';
import { deleteComments, getComments } from '../../../redux/actions/comment-action';
import { selectUser } from '../../../redux/reducers/user-slice';

interface Props {
    id: string;
}

export const Commnent = ({ id }: Props) => {
    const store = useStore();
    const dispatch = useAppDispatch();
    const sUser = useAppSelector(selectUser);

    const refReply = useRef<HTMLDivElement>(null);
    const refReact = useRef<HTMLDivElement>(null);
    const refButtonCommentSetting = React.createRef<HTMLDivElement>();
    const refCommentSetting = React.createRef<HTMLDivElement>();
    const refButtonShowCommentReply = React.createRef<HTMLButtonElement>();

    const [isClose, setIsClose] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [childComments, setChildComment] = useState<JSX.Element[]>([]);
    const [loading, setLoading] = useState(false);
    const [ended, setEnded] = useState(false);
    const [after, setAfter] = useState<string | undefined>();

    const comment = useAppSelector((state) => state.comments.find((item) => item._id === id));

    timeago.register('vi', vi);

    const handleWriteComment = () => {
        if (refReply.current) {
            if (refReply.current.classList.contains('hidden')) {
                refReply.current.classList.remove('hidden');
            } else {
                refReply.current.classList.add('hidden');
            }
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

    const handleShowCommentSetting = () => {
        if (refCommentSetting.current) {
            if (refCommentSetting.current.classList.contains('hidden')) {
                refCommentSetting.current.classList.remove('hidden');
            } else {
                refCommentSetting.current.classList.add('hidden');
            }
        }
    };

    const handleShowCloseEditComment = () => {
        setIsEdit((value) => !value);
    };

    const handleShowCommentReply = async () => {
        if (refButtonShowCommentReply.current) {
            refButtonShowCommentReply.current.classList.add('hidden');
            if (!ended) {
                setLoading(true);
                const res = (
                    await dispatch(
                        getComments({
                            postId: comment?.postId || '',
                            limit: +(process.env.LIMIT_CM as string),
                            after: after,
                            parentId: comment?._id || '',
                        }),
                    )
                ).payload as ICommentPagination;

                setAfter(res.after);
                setEnded(res.ended);
                const state = store.getState() as RootState;
                const child = state.comments
                    .filter((item) => item.parentId === id)
                    .map((item) => <Commnent key={item._id} id={item._id} />);
                setChildComment(child);
                setLoading(false);
            }
        }
    };

    const handleReplySuccess = async (data?: ISuccess) => {
        if (data) {
            const state = store.getState() as RootState;
            const child = state.comments
                .filter((item) => item.parentId === data.parentId)
                .map((item) => <Commnent key={item._id} id={item._id} />);
            setChildComment(child);

            console.log('child: ', child);
            if (data.id) {
                setAfter((value) => {
                    if (value) return value;
                    return data.id;
                });
            }
        }
    };

    const handleDelete = (id: string, postId: string) => async () => {
        try {
            await dispatch(
                deleteComments({
                    id,
                    postId,
                }),
            ).unwrap();
        } catch (error) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        const handleClickOutsideBox = (event: MouseEvent) => {
            console.log('da vo');
            const { target } = event;

            if (refCommentSetting.current && refButtonCommentSetting.current && target && 'nodeType' in target) {
                if (!refButtonCommentSetting.current.contains(target) && !refCommentSetting.current.contains(target)) {
                    refCommentSetting.current.classList.add('hidden');
                }
            }
        };

        document.addEventListener('click', handleClickOutsideBox);

        return () => {
            document.removeEventListener('click', handleClickOutsideBox);
        };
    });

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

    return comment ? (
        !isEdit ? (
            <div className="flex gap-x-3">
                <Avatar url={comment.avatar} size="medium" />
                <div className="w-full space-y-3">
                    <div className="relative p-3 space-y-2 rounded-lg w-fit bg-secondary-10">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">
                                {comment.name.firstName} {comment.name.lastName}
                            </p>

                            {/* check user */}
                            {sUser.data?._id === comment.userId && (
                                <div className="relative">
                                    <div ref={refButtonCommentSetting}>
                                        <MdMoreHoriz
                                            size={24}
                                            onClick={handleShowCommentSetting}
                                            className="rounded-full cursor-pointer hover:bg-white"
                                        />
                                    </div>
                                    <div
                                        ref={refCommentSetting}
                                        className="absolute z-20 hidden w-48 translate-x-1/2 top-7 right-3 drop-shadow-2xl"
                                    >
                                        <div className="self-center">
                                            <div className="mx-auto triangle"></div>
                                        </div>
                                        <div className="p-1 space-y-1 bg-white rounded-lg ">
                                            <p
                                                onClick={handleDelete(comment._id, comment.postId)}
                                                className="p-2 rounded-md cursor-pointer hover:bg-slate-100"
                                            >
                                                delete
                                            </p>
                                            <p
                                                onClick={handleShowCloseEditComment}
                                                className="p-2 rounded-md cursor-pointer hover:bg-slate-100"
                                            >
                                                edit
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p>{comment.content}</p>
                        {comment.reaction.length !== 0 && (
                            <div className="absolute bottom-0 right-0  flex p-1 z-10 -space-x-2 translate-y-[60%] bg-white rounded-full drop-shadow-md w-fit ">
                                {findReaction(comment.reaction, ReactionEnum.LIKE) !== -1 && (
                                    <Avatar url="/emoji/like.png" size="nano" className="border-2 border-white" />
                                )}
                                {findReaction(comment.reaction, ReactionEnum.HAHA) !== -1 && (
                                    <Avatar url="/emoji/haha.png" size="nano" className="border-2 border-white" />
                                )}
                                {findReaction(comment.reaction, ReactionEnum.LOVE) !== -1 && (
                                    <Avatar url="/emoji/love.png" size="nano" className="border-2 border-white" />
                                )}
                                {findReaction(comment.reaction, ReactionEnum.WOW) !== -1 && (
                                    <Avatar url="/emoji/wow.png" size="nano" className="border-2 border-white" />
                                )}
                                {findReaction(comment.reaction, ReactionEnum.SAD) !== -1 && (
                                    <Avatar url="/emoji/sad.png" size="nano" className="border-2 border-white" />
                                )}
                                {findReaction(comment.reaction, ReactionEnum.ANGRY) !== -1 && (
                                    <Avatar url="/emoji/angry.png" size="nano" className="border-2 border-white" />
                                )}
                                {comment.reaction.length > 1 && (
                                    <p className="z-10 self-center pl-3 pr-1">{comment.reaction.length}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {comment.image && (
                        <div className="w-full">
                            <div className="relative w-56">
                                <ImageContainer url={comment.image} quantity="single" />
                            </div>
                        </div>
                    )}
                    <div className="relative">
                        <div ref={refReact} className="hidden">
                            <div
                                onMouseLeave={handleCloseReaction}
                                onMouseEnter={handleHoverReaction}
                                className="absolute flex p-3 -translate-y-full bg-white -top-3 rounded-3xl gap-x-3 drop-shadow-md w-fit"
                            >
                                <div className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 ">
                                    <ImageContainer url="/emoji-gif/like.gif" quantity="multiple" />
                                </div>
                                <div className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 ">
                                    <ImageContainer url="/emoji-gif/love.gif" quantity="multiple" />
                                </div>
                                <div className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 ">
                                    <ImageContainer url="/emoji-gif/haha.gif" quantity="multiple" />
                                </div>
                                <div className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 ">
                                    <ImageContainer url="/emoji-gif/wow.gif" quantity="multiple" />
                                </div>
                                <div className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 ">
                                    <ImageContainer url="/emoji-gif/sad.gif" quantity="multiple" />
                                </div>
                                <div className="overflow-hidden transition duration-300 ease-in-out hover:cursor-pointer hover:scale-125 w-9 h-9 hover:-translate-y-2 ">
                                    <ImageContainer url="/emoji-gif/angry.gif" quantity="multiple" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-x-3 color text-secondary-40">
                            <button
                                onMouseEnter={handleShowReaction}
                                onMouseLeave={handleCloseReaction}
                                className="hover:text-black"
                            >
                                Like
                            </button>
                            {comment.level < 3 && (
                                <button onClick={handleWriteComment} className="hover:text-black">
                                    Reply
                                </button>
                            )}
                            <TimeAgo datetime={comment.createdAt} locale="vi" />
                        </div>
                    </div>
                    <NewComment
                        avatar={comment.avatar}
                        inputName="commentReply"
                        postId={comment.postId}
                        isHidden={true}
                        parentId={comment._id}
                        ref={refReply}
                        hasCancel={true}
                        handleSuccess={handleReplySuccess}
                    />
                    {childComments}

                    {/* Todo: update number of childs comments, reset after */}
                    {comment.commentsChildren > childComments.length &&
                        (loading ? (
                            <div className="flex w-full space-x-4 animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                                <div className="w-4/5 h-20 rounded-lg bg-slate-200"></div>
                            </div>
                        ) : (
                            <button
                                ref={refButtonShowCommentReply}
                                onClick={handleShowCommentReply}
                                className="hover:underline"
                            >
                                {comment.commentsChildren - childComments.length} phản hồi
                            </button>
                        ))}
                </div>
            </div>
        ) : (
            <NewComment
                avatar={comment.avatar}
                inputName="commentEdit"
                postId={comment.postId}
                commentId={comment._id}
                hasCancel={true}
                handleCancel={handleShowCloseEditComment}
            />
        )
    ) : (
        <></>
    );
};
