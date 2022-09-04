import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface Props {
    icon: JSX.Element;
    placeholder: string;
    defaultValue?: string | number | undefined;
    type: 'text' | 'number' | 'password' | 'email';
    register: UseFormRegister<any>;
    options?: RegisterOptions;
    errors?: string;
    name: string;
}

export const Input = ({ icon, placeholder, defaultValue, type, name, register, options, errors }: Props) => {
    return (
        <>
            <div className="border flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30 ">
                {icon}
                <input
                    {...register(name, { ...options })}
                    type={type}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    className={`w-full py-[10px] focus:outline-none ${
                        type === 'password' && 'font-extrabold tracking-widest'
                    }`}
                />
            </div>
            {errors && <p className="text-red-500">{errors}</p>}
        </>
    );
};
