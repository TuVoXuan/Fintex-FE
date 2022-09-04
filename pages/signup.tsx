import type { NextPage } from 'next';
import { AiOutlineGoogle, AiFillApple, AiOutlineCalendar } from 'react-icons/ai';
import { FiLock, FiAtSign } from 'react-icons/fi';
import { HiOutlineEye } from 'react-icons/hi';
import { RiUserSmileLine } from 'react-icons/ri';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { AuthLayout } from '../layouts';

const Signup: NextPage = () => {
    const [birthday, setBirthday] = useState<Date>(new Date());

    return (
        <AuthLayout title="Bắt đầu thôi!!!" subTitle="Tạo tài khoản để kết nối với mọi người.">
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
            <div className="space-y-5">
                <div className="border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30 ">
                    <FiAtSign size={24} className="font-normal" />
                    <input type="email" placeholder="abc@gmail.com" className="w-full py-[10px] focus:outline-none" />
                </div>
                <div className="border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30 ">
                    <RiUserSmileLine size={24} className="font-normal" />
                    <input type="text" placeholder="Peter Packer" className="w-full py-[10px] focus:outline-none" />
                </div>
                <div className="border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                    <FiLock size={24} />
                    <input
                        type="password"
                        placeholder="Create password"
                        className="w-full py-[10px] focus:outline-none"
                    />
                    <HiOutlineEye size={24} />
                </div>
                <div className="flex gap-2">
                    <div className="w-full border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                        <AiOutlineCalendar size={24} />
                        <DatePicker
                            className="w-full py-[10px] focus:outline-none"
                            selected={birthday}
                            onChange={(date: Date) => setBirthday(date)}
                        />
                    </div>
                    <div className="w-full border flex items-center justify-between bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                        <BsGenderAmbiguous size={24} />
                        <input type="radio" name="gender" id="gender" />
                        <label htmlFor="gender">Male</label>
                        <input type="radio" name="gender" id="gender" />
                        <label htmlFor="gender">Female</label>
                    </div>
                </div>
            </div>
            <button className="w-full btn btn-primary ripple-bg-primary-80">Sign Up</button>
            <div className="flex items-center justify-center gap-2">
                <p>Already have an account?</p>
                <button className="font-bold text-primary-80 ">Sign In</button>
            </div>
        </AuthLayout>
    );
};

export default Signup;
