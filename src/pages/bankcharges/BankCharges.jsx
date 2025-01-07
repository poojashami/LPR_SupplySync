// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import FieldPadding from 'components/FieldPadding';
import CustomTypography from 'components/CustomTypography';

export default function BankCharges({ onClose, onFormSubmit, formMode }) {
  const [selectedApplicableFor, setSelectedApplicableFor] = useState('');
  const dispatch = useDispatch();

  const {
    itemCategories,
    itemUOMs,
    nafdacs,
    crias,
    nafdacNames,
    category: group,
    subCategory,
    superCategory
  } = useSelector((state) => state.itemMaster);
  const { vendors } = useSelector((state) => state.vendorMaster);
  const [initialValues, setInitialValues] = useState({
    searchBy: '',
    chargesPaid: '',
    applicableFor: '',
    chargeHead: '',
    currency: '',
    amount: '',
    vatAmount: ''
  });
  const [showTableHeading, setShowTableHeading] = useState({
    detailPage: true,
    formPage: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState();
  const [fileName, setFileName] = useState(null);

  console.log('uom data', itemUOMs);
  const validationSchema = Yup.object({
    searchBy: Yup.string().required('Search By is required'),
    chargesPaid: Yup.string().required('Charges Paid is required'), // Adjust based on actual data type
    applicableFor: Yup.string().required('Applicable For is required'),
    chargeHead: Yup.string().required('Charge Head is required'),
    currency: Yup.string().required('Currency is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    vatAmount: Yup.number().required('VAT Amount is required').min(0, 'VAT Amount cannot be negative')
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
        <TableCell sx={{ padding: 0 }} colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <CustomTypography variant="h7" fontWeight={600}>
              {sectionLabel}
            </CustomTypography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

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

  return (
    <MainCard title={'Bank Charges - BH'}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, resetForm, setFieldValue }) => (
          <Form>
            <Table>
              {renderTableHeader('formPage', 'Charges Form')}
              {showTableHeading.formPage && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
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

                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            {values.searchBy ? `${values.searchBy}` : 'Select a value'} <ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Autocomplete
                            options={chargesPaidData[values.searchBy] || []}
                            freeSolo
                            sx={{
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
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Applicable For<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={SelectFieldPadding}
                            name="applicableFor"
                            variant="outlined"
                            value={values.applicableFor}
                            onChange={(event) => {
                              handleSelectChange(event); // Update the state
                              values.applicableFor = event.target.value; // Update Formik value
                            }}
                            fullWidth
                          >
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
                        <Grid item xs={12} sm={2}>
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
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Currency<ValidationStar>*</ValidationStar>
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
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Amount<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="amount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="amount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Vat Amount<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="vatAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vatAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
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
      {selectedApplicableFor === 'PO Payment' && (
        <Table>
          {renderTableHeader('detailPage', 'PO Detail')}
          {showTableHeading.detailPage && (
            <TableBody>
              <TableRow>
                <TableCell>
                  <CustomTypography variant="subtitle1">Ref No:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Amount:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Bank Payment Done:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">PO Number:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <CustomTypography variant="subtitle1">PO Date:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'12-03-2024'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Vendor Name:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'Indicorp'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Vendor Bank:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'Vendor Bank'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Vendor Location:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'Delhi'}</CustomTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <CustomTypography variant="subtitle1">PO Amount Total:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'30000'}</CustomTypography>
                </TableCell>
                {/* <TableCell>
                <CustomTypography variant="subtitle1">Shipment Mode:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Type:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
              </TableRow>
              {/* <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">OPR Category:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Additional Remark:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
            </TableRow> */}
            </TableBody>
          )}
        </Table>
      )}
      {selectedApplicableFor === 'FORM M Opening' && (
        <Table>
          {renderTableHeader('detailPage', 'Form M Detail')}
          {showTableHeading.detailPage && (
            <TableBody>
              <TableRow>
                <TableCell>
                  <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'12-03-2024'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'Indicorp'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">BA No:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'Vendor Bank'}</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography variant="subtitle1">Form M Opening Bank:</CustomTypography>
                </TableCell>
                <TableCell>
                  <CustomTypography>{'Delhi'}</CustomTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                {/* <TableCell>
                <CustomTypography variant="subtitle1">PO Amount Total:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell> */}
                {/* <TableCell>
                <CustomTypography variant="subtitle1">Shipment Mode:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Type:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
              </TableRow>
            </TableBody>
          )}
        </Table>
      )}
      <Table>
        {renderTableHeader('detailPage', 'LC Opening Detail')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Opening Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">LC No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              {/* <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('detailPage', 'LC Receiving Detail')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Advising Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">LC No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              {/* <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('detailPage', 'Payment Processing Charges against PFI')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M Opening Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Payment Made Through bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              {/* <TableCell>
                <CustomTypography variant="subtitle1">LC Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
              {/* <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('detailPage', 'Payment Processing Charges against CI')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M Opening Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Payment Made Through Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('detailPage', 'Payment Receiving Charges against PFI')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M Opening Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Payment Received Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              {/* <TableCell>
                <CustomTypography variant="subtitle1">LC Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
              {/* <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('detailPage', 'Payment Receiving Charges against CI')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M Opening Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">CI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Payment Received Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('detailPage', 'Paar Processing')}
        {showTableHeading.detailPage && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M Opening Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">CI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">CI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Payment Received Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </MainCard>
  );
}
