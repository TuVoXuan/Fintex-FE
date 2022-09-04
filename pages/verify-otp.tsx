import { NextPage } from 'next';
import { FormOneField } from '../components';
import { AuthLayout } from '../layouts';
import { MdOutlinePassword } from 'react-icons/md';

const VerifyOtp: NextPage = () => {
    const handleSubmit = (value: any) => {
        console.log('fomr value : ', value);
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
                        value: /[0-9]{6}/,
                        message: 'Mã OTP gồm 6 chữ số',
                    },
                }}
            />
        </AuthLayout>
    );
};

export default VerifyOtp;
