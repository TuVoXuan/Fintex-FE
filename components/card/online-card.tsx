import { MouseEventHandler } from 'react';
import Avatar from '../avatar/avatar';

interface Props {
    id: string;
    name: string;
    url: string;
    onClick: MouseEventHandler<HTMLElement> | undefined;
}

export default function OnlineCard({ id, name, url, onClick }: Props) {
    return (
        <section
            onClick={onClick}
            className="flex items-center gap-5 px-5 py-2 rounded-md cursor-pointer hover:bg-gray-100"
        >
            <Avatar size="small" online url={url} />
            <p className="font-medium">{name}</p>
        </section>
    );
}
