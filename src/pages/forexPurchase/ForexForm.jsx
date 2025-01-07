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
  Typography,
  TableContainer,
  Paper
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

export default function ForexForm({ onClose, onFormSubmit, formMode }) {
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
    bidPurchase: '',
    purchaseDate: '',
    currency: '',
    amount_purchased: '',
    description: '',
    formmNo: '',
    lcNo: '',
    purchaseNo: '',
    bank: '',
    amount: '',
    adjustment: '',
    iffLoan: '',
    totalBidded: '',
    rate: '',
    transactionDate: '',
    maturityDate: '',
    remarks: ''
  });
  const [showTableHeading, setShowTableHeading] = useState({
    basicInformation: true,
    forexTable: true,
    searchOption: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState();
  const [fileName, setFileName] = useState(null);

  console.log('uom data', itemUOMs);
  const validationSchema = Yup.object({
    bidPurchase: Yup.string().required('Bid / Purchase is required'),
    purchaseDate: Yup.date().required('Purchase Date is required'),
    currency: Yup.string().required('Currency is required'),
    amount_purchased: Yup.string().required('amount_purchased is required'),
    description: Yup.string().required('Description is required'),
    formmNo: Yup.string().required('FORMM No is required'),
    lcNo: Yup.string().required('LC No is required'),
    purchaseNo: Yup.string().required('Purchase Company is required'),
    bank: Yup.string().required('Bank is required'),
    amount: Yup.number().required('Amount is required').positive(),
    adjustment: Yup.number().required('Adjustment is required').positive(),
    iffLoan: Yup.number().required('IFF Loan is required').positive(),
    totalBidded: Yup.number().required('Total Bidded is required').positive(),
    rate: Yup.number().required('Rate is required').positive(),
    transactionDate: Yup.date().required('Transaction Date is required'),
    maturityDate: Yup.date().required('Maturity Date is required'),
    remarks: Yup.string().required('Remarks are required')
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (e.target.name === 'group') {
      await GetSubCategory(dispatch, e.target.value);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file);

      setFormValues({ ...formValues, itemImageUrl: file });
    }
  };
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
  const handleSearch = () => {};
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    // Append each form value to FormData
    formData.append('bidPurchase', values.bidPurchase);
    formData.append('purchaseDate', values.purchaseDate);
    formData.append('currency', values.currency);
    formData.append('amount_purchased', values.amount_purchased);
    formData.append('description', values.description);
    formData.append('formmNo', values.formmNo);
    formData.append('lcNo', values.lcNo);
    formData.append('purchaseNo', values.purchaseNo);
    formData.append('bank', values.bank);
    formData.append('amount', values.amount);
    formData.append('adjustment', values.adjustment);
    formData.append('iffLoan', values.iffLoan);
    formData.append('totalBidded', values.totalBidded);
    formData.append('rate', values.rate);
    formData.append('transactionDate', values.transactionDate);
    formData.append('maturityDate', values.maturityDate);
    formData.append('remarks', values.remarks);
    // Log each form field value to the console
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setSubmitting(false);
  };
  const pfiData = [
    { sr_no: 1, category: 'Electronics', unit_name: 'Laptop', no: 'PFI001', type: 'Export', currency: 'USD', amount: 1200 },
    { sr_no: 2, category: 'Appliances', unit_name: 'Washing Machine', no: 'PFI002', type: 'Import', currency: 'EUR', amount: 900 }
  ];

  const formMData = [
    { no: 'FM001', amount: 500, bank: 'Bank of America' },
    { no: 'FM002', amount: 750, bank: 'Deutsche Bank' }
  ];

  const lcData = [
    { no: 'LC001', amount: 1000 },
    { no: 'LC002', amount: 1500 }
  ];
  const tableStyles = {
    border: '1px solid #ddd',
    fontSize: '12px',
    '& th, & td': {
      padding: '3px',
      border: '1px solid #ddd'
    }
  };

  return (
    <MainCard title={'FOREX Purchase'}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSearch}>
        {({ values, resetForm }) => (
          <Form>
            <Table>
              {renderTableHeader('searchOption', 'Search Option')}
              {showTableHeading.searchOption && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            FOREX to Purchased<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={SelectFieldPadding}
                            name="forexToPurchased"
                            variant="outlined"
                            // value={values.forexToPurchased}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">abc</MenuItem>
                            <MenuItem value="def">def</MenuItem>
                          </Field>

                          <ErrorMessage name="forexToPurchased" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            FOREX Purchased For<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={SelectFieldPadding}
                            name="forexPurchasedFor"
                            variant="outlined"
                            // value={values.forexPurchasedFor}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">Against Payment of FORM M Transaction</MenuItem>
                            <MenuItem value="def">Against Payment of No FORM M Transaction</MenuItem>
                            <MenuItem value="def">Against Payment of Expense in FOREX</MenuItem>
                            <MenuItem value="def">Against Payment Through IFF</MenuItem>
                            <MenuItem value="def">IFF Closure</MenuItem>
                          </Field>

                          <ErrorMessage name="forexPurchasedFor" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Search Option<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="searchOption" variant="outlined" fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">PFI No</MenuItem>
                            <MenuItem value="def">FORM M No</MenuItem>
                            <MenuItem value="def">LC No</MenuItem>
                            <MenuItem value="def">Form M Opening Bank</MenuItem>
                          </Field>

                          <ErrorMessage name="searchOption" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button size="small" variant="contained" color="primary" type="search">
                            Search
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Form>
        )}
      </Formik>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, resetForm }) => (
          <Form>
            <Table>
              {renderTableHeader('basicInformation', 'Basic Info')}
              {showTableHeading.basicInformation && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Type of Purchase<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="searchOption" variant="outlined" value={values.searchOption} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">Export Proceed</MenuItem>
                            <MenuItem value="def">I & E Window</MenuItem>
                            <MenuItem value="def">CBN Intervention Spot</MenuItem>
                            <MenuItem value="def">CBN Intervention Forward</MenuItem>
                            <MenuItem value="def">Through Own CCI</MenuItem>
                            <MenuItem value="def">Through Outside CCI</MenuItem>
                            <MenuItem value="def">IFF Loan</MenuItem>
                            <MenuItem value="def">Other</MenuItem>
                          </Field>

                          <ErrorMessage name="searchOption" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Amount Purchased<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="amount_purchased" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="amount_purchased" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Currency<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="currency" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="currency" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Bank Name<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="bank_name" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="bank_name" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Rate<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="rate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="rate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            FOREX Purchase Date<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="forexPurchaseDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="forexPurchaseDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            FOREX Maturity Date<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="forexMaturityDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="forexMaturityDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Loan Initiation Date<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="loanInitiationDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="loanInitiationDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Value Date<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="value_date" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="value_date" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Bank Reference No<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="bank_ref_no" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="bank_ref_no" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Premium Amount<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="permium_amount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="permium_amount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Premium Paid Through<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="premium_paid_through" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="premium_paid_through" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Bank Charges<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="bank_charges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="bank_charges" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Amount in Naira<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="amount_in_naira" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="amount_in_naira" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={8}></Grid>
                        <Grid item xs={12} sm={12}>
                          <Typography color={'darkblue'}>Naira Paid Through Account</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            FOREX Purchase<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="forex_purchase" variant="outlined" value={values.forex_purchase} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">PFI No</MenuItem>
                            <MenuItem value="def">FORM M No</MenuItem>
                            <MenuItem value="def">LC No</MenuItem>
                            <MenuItem value="def">Form M Opening Bank</MenuItem>
                          </Field>
                          <ErrorMessage name="forex_purchase" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Premimum<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="Premimum" variant="outlined" value={values.Premimum} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">PFI No</MenuItem>
                            <MenuItem value="def">FORM M No</MenuItem>
                            <MenuItem value="def">LC No</MenuItem>
                            <MenuItem value="def">Form M Opening Bank</MenuItem>
                          </Field>
                          <ErrorMessage name="Premimum" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <CustomTypography>
                            Bank Ch<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="bank_ch" variant="outlined" value={values.bank_ch} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="abc">PFI No</MenuItem>
                            <MenuItem value="def">FORM M No</MenuItem>
                            <MenuItem value="def">LC No</MenuItem>
                            <MenuItem value="def">Form M Opening Bank</MenuItem>
                          </Field>
                          <ErrorMessage name="bank_ch" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button size="small" variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => {
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Table sx={{ mt: 2 }}>
        {renderTableHeader('forexTable', 'Forex Table')}
        {showTableHeading.forexTable && (
          <Box sx={{ display: 'flex' }}>
            <Grid container>
              <Grid item xs={5}>
                <Table sx={tableStyles}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          PFI
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '10px' }}>Sr. No</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Category</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Unit Name</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>No</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Type</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Currency</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pfiData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '10px' }}>{row.sr_no}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.category}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.unit_name}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.no}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.type}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.currency}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={4}>
                <Table sx={tableStyles}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          FORM M
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '10px' }}>No.</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Amount</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Bank</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formMData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '10px' }}>{row.no}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.amount}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.bank}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={3}>
                <Table sx={tableStyles}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          LC
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '10px' }}>No.</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lcData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '10px' }}>{row.no}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Box>
        )}
      </Table>
    </MainCard>
  );
}
