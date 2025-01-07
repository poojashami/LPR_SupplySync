import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { Checkbox } from '@mui/material';

const LPRListRFQPage = () => {
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

  return (
    <MainCard title={'LPR List For RFQ'}>
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
          rows={LPRData}
          columns={LPRColumn}
          // slots={{ toolbar: GridToolbar }}
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

export default LPRListRFQPage;
