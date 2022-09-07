import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { userGetCurrentUser } from '../redux/actions/user-action';
import { toastError } from '../util/toast';

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
        <Provider store={store}>
            <Component {...pageProps} />
            <Toaster
                toastOptions={{
                    className: 'z-[500]',
                }}
            />
        </Provider>
    );
}

export default MyApp;
