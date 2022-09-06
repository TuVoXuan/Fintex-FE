import { NextPage } from 'next';
import { FormOneField } from '../components';
import { AuthLayout } from '../layouts';
import { MdOutlinePassword } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { useRouter } from 'next/router';
import { toastError } from '../util/toast';
import { resetVerifyOtp } from '../redux/reducers/otp-slice';

const VerifyOtp: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const verify = useAppSelector((state) => state.otp.verify);
    const redirectUrl = useAppSelector((state) => state.otp.redirectUrl);

    const handleSubmit = (value: any) => {
        if (verify) {
            verify
                .confirm(value.otp)
                .then((result) => {
                    dispatch(resetVerifyOtp());
                    console.log('result: ', result);
                    router.push(redirectUrl ?? '');
                })
                .catch((err) => {
                    toastError('Mã OTP không chính xác');
                });
        }
    };
    return (
        <AuthLayout title="Xác minh OTP" subTitle="Nhập otp bạn nhận được tại đây.">
            <FormOneField
                nameInput="otp"
                icon={<MdOutlinePassword size={24} />}
                onSubmit={handleSubmit}
                placeholder="123456"
                options={{
                    required: { value: true, message: 'Vui lòng nhập số điện thoại' },
                    pattern: {
                        value: /(^|[^0-9])[0-9]{2}\s*-?\s*[0-9]{2}\s*-?\s*[0-9]{2}([^0-9]|$)/,
                        message: 'Mã OTP gồm 6 chữ số',
                    },
                }}
            />
        </AuthLayout>
    );
};

export default VerifyOtp;
