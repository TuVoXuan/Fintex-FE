export default function LoadingFriendReqCard() {
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
