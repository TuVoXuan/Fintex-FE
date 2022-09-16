import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { feelingGetAll } from '../actions/feeling-action';
import { postCreate } from '../actions/post-action';

interface PostState {
    data: IPost[];
}

const initialState: PostState = {
    data: [],
};

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(postCreate.fulfilled, (state, action: PayloadAction<IPost>) => {
            state.data = [action.payload, ...state.data];
        });
    },
});

export const selectFeeling = (state: RootState) => state.feeling;

export default postSlice.reducer;
