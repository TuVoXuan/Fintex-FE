import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface Props {
    images: IAlbum[];
}

export const ImageDetailContainer = React.forwardRef<RefSwiper, Props>((props, ref) => {
    const swiperRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<IAlbum[]>(props.images);
    console.log('images: ', images);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>();
    const [swiper, setSwiper] = useState<SwiperCore>();

    useImperativeHandle(ref, () => ({
        swiper: swiperRef.current as HTMLDivElement,
        slideTo: (number) => {
            if (swiper && thumbsSwiper) {
                swiper.slideTo(number);
                thumbsSwiper.slideTo(number);
            }
        },
    }));

    useEffect(() => {
        setImages(props.images);
    }, [props.images]);

    return (
        <div hidden ref={swiperRef} className="fixed top-0 bottom-0 left-0 right-0 z-30 bg-secondary-35/90">
            <IoClose
                onClick={() => {
                    if (swiperRef.current) {
                        swiperRef.current.hidden = true;
                    }
                }}
                size={48}
                className="fixed z-40 p-2 bg-white rounded-full cursor-pointer drop-shadow-md right-6 top-6"
            />
            <Swiper
                onSwiper={(e) => {
                    setSwiper(e);
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full h-4/5"
            >
                {images.map((item) => (
                    <SwiperSlide key={item.publicId}>
                        <Image
                            src={item.url}
                            layout="fill"
                            alt="post image"
                            objectFit="contain"
                            placeholder="blur"
                            blurDataURL="/images/avatar.jpg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="py-4 h-1/5">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={10}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbSwiper"
                >
                    {images.map((item) => (
                        <SwiperSlide key={item.publicId} className="flex items-center justify-center">
                            <div className="w-24 overflow-hidden rounded-md">
                                <Image
                                    src={item.url}
                                    width={100}
                                    height={100}
                                    layout="responsive"
                                    alt="post image"
                                    objectFit="cover"
                                    objectPosition="center"
                                    placeholder="blur"
                                    blurDataURL="/images/avatar.jpg"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
});

ImageDetailContainer.displayName = 'ImageDetailContainer';
