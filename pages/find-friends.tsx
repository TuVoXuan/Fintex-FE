import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button } from '../components';
import Avatar from '../components/avatar/avatar';
import StrangerCard from '../components/stranger/stranger-card';
import { useMainLayout } from '../context/main-layout-contex';
import { useAppDispatch } from '../hook/redux';
import { MainLayout } from '../layouts/main-layout';
import { userGetStranger } from '../redux/actions/user-action';

const FindFrends: NextPage = () => {
    const dispatch = useAppDispatch();
    const { name } = useMainLayout();

    const [strangers, setStrangers] = useState<Stranger[]>([]);
    const [after, setAfter] = useState('');

    useEffect(() => {
        if (name) {
            dispatch(
                userGetStranger({
                    name: name,
                    limit: 10,
                    after: '',
                }),
            )
                .unwrap()
                .then((data) => {
                    setStrangers(data.data);
                    setAfter(data.after);
                })
                .catch((error) => console.log('error', error));
        }
    }, [name]);

    return (
        <MainLayout>
            <section className="relative h-full overflow-y-auto bg-secondary-10">
                <InfiniteScroll
                    next={function () {
                        throw new Error('Function not implemented.');
                    }}
                    hasMore={false}
                    loader={undefined}
                    dataLength={0}
                    className="px-56 py-5 space-y-3"
                >
                    {strangers.map((item) => (
                        <StrangerCard
                            key={item._id}
                            avatar={item.avatar}
                            fullName={item.fullName}
                            isFriend={item.isFriend}
                            address={item.address}
                        />
                    ))}
                </InfiniteScroll>
            </section>
        </MainLayout>
    );
};

export default FindFrends;
