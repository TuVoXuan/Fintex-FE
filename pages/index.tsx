import type { NextPage } from 'next';
import Image from 'next/image';

const Home: NextPage = () => {
    return (
        <section className="p-[30px] rounded-[15px] bg-secondary-10">
            <div className="rounded-[15px] p-[18px] bg-white shadow-light">
                <div>
                    <div className="image-container">
                        <Image src="/images/avatar1.jpg" alt="avatar" layout="fill" />
                    </div>
                    <input
                        type="text"
                        className="rounded-[10px] bg-secondary-10 text-secondary-40 px-[10px] py-[15px]"
                        placeholder="what's happening?"
                    />
                </div>
            </div>
        </section>
    );
};

export default Home;
