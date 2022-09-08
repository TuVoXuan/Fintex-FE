interface Props {
    icon?: JSX.Element;
    title: string;
    color: 'primary' | 'secondary' | 'secondary-light';
    typeBtn?: 'button' | 'submit';
    form?: string;
    onClick?: () => void;
}

export const Button = ({ icon, title, color, typeBtn = 'button', form, onClick }: Props) => {
    const colorButton = () => {
        switch (color) {
            case 'primary':
                return 'btn-primary ripple-bg-primary-80';
            case 'secondary-light':
                return 'bg-secondary-20 ripple-bg-secondary-20 text-secondary-80';
            default:
                return 'btn-primary ripple-bg-primary-80';
        }
    };

    return (
        <button
            className={`btn ${colorButton()} ${icon ? 'justify-between' : 'w-full'}`}
            type={typeBtn}
            form={form}
            onClick={onClick}
        >
            {icon && icon}
            {title}
        </button>
    );
};
