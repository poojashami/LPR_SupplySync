import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox } from '@mui/material';
const ItemList = () => {
  const ItemColumn = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: () => <Checkbox sx={{ padding: 0, margin: '0 auto' }} />,
      sortable: false
    },
    { field: 'lprNo', headerName: 'Item Code', width: 100 },
    { field: 'vertical', headerName: 'Item Name', width: 100 },
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'division', headerName: 'UOM', width: 150 },
    { field: 'lprCategory', headerName: 'Req Qty', width: 150 },
    { field: 'shipmentMode', headerName: 'Additional Qty', width: 150 },
    { field: 'buyingThrough', headerName: 'Net Qty', width: 150 }
  ];

  const ItemData = [
    {
      id: 1,
      select: false,
      lprNo: 'IC-001',
      vertical: 'Item 1',
      company: 'Company A',
      division: 'PCS',
      lprCategory: 100,
      shipmentMode: 20,
      buyingThrough: 80
    },
    {
      id: 2,
      select: false,
      lprNo: 'IC-002',
      vertical: 'Item 2',
      company: 'Company B',
      division: 'KG',
      lprCategory: 200,
      shipmentMode: 30,
      buyingThrough: 170
    },
    {
      id: 3,
      select: false,
      lprNo: 'IC-003',
      vertical: 'Item 3',
      company: 'Company C',
      division: 'LTR',
      lprCategory: 150,
      shipmentMode: 40,
      buyingThrough: 110
    },
    {
      id: 4,
      select: false,
      lprNo: 'IC-004',
      vertical: 'Item 4',
      company: 'Company D',
      division: 'PCS',
      lprCategory: 250,
      shipmentMode: 50,
      buyingThrough: 200
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
        rows={ItemData}
        columns={ItemColumn}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default ItemList;
