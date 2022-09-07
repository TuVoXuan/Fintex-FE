import type { NextPage } from 'next';
import { NextPageWithProtect } from '../types/pages/auth';

const Home: NextPageWithProtect = () => {
    return <h1>This is home page</h1>;
};

Home.protected = true;

export default Home;
