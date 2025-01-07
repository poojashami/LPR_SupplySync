// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  Typography,
  TableContainer,
  Paper,
  Autocomplete
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import FieldPadding from 'components/FieldPadding';
import CustomTypography from 'components/CustomTypography';
import { minWidth, width } from '@mui/system';

const KnockOffForm = () => {
  const [showDetails, setShowDetails] = useState(false); // State to manage visibility

  const [initialValues, setInitialValues] = useState({
    bidPurchase: '',
    purchaseDate: '',
    currency: '',
    amount_purchased: '',
    description: '',
    formmNo: '',
    lcNo: '',
    purchaseNo: '',
    bank: '',
    amount: '',
    adjustment: '',
    iffLoan: '',
    totalBidded: '',
    rate: '',
    transactionDate: '',
    maturityDate: '',
    remarks: ''
  });
  const [showTableHeading, setShowTableHeading] = useState({
    basicInformation: true,
    forexTable: true,
    searchOption: true
  });

  const validationSchema = Yup.object({
    bidPurchase: Yup.string().required('Bid / Purchase is required'),
    purchaseDate: Yup.date().required('Purchase Date is required'),
    currency: Yup.string().required('Currency is required'),
    amount_purchased: Yup.string().required('amount_purchased is required'),
    description: Yup.string().required('Description is required'),
    formmNo: Yup.string().required('FORMM No is required'),
    lcNo: Yup.string().required('LC No is required'),
    purchaseNo: Yup.string().required('Purchase Company is required'),
    bank: Yup.string().required('Bank is required'),
    amount: Yup.number().required('Amount is required').positive(),
    adjustment: Yup.number().required('Adjustment is required').positive(),
    iffLoan: Yup.number().required('IFF Loan is required').positive(),
    totalBidded: Yup.number().required('Total Bidded is required').positive(),
    rate: Yup.number().required('Rate is required').positive(),
    transactionDate: Yup.date().required('Transaction Date is required'),
    maturityDate: Yup.date().required('Maturity Date is required'),
    remarks: Yup.string().required('Remarks are required')
  });

  const validationSchemaFormM = Yup.object({
    forexToPurchased: Yup.string().required('FORM M No is required')
  });
  const initialValuesFormM = {
    forexToPurchased: ''
  };
  const formMOptions = ['F001', 'F002', 'F003', 'F004'];
  const handleSearch = (values) => {
    console.log('Form Submitted with values:', values);
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
        <TableCell sx={{ padding: 0 }} colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <CustomTypography variant="h7" fontWeight={600}>
              {sectionLabel}
            </CustomTypography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    // Append each form value to FormData
    formData.append('bidPurchase', values.bidPurchase);
    formData.append('purchaseDate', values.purchaseDate);
    formData.append('currency', values.currency);
    formData.append('amount_purchased', values.amount_purchased);
    formData.append('description', values.description);
    formData.append('formmNo', values.formmNo);
    formData.append('lcNo', values.lcNo);
    formData.append('purchaseNo', values.purchaseNo);
    formData.append('bank', values.bank);
    formData.append('amount', values.amount);
    formData.append('adjustment', values.adjustment);
    formData.append('iffLoan', values.iffLoan);
    formData.append('totalBidded', values.totalBidded);
    formData.append('rate', values.rate);
    formData.append('transactionDate', values.transactionDate);
    formData.append('maturityDate', values.maturityDate);
    formData.append('remarks', values.remarks);
    // Log each form field value to the console
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setSubmitting(false);
  };

  const tables = [
    {
      title: 'PFI',
      columns: ['Sr No', 'Category', 'Unit Name', 'No', 'Type', 'Currency', 'Amount'],
      dataKey: 'pfiData'
    },
    {
      title: 'FORM M',
      columns: ['No.', 'Amount', 'Bank'],
      dataKey: 'formMData'
    },
    {
      title: 'LC',
      columns: ['No.', 'Amount'],
      dataKey: 'lcData'
    },
    {
      title: 'CI',
      columns: ['No.', 'Count', 'Amount'],
      dataKey: 'ciData'
    },
    {
      title: 'Shipment',
      columns: ['Status.', 'Pending Amt', 'Excess'],
      dataKey: 'shipmentData'
    },
    {
      title: 'Adjusment',
      columns: ['To Form M.', 'Amount', 'From Form M', 'Amount'],
      dataKey: 'adjusmentData'
    },
    {
      title: 'FOREX Purchased',
      columns: ['Amount', 'Outstanding', 'Advance'],
      dataKey: 'forexPurchased'
    },
    {
      title: 'Payment Receipt Confirmation',
      columns: ['Payment Status'],
      dataKey: 'paymentReceived'
    }
  ];
  const otherTableData = {
    pfiData: [
      { sr_no: 1, category: 'Electronics', unit_name: 'Unit A', no: 'F123', type: 'Import', currency: 'USD', amount: 5000 },
      { sr_no: 2, category: 'Machinery', unit_name: 'Unit B', no: 'F124', type: 'Export', currency: 'EUR', amount: 6000 }
    ],
    formMData: [
      { no: 'F123', amount: 5000, bank: 'Bank A' },
      { no: 'F124', amount: 6000, bank: 'Bank B' }
    ],
    lcData: [
      { no: 'L001', amount: 10000 },
      { no: 'L002', amount: 15000 }
    ],
    ciData: [
      { no: 'C001', count: 5, amount: 20000 },
      { no: 'C002', count: 10, amount: 30000 }
    ],
    shipmentData: [
      { status: 'Partial 1', pendingAmt: 80000, excess: '-' },
      { status: 'Partial 2', pendingAmt: 80000, excess: '-' }
    ],
    adjusmentData: [
      { toFormM: 'Partial 1', amount: 80000, fromFormM: '-', amount: 80000 },
      { toFormM: 'Partial 2', amount: 80000, fromFormM: '-', amount: 80000 }
    ],
    forexPurchased: [
      { amount: 80000, outstanding: '-', advance: 80000 },
      { amount: 80000, outstanding: '-', advance: 80000 }
    ],
    paymentReceived: [{ payment_status: 'Received' }, { payment_status: 'Pending' }]
  };

  const tableStyles = {
    border: '1px solid #ddd',
    fontSize: '12px',
    '& th, & td': {
      padding: '3px',
      border: '1px solid #ddd'
    }
    // minWidth: '300px'
  };
  const mapColumnToDataKey = (columnName) => {
    const keyMap = {
      'Sr No': 'sr_no',
      Category: 'category',
      'Unit Name': 'unit_name',
      'No.': 'no',
      Type: 'type',
      Currency: 'currency',
      Amount: 'amount',
      Bank: 'bank',
      Count: 'count',
      'Status.': 'status',
      'Pending Amt': 'pendingAmt',
      Excess: 'excess'
    };
    return keyMap[columnName] || columnName.toLowerCase().replace(' ', '_');
  };

  const tableData = [
    { ciNo: 'CI001', ciAmount: 5000 },
    { ciNo: 'CI002', ciAmount: 3000 },
    { ciNo: 'CI003', ciAmount: 7000 }
  ];

  return (
    <MainCard title={'Knocking off the Invoice'}>
      <Formik initialValues={initialValuesFormM} validationSchema={validationSchemaFormM} onSubmit={handleSearch}>
        {({ values, setFieldValue }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <CustomTypography>
                          Search FORM M No
                          <ValidationStar />
                        </CustomTypography>
                        <Autocomplete
                          options={formMOptions}
                          getOptionLabel={(option) => option}
                          value={values.forexToPurchased || null} // Bind to Formik state
                          onChange={(e, value) => {
                            setFieldValue('forexToPurchased', value || '');
                            setShowDetails(!!value); // Show details if a value is selected
                          }}
                          renderInput={(params) => (
                            <TextField {...params} name="forexToPurchased" variant="outlined" size="small" fullWidth />
                          )}
                        />
                        <ErrorMessage name="forexToPurchased" component="div" style={errorMessageStyle} />
                      </Grid>

                      {/* Conditionally Rendered Details */}
                      {showDetails && (
                        <>
                          <Grid item xs={12} sm={3}>
                            <CustomTypography fontWeight="600">Total FOREX Purchased For</CustomTypography>
                            <CustomTypography>jhdsjhdb</CustomTypography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography fontWeight="600">Currency</CustomTypography>
                            <CustomTypography>USD</CustomTypography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography fontWeight="600">Form M Bank</CustomTypography>
                            <CustomTypography>Bank A</CustomTypography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <CustomTypography fontWeight="600">Value Date</CustomTypography>
                            <CustomTypography>10 Dec 2024</CustomTypography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>
        )}
      </Formik>

      {showDetails && (
        <>
          <TableContainer>
            <Table>
              {renderTableHeader('forexTable', 'FORM M Detail')}
              {showTableHeading.forexTable && (
                <Box sx={{ display: 'flex' }}>
                  {tables.map((table, index) => (
                    <Table
                      key={index}
                      sx={{
                        ...tableStyles,
                        minWidth: `${100 + table.columns.length * 50}px`, // Dynamically adjust based on columns
                        maxWidth: '100%'
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={table.columns.length} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            <Typography variant="h6" fontWeight={'700'} fontSize={'12px'}>
                              {table.title}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableHead>
                        <TableRow>
                          {table.columns.map((col, idx) => (
                            <TableCell key={idx} sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                              {col}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {otherTableData[table.dataKey]?.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {table.columns.map((col, colIdx) => {
                              const dataKey = mapColumnToDataKey(col);
                              return (
                                <TableCell key={colIdx} sx={{ fontSize: '10px' }}>
                                  {row[dataKey] || '-'}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ))}
                </Box>
              )}
            </Table>
          </TableContainer>
          <Table sx={{ mt: 3 }}>
            {renderTableHeader('detail', 'Detail')}
            {showTableHeading.detail && (
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TableContainer>
                    <Table
                      sx={{
                        ...tableStyles
                      }}
                    >
                      {/* Table Header */}
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6" fontWeight={'700'} fontSize={'12px'}>
                              CI No
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6" fontWeight={'700'} fontSize={'12px'}>
                              CI Amount
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6" fontWeight={'700'} fontSize={'12px'}>
                              Knock Off Amount
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      {/* Table Body */}
                      <TableBody>
                        {tableData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontSize: '11px' }}>{row.ciNo}</TableCell>
                            <TableCell sx={{ fontSize: '11px' }}>{row.ciAmount}</TableCell>
                            <TableCell sx={{ fontSize: '11px' }}>
                              <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                placeholder="Enter amount"
                                sx={{
                                  '& input': { fontSize: '12px' } // Adjust font size for the text field input
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={6}>
                  <CustomTypography>Payment Talex</CustomTypography>
                  <Button
                    variant="contained"
                    component="label"
                    size="small"
                    sx={{
                      fontSize: '12px',
                      textTransform: 'none',
                      padding: '6px 12px'
                    }}
                  >
                    Upload Attachment
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          console.log('Selected file:', file);
                        }
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            )}
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button size="small" variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
              Submit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => {
                resetForm();
              }}
            >
              Cancel
            </Button>
          </Box>
        </>
      )}
    </MainCard>
  );
};

export default KnockOffForm;
