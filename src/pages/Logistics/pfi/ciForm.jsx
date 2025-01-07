import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button, Snackbar, Alert } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import { axiosInstance } from 'utils/axiosInstance';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { useNavigate } from 'react-router';
import ItemList from './ItemList';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';

const validationSchema = Yup.object().shape({
  ciSender: Yup.string().required('This field is required'),
  ciSenderDate: Yup.date().required('This field is required').nullable(),
  customer: Yup.string().required('This field is required'),
  invoiceNo: Yup.string().required('This field is required'),
  invoiceDate: Yup.string().required('This field is required'),
  oprNo: Yup.string().required('This field is required'),
  shipmentType: Yup.date().required('This field is required').nullable(),
  mode: Yup.string().required('This field is required'),
  totalPackage: Yup.string().required('This field is required'),
  countryOfSupply: Yup.string().required('This field is required'),
  deliveryTerms: Yup.string().required('This field is required'),
  portOfLoading: Yup.string().required('This field is required'),
  countryOfOrigin: Yup.string().required('This field is required'),
  portOfDC: Yup.string().required('This field is required'),
  paymentTerms: Yup.string().required('This field is required'),
  finalDestination: Yup.string().required('This field is required'),
  countryOfFinalDestination: Yup.string().required('This field is required'),
  blNo: Yup.string().required('This field is required'),
  blDate: Yup.string().required('This field is required'),
  vesselName: Yup.string().required('Inhand Charges are required'),
  vesselNo: Yup.string().required('Freight Charges are required'),
  shippingLineName: Yup.string().required('Inspection Charges are required'),
  fobCharges: Yup.string().required('FOB Charges are required'),
  etaDate: Yup.string().required('THC Charges are required'),
  freeDays: Yup.string().required('Container Stuffing is required'),
  totalNetWeight: Yup.string().required('Container Seal is required'),
  totalGrossWeight: Yup.string().required('totalGrossWeight is required'),
  uom: Yup.string().required('uom charges are required'),
  sealNo: Yup.string().required('Advising Commission is required'),
  cbm: Yup.string().required('LLC Commission is required'),
  invoiceRemark: Yup.string().required('Required'),
  inlandCharges: Yup.string().required(' Required'),
  freightCharges: Yup.string().required('Required'),
  inspectionCharges: Yup.string().required('Required')
});

