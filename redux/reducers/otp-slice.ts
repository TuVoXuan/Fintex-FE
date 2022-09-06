import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConfirmationResult } from 'firebase/auth';
import { RootState } from '../../app/store';
import { handleFullName } from '../../util/handle-name';
import { userLoginWithGoogle } from '../actions/user-action';

interface OtpState {
    verify: ConfirmationResult | null;
    redirectUrl: string | null;
}

const initialState: OtpState = {
    verify: null,
    redirectUrl: null,
};

export const otpSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addVerifyOtp: (state, action: PayloadAction<ConfirmationResult>) => {
            state.verify = action.payload;
        },
        addRedirectUrl: (state, action: PayloadAction<string>) => {
            state.redirectUrl = action.payload;
        },
    },
    extraReducers(builder) {},
});

export const { addVerifyOtp, addRedirectUrl } = otpSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default otpSlice.reducer;
