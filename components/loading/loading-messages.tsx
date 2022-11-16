import React from 'react';

export default function LoadingMessages() {
    return (
        <>
            <div className="flex justify-end my-4">
                <div className="w-1/2 p-6 rounded-3xl bg-slate-200"></div>
            </div>
            <div className="flex animate-pulse gap-x-1">
                <div className="self-end w-12 h-12 rounded-full bg-slate-200"></div>
                <div className="w-1/2 space-y-1">
                    <div className="p-6 rounded-md bg-slate-200 rounded-r-3xl rounded-tl-3xl"></div>
                    <div className="p-6 rounded-md bg-slate-200 rounded-r-3xl rounded-bl-3xl"></div>
                </div>
            </div>
        </>
    );
}
