import { ThunkDispatch } from '@reduxjs/toolkit';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { NextRouter, useRouter } from 'next/router';
import { app } from '../config/firebase';
import { useAppDispatch } from '../hook/redux';
import { userLoginWithGoogle } from '../redux/actions/user-action';
import { addRedirectUrl } from '../redux/reducers/otp-slice';
import { addSimpleInfo } from '../redux/reducers/user-slice';
import { sendOtp } from './handle-otp';
import { toastError } from './toast';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export const handleLoginGoogle = (router: NextRouter, dispatch: any) => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.idToken;

            const user: IAuthUser = {
                name: result.user.displayName ?? '',
                avatar: result.user.photoURL ?? '',
                email: result.user.email ?? '',
                phone: '',
            };

            const dto: IVerifyUser = {
                idToken: token ?? '',
                user: user,
            };

            try {
                console.log('da vo');
                const result = (await dispatch(userLoginWithGoogle(dto)).unwrap()) as IVerifyUserResponse;

                if (result.isExisted) {
                    await dispatch(addSimpleInfo(user));
                    await dispatch(addRedirectUrl('/signup'));
                    router.push('/send-otp');
                } else {
                    await dispatch(addRedirectUrl('/'));
                    if (result.user) {
                        sendOtp(result.user.phone, dispatch, router);
                    }
                }
            } catch (error) {
                console.log(error);
                toastError("Can't not login with google");
            }
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
};
