import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formValues: {
        vertical: '',
        company: '',
        division: '',
        lprCategory: '',
        deliveryTime: '',
        requestedByDept: '',
        requestedBy: '',
        lprDate: '',
        additionalRemarks: '',
        noMinQuote: '',
        quotationEmailAlert: '',
        deliveryType: '',
    },
};

const lprSlice = createSlice({
    name: 'lpr',
    initialState,
    reducers: {
        setFormValues: (state, action) => {
            state.formValues = action.payload;
        },
        resetFormValues: (state) => {
            state.formValues = initialState.formValues;
        },
    },
});

export const { setFormValues, resetFormValues } = lprSlice.actions;
export default lprSlice.reducer;