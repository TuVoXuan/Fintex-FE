import { configureStore } from '@reduxjs/toolkit';
import user from '../redux/reducers/user-slice';
import otp from '../redux/reducers/otp-slice';
import comments from '../redux/reducers/comments-slice';
import feeling from '../redux/reducers/feeling-slice';
import post from '../redux/reducers/post-slice';

export const store = configureStore({
    reducer: {
        user,
        otp,
        comments,
        feeling,
        post,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['user/addVerifyOtp', 'user/resetVerifyOtp'],
                ignoredPaths: ['otp.verify'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
