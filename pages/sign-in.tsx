import Image from 'next/image';
import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { RiUserSmileLine } from 'react-icons/ri';
import { MdMoreHoriz, MdOutlineRadioButtonChecked } from 'react-icons/md';
import { useRef, useState } from 'react';
import Avatar from '../components/avatar/avatar';
import HeaderPost from '../components/post/header-post';
import ImageContainer from '../components/image/image-container';
import { MainLayout } from '../layouts/main-layout';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ImageLayout from '../layouts/image-layout';
import { FooterPost } from '../components/post/footer-post';

export default function SignIn() {
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [images, setImages] = useState<IImage[]>([]);
    const uploadBtnRef = useRef<HTMLInputElement>(null);

    const handleForcus = () => {
        setIsShowModal(true);
    };

    const handleColseModal = () => {
        setIsShowModal(false);
    };

    const handleUploadImages = () => {
        if (uploadBtnRef.current) {
            uploadBtnRef.current.click();
        }
    };

    const handleFileInput = async (e: any) => {
        const filesLength = e.target.files.length;
        const tempImages: IImage[] = [];

        for (let index = 0; index < filesLength; index++) {
            const file: File = e.target.files[index];
            const dimension: IDimension = await imageDimensions(file);
            const url = URL.createObjectURL(file);

            tempImages.push({
                url,
                orientation: dimension.width > dimension.height ? 'horizontal' : 'vertical',
            });
        }

        setImages(tempImages);
    };

    const imageDimensions = (file: File) =>
        new Promise<IDimension>((resolve, reject) => {
            const img = document.createElement('img');

            // the following handler will fire after a successful loading of the image
            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                resolve({ width, height });
            };

            // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
            img.onerror = () => {
                reject('There was some problem with the image.');
            };

            img.src = URL.createObjectURL(file);
        });

    return (
        <MainLayout>
            <section className="grid grid-cols-3 ">
                <div className="h-[88vh] col-span-2 overflow-y-auto">
                    <section className="relative py-[30px] px-20 rounded-[15px] bg-secondary-10 space-y-7">
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <div className="flex gap-3">
                                <Avatar
                                    size="medium"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662612184/avatar2_kin9jc.jpg"
                                />
                                <div className="w-full flex items-center bg-secondary-10 overflow-hidden rounded-[10px] pr-[10px]">
                                    <input
                                        onFocus={handleForcus}
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

                                <button className="rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center">
                                    Post
                                </button>
                            </div>
                        </div>

                        {isShowModal && (
                            <div className="fixed rounded-[15px] p-[18px] top-14 bg-white shadow-light space-y-4 z-20 w-[calc(100%-728px)]">
                                <div className="flex justify-between">
                                    <p>Create post</p>
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <label htmlFor="" className="text-secondary-40">
                                                Visible for
                                            </label>
                                            <select>
                                                <option value="friends">Friends</option>
                                                <option value="public">Public</option>
                                                <option value="only me">Only me</option>
                                            </select>
                                            <button onClick={handleColseModal}>
                                                <AiOutlineCloseCircle size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="flex gap-3">
                                    <Avatar
                                        size="small"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662612184/avatar2_kin9jc.jpg"
                                    />
                                    <textarea
                                        rows={5}
                                        className="w-full rounded-[10px] bg-secondary-10 text-secondary-40 px-[10px] py-[15px] focus:outline-none"
                                        placeholder="what's happening?"
                                    />
                                    <input
                                        type="file"
                                        name="images"
                                        multiple
                                        hidden
                                        accept="image/png, image/jpg, image/jpeg"
                                        ref={uploadBtnRef}
                                        onChange={handleFileInput}
                                    />
                                </div>
                                <div className="overflow-y-auto max-h-72">
                                    <ImageLayout images={images} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-7">
                                        <button className="flex items-center gap-2">
                                            <BsCameraVideo size={16} />
                                            Live video
                                        </button>
                                        <button onClick={handleUploadImages} className="flex items-center gap-2">
                                            <BsImage size={16} />
                                            Photo/Video
                                        </button>
                                        <button className="flex items-center gap-2">
                                            <RiUserSmileLine size={16} />
                                            Feeling
                                        </button>
                                    </div>

                                    <button className="rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center">
                                        Post
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* 1 doc 3 vuong */}
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
                        {/* 1 ngang 2 vuong */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Munn No"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />

                            <div className="space-y-2">
                                <ImageContainer
                                    quantity="multiple"
                                    className="aspect-video"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662606364/wallpaperflare.com_wallpaper_rtc6e8.jpg"
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                    />
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* 4 vuong */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Munn No"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />

                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-x-2">
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                    />
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-x-2">
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                    />
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* 1 ngang */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Sepural Monn"
                                timeAgo={'8h'}
                                visibleFor="public"
                            />

                            <ImageContainer
                                quantity="multiple"
                                className="aspect-video"
                                url="https://res.cloudinary.com/cake-shop/image/upload/v1662606360/wallpaperflare.com_wallpaper_1_tzlhiy.jpg"
                            />
                        </div>
                        {/* 1 doc */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Sepural Gallery"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />
                            <ImageContainer
                                quantity="multiple"
                                className="aspect-9/16"
                                url="https://res.cloudinary.com/cake-shop/image/upload/v1662612184/avatar2_kin9jc.jpg"
                            />
                        </div>
                        {/* 1 doc, 1 ngang */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Sepural Gallery"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />

                            <div className="grid grid-cols-2 gap-2">
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

                        {/* 2 ngang */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Munn No"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />

                            <div className="space-y-2">
                                <ImageContainer
                                    quantity="multiple"
                                    className="aspect-video"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662606364/wallpaperflare.com_wallpaper_rtc6e8.jpg"
                                />
                                <ImageContainer
                                    quantity="multiple"
                                    className="aspect-video"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662606364/wallpaperflare.com_wallpaper_rtc6e8.jpg"
                                />
                            </div>
                        </div>

                        {/* 2 doc */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Munn No"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />

                            <div className="grid grid-cols-2 space-x-2">
                                <ImageContainer
                                    quantity="multiple"
                                    className="aspect-9/16"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                                />
                                <ImageContainer
                                    quantity="multiple"
                                    className="aspect-9/16"
                                    url="https://res.cloudinary.com/cake-shop/image/upload/v1662612184/avatar2_kin9jc.jpg"
                                />
                            </div>
                        </div>
                        {/* 5 hinh */}
                        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
                            <HeaderPost
                                avatarUrl="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                displayName="Munn No"
                                timeAgo={'16h'}
                                visibleFor="public"
                            />

                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-x-2">
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662707025/wallpaperflare.com_wallpaper_3_ljcc17.jpg"
                                    />
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662706845/wallpaperflare.com_wallpaper_2_wnbhok.jpg"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662601774/avatar1_hysxkd.jpg"
                                    />
                                    <ImageContainer
                                        quantity="multiple"
                                        className="aspect-square"
                                        url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                                    />
                                    <div className="relative">
                                        <ImageContainer
                                            moreImage={4}
                                            quantity="multiple"
                                            className="aspect-square"
                                            url="https://res.cloudinary.com/cake-shop/image/upload/v1662606355/dongvat_utqia8.jpg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="relative">
                    <div className="bg-yellow-300">
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                        <p>lskdfsd</p>
                    </div>
                </div>
            </section>

            {isShowModal && (
                <div
                    onClick={handleColseModal}
                    className="fixed top-0 bottom-0 left-0 right-0 z-10 opacity-60 bg-secondary-80 blur-sm"
                ></div>
            )}
        </MainLayout>
    );
}
