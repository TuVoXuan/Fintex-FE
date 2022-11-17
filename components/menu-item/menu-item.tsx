import { useRouter } from 'next/router';

interface Props {
    icon: JSX.Element;
    title: string;
    isActive: boolean;
    link: string;
    onClick?: () => void;
    notSeenNum?: number;
}

export const MenuItem = ({ icon, title, isActive, link, onClick, notSeenNum = 0 }: Props) => {
    const textColor = isActive ? 'text-white' : 'text-black';
    const bgGround = isActive ? 'bg-slate-500' : 'bg-white hover:bg-slate-300';

    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        router.push(link);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex relative items-center gap-5 px-5 py-4 rounded-xl ${bgGround} cursor-pointer `}
        >
            <div className={textColor}>{icon}</div>
            <p className={`font-medium ${textColor}`}>{title}</p>
            {notSeenNum > 0 ? (
                <div className="absolute flex items-center justify-center h-6 text-xs text-white bg-red-400 rounded-full aspect-square right-2">
                    <span>{notSeenNum}</span>
                </div>
            ) : null}
        </div>
    );
};
