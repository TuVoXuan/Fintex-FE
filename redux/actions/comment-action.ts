import { createAsyncThunk } from '@reduxjs/toolkit';
import commentApi from '../../api/comment-api';

export const getComments = createAsyncThunk('comments', async (body: IGetComments, thunkAPI) => {
    try {
        const response = await commentApi.getComments(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const editComments = createAsyncThunk('comments/edit', async (body: FormData, thunkAPI) => {
    try {
        const response = await commentApi.editComment(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const createComments = createAsyncThunk('comments/create', async (body: FormData, thunkAPI) => {
    try {
        const response = await commentApi.createComment(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteComments = createAsyncThunk('comments/delete', async (body: IDeleteComment, thunkAPI) => {
    try {
        const response = await commentApi.deleteComment(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const reactionComment = createAsyncThunk('comments/reaction', async (body: IReactionComment, thunkAPI) => {
    try {
        const response = await commentApi.reactionComment(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteAllCommentsPost = createAsyncThunk(
    'comments/deleteAllsCommentPost',
    async (postId: string, thunkAPI) => {
        try {
            const response = await commentApi.deleteAllCommentsPost(postId);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);
