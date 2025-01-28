import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  MenuItem,
  Box,
  IconButton,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  InputAdornment,
  DialogContentText,
  TextField
} from '@mui/material';
import axios from 'axios';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { BASE_URL } from 'AppConstants';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import {
  getLoadDivisions,
  getShipmentType,
  getShipmentMode,
  getReqByDepartment,
  getVertical,
  getBuyingHouse,
  getStockitems,
  getUomByStockitemsId
} from '../../allapi/getAllAPIS';
import { toast } from 'react-toastify';
import FieldPadding from 'components/FieldPadding';
import { useDispatch, useSelector } from 'react-redux';
import ValidationStar from 'components/ValidationStar';
import { axiosInstance } from '../../utils/axiosInstance';
import { YesButton } from 'components/DialogActionsButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { errorMessageStyle } from 'components/StyleComponent';
import { getCurrentDate } from '../../utils/constantFunctions';
import SelectFieldPadding from 'components/selectFieldPadding';
import { GetSupperCategoriesTypes } from 'Redux/Apis/GetApiCalls';

const ItemTable = () => {
  const [showTableBodies, setShowTableBodies] = useState({
    createOPR: true,
    itemsDetail: true,
    itemsTable: true,
    viewOprDetail: false,
    basicInfo: true,
    requestDetails: true,
    shipmentDetail: true
  });

  const itemcolumns = [
    { field: 'id', headerName: 'Sr. No.', width: 50 },
    { field: 'sub_group', headerName: 'Category', width: 100 },
    { field: 'item_type', headerName: 'Sub Category', width: 100 },
    { field: 'city', headerName: 'Factory', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },

    { field: 'uom', headerName: 'UOM', width: 100 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    { field: 'stock_in_transit', headerName: 'Stock In Transit', width: 100 },
    { field: 'stock_in_hand', headerName: 'Stock In Hand', width: 100 },
    { field: 'monthly_consumption', headerName: 'Monthly Consumption', width: 120 },
    { field: 'item_description', headerName: 'Remarks', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: (params) => <ActionCellRenderer {...params} deleteItem={params.context.deleteItem} />,
      width: 100
    }
  ];
  const itemData = [
    {
      id: 1,
      sub_group: 'Electronics',
      item_type: 'Mobile Phones',
      city: 'New York',
      item_code: 'E1001',
      item_name: 'iPhone 14',
      hsn_code: '851712',

      uom: 'Pcs',
      quantity: 50,
      stock_in_transit: 20,
      stock_in_hand: 30,
      monthly_consumption: 40,
      item_description: 'Latest model'
    },
    {
      id: 2,
      sub_group: 'Furniture',
      item_type: 'Chairs',
      city: 'Los Angeles',
      item_code: 'F2001',
      item_name: 'Office Chair',
      hsn_code: '940310',

      uom: 'Units',
      quantity: 100,
      stock_in_transit: 40,
      stock_in_hand: 60,
      monthly_consumption: 80,
      item_description: 'Ergonomic design'
    },
    {
      id: 3,
      sub_group: 'Appliances',
      item_type: 'Kitchen',
      city: 'Chicago',
      item_code: 'A3001',
      item_name: 'Microwave Oven',
      hsn_code: '851660',

      uom: 'Units',
      quantity: 20,
      stock_in_transit: 10,
      stock_in_hand: 10,
      monthly_consumption: 15,
      item_description: '800W, Compact'
    },
    {
      id: 4,
      sub_group: 'Stationery',
      item_type: 'Writing Tools',
      city: 'Houston',
      item_code: 'S4001',
      item_name: 'Ballpoint Pens',
      hsn_code: '960810',

      uom: 'Boxes',
      quantity: 200,
      stock_in_transit: 50,
      stock_in_hand: 150,
      monthly_consumption: 100,
      item_description: 'Pack of 10'
    },
    {
      id: 5,
      sub_group: 'Clothing',
      item_type: 'T-Shirts',
      city: 'Dallas',
      item_code: 'C5001',
      item_name: 'Cotton T-Shirt',
      hsn_code: '610910',

      uom: 'Pcs',
      quantity: 300,
      stock_in_transit: 150,
      stock_in_hand: 150,
      monthly_consumption: 200,
      item_description: 'Available in multiple colors'
    }
  ];

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  // Function to render table headers with toggle icons
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600}>
              {sectionLabel}
            </Typography>
            <Box>
              {sectionName === 'viewOprDetail' && (
                <IconButton
                  size="large"
                  onClick={() => {
                    handleOPREdit(oprId);
                    if (onEditClick) {
                      onEditClick();
                    }
                  }}
                >
                  <EditOutlinedIcon />
                </IconButton>
              )}
              <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
                {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
              </IconButton>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  return (
    <div>
      <TableContainer sx={{ marginTop: 2, borderRadius: '0' }}>
        <Table>
          {renderTableHeader('itemsTable', 'Items Table')}
          {showTableBodies.itemsTable && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <div style={{ width: '100%' }}>
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      sx={{
                        fontSize: '11px',
                        '& .MuiDataGrid-cell': {
                          border: '1px solid rgba(224, 224, 224, 1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 'none'
                        },
                        '& .MuiDataGrid-columnHeader': {
                          backgroundColor: '#f5f5f5',
                          border: '1px solid rgba(224, 224, 224, 1)',
                          height: '25px !important',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        },
                        '& .MuiDataGrid-scrollbar': {
                          height: '8px'
                        }
                      }}
                      rows={itemData}
                      columns={itemcolumns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default ItemTable;
