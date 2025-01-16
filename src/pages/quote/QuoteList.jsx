import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';
import QuoteView from './QuoteView';

const QuoteList = () => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null); // State to store selected quotation

  const handleViewClick = (row) => {
    setSelectedQuotation(row); // Set selected quotation data
    setShowQuoteForm(false); // Hide the quote list to show the view page
  };

  const QuoteColumn = [
    {
      field: 'quo_id',
      headerName: 'Quotation ID',
      width: 100
    },
    {
      field: 'quo_num',
      headerName: 'Quotation Number',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'vendor_reference_no', headerName: 'Vendor Ref. No.', width: 150 },
    { field: 'rfq_num', headerName: 'RFQ Number', width: 150 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 150 },
    { field: 'company_name', headerName: 'Company Name', width: 150 },
    { field: 'referenceDate', headerName: 'RFQ Generate Date ', width: 150 },
    { field: 'quo_date', headerName: 'Quotation Date', width: 150 },
    { field: 'currency', headerName: 'Currency', width: 150 },
    { field: 'delivery_terms', headerName: 'Delivery Terms', width: 150 },
    { field: 'country_origin', headerName: 'Country of Origin', width: 150 },
    { field: 'country_supply', headerName: 'Country of Supply', width: 150 },
    { field: 'port_loading', headerName: 'Port of Loading', width: 150 },
    { field: 'lead_time', headerName: 'Lead Time', width: 150 },
    { field: 'payment_terms', headerName: 'Payment Terms', width: 250 },
    { field: 'remarks', headerName: 'Remarks', width: 250 },
    { field: 'total_cost', headerName: 'Total Cost', width: 150 }
  ];

  const QuoteData = [
    {
      id: 1,
      quo_id: 1,
      quo_num: 'Q-001',
      vendor_reference_no: 'VRN-101',
      rfq_num: 'RFQ-5001',
      vendor_name: 'Vendor A',
      company_name: 'Company X',
      referenceDate: '2025-01-01',
      quo_date: '2025-01-10',
      currency: 'USD',
      delivery_terms: 'FOB',
      country_origin: 'USA',
      country_supply: 'India',
      port_loading: 'New York Port',
      lead_time: '30 days',
      payment_terms: '30% Advance, 70% on Delivery',
      remarks: 'Urgent delivery required.',
      total_cost: 5000
    },
    {
      id: 2,
      quo_id: 2,
      quo_num: 'Q-002',
      vendor_reference_no: 'VRN-102',
      rfq_num: 'RFQ-5002',
      vendor_name: 'Vendor B',
      company_name: 'Company Y',
      referenceDate: '2025-01-02',
      quo_date: '2025-01-12',
      currency: 'EUR',
      delivery_terms: 'CIF',
      country_origin: 'Germany',
      country_supply: 'UK',
      port_loading: 'Hamburg Port',
      lead_time: '25 days',
      payment_terms: '50% Advance, 50% on Delivery',
      remarks: 'Include insurance details.',
      total_cost: 3000
    },
    {
      id: 3,
      quo_id: 3,
      quo_num: 'Q-003',
      vendor_reference_no: 'VRN-103',
      rfq_num: 'RFQ-5003',
      vendor_name: 'Vendor C',
      company_name: 'Company Z',
      referenceDate: '2025-01-03',
      quo_date: '2025-01-15',
      currency: 'INR',
      delivery_terms: 'EXW',
      country_origin: 'India',
      country_supply: 'USA',
      port_loading: 'Chennai Port',
      lead_time: '20 days',
      payment_terms: '100% on Delivery',
      remarks: 'Payment on successful inspection.',
      total_cost: 7000
    }
  ];

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{!showQuoteForm && !selectedQuotation ? 'Quote List' : 'View Quotation'}</span>
          {!showQuoteForm && selectedQuotation && (
            <PlusButton
              label="Back"
              onClick={() => {
                setSelectedQuotation(null);
              }}
            />
          )}
        </Box>
      }
    >
      {!selectedQuotation ? (
        <Box>
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
              }
            }}
            rows={QuoteData}
            columns={QuoteColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            hideFooter
          />
        </Box>
      ) : (
        <QuoteView data={selectedQuotation} />
      )}
    </MainCard>
  );
};

export default QuoteList;
