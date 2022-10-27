import React from 'react';
import Avatar from '../avatar/avatar';
import ChatText from './chat-text';

export default function ChatItemFriend() {
    return (
        <div className="flex gap-x-2">
            <div className="flex items-end">
                <Avatar
                    size="tiny"
                    url="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                />
            </div>
            <aside>
                <section className="space-y-1">
                    <ChatText position="first" text="Pat ordered a ghost pepper pie." className="bg-secondary-10" />
                    <ChatText
                        position="middle"
                        text="The random sentence generator generated a random sentence about a random sentence."
                        className="bg-secondary-10"
                    />
                    <ChatText
                        position="middle"
                        text="The random sentence generator generated a random sentence about a random sentence."
                        className="bg-secondary-10"
                    />
                    <ChatText
                        position="middle"
                        text="The random sentence generator generated a random sentence about a random sentence."
                        className="bg-secondary-10"
                    />
                    <ChatText
                        position="last"
                        text="My uncle's favorite pastime was building cars out of noodles."
                        className="bg-secondary-10"
                    />
                </section>
            </aside>
        </div>
    );
}
