import React, { useState } from 'react';
import * as Yup from 'yup';
import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import formatNumber from 'utils/functions';
import MainCard from 'components/MainCard';

const ViewGenerateRfqPage = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqView: true,
    createrfqForm: true,
    itemListRfq: true,
    vendorlist: true,
    requireDoc: true
  });

  const calcNet = (val1, val2) => {
    return val1 + val2;
  };
  const shipmentData = [
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' },
    { label: ' OPR Lead time', value: '12:00' },
    { label: 'Delivery Timeline', value: 'hdh' },
    { label: 'Port of Delivery', value: 'hdsbjh' },
    { label: 'Respond Time(Days)', value: 'djhjdh' },
    { label: ' Additional Remarks', value: ' Additional Remarks Additional Remarks' }
  ];
  const rfqItemcolumns = [
    { field: 'item_code', headerName: 'Item Code', width: 100, flex: 1 },
    { field: 'item_name', headerName: 'Item Name', width: 250, flex: 1 },
    { field: 'item_description', headerName: 'Remarks', width: 250, flex: 1 },
    { field: 'company_name', headerName: 'Company', width: 200, flex: 1 },
    { field: 'uom_name', headerName: 'UOM', width: 100, flex: 1 },
    { field: 'qty', headerName: 'Req Qty', width: 100, flex: 1, renderCell: (params) => formatNumber(params.value) },

    {
      field: 'tolerance',
      headerName: 'Tolerance %',
      width: 150,
      editable: true,
      flex: 1,
      renderCell: (params) => formatNumber(params.value || '')
    },
    {
      field: 'net_qty',
      headerName: 'Net Qty',
      width: 100,
      renderCell: (params) => calcNet(Number(params?.row?.quantity), Number(params?.row?.qty)),
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <IconButton aria-label="delete" color="error" onClick={() => removeItem(params.id)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];
  const rfqItemData = [
    {
      id: 1,
      item_code: 'ITM001',
      item_name: 'Laptop',
      item_description: 'Dell Latitude 5420',
      company_name: 'ABC Corp',
      uom_name: 'Piece',
      qty: 10,
      tolerance: 5,
      net_qty: 10 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 2,
      item_code: 'ITM002',
      item_name: 'Monitor',
      item_description: 'Dell 24-inch UltraSharp',
      company_name: 'XYZ Pvt Ltd',
      uom_name: 'Piece',
      qty: 20,
      tolerance: 2,
      net_qty: 20 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 3,
      item_code: 'ITM003',
      item_name: 'Keyboard',
      item_description: 'Logitech Wireless Keyboard K780',
      company_name: 'DEF Enterprises',
      uom_name: 'Piece',
      qty: 50,
      tolerance: 10,
      net_qty: 50 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 4,
      item_code: 'ITM004',
      item_name: 'Mouse',
      item_description: 'Logitech MX Master 3',
      company_name: 'ABC Corp',
      uom_name: 'Piece',
      qty: 30,
      tolerance: 3,
      net_qty: 30 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 5,
      item_code: 'ITM005',
      item_name: 'Printer',
      item_description: 'HP LaserJet Pro M404dn',
      company_name: 'XYZ Pvt Ltd',
      uom_name: 'Piece',
      qty: 5,
      tolerance: 1,
      net_qty: 5 // This can be calculated dynamically using `calcNet`
    }
  ];
  const doc_table_column = [{ field: 'req_doc_name', headerName: 'Document Name', flex: 1 }];

  const [doc_table_data, setDoc_table_data] = useState([
    { id: 1, req_doc_name: 'Commercial Invoice' },
    { id: 2, req_doc_name: 'Packing List' },
    { id: 3, req_doc_name: 'Certificate Of Analysis' }
  ]);

  // const doc_table_data = [
  //   { id: 1, req_doc_name: 'Commercial Invoice' },
  //   { id: 2, req_doc_name: 'Packing List' },
  //   { id: 3, req_doc_name: 'Certificate Of Analysis' }
  // ];
  const VendorColumn = [
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
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={500}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  return (
    <MainCard>
      <Box>
        <Table>{renderTableHeader('rfqView', 'View RFQ')}</Table>
        {showTableHeading.rfqView && (
          <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
            <Grid container spacing={2}>
              {shipmentData
                .reduce((acc, item, index) => {
                  if (index % 4 === 0) acc.push([]);
                  acc[acc.length - 1].push(item);
                  return acc;
                }, [])
                .map((row, rowIndex) => (
                  <Grid container item xs={12} key={rowIndex} spacing={2}>
                    {row.map((item, itemIndex) => (
                      <Grid item xs={3} key={itemIndex}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                          <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                            {item.label}:
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ))}
            </Grid>
          </Grid>
        )}
      </Box>
      <Table>{renderTableHeader('createrfqForm', 'Item List to Create RFQ')}</Table>
      {showTableHeading.createrfqForm && (
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
          pageSize={5}
          columns={rfqItemcolumns}
          rows={rfqItemData}
          hideFooterPagination
          rowsPerPageOptions={[5, 10, 20]}
        />
      )}
      <Box mt={'10px'}>
        <Table>{renderTableHeader('itemListRfq', 'Selected Vendor')}</Table>
        {showTableHeading.itemListRfq && (
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
          />
        )}
      </Box>
      <Box mt={'10px'}>
        <Table>{renderTableHeader('vendorlist', 'Required Documents at the time of Shipping')}</Table>
        {showTableHeading.vendorlist && (
          <Box>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'start'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'start'
                },

                '& .MuiSvgIcon-root': {
                  fontSize: '20px'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={doc_table_data}
              columns={doc_table_column}
              onRowSelectionModelChange={(val) => {
                return setSelectedDocids(
                  doc_table_data?.filter((item) => {
                    return val.includes(item.id);
                  })
                );
              }}
              hideFooter
              hideFooterPagination
            />
          </Box>
        )}
      </Box>
    </MainCard>
  );
};

export default ViewGenerateRfqPage;
