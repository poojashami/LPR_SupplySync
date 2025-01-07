import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    isFetching: false,
    error: false
  },
  reducers: {
    fetchCompaniesStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    fetchCompaniesSuccess: (state, action) => {
      toast.success('Companies Fetched');
      state.isFetching = true;
      state.error = false;
      state.companies = action.payload.data;
    },
    fetchCompaniesError: (state) => {
      state.isFetching = true;
      state.error = false;
    }
  }
});

export const { fetchCompaniesStart, fetchCompaniesSuccess, fetchCompaniesError } = companySlice.actions;
export default companySlice.reducer;
