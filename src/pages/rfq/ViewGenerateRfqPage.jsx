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
  const consinerData = [
    { label: 'Company Code', value: 'LPR1234' },
    { label: 'Company Name', value: 'Tech Corp' },
    { label: 'Contact Person', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Comapany Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  const shipmentData = [
    { label: ' LPR Lead time', value: '12:00' },
    { label: ' RFQ Lead time', value: '12:00' },
    { label: 'Delivery Term', value: 'hdh' },
    { label: 'Delivery Address', value: 'hdh' },
    { label: 'Response Time (Days)', value: 'djhjdh' },
    { label: 'Email Sent Dt.', value: ' ' },
    { label: ' RFQ Remarks', value: ' Additional Remarks Additional Remarks' }
  ];
  const rfqItemcolumns = [
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_description', headerName: 'Remarks', width: 450 },
    { field: 'company_name', headerName: 'Company', width: 200 },
    { field: 'uom_name', headerName: 'UOM', width: 70 },
    { field: 'qty', headerName: 'Req Qty', width: 80, renderCell: (params) => formatNumber(params.value) },

    {
      field: 'tolerance',
      headerName: 'Tolerance %',
      width: 150,
      editable: true,

      renderCell: (params) => formatNumber(params.value || '')
    },
    {
      field: 'net_qty',
      headerName: 'Net Qty',
      width: 100,
      renderCell: (params) => calcNet(Number(params?.row?.quantity), Number(params?.row?.qty))
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
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '8px !important' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600} textTransform={'none'}>
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
    <>
      <Box>
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {consinerData
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
        <Table>{renderTableHeader('rfqView', 'Basic Info')}</Table>
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

      <Box>
        <Table sx={{ mb: 1 }}>{renderTableHeader('itemListRfq', 'Vendor Detail')}</Table>
        {showTableHeading.itemListRfq && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              height: '20vh',
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
        <Table sx={{ mb: 1 }}>{renderTableHeader('vendorlist', 'Required Documents at the time of Shipment')}</Table>
        {showTableHeading.vendorlist && (
          <Box>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                height: '20vh',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',

                  alignItems: 'start'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',

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
      <Table sx={{ mb: 1 }}>{renderTableHeader('createrfqForm', 'Item List of RFQ')}</Table>
      {showTableHeading.createrfqForm && (
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
    </>
  );
};

export default ViewGenerateRfqPage;
