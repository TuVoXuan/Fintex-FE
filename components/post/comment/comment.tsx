import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsImage } from 'react-icons/bs';
import { MdMoreHoriz } from 'react-icons/md';
import { RiUserSmileLine } from 'react-icons/ri';
import Avatar from '../../avatar/avatar';
import ImageContainer from '../../image/image-container';
import { Input } from '../../input/input';

export const Commnent = () => {
    const { register } = useForm();
    const ref = useRef<HTMLDivElement>(null);
    const refReact = useRef<HTMLDivElement>(null);
    const [isClose, setIsClose] = useState(false);

    console.log('render');

    const handleWriteComment = () => {
        if (ref.current) {
            if (ref.current.classList.contains('hidden')) {
                ref.current.classList.remove('hidden');
            } else {
                ref.current.classList.add('hidden');
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
            <Avatar url="/images/avatar2.jpg" size="medium" />
            <div className="w-full space-y-3">
                <div className="p-3 space-y-2 rounded-lg w-fit bg-secondary-10">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Yen Tram</p>
                        <MdMoreHoriz size={24} />
                    </div>
                    <p>Look amazing and breaktaking. Been there, beautiful!</p>
                </div>
                <div className="w-full">
                    <div className="w-56">
                        <ImageContainer
                            url={
                                'https://res.cloudinary.com/cake-shop/image/upload/v1662606360/wallpaperflare.com_wallpaper_1_tzlhiy.jpg'
                            }
                            quantity="single"
                        />
                    </div>
                </div>
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
                <div ref={ref} className="hidden">
                    <div className="flex gap-x-3">
                        <Avatar url="/images/avatar2.jpg" size="tiny" />
                        <div className="w-full">
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
                    </div>
                </div>
            </div>
        </div>
    );
};