export default function CIForm({ ci_data, setCi_data }) {
  console.log('ci_data', ci_data);
  // const navigate = useNavigate();
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    additionalCharges: true,
    itemsList: true
  });
  const initialFormValues = {
    pfiNum: ci_data?.pfi_no,
    pfiId: ci_data?.pfi_id,
    ciSender: ci_data?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
    ciSenderDate: '',
    customer: ci_data?.opo_master?.OprMaster?.companyMaster?.company_name,
    invoiceNo: '',
    invoiceDate: ci_data?.pfi_created_time,
    oprNo: ci_data?.opr_no,
    shipmentType: ci_data?.shipment_type,
    mode: '',
    exchangeDate: '',
    totalPackage: '',
    portOfDC: ci_data?.port_of_dc,
    portOfLoading: ci_data?.port_of_loading,
    countryOfOrigin: ci_data?.country_of_origin_of_goods,
    countryOfSupply: ci_data?.country_of_supply,
    deliveryTerms: ci_data?.delivery_terms,

    paymentTerms: ci_data?.payment_terms,
    finalDestination: ci_data?.final_destination,
    countryOfFinalDestination: ci_data?.country_of_final_destination,
    blNo: '',
    blDate: '',
    vesselName: '',
    vesselNo: '',
    shippingLineName: '',
    etaDate: '',
    freeDays: '',
    totalNetWeight: '',
    totalGrossWeight: '',
    uom: '',
    sealNo: '',
    cbm: '',
    invoiceRemark: '',
    inlandCharges: ci_data?.inland_charges,
    freightCharges: '',
    inspectionCharges: ci_data?.inspection_charges
  };
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
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (values, actions) => {
    console.log('Form values:', values);
    const { data } = await axiosInstance.post('/api/commercial/invoice', values);
    console.log(data);
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
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b>
            <span>Create CI</span> for PFI # <span style={{ color: 'blue' }}>{ci_data?.pfi_no}</span>
          </b>
          <PlusButton
            label="Back"
            onClick={() => {
              // navigate('/pfi');
              setCi_data(null);
            }}
          />
        </Box>
      }
    >
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        {({ setFieldValue }) => (
          <Form>
            <Table>
              {renderTableHeader('basicDetails', 'Basic Details')}
              {showTableHeading.basicDetails && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            CI Sender<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="ciSender" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="ciSender" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            CI Sender Date<ValidationStar>*</ValidationStar>
                          </Typography>
                          <DatePicker
                            fullWidth
                            name="ciSenderDate"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            onChange={(date) => {
                              setFieldValue('ciSenderDate', date);
                            }}
                          />
                          <ErrorMessage name="ciSenderDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Customer <ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="customer" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="customer" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Invoice No<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="invoiceNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="invoiceNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Invoice Date<ValidationStar>*</ValidationStar>
                          </Typography>
                          <DatePicker
                            fullWidth
                            name="invoiceDate"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            onChange={(date) => {
                              setFieldValue('invoiceDate', date);
                            }}
                          />
                          <ErrorMessage name="invoiceDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            OPR No<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="oprNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="oprNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Shipment Type<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="shipmentType" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="shipmentType" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Mode<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="mode" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="mode" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Full & Final<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="fullandFinal" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="fullandFinal" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Total Package<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="totalPackage" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="totalPackage" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Country Of Supply<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="countryOfSupply" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="countryOfSupply" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Country Of Origin<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="countryOfOrigin" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="countryOfOrigin" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Port of Loading<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="portOfLoading" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="portOfLoading" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Port Of DC<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="portOfDC" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="portOfDC" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Final Destination<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="finalDestination" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="finalDestination" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Country Of Final Destination<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="countryOfFinalDestination" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="countryOfFinalDestination" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Delivery Terms<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="deliveryTerms" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="deliveryTerms" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Payment Terms<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="paymentTerms" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="paymentTerms" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            BL No<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="blNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="blNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            BL Date<ValidationStar>*</ValidationStar>
                          </Typography>
                          <DatePicker
                            fullWidth
                            name="blDate"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            onChange={(date) => {
                              setFieldValue('blDate', date);
                            }}
                          />
                          <ErrorMessage name="blDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Vessel Name<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="vesselName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vesselName" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            VesselNo<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="vesselNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vesselNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Shipping Line Name<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="shippingLineName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="shippingLineName" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            ETA Date<ValidationStar>*</ValidationStar>
                          </Typography>
                          <DatePicker
                            fullWidth
                            name="etaDate"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            onChange={(date) => {
                              setFieldValue('etaDate', date);
                            }}
                          />
                          <ErrorMessage name="etaDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Free Days<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="freeDays" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="freeDays" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Total Net Weight<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="totalNetWeight" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="totalNetWeight" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Total Gross Weight<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="totalGrossWeight" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="totalGrossWeight" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            UOM<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="uom" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="uom" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Seal No <ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="sealNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="sealNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            CBM<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="cbm" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="cbm" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Invoice Remark<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="invoiceRemark" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="invoiceRemark" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Table>
              {renderTableHeader('additionalCharges', 'Additional Charges')}
              {showTableHeading.additionalCharges && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Inland Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="inlandCharges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="inlandCharges" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Freight Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="freightCharges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="freightCharges" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Inspection Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="inspectionCharges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="inspectionCharges" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>

            <Table>
              {renderTableHeader('itemsList', 'Items List')}
              {showTableHeading.itemsList && <ItemList po_id={ci_data?.opo_master?.po_masters[0]?.po_id} />}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}
