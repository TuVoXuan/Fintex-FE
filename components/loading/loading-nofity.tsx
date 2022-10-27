export default function LoadingNotify() {
    return (
        <div className="flex overflow-hidden bg-white rounded-2xl shadow-light">
            <div className="flex items-center px-5 bg-slate-200 animate-pulse"></div>
            <div className="flex items-center p-3 gap-x-3">
                <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="space-y-3 ">
                    <div className="w-56 h-4 rounded-lg bg-slate-200 animate-pulse"></div>
                    <div className="w-24 h-4 rounded-lg bg-slate-200 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
