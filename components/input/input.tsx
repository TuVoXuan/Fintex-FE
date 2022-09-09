import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { TiWarning } from 'react-icons/ti';

interface Props {
    icon?: JSX.Element | Array<JSX.Element>;
    iconEnds?: JSX.Element | Array<JSX.Element>;
    placeholder: string;
    defaultValue?: string | number | undefined;
    type: 'text' | 'number' | 'password' | 'email';
    register: UseFormRegister<any>;
    options?: RegisterOptions;
    errors?: string;
    name: string;
    border?: boolean;
    background?: boolean;
}

export const Input = ({
    icon,
    placeholder,
    defaultValue,
    type,
    name,
    register,
    options,
    errors,
    iconEnds,
    border,
    background,
}: Props) => {
    return (
        <>
            <div
                className={`${border ? 'border' : ''} flex h-full items-center ${
                    background ? 'bg-secondary-10' : 'bg-white'
                }  px-[10px] gap-3 rounded-lg focus-within:border-secondary-30 `}
            >
                {icon}
                <input
                    {...register(name, { ...options })}
                    type={type}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    className={`w-full items-center focus:outline-none py-4 bg-transparent ${
                        type === 'password' && 'font-extrabold tracking-widest'
                    }`}
                />
                {iconEnds && <div className="flex items-center gap-3">{iconEnds}</div>}
            </div>
            {errors && (
                <div className="flex items-center gap-1">
                    <TiWarning size={14} fill="#ef4444" />
                    <p className="text-red-500">{errors}</p>
                </div>
            )}
        </>
    );
};
