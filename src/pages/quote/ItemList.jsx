import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox } from '@mui/material';
const ItemList = () => {
  const ItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Category', width: 120 },
    { field: 'sub_category', headerName: 'Sub Category', width: 120 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'tolerance', headerName: 'Tolerance', width: 100 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    { field: 'uom_name', headerName: 'UOM', width: 100 },
    { field: 'nafdac_required', headerName: 'Nafdac Req.', width: 50 },
    { field: 'nafdac_require', headerName: 'SON Req.', width: 50 },
    { field: 'cria_required', headerName: 'CRIA Req.', width: 50 },
    { field: 'address', headerName: 'Delivery Location', width: 200 },
    { field: 'item_remark', headerName: 'Remark', width: 300 }
  ];
  const itemData = [
    {
      id: 1,
      item_type: 'Electronics',
      sub_category: 'Mobile Phones',
      item_code: 'MP001',
      item_name: 'Samsung Galaxy S23',
      tolerance: '5%',
      quantity: 100,
      uom_name: 'Pieces',
      nafdac_required: 'Yes',
      nafdac_require: 'No',
      cria_required: 'Yes',
      address: '123 Tech Park, Silicon Valley',
      item_remark: 'New model with latest features.'
    },
    {
      id: 2,
      item_type: 'Electronics',
      sub_category: 'Laptops',
      item_code: 'LP002',
      item_name: 'Dell XPS 13',
      tolerance: '3%',
      quantity: 50,
      uom_name: 'Pieces',
      nafdac_required: 'No',
      nafdac_require: 'Yes',
      cria_required: 'Yes',
      address: '456 Business Center, Downtown',
      item_remark: 'Top-rated ultra-portable laptop.'
    },
    {
      id: 3,
      item_type: 'Furniture',
      sub_category: 'Chairs',
      item_code: 'CH003',
      item_name: 'Ergonomic Office Chair',
      tolerance: '2%',
      quantity: 30,
      uom_name: 'Pieces',
      nafdac_required: 'No',
      nafdac_require: 'No',
      cria_required: 'No',
      address: '789 Furniture Mall, City Center',
      item_remark: 'Comfortable chair with adjustable features.'
    },
    {
      id: 4,
      item_type: 'Electronics',
      sub_category: 'Smartphones',
      item_code: 'SP004',
      item_name: 'iPhone 14 Pro',
      tolerance: '4%',
      quantity: 150,
      uom_name: 'Pieces',
      nafdac_required: 'Yes',
      nafdac_require: 'No',
      cria_required: 'Yes',
      address: '123 Apple Store, Mall Avenue',
      item_remark: 'Latest model with excellent performance.'
    },
    {
      id: 5,
      item_type: 'Furniture',
      sub_category: 'Tables',
      item_code: 'TB005',
      item_name: 'Glass Coffee Table',
      tolerance: '1%',
      quantity: 20,
      uom_name: 'Pieces',
      nafdac_required: 'No',
      nafdac_require: 'No',
      cria_required: 'No',
      address: '456 Home Decor, Uptown',
      item_remark: 'Elegant glass top with metal frame.'
    },
    {
      id: 6,
      item_type: 'Electronics',
      sub_category: 'Headphones',
      item_code: 'HP006',
      item_name: 'Bose QuietComfort 35 II',
      tolerance: '2%',
      quantity: 75,
      uom_name: 'Pieces',
      nafdac_required: 'Yes',
      nafdac_require: 'Yes',
      cria_required: 'Yes',
      address: '789 Audio Shop, Music Street',
      item_remark: 'Noise-cancelling and high-quality sound.'
    },
    {
      id: 7,
      item_type: 'Furniture',
      sub_category: 'Sofas',
      item_code: 'SF007',
      item_name: 'Leather Sofa Set',
      tolerance: '5%',
      quantity: 10,
      uom_name: 'Sets',
      nafdac_required: 'No',
      nafdac_require: 'No',
      cria_required: 'No',
      address: '123 Sofa Shop, Riverside',
      item_remark: 'Luxurious and comfortable leather sofa.'
    },
    {
      id: 8,
      item_type: 'Home Appliances',
      sub_category: 'Air Conditioners',
      item_code: 'AC008',
      item_name: 'LG Inverter AC',
      tolerance: '3%',
      quantity: 40,
      uom_name: 'Pieces',
      nafdac_required: 'Yes',
      nafdac_require: 'No',
      cria_required: 'Yes',
      address: '456 Appliance Center, Central Plaza',
      item_remark: 'Energy-efficient and eco-friendly.'
    },
    {
      id: 9,
      item_type: 'Furniture',
      sub_category: 'Desks',
      item_code: 'DS009',
      item_name: 'Wooden Office Desk',
      tolerance: '2%',
      quantity: 60,
      uom_name: 'Pieces',
      nafdac_required: 'No',
      nafdac_require: 'No',
      cria_required: 'No',
      address: '789 Office Supplies, Business District',
      item_remark: 'Sturdy wood with ample storage space.'
    },
    {
      id: 10,
      item_type: 'Electronics',
      sub_category: 'Smartwatches',
      item_code: 'SW010',
      item_name: 'Apple Watch Series 7',
      tolerance: '1%',
      quantity: 120,
      uom_name: 'Pieces',
      nafdac_required: 'Yes',
      nafdac_require: 'Yes',
      cria_required: 'Yes',
      address: '123 Tech Store, Mall Road',
      item_remark: 'Advanced fitness and health tracking features.'
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
        rows={itemData}
        columns={ItemColumns}
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
