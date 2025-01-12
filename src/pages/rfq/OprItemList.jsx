/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Grid, FormControl, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { setSelectedRows } from 'Redux/Slices/RFQSlice';
import { opr_ids_set } from 'Redux/Slices/OprSlice';
import { useDispatch, useSelector } from 'react-redux';

const OprItemList = ({ showItems, setShowItems }) => {
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [company, setCompany] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [opr_list, setOpr_list] = useState([]);
  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}
    >
      <Typography variant="body2" color="textSecondary">
        No Items left for RFQ in selected OPRS
      </Typography>
    </Box>
  );
  const columns = [
    { field: 'id', headerName: 'Sl. No.', width: 80, filterable: false },
    { field: 'opr_id', headerName: 'OPR Number', width: 150, filterable: false },
    { field: 'company_name', headerName: 'Company Name', width: 150, filterable: false },
    { field: 'item_code', headerName: 'Item Code', width: 150, filterable: true },
    { field: 'item_name', headerName: 'Item Name', width: 200, filterable: false },
    {
      field: 'delivery_timeline_id',
      headerName: 'Delivery Timeline',
      width: 200,
      filterable: true,
      renderCell: (params) => <span>{params.value} Weeks</span>
    },
    // { field: 'item_description', headerName: 'Item Description', width: 250, filterable: false },
    { field: 'qty', headerName: 'Req Qty', width: 120, filterable: false },
    { field: 'uom_name', headerName: 'UOM', width: 120, filterable: false }
  ];
  const rowData = [
    {
      id: 1,
      opr_id: 'OPR-1001',
      company_name: 'ABC Corp',
      item_code: 'ITEM-001',
      item_name: 'Laptop',
      delivery_timeline_id: 2,
      qty: 50,
      uom_name: 'Pieces'
    },
    {
      id: 2,
      opr_id: 'OPR-1002',
      company_name: 'DEF Corp',
      item_code: 'ITEM-002',
      item_name: 'Office Chair',
      delivery_timeline_id: 3,
      qty: 200,
      uom_name: 'Pieces'
    },
    {
      id: 3,
      opr_id: 'OPR-1003',
      company_name: 'GHI Ltd',
      item_code: 'ITEM-003',
      item_name: 'Air Conditioner',
      delivery_timeline_id: 4,
      qty: 10,
      uom_name: 'Units'
    },
    {
      id: 4,
      opr_id: 'OPR-1004',
      company_name: 'JKL Inc',
      item_code: 'ITEM-004',
      item_name: 'Printer',
      delivery_timeline_id: 1,
      qty: 25,
      uom_name: 'Units'
    },
    {
      id: 5,
      opr_id: 'OPR-1005',
      company_name: 'MNO Enterprises',
      item_code: 'ITEM-005',
      item_name: 'Projector',
      delivery_timeline_id: 5,
      qty: 15,
      uom_name: 'Units'
    }
  ];

  const handleSelectionModelChange = (selectionModel) => {
    const selectedIDs = new Set(selectionModel);
    const selectedRowData = rowData.filter((row) => selectedIDs.has(row.id));
    setSelectedRows(selectedRowData);
  };
  return (
    <>
      {showItems ? (
        <Box style={{ height: '80vh', width: '100%' }}>
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
              '& .MuiDataGrid-checkboxInput': {
                padding: '0px' // To remove extra padding around the checkbox
              },
              '& .MuiCheckbox-root': {
                width: '18px',
                height: '18px'
              },
              '& .MuiSvgIcon-root': {
                fontSize: '20px' // Customize the size of the checkmark icon
              }
            }}
            rows={rowData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 15, 20]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionModelChange}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay
            }}
          />
          {/* )} */}
        </Box>
      ) : (
        <>{/* <Opr_list setOpr_list={setOpr_list} setShowItems={setShowItems} /> */}</>
      )}
    </>
  );
};

export default OprItemList;
