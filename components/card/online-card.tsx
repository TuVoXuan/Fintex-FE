import Avatar from '../avatar/avatar';

interface Props {
    id: string;
    name: string;
    url: string;
}

export default function OnlineCard({ id, name, url }: Props) {
    return (
        <section className="flex px-5 py-2 gap-5 items-center rounded-md hover:bg-gray-100 cursor-pointer">
            <Avatar size="small" online url={url} />
            <p className="font-medium">{name}</p>
        </section>
    );
}
