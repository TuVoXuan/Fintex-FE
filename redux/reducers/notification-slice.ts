import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface NotificationState {
    noty: string[];
    friendReq: IFriendReq[];
}

const initialState: NotificationState = {
    noty: [],
    friendReq: [],
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers(builder) {},
});

export const selectNotification = (state: RootState) => state.notification;

export default notificationSlice.reducer;
