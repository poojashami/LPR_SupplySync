import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { DataGrid } from '@mui/x-data-grid';

const LPOView = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetail: true,
    oprDetail: true,
    additinalCost: true,
    ApprovalDetails: true,
    BreakupAmountDetails: true,
    itemDetails: true
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
  const lpoData = [
    { label: 'Vendor Name', value: 'Tech Corp' },
    { label: 'Quotation Reference No', value: 'LPR1234' },
    { label: 'OPR Num', value: 'OPR-56789' },
    { label: 'Currency', value: 'USD' },
    { label: 'Delivery Terms', value: 'FOB (Free on Board)' },
    { label: 'Payment Terms', value: 'Net 30 Days' },
    { label: 'Quotation Remarks', value: 'Prices valid for 60 days' },
    { label: 'Unit', value: 'Piece' },
    { label: 'FORM M No', value: 'FM12345' },
    { label: 'LC No.', value: 'LC78901' },
    { label: 'Country of Origin', value: 'USA' },
    { label: 'Country of Supply', value: 'China' },
    { label: 'Shipment Mode', value: 'Air Freight' },
    { label: 'Shipment Term', value: 'EXW (Ex Works)' },
    { label: 'Shipment Type', value: 'Full Container Load (FCL)' },
    { label: 'Port of Loading', value: 'Port of Shanghai' },
    { label: 'Port of Delivery', value: 'Port of Los Angeles' },
    { label: 'Country of Delivery', value: 'United States' },
    { label: 'Delivery Time', value: '4 Weeks' },
    { label: 'Delivery Location', value: '123 Tech Street, Electronics City, CA' }
  ];
  const oprData = [
    { label: 'Vendor', value: 'Tech Corp' },
    { label: 'Company', value: 'Global Electronics Ltd.' },
    { label: 'Department', value: 'Procurement' },
    { label: 'Ship Mode', value: 'Air Freight' },
    { label: 'Buying House', value: 'Global Buying Solutions' },
    { label: 'Unit Justification', value: 'Required for assembly line' },
    { label: 'Procurement Justification', value: 'Best price and lead time' },
    { label: 'Total Cost', value: '15,000 USD' }
  ];
  const req_docs = [
    { id: 1, doc_name: 'Purchase Order', remarks: 'Approved by manager', is_available: 'Yes' },
    { id: 2, doc_name: 'Invoice', remarks: 'Pending review', is_available: 'No' },
    { id: 3, doc_name: 'Delivery Note', remarks: 'Delivered on time', is_available: 'Yes' },
    { id: 4, doc_name: 'Packing List', remarks: 'Checked and verified', is_available: 'Yes' },
    { id: 5, doc_name: 'Bill of Lading', remarks: 'Requires additional signature', is_available: 'No' }
  ];
  const additionalChargesBuyer = [
    {
      id: 1,
      charge_name: 'handling_fee',
      charges_by: 'supplier',
      charge_amount: 100.0
    },
    {
      id: 2,
      charge_name: 'shipping_cost',
      charges_by: 'logistics',
      charge_amount: 250.0
    },
    {
      id: 3,
      charge_name: 'custom_duty',
      charges_by: 'government',
      charge_amount: 500.0
    },
    {
      id: 4,
      charge_name: 'insurance_fee',
      charges_by: 'insurer',
      charge_amount: 150.0
    },
    {
      id: 5,
      charge_name: 'warehouse_storage',
      charges_by: 'warehouse',
      charge_amount: 300.0
    }
  ];
  const ApprovalHeader = [
    { field: 'id', headerName: 'BY', width: 50 },
    { field: 'user_name', headerName: 'Concurred By', width: 100 },
    { field: 'concurrence_remarks', headerName: 'Concurrence Remarks', width: 200 },
    { field: 'updatedAt', headerName: 'Concurrence Time', width: 200 },
    { field: 'action', headerName: 'Action', width: 100 },
    { field: 'approval_status', headerName: 'Last Status', width: 100 }
  ];
  const ApprovalData = [
    {
      id: 1,
      user_name: 'John Doe',
      concurrence_remarks: 'Approved with minor changes.',
      updatedAt: '2025-01-15 10:30 AM',
      action: 'Approve',
      approval_status: 'Approved'
    },
    {
      id: 2,
      user_name: 'Jane Smith',
      concurrence_remarks: 'Requires further clarification.',
      updatedAt: '2025-01-14 03:45 PM',
      action: 'Request Changes',
      approval_status: 'Pending'
    },
    {
      id: 3,
      user_name: 'Michael Johnson',
      concurrence_remarks: 'Approved as is.',
      updatedAt: '2025-01-13 01:15 PM',
      action: 'Approve',
      approval_status: 'Approved'
    },
    {
      id: 4,
      user_name: 'Emily Davis',
      concurrence_remarks: 'Rejected due to incomplete details.',
      updatedAt: '2025-01-12 11:00 AM',
      action: 'Reject',
      approval_status: 'Rejected'
    },
    {
      id: 5,
      user_name: 'Chris Brown',
      concurrence_remarks: 'Approved after review.',
      updatedAt: '2025-01-11 09:20 AM',
      action: 'Approve',
      approval_status: 'Approved'
    }
  ];
  const QuotationHeader = [
    {
      field: 'quo_num',
      headerName: 'Quotation No.',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    {
      field: 'status_quo',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <div style={{ cursor: 'pointer' }} aria-hidden="true">
          {params?.value ? <b style={{ color: 'green' }}>Selected</b> : <b style={{ color: 'red' }}>Not Selected</b>}
        </div>
      ),
      sortable: true
    },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 200 },
    { field: 'quo_date', headerName: 'Quo Date', width: 100 },
    { field: 'delivery_terms', headerName: 'Delivery Terms', width: 100 },
    { field: 'lead_time', headerName: 'Lead Time', width: 80 },
    { field: 'currency', headerName: 'Currency', width: 80 },
    { field: 'total_cost', headerName: 'Amount', width: 80 },
    { field: 'additional_cost', headerName: 'Additional Costs', width: 80 },
    { field: 'final_amount', headerName: 'Final Total', width: 80 }
  ];
  const QuotationData = [
    {
      id: 1,
      quo_num: 'QTN-001',
      status_quo: true,
      vendor_name: 'Vendor A',
      quo_date: '2025-01-01',
      delivery_terms: 'FOB',
      lead_time: '10 days',
      currency: 'USD',
      total_cost: 5000,
      additional_cost: 300,
      final_amount: 5300
    },
    {
      id: 2,
      quo_num: 'QTN-002',
      status_quo: false,
      vendor_name: 'Vendor B',
      quo_date: '2025-01-03',
      delivery_terms: 'CIF',
      lead_time: '15 days',
      currency: 'EUR',
      total_cost: 4000,
      additional_cost: 200,
      final_amount: 4200
    },
    {
      id: 3,
      quo_num: 'QTN-003',
      status_quo: true,
      vendor_name: 'Vendor C',
      quo_date: '2025-01-05',
      delivery_terms: 'DDP',
      lead_time: '20 days',
      currency: 'INR',
      total_cost: 300000,
      additional_cost: 5000,
      final_amount: 305000
    },
    {
      id: 4,
      quo_num: 'QTN-004',
      status_quo: false,
      vendor_name: 'Vendor D',
      quo_date: '2025-01-07',
      delivery_terms: 'EXW',
      lead_time: '7 days',
      currency: 'GBP',
      total_cost: 3500,
      additional_cost: 100,
      final_amount: 3600
    },
    {
      id: 5,
      quo_num: 'QTN-005',
      status_quo: true,
      vendor_name: 'Vendor E',
      quo_date: '2025-01-09',
      delivery_terms: 'FCA',
      lead_time: '12 days',
      currency: 'JPY',
      total_cost: 750000,
      additional_cost: 25000,
      final_amount: 775000
    }
  ];
  const paymentHeader = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'term', headerName: 'Payment Term', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'due_on', headerName: 'Due on', width: 100 },
    { field: 'paid_amt', headerName: 'Paid Amt', width: 100 },
    { field: 'date', headerName: 'Date', width: 100 },
    {
      field: 'payment_status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <div style={{ cursor: 'pointer' }} aria-hidden="true">
          {params.value == 5 ? <b style={{ color: 'green' }}>Done</b> : <b style={{ color: 'red' }}> Not Done</b>}
        </div>
      )
    }
  ];
  const paymentData = [
    {
      id: 1,
      term: 'Advance Payment',
      amount: 5000,
      due_on: '2025-01-10',
      paid_amt: 5000,
      date: '2025-01-05',
      payment_status: 5
    },
    {
      id: 2,
      term: '50% on Delivery',
      amount: 10000,
      due_on: '2025-01-15',
      paid_amt: 5000,
      date: '2025-01-12',
      payment_status: 3
    },
    {
      id: 3,
      term: 'Remaining Payment',
      amount: 5000,
      due_on: '2025-01-20',
      paid_amt: 0,
      date: null,
      payment_status: 1
    },
    {
      id: 4,
      term: 'Milestone Payment',
      amount: 20000,
      due_on: '2025-02-01',
      paid_amt: 10000,
      date: '2025-01-28',
      payment_status: 3
    },
    {
      id: 5,
      term: 'Final Payment',
      amount: 15000,
      due_on: '2025-02-10',
      paid_amt: 15000,
      date: '2025-02-05',
      payment_status: 5
    }
  ];
  const quotationAmountBreakup = [
    { label: 'FOB Cost', value: '2236700 INR' },
    { label: 'Inland Charges', value: '700 INR' },
    { label: 'Freight Cost', value: '12000 INR' },
    { label: 'Quotation Amount', value: '2249400 INR' }
  ];
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
    <Box>
      <Table>{renderTableHeader('basicDetail', 'Basic Details')}</Table>
      {showTableHeading.basicDetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {lpoData
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
      {/* ----------------------------------------------------------------------- */}
      <Table>{renderTableHeader('oprDetail', 'OPR Details')}</Table>
      {showTableHeading.oprDetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {oprData
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
      {/* ----------------------------------------------------------------------- */}
      <Table>{renderTableHeader('additinalCost', 'Additional Charges & Required Documents')}</Table>
      {showTableHeading.additinalCost && (
        <Box padding={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',

                    alignItems: 'center',
                    textTransform: 'capitalize'
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
                columns={[
                  { headerName: 'Sr.No.', field: 'id', width: 50 },
                  {
                    headerName: 'Charge name',
                    field: 'charge_name',
                    width: 180,
                    renderCell: (params) => {
                      return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                    }
                  },
                  {
                    headerName: 'Charges By',
                    field: 'charges_by',
                    width: 80,
                    flex: 1,
                    renderCell: (params) => {
                      return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                    }
                  },
                  {
                    headerName: 'Charges Amount',
                    field: 'charge_amount',
                    width: 120
                  }
                ]}
                rows={additionalChargesBuyer}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',

                    alignItems: 'center',
                    textTransform: 'capitalize'
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
                columns={[
                  { headerName: 'Sr.No.', field: 'id', width: 50 },
                  {
                    headerName: 'Doc name',
                    field: 'doc_name',
                    flex: 1
                  },
                  {
                    headerName: 'Remarks',
                    field: 'remarks',
                    width: 80,
                    flex: 1
                  },
                  {
                    headerName: 'Is Available',
                    field: 'is_available',
                    width: 100
                  }
                ]}
                rows={req_docs}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <Table sx={{ marginTop: '20px' }}>{renderTableHeader('ApprovalDetails', 'Approval And Quotation Details & Payment Details')}</Table>
      {showTableHeading.ApprovalDetails && (
        <Box padding={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
                Approval Details
              </Typography>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',

                    alignItems: 'center',
                    textTransform: 'capitalize'
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
                columns={ApprovalHeader}
                rows={ApprovalData}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
                  Quotations Details
                </Typography>
                <button
                  variant="contained"
                  size="small
                  "
                  color="primary"
                >
                  View Comparision
                </button>
              </Box>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',

                    alignItems: 'center',
                    textTransform: 'capitalize'
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
                columns={QuotationHeader}
                rows={QuotationData}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
                Payment Details
              </Typography>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',

                    alignItems: 'center',
                    textTransform: 'capitalize'
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
                columns={paymentHeader}
                rows={paymentData}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Table sx={{ marginTop: '30px' }}> {renderTableHeader('BreakupAmountDetails', 'Quotation Amount Breakup')}</Table>
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

      <Table>{renderTableHeader('itemDetails', 'Items Details')}</Table>
      {showTableHeading.itemDetails && (
        <Box padding={1}>
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',

              alignItems: 'center',
              textTransform: 'capitalize'
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
      )}
    </Box>
  );
};

export default LPOView;
