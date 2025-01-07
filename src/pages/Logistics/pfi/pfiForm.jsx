import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';

export default function PFIForm({ onClose, onSuccessfulSubmit, poData, closePfi }) {
  console.log('poData', poData);
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    additionalCharges: true
  });
  const [file, setFile] = useState(null);

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

  const initialFormValues = {
    pfi_sender_id: poData.VendorsMaster.vendor_name,
    pfi_sent_date: dayjs(),
    opr_no: poData.quo_num,
    company_id: '',
    pfi_num: poData.po_num,
    controlling_office: '',
    pfi_date: dayjs(),
    currency: '',
    exchange_date: dayjs(),
    shipment_mode: '',
    delivery_time: poData.lead_time,
    delivery_terms: 1,
    payment_terms: '',
    country_of_origin: '',
    country_of_supply: '',
    container_count_type: '',
    port_of_loading: '',
    port_of_discharge: '',
    final_destination: '',
    country_of_final_destination: '',
    pfi_description: '',
    freight_remark: '',

    inhand_charges: '',
    freight_charges: '',
    inspection_charges: '',

    thc_charges: '',
    container_stuffing: '',
    container_seal: '',
    bl: '',
    vgm: '',
    miscellaneous_fob: '',

    advising_commission: '',
    llc_commission: '',
    courier: '',
    miscellaneous_doc: '',
    document_name: ''
  };

  const validationSchema = Yup.object().shape({
    pfi_sender_id: Yup.string().required('This field is required'),
    // pfi_sent_date: Yup.string().required('This field is required').nullable(),
    opr_no: Yup.string().required('This field is required'),
    company_id: Yup.string().required('This field is required'),
    pfi_num: Yup.string().required('This field is required'),
    controlling_office: Yup.string().required('This field is required'),
    // pfi_date: Yup.string().required('This field is required').nullable(),
    currency: Yup.string().required('This field is required'),
    // exchange_date: Yup.string().required('This field is required').nullable(),
    shipment_mode: Yup.string().required('This field is required'),
    delivery_time: Yup.string().required('This field is required'),
    delivery_terms: Yup.string().required('This field is required'),
    payment_terms: Yup.string().required('This field is required'),
    country_of_origin: Yup.string().required('This field is required'),
    country_of_supply: Yup.string().required('This field is required'),
    container_count_type: Yup.string().required('This field is required'),
    port_of_loading: Yup.string().required('This field is required'),
    port_of_discharge: Yup.string().required('This field is required'),
    final_destination: Yup.string().required('This field is required'),
    country_of_final_destination: Yup.string().required('This field is required'),
    pfi_description: Yup.string().required('This field is required'),
    freight_remark: Yup.string().required('This field is required'),
    inhand_charges: Yup.string().required('Inhand Charges are required'),
    freight_charges: Yup.string().required('Freight Charges are required'),
    inspection_charges: Yup.string().required('Inspection Charges are required'),
    // fobCharges: Yup.string().required('FOB Charges are required'),
    thc_charges: Yup.string().required('THC Charges are required'),
    container_stuffing: Yup.string().required('Container Stuffing is required'),
    container_seal: Yup.string().required('Container Seal is required'),
    bl: Yup.string().required('BL is required'),
    vgm: Yup.string().required('VGM is required'),
    miscellaneous_fob: Yup.string().required('Miscellaneous charges are required'),
    advising_commission: Yup.string().required('Advising Commission is required'),
    llc_commission: Yup.string().required('LLC Commission is required'),
    courier: Yup.string().required('Courier charges are required'),
    miscellaneous_doc: Yup.string().required('Miscellaneous charges are required')
  });

  const handleDrop = (e) => {
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

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };
  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (values, actions) => {
    console.log('Form values:', values);

    try {
      const { data } = await axiosInstance.post('/api/pfi/create', values);
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.message);
    }

    if (onSuccessfulSubmit) {
      onSuccessfulSubmit(values);
    }
    actions.resetForm();
    closePfi();
  };
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Create PFI</span>
          <PlusButton label="Back" onClick={closePfi} />
        </Box>
      }
    >
      <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue, resetForm }) => (
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
                            PFI Sender<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="pfi_sender_id" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="pfi_sender_id" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            PI Sender Date<ValidationStar>*</ValidationStar>
                          </Typography>

                          <DatePicker
                            fullWidth
                            name="pfi_sent_date"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            value={values.pfi_sent_date}
                            onChange={(date) => {
                              setFieldValue('pfi_sent_date', date);
                            }}
                          />

                          <ErrorMessage name="pfi_sent_date" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            OPR No. <ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="opr_no" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="opr_no" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Company<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="company_id" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="company_id" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            PI No<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="pfi_num" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="pfi_num" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Controlling Office<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="controlling_office" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="controlling_office" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            PI Date<ValidationStar>*</ValidationStar>
                          </Typography>
                          <DatePicker
                            fullWidth
                            name="pfi_date"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            value={values.pfi_date}
                            onChange={(date) => {
                              setFieldValue('pfi_date', date);
                            }}
                          />
                          <ErrorMessage name="pfi_date" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Currency<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="currency" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="currency" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Exchange Date<ValidationStar>*</ValidationStar>
                          </Typography>

                          <DatePicker
                            fullWidth
                            name="exchange_date"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            value={values.exchange_date}
                            onChange={(date) => {
                              setFieldValue('exchange_date', date);
                            }}
                          />
                          {/* <Field as={FieldPadding} name="exchange_date" variant="outlined" fullWidth size="small" /> */}
                          <ErrorMessage name="exchange_date" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Shipment Mode<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="shipment_mode" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="shipment_mode" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Delivery Time<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="delivery_time" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="delivery_time" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Delivery Terms<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="delivery_terms" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="delivery_terms" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Payment Terms<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="payment_terms" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="payment_terms" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Country Of Origin<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="country_of_origin" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="country_of_origin" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Country Of Supply<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="country_of_supply" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="country_of_supply" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Container Count Type<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="container_count_type" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="container_count_type" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Port of Loading<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="port_of_loading" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="port_of_loading" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Port Of Discharge<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="port_of_discharge" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="port_of_discharge" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Final Destination<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="final_destination" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="final_destination" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Country Of Final Destination<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="country_of_final_destination" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="country_of_final_destination" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            PI Description<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="pfi_description" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="pfi_description" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Freight Remark<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="freight_remark" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="freight_remark" component="div" style={errorMessageStyle} />
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
                            Inhand Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="inhand_charges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="inhand_charges" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Freight Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="freight_charges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="freight_charges" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Inspection Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="inspection_charges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="inspection_charges" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12}>
                          <Typography variant="subtitle1">
                            FOB Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            THC Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="thc_charges" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="thc_charges" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Container Stuffing<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="container_stuffing" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="container_stuffing" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Container Seal<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="container_seal" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="container_seal" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Bl<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="bl" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="bl" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            VGM<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="vgm" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vgm" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Miscellaneous<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="miscellaneous_fob" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="miscellaneous_fob" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12}>
                          <Typography variant="subtitle1">
                            Doc Charges<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Advising Commission <ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="advising_commission" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="advising_commission" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            LLC Commission<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="llc_commission" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="llc_commission" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Courier<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="courier" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="courier" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Miscellaneous<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="miscellaneous_doc" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="miscellaneous_doc" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
                        <Grid
                          marginTop="10px"
                          item
                          xs={12}
                          sm={4}
                          borderRadius="15px"
                          style={{
                            border: '2px dashed #000',
                            padding: '30px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={handleClick}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            <Typography variant="body1" style={{ marginBottom: '8px' }}>
                              <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                            </Typography>
                            {file ? (
                              file.name
                            ) : (
                              <>
                                <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                                  {values?.document_name ? values?.document_name : 'Upload file'}
                                </label>
                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                              </>
                            )}
                          </div>
                        </Grid>
                        <ErrorMessage name="document_name" component="div" style={errorMessageStyle} />
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
                  closePfi();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}
