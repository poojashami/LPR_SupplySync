import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import {
  Grid,
  Tab,
  Tabs,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  IconButton,
  Button,
  TableHead,
  Table,
  MenuItem,
  Autocomplete
} from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import { FieldArray, Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FieldPadding from 'components/FieldPadding';
import { DatePicker } from '@mui/x-date-pickers';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomTypography from 'components/CustomTypography';
import SelectFieldPadding from 'components/selectFieldPadding';

export default function UnitPage({ onClose, onFormSubmit, formMode }) {
  const [showTableHeading, setShowTableHeading] = useState({
    viewItem: true,
    heading1: true,
    heading2: true,
    heading3: true
  });
  const [initialValues, setInitialValues] = useState({
    searchBy: '',
    chargesPaid: '',
    applicableFor: '',
    chargeHead: '',
    currency: '',
    amount: '',
    vatAmount: ''
  });
  const validationSchema = Yup.object({
    searchBy: Yup.string().required('Search By is required'),
    chargesPaid: Yup.string().required('Charges Paid is required'), // Adjust based on actual data type
    applicableFor: Yup.string().required('Applicable For is required'),
    chargeHead: Yup.string().required('Charge Head is required'),
    currency: Yup.string().required('Currency is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    vatAmount: Yup.number().required('VAT Amount is required').min(0, 'VAT Amount cannot be negative')
  });
  const [value, setValue] = useState(0);
  const [assessmentFile, setAssessmentFile] = useState(null);
  const [sadFile, setSadFile] = useState(null);
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={500}>
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
  const shipmentData = [
    { label: 'Ref No', value: 'REF3876' },
    { label: 'Amount', value: '20000' },
    { label: 'Bank Payment Done', value: '20000' },
    { label: 'PO Number', value: 'PO7386' },
    { label: 'PO Date', value: '12-03-2024' },
    { label: 'Vendor Name', value: 'ANB' },
    { label: 'Vendor Bank', value: 'Bank of Baroda' },
    { label: 'Vendor Location', value: 'Delhi' },
    { label: 'PO Total', value: '20000' }
  ];
  const handleDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSubmitForm1 = async (values, actions) => {
    console.log('Form 1 values:', values);
    try {
      const { data } = await axiosInstance.post(
        '/api/shipping/expenses',
        { ...values, sadFile },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSadFile(null);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }

    if (onSuccessfulSubmit) {
      onSuccessfulSubmit(values);
    }
    actions.resetForm();
    onClose();
  };

  // Hardcoded data for searchBy
  const searchByOptions = [
    { value: 'PFI No', label: 'PFI No' },
    { value: 'CI No', label: 'CI No' },
    { value: 'PO No', label: 'PO No' },
    { value: 'Form M No', label: 'Form M No' },
    { value: 'LC No', label: 'LC No' },
    { value: 'Vendor Name', label: 'Vendor Name' }
  ];

  // Hardcoded data for chargesPaid based on searchBy
  const chargesPaidData = {
    'PFI No': [
      { pfi_id: 3, pfi_num: 'PFI-102' },
      { pfi_id: 4, pfi_num: 'PFI-105' }
    ],
    'CI No': [
      { pfi_id: 1, pfi_num: 'CI-200' },
      { pfi_id: 2, pfi_num: 'CI-201' }
    ],
    'PO No': [
      { pfi_id: 5, pfi_num: 'PO-300' },
      { pfi_id: 6, pfi_num: 'PO-301' }
    ],
    'Form M No': [
      { pfi_id: 7, pfi_num: 'FormM-400' },
      { pfi_id: 8, pfi_num: 'FormM-401' }
    ],
    'LC No': [
      { pfi_id: 9, pfi_num: 'LC-500' },
      { pfi_id: 10, pfi_num: 'LC-501' }
    ],
    'Vendor Name': [
      { pfi_id: 11, pfi_num: 'Vendor-A' },
      { pfi_id: 12, pfi_num: 'Vendor-B' }
    ]
  };
  const chargeHeadOptions = [
    'Payment Processing Commission',
    'Swift / Telex Ch',
    'LC Advising Ch',
    'LC Payment Ch',
    'Documentation Handling Ch',
    'Courier Ch',
    'FORM M Opening Ch',
    'PAAR Issuing Ch',
    'LC Opening Commission Ch',
    'Pre Negotiation Ch',
    'Post Negotiation Ch',
    'LC Confirmation Ch',
    'LC Amendment Ch',
    'LC Discrepancy Ch',
    'FORM M Amendment Ch',
    'LC Cancellation Ch',
    'FORM M Cancellation Ch'
  ];
  const applicableForOptions = [
    'PO Payment',
    'FORM M Opening',
    'LC Opening',
    'LC Receiving',
    'Payment Processing against PFI',
    'Payment Processing against CI',
    'Receipt of Payment against PFI',
    'Receipt of Payment against CI',
    'PAAR Processing'
  ];
  const currencyOptions = ['NG', 'INR', 'USD', 'EURO', 'GBP'];
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    // Append each form value to FormData
    formData.append('searchBy', values.searchBy);
    formData.append('chargesPaid', values.chargesPaid);

    // Log each form field value to the console
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setSubmitting(false);
  };
  return (
    <MainCard title="Bank Charges - PH">
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, resetForm, setFieldValue }) => (
                <Form>
                  <Table sx={{ margin: 0, padding: 0 }}>
                    {renderTableHeader('heading1', 'Bank Charges Form')}
                    {showTableHeading.heading1 && (
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} paddingTop={'20px !important'}>
                          <CustomTypography>
                            Search By<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={SelectFieldPadding}
                            name="searchBy"
                            variant="outlined"
                            value={values.searchBy}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setFieldValue('searchBy', selectedValue);
                              setFieldValue('chargesPaid', '');
                            }}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {searchByOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="searchBy" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={4} paddingTop={'20px !important'}>
                          <CustomTypography>
                            Charges Paid<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Autocomplete
                            options={chargesPaidData[values.searchBy] || []}
                            freeSolo
                            sx={{
                              // '& .MuiOutlinedInput-root': {
                              //   padding: '1px 4px 1px 4px !important' // Custom padding applied here
                              // },
                              '& input': {
                                padding: '2px 2px !important'
                              }
                            }}
                            getOptionLabel={(option) => option.pfi_num || ''}
                            onChange={(event, value) => setFieldValue('chargesPaid', value?.pfi_id || '')}
                            renderInput={(params) => <FieldPadding {...params} name="chargesPaid" variant="outlined" fullWidth />}
                          />
                          <ErrorMessage name="chargesPaid" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={4} paddingTop={'20px !important'}>
                          <CustomTypography>
                            Applicable<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="applicableFor" variant="outlined" value={values.applicableFor} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {applicableForOptions.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="applicableFor" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={4} paddingTop={'11px !important'}>
                          <CustomTypography>
                            Charge Head<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="chargeHead" variant="outlined" value={values.chargeHead} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {chargeHeadOptions.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="chargeHead" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={4} paddingTop={'11px !important'}>
                          <CustomTypography>
                            Charge Head<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="currency" variant="outlined" value={values.currency} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {currencyOptions.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="currency" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={4} paddingTop={'11px !important'}>
                          <Typography variant="body" fontSize={'12px'}>
                            VAT Number<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="vatAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vatAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    )}
                  </Table>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2, marginTop: 3 }}>
                    <Button size="small" variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => {
                        resetForm();
                        setFieldValue('chargesPaid', '');
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>

          <Grid item xs={12} sm={6} mt={2}>
            <Grid
              container
              spacing={2}
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: '#3f51b5',
                color: 'white',
                padding: '5px',
                fontSize: '12px',
                marginBottom: '15px'
              }}
            >
              View Detail
            </Grid>

            <Grid container spacing={2} sx={{ backgroundColor: '#f5f5f5' }}>
              {shipmentData.map((item, index) => (
                <Grid item xs={12} sm="auto" key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                      {item.label}:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555', fontSize: '12px' }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}
