import { Box, Typography, IconButton, Grid, Table, TableRow, TableHead, TableCell, Checkbox } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import VendorList from './VendorList';
import AdditionalInformationView from './AdditionalInformationView';
import ItemList from './ItemList';
import { DataGrid } from '@mui/x-data-grid';

const QuoteView = ({ selectedRFQ, onBack }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqDetail: true,
    quotedetail: true,
    itemList: true,
    logisticDetail: true,
    requireDocs: true,
    BreakupAmountDetails: true,
    additionalCostDetail: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
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

  const rfqDocListColumns = [
    { field: 'doc_name', headerName: 'Doc Name', width: 200 },
    { field: 'remark', headerName: 'Remark', width: 200 },
    {
      field: 'is_available',
      headerName: 'Is Available',
      width: 150,
      renderCell: (params) => (
        <span style={{ fontWeight: 'bold', color: params.value ? 'green' : 'red' }}>{params.value ? 'Yes' : 'No'}</span>
      )
    }
  ];
  const rfqDocListData = [
    { id: 1, doc_name: 'Technical Document', remark: 'Uploaded successfully', is_available: true },
    { id: 2, doc_name: 'Safety Guidelines', remark: 'Pending approval', is_available: false },
    { id: 3, doc_name: 'Financial Report', remark: 'Requires review', is_available: true },
    { id: 4, doc_name: 'Environmental Policy', remark: 'Outdated document', is_available: false },
    { id: 5, doc_name: 'Operational Manual', remark: 'Uploaded successfully', is_available: true }
  ];
  const remarksHeader = [
    { field: 'doc_name', headerName: 'Doc Name', width: 200 },
    { field: 'remark', headerName: 'Remark', width: 200 },
    {
      field: 'document',
      headerName: 'Document',
      width: 150,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
          View Document
        </a>
      )
    }
  ];

  const remarksData = [
    { id: 1, doc_name: 'Technical Document', remark: 'Uploaded successfully', document: 'https://example.com/technical-document.pdf' },
    { id: 2, doc_name: 'Safety Guidelines', remark: 'Pending approval', document: 'https://example.com/safety-guidelines.pdf' },
    { id: 3, doc_name: 'Financial Report', remark: 'Requires review', document: 'https://example.com/financial-report.pdf' },
    { id: 4, doc_name: 'Environmental Policy', remark: 'Outdated document', document: 'https://example.com/environmental-policy.pdf' },
    { id: 5, doc_name: 'Operational Manual', remark: 'Uploaded successfully', document: 'https://example.com/operational-manual.pdf' }
  ];

  const shipmentData = [
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  const VendorData = [
    { label: 'Vendor Name', value: 'Tech Corp' },
    { label: 'Vendor Reference No', value: 'VREF1234' },
    { label: 'Vendor Reference Date', value: '2025-01-01' },
    { label: 'Quotation Date', value: '2025-01-10' },
    { label: 'Currency', value: 'USD' },
    { label: 'Delivery Terms', value: 'FOB (Free On Board)' },
    { label: 'Lead Initiated Point', value: 'New York, USA' },
    { label: 'Quote Valid Till', value: '2025-02-01' }
  ];
  const logisticDetailData = [
    { label: 'Country of Origin', value: 'USA' },
    { label: 'Country of Supply', value: 'India' },
    { label: 'Port of Loading', value: 'Los Angeles Port' },
    { label: 'Lead Time', value: '15 Days' },
    { label: 'Payment Terms', value: 'Net 30 Days' },
    { label: 'Remarks', value: 'Ensure proper documentation before shipment.' }
  ];
  const ItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 150 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_name_vendor', headerName: 'Vendor Item Name', width: 200 },
    { field: 'item_name_label', headerName: 'Label Item Name', width: 200 },
    { field: 'oprQty', headerName: 'OPR Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'item_uom', headerName: 'Item UOM', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 },
    { field: 'remarks', headerName: 'Remarks', width: 150 }
  ];
  const itemData = [
    {
      id: 1,
      item_type: 'Electronics',
      item_code: 'ELEC001',
      item_name: 'Laptop',
      item_name_vendor: 'Dell Inspiron',
      item_name_label: 'Dell Inspiron 15',
      oprQty: 50,
      quoteQty: 45,
      item_uom: 'Pieces',
      rate: 75000,
      no_packs: 5,
      pack_size: '10',
      pack_type: 'Box',
      line_total: 3375000,
      remarks: 'Urgent Requirement'
    },
    {
      id: 2,
      item_type: 'Furniture',
      item_code: 'FURN002',
      item_name: 'Office Chair',
      item_name_vendor: 'ErgoComfort',
      item_name_label: 'ErgoComfort Pro',
      oprQty: 100,
      quoteQty: 95,
      item_uom: 'Pieces',
      rate: 5000,
      no_packs: 10,
      pack_size: '10',
      pack_type: 'Carton',
      line_total: 475000,
      remarks: 'Bulk Order Discount Applied'
    },
    {
      id: 3,
      item_type: 'Stationery',
      item_code: 'STAT003',
      item_name: 'Notebooks',
      item_name_vendor: 'Classmate',
      item_name_label: 'Classmate A4',
      oprQty: 200,
      quoteQty: 180,
      item_uom: 'Pieces',
      rate: 50,
      no_packs: 20,
      pack_size: '10',
      pack_type: 'Bundle',
      line_total: 9000,
      remarks: 'Delivered in Partial Shipment'
    },
    {
      id: 4,
      item_type: 'Hardware',
      item_code: 'HARD004',
      item_name: 'Drill Machine',
      item_name_vendor: 'Bosch Pro',
      item_name_label: 'Bosch GSB 550',
      oprQty: 30,
      quoteQty: 28,
      item_uom: 'Pieces',
      rate: 12000,
      no_packs: 3,
      pack_size: '10',
      pack_type: 'Box',
      line_total: 336000,
      remarks: 'Check for Warranty Details'
    },
    {
      id: 5,
      item_type: 'Chemicals',
      item_code: 'CHEM005',
      item_name: 'Acetone',
      item_name_vendor: 'Chemical Solutions',
      item_name_label: 'ACS Grade',
      oprQty: 500,
      quoteQty: 450,
      item_uom: 'Liters',
      rate: 200,
      no_packs: 50,
      pack_size: '10',
      pack_type: 'Drum',
      line_total: 90000,
      remarks: 'Handle with Care'
    }
  ];
  const quotationAmountBreakup = [
    { label: 'FOB Cost', value: '2236700 INR' },
    { label: 'Inland Charges', value: '700 INR' },
    { label: 'Freight Cost', value: '12000 INR' },
    { label: 'Quotation Amount', value: '2249400 INR' }
  ];
  const additionalCostData = [
    { label: 'Total Freight Charges', value: 'Tech Corp' },
    { label: 'Special Packaging', value: 'LPR1234' }
  ];
  return (
    <>
      <Table>{renderTableHeader('rfqDetail', 'Buying House Info')}</Table>
      {showTableHeading.rfqDetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {shipmentData.map((item, index) => (
              <Grid item xs={3} key={index}>
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
        </Grid>
      )}
      <Table>{renderTableHeader('quotedetail', 'Vendor Details')}</Table>
      {showTableHeading.quotedetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {VendorData.map((item, index) => (
              <Grid item xs={3} key={index}>
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
        </Grid>
      )}
      <Table>{renderTableHeader('logisticDetail', 'Logictics Details')}</Table>
      {showTableHeading.logisticDetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {logisticDetailData.map((item, index) => (
              <Grid item xs={3} key={index}>
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
        </Grid>
      )}
      <Table>{renderTableHeader('requireDocs', 'Require Docs')}</Table>
      {showTableHeading.requireDocs && (
        <Box>
          <Grid container spacing={2}>
            {/* First DataGrid */}
            <Grid item xs={12} md={6}>
              <Box color={'#3f78ff'}>Require Docs</Box>
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
                rows={rfqDocListData}
                columns={rfqDocListColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>

            {/* Second DataGrid */}
            <Grid item xs={12} md={6}>
              <Box color={'#3f78ff'}>Docs Details</Box>
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
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  }
                }}
                rows={remarksData}
                columns={remarksHeader}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <Table sx={{ marginTop: '20px' }}>{renderTableHeader('additionalCostDetail', 'Additional Cost Detail')}</Table>
      <Table>
        {showTableHeading.additionalCostDetail && (
          <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
            <Grid container spacing={2}>
              {additionalCostData.map((item, index) => (
                <Grid item xs={3} key={index}>
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
          </Grid>
        )}
      </Table>
      <Table>{renderTableHeader('BreakupAmountDetails', 'Quotation Amount Breakup')}</Table>
      <Table>
        {showTableHeading.BreakupAmountDetails && (
          <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
            <Grid container spacing={2}>
              {quotationAmountBreakup.map((item, index) => (
                <Grid item xs={3} key={index}>
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
          </Grid>
        )}
      </Table>
      <Table>{renderTableHeader('itemList', 'Item Details')}</Table>
      {showTableHeading.itemList && (
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
              // height: '25px !important',
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
      )}
    </>
  );
};

export default QuoteView;
