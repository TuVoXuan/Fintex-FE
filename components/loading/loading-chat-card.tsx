export default function LoadingChatCard() {
    return (
        <div className="flex items-center p-3 bg-white rounded-lg cursor-pointer gap-x-2">
            <div className="rounded-full h-14 w-14 bg-slate-200 animate-pulse"></div>
            <div className="space-y-3">
                <div className="w-32 h-6 rounded-lg bg-slate-200 animate-pulse"></div>
                <div className="h-4 rounded-lg w-28 bg-slate-200 animate-pulse"></div>
            </div>
        </div>
    );
}
