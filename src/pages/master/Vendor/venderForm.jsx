// project-imports
import { useState, useEffect } from 'react';
import { CreateVendor } from '../../../Redux/Apis/PostApiCalls';
import { useDispatch } from 'react-redux';
import {
  Grid,
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
  FormHelperText,
  Autocomplete
} from '@mui/material';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { padding, styled } from '@mui/system';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import FieldPadding from 'components/FieldPadding';
import CustomNumberField from 'components/NoArrowTextField';
import SelectFieldPadding from 'components/selectFieldPadding';
import VenderFormX from './venderForm_copy';

const VisuallyHiddenInput = styled('input')({
  display: 'none'
});

const initialFormValues = {
  venderName: '',
  email: '',
  phoneNumber: '',
  alterntPhoneNumber: '',
  venderType: '',
  venderStatus: '',
  registrationDate: '',
  taxId: '',
  contactPerson: '',
  contactPerPhn: '',
  ContPerEmail: '',
  paymentTerm: '',
  reference_by: '',
  compilanceStatus: '',
  file: null,
  pan_num: '',
  tin_num: '',
  gst_num: '',
  vat_num: '',

  remark: '',

  bank: [
    {
      bank_name: '',
      address: '',
      branch: '',
      country: '',
      shortCode: '',
      swiftCode: '',
      currency: '',
      bank_account_number: '',
      bank_ifsc_code: '',
      notes: '',
      bank_ref_cheque: null
    }
  ],
  addresses: [
    {
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      address_type_id: 0
    }
  ]
};
const validationSchema = Yup.object({
  venderName: Yup.string().required('Vendor name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  alterntPhoneNumber: Yup.string().required('Alternate phone number is required'),
  venderType: Yup.string().required('Vendor type is required'),
  venderStatus: Yup.string().required('Vendor status is required'),
  registrationDate: Yup.date().required('Registration date is required'),
  taxId: Yup.string().required('TAX ID is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  contactPerPhn: Yup.string().required('Contact phone is required'),
  ContPerEmail: Yup.string().required('Contact email is required'),
  paymentTerm: Yup.string().required('Payment term is required'),
  reference_by: Yup.string().required('Reference by is required'),
  compilanceStatus: Yup.string().required('Compilance status is required'),
  pan_num: Yup.string().required('PAN number is required'),
  tin_num: Yup.string().required('TIN number is required'),
  gst_num: Yup.string().required('GST number is required'),
  vat_num: Yup.string().required('PAN number is required'),

  bank: Yup.array().of(
    Yup.object({
      bank_name: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
      branch: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      shortCode: Yup.string().required('Required'),
      swiftCode: Yup.string().required('Required'),
      currency: Yup.string().required('Required'),
      bank_account_number: Yup.string().required('Required'),
      bank_ifsc_code: Yup.string().required('Required'),
      notes: Yup.string(),
      bank_ref_cheque: Yup.mixed()
    })
  ),
  addresses: Yup.array().of(
    Yup.object({
      address_line1: Yup.string().required('Required'),
      address_line2: Yup.string(),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      postal_code: Yup.string().required('Required'),
      address_type_id: Yup.number().required('Required')
    })
  )
});
export default function VenderForm({ onClose, formMode, onSuccessfulSubmit }) {
  const dispatch = useDispatch();
  const [showTableHeading, setShowTableHeading] = useState({
    contactInformation: true,
    currentAddress: true,
    officeAddress: true,
    factoryAddress: true,
    permanentAddress: true,
    complianceInformation: true,
    bankDetails: true,
    otherInformation: true
  });
  // const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryId, setCountryId] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

  const handleCountryChange = async (e, nv, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e]: nv.name };
    setAddress(updatedAddress);

    setCountryId(countriesList.filter((item) => item.name === nv.name)[0].id);
    GetState(countriesList.filter((item) => item.name === nv.name)[0].id).then((result) => {
      setStateList(result);
    });
  };
  const handleStateChange = async (e, nv, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e]: nv.name };
    setAddress(updatedAddress);

    GetCity(countryId, stateList.filter((item) => item.name === nv.name)[0].id).then((result) => {
      setCityList(result);
    });
  };

  const handleCityChange = async (e, nv, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e]: nv.name };
    setAddress(updatedAddress);
  };

  const [complianceFile, setComplianceFile] = useState(null);

  const [addresses, setAddress] = useState([
    {
      address_type_id: 1,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    }
  ]);

  const handleChangeAddress = (e, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e.target.name]: e.target.value };
    setAddress(updatedAddress);
  };

  const venderData = [
    { id: 10, name: 'Vendor Type 1' },
    { id: 20, name: 'Vendor Type 2' },
    { id: 30, name: 'Vendor Type 3' }
  ];

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

  const removeAddress = (indexToRemove) => {
    const updatedAdd = [...bank];
    updatedAdd.splice(indexToRemove, 1);
    setAddress(updatedAdd);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleComplianceFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setComplianceFile(file);
      setFormValues({ ...formValues, file: file });
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = {
        vendorDetails: formValues,
        bankDetails: bank,
        addressDetails: addresses
      };
      await CreateVendor(dispatch, formData);
      if (onSuccessfulSubmit) {
        onSuccessfulSubmit();
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };
  return (
    <VenderFormX />
    // <>
    //   <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
    //     {({ values, handleChange, handleSubmit }) => (
    //       <Form onSubmit={handleSubmit}>
    //         <Table>
    //           {renderTableHeader('contactInformation', 'BASIC INFO')}
    //           {showTableHeading.contactInformation && (
    //             <TableBody>
    //               <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
    //                 <TableCell colSpan={6}>
    //                   <Grid container spacing={2} alignItems="center">
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Vendor Name<ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="venderName" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="venderName" component="div" style={errorMessageStyle} />
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Email <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="email" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="email" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="email"
    //                         name="email"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.email}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.email}
    //                         helperText={formErrors.email}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Phone Number <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={CustomNumberField} type="number" name="phoneNumber" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="phoneNumber" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="phoneNumber"
    //                         name="phoneNumber"
    //                         type="number"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.phoneNumber}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.phoneNumber}
    //                         helperText={formErrors.phoneNumber}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Alternate Phone No. <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={CustomNumberField} type="number" name="alterntPhoneNumber" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="alterntPhoneNumber" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="alterntPhoneNumber"
    //                         name="alterntPhoneNumber"
    //                         variant="outlined"
    //                         fullWidth
    //                         type="number"
    //                         value={formValues.alterntPhoneNumber}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.alterntPhoneNumber}
    //                         helperText={formErrors.alterntPhoneNumber}
    //                       /> */}
    //                     </Grid>

    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Vendor Type <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={SelectFieldPadding} name="venderType" variant="outlined" value={values.venderType} fullWidth>
    //                         <MenuItem value="">
    //                           <em>None</em>
    //                         </MenuItem>
    //                         {venderData.map((vender) => (
    //                           <MenuItem key={vender.id} value={vender.id}>
    //                             {vender.name}
    //                           </MenuItem>
    //                         ))}
    //                       </Field>
    //                       <ErrorMessage name="venderType" component="div" style={errorMessageStyle} />
    //                       {/* <FormControl variant="outlined" fullWidth>
    //                         <Select
    //                           labelId="venderType-label"
    //                           id="venderType"
    //                           name="venderType"
    //                           value={formValues.venderType}
    //                           onChange={handleInputChange}
    //                           error={!!formErrors.venderType}
    //                           helperText={formErrors.venderType}
    //                         >
    //                           <MenuItem value="">
    //                             <em>None</em>
    //                           </MenuItem>
    //                           {venderData.map((vender) => (
    //                             <MenuItem key={vender.id} value={vender.id}>
    //                               {vender.name}
    //                             </MenuItem>
    //                           ))}
    //                         </Select>
    //                       </FormControl> */}
    //                     </Grid>

    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Vendor Status <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={SelectFieldPadding} name="venderStatus" variant="outlined" value={values.venderStatus} fullWidth>
    //                         <MenuItem value="">
    //                           <em>None</em>
    //                         </MenuItem>
    //                         <MenuItem value={1}>Active</MenuItem>
    //                         <MenuItem value={0}>Inactive</MenuItem>
    //                         <MenuItem value={3}>Blacklisted</MenuItem>
    //                       </Field>
    //                       <ErrorMessage name="venderStatus" component="div" style={errorMessageStyle} />
    //                       {/* <FormControl variant="outlined" fullWidth>
    //                         <Select
    //                           labelId="venderStatus-label"
    //                           id="venderStatus"
    //                           name="venderStatus"
    //                           value={formValues.venderStatus}
    //                           onChange={handleInputChange}
    //                           error={!!formErrors.venderStatus}
    //                           helperText={formErrors.venderStatus}
    //                         >
    //                           <MenuItem value="">
    //                             <em>None</em>
    //                           </MenuItem>
    //                           <MenuItem value={1}>Active</MenuItem>
    //                           <MenuItem value={0}>Inactive</MenuItem>
    //                           <MenuItem value={3}>Blacklisted</MenuItem>
    //                         </Select>
    //                       </FormControl> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Registration Date <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} type="date" name="registrationDate" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="registrationDate" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="registrationDate"
    //                         name="registrationDate"
    //                         type="date"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.registrationDate}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.registrationDate}
    //                         helperText={formErrors.registrationDate}
    //                         InputLabelProps={{
    //                           shrink: true
    //                         }}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Tax ID <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={CustomNumberField} type="number" name="taxId" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="taxId" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="taxId"
    //                         name="taxId"
    //                         variant="outlined"
    //                         fullWidth
    //                         type="number"
    //                         value={formValues.taxId}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.taxId}
    //                         helperText={formErrors.taxId}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Contact Person <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="contactPerson" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="contactPerson" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="contactPerson"
    //                         name="contactPerson"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.contactPerson}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.contactPerson}
    //                         helperText={formErrors.contactPerson}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Contact Phone <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={CustomNumberField} type="number" name="contactPerPhn" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="contactPerPhn" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="contactPerPhn"
    //                         name="contactPerPhn"
    //                         type="number"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.contactPerPhn}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.contactPerPhn}
    //                         helperText={formErrors.contactPerPhn}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Contact Email <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="ContPerEmail" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="ContPerEmail" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="ContPerEmail"
    //                         name="ContPerEmail"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.ContPerEmail}
    //                         error={!!formErrors.ContPerEmail}
    //                         helperText={formErrors.ContPerEmail}
    //                         onChange={handleInputChange}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Payment Term <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="paymentTerm" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="paymentTerm" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="paymentTerm"
    //                         name="paymentTerm"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.paymentTerm}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.paymentTerm}
    //                         helperText={formErrors.paymentTerm}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">
    //                         Reference By <ValidationStar>*</ValidationStar>
    //                       </Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="reference_by" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="reference_by" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="reference_by"
    //                         name="reference_by"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.reference_by}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.reference_by}
    //                         helperText={formErrors.reference_by}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">Remark</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={5}>
    //                       <Field as={FieldPadding} name="remark" variant="outlined" fullWidth size="small" />
    //                       {/* <TextField
    //                         id="remark"
    //                         name="remark"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.remark}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.remark}
    //                         helperText={formErrors.remark}
    //                       /> */}
    //                     </Grid>
    //                   </Grid>
    //                 </TableCell>
    //               </TableRow>
    //             </TableBody>
    //           )}
    //         </Table>

    //         <Table>
    //           {renderTableHeader('addresses', 'Addresses')}
    //           {showTableHeading.currentAddress && (
    //             <TableBody>
    //               <FieldArray name="addresses">
    //                 {({ push, remove }) => (
    //                   <>
    //                     {values.addresses.map((address, index) => (
    //                       <TableRow key={index} sx={{ marginBottom: '10px', marginTop: '10px' }}>
    //                         <TableCell colSpan={6}>
    //                           <Grid
    //                             sx={{ margin: '10px 0px', padding: '10px', border: '2px dashed black', borderRadius: '5px' }}
    //                             container
    //                             spacing={2}
    //                             alignItems="center"
    //                           >
    //                             {/* Address Line 1 */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">Address Line 1</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={5}>
    //                               <Field
    //                                 as={TextField}
    //                                 name={`addresses[${index}].address_line1`}
    //                                 variant="outlined"
    //                                 fullWidth
    //                                 size="small"
    //                               />
    //                               <ErrorMessage name={`addresses[${index}].address_line1`} component="div" style={{ color: 'red' }} />
    //                             </Grid>

    //                             {/* Address Line 2 */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">Address Line 2</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={5}>
    //                               <Field
    //                                 as={TextField}
    //                                 name={`addresses[${index}].address_line2`}
    //                                 variant="outlined"
    //                                 fullWidth
    //                                 size="small"
    //                               />
    //                               <ErrorMessage name={`addresses[${index}].address_line2`} component="div" style={{ color: 'red' }} />
    //                             </Grid>

    //                             {/* Country */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">Country</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={2}>
    //                               <Autocomplete
    //                                 id={`country-${index}`}
    //                                 name={`addresses[${index}].country`}
    //                                 options={countriesList}
    //                                 getOptionLabel={(option) => option.name}
    //                                 renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
    //                                 value={countriesList.find((c) => c.name === address.country) || null}
    //                                 onChange={(event, value) => setFieldValue(`addresses[${index}].country`, value?.name || '')}
    //                               />
    //                             </Grid>

    //                             {/* State */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">State</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={2}>
    //                               <Autocomplete
    //                                 id={`state-${index}`}
    //                                 name={`addresses[${index}].state`}
    //                                 options={stateList}
    //                                 getOptionLabel={(option) => option.name}
    //                                 renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
    //                                 value={stateList.find((s) => s.name === address.state) || null}
    //                                 onChange={(event, value) => setFieldValue(`addresses[${index}].state`, value?.name || '')}
    //                               />
    //                             </Grid>

    //                             {/* City */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">City</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={2}>
    //                               <Autocomplete
    //                                 id={`city-${index}`}
    //                                 name={`addresses[${index}].city`}
    //                                 options={cityList}
    //                                 getOptionLabel={(option) => option.name}
    //                                 renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
    //                                 value={cityList.find((c) => c.name === address.city) || null}
    //                                 onChange={(event, value) => setFieldValue(`addresses[${index}].city`, value?.name || '')}
    //                               />
    //                             </Grid>

    //                             {/* Postal Code */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">Pincode</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={2}>
    //                               <Field
    //                                 as={TextField}
    //                                 type="number"
    //                                 name={`addresses[${index}].postal_code`}
    //                                 variant="outlined"
    //                                 fullWidth
    //                                 size="small"
    //                               />
    //                               <ErrorMessage name={`addresses[${index}].postal_code`} component="div" style={{ color: 'red' }} />
    //                             </Grid>

    //                             {/* Address Type */}
    //                             <Grid item xs={12} sm={1}>
    //                               <Typography variant="body">Address Type</Typography>
    //                             </Grid>
    //                             <Grid item xs={12} sm={2}>
    //                               <Field as={Select} name={`addresses[${index}].address_type_id`} variant="outlined" fullWidth>
    //                                 <MenuItem value="">
    //                                   <em>None</em>
    //                                 </MenuItem>
    //                                 <MenuItem value={1}>Current Address</MenuItem>
    //                                 <MenuItem value={2}>Permanent Address</MenuItem>
    //                               </Field>
    //                               <ErrorMessage name={`addresses[${index}].address_type_id`} component="div" style={{ color: 'red' }} />
    //                             </Grid>

    //                             {/* Add More Button */}
    //                             {values.addresses.length === index + 1 && values.addresses.length < 4 && (
    //                               <Grid item xs={12} sm={2}>
    //                                 <Button
    //                                   sx={{ width: '100%' }}
    //                                   variant="outlined"
    //                                   color="primary"
    //                                   onClick={() =>
    //                                     push({
    //                                       address_type_id: 0,
    //                                       address_line1: '',
    //                                       address_line2: '',
    //                                       city: '',
    //                                       state: '',
    //                                       country: '',
    //                                       postal_code: ''
    //                                     })
    //                                   }
    //                                 >
    //                                   Add More
    //                                 </Button>
    //                               </Grid>
    //                             )}

    //                             {/* Remove Button */}
    //                             {values.addresses.length > 1 && (
    //                               <Grid item xs={12} sm={2}>
    //                                 <Button sx={{ width: '100%' }} variant="outlined" color="error" onClick={() => remove(index)}>
    //                                   Remove
    //                                 </Button>
    //                               </Grid>
    //                             )}
    //                           </Grid>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))}
    //                   </>
    //                 )}
    //               </FieldArray>
    //             </TableBody>
    //           )}
    //         </Table>
    //         {/* Compliance Status */}
    //         <Table>
    //           {renderTableHeader('complianceInformation', 'Compliance Information')}
    //           {showTableHeading.complianceInformation && (
    //             <TableBody>
    //               <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
    //                 <TableCell colSpan={6}>
    //                   <Grid container spacing={2} alignItems="center">
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">Compliance Status</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="compilanceStatus" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="compilanceStatus" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="compilanceStatus"
    //                         name="compilanceStatus"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.compilanceStatus}
    //                         onChange={handleInputChange}
    //                         error={!!formErrors.compilanceStatus}
    //                         helperText={formErrors.compilanceStatus}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">Last Audited Docs</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <div>
    //                         <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
    //                           Upload File
    //                           <VisuallyHiddenInput
    //                             type="file"
    //                             name="last_audited_docs"
    //                             id="last_audited_docs"
    //                             onChange={handleComplianceFileChange}
    //                           />
    //                         </Button>
    //                         {complianceFile?.name && <span style={{ color: 'blue' }}>{complianceFile?.name}</span>}
    //                       </div>
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">PAN Number</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="pan_num" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="pan_num" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="pan_num"
    //                         name="pan_num"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.pan_num}
    //                         onChange={handleInputChange}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">TIN Number</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="tin_num" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="tin_num" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="tin_num"
    //                         name="tin_num"
    //                         type="number"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.tin_num}
    //                         onChange={handleInputChange}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">GST Number</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="gst_num" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="gst_num" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="gst_num"
    //                         name="gst_num"
    //                         type="number"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.gst_num}
    //                         onChange={handleInputChange}
    //                       /> */}
    //                     </Grid>
    //                     <Grid item xs={12} sm={1}>
    //                       <Typography variant="body">VAT Number</Typography>
    //                     </Grid>
    //                     <Grid item xs={12} sm={2}>
    //                       <Field as={FieldPadding} name="vat_num" variant="outlined" fullWidth size="small" />
    //                       <ErrorMessage name="vat_num" component="div" style={errorMessageStyle} />
    //                       {/* <TextField
    //                         id="vat_num"
    //                         name="vat_num"
    //                         type="number"
    //                         variant="outlined"
    //                         fullWidth
    //                         value={formValues.vat_num}
    //                         onChange={handleInputChange}
    //                       /> */}
    //                     </Grid>
    //                   </Grid>
    //                 </TableCell>
    //               </TableRow>
    //             </TableBody>
    //           )}
    //         </Table>
    //         <Table>
    //           {renderTableHeader('bankDetails', 'Bank Detail')}
    //           {showTableHeading.bankDetails && (
    //             <TableBody>
    //               <FieldArray name="bank">
    //                 {({ push, remove }) => (
    //                   <>
    //                     {values.bank.map((item, index) => (
    //                       <TableRow key={index} sx={{ marginBottom: '10px', marginTop: '10px' }}>
    //                         <TableCell colSpan={6}>
    //                           <Grid container spacing={1} alignItems="center">
    //                             <Grid
    //                               container
    //                               spacing={2}
    //                               sx={{ margin: '10px 0px', padding: '10px', border: '2px dashed black', borderRadius: '5px' }}
    //                             >
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">Bank{index + 1} Name</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Field as={FieldPadding} name={`bank[${index}].bank_name`} variant="outlined" fullWidth size="small" />
    //                                 <ErrorMessage name={`bank[${index}].bank_name`} component="div" style={{ color: 'red' }} />
    //                               </Grid>
    //                               {/* Repeat similar structure for other fields */}
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">Bank{index + 1} Address</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Field as={FieldPadding} name={`bank[${index}].address`} variant="outlined" fullWidth size="small" />
    //                                 <ErrorMessage name={`bank[${index}].address`} component="div" style={{ color: 'red' }} />
    //                               </Grid>
    //                               {/* ... other fields ... */}
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">Bank{index + 1} Currency</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Field as={FieldPadding} name={`bank[${index}].currency`} variant="outlined" fullWidth size="small" />
    //                                 <ErrorMessage name={`bank[${index}].currency`} component="div" style={{ color: 'red' }} />
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">A/C No.</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Field
    //                                   as={FieldPadding}
    //                                   name={`bank[${index}].bank_account_number`}
    //                                   variant="outlined"
    //                                   fullWidth
    //                                   size="small"
    //                                 />
    //                                 <ErrorMessage name={`bank[${index}].bank_account_number`} component="div" style={{ color: 'red' }} />
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">IFSC Code</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Field
    //                                   as={FieldPadding}
    //                                   name={`bank[${index}].bank_ifsc_code`}
    //                                   variant="outlined"
    //                                   fullWidth
    //                                   size="small"
    //                                 />
    //                                 <ErrorMessage name={`bank[${index}].bank_ifsc_code`} component="div" style={{ color: 'red' }} />
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">Notes</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Field as={FieldPadding} name={`bank[${index}].notes`} variant="outlined" fullWidth size="small" />
    //                                 <ErrorMessage name={`bank[${index}].notes`} component="div" style={{ color: 'red' }} />
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <Typography variant="body">Bank Ref Cheque</Typography>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 <div>
    //                                   <Button
    //                                     component="label"
    //                                     sx={{ marginBottom: '0', width: '100%' }}
    //                                     variant="contained"
    //                                     startIcon={<CloudUploadIcon />}
    //                                   >
    //                                     Upload File
    //                                     <VisuallyHiddenInput
    //                                       type="file"
    //                                       name={`bank[${index}].bank_ref_cheque`}
    //                                       onChange={(e) => {
    //                                         setFieldValue(`bank[${index}].bank_ref_cheque`, e.currentTarget.files[0]);
    //                                       }}
    //                                     />
    //                                   </Button>
    //                                   {item?.bank_ref_cheque?.name && <span style={{ color: 'blue' }}>{item?.bank_ref_cheque?.name}</span>}
    //                                 </div>
    //                               </Grid>
    //                               <Grid item xs={12} sm={2}></Grid>
    //                               <Grid item xs={12} sm={2}>
    //                                 {values.bank.length > 1 && (
    //                                   <Button onClick={() => remove(index)} sx={{ width: '100%' }} variant="outlined" color="error">
    //                                     Remove
    //                                   </Button>
    //                                 )}
    //                               </Grid>
    //                             </Grid>
    //                           </Grid>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))}
    //                     <Grid item xs={12} sm={2}>
    //                       <Button
    //                         sx={{ width: '100%' }}
    //                         variant="outlined"
    //                         color="primary"
    //                         onClick={() =>
    //                           push({
    //                             bank_name: '',
    //                             address: '',
    //                             branch: '',
    //                             country: '',
    //                             shortCode: '',
    //                             swiftCode: '',
    //                             currency: '',
    //                             bank_account_number: '',
    //                             bank_ifsc_code: '',
    //                             notes: '',
    //                             bank_ref_cheque: null
    //                           })
    //                         }
    //                       >
    //                         Add More
    //                       </Button>
    //                     </Grid>
    //                   </>
    //                 )}
    //               </FieldArray>
    //             </TableBody>
    //           )}
    //         </Table>
    //         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
    //           <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
    //             {formMode === 'create' ? 'Submit' : 'Update'}
    //           </Button>
    //           <Button variant="outlined" color="error" onClick={onClose}>
    //             Cancel
    //           </Button>
    //         </Box>
    //       </Form>
    //     )}
    //   </Formik>
    // </>
  );
}
