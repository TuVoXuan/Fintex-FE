import { createAsyncThunk } from '@reduxjs/toolkit';
import friendReqApi from '../../api/friend-req-api';

export const friendReqCreate = createAsyncThunk('friendReq/create', async (toId: string, thunkAPI) => {
    try {
        const response = await friendReqApi.createFriendReq(toId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
