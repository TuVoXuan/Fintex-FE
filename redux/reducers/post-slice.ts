import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { postCreate, postLoadMore } from '../actions/post-action';

interface PostState {
    after: string | null;
    posts: IPost[];
    ended: boolean;
}

const initialState: PostState = {
    after: null,
    posts: [],
    ended: false,
};

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(postCreate.fulfilled, (state, action: PayloadAction<IPost>) => {
            state.posts = [action.payload, ...state.posts];
        });
        builder.addCase(postLoadMore.fulfilled, (state, action: PayloadAction<ILoadMorePostResponse>) => {
            state.after = action.payload.after;
            state.ended = action.payload.ended;
            state.posts = [...state.posts, ...action.payload.posts];
        });
    },
});

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
