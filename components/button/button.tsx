interface Props {
    icon?: JSX.Element;
    title: string;
    color: 'primary' | 'secondary' | 'secondary-light';
    typeBtn?: 'button' | 'submit';
    form?: string;
    className?: string;
    onClick?: () => void;
    disable?: boolean;
}

export const Button = ({
    icon,
    title,
    color,
    typeBtn = 'button',
    form,
    onClick,
    className,
    disable = false,
}: Props) => {
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
            className={`btn ${colorButton()} ${icon ? 'justify-between' : 'w-full'} ${className} ${
                disable ? 'cursor-not-allowed' : null
            }`}
            type={typeBtn}
            form={form}
            onClick={onClick}
            disabled={disable}
        >
            {icon && icon}
            {title}
        </button>
    );
};
