import { RiUploadCloud2Line } from 'react-icons/ri';
import { MainLayout } from '../../layouts/main-layout';
import Image from 'next/image';
import Avatar from '../../components/avatar/avatar';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { HiOutlineCake } from 'react-icons/hi';
import { GrLocation } from 'react-icons/gr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { selectPost } from '../../redux/reducers/post-slice';
import LoadingPost from '../../components/post/loading-post';
import { postDelete, postMineLoadMore, postUpdateAvatarCover } from '../../redux/actions/post-action';
import { toastError, toastSuccess } from '../../util/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import Post from '../../components/post/post';
import { IoIosArrowUp } from 'react-icons/io';
import { selectUser } from '../../redux/reducers/user-slice';
import { FormPost } from '../../components/post/form-post/form-post';
import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import DeleteModal from '../../components/modal/delete-modal';
import { deleteAllCommentsPost } from '../../redux/actions/comment-action';
import UploadAvatarModal from '../../components/modal/upload-avatar-modal';
import { UploadImage } from '../../types/enums';
import { userUpdateCover } from '../../redux/actions/user-action';
import { VscLoading } from 'react-icons/vsc';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '../../util/crop-image';

const postTemp: IPost = {
    _id: '123',
    avatar: 'https://res.cloudinary.com/cake-shop/image/upload/v1666171462/avatar/cvnjyfjhgxdwz2zzth4n.jpg',
    createdAt: '2020-10-19',
    images: [
        {
            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666171462/avatar/cvnjyfjhgxdwz2zzth4n.jpg',
            orientation: 'vertical',
        },
        {
            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1665307479/cover/default-cover_jyhbec.jpg',
            orientation: 'horizontal',
        },
    ],
    name: {
        firstName: 'Vo Xuan',
        lastName: 'Tu',
    },
    reactions: [],
    comments: 0,
    visibleFor: 'public',
    userId: '123',
    postType: 'avatar',
};

