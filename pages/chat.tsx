import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit, FiSearch } from 'react-icons/fi';
import { Input } from '../components';
import ChatPersonCard from '../components/card/chat-person-card';
import ChatContainer from '../components/chat/chat-container';
import LoadingChatCard from '../components/loading/loading-chat-card';
import CreateConvModal from '../components/modal/create-conv-modal';
import { useMQTT } from '../context/mqtt-context';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { MainLayout } from '../layouts/main-layout';
import { seenMessage } from '../redux/actions/conversation-action';
import { selectConversations } from '../redux/reducers/conversation-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastError } from '../util/toast';

interface FormData {
    search: string;
}

export default function Chat() {
    const { register, watch, getValues } = useForm<FormData>();
    const dispatch = useAppDispatch();
    const mqtt = useMQTT();

    const sUser = useAppSelector(selectUser).data;
    const sConversations = useAppSelector(selectConversations);
    const [activedConversation, setActivedConversation] = useState<string>('');
    const [searchConvs, setSearchConvs] = useState<IConversationStore[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [showCreateConvModal, setShowCreateConvModal] = useState<boolean>(true);

    const handleShowCreateConvModal = () => {
        setShowCreateConvModal(true);
    };

    const handleCloseCreateConvModal = () => {
        setShowCreateConvModal(false);
    };

    const handleSeenMessage = async (messageId: string, conversationId: string, subMessageId: string) => {
        try {
            await dispatch(
                seenMessage({
                    messageId,
                    conversationId,
                    subMessageId,
                }),
            ).unwrap();
        } catch (error) {
            console.log('error: ', error);
            toastError((error as IResponseError).error);
        }
    };

    useEffect(() => {
        if (mqtt && sConversations.length > 0) {
            console.log('mqtt.activedConversation.current: ', mqtt.activedConversation.current);
            if (mqtt.activedConversation.current) {
                setActivedConversation(mqtt.activedConversation.current);
            } else {
                setActivedConversation(sConversations[0]._id);
                mqtt.setConversation(sConversations[0]._id);
            }
        }
    }, [sConversations.length]);

    useEffect(() => {
        if (activedConversation) {
            const conv = sConversations.find((item) => item._id === activedConversation);
            if (conv && conv.messages.length > 0) {
                if (sUser && conv.messages[0].sender !== sUser._id) {
                    const length = conv.messages[0].message.length;
                    if (!conv.messages[0].message[length - 1].seen.includes(sUser._id)) {
                        handleSeenMessage(conv.messages[0]._id, conv._id, conv.messages[0].message[length - 1]._id);
                    }
                }
            }
        }
    }, [activedConversation]);

    useEffect(() => {
        console.log('sConvs: ', sConversations);
        let delayDebounce: any;
        const subscription = watch((value, { name, type }) => {
            setIsSearching(true);
            if (!isTyping && value.search === '') {
                console.log('vo khong');
                setIsSearching(false);
                setIsTyping(false);
                setSearchConvs([]);
            } else {
                clearTimeout(delayDebounce);

                setIsSearching(true);
                setIsTyping(true);
                const searchKey = (value.search || '').toLowerCase();
                console.log('searchKey: ', searchKey);
                console.log('sConv.length: ', sConversations.length);
                delayDebounce = setTimeout(() => {
                    const convSearchs = sConversations.filter((conv) => {
                        if (conv.participants.length === 1) {
                            if (conv.participants[0].name.fullName.toLowerCase().includes(searchKey)) {
                                return true;
                            }
                            return false;
                        } else {
                            if (conv.name.toLowerCase().includes(searchKey)) {
                                return true;
                            }
                            return false;
                        }
                    });

                    setSearchConvs(convSearchs);
                    setIsTyping(false);
                }, 2000);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, sConversations]);

    return (
        <MainLayout>
            <div className="h-full bg-secondary-10 rounded-[15px] p-7 gap-x-1">
                <section className="grid h-full grid-cols-3 overflow-hidden gap-x-4">
                    <aside className="bg-white rounded-[15px] p-5 space-y-4 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3>Trò chuyện</h3>
                            <button className="p-3 transition-colors duration-150 ease-linear rounded-full hover:bg-secondary-10">
                                <FiEdit size={20} />
                            </button>
                        </div>
                        <Input
                            name="search"
                            border={true}
                            placeholder="Tìm kiếm tại đây..."
                            icon={<FiSearch size={24} />}
                            type="text"
                            register={register}
                        />
                        <main className="space-y-2 overflow-y-auto hover:scrollbar-show">
                            {isSearching ? (
                                isTyping ? (
                                    <div>
                                        <LoadingChatCard />
                                        <LoadingChatCard />
                                        <LoadingChatCard />
                                        <LoadingChatCard />
                                    </div>
                                ) : (
                                    <>
                                        {searchConvs.length > 0 ? (
                                            searchConvs.map(({ _id, participants, messages, name }) => {
                                                if (messages.length === 0) {
                                                    return (
                                                        <ChatPersonCard
                                                            key={_id}
                                                            onClick={() => {
                                                                console.log('click chat person card');
                                                                setActivedConversation(_id);
                                                                if (mqtt) {
                                                                    mqtt.setConversation(_id);
                                                                }
                                                            }}
                                                            conversationId={_id}
                                                            name={name}
                                                            active={_id === activedConversation}
                                                            notSeen={false}
                                                            participants={participants}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <ChatPersonCard
                                                        key={_id}
                                                        onClick={() => {
                                                            console.log('click chat person card');
                                                            setActivedConversation(_id);
                                                            if (mqtt) {
                                                                mqtt.setConversation(_id);
                                                            }
                                                        }}
                                                        conversationId={_id}
                                                        name={name}
                                                        active={_id === activedConversation}
                                                        date={new Date(messages[0].updatedAt)}
                                                        message={
                                                            messages[0].message[messages[0].message.length - 1]
                                                                .messType === 'text'
                                                                ? messages[0].message[messages[0].message.length - 1]
                                                                      .text || ''
                                                                : `${participants[0].name.lastName} đã gửi ảnh`
                                                        }
                                                        notSeen={
                                                            messages[0].message[messages[0].message.length - 1].seen
                                                                .length === 0 && messages[0].sender !== sUser?._id
                                                        }
                                                        participants={participants}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Image
                                                    src={'/images/no-data-pana.svg'}
                                                    height={200}
                                                    width={200}
                                                    placeholder="blur"
                                                    alt="no data"
                                                    blurDataURL="/images/avatar.jpg"
                                                />
                                                <p className="text-center">Không tìm thấy kết quả phù hợp</p>
                                            </div>
                                        )}
                                    </>
                                )
                            ) : (
                                sConversations.map(({ _id, participants, messages, name }) => {
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
                                                conversationId={_id}
                                                name={name}
                                                active={_id === activedConversation}
                                                notSeen={false}
                                                participants={participants}
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
                                            conversationId={_id}
                                            name={name}
                                            active={_id === activedConversation}
                                            date={new Date(messages[0].updatedAt)}
                                            message={
                                                messages[0].message[messages[0].message.length - 1].messType === 'text'
                                                    ? messages[0].message[messages[0].message.length - 1].text || ''
                                                    : `${participants[0].name.lastName} đã gửi ảnh`
                                            }
                                            notSeen={
                                                messages[0].message[messages[0].message.length - 1].seen.length === 0 &&
                                                messages[0].sender !== sUser?._id
                                            }
                                            participants={participants}
                                        />
                                    );
                                })
                            )}
                        </main>
                    </aside>
                    <aside className="col-span-2 overflow-hidden bg-white rounded-[15px]">
                        {sConversations.length > 0 && activedConversation && (
                            <ChatContainer
                                conversationId={activedConversation}
                                name={sConversations.find((conv) => conv._id === activedConversation)?.name || ''}
                                participants={
                                    sConversations.find((conv) => conv._id === activedConversation)?.participants || []
                                }
                            />
                        )}
                    </aside>
                </section>
            </div>
            {showCreateConvModal && <CreateConvModal onClose={handleCloseCreateConvModal} />}
        </MainLayout>
    );
}
