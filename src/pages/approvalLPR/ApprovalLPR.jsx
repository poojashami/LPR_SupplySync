import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';

const ApprovalLPR = () => {
  const ApprovalLPRColumn = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'piNo',
      headerName: 'PI No',
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'piDate',
      headerName: 'PI Date',
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'consignor',
      headerName: 'Consignor',
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'consignee',
      headerName: 'Consignee',
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center'
    }
  ];

  const ApprovalLPRData = [
    {
      id: 1,
      piNo: 'PI001',
      piDate: '2024-01-01',
      consignor: 'John Doe',
      consignee: 'Jane Smith',
      status: 'Pending'
    },
    {
      id: 2,
      piNo: 'PI002',
      piDate: '2024-01-02',
      consignor: 'Alice Johnson',
      consignee: 'Bob Brown',
      status: 'Approved'
    },
    {
      id: 3,
      piNo: 'PI003',
      piDate: '2024-01-03',
      consignor: 'David Clark',
      consignee: 'Mary Davis',
      status: 'Rejected'
    }
  ];

  return (
    <MainCard title={'Approval LPR'}>
      <Box sx={{ width: '100%' }}>
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
            '& .MuiCheckbox-root': {
              padding: 0,
              margin: '0 auto',
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
          rows={ApprovalLPRData}
          columns={ApprovalLPRColumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </Box>
    </MainCard>
  );
};

export default ApprovalLPR;
