export default function LoadingPost() {
    return (
        <div className="p-[18px] bg-white  space-y-4 shadow-light rounded-[15px]">
            <div className="space-y-4 animate-pulse">
                <div className="flex space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                    <div className="flex-1 py-1 space-y-6">
                        <div className="grid grid-cols-4">
                            <div className="h-2 col-span-2 rounded bg-slate-200"></div>
                        </div>
                        <div className="grid grid-cols-4">
                            <div className="h-2 rounded bg-slate-200"></div>
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="flex justify-around">
                    <div className="w-1/5 h-2 col-span-1 rounded bg-slate-200"></div>
                    <div className="w-1/5 h-2 col-span-1 rounded bg-slate-200"></div>
                </div>
            </div>
        </div>
    );
}
