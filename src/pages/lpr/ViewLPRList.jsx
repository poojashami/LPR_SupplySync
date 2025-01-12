import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox } from '@mui/material';
import MainCard from 'components/MainCard';
import CreateLPRForm from './CreateLPRForm';
import LPRView from './LPRView';
import AllLPRApproveData from './AllLPRApproveData';
import AllLPRViewApproveData from './AllLPRViewApproveData';

const ViewLPRList = () => {
  const [showLPRForm, setShowLPRForm] = useState(false);
  const [viewLPR, setViewLPR] = useState(false);
  const [selectedLPR, setSelectedLPR] = useState(null); // Holds the selected LPR details

  const handleLprClick = (row) => {
    setSelectedLPR(row); // Store the clicked row details
    setViewLPR(true); // Show the LPRView component
  };

  const LPRColumn = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: () => <Checkbox sx={{ padding: 0, margin: '0 auto' }} />,
      sortable: false
    },
    {
      field: 'lprNo',
      headerName: 'LPR No.',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: '#f0f8ff', // Light blue background
            color: '#003366', // Dark blue text
            padding: '5px 10px',
            borderRadius: '4px',
            fontWeight: 'bold', // Bold text
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onClick={() => handleLprClick(params.row)}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#cce7ff')} // Hover background
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0f8ff')} // Original background
        >
          {params.value}
        </div>
      ),
      width: 150
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
      status: 'Approved',
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
      status: 'Approved',
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
    <MainCard title={'LPR List'}>
      {viewLPR ? (
        <AllLPRViewApproveData lprData={selectedLPR} onBack={() => setViewLPR(false)} />
      ) : (
        <Box sx={{ width: '100%' }}>
          {!showLPRForm && !viewLPR ? (
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
              rows={LPRData}
              columns={LPRColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          ) : showLPRForm ? (
            <CreateLPRForm />
          ) : (
            <LPRView />
          )}
        </Box>
      )}
    </MainCard>
  );
};

export default ViewLPRList;
