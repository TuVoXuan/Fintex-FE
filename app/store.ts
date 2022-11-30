import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import user from '../redux/reducers/user-slice';
import otp from '../redux/reducers/otp-slice';
import comments from '../redux/reducers/comments-slice';
import feeling from '../redux/reducers/feeling-slice';
import post from '../redux/reducers/post-slice';
import notification from '../redux/reducers/notification-slice';
import friend from '../redux/reducers/friend-slice';
import conversations from '../redux/reducers/conversation-slice';

const combinedReducer = combineReducers({
    user,
    otp,
    comments,
    feeling,
    post,
    notification,
    friend,
    conversations,
});

const rootReducer = (state: any, action: AnyAction) => {
    if (action.type === 'user/signOut') {
        state = undefined;
    }
    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
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
