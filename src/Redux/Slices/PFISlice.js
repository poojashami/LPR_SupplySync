import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const PFISlice = createSlice({
    name: 'Pfi',
    initialState: {
        isFetching: false,
        error: false,
        pfiData: []
    },
    reducers: {
        PFIFetchStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        PFIFetchSuccess: (state, action) => {
            state.isFetching = false;
            state.error = false;
            state.pfiData = action.payload.data;
        },
        PFIFetchFailure: (state) => {
            state.isFetching = true;
            state.error = false;
            toast.error(`An Error has occurred at pfi`);
        }
    }
});

export const { PFIFetchStart, PFIFetchSuccess, PFIFetchFailure } = PFISlice.actions;
export default PFISlice.reducer;
