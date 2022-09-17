import { PostAction } from './post-action/post-action';
import { RiHeart2Line } from 'react-icons/ri';
import { FiMessageSquare } from 'react-icons/fi';
import Avatar from '../avatar/avatar';
import { Commnent } from './comment/comment';
import { useRef, useState } from 'react';
import { useAppSelector } from '../../hook/redux';
import { selectComments } from '../../redux/reducers/comments-slice';
import { NewComment } from '..';

interface Props {
    postId: string;
}

export const FooterPost = ({ postId }: Props) => {
    const sComments = useAppSelector(selectComments);
    const refComment = useRef<HTMLDivElement>(null);

    const [comments, setComment] = useState<string[]>();

    const handdleShowComment = () => {
        if (refComment.current) {
            if (refComment.current.classList.contains('hidden')) {
                handleLoadCommentsNoParent();
                refComment.current.classList.remove('hidden');
            } else {
                refComment.current.classList.add('hidden');
            }
        }
    };

    const handleLoadCommentsNoParent = () => {
        const comments = sComments
            .filter((item) => item.postId === postId && !item.parentComment)
            .map((item) => item._id);

        if (comments) {
            setComment(comments);
        } else {
            // fetch data;
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
                <button className="hover:underline" onClick={handdleShowComment}>
                    3 comments
                </button>
            </div>
            <div className="border-t-[1px] border-b-[1px] flex justify-around py-2">
                <PostAction name="Like" icon={<RiHeart2Line size={24} />} />
                <PostAction name="Comment" icon={<FiMessageSquare size={24} />} />
            </div>
            <NewComment postId={postId} inputName="comment" />
            <div ref={refComment} className="hidden space-y-3">
                {!comments ? (
                    <div className="flex w-full space-x-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                        <div className="w-4/5 h-20 rounded-lg bg-slate-200"></div>
                    </div>
                ) : (
                    comments.map((item) => <Commnent key={item} id={item} />)
                )}
            </div>
        </section>
    );
};
