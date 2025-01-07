import { axiosInstance } from '../../utils/axiosInstance';
import {
  quotationSubmitStart,
  quotationSubmitSuccess,
  quotationSubmitFailure,
  quotationChargesSubmitStart,
  quotationChargesSubmitSuccess,
  quotationChargesSubmitFailure
} from '../Slices/QuotationSlice';
import {
  POSubmitStart,
  POSubmitSuccess,
  POSubmitFailure,
  AcceptPOStart,
  AcceptPOSuccess,
  AcceptPOFailure,
  poPaymentRequestSubmitStart,
  poPaymentRequestSubmitSuccess,
  poPaymentRequestSubmitFailure
} from '../Slices/POSlice';

import { loginStart, loginSuccess, loginFailure, createUserStart, createUserSuccess, createUserFailure } from '../Slices/AuthSlice';
import { vendorsCreateStart, vendorsCreateSuccess, vendorsCreateFailure } from '../Slices/VendorSlice';
import { itemCreateFailure, itemCreateStart, itemCreateSuccess } from '../Slices/ItemSlice';
import { rfqsSubmitStart, rfqsSubmitSuccess, rfqsSubmitFailure } from '../Slices/RFQSlice';

let token = localStorage.getItem('token');

//Auth API's
export const Login = async (dispatch, formdata) => {
  dispatch(loginStart());
  try {
    const { data } = await axiosInstance.post('/api/user/login', formdata);
    console.log(data);
    localStorage.setItem('token', data.servicetoken);
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error?.response?.data?.success));
  }
};

export const Signup = async (dispatch, formdata) => {
  dispatch(createUserStart());
  try {
    const { data } = await axiosInstance.post('/api/user/user', formdata);
    dispatch(createUserSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(createUserFailure());
  }
};
//Auth API's ends

//Create Quotation APi start
export const QuotationSubmit = async (dispatch, formdata) => {
  dispatch(quotationSubmitStart());
  try {
    const { data } = await axiosInstance.post('/api/quotation/quote', formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(quotationSubmitSuccess(data));
  } catch (error) {
    dispatch(quotationSubmitFailure(error?.response?.data?.success));
  }
};
//Create Quotation APi ends

//Create Quotation Charges APi start
export const QuotationChargesSubmit = async (dispatch, formdata) => {
  dispatch(quotationChargesSubmitStart());
  try {
    const { data } = await axiosInstance.post('/api/quotation/additionalcost', formdata);
    dispatch(quotationChargesSubmitSuccess(data));
  } catch (error) {
    dispatch(quotationChargesSubmitFailure(error?.response?.data?.success));
  }
};
//Create Quotation Charges APi ends

// Accept Purchase Order starts
export const AcceptPOSubmit = async (dispatch, formdata) => {
  dispatch(AcceptPOStart());
  try {
    const headers = {
      'Content-Type': 'multipart/form-data' // This header is set automatically by FormData in most cases
    };

    const { data } = await axiosInstance.post('/api/po/accept', formdata, { headers });
    dispatch(AcceptPOSuccess(data));
  } catch (error) {
    dispatch(AcceptPOFailure(error?.response?.data?.success));
  }
};
//Accept Purchase Order ends

//Create Purchase Order APi start
export const POSubmit = async (dispatch, formdata) => {
  dispatch(POSubmitStart());
  try {
    const { data } = await axiosInstance.post('/api/po/create', formdata, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(POSubmitSuccess(data));
  } catch (error) {
    dispatch(POSubmitFailure(error?.response?.data?.success));
  }
};
//Create  Purchase Order APi ends

//Master APis vendor
export const CreateVendor = async (dispatch, formData) => {
  console.log('data', formData);
  dispatch(vendorsCreateStart());
  try {
    const { data } = await axiosInstance.post('/api/vendor/vendor', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(vendorsCreateSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(vendorsCreateFailure());
  }
};
//Master apis ends

//Master Item Api
export const CreateItem = async (dispatch, formData) => {
  dispatch(itemCreateStart());
  try {
    const { data } = await axiosInstance.post('/api/item/item', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(itemCreateSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(itemCreateFailure());
  }
};
//Master Item Api end

//Master User Api

export const CreateUser = async (dispatch, formData) => {
  dispatch(createUserStart());
  try {
    const { data } = await axiosInstance.post('/api/item/item', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    dispatch(createUserSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(createUserFailure());
  }
};

//Master User APi ends

//RFQ API's

export const SubmitRFQ = async (dispatch, formdata) => {
  dispatch(rfqsSubmitStart());
  try {
    const { data } = await axiosInstance.post('/api/rfq/rfq', formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    dispatch(rfqsSubmitSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(rfqsSubmitFailure());
  }
};

//RFQ API's ends

//Create Purchase Order APi start
export const poPaymentRequest = async (dispatch, formdata) => {
  dispatch(poPaymentRequestSubmitStart());
  try {
    const { data } = await axiosInstance.post('/api/paymentrequests', formdata);
    dispatch(poPaymentRequestSubmitSuccess(data));
  } catch (error) {
    dispatch(poPaymentRequestSubmitFailure(error?.response?.data?.success));
  }
};
//Create  Purchase Order APi ends
