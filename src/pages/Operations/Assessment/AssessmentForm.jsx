import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  IconButton,
  Button,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomNumberField from 'components/NoArrowTextField';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

// const validationSchema = Yup.object().shape({
//   cNumber: Yup.string().required('This field is required'),
//   assessmentDate: Yup.date().required('This field is required').nullable(),
//   assessNo: Yup.string().required('This field is required'),
//   agentName: Yup.string().required('This field is required'),
//   dutyPaidToBank: Yup.string().required('This field is required'),

//   exchangeRate: Yup.string().required('This field is required'),
//   cifValue: Yup.date().required('This field is required').nullable(),
//   dutyAmount: Yup.string().required('This field is required'),
//   surchargeAmount: Yup.string().required('Inhand Charges are required'),
//   cissAmount: Yup.string().required('Freight Charges are required'),
//   etlsAmount: Yup.string().required('Inspection Charges are required'),
//   levyAmount: Yup.string().required('THC Charges are required'),
//   vatAmount: Yup.string().required('Container Stuffing is required'),
//   totalDuty: Yup.string().required('Total duty is required')
// });

export default function AssessmentForm({ onSuccessfulSubmit, assessmentData }) {
  const initialFormValues = {
    pfi_id: assessmentData?.pfi_id,
    pfi_num: assessmentData?.pfi_num,
    ci_id: assessmentData?.ci_id,
    ci_num: assessmentData?.ci_num,
    cNumber: assessmentData?.assessments?.c_number,
    assessmentDate: assessmentData?.assessments?.assessment_date,
    assessNo: assessmentData?.assessments?.assess_num,
    agentName: assessmentData?.assessments?.agent_name,
    dutyPaidToBank: assessmentData?.assessments?.duty_to_be_paid_to_bank,
    // rotation_no: assessmentData?.assessments?.rotation_no,
    exchangeRate: assessmentData?.assessments?.exchange_rate,
    cifValue: assessmentData?.assessments?.cif_value,
    dutyAmount: assessmentData?.assessments?.duty_amount,
    surchargeAmount: assessmentData?.assessments?.surcharge_amount,
    cissAmount: assessmentData?.assessments?.ciss_amount,
    etlsAmount: assessmentData?.assessments?.elts_amount,
    levyAmount: assessmentData?.assessments?.levy_amount,
    vatAmount: assessmentData?.assessments?.vat_amount,
    // penaltyAmount: assessmentData?.assessments?.penalty_amount,
    totalDuty: assessmentData?.assessments?.total_duty,
    assessmentDocument: null,
    sadDocument: null
  };

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    additionalCharges: true,
    dutyCharges: true
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [assessmentFile, setAssessmentFile] = useState(null);
  const [paymentType, setPaymentType] = useState([]);
  const [sadFile, setSadFile] = useState(null);
  const [payment_data, setPayment_data] = useState({
    doc_id: 1,
    doc_type: 'assesment_ci',
    po_number: '',
    po_amount: '',
    remarks: '',
    payment_type_id: 1
  });

  const GetpaymentTerms = async () => {
    try {
      const { data } = await axiosInstance.get('/api/transport/payment/type/');
      setPaymentType(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  React.useEffect(() => {
    GetpaymentTerms();
  }, []);

  const createPayment = async () => {
    try {
      const { data } = await axiosInstance.post('/api/paymentrequests', payment_data);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
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
  const handleDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer?.files[0];
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

  const handleFileSelect = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleClick = (id) => {
    document.getElementById(id).click();
  };

  const handleSubmit = async (values, actions) => {
    console.log('Form values:', values);
    const { data } = await axiosInstance.post('/api/operation/assessment', values, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(data);
    setShowTableHeading({ ...showTableHeading, dutyCharges: true });
    setSnackbarMessage('Form submitted successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    if (onSuccessfulSubmit) {
      onSuccessfulSubmit(values);
    }
    actions.resetForm();
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
      <Formik
        initialValues={initialFormValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
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
                            Assessment Date<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} type="date" name="assessmentDate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="assessmentDate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            C Number<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="cNumber" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="cNumber" component="div" style={errorMessageStyle} />
                        </Grid>
                        {/* <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Rotation Number<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="rotation_no" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="rotation_no" component="div" style={errorMessageStyle} />
                        </Grid> */}

                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Assess No. <ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="assessNo" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="assessNo" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Agent Name<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="agentName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="agentName" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Duty Paying Bank<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={FieldPadding} name="dutyPaidToBank" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="dutyPaidToBank" component="div" style={errorMessageStyle} />
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
                            Exchange Rate<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="exchangeRate" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="exchangeRate" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            CIF Value<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="cifValue" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="cifValue" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Duty Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="dutyAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="dutyAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Surcharge Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="surchargeAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="surchargeAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            CISS Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="cissAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="cissAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            ETLS Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="etlsAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="etlsAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Levy Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="levyAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="levyAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Vat Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="vatAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="vatAmount" component="div" style={errorMessageStyle} />
                        </Grid>
                        {/* <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Penalty Amount<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="penaltyAmount" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="penaltyAmount" component="div" style={errorMessageStyle} />
                        </Grid> */}
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body">
                            Total Duty<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Field as={CustomNumberField} type="number" name="totalDuty" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="totalDuty" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} marginTop={1}>
                        <Grid item xs={6}>
                          <Typography variant="body">
                            Assessment Document<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Grid
                            marginTop="10px"
                            item
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
                            onDrop={(e) => handleDrop(e, setAssessmentFile)}
                            onDragOver={handleDragOver}
                            onClick={() => handleClick('assessmentFileInput')}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                                <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                              </Typography>
                              {assessmentFile ? (
                                assessmentFile.name
                              ) : (
                                <>
                                  <label htmlFor="assessmentFileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                                    {values?.assessmentDocument ? values?.assessmentDocument : 'Upload file'}
                                  </label>
                                  <input
                                    type="file"
                                    id="assessmentFileInput"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      setFieldValue('assessmentDocument', e.target.files[0]);
                                      handleFileSelect(e, setAssessmentFile);
                                    }}
                                    accept=".pdf"
                                  />
                                </>
                              )}
                            </div>
                          </Grid>
                          <ErrorMessage name="assessmentDocument" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body">
                            SAD Document<ValidationStar>*</ValidationStar>
                          </Typography>
                          <Grid
                            marginTop="10px"
                            item
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
                            onDrop={(e) => handleDrop(e, setSadFile)}
                            onDragOver={handleDragOver}
                            onClick={() => handleClick('sadFileInput')}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                                <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                              </Typography>
                              {sadFile ? (
                                sadFile.name
                              ) : (
                                <>
                                  <label htmlFor="sadFileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                                    {values?.sadDocument ? values?.sadDocument : 'Upload file'}
                                  </label>
                                  <input
                                    type="file"
                                    id="sadFileInput"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      setFieldValue('sadDocument', e.target.files[0]);
                                      handleFileSelect(e, setSadFile);
                                    }}
                                    accept=".pdf"
                                  />
                                </>
                              )}
                            </div>
                          </Grid>
                          <ErrorMessage name="sadDocument" component="div" style={errorMessageStyle} />
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
              {/* <Button
                variant="outlined"
                color="error"
                type="button"
                onClick={() => {
                  resetForm();
                }}
              >
                Cancel
              </Button> */}
            </Box>

            <Table>
              {renderTableHeader('dutyCharges', 'Duty Charges')}
              {showTableHeading.dutyCharges && (
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Typography variant="body1" color="black">
                            Duty Payable Charge
                          </Typography>
                          <TextField
                            id="amount"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            name="po_amount"
                            value={payment_data?.po_amount}
                            onChange={(e) => setPayment_data({ ...payment_data, [e.target.name]: e.target.value })}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="black">
                            Duty Payable Charge Remarks
                          </Typography>
                          <TextField
                            id="remarks"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            name="remarks"
                            value={payment_data?.remarks}
                            onChange={(e) => setPayment_data({ ...payment_data, [e.target.name]: e.target.value })}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="black">
                            Payment Type
                          </Typography>
                          <Select
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            fullWidth
                            name="payment_type_id"
                            value={payment_data?.payment_type_id}
                            onChange={(e) => setPayment_data({ ...payment_data, [e.target.name]: e.target.value })}
                            defaultValue={1}
                          >
                            {paymentType?.map((item, index) => (
                              <MenuItem key={index} value={item?.payment_type_transport_master_id}>
                                {item?.payment_type_transport_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item>
                          <Button sx={{ marginTop: '20px' }} onClick={createPayment} variant="contained" color="primary">
                            Submit
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
    </>
  );
}
