import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Snackbar,
  Alert,
  TableHead,
  IconButton,
  MenuItem
} from '@mui/material';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { getCurrentDate } from '../../utils/constantFunctions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { axiosInstance } from 'utils/axiosInstance';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import { errorMessageStyle } from 'components/StyleComponent';
import { toast } from 'react-toastify';
import PO_Data from 'components/BasicDataComponent/PO_Data';
const VisuallyHiddenInput = styled('input')({
  display: 'none'
});
const PaymentForm = ({ onClose, poData, onSuccessfulSubmit, paymentRequestData }) => {
  console.log('poData', poData);
  const [fileName, setFileName] = useState('');
  const [bank_list, setBankList] = useState([]);
  const [selectedVendorBank, setSelectedVendorBank] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const getVendorData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/po/vendor', {
        params: {
          po_id: poData.po_id
        }
      });
      setVendorData(data[0]);
      console.log('data2', data);
      setBankList(data[0]?.VendorsMaster?.VendorsBanksDetailsMasters);
      setSelectedVendorBank(
        data[0]?.VendorsMaster?.VendorsBanksDetailsMasters?.filter((item) => item.bank_type_id === poData?.all_data?.bank_type_id)
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log('abc', poData);
    getVendorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showTableBodies, setShowTableBodies] = useState({
    viewPaymentDetails: false,
    paymentForm: true
  });
  const initialPaymentValues = {
    // payment_request_id: poData.id,
    payment_date: '',
    payment_amount: poData?.advice_amount,
    bank_charge: '',
    value_date: '',
    milestone: `${poData?.payment_milestone?.percentage}%, ${poData?.payment_milestone?.milestone}`,
    due_amount: poData?.all_data?.amount_payment_term,
    amount_paid: '',
    bank_reference_no: '',
    // to_bank_detail_id: '',
    from_bank_detail_id: '',
    itemImageUrl: null
    // doc_type: poData?.status >= 1 ? poData?.doc_type : 'f_po',
    // po_id: poData?.id
  };
  console.log('initialPaymentValues', initialPaymentValues);

  const validationSchema = Yup.object({
    payment_date: Yup.string().required('Required'),
    payment_amount: Yup.number().required('Required'),
    bank_charge: Yup.number().required('Required'),
    value_date: Yup.string().required('Required'),
    bank_reference_no: Yup.string().required('Required'),
    // to_bank_detail_id: Yup.string().required('Required'),
    from_bank_detail_id: Yup.string().required('Required')
    // itemImageUrl: Yup.string().required('Required')
  });

  const submitPaymentData = async (values, setSubmitting, resetForm) => {
    console.log('clicked');
    const formData = new FormData();
    formData.append('payment_request_id', poData.id);
    formData.append('doc_type', poData?.status >= 1 ? poData?.doc_type : 'f_po');
    formData.append('doc_id', poData.po_id);
    formData.append('receipt_image', values.itemImageUrl);
    formData.append('payment_date', values.payment_date);
    formData.append('value_date', values.value_date);
    formData.append('payment_amount', values.payment_amount);
    formData.append('from_bank_detail_id', values.from_bank_detail_id);
    formData.append('to_bank_detail_id', 2);
    formData.append('bank_charge', values.bank_charge);
    formData.append('bank_reference_no', values.bank_reference_no);
    formData.append('po_id', poData.po_id);
    formData.append('payment_milestone_id', poData?.payment_milestone?.payment_milestone_id);

    try {
      const response = await axiosInstance.post('/api/payment/transaction', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Data submitted successfully:', response.data);
      resetForm();
      paymentRequestData();
      if (onSuccessfulSubmit) {
        onSuccessfulSubmit(values);
      }
      setSnackbar({ open: true, message: 'Payment Successfully', severity: 'success' });
    } catch (error) {
      console.error('Error submitting data:', error);
      setSnackbar({ open: true, message: 'Error submitting payment', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton aria-label="expand row" size="small" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('itemImageUrl', file);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <PO_Data po_id={poData?.po_id} />
      <Formik
        initialValues={initialPaymentValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          submitPaymentData(values, setSubmitting, resetForm);
        }}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form>
            <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
              <Table>
                {renderTableHeader('paymentForm', 'Payment Info')}
                {showTableBodies.paymentForm && (
                  <TableBody>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={6}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={2}>
                            <Typography variant="body1">
                              <b>Vendor Bank Details:</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              {' '}
                              Bank Name: {selectedVendorBank[0]?.bank_name}, Acount No.:{selectedVendorBank[0]?.bank_account_number}, IFSC
                              Code:{selectedVendorBank[0]?.bank_ifsc_code}
                            </Typography>
                          </Grid>

                          {/* <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Vendor's Bank<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid> */}
                          {/* <Grid item xs={12} sm={2}>
                            <Field
                              as={SelectFieldPadding}
                              name="to_bank_detail_id"
                              variant="outlined"
                              value={values.to_bank_detail_id}
                              fullWidth
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                console.log(
                                  'Selected bank ID:',
                                  bank_list?.filter((item) => item.bank_type_id)
                                ); // Log the selected value
                                setSelectedVendorBank(bank_list?.filter((item) => item.bank_type_id));
                                setFieldValue('to_bank_detail_id', selectedValue); // Update Formik state
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {bank_list?.map((item, index) => (
                                <MenuItem value={item?.bank_type_id} key={index}>
                                  {item?.bank_name}{' '}
                                </MenuItem>
                              ))}
                            </Field>
                            <ErrorMessage name="to_bank_detail_id" component="div" style={errorMessageStyle} />
                          </Grid> */}
                          <Grid item xs={12} sm={2}>
                            <Typography variant="body1">
                              Payment Processed through Bank Name<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field
                              as={SelectFieldPadding}
                              name="from_bank_detail_id"
                              variant="outlined"
                              value={values.from_bank_detail_id}
                              fullWidth
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="1">BOB </MenuItem>
                              <MenuItem value="0">HDFC</MenuItem>
                            </Field>
                            <ErrorMessage name="from_bank_detail_id" component="div" style={errorMessageStyle} />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Payment Date<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="date" name="payment_date" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="payment_date" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Payment MileStone</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field
                              as={FieldPadding}
                              // value={`${poData?.payment_milestone?.percentage}%, ${poData?.payment_milestone?.milestone} `}
                              name="milestone"
                              variant="outlined"
                              fullWidth
                              size="small"
                              disabled
                            />
                            <ErrorMessage name="milestone" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1"> Amount Payable</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="number" name="due_amount" variant="outlined" fullWidth size="small" disabled />
                          </Grid>

                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1"> Amount Paid</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="number" name="amount_paid" variant="outlined" fullWidth size="small"  />
                          </Grid>

                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Amount Requested<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field
                              as={FieldPadding}
                              type="number"
                              name="payment_amount"
                              variant="outlined"
                              fullWidth
                              size="small"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Bank Charges<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="number" name="bank_charge" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="bank_charge" component="div" style={errorMessageStyle} />
                          </Grid>

                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Value Date</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="date" name="value_date" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="value_date" component="div" style={errorMessageStyle} />
                          </Grid>

                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Payment Transaction Ref No.<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} name="bank_reference_no" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="bank_reference_no" component="div" style={errorMessageStyle} />
                          </Grid>

                          {/* <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Vendor's Bank<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field
                              as={SelectFieldPadding}
                              name="to_bank_detail_id"
                              variant="outlined"
                              value={values.to_bank_detail_id}
                              fullWidth
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                console.log(
                                  'Selected bank ID:',
                                  bank_list?.filter((item) => item.bank_type_id)
                                ); // Log the selected value
                                setSelectedVendorBank(bank_list?.filter((item) => item.bank_type_id));
                                setFieldValue('to_bank_detail_id', selectedValue); // Update Formik state
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {bank_list?.map((item, index) => (
                                <MenuItem value={item?.bank_type_id} key={index}>
                                  {item?.bank_name}{' '}
                                </MenuItem>
                              ))}
                            </Field>
                            <ErrorMessage name="to_bank_detail_id" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Payment Processed through Bank Name<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field
                              as={SelectFieldPadding}
                              name="from_bank_detail_id"
                              variant="outlined"
                              value={values.from_bank_detail_id}
                              fullWidth
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="1">BOB </MenuItem>
                              <MenuItem value="0">HDFC</MenuItem>
                            </Field>
                            <ErrorMessage name="from_bank_detail_id" component="div" style={errorMessageStyle} />
                          </Grid> */}
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Payment Telex<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <div>
                              <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                                Upload
                                <VisuallyHiddenInput
                                  type="file"
                                  name="receipt_image"
                                  id="itemImageUrl"
                                  onChange={(e) => {
                                    handleFileChange(e, setFieldValue);
                                    setFileName(e.target.files[0].name);
                                  }}
                                />
                              </Button>
                            </div>
                            {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                            <ErrorMessage name="itemImageUrl" component="div" style={errorMessageStyle} />
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
              {showTableBodies.paymentForm && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                  <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="contained" size="small" color="primary" type="submit">
                    Submit
                  </Button>
                </Box>
              )}
            </TableContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PaymentForm;
