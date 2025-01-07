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
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
  department: ''
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
  department: Yup.string().required('Department is required')
});

export default function RFQForm({ onClose, onSuccessfulSubmit }) {
  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    userPersonalDetail: true
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

  const roles = [
    { role_id: 1, role_name: 'Admin' },
    { role_id: 2, role_name: 'User' },
    { role_id: 3, role_name: 'Manager' }
  ];

  const departments = [
    { dept_id: 1, dept_name: 'IT' },
    { dept_id: 2, dept_name: 'HR' },
    { dept_id: 3, dept_name: 'Finance' }
  ];

  const designations = [
    { designation_id: 1, designation_name: 'Software Engineer' },
    { designation_id: 2, designation_name: 'Project Manager' },
    { designation_id: 3, designation_name: 'HR Executive' }
  ];

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = (values, actions) => {
    console.log('Form values:', values);
    setSnackbarMessage('Form submitted successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    if (onSuccessfulSubmit) {
      onSuccessfulSubmit(values);
    }
    actions.resetForm();
    onClose();
  };

  return (
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue, resetForm }) => (
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
              <Button
                variant="outlined"
                color="error"
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
