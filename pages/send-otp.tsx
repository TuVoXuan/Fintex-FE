import { NextPage } from 'next';
import { FiSmartphone } from 'react-icons/fi';
import { BoxShadow, FormOneField } from '../components';
import { AuthLayout } from '../layouts';

const SendOtp: NextPage = () => {
    const handleSubmit = (value: any) => {
        console.log('fomr value : ', value);
    };
    return (
        <AuthLayout title="Gửi mã OTP" subTitle="Nhập số điện thoại muốn nhận mã otp.">
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
        </AuthLayout>
    );
};

export default SendOtp;
