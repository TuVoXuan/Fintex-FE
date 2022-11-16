import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSearch } from 'react-icons/fi';
import conversationApi from '../api/conversation.api';
import { Input } from '../components';
import ChatPersonCard from '../components/card/chat-person-card';
import ChatContainer from '../components/chat/chat-container';
import { MainLayout } from '../layouts/main-layout';
import { toastError } from '../util/toast';
import { selectConversations } from '../redux/reducers/conversation-slice';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { getConversations } from '../redux/actions/conversation-action';
import { PayloadAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import APP_PATH from '../constants/app-path';

export default function Chat() {
    const { register } = useForm();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const chatRoom = router.query.chatRoom as string;
    console.log('chatRoom: ', chatRoom);

    const sConversations = useAppSelector(selectConversations);
    const [conversatons, setConversations] = useState<IConversation[]>([]);
    const [activedConversation, setActivedConversation] = useState<string>('');

    useEffect(() => {
        if (sConversations.length === 0) {
            dispatch(getConversations()).then((data) => {
                const convs = data.payload as IConversationStore[];
                setActivedConversation(convs[0]._id);
                const newUrl = `${APP_PATH.CHAT}?chatRoom=${convs[0]._id}`;
                window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
            });
        } else {
            setActivedConversation(sConversations[0]._id);
            const newUrl = `${APP_PATH.CHAT}?chatRoom=${sConversations[0]._id}`;
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
        }
    }, []);

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
                            {sConversations.map(({ _id, participants, messages }) => (
                                <ChatPersonCard
                                    key={_id}
                                    onClick={() => {
                                        setActivedConversation(_id);
                                        const newUrl = `${APP_PATH.CHAT}?chatRoom=${_id}`;

                                        window.history.replaceState(
                                            { ...window.history.state, as: newUrl, url: newUrl },
                                            '',
                                            newUrl,
                                        );
                                    }}
                                    name={participants[0].name.fullName}
                                    active={_id === activedConversation}
                                    date={new Date(messages[0].updatedAt)}
                                    message={
                                        messages[0].message[0].messType === 'text'
                                            ? messages[0].message[0].text || ''
                                            : `${participants[0].name.lastName} đã gửi ảnh`
                                    }
                                    avatar={participants[0].avatar}
                                />
                            ))}
                        </main>
                    </aside>
                    <aside className="col-span-2 overflow-hidden bg-white rounded-[15px]">
                        {sConversations.length > 0 && activedConversation && (
                            <ChatContainer
                                conversationId={activedConversation}
                                participants={
                                    sConversations.find((conv) => conv._id === activedConversation)?.participants || []
                                }
                            />
                        )}
                    </aside>
                </section>
            </div>
        </MainLayout>
    );
}
