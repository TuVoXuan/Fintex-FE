import { NextPage } from 'next';
import { FiSmartphone } from 'react-icons/fi';
import { FormOneField } from '../components';
import { AuthLayout } from '../layouts';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { sendOtp } from '../util/handle-otp';
import { addPhone } from '../redux/reducers/user-slice';
import { checkUserWithPhone } from '../redux/actions/user-action';
import { toastError } from '../util/toast';
import { NextPageWithProtect } from '../types/pages/auth';

const SendOtp: NextPageWithProtect = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isSignUp = useAppSelector((state) => state.otp.isSignUp);

    const handleSubmit = async (value: any) => {
        try {
            dispatch(addPhone(value.phone));
            const response = (await dispatch(checkUserWithPhone({ phone: value.phone })).unwrap()).isExisted;

            if (isSignUp && response) {
                toastError('Số điện thoại này đã được đăng ký.');
            } else if (!isSignUp && !response) {
                toastError('Số điện thoại không tồn tại.');
            } else {
                sendOtp(value.phone, dispatch, router);
            }
        } catch (error) {}
    };
    return (
        <AuthLayout title="Gửi mã OTP" subTitle="Nhập số điện thoại của bạn tại đây.">
            <FormOneField
                nameInput="phone"
                icon={<FiSmartphone size={24} />}
                onSubmit={handleSubmit}
                placeholder="0987654321"
                options={{
                    required: { value: true, message: 'Vui lòng nhập số điện thoại' },
                    pattern: {
                        value: /(03|05|07|08|09|01[2689])+([0-9]{8})\b/,
                        message: 'Số điện thoại không đúng định dạng',
                    },
                }}
            />
            <div id="recaptcha-container"></div>
        </AuthLayout>
    );
};

export default SendOtp;
