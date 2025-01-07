import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
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
  IconButton
} from '@mui/material';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import axios from 'axios';
import { getCurrentDate } from '../../utils/constantFunctions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import { axiosInstance } from 'utils/axiosInstance';
const VisuallyHiddenInput = styled('input')({
  display: 'none'
});
const PaymentForm = () => {
  const [fileName, setFileName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [showTableBodies, setShowTableBodies] = useState({
    viewPaymentDetails: true,
    paymentForm: true
  });
  const initialPaymentValues = {
    payment_request_id: 1,
    payment_date: getCurrentDate(),
    payment_amount: '',
    bank_charge: '',
    bank_refenence_no: '',
    to_bank_detail_id: '',
    // paymentToBankAccountNo: '',
    from_bank_detail_id: '',
    // narration: '',
    itemImageUrl: null
  };

  const validationSchema = Yup.object({
    payment_date: Yup.string().required('Required'),
    payment_amount: Yup.number().required('Required'),
    // bank_charge: Yup.number().required('Required'),
    // bank_refenence_no: Yup.string().required('Required'),
    to_bank_detail_id: Yup.string().required('Required'),
    // paymentToBankAccountNo: Yup.string().required('Required'),
    from_bank_detail_id: Yup.string().required('Required')
    // narration: Yup.string().required('Required')
    // itemImageUrl: Yup.string().required('Required')
  });
  // Toggle function to switch the visibility of a specific table body
  const submitPaymentData = (values, setSubmitting, resetForm) => {
    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append('receipt_image', values.itemImageUrl);
    // formData.append('receipt_image_name', values.itemImageUrl.name);
    formData.append('payment_request_id', values.payment_request_id);
    formData.append('payment_date', values.payment_date);
    formData.append('payment_amount', values.payment_amount);
    formData.append('from_bank_detail_id', values.from_bank_detail_id);
    formData.append('to_bank_detail_id', values.to_bank_detail_id);
    formData.append('bank_charge', values.bank_charge);
    formData.append('bank_refenence_no', values.bank_refenence_no);

    // Debugging logs
    console.log('Form values:', values);
    console.log('Data to be sent:', formData);

    axiosInstance
      .post('/api/payment-transactions/', formData, {
        headers: {
          // Authorization: Bearer ${token},
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        console.log('response', response);
        console.log('Data submitted successfully:', response.data);
        setSnackbar({ open: true, message: 'Data submitted successfully!', severity: 'success' });
        resetForm();
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        setSnackbar({ open: true, message: 'Error submitting data', severity: 'error' });
      })
      .finally(() => {
        setSubmitting(false);
      });
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
      <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
        <Table>
          {renderTableHeader('viewPaymentDetails', 'Basic Info')}
          {showTableBodies.viewPaymentDetails && (
            <TableBody>
              <React.Fragment>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Code:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjbdfkjb</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Name:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kdsjkdsbnlk</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      OPO No:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kihdsihd</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      OPO Date:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kihdsihd</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PI No:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>dskjbkjdbs</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PI Date:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kdsbjfbsdj</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Amount To Be Paid:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjsdbajbk</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PO No:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kdjsbjfbdsb</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PO Date:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kdjsnkjbnkj</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PO Payment No:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjdnskjn</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      lagata UK Approval By:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjdnskjn</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Approval Remark:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjsdbajbk</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Approval Time:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjsdbajbk</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Payment Date:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjdnskjn</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Reference:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjsdbajbk</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Amount:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>kjsdbajbk</Typography>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            </TableBody>
          )}
        </Table>
      </TableContainer>
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
            <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: '0' }}>
              <Table>
                {renderTableHeader('paymentForm', 'Second Section')}
                {showTableBodies.paymentForm && (
                  <TableBody>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={6}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Payment Date<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="date" name="payment_date" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="payment_date" component="div" className="error-message" />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Payment Amount<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="number" name="payment_amount" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="payment_amount" component="div" className="error-message" />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">
                              Bank Charges<ValidationStar>*</ValidationStar>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} type="number" name="bank_charge" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="bank_charge" component="div" className="error-message" />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Bank Ref No.</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} name="bank_refenence_no" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="bank_refenence_no" component="div" className="error-message" />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Payment To Bank Name</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} name="to_bank_detail_id" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="to_bank_detail_id" component="div" className="error-message" />
                          </Grid>
                          {/* <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Payment To Bank Account No</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} name="paymentToBankAccountNo" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="paymentToBankAccountNo" component="div" className="error-message" />
                          </Grid> */}
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Payment From Bank Name</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} name="from_bank_detail_id" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="from_bank_detail_id" component="div" className="error-message" />
                          </Grid>
                          {/* <Grid item xs={12} sm={1}>
                            <Typography variant="body1">Narration</Typography>
                          </Grid> */}
                          {/* <Grid item xs={12} sm={2}>
                            <Field as={FieldPadding} name="narration" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="narration" component="div" className="error-message" />
                          </Grid> */}
                          <Grid item xs={12} sm={1}>
                            <Typography variant="body1">File Upload</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <div>
                              <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                                Upload File
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
                              {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                            </div>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
              {showTableBodies.paymentForm && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                  <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
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

      {/* Second Section */}
    </>
  );
};

export default PaymentForm;
