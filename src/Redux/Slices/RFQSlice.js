import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const rfqSlice = createSlice({
  name: 'rfq',
  initialState: {
    rfq: {},
    rfqs: [],
    itemCount: 0,
    selectedRows: [],
    rfqItemList: [],
    rfqItemsViaId: [],
    rfqDocList: [],
    selectedRFQ: {},
    selectedRFQDetails: {},
    rfqsItems: [],
    PortDestination: [],
    rfqsVendors: [],
    isFetching: false,
    error: false
  },
  reducers: {
    rfqsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rfqsFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.rfqs = action.payload.data;
    },
    rfqsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    rfqsDetailsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rfqsDetailsFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.selectedRFQDetails = action.payload.data[0];
    },
    rfqsDetailsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    rfqsSubmitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rfqsSubmitSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    rfqsSubmitFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at RFQ`);
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
      state.itemCount = action.payload.length;
    },
    rfqsByIdFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rfqsByIdFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.rfqItemsViaId = action.payload.data;
    },
    rfqsByIdFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at RFQ`);
    },
    addToRfq: (state, action) => {
      state.rfqItemList = [...state.rfqItemList, ...action.payload];
    },
    clearRfqList: (state) => {
      state.rfqItemList = [];
    },
    selectRFQ: (state, action) => {
      state.selectedRFQ = action.payload;
    },
    setRfqDocList: (state, action) => {
      state.rfqDocList = action.payload.data;
    },
    rfqsItemsByRfqIdFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rfqsItemsByRfqIdFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.rfqsItems = action.payload.data;
    },
    rfqsItemsByRfqIdFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at RFQ Items`);
    },
    rfqsVendorsByRfqIdFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rfqsVendorsByRfqIdFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.rfqsVendors = action.payload.data;
    },
    rfqsVendorsByRfqIdFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at RFQ Vendors`);
    },
    portDestinationFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    portDestinationFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.PortDestination = action.payload.data;
    },
    portDestinationFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at RFQ Vendors`);
    }
  }
});


export const {
  setSelectedRows,
  clearRfqList,
  addToRfq,
  selectRFQ,
  rfqsFetchStart,
  rfqsFetchSuccess,
  rfqsFetchFailure,
  rfqsDetailsFetchStart,
  rfqsDetailsFetchSuccess,
  rfqsDetailsFetchFailure,
  setRfqDocList,
  rfqsByIdFetchStart,
  rfqsByIdFetchSuccess,
  rfqsByIdFetchFailure,
  rfqsSubmitStart,
  rfqsSubmitSuccess,
  rfqsSubmitFailure,
  rfqsItemsByRfqIdFetchStart,
  rfqsItemsByRfqIdFetchSuccess,
  rfqsItemsByRfqIdFetchFailure,
  rfqsVendorsByRfqIdFetchStart,
  rfqsVendorsByRfqIdFetchSuccess,
  rfqsVendorsByRfqIdFetchFailure,
  portDestinationFetchStart,
  portDestinationFetchSuccess,
  portDestinationFetchFailure
} = rfqSlice.actions;

export default rfqSlice.reducer;
