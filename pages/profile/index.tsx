import { RiUploadCloud2Line } from 'react-icons/ri';
import { MainLayout } from '../../layouts/main-layout';
import Image from 'next/image';
import Avatar from '../../components/avatar/avatar';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { postUpdateAvatarCover } from '../../redux/actions/post-action';
import { toastError } from '../../util/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { selectUser } from '../../redux/reducers/user-slice';
import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import UploadAvatarModal from '../../components/modal/upload-avatar-modal';
import { UploadImage } from '../../types/enums';
import { userUpdateCover } from '../../redux/actions/user-action';
import { VscLoading } from 'react-icons/vsc';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '../../util/crop-image';
import 'swiper/css';
import 'swiper/css/navigation';
import ProfilePostContainer from '../../container/profile-post-container';
import NavItem from '../../components/nav-item/nav-item';
import AlbumContainer from '../../container/album-container';
import FriendsContainer from '../../container/friends-container';

export default function Profile() {
    const sUser = useAppSelector(selectUser);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);

    const [isShowsUpdateAvatarModal, setIsShowUpdateAvatarModal] = useState<boolean>(false);
    const [tempCoverImg, setTempCoverImg] = useState('');
    const [isUpdatingCover, setIsUpdatingCover] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.8);
    const [aspect, setAspect] = useState(16 / 9);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const [tempCropImgUrl, setTempCropImgUrl] = useState('');
    const [croppedFile, setCroppedFile] = useState<Blob>();
    const [imageFile, setImageFile] = useState<File>();
    const [container, setContainer] = useState<'post' | 'album' | 'friend'>('post');

    const handleScrollToTop = () => {
        if (postsRef.current) {
            postsRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleShowScrollTop = (e: any) => {
        if (e.target.scrollTop > 400) {
            if (scrollTopRef.current) {
                scrollTopRef.current.hidden = false;
            }
        } else {
            if (scrollTopRef.current) {
                scrollTopRef.current.hidden = true;
            }
        }
    };

    const handleGoToEditInfo = () => {
        router.push(APP_PATH.EDIT_PROFILE);
    };

    const handleShowUpdateAvatarModal = () => {
        setIsShowUpdateAvatarModal(true);
    };

    const handleCloseUpdateAvatarModal = () => {
        setIsShowUpdateAvatarModal(false);
    };

    const handleClickCoverImage = () => {
        if (coverRef.current) {
            coverRef.current.click();
        }
    };

    const handleInputFile = (e: any) => {
        const file: File = e.target.files[0];
        const url = URL.createObjectURL(file);
        setTempCoverImg(url);
        setImageFile(file);
    };

    const handleCancleUpdateCover = () => {
        setTempCoverImg('');
        setTempCropImgUrl('');
        setCroppedAreaPixels(undefined);
    };

    const handleUpdateCover = async () => {
        try {
            setIsUpdatingCover(true);
            const formData = new FormData();
            formData.append('image', croppedFile as Blob);
            formData.append('typeUpdate', UploadImage.Cover);

            await dispatch(userUpdateCover(formData));
            await dispatch(postUpdateAvatarCover({ typeUpdate: UploadImage.Cover }));

            setTempCoverImg('');
            setImageFile(undefined);
            setCroppedFile(undefined);
            setTempCropImgUrl('');
            setCroppedAreaPixels(undefined);
            setIsUpdatingCover(false);
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
        //  setDisable(false);
    }, []);

    const handleSwitchPage = (value: 'post' | 'album' | 'friend') => () => {
        setContainer(value);
    };

    const handleRenderPage = () => {
        switch (container) {
            case 'post':
                return <ProfilePostContainer onSwitchPage={handleSwitchPage} />;
            case 'album':
                return <AlbumContainer personId={sUser.data?._id || ''} />;
            case 'friend':
                return <FriendsContainer />;
            default:
                return <></>;
        }
    };

    useEffect(() => {
        const getCroppedTempImgUrl = async () => {
            if (tempCoverImg && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(tempCoverImg, croppedAreaPixels);
                const url = URL.createObjectURL(croppedImage as Blob);
                setTempCropImgUrl(url);
                setCroppedFile(croppedImage as Blob);
            }
        };
        getCroppedTempImgUrl();
    }, [tempCoverImg, croppedAreaPixels]);

    return (
        <MainLayout>
            <section
                className="relative flex flex-col h-full overflow-y-auto hover:scrollbar-show"
                id="profile"
                ref={postsRef}
                onScroll={handleShowScrollTop}
            >
                {tempCoverImg && (
                    <section className="relative">
                        <div className="w-full image-container h-80">
                            <div className="h-80">
                                <Cropper
                                    image={tempCoverImg}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={aspect}
                                    cropShape="rect"
                                    showGrid={false}
                                    cropSize={{ width: 400, height: 225 }}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        </div>
                    </section>
                )}
                <section className="rounded-xl shadow-right">
                    <div className="relative">
                        <div className="w-full overflow-hidden rounded-t-xl image-container h-96">
                            <Image
                                src={tempCropImgUrl || sUser.data?.coverPhoto || ''}
                                alt="image"
                                width={100}
                                height={100}
                                layout="fill"
                                objectFit="cover"
                                objectPosition="top"
                                placeholder="blur"
                                blurDataURL="/images/avatar.jpg"
                            />
                        </div>

                        <input
                            ref={coverRef}
                            onChange={handleInputFile}
                            className="hidden"
                            type="file"
                            name="coverImage"
                            id="coverImage"
                        />

                        {tempCoverImg ? (
                            <div className="absolute flex items-center gap-x-4 bottom-4 right-4">
                                <button
                                    disabled={isUpdatingCover}
                                    onClick={handleCancleUpdateCover}
                                    className="px-10 py-3 font-semibold text-blue-600 transition-colors duration-300 ease-linear bg-white rounded-lg disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    Hủy
                                </button>

                                {isUpdatingCover ? (
                                    <button className="py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg cursor-not-allowed px-14 hover:bg-blue-700 disabled:bg-secondary-20 disabled:text-white disabled:cursor-not-allowed">
                                        <VscLoading className="animate-spin" size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleUpdateCover}
                                        className="px-10 py-3 font-semibold text-white transition-colors duration-300 ease-linear bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Lưu thay đổi
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleClickCoverImage}
                                className="absolute flex items-center px-2 py-1 bg-white rounded-md bottom-3 right-3 gap-x-2"
                            >
                                <RiUploadCloud2Line size={24} />
                                Cập nhập ảnh bìa
                            </button>
                        )}

                        <div className="absolute bottom-0 left-7 translate-y-[20%]">
                            <div className="relative">
                                <Avatar url={sUser.data?.avatar || ''} size="large" className="border-2 border-white" />
                                <button
                                    onClick={handleShowUpdateAvatarModal}
                                    className="absolute p-1 bg-white rounded-full bottom-[20%] right-0 translate-y-[50%]"
                                >
                                    <RiUploadCloud2Line size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 px-7">
                        <h2 className="text-secondary-80">
                            {sUser.data && `${sUser.data.name.firstName} ${sUser.data.name.lastName}`}
                        </h2>
                        <button className="px-4 py-1 rounded bg-secondary-20" onClick={handleGoToEditInfo}>
                            Edit info
                        </button>
                    </div>
                    <nav className="px-4 space-x-4 overflow-hidden rounded-xl">
                        <NavItem title="Bài viết" actived={container === 'post'} onClick={handleSwitchPage('post')} />
                        <NavItem title="Ảnh" actived={container === 'album'} onClick={handleSwitchPage('album')} />
                        <NavItem title="Bạn bè" actived={container === 'friend'} onClick={handleSwitchPage('friend')} />
                    </nav>
                </section>
                {handleRenderPage()}
                <div className="absolute w-10 h-10 bottom-3 right-3">
                    <button
                        ref={scrollTopRef}
                        onClick={handleScrollToTop}
                        className="fixed p-2 bg-white border rounded-md bottom-3 hover:bg-secondary-30"
                    >
                        <IoIosArrowUp size={20} />
                    </button>
                </div>
            </section>
            {isShowsUpdateAvatarModal && <UploadAvatarModal onClose={handleCloseUpdateAvatarModal} />}
        </MainLayout>
    );
}
