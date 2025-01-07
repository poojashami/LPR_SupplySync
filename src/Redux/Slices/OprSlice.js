import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const oprSlice = createSlice({
  name: 'opr',
  initialState: {
    isFetching: false,
    error: false,
    oprs: [],
    oprDraftData: [],
    opr_ids: [],
    opr: {},
    categories: [],
    oprId: ''
  },
  reducers: {
    getAllOprStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getAllOprSuccess: (state, action) => {
      toast.success('Fetched successfully');
      state.isFetching = false;
      state.error = false;
      state.oprs = action.payload.data;
    },
    getAllOprFailure: (state) => {
      toast.error('An error has occurred!');
      state.isFetching = false;
      state.error = true;
    },
    getAllSuperCategoryStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getAllSuperCategorySuccess: (state, action) => {
      toast.success('Fetched successfully');
      state.isFetching = false;
      state.error = false;
      state.categories = action.payload.data;
    },
    getAllSuperCategoryFailure: (state) => {
      toast.error('An error has occurred!');
      state.isFetching = false;
      state.error = true;
    },
    getDraftOprStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getDraftOprSuccess: (state, action) => {
      toast.success('Fetched successfully');
      state.isFetching = false;
      state.error = false;
      state.oprs = action.payload.data;
    },
    getDraftOprFailure: (state) => {
      toast.error('An error has occurred!');
      state.isFetching = false;
      state.error = true;
    },
    opr_ids_set: (state, action) => {
      state.opr_ids = action.payload.data;
    }
  }
});

export const {
  getAllSuperCategoryStart,
  getAllSuperCategorySuccess,
  getAllSuperCategoryFailure,
  getAllOprStart,
  opr_ids_set,
  getAllOprSuccess,
  getAllOprFailure,
  getDraftOprStart,
  getDraftOprSuccess,
  getDraftOprFailure
} = oprSlice.actions;

export default oprSlice.reducer;
