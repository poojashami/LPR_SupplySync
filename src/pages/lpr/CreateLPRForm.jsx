import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SelectFieldPadding from 'components/selectFieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ItemForm from './ItemForm';
import ItemTable from './ItemTable';

const CreateLPRForm = ({ onSubmit, onCancel }) => {
  const [fileArray, setFileArray] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);

  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });
  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    heading2: true,
    heading3: true
  });
  // Validation schema
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
    lprDate: Yup.date().required('Date is required')
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
    lprDate: '',
    additionalRemarks: ''
  };
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const handleFileChangeFile = (e) => {
    const files = e.target.files;
    setFileArray(files);
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
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
      {!showItemForm ? (
        <>
          <Table>{renderTableHeader('lprForm', 'Create LPR')}</Table>
          {showTableHeading.lprForm && (
            <Box padding={1}>
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          LPR Date<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="lprDate" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Vertical<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="vertical" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="vertical" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Company<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="company" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="company" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Division<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="division" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="division" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Requested By Department<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="requestedByDept" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="requestedByDept" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Requested By<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="requestedBy" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="requestedBy" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Quotations Email Alert<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="quotationEmailAlert" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="quotationEmailAlert" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          No. Min Quotation<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="noMinQuote" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="noMinQuote" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          LPR Category<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={FieldPadding} name="lprCategory" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="lprCategory" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Delivery Type<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field as={SelectFieldPadding} name="deliveryType" variant="outlined" value="deliveryType" fullWidth>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>

                          <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
                          <MenuItem value="Supplier Warehouse">Supplier Warehouse</MenuItem>
                        </Field>
                        <ErrorMessage name="shipmentMode" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Delivery Time<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={2} paddingTop={'20px'}>
                        <Field
                          as={FieldPadding}
                          name="deliveryTime"
                          variant="outlined"
                          fullWidth
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end" sx={{ fontSize: '8px' }}>
                                Days
                              </InputAdornment>
                            )
                          }}
                        />
                        <ErrorMessage name="deliveryTime" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={3}></Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body" style={{ fontSize: '11px' }}>
                          Additional Remarks
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="additionalRemarks" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="additionalRemarks" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={4} marginTop={'5px'}>
                        <Typography variant="body2">
                          Procurement Indent<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: '5px', height: '75px' }}>
                          <Button
                            fullWidth
                            component="label"
                            sx={{ marginBottom: '0' }}
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                          >
                            {fileArray?.length > 0
                              ? `${fileArray?.length} ${fileArray?.length === 1 ? 'File' : 'Files'} uploaded`
                              : 'Upload File'}
                            <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChangeFile(e)} />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowItemForm(true)}
                      >
                        Add Items
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
        </>
      ) : (
        <>
          <ItemForm />
          <ItemTable />
        </>
      )}
    </Box>
  );
};

export default CreateLPRForm;
