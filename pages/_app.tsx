import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { userGetCurrentUser } from '../redux/actions/user-action';
import { toastError } from '../util/toast';
import { useRouter } from 'next/router';
import { CgSpinnerTwo } from 'react-icons/cg';
import { MainLayoutProvider } from '../context/main-layout-contex';

function Loading() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url: string) => url !== router.asPath && setLoading(true);
        const handleComplete = (url: string) => url === router.asPath && setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    });

    return loading ? (
        <section className="z-[999] flex items-center justify-center w-full h-screen">
            <CgSpinnerTwo className="animate-spin" size={50} />
        </section>
    ) : (
        <></>
    );
}

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        async function getCurrentUser() {
            console.log('vo khong');
            if (getCookie('Authorization') && !store.getState().user.isLogin) {
                try {
                    await store.dispatch(userGetCurrentUser()).unwrap();
                } catch (error) {
                    console.log('error: ', error);
                    toastError((error as IResponseError).error);
                }
            }
        }

        getCurrentUser();
    }, []);

    return (
        <>
            <Loading />
            <Provider store={store}>
                <MainLayoutProvider>
                    <Component {...pageProps} />
                </MainLayoutProvider>
                <Toaster
                    toastOptions={{
                        className: 'z-[500]',
                    }}
                />
            </Provider>
        </>
    );
}

export default MyApp;
