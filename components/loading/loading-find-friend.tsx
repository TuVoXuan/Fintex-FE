export default function LoadingFindFriend() {
    return (
        <div className="flex items-center justify-between px-4 py-4 bg-white rounded-lg shadow-light">
            <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="space-y-3">
                    <div className="h-5 rounded-lg w-52 bg-slate-200 animate-pulse"></div>
                    <div className="h-5 rounded-lg w-36 bg-slate-200 animate-pulse"></div>
                </div>
            </div>
            <div className="w-32 h-10 rounded-lg bg-slate-200 animate-pulse"></div>
        </div>
    );
}
