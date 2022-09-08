import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConfirmationResult } from 'firebase/auth';
import { RootState } from '../../app/store';
import { handleFullName } from '../../util/handle-name';
import { userVerify } from '../actions/user-action';

interface OtpState {
    verify: ConfirmationResult | null;
    redirectUrl: string | null;
    isSignUp: boolean;
    isLoginGoogle: boolean;
}

const initialState: OtpState = {
    verify: null,
    redirectUrl: null,
    isSignUp: false,
    isLoginGoogle: false,
};

export const otpSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addVerifyOtp: (state, action: PayloadAction<ConfirmationResult>) => {
            state.verify = action.payload;
        },
        resetVerifyOtp: (state) => {
            state.verify = null;
        },
        addRedirectUrl: (state, action: PayloadAction<string>) => {
            state.redirectUrl = action.payload;
        },
        setIsSignUp: (state, action: PayloadAction<boolean>) => {
            state.isSignUp = action.payload;
        },
        setIsLoginGoogle: (state, action: PayloadAction<boolean>) => {
            state.isLoginGoogle = action.payload;
        },
    },
    extraReducers(builder) {},
});

export const { addVerifyOtp, addRedirectUrl, resetVerifyOtp, setIsSignUp, setIsLoginGoogle } = otpSlice.actions;

export const selectOTP = (state: RootState) => state.otp;

export default otpSlice.reducer;
