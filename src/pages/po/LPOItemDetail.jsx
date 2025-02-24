import React from 'react';
import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
const LPOItemDetail = () => {
  const stockItemColumns = [
    { field: 'id', headerName: 'Sr. No.', width: 60 },
    { field: 'item_cat', headerName: 'Item Category', width: 120 },
    { field: 'group', headerName: 'Group', width: 100 },
    { field: 'subgroup', headerName: 'Sub Group', width: 120 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 120 },
    { field: 'item_name_vendor', headerName: 'Vendor Item Name', width: 150 },
    { field: 'uom', headerName: 'UOM', width: 70 },
    { field: 'quantity', headerName: 'LPR Qty', width: 75 },
    { field: 'quote_qtd', headerName: 'Quote Qty', width: 90 },
    { field: 'rate', headerName: 'Rate', width: 70 },
    { field: 'total_cost', headerName: 'Amount', width: 80 },
    { field: 'pack_type', headerName: 'Pack Type', width: 120 },
    { field: 'pack_uom', headerName: 'Pack UOM', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'opr_remark', headerName: 'LPR Item Remarks', width: 150 },
    { field: 'remarks', headerName: 'Vendor Item Remarks', width: 150 },
    { field: 'vatRate', headerName: 'VAT Rate', width: 100 },
    { field: 'itemVatTotal', headerName: 'Item VAT Total', width: 130 },
    { field: 'roundOfVat', headerName: 'Round off VAT', width: 130 },
    { field: 'itemAmount', headerName: 'Item Amount Incl. VAT', width: 150 }
  ];

  const stockItemData  = [
    {
      id: 1,
      item_cat: 'Electronics',
      group: 'G1',
      subgroup: 'SG1',
      item_code: 'E1001',
      item_name: 'Resistor',
      item_name_vendor: 'Vendor Resistor',
      uom: 'PCS',
      quantity: 10,
      quote_qtd: 8,
      rate: 5,
      total_cost: 40,
      pack_type: 'Box',
      pack_uom: 'PCS',
      pack_size: 100,
      no_packs: 1,
      opr_remark: 'Urgent',
      remarks: 'Best quality',
      vatRate: 5,
      itemVatTotal: 2,
      roundOfVat: 0.5,
      itemAmount: 42.5
    },
    {
      id: 2,
      item_cat: 'Mechanical',
      group: 'G2',
      subgroup: 'SG2',
      item_code: 'M2002',
      item_name: 'Bolt',
      item_name_vendor: 'Vendor Bolt',
      uom: 'PCS',
      quantity: 20,
      quote_qtd: 18,
      rate: 2,
      total_cost: 36,
      pack_type: 'Bag',
      pack_uom: 'PCS',
      pack_size: 200,
      no_packs: 1,
      opr_remark: 'Standard',
      remarks: 'Good quality',
      vatRate: 5,
      itemVatTotal: 1.8,
      roundOfVat: 0.2,
      itemAmount: 38
    }
  ];

  return (
    <Box padding={1}>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          height: '30vh',
          border: '1px solid rgba(224, 224, 224, 1)',
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
