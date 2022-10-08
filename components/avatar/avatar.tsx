import Image from 'next/image';

interface Props {
    size: 'nano' | 'tiny' | 'small' | 'medium' | 'large';
    url: string;
    className?: string;
}

export default function Avatar({ size, url, className }: Props) {
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
            case 'large':
                return 'w-36 h-36';
            default:
                return 'w-12 h-12';
        }
    };

    return (
        <section>
            <div className={`${handleSize()} overflow-hidden rounded-full image-container ${className}`}>
                <Image src={url} alt="avatar" layout="fill" objectFit="cover" />
            </div>
        </section>
    );
}
