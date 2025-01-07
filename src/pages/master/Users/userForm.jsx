import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
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
  Autocomplete,
  Box,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { GetRoles, GetDepartments, GetDesignations } from '../../../Redux/Apis/GetApiCalls';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from 'utils/axiosInstance';
import { getCurrentDate } from '../../../utils/constantFunctions';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import CustomNumberField from 'components/NoArrowTextField';

const initialFormValues = {
  userName: '',
  password: '',
  resigDate: getCurrentDate(),
  role: '',
  firstName: '',
  lastName: '',
  phoneNo: '',
  email: '',
  dobBirth: '',
  designation: '',
  department: '',
  address1: '',
  address2: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  address11: '',
  address22: '',
  country1: '',
  state1: '',
  city1: '',
  pinCode1: ''
};

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'User Name should be alphabetical')
    .required('User Name is required'),
  password: Yup.string().required('Password is required'),
  resigDate: Yup.date().required('Registration Date is required'),
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'User Name should be alphabetical')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'User Name should be alphabetical')
    .required('Last Name is required'),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone No must be 10 digits')
    .required('Phone No is required'),

  email: Yup.string().email('Invalid email format').required('Email is required'),
  role: Yup.string().required('Please select role'),
  dobBirth: Yup.date().required('DOB is required'),
  designation: Yup.string().required('Designation is required'),
  department: Yup.string().required('Department is required'),
  pincode: Yup.string()
    .matches(/^\d*$/, 'Pincode must be a number')
    .min(6, 'Pincode must be exactly 6 digits')
    .max(6, 'Pincode must be exactly 6 digits')
    .required('Pincode is required')
});

