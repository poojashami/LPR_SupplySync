import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const quotationSlice = createSlice({
  name: 'quotation',
  initialState: {
    isFetching: false,
    error: false,
    quotations: [],
    quotationItem: [],
    quoCharges: [],
    quotationsByRFQ: [],
    quoPackagingType: []
  },
  reducers: {
    quotationFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    quotationFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.quotations = action.payload.data;
    },
    quotationFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at quotation`);
    },
    quotationByRFQFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    quotationByRFQFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.quotationsByRFQ = action.payload.data;
    },
    quotationByRFQFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at quotation`);
    },
    quotationSubmitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    quotationSubmitSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
      // state.quotationNumber = action.payload.data;
    },
    quotationSubmitFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at quotation`);
    },
    quotationChargesSubmitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    quotationChargesSubmitSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    quotationChargesSubmitFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at quotation`);
    },
    quotationItemFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    quotationItemFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.quotationItem = action.payload.data;
    },
    quotationItemFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },
    quotationChargesFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    quotationChargesFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.quoCharges = action.payload.data;
    },
    quotationChargesFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Fetch Quotation Charges `);
    },
    packagingTypeFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    packagingTypeFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.quoPackagingType = action.payload.data;
    },
    packagingTypeFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Fetch Quotation Packaging Type `);
    }
  }
});

export const {
  quotationFetchStart,
  quotationFetchSuccess,
  quotationFetchFailure,
  quotationByRFQFetchStart,
  quotationByRFQFetchSuccess,
  quotationByRFQFetchFailure,
  quotationSubmitStart,
  quotationSubmitSuccess,
  quotationSubmitFailure,
  quotationChargesSubmitStart,
  quotationChargesSubmitSuccess,
  quotationChargesSubmitFailure,
  quotationItemFetchStart,
  quotationItemFetchSuccess,
  quotationItemFetchFailure,
  quotationChargesFetchStart,
  quotationChargesFetchSuccess,
  quotationChargesFetchFailure,
  packagingTypeFetchStart,
  packagingTypeFetchSuccess,
  packagingTypeFetchFailure
} = quotationSlice.actions;
export default quotationSlice.reducer;
