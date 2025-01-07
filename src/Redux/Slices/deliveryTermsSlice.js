import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const deliveryTermsSlice = createSlice({
  name: 'deliveryTerm',
  initialState: {
    isFetching: false,
    error: false,
    deliveryTerms: []
  },
  reducers: {
    deliveryTermsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deliveryTermsFetchSuccess: (state, action) => {
      toast.success(`deliveryTerms Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.deliveryTerms = action.payload.data;
    },
    deliveryTermsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at deliveryTerms`);
    }
  }
});

export const { deliveryTermsFetchStart, deliveryTermsFetchSuccess, deliveryTermsFetchFailure } = deliveryTermsSlice.actions;
export default deliveryTermsSlice.reducer;
