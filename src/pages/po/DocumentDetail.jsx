import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox } from '@mui/material';
const DocumentDetail = () => {
  const documentColumn = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: () => <Checkbox sx={{ padding: 0, margin: '0 auto' }} />,
      sortable: false
    },
    { field: 'lprNo', headerName: 'Document Name', width: 200 }
  ];
  const documentData = [
    {
      id: 1,
      select: false,
      lprNo: 'Invoice.pdf'
    },
    {
      id: 2,
      select: false,
      lprNo: 'PurchaseOrder.docx'
    },
    {
      id: 3,
      select: false,
      lprNo: 'DeliveryNote.xlsx'
    },
    {
      id: 4,
      select: false,
      lprNo: 'Agreement.pdf'
    },
    {
      id: 5,
      select: false,
      lprNo: 'SpecificationSheet.pdf'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            border: '1px solid rgba(224, 224, 224, 1)',
            // display: 'flex',
            // justifyContent: 'start',
            // alignItems: 'start'
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f5f5f5',
            border: '1px solid rgba(224, 224, 224, 1)',
            height: '25px !important',
            // display: 'flex',
            // justifyContent: 'start',
            // alignItems: 'start'
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
        rows={documentData}
        columns={documentColumn}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default DocumentDetail;
