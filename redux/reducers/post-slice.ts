import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { postCreate, postDeleteReaction, postLoadMore, postMineLoadMore, postReaction } from '../actions/post-action';

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
    reducers: {
        resetPost: (state) => {
            state.after = initialState.after;
            state.ended = initialState.ended;
            state.posts = initialState.posts;
        },
    },
    extraReducers(builder) {
        builder.addCase(postCreate.fulfilled, (state, action: PayloadAction<IPost>) => {
            state.posts = [action.payload, ...state.posts];
        });
        builder.addCase(postLoadMore.fulfilled, (state, action: PayloadAction<ILoadMorePostResponse>) => {
            state.after = action.payload.after;
            state.ended = action.payload.ended;
            state.posts = [...state.posts, ...action.payload.posts];
        });
        builder.addCase(postMineLoadMore.fulfilled, (state, action: PayloadAction<ILoadMorePostResponse>) => {
            state.after = action.payload.after;
            state.ended = action.payload.ended;
            state.posts = [...state.posts, ...action.payload.posts];
        });
        builder.addCase(postReaction.fulfilled, (state, action: PayloadAction<IReactionPostRes>) => {
            const post = state.posts.find((item) => item._id === action.payload.postId);
            if (post) {
                const reaction = post.reactions.find((item) => item.user._id === action.payload.reaction.user._id);
                if (reaction) {
                    reaction.type = action.payload.reaction.type;
                } else {
                    post.reactions.push(action.payload.reaction);
                }
            }
        });
        builder.addCase(postDeleteReaction.fulfilled, (state, action: PayloadAction<IDeleteReactionPostRes>) => {
            const post = state.posts.find((item) => item._id === action.payload.postId);
            if (post) {
                post.reactions = post.reactions.filter((item) => item.user._id !== action.payload.userId);
            }
        });
    },
});

export const { resetPost } = postSlice.actions;

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
