import { useCallback, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '../util/crop-image';
import userApi from '../api/user-api';
import { UploadImage } from '../types/enums';

export default function TempPage() {
    const [tempImg, setTempImg] = useState<IImage>();
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const [croppedImage, setCroppedImage] = useState<any>();
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(true);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        console.log(croppedArea, croppedAreaPixels);
        setCroppedAreaPixels(croppedAreaPixels);
        setDisable(false);
    }, []);

    const handleGetCroppedImage = useCallback(async () => {
        try {
            if (tempImg && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(tempImg.url, croppedAreaPixels);
                console.log('donee', croppedImage);
                // setCroppedImage(croppedImage);
                const formData = new FormData();
                formData.append('image', croppedImage as Blob);
                if (content) {
                    formData.append('content', content);
                }
                formData.append('typeUpdate', UploadImage.Avatar);

                const response = await userApi.uploadAvatarCover(formData);
                console.log('response.data: ', response.data);
            }
        } catch (e) {
            console.error(e);
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

        // if (dimension.height > dimension.width) {
        //     setWidth(300);
        //     setHeight((300 * dimension.height) / dimension.width);
        // } else {
        //     setHeight(300);
        //     setWidth((300 * dimension.width) / dimension.height);
        // }

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

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center hover:scrollbar-show overflow-y-auto bg-secondary-80/60 py-14">
            <div className="bg-white rounded-lg w-[700px] h-fit">
                <div className="grid grid-cols-6 border-b">
                    <div className="flex items-center justify-center col-span-4 col-start-2">
                        <h3>Cập nhập ảnh đại diện</h3>
                    </div>
                    <div className="flex items-center justify-end p-4">
                        <button className="p-1 transition-colors duration-150 ease-linear rounded-full bg-secondary-10 hover:bg-secondary-20">
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
                        // <Image
                        //     src={tempImg.url}
                        //     alt="avatar"
                        //     width={width}
                        //     height={height}
                        //     layout="fixed"
                        //     objectFit="contain"
                        // />
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
                        onClick={handleUploadImage}
                        className="px-10 py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Tải ảnh
                    </button>
                    <input ref={inputFileRef} hidden type="file" name="avatar" id="avatar" onChange={handleFileInput} />
                </div>
                <div className="flex justify-end gap-6 p-4">
                    <button className="px-10 py-3 font-semibold text-blue-600 transition-colors duration-300 ease-linear bg-white rounded-lg hover:bg-gray-100">
                        Hủy
                    </button>
                    <button
                        disabled={disable}
                        onClick={() => {
                            handleGetCroppedImage();
                        }}
                        className="px-10 py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-secondary-20 disabled:text-white disabled:cursor-not-allowed"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
