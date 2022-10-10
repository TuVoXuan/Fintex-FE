import { useAppSelector } from '../../hook/redux';
import ImageLayout from '../../layouts/image-layout';
import { selectUser } from '../../redux/reducers/user-slice';
import { FooterPost } from './footer-post';
import HeaderPost from './header-post';

interface Props {
    post: IPost;
    hasFrame?: boolean;
    isViewedDetail?: boolean;
    editPost?: (postId: string) => () => void;
}

export default function Post({ post, hasFrame = true, isViewedDetail = true, editPost }: Props) {
    const sUser = useAppSelector(selectUser);
    const { avatar, name, images, createdAt, visibleFor, content, feeling, _id, comments, reactions, userId } = post;
    const mineReaction = reactions.find((item) => item.user._id === sUser.data?._id);

    return (
        <div className={`p-[18px] bg-white  space-y-4 ${hasFrame && 'shadow-light rounded-[15px]'}`}>
            <HeaderPost
                avatarUrl={avatar}
                displayName={name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName}
                timeAgo={createdAt}
                visibleFor={visibleFor}
                feeling={feeling}
                postId={_id}
                editPost={editPost}
                isMine={sUser.data?._id === userId}
            />
            <p>{content}</p>
            {isViewedDetail && images && <ImageLayout images={images} postId={_id} />}
            <FooterPost postId={_id} numsComment={comments} mineReaction={mineReaction?.type} />
        </div>
    );
}