export default function Profile() {
    const sUser = useAppSelector(selectUser);
    const sPost = useAppSelector(selectPost);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const scrollTopRef = useRef<HTMLButtonElement>(null);
    const postsRef = useRef<HTMLDivElement>(null);
    const formPostRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isShowsDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
    const [isShowsUpdateAvatarModal, setIsShowUpdateAvatarModal] = useState<boolean>(false);
    const [deletePostId, setDeletePostId] = useState<string>('');
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [postEdit, setPostEdit] = useState<IPost | undefined>();
    const [tempCoverImg, setTempCoverImg] = useState('');
    const [imageFile, setImageFile] = useState<File>();
    const [isUpdatingCover, setIsUpdatingCover] = useState(false);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.8);
    const [aspect, setAspect] = useState(16 / 9);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const [tempCropImgUrl, setTempCropImgUrl] = useState('');
    const [croppedFile, setCroppedFile] = useState<Blob>();

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

    const fetchPost = async (limit: number, after?: string) => {
        try {
            await dispatch(postMineLoadMore({ limit, after })).unwrap();
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleEditPost = (postId: string) => () => {
        setPostEdit(sPost.posts.find((item) => item._id === postId));
        setIsShowModal(true);
    };

    const handleShowDeleteModal = (postId: string) => () => {
        setDeletePostId(postId);
        setIsShowDeleteModal(true);
    };

    const handleDeletePost = async () => {
        try {
            setLoadingDelete(true);
            //delete comment
            await dispatch(deleteAllCommentsPost(deletePostId)).unwrap();
            //delete post
            await dispatch(postDelete(deletePostId)).unwrap();

            setIsShowDeleteModal(false);
            setLoadingDelete(false);

            toastSuccess('Xóa bài post thành công!');
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleColseModal = () => {
        setIsShowModal(false);
    };

    const handleClickOutSideFormPost = (event: any) => {
        const { target } = event;

        if (formPostRef.current && target && 'nodeType' in target) {
            if (!formPostRef.current.contains(target)) {
                setIsShowModal(false);
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

            // console.log('croppedFile: ', croppedFile);
            // setTimeout(() => {
            //     setTempCoverImg('');
            //     setImageFile(undefined);
            //     setIsUpdatingCover(true);
            // }, 2000);
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
        console.log(croppedArea, croppedAreaPixels);
        setCroppedAreaPixels(croppedAreaPixels);
        //  setDisable(false);
    }, []);

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

    useEffect(() => {
        if (sPost.posts.length === 0 && !sPost.after && !sPost.ended) {
            const limit = +(process.env.LIMIT as string);

            fetchPost(limit);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

        if (sPost.posts.length > 0) {
            setLoading(false);
        }
    }, []);

    return (
        <MainLayout>
            <section
                className="relative flex flex-col h-full overflow-y-auto"
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

                    <div className="flex items-center justify-between py-8 px-7">
                        <h2 className="text-secondary-80">
                            {sUser.data && `${sUser.data.name.firstName} ${sUser.data.name.lastName}`}
                        </h2>
                        <button className="px-4 py-1 rounded bg-secondary-20" onClick={handleGoToEditInfo}>
                            Edit info
                        </button>
                    </div>
                </section>

                <section className="py-[30px] px-20 rounded-[15px] bg-secondary-10 mt-7 flex">
                    <div className="sticky w-1/3 px-5 py-6 space-y-4 bg-white rounded-2xl h-fit top-3">
                        <h3>INTRO</h3>
                        <div className="flex items-center gap-3 ">
                            <BsGenderAmbiguous size={20} />
                            {sUser.data?.gender}
                        </div>
                        <div className="flex items-center gap-3 ">
                            <HiOutlineCake size={20} />
                            {new Date(sUser.data?.birthday || '').toDateString()}
                        </div>
                        <div className="flex items-center gap-3 ">
                            <GrLocation size={20} />
                            {sUser.data?.address}
                        </div>
                    </div>

                    <div className="w-2/3">
                        <InfiniteScroll
                            next={() => {
                                if (!sPost.ended) {
                                    const limit = +(process.env.LIMIT as string);
                                    if (sPost.after) {
                                        fetchPost(limit, sPost.after);
                                    }
                                }
                            }}
                            hasMore={!sPost.ended}
                            loader={<LoadingPost />}
                            dataLength={sPost.posts.length}
                            scrollableTarget="profile"
                            className="relative rounded-[15px] bg-secondary-10 space-y-5 px-10"
                        >
                            {!loading ? (
                                sPost.posts.map((post) => (
                                    <Post
                                        key={post._id}
                                        post={post}
                                        showActionPost
                                        editPost={handleEditPost}
                                        deletePost={handleShowDeleteModal}
                                    />
                                ))
                            ) : (
                                <LoadingPost />
                            )}
                        </InfiniteScroll>
                        {/* <div className="relative rounded-[15px] bg-secondary-10 space-y-5 px-10">
                            <Post key={postTemp._id} post={postTemp} loadInPage="profile" />
                        </div> */}
                        <div className="absolute w-10 h-10 bottom-3 right-3">
                            <button
                                ref={scrollTopRef}
                                onClick={handleScrollToTop}
                                className="fixed p-2 bg-white border rounded-md bottom-3 hover:bg-secondary-30"
                            >
                                <IoIosArrowUp size={20} />
                            </button>
                        </div>
                    </div>
                </section>
            </section>
            {isShowModal && (
                <div
                    onClick={handleClickOutSideFormPost}
                    className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center bg-secondary-80/60"
                >
                    <FormPost
                        ref={formPostRef}
                        imageUrl={sUser.data?.avatar || (process.env.DEFAULT_AVATAR as string)}
                        name={sUser.data?.name || { firstName: 'Võ', lastName: 'Xuân Tú' }}
                        onClose={handleColseModal}
                        type="update"
                        post={postEdit}
                    />
                </div>
            )}
            {isShowsDeleteModal && (
                <DeleteModal
                    objectName="bài post"
                    loading={loadingDelete}
                    onDelete={handleDeletePost}
                    onClose={() => setIsShowDeleteModal(false)}
                />
            )}
            {isShowsUpdateAvatarModal && <UploadAvatarModal onClose={handleCloseUpdateAvatarModal} />}
        </MainLayout>
    );
}
