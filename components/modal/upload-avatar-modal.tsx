import { useCallback, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '../../util/crop-image';
import { UploadImage } from '../../types/enums';
import { toastError } from '../../util/toast';
import { useAppDispatch } from '../../hook/redux';
import { userUpdateAvatar } from '../../redux/actions/user-action';
import { VscLoading } from 'react-icons/vsc';
import { updateAvatarAllPosts } from '../../redux/reducers/post-slice';
import { postUpdateAvatarCover } from '../../redux/actions/post-action';

interface Props {
    onClose: () => void;
}

export default function UploadAvatarModal({ onClose }: Props) {
    const dispatch = useAppDispatch();

    const [tempImg, setTempImg] = useState<IImage>();
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(true);
    const [isSubmiting, setIsSubmiting] = useState(false);

    const updateAvatarModal = useRef<HTMLDivElement>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        console.log(croppedArea, croppedAreaPixels);
        setCroppedAreaPixels(croppedAreaPixels);
        setDisable(false);
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if (tempImg && croppedAreaPixels) {
                setIsSubmiting(true);

                const croppedImage = await getCroppedImg(tempImg.url, croppedAreaPixels);
                console.log('donee', croppedImage);

                const formDataAvatar = new FormData();
                formDataAvatar.append('image', croppedImage as Blob);
                formDataAvatar.append('typeUpdate', UploadImage.Avatar);

                const resonse = await dispatch(userUpdateAvatar(formDataAvatar)).unwrap();

                await dispatch(postUpdateAvatarCover({ content, typeUpdate: UploadImage.Avatar }));
                // console.log('resonse: ', resonse);
                dispatch(updateAvatarAllPosts(resonse));
                onClose();
            }
        } catch (e) {
            console.error(e);
            onClose();
            toastError((e as IResponseError).error);
        }
    }, [croppedAreaPixels]);

    const handleUploadImage = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleFileInput = async (e: any) => {
        const file = e.target.files[0];

        const dimension: IDimension = await imageDimensions(file);
        const url = URL.createObjectURL(file);

        setTempImg({
            url,
            orientation: dimension.width > dimension.height ? 'horizontal' : 'vertical',
        });
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

    const handleClickOutSideModal = (event: any) => {
        const { target } = event;

        if (updateAvatarModal.current && target && 'nodeType' in target) {
            if (!updateAvatarModal.current.contains(target) && !isSubmiting) {
                onClose();
            }
        }
    };
    return (
        <div
            onClick={handleClickOutSideModal}
            className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center overflow-y-auto hover:scrollbar-show bg-secondary-80/60 py-14"
        >
            <div ref={updateAvatarModal} className="bg-white rounded-lg w-[700px] h-fit">
                <div className="grid grid-cols-6 border-b">
                    <div className="flex items-center justify-center col-span-4 col-start-2">
                        <h3>Cập nhập ảnh đại diện</h3>
                    </div>
                    <div className="flex items-center justify-end p-4">
                        <button
                            disabled={isSubmiting}
                            onClick={onClose}
                            className="p-1 transition-colors duration-150 ease-linear rounded-full disabled:cursor-not-allowed bg-secondary-10 hover:bg-secondary-20"
                        >
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>
                <div className="p-4">
                    <textarea
                        onChange={(event) => setContent(event.target.value)}
                        rows={4}
                        placeholder="Mô tả"
                        className="w-full p-3 border rounded-lg resize-none border-secondary-20 focus:outline-none"
                    />
                </div>
                <div className="h-[400px] relative">
                    {tempImg && (
                        <Cropper
                            image={tempImg.url}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            cropShape="round"
                            showGrid={false}
                            cropSize={{ width: 300, height: 300 }}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}
                </div>
                <div className="flex justify-center p-2 border-b">
                    <button
                        disabled={isSubmiting}
                        onClick={handleUploadImage}
                        className="px-10 py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg disabled:bg-secondary-20 disabled:text-white disabled:cursor-not-allowed hover:bg-blue-700"
                    >
                        Tải ảnh
                    </button>
                    <input ref={inputFileRef} hidden type="file" name="avatar" id="avatar" onChange={handleFileInput} />
                </div>
                <div className="flex justify-end gap-6 p-4">
                    <button
                        disabled={isSubmiting}
                        onClick={onClose}
                        className="px-10 py-3 font-semibold text-blue-600 transition-colors duration-300 ease-linear bg-white rounded-lg disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Hủy
                    </button>

                    {isSubmiting ? (
                        <button className="px-10 py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg cursor-not-allowed hover:bg-blue-700 disabled:bg-secondary-20 disabled:text-white disabled:cursor-not-allowed">
                            <VscLoading className="animate-spin" size={24} />
                        </button>
                    ) : (
                        <button
                            disabled={disable}
                            onClick={() => {
                                handleSubmit();
                            }}
                            className="px-10 py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg hover:bg-blue-700 "
                        >
                            Lưu
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
