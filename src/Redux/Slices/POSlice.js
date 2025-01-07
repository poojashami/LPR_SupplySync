import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const POSlice = createSlice({
  name: 'purchaseOrder',
  initialState: {
    isFetching: false,
    error: false,
    purchaseOrder: [],
    itemsList: [],
    ci_list: [],
    single_ci_list: [],
    poForGDN: {},
    poForGRN: {}
  },
  reducers: {
    POSubmitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    POSubmitSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    POSubmitFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Purchase Order`);
    },

    // --------------------------

    CIFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    CIFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.ci_list = action.payload.data;
    },
    CIFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Fetching CI`);
    },

    //-----------------------------

    SingleCIFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    SingleCIFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.single_ci_list = action.payload.data;
    },
    SingleCIFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Fetching CI`);
    },

    // ------------------------

    setPO: (state, action) => {
      state.poForGDN = action.payload;
    },
    setPOGRN: (state, action) => {
      state.poForGRN = action.payload;
    },
    POItemsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    POItemsFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.itemsList = action.payload.data;
    },
    POItemsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Purchase Order`);
    },
    purchaseOrderFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    purchaseOrderFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.purchaseOrder = action.payload.data;
    },
    purchaseOrderFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Purchase Order`);
    },
    AcceptPOStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    AcceptPOSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    AcceptPOFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Request for Payment`);
    },
    poPaymentRequestSubmitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    poPaymentRequestSubmitSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    poPaymentRequestSubmitFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Request for Paymentr`);
    }
  }
});

export const {
  POItemsFetchStart,
  POItemsFetchSuccess,
  POItemsFetchFailure,
  POSubmitStart,
  POSubmitSuccess,
  POSubmitFailure,

  CIFetchStart,
  CIFetchSuccess,
  CIFetchFailure,

  SingleCIFetchStart,
  SingleCIFetchSuccess,
  SingleCIFetchFailure,

  purchaseOrderFetchStart,
  purchaseOrderFetchSuccess,
  purchaseOrderFetchFailure,
  AcceptPOStart,
  AcceptPOSuccess,
  AcceptPOFailure,
  setPO,
  setPOGRN,
  poPaymentRequestSubmitStart,
  poPaymentRequestSubmitSuccess,
  poPaymentRequestSubmitFailure
} = POSlice.actions;
export default POSlice.reducer;
