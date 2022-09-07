import { ConfirmationResult, getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { parsePhoneNumber } from 'libphonenumber-js';
import { NextRouter } from 'next/router';
import { app } from '../config/firebase';
import { addVerifyOtp } from '../redux/reducers/otp-slice';

const auth = getAuth(app);

export const sendOtp = (phone: string, dispatch: any, router: NextRouter) => {
    const phoneNumber = parsePhoneNumber(phone, 'VN');

    if (phoneNumber) {
        let verify = new RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible',
            },
            auth,
        );

        signInWithPhoneNumber(auth, phoneNumber.number, verify)
            .then(async (result: ConfirmationResult) => {
                await dispatch(addVerifyOtp(result));
                router.push('/verify-otp');
            })
            .catch((err) => {
                alert(err);
            });
    }
};
