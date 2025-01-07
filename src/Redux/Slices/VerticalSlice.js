import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const verticleSlice = createSlice({
  name: 'verticle',
  initialState: {
    isFetching: false,
    error: false,
    verticles: []
  },
  reducers: {
    verticleFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    verticleFetchSuccess: (state, action) => {
      console.log(action.payload.data);
      toast.success(`verticle Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.verticles = action.payload.data;
    },
    verticleFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at verticle`);
    }
  }
});

export const { verticleFetchStart, verticleFetchSuccess, verticleFetchFailure } = verticleSlice.actions;
export default verticleSlice.reducer;
