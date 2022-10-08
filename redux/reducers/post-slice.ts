import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { postCreate, postDeleteReaction, postLoadMore, postMineLoadMore, postReaction } from '../actions/post-action';

interface PostState {
    all: {
        after: string | null;
        posts: IPost[];
        ended: boolean;
    };
    mine: {
        after: string | null;
        posts: IPost[];
        ended: boolean;
    };
    person: {
        after: string | null;
        posts: IPost[];
        ended: boolean;
    };
}

const initialState: PostState = {
    all: {
        after: null,
        posts: [],
        ended: false,
    },
    mine: {
        after: null,
        posts: [],
        ended: false,
    },
    person: {
        after: null,
        posts: [],
        ended: false,
    },
};

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        resetPost: (state) => {
            state.all.after = initialState.all.after;
            state.all.ended = initialState.all.ended;
            state.all.posts = initialState.all.posts;
        },
    },
    extraReducers(builder) {
        builder.addCase(postCreate.fulfilled, (state, action: PayloadAction<IPost>) => {
            state.all.posts = [action.payload, ...state.all.posts];
        });
        builder.addCase(postLoadMore.fulfilled, (state, action: PayloadAction<ILoadMorePostResponse>) => {
            state.all.after = action.payload.after;
            state.all.ended = action.payload.ended;
            state.all.posts = [...state.all.posts, ...action.payload.posts];
        });
        builder.addCase(postMineLoadMore.fulfilled, (state, action: PayloadAction<ILoadMorePostResponse>) => {
            state.mine.after = action.payload.after;
            state.mine.ended = action.payload.ended;
            state.mine.posts = [...state.mine.posts, ...action.payload.posts];
        });
        builder.addCase(postReaction.fulfilled, (state, action: PayloadAction<IReactionPostRes>) => {
            const post = state.all.posts.find((item) => item._id === action.payload.postId);
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
            const post = state.all.posts.find((item) => item._id === action.payload.postId);
            if (post) {
                post.reactions = post.reactions.filter((item) => item.user._id !== action.payload.userId);
            }
        });
    },
});

export const { resetPost } = postSlice.actions;

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
