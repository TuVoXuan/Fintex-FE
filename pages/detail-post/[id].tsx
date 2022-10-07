import { IoClose } from 'react-icons/io5';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Post from '../../components/post/post';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../hook/redux';
import { selectPost } from '../../redux/reducers/post-slice';

export default function DetailPost() {
    const router = useRouter();
    const { id } = router.query;

    const post = useAppSelector(selectPost).posts.find((item) => item._id === id);

    const handleBack = () => {
        router.push('/');
    };

    return (
        <section className="grid h-full grid-cols-3">
            <div className="relative col-span-2 bg-black">
                <button
                    onClick={handleBack}
                    className="absolute z-10 p-3 text-white rounded-full bg-black/30 top-2 left-2"
                >
                    <IoClose size={24} />
                </button>
                <Swiper navigation={true} modules={[Navigation]} className="w-full h-full">
                    {post &&
                        post.images &&
                        post.images.map((image) => (
                            <SwiperSlide>
                                <Image src={image.url} layout="fill" objectFit="contain" />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
            <div className="h-screen overflow-y-auto">
                {post && <Post post={post} isViewedDetail={false} hasFrame={false} />}
            </div>
        </section>
    );
}
