import { useState } from 'react';
import Avatar from '../avatar/avatar';

interface Props {
    onClick: () => void;
}

export default function FriendConvCard() {
    const [selected, setSelected] = useState<boolean>(false);

    const handleClick = () => {
        setSelected(!selected);
    };

    return (
        <section onClick={handleClick} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center p-3 gap-x-3">
                <Avatar url="/images/avatar.jpg" size="medium" />
                <p className="prevent-select">Nguyen van a</p>
            </div>

            <aside className="p-1 border-2 border-blue-400 rounded-full">
                {selected ? (
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
            </aside>
        </section>
    );
}
