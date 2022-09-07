import { NextPage } from 'next';
import { FiSmartphone } from 'react-icons/fi';
import { FormOneField } from '../components';
import { AuthLayout } from '../layouts';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../hook/redux';
import { sendOtp } from '../util/handle-otp';
import { addPhone } from '../redux/reducers/user-slice';
import { NextPageWithProtect } from '../types/pages/auth';

const SendOtp: NextPageWithProtect = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = (value: any) => {
        dispatch(addPhone(value.phone));
        sendOtp(value.phone, dispatch, router);
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
