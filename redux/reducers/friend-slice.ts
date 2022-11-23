import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { friendReqAccept, friendReqCreate, friendReqGetPagination } from '../actions/notify-action';
import {
    userDeleteFriend,
    userDeleteSendFriendReq,
    userGetFriends,
    userGetSendFriendReq,
} from '../actions/user-action';

interface FriendState {
    friendReq: {
        data: IFriendReq[];
        after: string | null;
        ended: boolean;
    };
    onlineFriends: IUserSimple[];
    friends: {
        data: IFriend[];
        after: string;
    };
}

const initialState: FriendState = {
    friendReq: {
        data: [],
        after: null,
        ended: false,
    },
    onlineFriends: [],
    friends: {
        data: [],
        after: '',
    },
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
        deleteFriend: (state, action: PayloadAction<string>) => {
            state.friends.data = state.friends.data.filter((friend) => friend._id !== action.payload);
        },
    },
    extraReducers(builder) {
        builder.addCase(friendReqCreate.fulfilled, (state, action: PayloadAction<IFriendReq>) => {
            state.friendReq.data = [action.payload, ...state.friendReq.data];
        });
        builder.addCase(userGetSendFriendReq.fulfilled, (state, action: PayloadAction<IFriendReqPaginationRes>) => {
            if (!state.friendReq.after && !state.friendReq.ended) {
                state.friendReq.data = [...action.payload.friendReqs];
            } else {
                state.friendReq.data = [...state.friendReq.data, ...action.payload.friendReqs];
            }
            state.friendReq.after = action.payload.after;
            state.friendReq.ended = action.payload.ended;
        });
        builder.addCase(userDeleteSendFriendReq.fulfilled, (state, action: PayloadAction<string>) => {
            state.friendReq.data = state.friendReq.data.filter((req) => req._id !== action.payload);
        });
        builder.addCase(userGetFriends.fulfilled, (state, action: PayloadAction<IFriendPaginate>) => {
            state.friends.data = [...state.friends.data, ...action.payload.friends];
            state.friends.after = action.payload.after;
        });
        builder.addCase(userDeleteFriend.fulfilled, (state, action: PayloadAction<string>) => {
            state.friends.data = state.friends.data.filter((friend) => friend._id !== action.payload);
        });
    },
});

export const { addOnlineFriends, removeOfflineFriend, removeFriendReq, deleteFriend } = friendSlice.actions;

export const selectFriend = (state: RootState) => state.friend;

export default friendSlice.reducer;
