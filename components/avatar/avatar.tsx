import Image from 'next/image';

interface Props {
    size: 'nano' | 'tiny' | 'small' | 'medium' | 'semi-large' | 'large' | 'huge';
    url: string;
    className?: string;
    online?: boolean;
}

export default function Avatar({ size, url, className, online }: Props) {
    const handleSize = () => {
        switch (size) {
            case 'nano':
                return 'w-6 h-6';
            case 'tiny':
                return 'w-8 h-8';
            case 'small':
                return 'w-10 h-10';
            case 'medium':
                return 'w-12 h-12';
            case 'semi-large':
                return 'w-16 h-16';
            case 'large':
                return 'w-36 h-36';
            case 'huge':
                return 'w-[400px] h-[400px]';
            default:
                return 'w-12 h-12';
        }
    };

    return (
        <section className="relative">
            <div className={`${handleSize()} overflow-hidden rounded-full image-container ${className}`}>
                <Image src={url} alt="avatar" layout="fill" objectFit="cover" />
            </div>
            {online && (
                <p className="absolute bottom-0 right-0 w-2 h-2 bg-green-600 rounded-full ring-2 ring-white"></p>
            )}
        </section>
    );
}
