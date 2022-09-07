import { ThunkDispatch } from '@reduxjs/toolkit';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { NextRouter, useRouter } from 'next/router';
import { app } from '../config/firebase';
import APP_PATH from '../constants/app-path';
import { useAppDispatch } from '../hook/redux';
import { userLoginWithGoogle } from '../redux/actions/user-action';
import { addRedirectUrl } from '../redux/reducers/otp-slice';
import { addPhone, addSimpleInfo } from '../redux/reducers/user-slice';
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
                console.log('result: ', result);

                if (!result.isExisted) {
                    await dispatch(addSimpleInfo(user));
                    await dispatch(addRedirectUrl(APP_PATH.SIGN_UP));
                    router.push(APP_PATH.SEND_OTP);
                } else {
                    await dispatch(addRedirectUrl('/'));
                    if (result.phone) {
                        await dispatch(addPhone(result.phone));
                        sendOtp(result.phone, dispatch, router);
                        router.push(APP_PATH.VERIFY_OTP);
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
