import { configureStore } from '@reduxjs/toolkit';
import user from '../redux/reducers/user-slice';
import otp from '../redux/reducers/otp-slice';

export const store = configureStore({
    reducer: {
        user,
        otp,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
