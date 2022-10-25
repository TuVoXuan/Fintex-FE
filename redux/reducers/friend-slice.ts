import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { friendReqCreate } from '../actions/friend-req-action';

interface FriendState {
    friendReq: IFriendReq[];
    onlineFriends: IUserSimple[];
}

const initialState: FriendState = {
    friendReq: [],
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
    },
    extraReducers(builder) {
        builder.addCase(friendReqCreate.fulfilled, (state, action: PayloadAction<IFriendReq>) => {
            state.friendReq = [action.payload, ...state.friendReq];
        });
    },
});

export const { addOnlineFriends, removeOfflineFriend } = friendSlice.actions;

export const selectFriend = (state: RootState) => state.friend;

export default friendSlice.reducer;
