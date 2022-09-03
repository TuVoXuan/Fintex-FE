import type { NextPage } from 'next';
import { AiOutlineGoogle, AiFillApple } from 'react-icons/ai';
import { FiLock, FiAtSign } from 'react-icons/fi';
import { HiOutlineEye } from 'react-icons/hi';

const Home: NextPage = () => {
    return (
        <section className="flex items-center justify-center h-screen">
            <div className="space-y-8">
                <div className="text-center">
                    <h1>Sign in</h1>
                    <p>Welcome back, you've have been missed!</p>
                </div>
                <div className="p-10 bg-white shadow-light rounded-[20px] space-y-9">
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
                            <input
                                type="email"
                                placeholder="abc@gmail.com"
                                className="w-full py-[10px] focus:outline-none"
                            />
                        </div>
                        <div className="border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                            <FiLock size={24} />
                            <input
                                type="password"
                                placeholder="•••••••"
                                className="w-full py-[10px] focus:outline-none"
                            />
                            <HiOutlineEye size={24} />
                        </div>
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

                    <button className="w-full btn btn-primary ripple-bg-primary-80">Sign In</button>

                    <div className="flex items-center justify-center gap-2">
                        <p>You haven't any account?</p>
                        <button className="font-bold text-primary-80 ">Sign Up</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
