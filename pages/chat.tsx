import React from 'react';
import { useForm } from 'react-hook-form';
import { FiSearch } from 'react-icons/fi';
import { Input } from '../components';
import ChatPersonCard from '../components/card/chat-person-card';
import ChatContainer from '../components/chat/chat-container';
import { MainLayout } from '../layouts/main-layout';

export default function Chat() {
    const { register } = useForm();

    return (
        <MainLayout>
            <div className="h-full bg-secondary-10 rounded-[15px] p-7 gap-x-1">
                <section className="grid h-full grid-cols-3 overflow-hidden gap-x-4">
                    <aside className="bg-white rounded-[15px] p-5 space-y-4 overflow-hidden flex flex-col">
                        <Input
                            name="search"
                            border={true}
                            placeholder="Tìm kiếm tại đây..."
                            icon={<FiSearch size={24} />}
                            type="text"
                            register={register}
                        />
                        <main className="space-y-2 overflow-y-auto">
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                active
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                            <ChatPersonCard
                                name="Thomas Edison sdfsdfsdfsdfsdf"
                                id="123"
                                date={new Date('2022-10-25')}
                                message='Separation anxiety is what happens when you can"t find your phone.'
                                avatar="https://res.cloudinary.com/cake-shop/image/upload/v1666688067/Fintex/mfzhce7rmphmcsbqslcc.jpg"
                            />
                        </main>
                    </aside>
                    <aside className="col-span-2 overflow-hidden bg-white rounded-[15px]">
                        <ChatContainer />
                    </aside>
                </section>
            </div>
        </MainLayout>
    );
}
