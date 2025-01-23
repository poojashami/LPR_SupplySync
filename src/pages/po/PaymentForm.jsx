import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MenuItem, Button, Box, Typography, Grid, IconButton, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import MainCard from 'components/MainCard';
import FieldPadding from 'components/FieldPadding';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
const VisuallyHiddenInput = styled('input')({
  display: 'none'
});
const PaymentForm = () => {
  const [fileName, setFileName] = useState('');
  const [showTableHeading, setShowTableHeading] = useState({
    viewPaymentDetails: true,
    vendorDetail: true,
    paymentInfo: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const validationSchema = Yup.object().shape({
    amount: Yup.number().typeError('Amount must be a number').required('Amount is required').positive('Amount must be greater than zero'),
    method: Yup.string().required('Payment method is required'),
    date: Yup.date().required('Date is required').typeError('Invalid date format')
  });

  // Initial Values
  const initialValues = {
    amount: '',
    method: '',
    date: ''
  };

  // Form Submission
  const handleSubmit = (values, { resetForm }) => {
    console.log('Form Values:', values);
    // Add your API call or logic here
    resetForm();
  };
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('itemImageUrl', file);
    }
  };
  const oprData = [
    { label: 'Vendor', value: 'Tech Corp' },
    { label: 'Company', value: 'Global Electronics Ltd.' },
    { label: 'Department', value: 'Procurement' },
    { label: 'Ship Mode', value: 'Air Freight' },
    { label: 'Buying House', value: 'Global Buying Solutions' },
    { label: 'Unit Justification', value: 'Required for assembly line' },
    { label: 'Procurement Justification', value: 'Best price and lead time' },
    { label: 'Total Cost', value: '15,000 USD' }
  ];
  return (
    <>
      <Table>{renderTableHeader('viewPaymentDetails', 'Basic Detail')}</Table>
      {showTableHeading.viewPaymentDetails && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {oprData
              .reduce((acc, item, index) => {
                if (index % 4 === 0) acc.push([]);
                acc[acc.length - 1].push(item);
                return acc;
              }, [])
              .map((row, rowIndex) => (
                <Grid container item xs={12} key={rowIndex} spacing={2}>
                  {row.map((item, itemIndex) => (
                    <Grid item xs={3} key={itemIndex}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                          {item.label}:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ))}
          </Grid>
        </Grid>
      )}
      <Table>{renderTableHeader('vendorDetail', 'Vendor Detail')}</Table>
      {showTableHeading.vendorDetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {oprData
              .reduce((acc, item, index) => {
                if (index % 4 === 0) acc.push([]);
                acc[acc.length - 1].push(item);
                return acc;
              }, [])
              .map((row, rowIndex) => (
                <Grid container item xs={12} key={rowIndex} spacing={2}>
                  {row.map((item, itemIndex) => (
                    <Grid item xs={3} key={itemIndex}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                          {item.label}:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ))}
          </Grid>
        </Grid>
      )}
      <Table sx={{ marginBottom: '10px' }}>{renderTableHeader('paymentInfo', 'Payment Info')}</Table>
      {showTableHeading.paymentInfo && (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Amount<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="amount" as={FieldPadding} fullWidth variant="outlined" size="small" />
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Payment Processed through Bank Name<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="method" as={SelectFieldPadding} fullWidth select variant="outlined">
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="PayPal">PayPal</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </Field>
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Payment Date<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="date" as={FieldPadding} type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={2}></Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Amount Payable<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="amount" as={FieldPadding} fullWidth variant="outlined" size="small" />
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Amount Requested<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="amount" as={FieldPadding} fullWidth variant="outlined" size="small" />
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Amount Paid<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="amount" as={FieldPadding} fullWidth variant="outlined" size="small" />
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Bank Charges<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="amount" as={FieldPadding} fullWidth variant="outlined" size="small" />
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Value Date<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="date" as={FieldPadding} type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Payment Transaction Ref No<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field name="amount" as={FieldPadding} fullWidth variant="outlined" size="small" />
                  <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Payment Telex<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
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
                        size={'small'}
                      />
                    </Button>
                  </div>
                  {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                  <ErrorMessage name="itemImageUrl" component="div" style={errorMessageStyle} />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="end">
                <Button type="submit" variant="contained" color="primary" size="small" disabled={isSubmitting}>
                  Submit
                </Button>
                <Button type="reset" variant="contained" size="small" className="btn btn-danger" style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default PaymentForm;
