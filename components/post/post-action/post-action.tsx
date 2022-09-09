interface Props {
    icon: JSX.Element;
    name: string;
}

export const PostAction = ({ icon, name }: Props) => {
    return (
        <div className="flex gap-3 items-center">
            {icon}
            <p>{name}</p>
        </div>
    );
};
