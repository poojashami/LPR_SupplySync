import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, Typography, Table, TableRow, TableHead, TableCell, IconButton, Grid, TextField, Button } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const LPRApprove = () => {
  const [showLPRForm, setShowLPRForm] = useState(false);
  const [remark, setRemark] = useState('');
  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    approvedlpr: true,
    heading3: true
  });
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the remark submission
    console.log('Remark Submitted:', remark);
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600}>
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

  const LPRColumn = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: () => <Checkbox sx={{ padding: 0, margin: '0 auto' }} />,
      sortable: false
    },
    { field: 'lprNo', headerName: 'LPR No.', width: 100 },
    { field: 'vertical', headerName: 'Vertical', width: 100 },
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'division', headerName: 'Division', width: 150 },
    { field: 'lprCategory', headerName: 'LPR Category', width: 150 },
    { field: 'shipmentMode', headerName: 'Shipment Mode', width: 150 },
    { field: 'buyingThrough', headerName: 'Buying Through', width: 150 },
    { field: 'leftForRFQ', headerName: 'Left for RFQ', width: 150 },
    { field: 'deliveryTime', headerName: 'Delivery Time', width: 150 },
    { field: 'requestedByDept', headerName: 'Requested By Department', width: 150 },
    { field: 'requestedBy', headerName: 'Requested By', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'additionalRemarks', headerName: 'Additional Remarks', width: 250 }
  ];

  const LPRData = [
    {
      id: 1,
      lprNo: 'LPR001',
      vertical: 'Finance',
      company: 'ABC Corp',
      division: 'North Division',
      lprCategory: 'Urgent',
      shipmentMode: 'Air',
      buyingThrough: 'Direct',
      leftForRFQ: '5 days',
      deliveryTime: '10 days',
      requestedByDept: 'Logistics',
      requestedBy: 'John Doe',
      date: '2025-01-06',
      additionalRemarks: 'Requires quick processing'
    },
    {
      id: 2,
      lprNo: 'LPR002',
      vertical: 'IT',
      company: 'XYZ Ltd',
      division: 'South Division',
      lprCategory: 'Regular',
      shipmentMode: 'Sea',
      buyingThrough: 'Agent',
      leftForRFQ: '10 days',
      deliveryTime: '30 days',
      requestedByDept: 'Procurement',
      requestedBy: 'Jane Smith',
      date: '2025-01-05',
      additionalRemarks: 'No urgent requirement'
    }
  ];
  const requestorColumn = [
    { field: 'from_user_name', headerName: 'Request By', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Request Date',
      width: 130,
      renderCell: (params) => <span>{params.value.split('T')[0]}</span>
    },
    { field: 'concurrence_remarks', headerName: 'Request Remark', width: 150 }
  ];

  // Hardcoded Data
  const requestorData = [
    {
      id: 1,
      from_user_name: 'John Doe',
      createdAt: '2025-01-08T10:15:30',
      concurrence_remarks: 'Urgent approval required'
    },
    {
      id: 2,
      from_user_name: 'Jane Smith',
      createdAt: '2025-01-07T12:00:00',
      concurrence_remarks: 'Budget approved'
    },
    {
      id: 3,
      from_user_name: 'Michael Johnson',
      createdAt: '2025-01-06T14:45:15',
      concurrence_remarks: 'Awaiting final review'
    },
    {
      id: 4,
      from_user_name: 'Emily Brown',
      createdAt: '2025-01-05T09:30:00',
      concurrence_remarks: 'Request submitted for concurrence'
    },
    {
      id: 5,
      from_user_name: 'Chris Wilson',
      createdAt: '2025-01-04T16:20:45',
      concurrence_remarks: 'Pending further clarification'
    }
  ];
  const ApprovalColumn = [
    { field: 'id', headerName: 'Sl. No.', width: 50 },
    { field: 'user_name', headerName: 'Concurred By', width: 100 },
    { field: 'approval_status', headerName: 'Action', width: 80 },
    { field: 'updatedAt', headerName: 'Action Date', width: 180 }
  ];

  // Hardcoded Data
  const approvalData = [
    {
      id: 1,
      user_name: 'John Doe',
      approval_status: 'Approved',
      updatedAt: '2025-01-08T10:15:30'
    },
    {
      id: 2,
      user_name: 'Jane Smith',
      approval_status: 'Pending',
      updatedAt: '2025-01-07T12:00:00'
    },
    {
      id: 3,
      user_name: 'Michael Johnson',
      approval_status: 'Rejected',
      updatedAt: '2025-01-06T14:45:15'
    },
    {
      id: 4,
      user_name: 'Emily Brown',
      approval_status: 'Approved',
      updatedAt: '2025-01-05T09:30:00'
    },
    {
      id: 5,
      user_name: 'Chris Wilson',
      approval_status: 'Pending',
      updatedAt: '2025-01-04T16:20:45'
    }
  ];

  return (
    <Box>
      <Table>{renderTableHeader('approvedlpr', 'Approval Details')}</Table>
      {showTableHeading.approvedlpr && (
        <>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box color={'#3f78ff'}>Requestor Detail</Box>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    fontSize: '11px',
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
                    '& .MuiCheckbox-root': {
                      padding: 0,
                      margin: '0 auto', // Center align the checkbox
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
                  rows={requestorData}
                  columns={requestorColumn}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  disableColumnMenu // Hides column menu options
                  disableColumnSelector // Disables the column selector feature
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box color={'#3f78ff'}>Approval Log</Box>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    fontSize: '11px',
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
                    '& .MuiDataGrid-scrollbar': {
                      height: '8px'
                    }
                  }}
                  rows={approvalData}
                  columns={ApprovalColumn}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  disableColumnMenu // Hides column menu options
                  disableColumnSelector // Disables the column selector feature
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={1}>
            <Grid container spacing={2} alignItems="center" sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={1}>
                <Typography variant="body2">Remark</Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  variant="outlined"
                  value={remark}
                  onChange={handleChange}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      padding: '5px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}></Grid>

              <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#2c6095',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#244b78'
                    }
                  }}
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit fjgbjhbb
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default LPRApprove;
