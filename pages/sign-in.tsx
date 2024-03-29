import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { AiOutlineGoogle, AiFillApple } from 'react-icons/ai';
import { FiLock, FiSmartphone } from 'react-icons/fi';
import { Button, Input } from '../components';
import { AuthLayout } from '../layouts';
import { useRouter } from 'next/router';
import { handleLoginGoogle } from '../util/google-login';
import { useAppDispatch } from '../hook/redux';
import APP_PATH from '../constants/app-path';
import { addRedirectUrl, setIsSignUp } from '../redux/reducers/otp-slice';
import { toastError } from '../util/toast';
import { userLoginPhone } from '../redux/actions/user-action';

interface Props {
    phone: string;
    password: string;
}

const SignIn: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<Props>();

    const onSubmit = async (data: any) => {
        try {
            await dispatch(userLoginPhone(data)).unwrap();
            router.push(APP_PATH.HOME);
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleSendOtp = () => {
        dispatch(setIsSignUp(true));
        dispatch(addRedirectUrl(APP_PATH.SIGN_UP));
        router.push(APP_PATH.SEND_OTP);
    };

    const handleGoogle = () => {
        handleLoginGoogle(router, dispatch);
    };

    return (
        <AuthLayout title={'Đăng nhập'} subTitle={'💕Chào mừng trở lại, chúng tôi nhớ bạn💕'}>
            <div className="flex justify-center gap-5">
                <Button
                    icon={<AiOutlineGoogle size={24} />}
                    title="Đăng nhập bằng Google"
                    color="secondary-light"
                    onClick={handleGoogle}
                />
                <Button icon={<AiFillApple size={24} />} title="Đăng nhập bằng Apple" color="secondary-light" />
            </div>
            <div className="flex items-center gap-4">
                <div className="w-full h-0 border-t-2" />
                <h3>HOẶC</h3>
                <div className="w-full h-0 border-t-2" />
            </div>
            <form id="login" onSubmit={handleSubmit(onSubmit)} className="space-y-9">
                <div className="space-y-5">
                    <Input
                        icon={<FiSmartphone size={24} />}
                        placeholder={'0987654321'}
                        type={'text'}
                        border={true}
                        name={'phone'}
                        register={register}
                        options={{
                            required: { value: true, message: 'Vui lòng nhập số điện thoại' },
                            pattern: {
                                value: /(03|05|07|08|09|01[2689])+([0-9]{8})\b/,
                                message: 'Số điện thoại không đúng định dạng',
                            },
                        }}
                        errors={errors.phone?.message}
                    />
                    <Input
                        icon={<FiLock size={24} />}
                        placeholder={'•••••••'}
                        type={'password'}
                        border={true}
                        name={'password'}
                        register={register}
                        options={{
                            required: { value: true, message: 'Vui lòng nhập password' },
                            maxLength: { value: 20, message: 'Mật khẩu chứa không quá 20 kí tự' },
                            pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                message: 'Mật khẩu phải chứa ít nhất 8 kí tự gồm chữ cái, số và kí tự đặc biệt',
                            },
                        }}
                        errors={errors.password?.message}
                    />
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="remember-me" />
                        <label htmlFor="remember-me">Nhớ tôi</label>
                    </div>
                    <div>
                        <button>Quên mật khẩu?</button>
                    </div>
                </div>

                <Button title="Đăng nhập" color="primary" form="login" typeBtn="submit" />
            </form>

            <div className="flex items-center justify-center gap-2">
                <p>Bạn chưa có tài khoản?</p>
                <button className="font-bold text-primary-80" onClick={handleSendOtp}>
                    Đăng ký
                </button>
            </div>
        </AuthLayout>
    );
};

export default SignIn;
