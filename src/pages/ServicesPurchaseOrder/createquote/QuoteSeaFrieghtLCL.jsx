// project-imports
import { useState, useEffect } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
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
import { DataGrid } from '@mui/x-data-grid';

const QuoteSeaFrieghtLCL = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetail: true,
    expenseInformation: true,
    paymentInformation: true
  });
  const [initialValuesInvoice, setInitialValuesInvoice] = useState({
    party_name: '',
    party_info: '',
    quote_date: '',
    payment_term: '',
    shipping_line: '',
    free_days_pol: null,
    ets: 0,
    eta: 0,
    saling_days: 0,
    rate_validity: '',
    date_from: '',
    date_to: '',
    additional_comment: '',
    remark: ''
  });
  const [formValuesInvoice, setFormValuesInvoice] = useState(initialValuesInvoice);
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
  const handleSubmitForm = async (values, actions) => {
    try {
      const { data } = await axiosInstance.post(
        '/api/commercial/invoice/shipping/cbm_rate_kg',
        {
          // ci_id: showShippingExpenseData?.ci_id,
          // ci_num: showShippingExpenseData?.ci_num,
          // pfi_id: showShippingExpenseData?.pfi_id,
          // pfi_num: showShippingExpenseData?.pfi_num,
          provision: provision,
          vesselName: values.vesselName,
          billNo: values.billNo,
          billDate: values.billDate,
          ets: TotalAmount,
          eta: values.eta,
          saling_days: Number(values.eta) + Number(TotalAmount),
          rate_validity: values.rate_validity,
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
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      alert('Please fill all required fields');
      console.error(errors);
      return;
    }
    console.log('Submit Payment Successfully');
  };
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      cbm_rate_kg: '20FT GP',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: ''
    },
    {
      id: 2,
      cbm_rate_kg: '40FT GP',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: ''
    },
    {
      id: 3,
      cbm_rate_kg: '40FT HC',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: ''
    }
  ]);

  const columns = [
    {
      field: 'id',
      headerName: 'SR.No.',
      width: 70
    },
    {
      field: 'cbm_rate_kg',
      headerName: 'CBM / KG Rate ',
      flex: 1,
      editable: true,
      renderCell: (params) => <span style={{ fontWeight: params.row.fontWeight }}>{params.value}</span>
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 100,
      editable: true
    }
  ];

  const handleAddRow = () => {
    const newId = expenses.length > 0 ? Math.max(...expenses.map((cbm_rate_kg) => cbm_rate_kg.id)) + 1 : 1;

    const newRow = {
      id: newId,
      cbm_rate_kg: '',
      rate: ''
    };

    setExpenses((prevExpenses) => {
      return [...prevExpenses, newRow];
    });
  };
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    console.log(id, field, value);

    setExpenses((prevExpenses) => {
      return prevExpenses.map((row) => (row.id === id ? { ...row, [field]: value } : row));
    });
  };
  const handleRowUpdate = (newRow) => {
    console.log('Row update triggered');
    console.log('Updated Row:', newRow);

    setExpenses((prevExpenses) => {
      return prevExpenses.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row));
    });

    return newRow;
  };
  return (
    <MainCard title={'Quote for Sea Freight - LCL'}>
      <Table>
        {renderTableHeader('basicDetail', 'Basic Details')}
        {showTableHeading.basicDetail && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">OPR No</CustomTypography>
                    <CustomTypography>jhdsjhdb</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">OPO No</CustomTypography>
                    <CustomTypography>USD</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">PO No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Vendor Name</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">No of Privious Shipement</CustomTypography>
                    <CustomTypography>jhdsjhdb</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Amt of Privious Shipement</CustomTypography>
                    <CustomTypography>USD</CustomTypography>
                  </Grid>
                  {/* ..........................Buyer Info.................... */}
                  <Grid xs={12} mt={2}>
                    <Typography fontWeight="600">Buyer Info</Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Consignee Name</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">PFI No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">CI No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">BL No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">FORM M No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">BA No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">LC No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  {/* ..........................Shipment Info	.................... */}
                  <Grid xs={12} mt={2}>
                    <Typography fontWeight="600">Shipment Info </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Delivery Term</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Mode of Shipment</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Type of Shipment</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">CBM</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">No of Pack/Box/Bags</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Net Weight</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Gross Weight</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Port Of Loading </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Port Of Discharge </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">No of Contianers </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Size & Type </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Count </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('infoCapturing', 'Info Capturing Section')}
        {showTableHeading.infoCapturing}
      </Table>
      <Box component="form" paddingLeft={1} onSubmit={handleSubmitForm}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">Party Name</CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="party_name"
              variant="outlined"
              name="party_name"
              value={formValuesInvoice?.party_name}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">Party Info</CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="party_info"
              variant="outlined"
              name="party_info"
              value={formValuesInvoice?.party_info}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">Quote Info</CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="quote_date"
              variant="outlined"
              name="quote_date"
              value={formValuesInvoice?.quote_date}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">Payment Term</CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="payment_term"
              variant="outlined"
              name="payment_term"
              value={formValuesInvoice?.payment_term}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              Shipping Line <ValidationStar>*</ValidationStar>
            </CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="shipping_line"
              variant="outlined"
              name="shipping_line"
              value={formValuesInvoice?.shipping_line}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              Free Days POL<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="free_days_pol"
              variant="outlined"
              name="free_days_pol"
              value={formValuesInvoice?.free_days_pol}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              ETS<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="ets"
              variant="outlined"
              name="ets"
              value={formValuesInvoice?.ets}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              ETA<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <DatePicker
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              value={formValuesInvoice.eta ? dayjs(formValuesInvoice.eta) : null}
              onChange={(date) =>
                setFormValuesInvoice({
                  ...formValuesInvoice,
                  ['eta']: date
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              Saling Days<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="saling_days"
              variant="outlined"
              name="saling_days"
              value={formValuesInvoice?.saling_days}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              Rate Validity<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              id="rate_validity"
              variant="outlined"
              name="rate_validity"
              value={formValuesInvoice?.rate_validity}
              onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              Date From<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <DatePicker
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              value={formValuesInvoice.date_from ? dayjs(formValuesInvoice.date_from) : null}
              onChange={(date) =>
                setFormValuesInvoice({
                  ...formValuesInvoice,
                  ['date_from']: date
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTypography variant="body">
              Date To<ValidationStar>*</ValidationStar>
            </CustomTypography>
            <DatePicker
              sx={{
                '& .MuiInputBase-input': {
                  padding: '2px'
                },
                width: '100%'
              }}
              value={formValuesInvoice.date_to ? dayjs(formValuesInvoice.date_to) : null}
              onChange={(date) =>
                setFormValuesInvoice({
                  ...formValuesInvoice,
                  ['date_to']: date
                })
              }
            />
          </Grid>
        </Grid>
      </Box>
      <Table sx={{ mt: 2 }}>
        {renderTableHeader('freightquote', 'Freight Quote')}
        {showTableHeading.freightquote}
      </Table>
      <Grid container spacing={2} display={'flex'} alignItems={'flex-end'}>
        <Grid item xs={12}>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'start'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(224, 224, 224, 1)',
                height: '25px !important',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              },
              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            onCellEditCommit={handleCellEditCommit}
            processRowUpdate={handleRowUpdate}
            rows={[...expenses]}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.cbm_rate_kg}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="text"
              color="primary"
              onClick={handleAddRow}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              Add New
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <CustomTypography variant="body">Remark</CustomTypography>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '2px'
              },
              width: '100%'
            }}
            id="remark"
            variant="outlined"
            name="remark"
            value={formValuesInvoice?.remark}
            onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomTypography variant="body">Additional Comment</CustomTypography>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '2px'
              },
              width: '100%'
            }}
            id="additional_comment"
            variant="outlined"
            name="additional_comment"
            value={formValuesInvoice?.additional_comment}
            onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomTypography variant="body">
            Upload Payment Copy<ValidationStar>*</ValidationStar>
          </CustomTypography>
          <input type="file" style={{ display: 'block', marginTop: '8px' }} required />
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} justifyContent={'end'} textAlign={'center'}>
            <Button variant="contained" size="small" color="primary" type="btn" sx={{ mr: 2 }} onClick={handleSubmitPayment}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default QuoteSeaFrieghtLCL;
