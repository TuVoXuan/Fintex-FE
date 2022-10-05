import { useRouter } from 'next/router';

interface Props {
    icon: JSX.Element;
    title: string;
    isActive: boolean;
    link: string;
    onClick?: () => void;
}

export const MenuItem = ({ icon, title, isActive, link, onClick }: Props) => {
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
            className={`flex items-center gap-5 px-5 py-4 rounded-xl ${bgGround} cursor-pointer `}
        >
            <div className={textColor}>{icon}</div>
            <p className={`font-medium ${textColor}`}>{title}</p>
        </div>
    );
};
