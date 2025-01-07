import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const paymentTermsSlice = createSlice({
  name: 'paymentTerm',
  initialState: {
    isFetching: false,
    error: false,
    paymentTerms: [],
    paymentTypes: []
  },
  reducers: {
    paymentTermsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    paymentTermsFetchSuccess: (state, action) => {
      toast.success(`paymentTerm Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.paymentTerms = action.payload.data;
    },
    paymentTermsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at paymentTerm`);
    },
    paymentTypeFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    paymentTypeFetchSuccess: (state, action) => {
      toast.success(`paymentTerm Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.paymentTypes = action.payload.data;
    },
    paymentTypeFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at paymentTerm`);
    }
  }
});

export const {
  paymentTermsFetchStart,
  paymentTermsFetchSuccess,
  paymentTermsFetchFailure,
  paymentTypeFetchStart,
  paymentTypeFetchSuccess,
  paymentTypeFetchFailure
} = paymentTermsSlice.actions;
export default paymentTermsSlice.reducer;
