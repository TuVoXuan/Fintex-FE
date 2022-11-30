import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsCameraVideo, BsImage } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { RiUserSmileLine } from 'react-icons/ri';
import { useAppDispatch } from '../../../hook/redux';
import ImageLayout from '../../../layouts/image-layout';
import { postCreate, postUpdate } from '../../../redux/actions/post-action';
import { translateVisibleFor } from '../../../util/handle-visible-for';
import { toastError } from '../../../util/toast';
import Avatar from '../../avatar/avatar';
import Feeling from './feeling';

interface Props {
    onClose: () => void;
    imageUrl: string;
    name: {
        firstName: string;
        lastName: string;
    };
    type: 'create' | 'update';
    post?: IPost;
}

interface IFormCreatePost {
    content: string;
}

export const FormPost = React.forwardRef<HTMLDivElement, Props>(({ onClose, name, type, imageUrl, post }, ref) => {
    const dispatch = useAppDispatch();

    const [visibleFor, setVisibleFor] = useState<string>(post?.visibleFor || 'public');
    const [images, setImages] = useState<IImage[]>(post?.images || []);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [feeling, setFeeling] = useState<IFeeling | undefined>(post?.feeling || undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [deletedImages, setDeletedImages] = useState<boolean>(false);

    const uploadBtnRef = useRef<HTMLInputElement>(null);
    const feelingRef = useRef<HTMLDivElement>(null);
    const createPostRef = useRef<HTMLDivElement>(null);
    const submitPostRef = useRef<HTMLButtonElement>(null);

    console.log('re-render create post');

    const { register, watch, getValues, handleSubmit } = useForm<IFormCreatePost>({
        defaultValues: {
            content: post?.content,
        },
    });

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
        setImageFiles([]);
        setDeletedImages(true);
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
        let length = 0;

        if (filesLength + images.length > maxUploadImage) {
            length = maxUploadImage - images.length;
        } else {
            length = filesLength;
        }

        const tempImages: IImage[] = [];
        const tempImageFiles: File[] = [];

        for (let index = 0; index < length; index++) {
            const file: File = e.target.files[index];
            tempImageFiles.push(file);

            const dimension: IDimension = await imageDimensions(file);
            const url = URL.createObjectURL(file);

            tempImages.push({
                url,
                orientation: dimension.width > dimension.height ? 'horizontal' : 'vertical',
            });
        }

        setImages([...images, ...tempImages]);
        setImageFiles([...imageFiles, ...tempImageFiles]);
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

    const handleCreatePost = async () => {
        const content = getValues('content');

        const formData = new FormData();
        if (content) {
            formData.append('content', content);
        }
        if (feeling) {
            formData.append('feeling', feeling._id);
        }
        formData.append('visibleFor', visibleFor);

        if (imageFiles) {
            for (let file of imageFiles) {
                formData.append('images', file);
            }
        }

        try {
            setLoading(true);
            if (type === 'create') {
                await dispatch(postCreate(formData)).unwrap();
            } else {
                //dispatch action update post
                if (post) {
                    formData.append('deletedImages', deletedImages.toString());
                    await dispatch(postUpdate({ body: formData, postId: post._id })).unwrap();
                }
            }
            onClose();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
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
        <div
            ref={ref}
            className="fixed overflow-hidden rounded-[15px] p-[18px] top-14 bg-white shadow-light z-20 w-[600px]"
        >
            <div ref={createPostRef} className="space-y-4 transition duration-300 ease-in-out">
                <div className="flex justify-between">
                    <h3>Tạo bài đăng</h3>
                    <div>
                        <div className="flex items-center gap-4">
                            <label htmlFor="" className="text-secondary-40">
                                Chế độ đăng
                            </label>
                            <select defaultValue={post?.visibleFor || 'public'} onChange={handleVisibleFor}>
                                <option value="friends">Bạn bè</option>
                                <option value="public">Công khai</option>
                                <option value="only me">Chỉ mình tôi</option>
                            </select>
                            <button onClick={onClose}>
                                <AiOutlineCloseCircle size={24} />
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex gap-3">
                    <Avatar size="small" url={imageUrl} />
                    <div>
                        <h4 className="font-semibold text-secondary-80">
                            {name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName}
                            {feeling && ` đang ${feeling.emoji} cảm thấy ${feeling.name}.`}
                        </h4>
                        <h5 className="font-medium capitalize text-secondary-40">{translateVisibleFor(visibleFor)}</h5>
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
                <form id="createPostForm" onSubmit={handleSubmit(handleCreatePost)}>
                    <textarea
                        {...register('content')}
                        rows={3}
                        className="w-full rounded-[10px] bg-secondary-10 text-secondary-40 px-[10px] py-[15px] focus:outline-none"
                        placeholder={`${name.lastName} ơi, bạn  đang nghỉ gì thế?`}
                    />
                </form>
                <div className="relative overflow-y-auto hover:scrollbar-show max-h-64">
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
                        <button
                            onClick={handleUploadImages}
                            disabled={images.length === +(process.env.MAX_UPLOAD_IMAGE as string)}
                            className="flex items-center gap-2 disabled:cursor-not-allowed"
                        >
                            <BsImage size={16} />
                            Ảnh
                        </button>
                        <button className="flex items-center gap-2" onClick={handleOpenFeeling}>
                            <RiUserSmileLine size={16} />
                            Cảm xúc
                        </button>
                    </div>

                    {loading ? (
                        <button
                            disabled
                            className=" rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center disabled:cursor-not-allowed"
                        >
                            <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                        </button>
                    ) : (
                        <button
                            form="createPostForm"
                            type="submit"
                            ref={submitPostRef}
                            disabled={isAbleCreatePost()}
                            className=" rounded-[10px] bg-primary-80 text-white py-3 px-[30px] text-center disabled:bg-secondary-30 disabled:text-secondary-40 disabled:cursor-not-allowed"
                        >
                            <h4>{type === 'create' ? 'Đăng' : 'Chỉnh sửa'}</h4>
                        </button>
                    )}
                </div>
            </div>
            <div ref={feelingRef} className="hidden translate-x-[110%] space-y-4 transition duration-300 ease-in-out">
                <Feeling onFeeling={handleFeeling} onClose={handleCloseFeeling} />
            </div>
        </div>
    );
});

FormPost.displayName = 'FormPost';
