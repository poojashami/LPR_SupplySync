import dayjs from 'dayjs';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { MenuItem, Select, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import PlusButton from 'components/CustomButton';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import FieldPadding from 'components/FieldPadding';
import { axiosInstance } from 'utils/axiosInstance';
import ValidationStar from 'components/ValidationStar';
import CustomTypography from 'components/CustomTypography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { errorMessageStyle } from 'components/StyleComponent';
import { FieldArray, Formik, Field, Form, ErrorMessage } from 'formik';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button } from '@mui/material';
import SelectFieldPadding from 'components/selectFieldPadding';

export default function FinalBulkTerminalUSD() {
  const initialExpenses = [
    { expense: 'Cargo Dues', unit: '', rate_usd: '', amount_usd: '', amount_ngn: '', remark: '' },
    { expense: 'Documentation Per Manifest', unit: '', rate_usd: '', amount_usd: '', amount_ngn: '', remark: '' },
    { expense: 'Security Ch', unit: '', rate_usd: '', amount_usd: '', amount_ngn: '', remark: '' },
    { expense: 'Berth rent', unit: '', rate_usd: '', amount_usd: '', amount_ngn: '', remark: '' },
    { expense: 'Contingency Deposit', unit: '', rate_usd: '', amount_usd: '', amount_ngn: '', remark: '' },
    { expense: 'Stamp Duty', unit: '', rate_usd: '', amount_usd: '', amount_ngn: '', remark: '' }
  ];
  const [rows, setRows] = useState(initialExpenses);
  const [discount, setDiscount] = useState(0);
  const [amountAdjusted, setAmountAdjusted] = useState(0);
  const initialFormValues = {
    vesselName: '',
    billNo: '',
    billDate: null,
    amount: 0,
    vat: 0,
    total: 0,
    remark: '',
    sadDocument: ''
  };
  const initialFormValuesPayment = {
    paymentDoneBy: ''
  };

  const validationSchema = Yup.object({
    vesselName: Yup.string().required('Shipment Line is required'),
    billNo: Yup.string().required('Bill No is required'),
    billDate: Yup.date().required('Bill Date is required'),
    vat: Yup.number().required('VAT is required'),
    remark: Yup.string().required('remark is required'),
    sadDocument: Yup.mixed().required('SAD Document is required')
  });
  const validationSchemaPayment = Yup.object({
    vesselName: Yup.string().required('Shipment Line is required'),
    billNo: Yup.string().required('Bill No is required'),
    billDate: Yup.date().required('Bill Date is required'),
    vat: Yup.number().required('VAT is required'),
    remark: Yup.string().required('remark is required'),
    sadDocument: Yup.mixed().required('SAD Document is required')
  });

  const [showTableHeading, setShowTableHeading] = useState({
    invoiceDetail: true,
    expenseInformation: true,
    paymentInformation: true
  });

  const [sadFile, setSadFile] = useState(null);
  const navigate = useNavigate();

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
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
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
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file only.');
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

  const handleSubmitForm = async (values, actions) => {
    try {
      const { data } = await axiosInstance.post(
        '/api/commercial/invoice/shipping/expense',
        {
          // ci_id: showShippingExpenseData?.ci_id,
          // ci_num: showShippingExpenseData?.ci_num,
          // pfi_id: showShippingExpenseData?.pfi_id,
          // pfi_num: showShippingExpenseData?.pfi_num,
          provision: provision,
          vesselName: values.vesselName,
          billNo: values.billNo,
          billDate: values.billDate,
          amount: TotalAmount,
          vat: values.vat,
          total: Number(values.vat) + Number(TotalAmount),
          remark: values.remark,
          sadFile,
          expenses
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSadFile(null);
      toast.success(data.message);
      setShowShippingExpense(false);
    } catch (error) {
      toast.error(error.message);
    }

    if (onSuccessfulSubmit) {
      onSuccessfulSubmit(values);
    }
    actions.resetForm();
    onClose();
  };

  const TableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="body" width={25}>
            Sr No.
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Expense</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Unit</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body">Rate in USD</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body">Amount in USD</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Amount in NGN</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Remark</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const handleChange = (index, field) => (e) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = e.target.value;

    // Convert amount_usd to a number if the field is being edited
    if (field === 'amount_usd') {
      updatedRows[index][field] = parseFloat(e.target.value) || 0;
    }

    setRows(updatedRows);
  };

  // Add a new row
  const addNewRow = () => {
    setRows([...rows, { expense: '', unit: '', rate_usd: '', amount_usd: 0, amount_ngn: '', remark: '' }]);
  };
  const totalAmountBeforeAdjustment = rows.reduce((sum, row) => sum + (parseFloat(row.amount_usd) || 0), 0);

  const totalAmountAfterDiscountAdjustment = totalAmountBeforeAdjustment - (parseFloat(discount) || 0) - (parseFloat(amountAdjusted) || 0);

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Final Bulk Terminal Expense Detail(USD)
          {/* <PlusButton
            label="Back"
            onClick={() => {
              setShowShippingExpense(!showShippingExpense);
              navigate('/operations/shipping');
            }}
          /> */}
        </Box>
      }
    >
      <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmitForm}>
        {({ values, resetForm, setFieldValue }) => (
          <>
            <Form>
              <Table>
                {renderTableHeader('invoiceDetail', 'Invoice Details')}
                {showTableHeading.invoiceDetail && (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Vessel Name<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} name="vesselName" variant="outlined" fullWidth size="small" />
                      <ErrorMessage name="vesselName" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Bill No <ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} name="billNo" variant="outlined" fullWidth size="small" />
                      <ErrorMessage name="billNo" component="div" style={errorMessageStyle} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Bill Date<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} type="date" name="billDate" variant="outlined" fullWidth size="small" />

                      <ErrorMessage name="billDate" component="div" style={errorMessageStyle} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Amount<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} value="amount" name="amount" variant="outlined" fullWidth disabled size="small" />{' '}
                      <ErrorMessage name="amount" component="div" style={errorMessageStyle} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        VAT<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} name="vat" variant="outlined" fullWidth size="small" />
                      <ErrorMessage name="vat" component="div" style={errorMessageStyle} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Total<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field
                        as={FieldPadding}
                        // value={Number(values.vat) + Number(5)}
                        name="total"
                        variant="outlined"
                        fullWidth
                        disabled
                        size="small"
                      />
                      <ErrorMessage name="total" component="div" style={errorMessageStyle} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Remark<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} name="remark" variant="outlined" fullWidth size="small" />
                      <ErrorMessage name="remark" component="div" style={errorMessageStyle} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Exchange Rate<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <Field as={FieldPadding} name="exchangeRate" variant="outlined" fullWidth size="small" />
                      <ErrorMessage name="exchangeRate" component="div" style={errorMessageStyle} />
                    </Grid>
                  </Grid>
                )}
              </Table>
            </Form>
          </>
        )}
      </Formik>

      <Grid container spacing={2} sx={{ marginTop: 2 }} display={'flex'} alignItems={'flex-end'}>
        <Table>
          {renderTableHeader('expenseInformation', 'Expense Information')}
          {showTableHeading.expenseInformation && (
            <>
              <TableHeader />
              <TableBody>
                {rows.map((value, index) => (
                  <TableRow key={index} padding="0">
                    {/* Sr No. */}
                    <TableCell
                      sx={{
                        '& .MuiTableCell-root': {
                          padding: '5px '
                        }
                      }}
                    >
                      <Typography variant="body2">{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={`rows[${index}].expense`}
                        value={value.expense}
                        onChange={handleChange(index, 'expense')}
                        placeholder="Enter Expense Heading"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '5px '
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={`rows[${index}].unit`}
                        value={value.unit}
                        onChange={handleChange(index, 'unit')}
                        placeholder="Enter Unit"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '5px '
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={`rows[${index}].rate_usd`}
                        value={value.rate_usd}
                        onChange={handleChange(index, 'rate_usd')}
                        placeholder="Enter Rate in USD"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '5px '
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={`rows[${index}].amount_usd`}
                        value={value.amount_usd}
                        onChange={handleChange(index, 'amount_usd')}
                        placeholder="Enter Amount in USD"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '5px '
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={`rows[${index}].amount_ngn`}
                        value={value.amount_ngn}
                        onChange={handleChange(index, 'amount_ngn')}
                        placeholder="Enter Amount in NGN"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '5px '
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={`rows[${index}].remark`}
                        value={value.remark}
                        onChange={handleChange(index, 'remark')}
                        placeholder="Enter Remark"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '5px '
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell></TableCell>

                  <TableCell>
                    <Button variant="contained" color="primary" onClick={addNewRow}>
                      Add Row
                    </Button>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>

                  <TableCell>
                    <div style={{ fontSize: '12px' }}>Subtotal</div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>6687</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>2768</div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>

                  <TableCell>
                    <div style={{ fontSize: '12px' }}>Vat</div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>6687</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>2768</div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <strong style={{ fontSize: '12px', fontWeight: 700 }}>Total Amount Before Adjustment</strong>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <strong style={{ fontSize: '12px', fontWeight: 700 }}>4000</strong>
                  </TableCell>
                  <TableCell>
                    <strong style={{ fontSize: '12px', fontWeight: 700 }}>2000</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>Less - Discount (if Any)</div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>843</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>46</div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>Less - Amount Adjusted</div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>90</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: '12px' }}>20</div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <strong style={{ fontSize: '12px', fontWeight: 700 }}>Total Amount After Discount/Adjustment </strong>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <strong style={{ fontSize: '12px', fontWeight: 700 }}>5000</strong>
                  </TableCell>
                  <TableCell>
                    <strong style={{ fontSize: '12px', fontWeight: 700 }}>6900</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </>
          )}
        </Table>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <CustomTypography variant="body">
            SAD Document<ValidationStar>*</ValidationStar>
          </CustomTypography>
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
              <CustomTypography variant="body1" style={{ marginBottom: '8px' }}>
                <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
              </CustomTypography>
              {sadFile ? (
                sadFile.name
              ) : (
                <>
                  <label htmlFor="sadFileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                    Upload File
                    {/* {values?.sadDocument ? values?.sadDocument : ' fUploadile'} */}
                  </label>
                  <input
                    type="file"
                    id="sadFileInput"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(e, setSadFile)}
                    accept=".pdf"
                  />
                </>
              )}
            </div>
          </Grid>
          {/* <ErrorMessage name="sadDocument" component="div" style={errorMessageStyle} /> */}
        </Grid>
        <Grid item xs={3}></Grid>

        <Grid item xs={1}>
          <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
            Submit
          </Button>
        </Grid>
      </Grid>
      <Grid sx={{ marginTop: 2 }}>
        <Formik initialValues={initialFormValuesPayment} validationSchema={validationSchemaPayment} onSubmit={handleSubmitForm}>
          {({ values, resetForm, setFieldValue }) => (
            <>
              <Form>
                <Table>
                  {renderTableHeader('paymentInformation', 'Payment Information')}
                  {showTableHeading.paymentInformation && (
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <CustomTypography variant="body">
                          Payment Done By<ValidationStar>*</ValidationStar>
                        </CustomTypography>
                        <Field as={SelectFieldPadding} name="paymentDoneBy" variant="outlined" value={values.paymentDoneBy} fullWidth>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Client">Client</MenuItem>
                          <MenuItem value="Agent">Agent</MenuItem>
                        </Field>
                      </Grid>
                      {values.paymentDoneBy === 'Agent' && (
                        <>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography variant="body">
                              Payment Date<ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <Field as={FieldPadding} type="date" name="billDate" variant="outlined" fullWidth size="small" />

                            <ErrorMessage name="billDate" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography variant="body">
                              Payment Amount<ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <Field as={FieldPadding} value="amount" name="amount" variant="outlined" fullWidth disabled size="small" />{' '}
                            <ErrorMessage name="amount" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography variant="body">
                              Paid Through Bank<ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <Field as={FieldPadding} name="vat" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="vat" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography variant="body">
                              Ref No <ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <Field as={FieldPadding} name="billNo" variant="outlined" fullWidth size="small" />
                            <ErrorMessage name="billNo" component="div" style={errorMessageStyle} />
                          </Grid>
                          <Grid item xs={4}>
                            <CustomTypography variant="body">
                              Upload Payment Copy<ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <input type="file" style={{ display: 'block', marginTop: '8px' }} required />
                          </Grid>
                        </>
                      )}
                      <Grid item xs={12}>
                        <Box display={'flex'} justifyContent={'end'} textAlign={'center'}>
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
                            Back
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Table>
              </Form>
            </>
          )}
        </Formik>
      </Grid>
    </MainCard>
  );
}
