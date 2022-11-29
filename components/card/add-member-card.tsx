import React from 'react';
import Avatar from '../avatar/avatar';

export default function AddMemberCard() {
    return (
        <div className="flex items-center gap-x-2 border-b-[1px] border-secondary-20 py-4">
            <Avatar url="/images/avatar.jpg" size="medium" />
            <h4>Nguyen Van A</h4>
        </div>
    );
}
