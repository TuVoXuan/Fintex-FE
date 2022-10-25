import { useRouter } from 'next/router';
import APP_PATH from '../../constants/app-path';
import Avatar from '../avatar/avatar';

interface Props {
    id: string;
    name: string;
    avatar: string;
}

export default function Stranger({ id, name, avatar }: Props) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`${APP_PATH.PROFILE}/${id}`);
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
