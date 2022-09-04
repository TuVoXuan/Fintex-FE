import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { AiOutlineGoogle, AiFillApple } from 'react-icons/ai';
import { FiLock, FiSmartphone } from 'react-icons/fi';
import { HiOutlineEye } from 'react-icons/hi';
import Image from 'next/image';
import { BoxShadow, Input } from '../components';

interface Props {
    phone: string;
    password: string;
}

const Home: NextPage = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<Props>();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <section className="px-4 pt-4 pb-10 space-y-6">
            <div className="flex justify-start">
                <div className="w-[200px] h-12">
                    <div className="h-full image-container">
                        <Image src="/logo-and-brand-name.svg" layout="fill" alt="logo" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center h-full">
                <div className="space-y-8">
                    <div className="text-center">
                        <h1>Sign in</h1>
                        <p>Welcome back, you've have been missed!</p>
                    </div>
                    <BoxShadow>
                        <div className="flex gap-5">
                            <button className="btn bg-secondary-20 text-secondary-80 ripple-bg-secondary-20">
                                <AiOutlineGoogle size={24} />
                                Log in with Google
                            </button>
                            <button className="btn bg-secondary-20 text-secondary-80 ripple-bg-secondary-20">
                                <AiFillApple size={24} />
                                Log in with Apple
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full h-0 border-t-2" />
                            <h3>OR</h3>
                            <div className="w-full h-0 border-t-2" />
                        </div>
                        <form id="login" onSubmit={handleSubmit(onSubmit)} className="space-y-9">
                            <div className="space-y-5">
                                <Input
                                    icon={<FiSmartphone size={24} />}
                                    placeholder={'0987654321'}
                                    type={'text'}
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
                                    name={'password'}
                                    register={register}
                                    options={{
                                        required: { value: true, message: 'Vui lòng nhập password' },
                                        maxLength: { value: 20, message: 'Mật khẩu chứa không quá 20 kí tự' },
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                            message:
                                                'Mật khẩu phải chứa ít nhất 8 kí tự gồm chữ cái, số và kí tự đặc biệt',
                                        },
                                    }}
                                    errors={errors.password?.message}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="remember-me" />
                                    <label htmlFor="remember-me">Remember me</label>
                                </div>
                                <div>
                                    <button>Forgot Password?</button>
                                </div>
                            </div>

                            <button form="login" type="submit" className="w-full btn btn-primary ripple-bg-primary-80">
                                Sign In
                            </button>
                        </form>

                        <div className="flex items-center justify-center gap-2">
                            <p>You haven't any account?</p>
                            <button className="font-bold text-primary-80 ">Sign Up</button>
                        </div>
                    </BoxShadow>
                </div>
            </div>
        </section>
    );
};

export default Home;
