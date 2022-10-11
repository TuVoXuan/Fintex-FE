interface Props {
    feeling: IFeeling;
    onClick: () => void;
}

export default function FeelingBtn({ feeling: felling, onClick }: Props) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 p-2 hover:bg-secondary-30/70 rounded-xl">
            <div className="p-1 text-2xl rounded-full bg-secondary-20">{felling.emoji}</div>
            <p>{felling.name}</p>
        </button>
    );
}
