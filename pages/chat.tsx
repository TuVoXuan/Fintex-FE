import React, { useContext, useEffect, useState } from 'react';
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
import { getConversations, seenMessage } from '../redux/actions/conversation-action';
import { PayloadAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import APP_PATH from '../constants/app-path';
import { selectUser } from '../redux/reducers/user-slice';
import { useMQTT } from '../context/mqtt-context';

export default function Chat() {
    const { register } = useForm();
    const dispatch = useAppDispatch();
    const mqtt = useMQTT();

    const sUser = useAppSelector(selectUser).data;
    const sConversations = useAppSelector(selectConversations);
    const [activedConversation, setActivedConversation] = useState<string>('');

    const handleSeenMessage = async (messageId: string, conversationId: string) => {
        try {
            await dispatch(
                seenMessage({
                    messageId,
                    conversationId,
                }),
            ).unwrap();
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        if (sConversations.length === 0) {
            dispatch(getConversations()).then((data) => {
                const convs = data.payload as IConversationStore[];
                setActivedConversation(convs[0]._id);
                if (mqtt) {
                    mqtt.setConversation(convs[0]._id);
                }
            });
        } else {
            setActivedConversation(sConversations[0]._id);
            if (mqtt) {
                mqtt.setConversation(sConversations[0]._id);
            }
        }
    }, []);

    useEffect(() => {
        if (activedConversation) {
            const conv = sConversations.find((item) => item._id === activedConversation);
            if (conv && conv.messages.length > 0) {
                if (sUser && conv.messages[0].sender !== sUser._id) {
                    if (!conv.messages[0].seen.includes(sUser._id)) {
                        handleSeenMessage(conv.messages[0]._id, conv._id);
                    }
                }
            }
        }
    }, [activedConversation]);

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
                            {sConversations.map(({ _id, participants, messages }) => {
                                if (messages.length === 0) {
                                    return (
                                        <ChatPersonCard
                                            key={_id}
                                            onClick={() => {
                                                setActivedConversation(_id);
                                                if (mqtt) {
                                                    mqtt.setConversation(_id);
                                                }
                                            }}
                                            name={participants[0].name.fullName}
                                            active={_id === activedConversation}
                                            notSeen={false}
                                            avatar={participants[0].avatar}
                                        />
                                    );
                                }
                                return (
                                    <ChatPersonCard
                                        key={_id}
                                        onClick={() => {
                                            setActivedConversation(_id);
                                            if (mqtt) {
                                                mqtt.setConversation(_id);
                                            }
                                        }}
                                        name={participants[0].name.fullName}
                                        active={_id === activedConversation}
                                        date={new Date(messages[0].updatedAt)}
                                        message={
                                            messages[0].message[messages[0].message.length - 1].messType === 'text'
                                                ? messages[0].message[messages[0].message.length - 1].text || ''
                                                : `${participants[0].name.lastName} đã gửi ảnh`
                                        }
                                        notSeen={messages[0].seen.length === 0 && messages[0].sender !== sUser?._id}
                                        avatar={participants[0].avatar}
                                    />
                                );
                            })}
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
