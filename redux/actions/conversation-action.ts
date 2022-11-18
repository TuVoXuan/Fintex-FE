import { createAsyncThunk } from '@reduxjs/toolkit';
import conversationApi from '../../api/conversation.api';
import messageApi from '../../api/message-api';

export const getConversations = createAsyncThunk('conversations/get', async (_body, thunkAPI) => {
    try {
        const response = await conversationApi.getConversations();
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const getMessageFirstTime = createAsyncThunk(
    'conversations/getMessFirstTime',
    async (conversationId: string, thunkAPI) => {
        try {
            const response = await messageApi.getMessagesFirstTime(conversationId);
            return {
                conversationId,
                messPagiante: response.data.data,
            } as IGetMessFirstTime;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const createMessage = createAsyncThunk('conversations/createMessage', async (body: IMessageCreate, thunkAPI) => {
    try {
        const response = await messageApi.createMessage(body);
        // response.data.data.conversationId = body.conversationId;
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const seenMessage = createAsyncThunk('converstions/seenMessage', async (body: ISeenMessage, thunkAPI) => {
    try {
        const response = await messageApi.seenMessage(body);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const createConversation = createAsyncThunk('converstions/create', async (friendId: string, thunkAPI) => {
    try {
        const response = await conversationApi.createConversation(friendId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
