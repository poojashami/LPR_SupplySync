import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';
import RFQForm from './QuoteForm';

const QuoteList = () => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const QuoteColumn = [
    { field: 'lprNo', headerName: 'Quote ID', width: 100 },
    { field: 'vertical', headerName: 'Quote No.', width: 100 },
    { field: 'company', headerName: 'RFQ No.', width: 150 },
    { field: 'division', headerName: 'Vendor Name', width: 150 },
    { field: 'lprCategory', headerName: 'RFQ Quote Date', width: 150 },
    { field: 'shipmentMode', headerName: 'Quote Date', width: 150 },
    { field: 'buyingThrough', headerName: 'Currency', width: 150 },
    { field: 'leftForRFQ', headerName: 'Delivery Terms', width: 150 },
    { field: 'deliveryTime', headerName: 'Country of Origin', width: 150 },
    { field: 'requestedByDept', headerName: 'Country of Supply', width: 150 },
    { field: 'requestedBy', headerName: 'Port of Loading', width: 150 },
    { field: 'leadTime', headerName: 'Lead Time', width: 150 }
  ];

  const QuoteData = [
    {
      id: 1,
      lprNo: 'Q001',
      vertical: 'Q-2024-001',
      company: 'RFQ-101',
      division: 'Vendor A',
      lprCategory: '2024-01-01',
      shipmentMode: '2024-01-05',
      buyingThrough: 'USD',
      leftForRFQ: 'FOB',
      deliveryTime: 'USA',
      requestedByDept: 'India',
      requestedBy: 'Mumbai',
      leadTime: '15 days'
    },
    {
      id: 2,
      lprNo: 'Q002',
      vertical: 'Q-2024-002',
      company: 'RFQ-102',
      division: 'Vendor B',
      lprCategory: '2024-01-02',
      shipmentMode: '2024-01-06',
      buyingThrough: 'EUR',
      leftForRFQ: 'CIF',
      deliveryTime: 'Germany',
      requestedByDept: 'France',
      requestedBy: 'Paris',
      leadTime: '10 days'
    },
    {
      id: 3,
      lprNo: 'Q003',
      vertical: 'Q-2024-003',
      company: 'RFQ-103',
      division: 'Vendor C',
      lprCategory: '2024-01-03',
      shipmentMode: '2024-01-07',
      buyingThrough: 'GBP',
      leftForRFQ: 'EXW',
      deliveryTime: 'UK',
      requestedByDept: 'Italy',
      requestedBy: 'Rome',
      leadTime: '20 days'
    },
    {
      id: 4,
      lprNo: 'Q004',
      vertical: 'Q-2024-004',
      company: 'RFQ-104',
      division: 'Vendor D',
      lprCategory: '2024-01-04',
      shipmentMode: '2024-01-08',
      buyingThrough: 'INR',
      leftForRFQ: 'DDP',
      deliveryTime: 'India',
      requestedByDept: 'China',
      requestedBy: 'Shanghai',
      leadTime: '30 days'
    },
    {
      id: 5,
      lprNo: 'Q004',
      vertical: 'Q-2024-004',
      company: 'RFQ-104',
      division: 'Vendor D',
      lprCategory: '2024-01-04',
      shipmentMode: '2024-01-08',
      buyingThrough: 'INR',
      leftForRFQ: 'DDP',
      deliveryTime: 'India',
      requestedByDept: 'China',
      requestedBy: 'Shanghai',
      leadTime: '30 days'
    },
    {
      id: 6,
      lprNo: 'Q004',
      vertical: 'Q-2024-004',
      company: 'RFQ-104',
      division: 'Vendor D',
      lprCategory: '2024-01-04',
      shipmentMode: '2024-01-08',
      buyingThrough: 'INR',
      leftForRFQ: 'DDP',
      deliveryTime: 'India',
      requestedByDept: 'China',
      requestedBy: 'Shanghai',
      leadTime: '30 days'
    },
    {
      id: 7,
      lprNo: 'Q004',
      vertical: 'Q-2024-004',
      company: 'RFQ-104',
      division: 'Vendor D',
      lprCategory: '2024-01-04',
      shipmentMode: '2024-01-08',
      buyingThrough: 'INR',
      leftForRFQ: 'DDP',
      deliveryTime: 'India',
      requestedByDept: 'China',
      requestedBy: 'Shanghai',
      leadTime: '30 days'
    }
  ];

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{!showQuoteForm ? 'Quote List' : showQuoteForm && 'Create Quote'}</span>
          {!showQuoteForm ? (
            <PlusButton label="+Create Quote" onClick={() => setShowQuoteForm(true)} />
          ) : (
            <PlusButton
              label="Back"
              onClick={() => {
                setShowQuoteForm(false);
              }}
            />
          )}
        </Box>
      }
    >
      <Box>
        {!showQuoteForm ? (
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
              },
              // Add striped rows
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: '#f9f9f9'
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: '#ffffff'
              }
            }}
            rows={QuoteData}
            columns={QuoteColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        ) : (
          showQuoteForm && <RFQForm />
        )}
      </Box>
    </MainCard>
  );
};

export default QuoteList;
