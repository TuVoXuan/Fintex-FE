import { useAppSelector } from '../../hook/redux';
import ImageLayout from '../../layouts/image-layout';
import { selectUser } from '../../redux/reducers/user-slice';
import AvatarCover from './avatar-cover/AvatarCover';
import { FooterPost } from './footer-post';
import HeaderPost from './header-post';

interface Props {
    post: IPost;
    hasFrame?: boolean;
    isViewedDetail?: boolean;
    editPost?: (postId: string) => () => void;
    deletePost?: (postId: string) => () => void;
    loadInPage: 'home' | 'profile' | 'detail';
}

export default function Post({
    post,
    hasFrame = true,
    isViewedDetail = true,
    editPost,
    deletePost,
    loadInPage,
}: Props) {
    const sUser = useAppSelector(selectUser);
    const { avatar, name, images, createdAt, visibleFor, content, feeling, _id, comments, reactions, postType } = post;
    const mineReaction = reactions.find((item) => item.user._id === sUser.data?._id);

    return (
        <div className={`p-[18px] bg-white  space-y-4 ${hasFrame && 'shadow-light rounded-[15px]'}`}>
            <HeaderPost
                avatarUrl={avatar}
                displayName={name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName}
                timeAgo={createdAt}
                visibleFor={visibleFor}
                feeling={feeling}
                postType={postType}
                postId={_id}
                editPost={editPost}
                deletePost={deletePost}
                loadInPage={loadInPage}
            />
            <p>{content}</p>
            {postType !== 'avatar' && isViewedDetail && images && <ImageLayout images={images} postId={_id} />}
            {postType === 'avatar' && isViewedDetail && <AvatarCover images={images || []} postId={_id} />}
            <FooterPost postId={_id} numsComment={comments} mineReaction={mineReaction?.type} />
        </div>
    );
}
