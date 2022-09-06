import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { handleFullName } from '../../util/handle-name';
import { userLoginWithGoogle, userSignUp } from '../actions/user-action';

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
                _id: '',
                ...user,
                name: name,
                birthday: new Date().toISOString(),
                gender: 'female',
            };
        },
        addPhone: (state, action: PayloadAction<string>) => {
            state.data = {
                _id: '',
                avatar: '',
                birthday: new Date().toISOString(),
                email: '',
                gender: 'male',
                phone: action.payload,
                name: {
                    firstName: '',
                    lastName: '',
                },
            };
        },
    },
    extraReducers(builder) {
        builder.addCase(userLoginWithGoogle.fulfilled, (state, { payload }) => {
            const { isExisted, user } = payload;
            if (!isExisted && user) {
                state.data = {
                    ...user,
                    birthday: new Date().toISOString(),
                    gender: 'female',
                };
            }
        });

        builder.addCase(userSignUp.fulfilled, (state, { payload }) => {
            const { token, user } = payload;
            state.isLogin = true;
            state.data = user;
            localStorage.setItem('token', token);
        });
    },
});

export const { addSimpleInfo, addPhone } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
