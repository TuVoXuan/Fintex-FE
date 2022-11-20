import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import { useAppDispatch } from '../../hook/redux';
import { resetComments } from '../../redux/reducers/comments-slice';
import { resetPost } from '../../redux/reducers/post-slice';
import Avatar from '../avatar/avatar';

interface Props {
    name: string;
    avatar: string;
    userId: string;
}

export default function Stranger({ name, avatar, userId }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleClick = () => {
        const currentRoute = router.asPath;
        if (currentRoute !== `${APP_PATH.PROFILE}/${userId}`) {
            console.log('chuyen toi trang ca nhan');
            dispatch(resetComments());
            dispatch(resetPost());
            router.push(`${APP_PATH.PROFILE}/${userId}`);
        }
    };

    return (
        <section
            onClick={handleClick}
            className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-secondary-20"
        >
            <Avatar url={avatar} size="medium" />
            <p>{name}</p>
        </section>
    );
}
