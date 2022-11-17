import { createAsyncThunk } from '@reduxjs/toolkit';
import friendReqApi from '../../api/friend-req-api';
import notifyApi from '../../api/notify-api';

export const friendReqCreate = createAsyncThunk('friendReq/create', async (toId: string, thunkAPI) => {
    try {
        const response = await friendReqApi.createFriendReq(toId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const friendReqGetPagination = createAsyncThunk(
    'friendReq/getPagination',
    async (pagination: IPagination, thunkAPI) => {
        try {
            const response = await friendReqApi.getFriendReqPagination(pagination);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const notifyGetPagination = createAsyncThunk(
    'notify/getPagination',
    async (pagination: IPagination, thunkAPI) => {
        try {
            const response = await notifyApi.getNotifyPagination(pagination);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const notifyHandleSee = createAsyncThunk('notify/handleSee', async (arrId: { id: string }[], thunkAPI) => {
    try {
        const response = await notifyApi.handleSeeNotify(arrId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const friendReqAccept = createAsyncThunk('friendReq/accept', async (friendReqId: string, thunkAPI) => {
    try {
        const response = await friendReqApi.acceptFriendReq(friendReqId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const friendReqDelete = createAsyncThunk('friendReq/delete', async (friendReqId: string, thunkAPI) => {
    try {
        const response = await friendReqApi.deleteFriendReq(friendReqId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
