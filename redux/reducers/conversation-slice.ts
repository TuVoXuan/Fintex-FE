import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
    addMember,
    createConversation,
    createGroupConversation,
    createMessage,
    getConversations,
    getMessageFirstTime,
    getMessagePagination,
    removeMember,
    renameGroupConv,
    seenMessage,
    switchAdmin,
} from '../actions/conversation-action';

const initialState: IConversationStore[] = [];

export const conversationsSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<IMessageCreateRes>) => {
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                const message = conversation.messages.find((e) => e._id === action.payload._id);
                if (message) {
                    message.message.push(...action.payload.message);
                } else {
                    conversation.messages.unshift({
                        _id: action.payload._id,
                        message: action.payload.message,
                        sender: action.payload.sender,
                        updatedAt: action.payload.createdAt,
                    });
                }
            }
        },
        seen: (state, action: PayloadAction<ISeenMessage>) => {
            // console.log('action.payload: ', action.payload);
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                const indexMess = conversation.messages.findIndex((item) => item._id === action.payload.messageId);
                if (indexMess > -1) {
                    const subMessage = conversation.messages[indexMess].message.find(
                        (item) => item._id === action.payload.subMessageId,
                    );
                    if (subMessage) {
                        subMessage.seen.push(action.payload.userId as string);
                    }
                }
            }
        },
        //todo: mới viết hàm chưa test thử
        setLastActive: (state, action: PayloadAction<string>) => {
            const conv = state.find((item) => item._id === action.payload);
            if (conv) {
                conv.lastActive = new Date().toString();
            }
        },
        setOnline: (state, action: PayloadAction<IOnlineConv>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.isOnline = action.payload.isOnline;
            }
        },
        removeParticipant: (state, action: PayloadAction<IEditMemberConvRes>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.messages.unshift(action.payload.message);
                const indexMember = conv.participants.findIndex((item) => item._id === action.payload.member);
                console.log('indexMember: ', indexMember);
                if (indexMember > -1) {
                    conv.removedMember.push(conv.participants[indexMember]);
                    conv.participants.splice(indexMember, 1);
                }
            }
        },
        removeConversation: (state, action: PayloadAction<string>) => {
            const indexConv = state.findIndex((conv) => conv._id === action.payload);
            if (indexConv > -1) {
                state.splice(indexConv, 1);
            }
        },
        addParticipant: (state, action: PayloadAction<IEditMemberConvRes>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.participants.push(action.payload.member as IParticipant);
                conv.messages.unshift(action.payload.message);
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(getConversations.fulfilled, (state, action: PayloadAction<IConversation[]>) => {
            for (const conv of action.payload) {
                if (conv.messages.length > 0) {
                    state.push({
                        after: '',
                        _id: conv._id,
                        messages: [
                            {
                                _id: conv.messages[0]._id,
                                message: conv.messages[0].message,
                                sender: conv.messages[0].sender,
                                updatedAt: conv.messages[0].updatedAt,
                            },
                        ],
                        participants: conv.participants,
                        removedMember: conv.removedMember,
                        name: conv.name || '',
                        isOnline: false,
                        admin: conv.admin,
                    });
                } else {
                    state.push({
                        after: '',
                        _id: conv._id,
                        messages: [],
                        participants: conv.participants,
                        removedMember: conv.removedMember,
                        name: conv.name || '',
                        isOnline: false,
                        admin: conv.admin,
                    });
                }
            }
        });
        builder.addCase(getMessageFirstTime.fulfilled, (state, action: PayloadAction<IGetMessFirstTime>) => {
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                conversation.after = action.payload.messPagiante.after;
                conversation.messages = action.payload.messPagiante.messages;
            }
        });
        builder.addCase(createMessage.fulfilled, (state, action: PayloadAction<IMessageCreateRes>) => {
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                const message = conversation.messages.find((e) => e._id === action.payload._id);
                if (message) {
                    message.message.push(...action.payload.message);
                } else {
                    conversation.messages.unshift({
                        _id: action.payload._id,
                        message: action.payload.message,
                        sender: action.payload.sender,
                        updatedAt: action.payload.createdAt,
                    });
                }
            }
        });
        builder.addCase(seenMessage.fulfilled, (state, action: PayloadAction<ISeenMessage>) => {
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                const indexMess = conversation.messages.findIndex((item) => item._id === action.payload.messageId);
                if (indexMess > -1) {
                    const subMessage = conversation.messages[indexMess].message.find(
                        (item) => item._id === action.payload.subMessageId,
                    );
                    if (subMessage) {
                        subMessage.seen.push(action.payload.userId || '');
                    }
                }
            }
        });
        builder.addCase(createConversation.fulfilled, (state, action: PayloadAction<IConversation>) => {
            state.unshift({
                after: '',
                _id: action.payload._id,
                messages: [],
                participants: action.payload.participants,
                removedMember: action.payload.removedMember,
                name: '',
                isOnline: false,
                admin: action.payload.admin,
            });
        });
        builder.addCase(getMessagePagination.fulfilled, (state, action: PayloadAction<IMessagePaginate>) => {
            if (action.payload.conversationId) {
                const conv = state.find((item) => item._id === action.payload.conversationId);
                if (conv) {
                    conv.after = action.payload.after;
                    for (const mess of action.payload.messages) {
                        conv.messages.push(mess);
                    }
                }
            }
        });
        builder.addCase(createGroupConversation.fulfilled, (state, action: PayloadAction<IConversation>) => {
            state.unshift({
                after: '',
                _id: action.payload._id,
                messages: [],
                participants: action.payload.participants,
                removedMember: action.payload.removedMember,
                name: action.payload.name || '',
                isOnline: false,
            });
        });
        builder.addCase(renameGroupConv.fulfilled, (state, action: PayloadAction<IRenameConversation>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.name = action.payload.name;
            }
        });
        builder.addCase(switchAdmin.fulfilled, (state, action: PayloadAction<ISwitchAdminRes>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.admin = action.payload.newAdmin;
            }
        });
        builder.addCase(removeMember.fulfilled, (state, action: PayloadAction<IEditMemberConvRes>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.messages.unshift(action.payload.message);
                const indexMember = conv.participants.findIndex(
                    (item) => item._id === (action.payload.member as string),
                );
                console.log('indexMember: ', indexMember);
                if (indexMember > -1) {
                    conv.removedMember.push(conv.participants[indexMember]);
                    conv.participants.splice(indexMember, 1);
                }
            }
        });
        builder.addCase(addMember.fulfilled, (state, action: PayloadAction<IAddMemberConvRes>) => {
            const conv = state.find((item) => item._id === action.payload.conversationId);
            if (conv) {
                conv.participants = [...conv.participants, ...action.payload.members];
                conv.messages = [...action.payload.messages, ...conv.messages];
            }
        });
    },
});

export const { addMessage, seen, setLastActive, setOnline, removeParticipant, removeConversation, addParticipant } =
    conversationsSlice.actions;

export const selectConversations = (state: RootState) => state.conversations;

export default conversationsSlice.reducer;
