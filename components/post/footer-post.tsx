import Image from 'next/image';
import ImageContainer from '../image/image-container';
import { PostAction } from './post-action/post-action';
import { RiHeart2Line, RiSendPlane2Line, RiUserSmileLine } from 'react-icons/ri';
import { FiMessageSquare } from 'react-icons/fi';
import Avatar from '../avatar/avatar';
import { Input } from '..';
import { useForm } from 'react-hook-form';
import { BsImage } from 'react-icons/bs';
import { Commnent } from './comment/comment';
import { useRef, useState } from 'react';

export const FooterPost = () => {
    const { register } = useForm();
    const [loading, setLoading] = useState(false);

    const refComment = useRef<HTMLDivElement>(null);

    const handdleShowComment = () => {
        if (refComment.current) {
            if (refComment.current.classList.contains('hidden')) {
                refComment.current.classList.remove('hidden');
            } else {
                refComment.current.classList.add('hidden');
            }
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
            <div className="flex gap-x-3">
                <Avatar url="/images/avatar1.jpg" size="medium" />
                <div className="w-4/5">
                    <Input
                        iconEnds={[<RiUserSmileLine size={24} key={1} />, <BsImage size={24} key={2} />]}
                        register={register}
                        placeholder={'Write a comment...'}
                        type={'text'}
                        name={'comment'}
                        border={false}
                        background={true}
                    />
                </div>

                <button className="flex items-center px-3 rounded-md aspect-square bg-primary-10 text-primary-80">
                    <RiSendPlane2Line size={24} />
                </button>
            </div>
            <div ref={refComment} className="hidden space-y-3">
                {loading ? (
                    <div className="flex w-full space-x-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                        <div className="w-4/5 h-20 rounded-lg bg-slate-200"></div>
                    </div>
                ) : (
                    <Commnent />
                )}
            </div>
        </section>
    );
};
