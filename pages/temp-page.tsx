import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import Post from '../components/post/post';
import { posts } from '../fake-data/fake-data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

export default function TempPage() {
    return (
        <section className="grid h-full grid-cols-3">
            <div className="relative col-span-2 bg-black">
                <button className="absolute z-10 p-3 text-white rounded-full bg-black/30 top-2 left-2">
                    <IoClose size={24} />
                </button>
                <Swiper navigation={true} modules={[Navigation]} className="w-full h-full">
                    {posts[4].images.map((image) => (
                        <SwiperSlide>
                            <Image src={image.url} layout="fill" objectFit="contain" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="h-screen overflow-y-auto">
                <Post post={posts[4]} isViewedDetail={false} hasFrame={false} />
            </div>
        </section>
    );
}
