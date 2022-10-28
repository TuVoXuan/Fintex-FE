import { IoClose } from 'react-icons/io5';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Post from '../../components/post/post';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import { resetPost, selectPost } from '../../redux/reducers/post-slice';
import { toastError } from '../../util/toast';
import postApi from '../../api/post-api';
import { useEffect, useState } from 'react';
import { resetComments } from '../../redux/reducers/comments-slice';

export default function DetailPost() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const postId = router.query.postId as string;
    const postPersonId = router.query.postPersonId as string;
    const tempPost = useAppSelector(selectPost).posts.find((item) => item._id === postId);

    const [post, setPost] = useState<IPost>();

    const handleBack = () => {
        dispatch(resetPost());
        dispatch(resetComments());
        router.back();
    };

    const handleGetDetailPost = async () => {
        try {
            const response = await postApi.getDetailPost({ postId, postPersonId });
            setPost(response.data.data);
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        if (postPersonId) {
            handleGetDetailPost();
        } else {
            if (tempPost) {
                setPost(tempPost);
            }
        }
    }, []);

    return (
        <section className="grid h-full grid-cols-3">
            <div className="relative col-span-2 bg-black">
                <button
                    onClick={handleBack}
                    className="absolute z-10 p-3 text-white rounded-full bg-black/30 top-2 left-2"
                >
                    <IoClose size={24} />
                </button>
                {post && post.postType === 'avatar' && (
                    <Swiper navigation={true} modules={[Navigation]} className="w-full h-full">
                        {post && post.images && (
                            <SwiperSlide>
                                <Image src={post.images[0].url} layout="fill" alt="post image" objectFit="contain" />
                            </SwiperSlide>
                        )}
                    </Swiper>
                )}
                {post && post.postType !== 'avatar' && (
                    <Swiper navigation={true} modules={[Navigation]} className="w-full h-full">
                        {post &&
                            post.images &&
                            post.images.map((image) => (
                                <SwiperSlide key={image.url}>
                                    <Image src={image.url} layout="fill" alt="post image" objectFit="contain" />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                )}
            </div>
            <div className="h-screen overflow-y-auto">
                {post && <Post post={post} isViewedDetail={false} hasFrame={false} />}
            </div>
        </section>
    );
}
