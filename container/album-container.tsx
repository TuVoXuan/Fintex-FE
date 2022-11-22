import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ImageDetailContainer } from '../components/image/image-detail-container';
import LoadingImage from '../components/loading/loading-image';
import Image from 'next/image';
import userApi from '../api/user-api';
import { toastError } from '../util/toast';

interface Props {
    personId: string;
}

export default function AlbumContainer({ personId }: Props) {
    const swiperRef = useRef<RefSwiper>(null);
    const [album, setAlbum] = useState<IAlbum[]>([]);
    const [after, setAfter] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAlbum = () => {
        if (after !== 'ended') {
            userApi
                .getAlbum({ limit: 10, after: after, id: personId })
                .then((data) => {
                    setAlbum((value) => [...value, ...data.album]);
                    setAfter(data.after);
                })
                .catch((error) => toastError(error))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAlbum();
    }, []);

    return (
        <section className="py-[30px] px-12 rounded-[15px] bg-secondary-10 mt-7 flex cursor-default">
            <div className="w-full p-8 space-y-4 bg-white rounded-lg">
                <h3>Ảnh</h3>
                <InfiniteScroll
                    next={() => {
                        if (after && after !== 'ended') {
                            fetchAlbum();
                        }
                    }}
                    hasMore={after !== 'end' && after !== ''}
                    loader={<LoadingImage />}
                    dataLength={album.length}
                    scrollableTarget="profile"
                >
                    <div className="grid grid-cols-4 gap-4 ">
                        {loading ? (
                            <>
                                <LoadingImage />
                                <LoadingImage />
                                <LoadingImage />
                                <LoadingImage />
                                <LoadingImage />
                            </>
                        ) : (
                            album.map((image, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            if (swiperRef.current && swiperRef.current.swiper) {
                                                swiperRef.current.swiper.hidden = false;
                                                swiperRef.current.slideTo(index);
                                            }
                                        }}
                                        key={image.publicId}
                                    >
                                        <Image
                                            src={image.url}
                                            className="border-2 border-solid rounded-md border-secondary-10"
                                            key={image.publicId}
                                            alt="image"
                                            width={100}
                                            height={100}
                                            layout="responsive"
                                            objectFit="cover"
                                            objectPosition="center"
                                            placeholder="blur"
                                            blurDataURL="/images/avatar.jpg"
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </InfiniteScroll>
            </div>
            <ImageDetailContainer ref={swiperRef} images={album} />
        </section>
    );
}
