import { useState } from 'react';
import Avatar from '../avatar/avatar';

interface Props {
    selected: boolean;
    name: string;
    avatar: string;
    onClick: () => void;
}

export default function FriendConvCard({ name, avatar, selected, onClick }: Props) {
    const [isSelected, setIsSelected] = useState<boolean>(selected);

    const handleClick = () => {
        setIsSelected(!selected);
        onClick();
    };

    return (
        <section onClick={handleClick} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center p-3 gap-x-3">
                <Avatar url={avatar} size="medium" />
                <p className="prevent-select">{name}</p>
            </div>

            <aside className="p-1 border-2 border-blue-400 rounded-full">
                {isSelected ? (
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
            </aside>
        </section>
    );
}
