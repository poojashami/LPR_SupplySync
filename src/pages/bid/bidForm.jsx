// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { axiosInstance } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import BidTable from './bidTable'

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText
} from '@mui/material';


import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import { styled } from '@mui/material/styles';
import SelectFieldPadding from 'components/selectFieldPadding';
import CustomNumberField from 'components/NoArrowTextField';
import FieldPadding from 'components/FieldPadding';


const VisuallyHiddenInput = styled('input')({
  display: 'none'
});


export default function ItemForm({ onClose, onFormSubmit, formMode }) {
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
    supplier: '',
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
    basicInformation: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState();
  const [fileName, setFileName] = useState(null);


  const [fetchbid, setFetchbid] = useState(true);
  const fetchbidtogle = () => {
    setFetchbid(!fetchbid)
  }




  console.log('uom data', itemUOMs);
  const validationSchema = Yup.object({
    bidPurchase: Yup.string().required('Bid / Purchase is required'),
    purchaseDate: Yup.date().required('Purchase Date is required'),
    currency: Yup.string().required('Currency is required'),
    supplier: Yup.string().required('Supplier is required'),
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


  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    // Append each form value to FormData
    formData.append('bidPurchase', values.bidPurchase);
    formData.append('purchaseDate', values.purchaseDate);
    formData.append('currency', values.currency);
    formData.append('supplier', values.supplier);
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

    // window.alert("do you want to submit form")

    let formvalues = {}
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      formvalues[key] = value
    }

    try {
      // let ItemDataArr = itemsData?.map((i, index) => ({ ...i, grn_qty: marginLine[index + 1]?.quantity }));
      const { data } = await axiosInstance.post('/api/bid/create', formvalues);
      console.log("new Value**********")
      console.log(values)
      toast?.success(data?.message);
      fetchbidtogle()
    } catch (error) {
      toast?.error("Bid Form Submission Error");
      console.log(error);
    }
  };


  return (
    <MainCard title={'Create BID'}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Table>
              {renderTableHeader('basicInformation', 'Basic Info')}
              {showTableHeading.basicInformation && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Bid / Purchase<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="bidPurchase" variant="outlined" value={values.bidPurchase} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="BID">BID</MenuItem>
                            <MenuItem value="Purchase">Purchase</MenuItem>
                          </Field>

                          <ErrorMessage name="bidPurchase" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Purchase Date<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="date" name="purchaseDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="purchaseDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Currency<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="currency" variant="outlined" value={values.currency} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="BID">BID</MenuItem>
                            <MenuItem value="Purchase">Purchase</MenuItem>
                          </Field>
                          <ErrorMessage name="currency" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Supplier<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="supplier" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="supplier" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Description<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="description" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="description" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            FORMM No<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="formmNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="formmNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            LC No<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="lcNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="lcNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Purchase Company<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="purchaseNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="purchaseNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Bank<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="bank" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="bank" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="number" name="amount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="amount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Adjustment<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="number" name="adjustment" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="adjustment" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            IFF Loan<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="number" name="iffLoan" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="iffLoan" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Total Bidded<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="number" name="totalBidded" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="totalBidded" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Rate<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="number" name="rate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="rate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Transaction Date<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="date" name="transactionDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="transactionDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Maturity Date<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="date" name="maturityDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="maturityDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Remarks<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="remarks" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="remarks" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
              <Button variant="outlined" color="error">
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <BidTable fetchbid={fetchbid} />
    </MainCard>
  );
}
