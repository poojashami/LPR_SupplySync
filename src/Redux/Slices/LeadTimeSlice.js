import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const leadTimeSlice = createSlice({
  name: 'leadTime',
  initialState: {
    isFetching: false,
    error: false,
    leadTime: []
  },
  reducers: {
    leadTimeFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    leadTimeFetchSuccess: (state, action) => {
      toast.success(`leadTime Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.leadTime = action.payload.data;
    },
    leadTimeFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at leadTime`);
    }
  }
});

export const { leadTimeFetchStart, leadTimeFetchSuccess, leadTimeFetchFailure } = leadTimeSlice.actions;
export default leadTimeSlice.reducer;
