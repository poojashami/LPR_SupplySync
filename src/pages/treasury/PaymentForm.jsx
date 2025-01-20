import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, Typography, Table, TableCell, TableRow, Paper, Box, TableHead, IconButton, MenuItem } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import { errorMessageStyle } from 'components/StyleComponent';
const VisuallyHiddenInput = styled('input')({
  display: 'none'
});

const PaymentForm = () => {
  const [fileName, setFileName] = useState('');
  const [selectedVendorBank, setSelectedVendorBank] = useState([]);
  const [showTableBodies, setShowTableBodies] = useState({
    viewPaymentDetails: false,
    paymentForm: true
  });
  const initialPaymentValues = {
    payment_date: '',
    payment_amount: '',
    bank_charge: '',
    value_date: '',
    milestone: '',
    due_amount: '',
    amount_paid: '',
    bank_reference_no: '',
    from_bank_detail_id: '',
    itemImageUrl: null
  };
  console.log('initialPaymentValues', initialPaymentValues);

  const validationSchema = Yup.object({
    payment_date: Yup.string().required('Required'),
    payment_amount: Yup.number().required('Required'),
    bank_charge: Yup.number().required('Required'),
    value_date: Yup.string().required('Required'),
    bank_reference_no: Yup.string().required('Required'),
    from_bank_detail_id: Yup.string().required('Required')
  });

  const submitPaymentData = async (values, setSubmitting, resetForm) => {
    console.log('clicked');
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
  return (
    <div>
      <Formik
        initialValues={initialPaymentValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          submitPaymentData(values, setSubmitting, resetForm);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Table>{renderTableHeader('paymentForm', 'Payment Info')} </Table>
            {showTableBodies.paymentForm && (
              <>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Vendor Bank Details:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Bank Name:
                      {/* {selectedVendorBank[0]?.bank_name}, Acount No.:{selectedVendorBank[0]?.bank_account_number}, IFSC Code:
                      {selectedVendorBank[0]?.bank_ifsc_code} */}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
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
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Payment Date<ValidationStar>*</ValidationStar>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} type="date" name="payment_date" variant="outlined" fullWidth size="small" />
                    <ErrorMessage name="payment_date" component="div" style={errorMessageStyle} />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Payment MileStone
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} name="milestone" variant="outlined" fullWidth size="small" disabled />
                    <ErrorMessage name="milestone" component="div" style={errorMessageStyle} />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Amount Payable
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} type="number" name="due_amount" variant="outlined" fullWidth size="small" disabled />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Amount Requested<ValidationStar>*</ValidationStar>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} type="number" name="payment_amount" variant="outlined" fullWidth size="small" disabled />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Amount Paid
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} type="number" name="amount_paid" variant="outlined" fullWidth size="small" />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Bank Charges<ValidationStar>*</ValidationStar>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} type="number" name="bank_charge" variant="outlined" fullWidth size="small" />
                    <ErrorMessage name="bank_charge" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Value Date
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} type="date" name="value_date" variant="outlined" fullWidth size="small" />
                    <ErrorMessage name="value_date" component="div" style={errorMessageStyle} />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Payment Transaction Ref No.<ValidationStar>*</ValidationStar>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Field as={FieldPadding} name="bank_reference_no" variant="outlined" fullWidth size="small" />
                    <ErrorMessage name="bank_reference_no" component="div" style={errorMessageStyle} />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Payment Telex<ValidationStar>*</ValidationStar>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div>
                      <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload
                        <VisuallyHiddenInput
                          type="file"
                          size="small"
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
              </>
            )}

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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentForm;
