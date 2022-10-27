import React from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Input } from '..';
import Avatar from '../avatar/avatar';
import ChatItemFriend from './chat-item-friend';
import ChatItemMe from './chat-item-me';

export default function ChatContainer() {
    const { register } = useForm();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex gap-x-4 px-5 py-2 border-b-[1px] border-secondary-20">
                <Avatar
                    size="small"
                    url="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                />
                <aside className="flex flex-col justify-center">
                    <p className="font-semibold">Thomas Edison</p>
                    <p>Active now</p>
                </aside>
            </div>

            <div id="chat" className="flex flex-col-reverse flex-auto px-5 overflow-y-auto">
                <InfiniteScroll
                    next={function () {
                        return <h2>lksdjfslkdfj</h2>;
                    }}
                    hasMore={true}
                    dataLength={2}
                    inverse={true}
                    loader={<h4>Loading...</h4>}
                    className="flex flex-col-reverse gap-y-5"
                    scrollableTarget="chat"
                >
                    <ChatItemMe />
                    <ChatItemFriend />
                </InfiniteScroll>
            </div>
            <div className="px-5 py-2 flex border-t-[1px] border-secondary-20 w-full gap-x-4">
                <form className="grow">
                    <Input
                        name="search"
                        border={true}
                        isTextArea
                        placeholder="Tìm kiếm tại đây..."
                        isHasEmojiIcon
                        isHasPhotoIcon
                        type="text"
                        register={register}
                    />
                </form>
                <button className="h-full bg-blue-200 aspect-square rounded-2xl hover:bg-blue-300 shrink-0">
                    <RiSendPlane2Line className="mx-auto text-blue-600" size={24} />
                </button>
            </div>
        </div>
    );
}
