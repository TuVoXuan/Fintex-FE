import { createAsyncThunk } from '@reduxjs/toolkit';
import postApi from '../../api/post-api';

export const postCreate = createAsyncThunk('post/postCreate', async (body: FormData, thunkAPI) => {
    try {
        const response = await postApi.createPost(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const postLoadMore = createAsyncThunk('post/postLoadMore', async (body: ILoadMorePost, thunkAPI) => {
    try {
        const response = await postApi.loadMorePost(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const postReaction = createAsyncThunk('post/postReaction', async (body: IReactionPost, thunkAPI) => {
    try {
        const response = await postApi.reactionPost(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const postDeleteReaction = createAsyncThunk('post/postDeleteReaction', async (postId: string, thunkAPI) => {
    try {
        const response = await postApi.deleteReactionPost(postId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const postMineLoadMore = createAsyncThunk('post/postMineLoadMore', async (body: ILoadMorePost, thunkAPI) => {
    try {
        const response = await postApi.loadMoreMinePost(body);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const postUpdate = createAsyncThunk(
    'post/postUpdate',
    async (data: { body: FormData; postId: string }, thunkAPI) => {
        try {
            const response = await postApi.updatePost(data.postId, data.body);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const postDelete = createAsyncThunk('post/postDelete', async (postId: string, thunkAPI) => {
    try {
        const response = await postApi.deletePost(postId);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const postCreateAvatarCover = createAsyncThunk(
    'post/postCreateAvatarCover',
    async (data: IUpdateAvatarCover, thunkAPI) => {
        try {
            const response = await postApi.createAvatarCoverPost(data);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
);
