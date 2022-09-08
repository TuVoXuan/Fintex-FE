import Image from 'next/image';

interface Props {
    size: 'tiny' | 'small' | 'medium';
    url: string;
}

export default function Avatar({ size, url }: Props) {
    const handleSize = () => {
        switch (size) {
            case 'tiny':
                return 'w-5 h-5';
            case 'small':
                return 'w-10 h-10';
            case 'medium':
                return 'w-12 h-12';
            default:
                return 'w-12 h-12';
        }
    };

    return (
        <section>
            <div className={`object-none ${handleSize()} overflow-hidden rounded-full image-container`}>
                <Image src={url} alt="avatar" layout="fill" objectFit="cover" />
            </div>
        </section>
    );
}
