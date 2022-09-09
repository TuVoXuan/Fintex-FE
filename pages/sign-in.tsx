import Image from 'next/image';
import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { RiUserSmileLine } from 'react-icons/ri';
import { MdMoreHoriz } from 'react-icons/md';
import { useState } from 'react';
import Avatar from '../components/avatar/avatar';
import HeaderPost from '../components/post/header-post';
import ImageContainer from '../components/image/image-container';
import { FooterPost } from '../components/post/footer-post';

export default function SignIn() {
    const [ratio, setRatio] = useState(16 / 9);
    const [ratio1, setRatio1] = useState(16 / 9);
    const [ratio2, setRatio2] = useState(16 / 9);
    const [ratio3, setRatio3] = useState(9 / 16);
    const [ratio4, setRatio4] = useState(1);
    const [ratio5, setRatio5] = useState(9 / 16);

    return (
        <section className="p-[30px] rounded-[15px] bg-secondary-10 space-y-7">
            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <div className="flex gap-3">
                    <Avatar
                        size="medium"
                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662612184/avatar2_kin9jc.jpg"
                    />
                    <div className="w-full flex items-center bg-secondary-10 overflow-hidden rounded-[10px] pr-[10px]">
                        <input
                            type="text"
                            className="w-full items-center bg-secondary-10 text-secondary-40 px-[10px] focus:outline-none"
                            placeholder="what's happening?"
                        />
                        {/* <RiUserSmileLine size={24} /> */}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-7">
                        <button className="flex items-center gap-2">
                            <BsCameraVideo size={16} />
                            Live video
                        </button>
                        <button className="flex items-center gap-2">
                            <BsImage size={16} />
                            Photo/Video
                        </button>
                        <button className="flex items-center gap-2">
                            <RiUserSmileLine size={16} />
                            Feeling
                        </button>
                    </div>

                    <button className="rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center">Post</button>
                </div>
            </div>

            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <HeaderPost
                    avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                    displayName="Munn No"
                    timeAgo={'16h'}
                    visibleFor="public"
                />

                <div className="grid grid-cols-2 gap-4">
                    <ImageContainer
                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662601782/wallpaper1_im7d6h.jpg"
                        quantity="multiple"
                    />
                    <div className="space-y-4">
                        <ImageContainer
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                            quantity="multiple"
                            className="aspect-video"
                        />
                        <ImageContainer
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                            quantity="multiple"
                            className="aspect-video"
                        />
                        <ImageContainer
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                            quantity="multiple"
                            className="aspect-video"
                        />
                    </div>
                </div>
                <FooterPost />
            </div>

            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <HeaderPost
                    avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                    displayName="Munn No"
                    timeAgo={'16h'}
                    visibleFor="public"
                />

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <ImageContainer
                            quantity="multiple"
                            className="aspect-video"
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                        />
                        <ImageContainer
                            quantity="multiple"
                            className="aspect-video"
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                        />
                    </div>
                    <ImageContainer
                        quantity="multiple"
                        className="aspect-video"
                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662606364/wallpaperflare.com_wallpaper_rtc6e8.jpg"
                    />
                </div>
            </div>

            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <HeaderPost
                    avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                    displayName="Munn No"
                    timeAgo={'16h'}
                    visibleFor="public"
                />

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <ImageContainer
                            quantity="multiple"
                            className="aspect-video"
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                        />
                        <ImageContainer
                            quantity="multiple"
                            className="aspect-video"
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ImageContainer
                            quantity="multiple"
                            className="aspect-video"
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                        />
                        <ImageContainer
                            quantity="multiple"
                            className="aspect-video"
                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <HeaderPost
                    avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                    displayName="Sepural Monn"
                    timeAgo={'8h'}
                    visibleFor="public"
                />

                <ImageContainer
                    quantity="single"
                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662606360/wallpaperflare.com_wallpaper_1_tzlhiy.jpg"
                />
            </div>

            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <HeaderPost
                    avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                    displayName="Sepural Gallery"
                    timeAgo={'16h'}
                    visibleFor="public"
                />
                <ImageContainer
                    quantity="single"
                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                />
            </div>

            <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                <HeaderPost
                    avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                    displayName="Sepural Gallery"
                    timeAgo={'16h'}
                    visibleFor="public"
                />

                <div className="grid grid-cols-2 gap-4">
                    <ImageContainer
                        quantity="multiple"
                        className="aspect-square"
                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                    />
                    <ImageContainer
                        quantity="multiple"
                        className="aspect-square"
                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662601782/wallpaper1_im7d6h.jpg"
                    />
                </div>
            </div>
        </section>
    );
}
