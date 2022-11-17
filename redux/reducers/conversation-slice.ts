import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createMessage, getConversations, getMessageFirstTime, seenMessage } from '../actions/conversation-action';

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
                        seen: action.payload.seen,
                    });
                }
            }
        },
        seen: (state, action: PayloadAction<ISeenMessage>) => {
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                const indexMess = conversation.messages.findIndex((item) => item._id === action.payload.messageId);
                if (indexMess > -1) {
                    conversation.messages[indexMess].seen.push(action.payload.userId || '');
                }
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
                                seen: conv.messages[0].seen,
                                updatedAt: conv.messages[0].updatedAt,
                            },
                        ],
                        participants: conv.participants,
                    });
                } else {
                    state.push({
                        after: '',
                        _id: conv._id,
                        messages: [],
                        participants: conv.participants,
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
                        seen: action.payload.seen,
                    });
                }
            }
        });
        builder.addCase(seenMessage.fulfilled, (state, action: PayloadAction<ISeenMessage>) => {
            const conversation = state.find((item) => item._id === action.payload.conversationId);
            if (conversation) {
                const indexMess = conversation.messages.findIndex((item) => item._id === action.payload.messageId);
                if (indexMess > -1) {
                    conversation.messages[indexMess].seen.push(action.payload.userId || '');
                }
            }
        });
    },
});

export const { addMessage, seen } = conversationsSlice.actions;

export const selectConversations = (state: RootState) => state.conversations;

export default conversationsSlice.reducer;
