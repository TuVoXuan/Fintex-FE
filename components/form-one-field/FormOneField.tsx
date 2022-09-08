import { useForm, RegisterOptions } from 'react-hook-form';
import { Button, Input } from '..';

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
        <form id="phoneOtp" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
                icon={icon}
                placeholder={placeholder}
                type={'text'}
                register={register}
                name={nameInput}
                options={options}
                errors={errors[nameInput]?.message}
            />
            <Button title="Xong" color="primary" form="phoneOtp" typeBtn="submit" />
        </form>
    );
};
