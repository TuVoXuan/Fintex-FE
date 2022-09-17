import ImageLayout from '../../layouts/image-layout';
import { FooterPost } from './footer-post';
import HeaderPost from './header-post';

interface Props {
    post: IPost;
    hasFrame?: boolean;
    isViewedDetail?: boolean;
}

export default function Post({ post, hasFrame = true, isViewedDetail = true }: Props) {
    const { avatarUrl, displayName, images, timeAgo, visibleFor, content, feeling } = post;
    return (
        <div className={`p-[18px] bg-white  space-y-4 ${hasFrame && 'shadow-light rounded-[15px]'}`}>
            <HeaderPost
                avatarUrl={avatarUrl}
                displayName={displayName}
                timeAgo={timeAgo}
                visibleFor={visibleFor}
                feeling={feeling}
            />
            <p>{content}</p>
            {isViewedDetail && <ImageLayout images={images} />}
            <FooterPost postId={'631e05da893ed64410078565'} />
        </div>
    );
}
