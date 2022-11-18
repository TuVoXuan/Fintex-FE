import React, { useState } from 'react';
import Avatar from '../avatar/avatar';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import Image from 'next/image';
import AvatarChat from '../avatar/avatar-chat';

interface Props {
    participants: IParticipant[];
    name: string;
    message?: string;
    date?: Date;
    active?: boolean;
    notSeen: boolean;
    onClick: () => void;
}

export default function ChatPerson({ participants, name, message, date, active, onClick, notSeen }: Props) {
    timeago.register('vi', vi);

    return (
        <div
            onClick={() => onClick()}
            className={`flex items-center p-3 rounded-lg cursor-pointer gap-x-2 hover:bg-secondary-10 transition-colors duration-500 ease-out t ${
                active && 'bg-secondary-10'
            }`}
        >
            <AvatarChat participants={participants} />
            <div className="flex flex-col justify-center flex-grow overflow-hidden">
                <div className="flex justify-between">
                    <p className="inline font-semibold truncate">{name ? name : participants[0].name.fullName}</p>
                    {date && <TimeAgo className="self-center text-sm shrink-0" datetime={date} locale="vi" />}
                </div>
                {message && <p className="text-sm truncate">{message}</p>}
            </div>
            {notSeen && <div className="w-4 h-4 rounded-full bg-primary-80 shrink-0"></div>}
        </div>
    );
}
