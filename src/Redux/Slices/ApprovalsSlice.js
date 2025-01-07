import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const ApprovalsSlice = createSlice({
  name: 'approvals',
  initialState: {
    approvals: [],
    isFetching: false,
    error: false
  },
  reducers: {
    ApprovalsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    ApprovalsFetchSuccess: (state, action) => {
      state.isFetching = true;
      state.error = false;
      state.approvals = action.payload.data;
    },
    ApprovalsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
    }
  }
});

export const { ApprovalsFetchStart, ApprovalsFetchSuccess, ApprovalsFetchFailure } = ApprovalsSlice.actions;
export default ApprovalsSlice.reducer;
