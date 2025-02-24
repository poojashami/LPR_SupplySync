import React from 'react';
import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomHeading from 'components/CustomHeading';
const LPOItemDetail = () => {
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Category', width: 100 },
    { field: 'sub_category', headerName: 'Sub Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_name_vendor', headerName: 'Vendor Item Name', width: 200 },
    { field: 'item_name_label', headerName: 'Item Label Name', width: 200 },
    // { field: 'item_description', headerName: 'Item Description', width: 250 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },
    {
      headerName: 'NAFDAC Req.',
      field: 'nafdac_available',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'NAFDAC Available.',
      field: 'nafdacAvailable',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'SON Req.',
      field: 'nafdac_availabl',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'CRIA Req.',
      field: 'cria',
      width: 100
    },
    { field: 'oprQty', headerName: 'OPR Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 }
  ];
  const stockItemData = [
    {
      id: 1,
      item_type: 'Pharma',
      sub_category: 'Tablets',
      item_code: 'T001',
      item_name: 'Paracetamol 500mg',
      item_name_vendor: 'Vendor A - Paracetamol',
      item_name_label: 'Paracetamol Label',
      hsn_code: '3004',
      nafdac_available: 'true',
      nafdacAvailable: 'false',
      nafdac_availabl: 'true',
      cria: 'Required',
      oprQty: 1000,
      quoteQty: 900,
      rate: 10,
      no_packs: 50,
      pack_size: '20 Tablets',
      pack_type: 'Blister',
      line_total: 9000
    },
    {
      id: 2,
      item_type: 'Pharma',
      sub_category: 'Syrups',
      item_code: 'S001',
      item_name: 'Cough Syrup 100ml',
      item_name_vendor: 'Vendor B - Cough Syrup',
      item_name_label: 'Cough Syrup Label',
      hsn_code: '3004',
      nafdac_available: 'false',
      nafdacAvailable: 'true',
      nafdac_availabl: 'false',
      cria: 'Not Required',
      oprQty: 500,
      quoteQty: 450,
      rate: 50,
      no_packs: 25,
      pack_size: '100ml',
      pack_type: 'Bottle',
      line_total: 22500
    },
    {
      id: 3,
      item_type: 'Medical',
      sub_category: 'Equipment',
      item_code: 'E001',
      item_name: 'Surgical Gloves',
      item_name_vendor: 'Vendor C - Gloves',
      item_name_label: 'Gloves Label',
      hsn_code: '4015',
      nafdac_available: 'true',
      nafdacAvailable: 'true',
      nafdac_availabl: 'true',
      cria: 'Required',
      oprQty: 2000,
      quoteQty: 1950,
      rate: 5,
      no_packs: 100,
      pack_size: '20 Gloves',
      pack_type: 'Box',
      line_total: 9750
    },
    {
      id: 4,
      item_type: 'Pharma',
      sub_category: 'Injections',
      item_code: 'I001',
      item_name: 'Insulin 10ml',
      item_name_vendor: 'Vendor D - Insulin',
      item_name_label: 'Insulin Label',
      hsn_code: '3004',
      nafdac_available: 'false',
      nafdacAvailable: 'false',
      nafdac_availabl: 'false',
      cria: 'Not Required',
      oprQty: 300,
      quoteQty: 280,
      rate: 200,
      no_packs: 15,
      pack_size: '10ml',
      pack_type: 'Vial',
      line_total: 56000
    },
    {
      id: 5,
      item_type: 'Medical',
      sub_category: 'Consumables',
      item_code: 'C001',
      item_name: 'Face Masks',
      item_name_vendor: 'Vendor E - Masks',
      item_name_label: 'Masks Label',
      hsn_code: '6307',
      nafdac_available: 'true',
      nafdacAvailable: 'true',
      nafdac_availabl: 'true',
      cria: 'Required',
      oprQty: 10000,
      quoteQty: 9500,
      rate: 1,
      no_packs: 500,
      pack_size: '20 Masks',
      pack_type: 'Packet',
      line_total: 9500
    }
  ];
  return (
    <Box padding={1}>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          height: '30vh',
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
        columns={stockItemColumns}
        rows={stockItemData}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default LPOItemDetail;
