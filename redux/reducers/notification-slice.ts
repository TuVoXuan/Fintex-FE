import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
    friendReqAccept,
    friendReqDelete,
    friendReqGetPagination,
    notifyGetPagination,
    notifyHandleSee,
} from '../actions/notify-action';

interface NotificationState {
    notify: {
        data: INotify[];
        after: string | null;
        ended: boolean;
        notSeen: number;
    };
    friendReq: {
        data: IFriendReq[];
        after: string | null;
        ended: boolean;
    };
}

const initialState: NotificationState = {
    notify: {
        data: [],
        after: null,
        ended: false,
        notSeen: 0,
    },
    friendReq: {
        data: [],
        after: null,
        ended: false,
    },
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addReceiveFriendReq: (state, action: PayloadAction<IFriendReq>) => {
            state.friendReq.data = [action.payload, ...state.friendReq.data];
        },
        addNotifi: (state, action: PayloadAction<INotify>) => {
            state.notify.data = [action.payload, ...state.notify.data];
            state.notify.notSeen += 1;
        },
        addSeeNotifi: (state, action: PayloadAction<INotify>) => {
            state.notify.data = [action.payload, ...state.notify.data];
        },
    },
    extraReducers(builder) {
        builder.addCase(friendReqGetPagination.fulfilled, (state, action: PayloadAction<IFriendReqPaginationRes>) => {
            state.friendReq.data = [...state.friendReq.data, ...action.payload.friendReqs];
            state.friendReq.after = action.payload.after;
            state.friendReq.ended = action.payload.ended;
        });
        builder.addCase(notifyGetPagination.fulfilled, (state, action: PayloadAction<INofifyPaginationRes>) => {
            state.notify.data = [...state.notify.data, ...action.payload.notify];
            state.notify.after = action.payload.after;
            state.notify.ended = action.payload.ended;

            const notSeenNotify = state.notify.data.reduce((total, currValue) => {
                if (!currValue.isSeen) {
                    total += 1;
                }
                return total;
            }, 0);

            state.notify.notSeen = notSeenNotify;
        });
        builder.addCase(notifyHandleSee.fulfilled, (state, action: PayloadAction<null>) => {
            state.notify.notSeen = 0;
            state.notify.data = state.notify.data.map((notify) => {
                return { ...notify, isSeen: true };
            });
        });
        builder.addCase(friendReqAccept.fulfilled, (state, action: PayloadAction<string>) => {
            state.friendReq.data = state.friendReq.data.filter((req) => req._id !== action.payload);
        });
        builder.addCase(friendReqDelete.fulfilled, (state, action: PayloadAction<string>) => {
            state.friendReq.data = state.friendReq.data.filter((req) => req._id !== action.payload);
        });
    },
});

export const { addReceiveFriendReq, addNotifi, addSeeNotifi } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification;

export default notificationSlice.reducer;
