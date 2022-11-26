import React, { memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import { useAppDispatch } from '../../hook/redux';
import { resetPost } from '../../redux/reducers/post-slice';
import { resetComments } from '../../redux/reducers/comments-slice';

interface Props {
    avatar: string;
    name: string;
    id: string;
}

function MiniFriendCard({ avatar, name, id }: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleClick = () => {
        dispatch(resetPost());
        dispatch(resetComments());
        router.push(`${APP_PATH.PROFILE}/${id}`);
    };

    return (
        <div onClick={handleClick} className="cursor-pointer">
            <div className="w-full overflow-hidden rounded-md aspect-square">
                <Image
                    alt="friend avatar"
                    src={avatar}
                    width={100}
                    height={100}
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL="/images/avatar.jpg"
                />
            </div>
            <p className="text-xs font-semibold">{name}</p>
        </div>
    );
}

export default memo(MiniFriendCard, (prevProps, nextProps) => {
    if (prevProps.avatar === nextProps.avatar && prevProps.id === nextProps.id && prevProps.name === nextProps.name) {
        return true;
    }
    return false;
});
