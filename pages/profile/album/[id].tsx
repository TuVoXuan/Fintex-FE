import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { VscLoading } from 'react-icons/vsc';
import Avatar from '../../../components/avatar/avatar';
import { useAppSelector } from '../../../hook/redux';
import { MainLayout } from '../../../layouts/main-layout';
import { selectUser } from '../../../redux/reducers/user-slice';
import Image from 'next/image';
import userApi from '../../../api/user-api';
import { toastError } from '../../../util/toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoClose } from 'react-icons/io5';
import SwiperCore from 'swiper';
import LoadingImage from '../../../components/loading-image/loading-image';

interface Props {
    personId: string;
}

export default function MyAlbum({ personId }: Props) {
    console.log('personId: ', personId);

    const sUser = useAppSelector(selectUser);

    const postsRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<HTMLDivElement>(null);
    const scrollTopRef = useRef<HTMLButtonElement>(null);

    const [album, setAlbum] = useState<IAlbum[]>([]);
    const [after, setAfter] = useState<string>();
    const [swiper, setSwiper] = useState<SwiperCore>();
    const [user, setUser] = useState<IUserProfileRes>();

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

    const handleScrollToTop = () => {
        if (postsRef.current) {
            postsRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const slideTo = (index: number) => {
        if (swiper) {
            console.log('hello');
            swiper.slideTo(index);
        }
    };

    const fetchUser = () => {
        if (sUser.data && sUser.data._id !== personId) {
            userApi
                .getProfile(personId)
                .then((data) => setUser(data.data.data))
                .catch((error) => toastError(error));
        }
    };

    const fetchAlbum = () => {
        if (after !== 'ended') {
            userApi
                .getAlbum({ limit: 10, after: after, id: personId })
                .then((data) => {
                    setAlbum((value) => [...value, ...data.album]);
                    setAfter(data.after);
                })
                .catch((error) => toastError(error));
        }
    };

    useEffect(() => {
        fetchUser();
    }, [sUser]);

    useEffect(() => {
        fetchAlbum();
    }, []);

    return (
        <MainLayout>
            <section
                className="relative flex flex-col h-full overflow-y-auto"
                id="album"
                ref={postsRef}
                onScroll={handleShowScrollTop}
            >
                <section className="rounded-xl shadow-right">
                    <div className="relative">
                        <div className="w-full overflow-hidden rounded-t-xl image-container h-96">
                            <Image
                                src={user?.coverPhoto || sUser.data?.coverPhoto || ''}
                                alt="image"
                                width={100}
                                height={100}
                                layout="fill"
                                objectFit="cover"
                                objectPosition="top"
                            />
                        </div>

                        <div className="absolute bottom-0 left-7 translate-y-[20%]">
                            <div className="relative">
                                <Avatar
                                    url={user?.avatar || sUser.data?.avatar || ''}
                                    size="large"
                                    className="border-2 border-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-8 px-7">
                        <h2 className="text-secondary-80">
                            {(user && `${user.name.firstName} ${user.name.lastName}`) ||
                                (sUser.data && `${sUser.data.name.firstName} ${sUser.data.name.lastName}`)}
                        </h2>
                    </div>
                </section>
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
                            scrollableTarget="album"
                        >
                            <div className="grid grid-cols-4 gap-4 ">
                                {album.map((image, index) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                if (swiperRef.current) {
                                                    swiperRef.current.hidden = false;
                                                    slideTo(index);
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
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </InfiniteScroll>
                    </div>
                </section>
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
            <div hidden ref={swiperRef} className="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black">
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
                        console.log('e: ', e);
                        setSwiper(e);
                    }}
                    navigation={true}
                    modules={[Navigation]}
                    className="w-full h-full"
                >
                    {album.map((item) => (
                        <SwiperSlide key={item.publicId}>
                            <Image src={item.url} layout="fill" alt="post image" objectFit="contain" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </MainLayout>
    );
}

export async function getServerSideProps(context: any) {
    const id = context.query.id;

    return {
        props: {
            personId: id,
        },
    };
}
