import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox } from '@mui/material';
const VendorList = () => {
  const VendorColumn = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: () => <Checkbox sx={{ padding: 0, margin: '0 auto' }} />,
      sortable: false
    },
    { field: 'lprNo', headerName: 'Sr No.', width: 100 },
    { field: 'vertical', headerName: 'Item Name', width: 100 },
    { field: 'company', headerName: 'Vendor Serial', width: 150 },
    { field: 'division', headerName: 'Vendor Name', width: 150 },
    { field: 'lprCategory', headerName: 'Contact Person', width: 150 },
    { field: 'shipmentMode', headerName: 'Compliance Status', width: 150 }
  ];

  const VendorData = [
    {
      id: 1,
      select: false,
      lprNo: 1,
      vertical: 'Item A',
      company: 'VS-001',
      division: 'Vendor A',
      lprCategory: 'John Doe',
      shipmentMode: 'Compliant'
    },
    {
      id: 2,
      select: false,
      lprNo: 2,
      vertical: 'Item B',
      company: 'VS-002',
      division: 'Vendor B',
      lprCategory: 'Jane Smith',
      shipmentMode: 'Non-Compliant'
    },
    {
      id: 3,
      select: false,
      lprNo: 3,
      vertical: 'Item C',
      company: 'VS-003',
      division: 'Vendor C',
      lprCategory: 'Michael Brown',
      shipmentMode: 'Pending'
    },
    {
      id: 4,
      select: false,
      lprNo: 4,
      vertical: 'Item D',
      company: 'VS-004',
      division: 'Vendor D',
      lprCategory: 'Emily Davis',
      shipmentMode: 'Compliant'
    }
  ];

  return (
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
        rows={VendorData}
        columns={VendorColumn}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
        onRowClick={() => setViewLPR(true)} // Open View LPR on row click
      />
    </Box>
  );
};

export default VendorList;
