import React from 'react';
import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomHeading from 'components/CustomHeading';

const ApprovalPaymentQuotaDetail = () => {
  const ApprovalHeader = [
    { field: 'id', headerName: 'BY', width: 50 },
    { field: 'user_name', headerName: 'Concurred By', width: 100 },
    { field: 'concurrence_remarks', headerName: 'Concurrence Remarks', width: 200 },
    { field: 'updatedAt', headerName: 'Concurrence Time', width: 200 },
    { field: 'action', headerName: 'Action', width: 100 },
    { field: 'approval_status', headerName: 'Last Status', width: 100 }
  ];
  const ApprovalData = [
    {
      id: 1,
      user_name: 'John Doe',
      concurrence_remarks: 'Approved with minor changes.',
      updatedAt: '2025-01-15 10:30 AM',
      action: 'Approve',
      approval_status: 'Approved'
    }
  ];
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
            Approval Detail
          </Typography>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            columns={ApprovalHeader}
            rows={ApprovalData}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display={'flex '} justifyContent={'space-between'} alignItems={'center'}>
            <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
              Quotation Detail
            </Typography>
            <button>Comparision Code</button>
          </Box>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            columns={ApprovalHeader}
            rows={ApprovalData}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
            Payment Detail
          </Typography>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            columns={ApprovalHeader}
            rows={ApprovalData}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApprovalPaymentQuotaDetail;
