import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { handleFullName } from '../../util/handle-name';
import { userVerify, userSignUp, userLoginGoogle } from '../actions/user-action';

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
            console.log('user: ', user);
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
            if (state.data) {
                state.data.phone = action.payload;
            } else {
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
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(userSignUp.fulfilled, (state: UserState, action: PayloadAction<IAuthResponse>) => {
            state.isLogin = true;
            localStorage.setItem('token', action.payload.token);

            const user = action.payload.user;
            state.data = { ...user };
        });
        builder.addCase(userLoginGoogle.fulfilled, (state: UserState, action: PayloadAction<IAuthResponse>) => {
            state.isLogin = true;
            localStorage.setItem('token', action.payload.token);

            const user = action.payload.user;
            state.data = { ...user };
        });
    },
});

export const { addSimpleInfo, addPhone } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
