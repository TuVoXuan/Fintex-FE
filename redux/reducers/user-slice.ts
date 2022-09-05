import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface UserState {
    isLogin: boolean;
    data: IUser | null;
}

const initialState: UserState = {
    isLogin: false,
    data: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {},
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
