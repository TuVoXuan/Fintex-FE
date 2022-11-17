import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { friendReqAccept, friendReqCreate, friendReqGetPagination } from '../actions/notify-action';

interface FriendState {
    friendReq: {
        data: IFriendReq[];
        after: string | null;
        ended: boolean;
    };
    onlineFriends: IUserSimple[];
}

const initialState: FriendState = {
    friendReq: {
        data: [],
        after: null,
        ended: false,
    },
    onlineFriends: [],
};

export const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        addOnlineFriends: (state, action: PayloadAction<IUserSimple[]>) => {
            const onlineFriendsRes = action.payload;
            const onlineFriendNotInSlice: IUserSimple[] = [];

            onlineFriendsRes.forEach((user) => {
                const index = state.onlineFriends.findIndex((u) => u._id === user._id);
                if (index === -1) {
                    onlineFriendNotInSlice.push(user);
                }
            });
            state.onlineFriends = [...state.onlineFriends, ...onlineFriendNotInSlice];
        },
        removeOfflineFriend: (state, action: PayloadAction<string>) => {
            state.onlineFriends = state.onlineFriends.filter((friend) => friend._id !== action.payload);
        },
        removeFriendReq: (state, action: PayloadAction<string>) => {
            state.friendReq.data = state.friendReq.data.filter((req) => req._id !== action.payload);
        },
    },
    extraReducers(builder) {
        builder.addCase(friendReqCreate.fulfilled, (state, action: PayloadAction<IFriendReq>) => {
            state.friendReq.data = [action.payload, ...state.friendReq.data];
        });
    },
});

export const { addOnlineFriends, removeOfflineFriend, removeFriendReq } = friendSlice.actions;

export const selectFriend = (state: RootState) => state.friend;

export default friendSlice.reducer;
