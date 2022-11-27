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

export const getMessagePagination = createAsyncThunk(
    'conversations/getMessagePagination',
    async (param: IParamMessPaginate, thunkAPI) => {
        try {
            const response = await messageApi.getMessages(param);
            response.conversationId = param.conversationId;
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const createGroupConversation = createAsyncThunk(
    'converstions/createGroup',
    async (body: ICreateConv, thunkAPI) => {
        try {
            const response = await conversationApi.createGroupConv(body);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const renameGroupConv = createAsyncThunk('conversations/rename', async (body: IRenameConversation, thunkAPI) => {
    try {
        await conversationApi.renameGroupConv(body);
        return body;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const switchAdmin = createAsyncThunk('conversations/switch-admin', async (body: IEditMemberConv, thunkAPI) => {
    try {
        const response = await conversationApi.switchAdmin(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const removeMember = createAsyncThunk('conversations/remove-member', async (body: IEditMemberConv, thunkAPI) => {
    try {
        const response = await conversationApi.deleteMember(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
