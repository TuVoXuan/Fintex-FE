import type { NextPage } from 'next';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiLock, FiAtSign } from 'react-icons/fi';
import { RiUserSmileLine } from 'react-icons/ri';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Input } from '../components';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../layouts';
import { TiWarning } from 'react-icons/ti';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { selectUser } from '../redux/reducers/user-slice';
import { toastError } from '../util/toast';
import { userSignUp } from '../redux/actions/user-action';
import APP_PATH from '../constants/app-path';
import { handleFullName } from '../util/handle-name';

interface BaseInfo {
    name: string;
    birthday: Date;
    gender: 'male' | 'female' | 'other';
    email: string;
    password: string;
}

const Signup: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUser);
    const [birthday, setBirthday] = useState<Date>(new Date());

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<BaseInfo>({
        defaultValues: {
            name: user.data ? user.data?.name.firstName + user.data.name.lastName : undefined,
            email: user.data?.email || undefined,
            birthday: new Date(),
            gender: 'male',
        },
    });

    const onSubmit = async (data: BaseInfo) => {
        console.log(data);
        console.log('phone: ', user.data?.phone);

        const { birthday, email, gender, name, password } = data;
        const phone = user.data?.phone || '';
        const newName = handleFullName(name);
        console.log('newName: ', newName);
        const convertBirthday = birthday.toISOString();
        console.log('convertBirthday: ', convertBirthday);

        try {
            await dispatch(
                userSignUp({ birthday: convertBirthday, password, phone, email, name: newName, gender }),
            ).unwrap();
            router.push(APP_PATH.HOME);
        } catch (error) {
            toastError((error as IResponseError).error);
        }
    };

    const handleSignin = () => {
        router.push('/');
    };

    return (
        <AuthLayout title="🎉Hãy bắt đầu🎉" subTitle="✨Tạo một tài khoản để kết nối với mọi người.✨">
            <form className="space-y-5" id="base-info" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    icon={<FiAtSign size={24} className="font-normal" />}
                    type="email"
                    placeholder="abc@gmail.com"
                    name="email"
                    border={true}
                    register={register}
                    options={{
                        required: {
                            value: true,
                            message: 'Vui lòng nhập email.',
                        },
                    }}
                    errors={errors.email?.message}
                />

                <Input
                    icon={<RiUserSmileLine size={24} className="font-normal" />}
                    type="text"
                    placeholder="Nguyễn Văn An"
                    name="name"
                    border={true}
                    register={register}
                    options={{
                        required: {
                            value: true,
                            message: 'Vui lòng nhập họ và tên của bạn.',
                        },
                        maxLength: {
                            value: 30,
                            message: 'Họ và tên chứa tối đa 30 kí tự.',
                        },
                    }}
                    errors={errors.name?.message}
                />

                <Input
                    icon={<FiLock size={24} />}
                    placeholder={'•••••••'}
                    type={'password'}
                    name={'password'}
                    register={register}
                    border={true}
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

                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                        <AiOutlineCalendar size={24} />
                        <DatePicker
                            {...register('birthday', {
                                required: { value: true, message: 'Vui lòng chọn ngày sinh.' },
                            })}
                            dateFormat="dd/MM/yyyy"
                            className="w-full py-4 focus:outline-none"
                            selected={birthday}
                            onChange={(date: Date) => {
                                setValue('birthday', date), setBirthday(date);
                            }}
                        />
                    </div>
                    <div className="w-full border flex items-center justify-between bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                        <BsGenderAmbiguous size={24} />
                        <input
                            {...register('gender', {
                                required: { value: true, message: 'Vui lòng chọn giới tính' },
                            })}
                            type="radio"
                            name="gender"
                            value="male"
                        />
                        <label htmlFor="gender">Nam</label>
                        <input
                            {...register('gender', {
                                required: { value: true, message: 'Vui lòng chọn giới tính' },
                            })}
                            type="radio"
                            name="gender"
                            value="female"
                        />
                        <label htmlFor="gender">Nữ</label>
                        <input
                            {...register('gender', {
                                required: { value: true, message: 'Vui lòng chọn giới tính' },
                            })}
                            type="radio"
                            name="gender"
                            value="other"
                        />
                        <label htmlFor="gender">Khác</label>
                    </div>

                    {errors.birthday?.message && (
                        <div className="flex items-center gap-1">
                            <TiWarning size={14} fill="#ef4444" />
                            <p className="text-red-500">{errors.birthday?.message}</p>
                        </div>
                    )}
                    {errors.gender?.message && (
                        <div className="flex items-center col-start-2 gap-1">
                            <TiWarning size={14} fill="#ef4444" />
                            <p className="text-red-500">{errors.gender?.message}</p>
                        </div>
                    )}
                </div>
            </form>
            <Button title="Đăng ký" color="primary" form="base-info" typeBtn="submit" />
            <div className="flex items-center justify-center gap-2">
                <p>Bạn đã có tài khoản?</p>
                <button className="font-bold text-primary-80 " onClick={handleSignin}>
                    Đăng nhập
                </button>
            </div>
        </AuthLayout>
    );
};

export default Signup;
