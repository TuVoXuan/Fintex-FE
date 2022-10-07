interface Props {
    icon: JSX.Element;
    name: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    mineReaction?: string;
    onClick?: () => void;
}

export const PostAction = ({ icon, name, onMouseEnter, onMouseLeave, mineReaction, onClick }: Props) => {
    const handleTextColor = () => {
        switch (mineReaction) {
            case 'like':
                return 'text-blue-500';
            case 'angry':
                return 'text-orange-500';
            case 'love':
                return 'text-pink-500';
            case 'haha':
            case 'wow':
            case 'sad':
                return 'text-yellow-500';
            default:
                return '';
        }
    };

    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex items-center gap-3"
        >
            {icon}
            <p className={`${handleTextColor()} font-semibold text-secondary-40 capitalize`}>{name}</p>
        </button>
    );
};
