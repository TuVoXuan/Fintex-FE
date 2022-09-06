import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { handleFullName } from '../../util/handle-name';
import { userLoginWithGoogle } from '../actions/user-action';

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
    reducers: {
        addSimpleInfo: (state, action: PayloadAction<IAuthUser>) => {
            const user = action.payload;
            const name = handleFullName(user.name);
            state.data = {
                ...user,
                name: name,
                birthday: new Date(),
                gender: 'female',
            };
        },
    },
    extraReducers(builder) {},
});

export const { addSimpleInfo } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
