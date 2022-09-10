import ImageLayout from '../../layouts/image-layout';
import { FooterPost } from './footer-post';
import HeaderPost from './header-post';

interface Props {
    post: IPost;
}

export default function Post({ post }: Props) {
    const { avatarUrl, displayName, images, timeAgo, visibleFor, content, feeling } = post;
    return (
        <div className="rounded-[15px] p-[18px] bg-white shadow-light space-y-4">
            <HeaderPost
                avatarUrl={avatarUrl}
                displayName={displayName}
                timeAgo={timeAgo}
                visibleFor={visibleFor}
                feeling={feeling}
            />
            <p>{content}</p>
            <ImageLayout images={images} />
            <FooterPost />
        </div>
    );
}
