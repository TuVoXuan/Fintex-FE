interface Props {
    children: React.ReactNode;
}

export const BoxShadow = ({ children }: Props) => {
    return <div className="p-10 bg-white shadow-light rounded-[20px] space-y-9">{children}</div>;
};
