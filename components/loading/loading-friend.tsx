import React from 'react';

export default function LoadingFriend() {
    return (
        <div className="p-4 flex border-[1px] animate-pulse drop-shadow-sm rounded-lg bg-white items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
            <div className="content-center space-y-2 grow">
                <p className="w-1/2 h-5 text-lg font-semibold bg-gray-200 rounded-md"></p>
                <div className="flex gap-x-4">
                    <button className="w-20 h-10 font-semibold bg-gray-200 rounded-md"></button>
                    <button className="w-20 h-10 font-semibold rounded-md text-secondary-80 bg-secondary-20 hover:bg-secondary-30"></button>
                </div>
            </div>
        </div>
    );
}
