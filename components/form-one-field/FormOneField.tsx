import { on } from 'events';
import { ValidationRule, Validate, UseFormRegister, useForm, RegisterOptions } from 'react-hook-form';
import { BoxShadow } from '../box-shadow/box-shadow';
import { Input } from '../input/input';

interface Props {
    nameInput: string;
    placeholder: string;
    icon: JSX.Element;
    onSubmit: (value: any) => void;
    options: RegisterOptions;
}

interface FormData {
    [name: string]: string;
}

export const FormOneField = ({ nameInput, placeholder, icon, options, onSubmit }: Props) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormData>();

    return (
        <form id="phoneOtp" onSubmit={handleSubmit(onSubmit)} className="space-y-9">
            <Input
                icon={icon}
                placeholder={placeholder}
                type={'text'}
                register={register}
                name={nameInput}
                options={options}
                errors={errors[nameInput]?.message}
            />
            <button form="phoneOtp" type="submit" className="w-full btn btn-primary ripple-bg-primary-80">
                Xong
            </button>
        </form>
    );
};
