import React from 'react';
import Avatar from '../avatar/avatar';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';

interface Props {
    id: string;
    avatar: string;
    name: string;
    message: string;
    date: Date;
    isOnline?: boolean;
    active?: boolean;
}

export default function ChatPerson({ id, avatar, name, message, date, isOnline, active }: Props) {
    timeago.register('vi', vi);

    return (
        <div
            className={`flex px-3 py-4 rounded-lg cursor-pointer gap-x-2 hover:bg-secondary-20 transition-colors duration-500 ease-out t ${
                active && 'bg-secondary-20'
            }`}
        >
            <Avatar url={avatar} size="small" online={isOnline} />
            <div className="flex flex-col justify-center overflow-hidden">
                <div className="flex justify-between">
                    <p className="inline font-semibold truncate">{name}</p>
                    <TimeAgo className="shrink-0" datetime={date} locale="vi" />
                </div>
                <p className="text-sm truncate">{message}</p>
            </div>
        </div>
    );
}
