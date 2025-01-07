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
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio
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

const Discrepancy = () => {
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

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
      inser_feil_no: '20FT GP',
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
      field: 'inser_feil_no',
      headerName: 'Inser Fiel No',
      flex: 1,
      editable: true,
      renderCell: (params) => <span style={{ fontWeight: params.row.fontWeight }}>{params.value}</span>
    },
    {
      field: 'type_claue',
      headerName: 'Type Claue',
      width: 100,
      editable: true
    }
  ];

  const handleAddRow = () => {
    const newId = expenses.length > 0 ? Math.max(...expenses.map((inser_feil_no) => inser_feil_no.id)) + 1 : 1;

    const newRow = {
      id: newId,
      inser_feil_no: '',
      type_claue: ''
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
    <MainCard title={'Discrepancy Acceptance Request'}>
      <Table>
        {renderTableHeader('basicDetail', 'Basic Details')}
        {showTableHeading.basicDetail && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Applicant Name</CustomTypography>
                    <CustomTypography>jhdsjhdb</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Applicant Address</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Beneficiary Name</CustomTypography>
                    <CustomTypography>USD</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Beneficiary Address</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  {/* ..........................Buyer Info.................... */}
                  <Grid xs={12} mt={2}>
                    <Typography fontWeight="600">LC Info</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Bank</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">FORM M No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">BA No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">FORM M Amt</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">LC No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">LC Dt</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">LC Amount</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Latest Shipment Dt</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">LC Expiry Dt</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Port of Loading</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Port of Delivery</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>

                  {/* ..........................Shipment Info	.................... */}
                  <Grid xs={12} mt={2}>
                    <Typography fontWeight="600">PFI Info</Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">PFI General Desc</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">FOB</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Inland Ch</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Freight</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">PFI Total</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('infoCapturing', 'Discepancy Acceptance  Info')}
        {showTableHeading.infoCapturing}
      </Table>
      <Box component="form" paddingLeft={1} onSubmit={handleSubmitForm}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <CustomTypography variant="body">Discrepancy Charges</CustomTypography>
          <RadioGroup row name="discrepancyCharges" value={selectedValue} onChange={handleChange}>
            <FormControlLabel value="applicant" control={<Radio />} label="Applicant" />
            <FormControlLabel value="beneficiary" control={<Radio />} label="Beneficiary" />
          </RadioGroup>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DataGrid
            getRowHeight={() => "auto"}
            sx={{
              "& .MuiDataGrid-cell": {
                border: "1px solid rgba(224, 224, 224, 1)",
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f5f5f5",
                border: "1px solid rgba(224, 224, 224, 1)",
                height: "25px !important",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              "& .MuiDataGrid-scrollbar": {
                height: "8px",
              },
            }}
            processRowUpdate={handleRowUpdate}
            rows={expenses}
            columns={[
              { field: "inser_feil_no", headerName: "Inser Feil No", width: 150, editable: true },
              { field: "description", headerName: "Description", width: 200, editable: true },
              { field: "amount", headerName: "Amount", width: 100, editable: true },
            ]}
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.id}
            hideFooter
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              variant="text"
              color="primary"
              onClick={handleAddRow}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Add New
            </Button>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <CustomTypography variant="body">
            Upload Discrepancy Acceptance Request<ValidationStar>*</ValidationStar>
          </CustomTypography>
          <input type="file" style={{ display: "block", marginTop: "8px" }} required />
        </Grid>
        <Grid item xs={3}>
          <CustomTypography variant="body">
            Upload Discrepancy Acceptance Telex<ValidationStar>*</ValidationStar>
          </CustomTypography>
          <input type="file" style={{ display: "block", marginTop: "8px" }} required />
        </Grid>
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent={"end"} textAlign={"center"}>
            <Button variant="contained" size="small" color="primary" type="submit" sx={{ mr: 2 }}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </MainCard>
  );
};

export default Discrepancy;
