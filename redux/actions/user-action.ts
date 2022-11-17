import { async } from '@firebase/util';
import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/auth-api';
import friendReqApi from '../../api/friend-req-api';
import userApi from '../../api/user-api';

export const userVerify = createAsyncThunk('user/userLoginWithGoogle', async (body: IVerifyUser, thunkAPI) => {
    try {
        const response = await authApi.verifyUser(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userSignUp = createAsyncThunk('user/userSignUp', async (body: IUserSignUp, thunkAPI) => {
    try {
        const response = await authApi.signUp(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userCheckWithPhone = createAsyncThunk(
    'user/userCheckWithPhone',
    async (body: ICheckUserWithPhone, thunkAPI) => {
        try {
            const response = await authApi.checkUserWithPhone(body);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const userLoginGoogle = createAsyncThunk('user/loginGoogle', async (body: ICheckUserWithPhone, thunkAPI) => {
    try {
        const response = await authApi.signInWithGoogle(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userLoginPhone = createAsyncThunk('user/loginPhone', async (body: IUserLoginWithPhone, thunkAPI) => {
    try {
        const response = await authApi.signInWithPhone(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userGetCurrentUser = createAsyncThunk('user/getCurrentUser', async (_body, thunkAPI) => {
    try {
        const response = await authApi.getCurrentUser();
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userGetStranger = createAsyncThunk('user/getStrangers', async (param: IGetStragers, thunkAPI) => {
    try {
        const response = await friendReqApi.getStranger(param);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userEdit = createAsyncThunk('user/edit-info', async (body: IEditUser, thunkAPI) => {
    try {
        const response = await userApi.edituser(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userUpdateAvatar = createAsyncThunk('user/updateAvatar', async (formData: FormData, thunkAPI) => {
    try {
        const response = await userApi.uploadAvatarCover(formData);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const userUpdateCover = createAsyncThunk('user/updateCover', async (formData: FormData, thunkAPI) => {
    try {
        const response = await userApi.uploadAvatarCover(formData);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
