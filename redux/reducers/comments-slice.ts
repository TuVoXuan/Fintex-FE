import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createComments, editComments, getComments } from '../actions/comment-action';

const initialState: IComment[] = [];

export const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getComments.fulfilled, (state, action: PayloadAction<ICommentPagination>) => {
            const comments = action.payload.comments;
            state.push(...comments);
        });
        builder.addCase(editComments.fulfilled, (state, action: PayloadAction<ICommentResponse>) => {
            const comment = action.payload;
            const index = state.findIndex((item) => item._id === comment._id);

            state[index] = { ...state[index], ...comment };
        });
        builder.addCase(createComments.fulfilled, (state, action: PayloadAction<ICreateCommentResponse>) => {
            const data = action.payload;
            state.unshift(data.comment);
            const index = state.findIndex((item) => item._id === data.comment.parentId);
            if (index !== -1) {
                state[index].commentsChildren += 1;
            }
        });
    },
});

export const selectComments = (state: RootState) => state.comments;

export default commentsSlice.reducer;
