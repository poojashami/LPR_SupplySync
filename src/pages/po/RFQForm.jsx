import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import RFQView from './POView';
import ItemList from './ItemList';
import VendorList from './VendorList';
import DocumentDetail from './DocumentDetail';

const RFQForm = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    createrfqForm: true,
    itemListRfq: true,
    vendorlist: true,
    requireDoc: true
  });
  const validationSchema = Yup.object({
    lprNo: Yup.string().required('LPR No is required'),
    vertical: Yup.string().required('Vertical is required'),
    company: Yup.string().required('Company is required'),
    division: Yup.string().required('Division is required'),
    lprCategory: Yup.string().required('LPR Category is required'),
    shipmentMode: Yup.string().required('Shipment Mode is required'),
    buyingThrough: Yup.string().required('Buying Through is required'),
    leftForRFQ: Yup.string().required('Left for RFQ is required'),
    deliveryTime: Yup.string().required('Delivery Time is required'),
    requestedByDept: Yup.string().required('Requested By Department is required'),
    requestedBy: Yup.string().required('Requested By is required'),
    date: Yup.date().required('Date is required')
  });

  const initialValues = {
    lprNo: '',
    vertical: '',
    company: '',
    division: '',
    lprCategory: '',
    shipmentMode: '',
    buyingThrough: '',
    leftForRFQ: '',
    deliveryTime: '',
    requestedByDept: '',
    requestedBy: '',
    date: '',
    additionalRemarks: ''
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
  return (
    <Box>
      <RFQView />
      <Table>{renderTableHeader('createrfqForm', 'Create RFQ')}</Table>
      {showTableHeading.createrfqForm && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
          }}
        >
          {({ isSubmitting, resetForm }) => (
            <Form>
              <Grid container spacing={2} mt={'1px'}>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    LPR No<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="lprNo" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="lprNo" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Vertical<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="vertical" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="vertical" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Company<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="company" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="company" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Division<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="division" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="division" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    LPR Category<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="lprCategory" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="lprCategory" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Shipment Mode<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="shipmentMode" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="shipmentMode" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Buying Through<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="buyingThrough" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="buyingThrough" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Left for RFQ<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="leftForRFQ" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="leftForRFQ" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Delivery Time<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="deliveryTime" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="deliveryTime" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Requested By Department<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="requestedByDept" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="requestedByDept" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Requested By<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="requestedBy" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="requestedBy" component="div" style={errorMessageStyle} />
                </Grid>
                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Date<ValidationStar>*</ValidationStar>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="date" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="date" component="div" style={errorMessageStyle} />
                </Grid>

                <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
                  <Typography variant="body" style={{ fontSize: '11px' }}>
                    Additional Remarks
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} paddingTop={'20px'}>
                  <Field as={FieldPadding} name="additionalRemarks" variant="outlined" fullWidth size="small" />
                  <ErrorMessage name="additionalRemarks" component="div" style={errorMessageStyle} />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => resetForm()}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}
      <Box mt={'10px'}>
        <Table>{renderTableHeader('itemListRfq', 'Item List to Create RFQ')}</Table>
        {showTableHeading.itemListRfq && <ItemList />}
      </Box>
      <Box mt={'10px'}>
        <Table>{renderTableHeader('vendorlist', 'Select Vendor')}</Table>
        {showTableHeading.vendorlist && <VendorList />}
      </Box>
      <Box mt={'10px'}>
        <Table>{renderTableHeader('requireDoc', 'Required Document at The Time of Shipping')}</Table>
        {showTableHeading.requireDoc && <DocumentDetail />}
      </Box>
    </Box>
  );
};

export default RFQForm;
