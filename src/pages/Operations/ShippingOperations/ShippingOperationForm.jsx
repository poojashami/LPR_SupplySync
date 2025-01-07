import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button, Snackbar, Alert } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';

const initialFormValues = {
  rotationNo: '',
  vesselName: '',
  vesselNo: '',

  revised_eta: ''
};

const validationSchema = Yup.object().shape({
  rotationNo: Yup.string().required('This field is required'),
  vesselName: Yup.string().required('This field is required'),
  vesselNo: Yup.string().required('This field is required'),
  dutyPaidToBank: Yup.string().required('This field is required'),

  revised_eta: Yup.string().required('This field is required')
});

export default function ShippingOperationForm({ onClose, onSuccessfulSubmit }) {
  const [showTableHeading, setShowTableHeading] = useState({
    rotationNo: true,
    revisedETA: true
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
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
              {renderTableHeader('rotationNo', 'Rotation No')}
              {showTableHeading.rotationNo && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={12}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Rotation No<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="rotationNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="rotationNo" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Vessel Name <ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="vesselName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vesselName" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Vessel No<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="vesselNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vesselNo" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Table>
              {renderTableHeader('revisedETA', 'Revised ETA')}
              {showTableHeading.revisedETA && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={12}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Exchange Rate<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="revised_eta" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="revised_eta" component="div" style={errorMessageStyle} />
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
