import ImageLayout from '../../layouts/image-layout';
import { FooterPost } from './footer-post';
import HeaderPost from './header-post';

interface Props {
    post: IPost;
    hasFrame?: boolean;
    isViewedDetail?: boolean;
}

export default function Post({ post, hasFrame = true, isViewedDetail = true }: Props) {
    const { avatar, name, images, createdAt, visibleFor, content, feeling, _id } = post;
    return (
        <div className={`p-[18px] bg-white  space-y-4 ${hasFrame && 'shadow-light rounded-[15px]'}`}>
            <HeaderPost
                avatarUrl={avatar}
                displayName={name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName}
                timeAgo={createdAt}
                visibleFor={visibleFor}
                feeling={feeling}
            />
            <p>{content}</p>
            {isViewedDetail && images && <ImageLayout images={images} />}
            <FooterPost postId={_id} />
        </div>
    );
}
