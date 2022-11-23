export default function LoadingFriendConvCard() {
    return (
        <section className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center p-3 gap-x-3">
                <div className="rounded-full h-14 w-14 bg-slate-200 animate-pulse"></div>
                <div className="h-4 rounded-lg w-28 bg-slate-200 animate-pulse"></div>
            </div>

            <aside className="w-4 h-4 rounded-full bg-slate-200 animate-pulse"></aside>
        </section>
    );
}
