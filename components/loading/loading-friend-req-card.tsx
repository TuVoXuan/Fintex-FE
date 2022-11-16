interface Props {
    type: 'send' | 'receive';
}

export default function LoadingFriendReqCard({ type }: Props) {
    if (type === 'send') {
        return (
            <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-light">
                <div className="flex items-center gap-x-3">
                    <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse"></div>
                    <div className="rounded-lg w-36 h-7 bg-slate-200 animate-pulse"></div>
                </div>
                <div className="w-24 h-10 rounded-lg bg-slate-200 animate-pulse"></div>
            </div>
        );
    }
    return (
        <div className="w-full h-full overflow-hidden rounded-lg drop-shadow-md">
            <div className="w-full aspect-square bg-slate-200 animate-pulse"></div>
            <div className="p-4 space-y-2 bg-white">
                <div className="w-1/2 h-5 rounded-lg bg-slate-200 animate-pulse"></div>
                <div className="w-full h-10 rounded-lg bg-slate-200 animate-pulse"></div>
                <div className="w-full h-10 rounded-lg bg-slate-200 animate-pulse"></div>
            </div>
        </div>
    );
}
