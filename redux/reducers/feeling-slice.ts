import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { feelingGetAll } from '../actions/feeling-action';

interface FeelingState {
    data: IFeeling[];
}

const initialState: FeelingState = {
    data: [],
};

export const feelingSlice = createSlice({
    name: 'feeling',
    initialState,
    reducers: {
        resetFeeling: (state) => {
            state.data = [];
        },
    },
    extraReducers(builder) {
        builder.addCase(feelingGetAll.fulfilled, (state, action: PayloadAction<IFeeling[]>) => {
            state.data = action.payload;
        });
        builder.addCase(feelingGetAll.rejected, (state) => {
            state.data = [];
        });
    },
});

export const { resetFeeling } = feelingSlice.actions;

export const selectFeeling = (state: RootState) => state.feeling;

export default feelingSlice.reducer;
