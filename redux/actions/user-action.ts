import { async } from '@firebase/util';
import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/auth-api';

export const userLoginWithGoogle = createAsyncThunk('user/loginWithGoogle', async (body: IVerifyUser, thunkAPI) => {
    try {
        const response = await authApi.verifyUser(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userRegister = createAsyncThunk('user/register', async (body: IRegisterUser, thunkAPI) => {});
