import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, Typography, Table, TableRow, TableHead, TableCell, IconButton, Grid, TextField, Button } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const AllLPRApproveData = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    approvedlpr: true,
    heading3: true
  });
  const [remark, setRemark] = useState('');

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '8px !important' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600} textTransform={'none'}>
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

  const requestorColumn = [
    { field: 'from_user_name', headerName: 'Request By', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Request Date',
      width: 130,
      renderCell: (params) => <span>{params.value.split('T')[0]}</span>
    },
    { field: 'concurrence_remarks', headerName: 'Request Remark', width: 150, flex: 1 }
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
    { field: 'user_name', headerName: 'Concurred By', width: 100, flex: 1 },
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
  const handleSubmit = () => {
    // Handle the remark submission
    console.log('Remark Submitted:', remark);
  };
  const handleChange = (event) => {
    setRemark(event.target.value);
  };
  return (
    <div>
      <Box>
        <Table>{renderTableHeader('approvedlpr', 'Approval Details')}</Table>
        {showTableHeading.approvedlpr && (
          <>
            <Box padding={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box color={'navy'}>Requestor Detail</Box>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      fontSize: '11px',
                      '& .MuiDataGrid-cell': {
                        border: '1px solid rgba(224, 224, 224, 1)',
                        display: 'flex',

                        alignItems: 'center'
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f5f5f5',
                        border: '1px solid rgba(224, 224, 224, 1)',
                        height: '25px !important',
                        display: 'flex',

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
                  <Box color={'navy'}>Approval Log</Box>
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

            <Box mt={3}>
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

                <Grid item xs={12} sm={5}></Grid>

                <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: '#2c6095',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#244b78'
                      }
                    }}
                  >
                    Request For Approval
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default AllLPRApproveData;