export default function UserForm({ onClose, onSuccessfulSubmit, formMode }) {
  const dispatch = useDispatch();
  const { roles, departments, designations } = useSelector((state) => state.usersMaster);
  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    userPersonalDetail: true,
    currentAddressDetails: true,
    permanentAddressDetails: true
  });

  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryId, setCountryId] = useState(0);
  const [same, setSame] = useState(false);

  const [formValues, setFormValues] = useState(initialFormValues);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
    GetRoles(dispatch);
    GetDepartments(dispatch);
    GetDesignations(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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

  const handleCountryChange = async (e, nv) => {
    setCountryId(countriesList.filter((item) => item.name === nv.name)[0].id);
    GetState(countriesList.filter((item) => item.name === nv.name)[0].id).then((result) => {
      setStateList(result);
    });
  };
  const handleStateChange = async (e, nv) => {
    setFormValues({ ...formValues, state: stateList.filter((item) => item.name === nv.name)[0].name, city: '' });
    GetCity(countryId, stateList.filter((item) => item.name === nv.name)[0].id).then((result) => {
      setCityList(result);
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const mapFrontendToBackendKeys = (frontendData) => {
      return {
        username: frontendData.userName,
        password: frontendData.password,
        first_name: frontendData.firstName,
        last_name: frontendData.lastName,
        email: frontendData.email,
        phone_number: frontendData.phoneNo,
        address1_line1: frontendData.address1,
        address1_line2: frontendData.address2,
        city1: frontendData.city,
        state1: frontendData.state,
        country: frontendData.country,
        postal_code1: frontendData.pincode,
        address2_line1: frontendData.address11,
        address2_line2: frontendData.address22,
        city2: frontendData.city1,
        state2: frontendData.state1,
        country1: frontendData.country1,
        postal_code2: frontendData.pinCode1,

        date_of_birth: frontendData.dobBirth,
        registration_date: frontendData.resigDate,
        is_active: '',
        role: frontendData.role,
        dept_id: frontendData.department,
        design_id: frontendData.designation,
        created_by: 'User'
      };
    };

    const requestData = mapFrontendToBackendKeys(values);

    try {
      await axiosInstance.post(`/api/user/user`, requestData);
      setSnackbarMessage('User data submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      resetForm();
      if (onSuccessfulSubmit) {
        onSuccessfulSubmit();
      }
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      setSnackbarMessage('Error submitting user data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  console.log('roles', roles);
  return (
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Table>
              {renderTableHeader('userLoginDetails', 'User Login Detail')}
              {showTableHeading.userLoginDetails && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            User Name<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="userName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="userName" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Password<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="password" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="password" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Registration Date<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} type="date" name="resigDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="resigDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Role<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="role" variant="outlined" value={values.role} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {roles.map((role) => (
                              <MenuItem key={role.role_id} value={role.role_id}>
                                {role.role_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="role" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Table>
              {renderTableHeader('userPersonalDetail', 'Personal Detail')}
              {showTableHeading.userPersonalDetail && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            First Name<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="firstName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="firstName" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Last Name<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="lastName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="lastName" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Phone No<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={CustomNumberField} type="number" name="phoneNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="phoneNo" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Email<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="email" type="email" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="email" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            DOB<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="dobBirth" type="date" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="dobBirth" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Department<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="department" variant="outlined" value={values.department} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {departments.map((department) => (
                              <MenuItem key={department.dept_id} value={department.dept_id}>
                                {department.dept_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="department" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Designation<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="designation" variant="outlined" value={values.designation} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {designations.map((designation) => (
                              <MenuItem key={designation.designation_id} value={designation.designation_id}>
                                {designation.designation_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="designation" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Table>
              {renderTableHeader('currentAddressDetails', 'Current Address Detail')}

              {showTableHeading.currentAddressDetails && (
                <TableBody>
                  <TableRow sx={{ marginTop: '10px', marginBottom: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1"> Address 1</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Field as={FieldPadding} name="address1" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="address1" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1"> Address 2</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Field as={FieldPadding} name="address2" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="address2" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            Country
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Autocomplete
                            id="country"
                            name="country"
                            fullWidth
                            options={countriesList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            value={{ name: values.country }}
                            onChange={(event, value) => {
                              handleCountryChange(event, value);
                              setFieldValue('country', value.name);
                            }}
                          />
                          <ErrorMessage name="country" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            State
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Autocomplete
                            fullWidth
                            id="state"
                            name="state"
                            options={stateList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            value={{ name: values.state }}
                            onChange={(event, value) => {
                              handleStateChange(event, value);
                              setFieldValue('state', value.name);
                            }}
                          />
                          <ErrorMessage name="state" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            City
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Autocomplete
                            fullWidth
                            id="city"
                            name="city"
                            options={cityList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            value={{ name: values.city }}
                            onChange={(event, value) => {
                              handleStateChange(event, value);
                              setFieldValue('city', value.name);
                            }}
                          />
                          <ErrorMessage name="city" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            Pincode
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={CustomNumberField} type="number" name="pincode" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="pincode" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Table>
              {renderTableHeader('permanentAddressDetails', 'Permanent Address Detail')}

              {showTableHeading.permanentAddressDetails && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => {
                              if (!same) {
                                setFieldValue('address11', values.address1);
                                setFieldValue('address22', values.address2);
                                setFieldValue('country1', values.country);
                                setFieldValue('state1', values.state);
                                setFieldValue('city1', values.city);
                                setFieldValue('pinCode1', values.pincode);
                              }
                              setSame((prev) => !prev);
                            }}
                            checked={same}
                            className="custom-checkbox"
                          />
                        }
                        label="Same as Current Address"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            Address 1
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Field as={FieldPadding} name="address11" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="address11" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            Address 2
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Field as={FieldPadding} name="address22" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="address22" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            Country
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Autocomplete
                            fullWidth
                            id="country1"
                            name="country1"
                            options={countriesList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            value={{ name: values.country1 }}
                            onChange={(event, value) => {
                              handleCountryChange(event, value);
                              setFieldValue('country1', value.name);
                            }}
                          />
                          <ErrorMessage name="country1" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            State
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Autocomplete
                            fullWidth
                            id="state1"
                            name="state1"
                            options={stateList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            value={{ name: values.state1 }}
                            onChange={(event, value) => {
                              handleStateChange(event, value);
                              setFieldValue('state1', value.name);
                            }}
                          />
                          <ErrorMessage name="state1" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            City
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Autocomplete
                            fullWidth
                            id="city1"
                            name="city1"
                            options={cityList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            value={{ name: values.city1 }}
                            onChange={(event, value) => {
                              handleStateChange(event, value);
                              setFieldValue('city1', value.name);
                            }}
                          />
                          <ErrorMessage name="city1" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1" align="left">
                            Pincode
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="pinCode1" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="pinCode1" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                {formMode === 'create' ? 'Submit' : 'Update'}
              </Button>
              <Button variant="outlined" color="error" type="button" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
