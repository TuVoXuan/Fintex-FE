import Avatar from '../avatar/avatar';

interface Props {
    name: string;
    avatar: string;
}

export default function Stranger({ name, avatar }: Props) {
    const handleClick = () => {
        alert('helo');
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
