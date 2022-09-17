import { createAsyncThunk } from '@reduxjs/toolkit';
import feelingApi from '../../api/feeling-api';

export const feelingGetAll = createAsyncThunk('feeling/feelingGetAll', async (_body, thunkAPI) => {
    try {
        const response = await feelingApi.getFeelings();
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
