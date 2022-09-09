import Image from 'next/image';
import ImageContainer from '../image/image-container';
import { PostAction } from './post-action/post-action';
import { RiHeart2Line, RiSendPlane2Line, RiUserSmileLine } from 'react-icons/ri';
import { FiMessageSquare } from 'react-icons/fi';
import Avatar from '../avatar/avatar';
import { Input } from '..';
import { useForm } from 'react-hook-form';
import { MdMoreHoriz } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { Commnent } from './comment/comment';

export const FooterPost = () => {
    const { register } = useForm();

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
                <p>3 comments</p>
            </div>
            <div className="border-t-[1px] border-b-[1px] flex justify-around py-2">
                <PostAction name="Like" icon={<RiHeart2Line size={24} />} />
                <PostAction name="Like" icon={<FiMessageSquare size={24} />} />
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
            <div className="space-y-3">
                <Commnent />
            </div>
        </section>
    );
};
