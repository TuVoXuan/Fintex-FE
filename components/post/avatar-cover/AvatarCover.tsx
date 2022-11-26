import Image from 'next/image';
import { useRouter } from 'next/router';
import Avatar from '../../avatar/avatar';
import { memo } from 'react';
interface Props {
    images: IImage[];
    postId: string;
}

function AvatarCover({ images, postId }: Props) {
    const router = useRouter();
    const handleViewDetailPost = () => {
        router.push(`/detail-post/${postId}`);
    };

    return (
        <div className="relative pb-56">
            <div className="h-[240px] w-full image-container rounded-lg overflow-hidden">
                <Image
                    src={images[1].url}
                    alt="cover"
                    width={100}
                    height={100}
                    layout="responsive"
                    objectFit="cover"
                    objectPosition="center"
                    placeholder="blur"
                    blurDataURL="/images/avatar.jpg"
                />
            </div>
            <div
                onClick={handleViewDetailPost}
                className="cursor-pointer absolute left-[50%] -translate-x-[50%] top-[55%] -translate-y-[50%]"
            >
                <Avatar url={images[0].url} size="huge" className="border-4 border-white" />
            </div>
        </div>
    );
}

export default memo(AvatarCover, (prevProps, nextProps) => {
    if (prevProps.images === nextProps.images && prevProps.postId === nextProps.postId) {
        return true;
    }
    return false;
});
