import { createAsyncThunk } from '@reduxjs/toolkit';
import postApi from '../../api/post-api';

export const postCreate = createAsyncThunk('post/postCreate', async (body: FormData, thunkAPI) => {
    try {
        const response = await postApi.createPost(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
