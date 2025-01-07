import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { MenuItem, Select, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import PlusButton from 'components/CustomButton';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import ValidationStar from 'components/ValidationStar';
import CustomTypography from 'components/CustomTypography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button } from '@mui/material';
import { display } from '@mui/system';
const CreateQuote = () => {
  const [initialValuesInvoice, setInitialValuesInvoice] = useState({
    category_of_service_po: '',
    quote_type: '',
    party_vendor: ''
    // vessel_qty_to_discharge: '',
    // bill_no: '',
    // bill_date: null,
    // amount: 0,
    // vat: 0,
    // total: 0,
    // remark: '',
    // exchange_rate: ''
  });
  const [formValuesInvoice, setFormValuesInvoice] = useState(initialValuesInvoice);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetail: true,
    expenseInformation: true,
    paymentInformation: true
  });
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
  const handleSubmitForm = (e) => {
    e.preventDefault();

    // Validation for required fields
    const requiredFields = [
      'category_of_service_po',
      'quote_type',
      'party_vendor'
      //   'vessel_qty_to_discharge',
      //   'bill_no',
      //   'bill_date',
      //   'amount',
      //   'vat',
      //   'total',
      //   'remark',
      //   'exchange_rate'
    ];
    const missingFields = requiredFields.filter((field) => !formValuesInvoice[field]);

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Log data for submission
    console.log('Submit Data Successfully');
    console.log('Submit data', formValuesInvoice);

    // You can now send formValuesInvoice to an API
    // Example:
    // axios.post('/api/endpoint', formValuesInvoice)
    //   .then(response => console.log('Response:', response))
    //   .catch(error => console.error('Error:', error));
  };
  const oprData = [
    {
      id: 1,
      sr_no: 1,
      opr_no: 'OPR123',
      pur_po_no: 'PO456',
      vendor_name: 'Vendor A',
      mode_of_shipment: 'Air',
      pur_po_del_term: 'FOB',
      pick_up_location: 'New York',
      pick_up_date: '2024-12-20',
      port_of_loading: 'JFK Airport',
      ets: '2024-12-22',
      quote_status: 'Pending',
      quote_status_details: {
        freight: 'In Progress',
        service: 'Completed',
        agency: 'Active'
      }
    },
    {
      id: 2,
      sr_no: 2,
      opr_no: 'OPR124',
      pur_po_no: 'PO457',
      vendor_name: 'Vendor B',
      mode_of_shipment: 'Sea',
      pur_po_del_term: 'CIF',
      pick_up_location: 'Los Angeles',
      pick_up_date: '2024-12-21',
      port_of_loading: 'Port of LA',
      ets: '2024-12-25',
      quote_status: 'Confirmed',
      quote_status_details: {
        freight: 'Completed',
        service: 'Pending',
        agency: 'Inactive'
      }
    },
    {
      id: 3,
      sr_no: 3,
      opr_no: 'OPR125',
      pur_po_no: 'PO458',
      vendor_name: 'Vendor C',
      mode_of_shipment: 'Road',
      pur_po_del_term: 'DAP',
      pick_up_location: 'Chicago',
      pick_up_date: '2024-12-22',
      port_of_loading: 'Chicago Terminal',
      ets: '2024-12-24',
      quote_status: 'Rejected',
      quote_status_details: {
        freight: 'N/A',
        service: 'Rejected',
        agency: 'N/A'
      }
    }
  ];

  const columnDefs = [
    {
      field: 'sr_no',
      headerName: 'Sr No.',
      renderCell: (params) => (
        <div style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      width: 120
    },
    { headerName: 'OPR No', field: 'opr_no', width: 120 },
    { headerName: 'Purchase PO No', field: 'pur_po_no', width: 120 },
    { headerName: 'Vendor Name', field: 'vendor_name', width: 120 },
    { headerName: 'Mode of Shipment', field: 'mode_of_shipment', width: 120 },
    { headerName: 'Purchase PO Delivery Term', field: 'pur_po_del_term', width: 120 },
    { headerName: 'Pick Up Location', field: 'pick_up_location', width: 120 },
    { headerName: 'Pick Up Date', field: 'pick_up_date', width: 120 },
    { headerName: 'Port of Loading', field: 'port_of_loading', width: 120 },
    { headerName: 'ETS', field: 'ets', width: 120 },
    {
      headerName: 'Quote Status',
      field: 'quote_status',
      width: 400, // Adjust width to fit all three columns
      renderCell: (params) => {
        const { freight, service, agency } = params.row.quote_status_details || {};
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <strong>Freight</strong>
              <div>{freight || 'N/A'}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Service</strong>
              <div>{service || 'N/A'}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Agency</strong>
              <div>{agency || 'N/A'}</div>
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Pending for Service PO
        </Box>
      }
    >
      <Box component="form" paddingLeft={1} onSubmit={handleSubmitForm}>
        <>
          <Table>
            {renderTableHeader('basicDetail', 'Basic Details')}
            {showTableHeading.basicDetail && (
              <Grid container spacing={2} alignItems="center" marginBottom={1}>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Category of Service PO </CustomTypography>
                  <Select
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    fullWidth
                    value={formValuesInvoice?.category_of_service_po}
                    onChange={(e) => {
                      setFormValuesInvoice({
                        ...formValuesInvoice,
                        ['category_of_service_po']: e.target.value
                      });
                    }}
                    defaultValue={0}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Against a Purchase PO">Against a Purchase PO</MenuItem>
                    <MenuItem value="Independent">Independent</MenuItem>
                    <MenuItem value="Exp against">Exp Against</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Select Quote</CustomTypography>
                  <Select
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    fullWidth
                    value={formValuesInvoice?.quote_type}
                    onChange={(e) => {
                      setFormValuesInvoice({
                        ...formValuesInvoice,
                        ['quote_type']: e.target.value
                      });
                    }}
                    defaultValue={0}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Sea Freight">Sea Freight</MenuItem>
                    <MenuItem value="Air Freight">Air Freight</MenuItem>
                    <MenuItem value="Service or Agency">Service or Agency</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Select Vendor</CustomTypography>
                  <Select
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    fullWidth
                    value={formValuesInvoice?.party_vendor}
                    onChange={(e) => {
                      setFormValuesInvoice({
                        ...formValuesInvoice,
                        ['party_vendor']: e.target.value
                      });
                    }}
                    defaultValue={0}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Vendor 1">Vendor 1</MenuItem>
                    <MenuItem value="Vendor 2">Vendor 2</MenuItem>
                    <MenuItem value="Vendor 3">Vendor 3</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={2} display={'flex'} justifyContent={'center'} alignItems={'flex-end'}>
                  <Button variant="contained" size="small" color="primary" type="btn" sx={{ mr: 2 }}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            )}
          </Table>
          <Table sx={{ width: '100%' }}>{renderTableHeader('basicDetail', 'Basic Details')}</Table>
          {showTableHeading.basicDetail && (
            <Box sx={{ minHeight: 400, width: '100%' }}>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid rgba(224, 224, 224, 1)',
                    height: '25px !important',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-checkboxInput': {
                    padding: '0px'
                  },
                  '& .MuiCheckbox-root': {
                    width: '18px',
                    height: '18px'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px'
                  },
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  }
                }}
                checkboxSelection
                rows={oprData}
                columns={columnDefs}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight // Ensures the DataGrid adjusts height based on content
              />
            </Box>
          )}
        </>
      </Box>
    </MainCard>
  );
};
export default CreateQuote;
