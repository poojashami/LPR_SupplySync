import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Checkbox, Chip } from '@mui/material';
import MainCard from 'components/MainCard';

import AllLPRApproveData from './AllLPRApproveData';

const GRNList = () => {
  const [viewLPR, setViewLPR] = useState(false);
  const [selectedLPR, setSelectedLPR] = useState(null);

  const handleLprClick = (row) => {
    setSelectedLPR(row); // Store the clicked row details
    setViewLPR(true); // Show the LPRView component
  };

  const LPRColumn = [
    {
      field: 'lprNo',
      headerName: 'LPR No.',
      renderCell: (params) => (
        <Box
          sx={{
            width: '170px',
            color: 'navy',
            fontWeight: 'bold',
            fontSize: '11px',
            padding: '4px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => handleLprClick(params.row)}
        >
          {params.value}
        </Box>
      ),
      width: 170
    },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'vertical', headerName: 'Vertical', width: 100 },
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'division', headerName: 'Division', width: 150 },
    { field: 'lprCategory', headerName: 'LPR Category', width: 150 },
    { field: 'shipmentMode', headerName: 'Shipment Mode', width: 150 },
    { field: 'buyingThrough', headerName: 'Buying Through', width: 150 },
    { field: 'leftForRFQ', headerName: 'Left for RFQ', width: 150 },
    { field: 'deliveryTime', headerName: 'Delivery Time', width: 150 },
    { field: 'requestedByDept', headerName: 'Requested By Department', width: 150 },
    { field: 'requestedBy', headerName: 'Requested By', width: 150 }
  ];

  const LPRData = [
    {
      id: 1,
      lprNo: 'LPR001JBJKKJ878',
      status: 'Send for Approval',
      vertical: 'Finance',
      company: 'ABC Corp',
      division: 'North Division',
      lprCategory: 'Urgent',
      shipmentMode: 'Air',
      buyingThrough: 'Direct',
      leftForRFQ: '5 days',
      deliveryTime: '10 days',
      requestedByDept: 'Logistics',
      requestedBy: 'John Doe'
    },
    {
      id: 2,
      lprNo: 'LPR00KJHKJH2',
      status: 'Send for Approval',
      vertical: 'IT',
      company: 'XYZ Ltd',
      division: 'South Division',
      lprCategory: 'Regular',
      shipmentMode: 'Sea',
      buyingThrough: 'Agent',
      leftForRFQ: '10 days',
      deliveryTime: '30 days',
      requestedByDept: 'Procurement',
      requestedBy: 'Jane Smith'
    }
  ];

  return (
    <MainCard
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          <div>GRN List</div>
        </Box>
      }
    >
      {viewLPR ? (
        <AllLPRApproveData lprData={selectedLPR} onBack={() => setViewLPR(false)} />
      ) : (
        <Box sx={{ width: '100%' }}>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              fontSize: '11px',
              height: '85vh',
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
            rows={LPRData}
            columns={LPRColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
      )}
    </MainCard>
  );
};

export default GRNList;
