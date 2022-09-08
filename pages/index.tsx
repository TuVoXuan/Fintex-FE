import type { NextPage } from 'next';
import { MainLayout } from '../layouts/main-layout';

const Home: NextPage = () => {
    return (
        <MainLayout>
            <h1>This is home page</h1>
        </MainLayout>
    );
};

export default Home;
