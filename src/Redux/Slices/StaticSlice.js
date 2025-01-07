import { createSlice } from '@reduxjs/toolkit';

const staticSlice = createSlice({
  name: 'static',
  initialState: {
    address_types: [],
    verticles: [],
    messageopen: false,
    base64String: '',
    compareMode: {},
    type: 'url',
    opr_id: null,
    leadTime: [],
    shipmentMode: null,
    shipmentType: [],
    cont_sizes: [],
    vendor_id: null
  },
  reducers: {
    setAddressTypes: (state, action) => {
      state.address_types = action.payload.data;
    },
    setVerticles: (state, action) => {
      state.verticles = action.payload.data;
    },
    setCompareMode: (state, action) => {
      state.compareMode = action.payload.data;
    },
    setConSizes: (state, action) => {
      state.cont_sizes = action.payload.data;
    },
    messageOpen: (state, action) => {
      console.log(action.payload);
      state.messageopen = true;
      state.base64String = action.payload.url;
      state.type = action.payload.type;
    },
    messageClose: (state) => {
      state.messageopen = false;
      state.base64String = '';
      state.type = '';
    },
    setopr_id: (state, action) => {
      state.opr_id = action.payload;
    },
    set_vendor_id: (state, action) => {
      state.vendor_id = action.payload;
    },
    setopr_deliveryTerm: (state, action) => {
      state.leadTime = action.payload;
    },
    setopr_shipmentType: (state, action) => {
      state.shipmentType = action.payload;
    },
    setopr_shipmentMode: (state, action) => {
      state.shipmentMode = action.payload;
    }
  }
});

export const {
  setopr_shipmentMode,
  setopr_shipmentType,
  setopr_deliveryTerm,
  setCompareMode,
  setopr_id,
  set_vendor_id,
  setAddressTypes,
  setVerticles,
  messageClose,
  messageOpen,
  setConSizes
} = staticSlice.actions;

export default staticSlice.reducer;
