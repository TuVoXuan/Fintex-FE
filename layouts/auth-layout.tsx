import Image from 'next/image';
import { BoxShadow } from '../components';

interface Props {
    title: string;
    subTitle: string;
    children: React.ReactNode;
}

export const AuthLayout = ({ title, subTitle, children }: Props) => {
    return (
        <section className="px-4 pt-4 pb-10 space-y-6">
            <div className="flex justify-start">
                <div className="w-[200px] h-12">
                    <div className="h-full image-container">
                        <Image
                            src="/logo-and-brand-name.svg"
                            layout="fill"
                            alt="logo"
                            placeholder="blur"
                            blurDataURL="/images/avatar.jpg"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center h-full">
                <div className="min-w-[50%] space-y-8">
                    <div className="text-center">
                        <h1>{title}</h1>
                        <p>{subTitle}</p>
                    </div>
                    <BoxShadow>{children}</BoxShadow>
                </div>
            </div>
            <div id="recaptcha-container"></div>
        </section>
    );
};
