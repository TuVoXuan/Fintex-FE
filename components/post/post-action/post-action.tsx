interface Props {
    icon: JSX.Element;
    name: string;
}

export const PostAction = ({ icon, name }: Props) => {
    return (
        <button className="flex items-center gap-3">
            {icon}
            <p>{name}</p>
        </button>
    );
};
