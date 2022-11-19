import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
    createConversation,
    createMessage,
    getConversations,
    getMessageFirstTime,
    getMessagePagination,
    seenMessage,
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
                        name: conv.name || '',
                        isOnline: false,
                    });
                } else {
                    state.push({
                        after: '',
                        _id: conv._id,
                        messages: [],
                        participants: conv.participants,
                        name: conv.name || '',
                        isOnline: false,
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
                name: '',
                isOnline: false,
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
    },
});

export const { addMessage, seen, setLastActive, setOnline } = conversationsSlice.actions;

export const selectConversations = (state: RootState) => state.conversations;

export default conversationsSlice.reducer;
