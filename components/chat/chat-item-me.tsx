import React from 'react';
import ChatText from './chat-text';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import ChatImages from './chat-images';

export default function ChatItemMe() {
    timeago.register('vi', vi);

    return (
        <div className="space-y-1">
            <section className="space-y-1">
                <ChatText
                    position="first"
                    text="Pat ordered a ghost pepper pie."
                    me
                    className="text-white bg-primary-80"
                />
                <ChatText
                    position="middle"
                    text="The random sentence generator generated a random sentence about a random sentence."
                    me
                    className="text-white bg-primary-80"
                />
                <ChatText
                    position="middle"
                    text="My uncle's favorite pastime was building cars out of noodles."
                    me
                    className="text-white bg-primary-80"
                />
                <ChatImages
                    position="last"
                    me
                    className="text-white bg-primary-80"
                    images={[
                        {
                            publicId: '123423423',
                            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg',
                        },
                        {
                            publicId: 'slkdfjoewif',
                            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666710872/Fintex/d59kp8v47z4wokq015dt.jpg',
                        },
                        {
                            publicId: 'sldkfjiewjcoiwe',
                            url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666746952/Fintex/dw3msllwtlx3ntasbpcf.jpg',
                        },
                        // {
                        //     publicId: '1234sd23423',
                        //     url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg',
                        // },
                        // {
                        //     publicId: '1234sd234f23',
                        //     url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg',
                        // },
                        // {
                        //     publicId: '123x4sd234f23',
                        //     url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg',
                        // },
                        // {
                        //     publicId: '1d23x4sd234f23',
                        //     url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg',
                        // },
                        // {
                        //     publicId: '1ed23x4sd234f23',
                        //     url: 'https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg',
                        // },
                    ]}
                />
            </section>
            <div className="flex justify-end">
                <TimeAgo className="" datetime={new Date()} locale="vi" />
            </div>
        </div>
    );
}
