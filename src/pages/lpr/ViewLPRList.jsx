import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Tabs, Tab, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import AllLPRViewApproveData from './AllLPRViewApproveData';
const LPRData = [
  {
    id: 1,
    lprNo: 'LPR001',
    status: 'Approved',
    vertical: 'Sales',
    company: 'ABC Corp',
    division: 'East Division',
    lprCategory: 'Electronics',
    shipmentMode: 'Air',
    buyingThrough: 'Direct',
    leftForRFQ: '3 Days',
    deliveryTime: '7 Days',
    requestedByDept: 'Procurement',
    requestedBy: 'John Doe'
  },
  {
    id: 2,
    lprNo: 'LPR002',
    status: 'Pending',
    vertical: 'Marketing',
    company: 'XYZ Ltd',
    division: 'West Division',
    lprCategory: 'Stationery',
    shipmentMode: 'Sea',
    buyingThrough: 'Tender',
    leftForRFQ: '5 Days',
    deliveryTime: '15 Days',
    requestedByDept: 'Administration',
    requestedBy: 'Jane Smith'
  },
  {
    id: 3,
    lprNo: 'LPR003',
    status: 'Rejected',
    vertical: 'Operations',
    company: 'DEF Inc',
    division: 'North Division',
    lprCategory: 'Furniture',
    shipmentMode: 'Road',
    buyingThrough: 'Contract',
    leftForRFQ: '1 Day',
    deliveryTime: '10 Days',
    requestedByDept: 'Logistics',
    requestedBy: 'Michael Brown'
  },
  {
    id: 4,
    lprNo: 'LPR004',
    status: 'Approved',
    vertical: 'HR',
    company: 'LMN Pvt Ltd',
    division: 'South Division',
    lprCategory: 'IT Equipment',
    shipmentMode: 'Air',
    buyingThrough: 'Direct',
    leftForRFQ: '2 Days',
    deliveryTime: '5 Days',
    requestedByDept: 'IT',
    requestedBy: 'Sarah Wilson'
  },
  {
    id: 5,
    lprNo: 'LPR005',
    status: 'Pending',
    vertical: 'Finance',
    company: 'GHI LLP',
    division: 'Central Division',
    lprCategory: 'Office Supplies',
    shipmentMode: 'Sea',
    buyingThrough: 'Tender',
    leftForRFQ: '4 Days',
    deliveryTime: '20 Days',
    requestedByDept: 'Finance',
    requestedBy: 'Emily Davis'
  }
];

const ViewLPRList = () => {
  const [viewLPR, setViewLPR] = useState(false);
  const [selectedLPR, setSelectedLPR] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleLprClick = (row) => {
    setSelectedLPR(row);
    setViewLPR(true);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const LPRColumn = [
    {
      field: 'lprNo',
      headerName: 'LPR No.',
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            width: '200px', // Fixed width
            bgcolor: '#cecece', // Background color
            color: 'black', // Text color
            fontWeight: 'bold', // Bold text
            fontSize: '11px',
            '&:hover': {
              bgcolor: '#b3b3b3' // Hover effect
            },
            '& .MuiChip-label': {
              color: 'black' // Label text color
            }
          }}
          onClick={() => handleLprClick(params.row)}
        />
      ),
      width: 150 // Adjusted to match Chip's width
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
  const filterDataByStatus = (status) => {
    return LPRData.filter((item) => item.status === status);
  };
  return (
    <MainCard
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <div>LPR List</div>
        </Box>
      }
    >
      <Tabs value={selectedTab} onChange={handleTabChange} style={{ marginBottom: '10px' }}>
        <Tab label="Approved" />
        <Tab label="Pending" />
        <Tab label="Rejected" />
        <Tab label="All" />
      </Tabs>

      {viewLPR ? (
        <AllLPRViewApproveData lprData={selectedLPR} onBack={() => setViewLPR(false)} />
      ) : (
        <Box sx={{ width: '100%' }}>
          {selectedTab === 0 && (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                fontSize: '11px',
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
                  margin: '0 auto',
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
              rows={filterDataByStatus('Approved')}
              columns={LPRColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}

          {selectedTab === 1 && (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                fontSize: '11px',
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
                  margin: '0 auto',
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
              rows={filterDataByStatus('Pending')}
              columns={LPRColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}

          {selectedTab === 2 && (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                fontSize: '11px',
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
                  margin: '0 auto',
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
              rows={filterDataByStatus('Rejected')}
              columns={LPRColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}
          {selectedTab === 3 && (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                fontSize: '11px',
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
                  margin: '0 auto',
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
          )}
        </Box>
      )}
    </MainCard>
  );
};

export default ViewLPRList;
