import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { handleFullName } from '../../util/handle-name';
import {
    userSignUp,
    userLoginGoogle,
    userLoginPhone,
    userGetCurrentUser,
    userUpdateAvatar,
    userUpdateCover,
} from '../actions/user-action';
import { setCookie, deleteCookie } from 'cookies-next';

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
                coverPhoto: '',
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
                    coverPhoto: '',
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
        signOut: (state) => {
            state.data = initialState.data;
            state.isLogin = false;
        },
    },
    extraReducers(builder) {
        builder.addCase(userSignUp.fulfilled, (state: UserState, action: PayloadAction<IAuthResponse>) => {
            state.isLogin = true;
            //localStorage.setItem('token', action.payload.token);
            setCookie('Authorization', action.payload.token, {
                maxAge: 60 * 60 * 24 * 7,
            });

            const user = action.payload.user;
            state.data = { ...user };
        });
        builder.addCase(userLoginGoogle.fulfilled, (state: UserState, action: PayloadAction<IAuthResponse>) => {
            state.isLogin = true;
            //localStorage.setItem('token', action.payload.token);
            setCookie('Authorization', action.payload.token, {
                maxAge: 60 * 60 * 24 * 7,
            });

            const user = action.payload.user;
            state.data = { ...user };
        });
        builder.addCase(userLoginPhone.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
            state.isLogin = true;

            setCookie('Authorization', action.payload.token, {
                maxAge: 60 * 60 * 24 * 7,
            });

            const user = action.payload.user;
            state.data = { ...user };
        });
        builder.addCase(userGetCurrentUser.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
            state.data = action.payload.user;
            state.isLogin = true;
            setCookie('Authorization', action.payload.token, {
                maxAge: 60 * 60 * 24 * 7,
            });
        });
        builder.addCase(userGetCurrentUser.rejected, (state) => {
            state.data = null;
            state.isLogin = false;
            deleteCookie('Authorization');
        });
        builder.addCase(userUpdateAvatar.fulfilled, (state, action: PayloadAction<string>) => {
            if (state.data) {
                state.data.avatar = action.payload;
            }
        });
        builder.addCase(userUpdateCover.fulfilled, (state, action: PayloadAction<string>) => {
            if (state.data) {
                state.data.coverPhoto = action.payload;
            }
        });
    },
});

export const { addSimpleInfo, addPhone, signOut } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
