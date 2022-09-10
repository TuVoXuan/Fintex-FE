import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdMoreHoriz } from 'react-icons/md';
import { ReactionEnum } from '../../../constants/reaction';
import { findReaction } from '../../../util/find-reactioin';
import Avatar from '../../avatar/avatar';
import ImageContainer from '../../image/image-container';
import { Input } from '../../input/input';

interface Props {
    comment: IComment;
}

interface IWriteComment {
    comment: string;
}

export const Commnent = ({ comment }: Props) => {
    const refReply = useRef<HTMLDivElement>(null);
    const refReact = useRef<HTMLDivElement>(null);
    const refButtonCommentSetting = React.createRef<HTMLDivElement>();
    const refCommentSetting = React.createRef<HTMLDivElement>();

    const [isClose, setIsClose] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { register } = useForm<IWriteComment>({
        defaultValues: {
            comment: comment.content,
        },
    });

    console.log('render');

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

    return (
        <div className="flex gap-x-3">
            <Avatar url={comment.avatar} size="medium" />
            <div className="w-full space-y-3">
                {!isEdit ? (
                    <div className="relative p-3 space-y-2 rounded-lg w-fit bg-secondary-10">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">
                                {comment.name.firstName} {comment.name.lastName}
                            </p>
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
                                        <p className="p-2 rounded-md cursor-pointer hover:bg-slate-100">delete</p>
                                        <p
                                            onClick={handleShowCloseEditComment}
                                            className="p-2 rounded-md cursor-pointer hover:bg-slate-100"
                                        >
                                            edit
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                ) : (
                    <>
                        <Input
                            isHasEmojiIcon={true}
                            isHasPhotoIcon={true}
                            register={register}
                            placeholder={'Write a comment...'}
                            type={'text'}
                            name={'comment'}
                            defaultValue={comment.content}
                            isTextArea={true}
                            border={false}
                            background={true}
                        />
                    </>
                )}
                {comment.image && (
                    <div className="w-full">
                        <div className="w-56">
                            <ImageContainer url={comment.image} quantity="single" />
                        </div>
                    </div>
                )}
                {!isEdit ? null : (
                    <button className="text-blue-400 underline" onClick={handleShowCloseEditComment}>
                        Cancel
                    </button>
                )}
                {!isEdit ? (
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
                            <button onClick={handleWriteComment} className="hover:text-black">
                                Reply
                            </button>
                            <p>16 minutes</p>
                        </div>
                    </div>
                ) : null}
                <div ref={refReply} className="hidden">
                    <div className="flex gap-x-3">
                        <Avatar url="/images/avatar2.jpg" size="tiny" />
                        <div className="w-full">
                            <Input
                                isHasEmojiIcon={true}
                                isHasPhotoIcon={true}
                                register={register}
                                placeholder={'Write a comment...'}
                                type={'text'}
                                name={'comment'}
                                border={false}
                                background={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
