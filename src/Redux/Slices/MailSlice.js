import { createSlice } from '@reduxjs/toolkit';
// import { toast } from 'react-toastify';

const mailSlice = createSlice({
  name: 'mail',
  initialState: {
    isFetching: false,
    error: false,
    mailData: {},
    attachment: null
  },
  reducers: {
    setMailData: (state, action) => {
      state.mailData = action.payload.data;
    },
    emptyMailData: (state) => {
      state.mailData = {};
    }
  }
});

export const { setMailData, emptyMailData } = mailSlice.actions;

export default mailSlice.reducer;
