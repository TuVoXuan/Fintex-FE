import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { RiUserSmileLine } from 'react-icons/ri';
import ImageLayout from '../../../layouts/image-layout';
import Avatar from '../../avatar/avatar';
import Feeling from './feeling';

interface Props {
    onClose: () => void;
}

interface IFormCreatePost {
    content: string;
}

export default function CreatePost({ onClose }: Props) {
    const [visibleFor, setVisibleFor] = useState<string>('public');
    const [images, setImages] = useState<IImage[]>([]);
    const [feeling, setFeeling] = useState<IFeeling>();
    // const [content, setContent] = useState<string>();

    const uploadBtnRef = useRef<HTMLInputElement>(null);
    const feelingRef = useRef<HTMLDivElement>(null);
    const createPostRef = useRef<HTMLDivElement>(null);
    const submitPostRef = useRef<HTMLButtonElement>(null);

    console.log('re-render create post');

    const { register, watch, getValues } = useForm<IFormCreatePost>();

    const handleVisibleFor = (e: any) => {
        setVisibleFor(e.target.value);
    };

    const handleUploadImages = () => {
        if (uploadBtnRef.current) {
            uploadBtnRef.current.click();
        }
    };

    const handleDeleteImages = () => {
        setImages([]);
    };

    const handleFeeling = (fell: IFeeling) => () => {
        setFeeling(fell);
        handleCloseFeeling();
    };

    const handleOpenFeeling = () => {
        if (feelingRef.current && createPostRef.current) {
            feelingRef.current.classList.remove('hidden');
            createPostRef.current?.classList.add('hidden');

            setTimeout(() => {
                createPostRef.current?.classList.add('-translate-x-[110%]');
                feelingRef.current?.classList.remove('translate-x-[110%]');
            }, 10);
        }
    };

    const handleCloseFeeling = () => {
        if (feelingRef.current && createPostRef.current) {
            createPostRef.current.classList.remove('hidden');
            feelingRef.current?.classList.add('hidden');

            setTimeout(() => {
                createPostRef.current?.classList.remove('-translate-x-[110%]');
                feelingRef.current?.classList.add('translate-x-[110%]');
            }, 10);
        }
    };

    const handleFileInput = async (e: any) => {
        const filesLength = e.target.files.length;

        const maxUploadImage = +(process.env.MAX_UPLOAD_IMAGE as string);
        console.log('maxUploadImage: ', maxUploadImage);
        let length = 0;

        if (filesLength + images.length > maxUploadImage) {
            length = maxUploadImage - images.length;
        } else {
            length = filesLength;
        }

        const tempImages: IImage[] = [];

        for (let index = 0; index < length; index++) {
            const file: File = e.target.files[index];
            const dimension: IDimension = await imageDimensions(file);
            const url = URL.createObjectURL(file);

            tempImages.push({
                url,
                orientation: dimension.width > dimension.height ? 'horizontal' : 'vertical',
            });
        }

        setImages([...images, ...tempImages]);
    };

    const imageDimensions = (file: File) =>
        new Promise<IDimension>((resolve, reject) => {
            const img = document.createElement('img');

            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                resolve({ width, height });
            };

            img.onerror = () => {
                reject('There was some problem with the image.');
            };

            img.src = URL.createObjectURL(file);
        });

    const handleCreatePost = () => {
        const content = getValues('content');
        console.log('content: ', content);
        console.log('images: ', images);
        console.log('feeling: ', feeling);
        console.log('visible for: ', visibleFor);
    };

    const isAbleCreatePost = (): boolean => {
        if (images.length === 0 && !getValues('content') && !feeling) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (images.length === 0 && value.content?.length === 0 && !feeling) {
                if (submitPostRef.current) {
                    submitPostRef.current.disabled = true;
                }
            } else {
                if (submitPostRef.current) {
                    submitPostRef.current.disabled = false;
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, feeling, images]);

    return (
        <div className="fixed overflow-hidden rounded-[15px] p-[18px] top-14 bg-white shadow-light  z-20 w-[calc(100%-728px)]">
            <div ref={createPostRef} className="space-y-4 transition duration-300 ease-in-out">
                <div className="flex justify-between">
                    <h3>Tạo bài đăng</h3>
                    <div>
                        <div className="flex items-center gap-4">
                            <label htmlFor="" className="text-secondary-40">
                                Visible for
                            </label>
                            <select defaultValue="public" onChange={handleVisibleFor}>
                                <option value="friends">Friends</option>
                                <option value="public">Public</option>
                                <option value="only me">Only me</option>
                            </select>
                            <button onClick={onClose}>
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
                    <div>
                        <h4 className="font-semibold text-secondary-80">
                            Võ Xuân Tú{feeling && ` đang ${feeling.emoji} cảm thấy ${feeling.name}.`}
                        </h4>
                        <h5 className="font-medium capitalize text-secondary-40">{visibleFor}</h5>
                    </div>
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
                <textarea
                    {...register('content')}
                    rows={3}
                    className="w-full rounded-[10px] bg-secondary-10 text-secondary-40 px-[10px] py-[15px] focus:outline-none"
                    placeholder="what's happening?"
                />
                <div className="relative overflow-y-auto max-h-64">
                    {images && (
                        <button
                            onClick={handleDeleteImages}
                            className="absolute z-10 p-1 bg-white border rounded-full top-2 right-2"
                        >
                            <IoClose size={20} />
                        </button>
                    )}
                    <ImageLayout images={images} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex gap-7">
                        <button className="flex items-center gap-2">
                            <BsCameraVideo size={16} />
                            Live video
                        </button>
                        <button
                            onClick={handleUploadImages}
                            disabled={images.length === +(process.env.MAX_UPLOAD_IMAGE as string)}
                            className="flex items-center gap-2 disabled:cursor-not-allowed"
                        >
                            <BsImage size={16} />
                            Photo/Video
                        </button>
                        <button className="flex items-center gap-2" onClick={handleOpenFeeling}>
                            <RiUserSmileLine size={16} />
                            Feeling
                        </button>
                    </div>

                    <button
                        ref={submitPostRef}
                        disabled={isAbleCreatePost()}
                        onClick={handleCreatePost}
                        className=" rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center disabled:bg-secondary-30 disabled:text-secondary-40 disabled:cursor-not-allowed"
                    >
                        <h4>Post</h4>
                    </button>
                </div>
            </div>
            <div ref={feelingRef} className="hidden translate-x-[110%] space-y-4 transition duration-300 ease-in-out">
                <Feeling onFeeling={handleFeeling} onClose={handleCloseFeeling} />
            </div>
        </div>
    );
}
