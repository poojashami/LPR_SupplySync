import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Checkbox, Chip } from '@mui/material';
import MainCard from 'components/MainCard';

import AllLPRApproveData from './AllLPRApproveData';

const LPRList = () => {
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
      width: 170 // Adjusted to match Chip's width
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
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <div>LPR List</div>
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
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#388E3C'
            }
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#2c6095',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#244b78'
            }
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#2c6095', // Vibrant blue
            color: '#fff', // White text for contrast
            '&:hover': {
              backgroundColor: '#244b78' // Darker blue on hover
            }
          }}
        >
          Send
        </Button>

        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#2196F3',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#1976D2'
            }
          }}
        >
          Add Items
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#2c6095',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#244b78'
            }
          }}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#FFC107',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#FFB300'
            }
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" size="small" color="error">
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#F44336',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#D32F2F'
            }
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#FF9800',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#F57C00'
            }
          }}
        >
          Pending
        </Button>
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{
            backgroundColor: '#9C27B0',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7B1FA2'
            }
          }}
        >
          Reject
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#4CAF50', // Text color
            borderColor: '#4CAF50', // Border color
            '&:hover': {
              color: '#388E3C', // Text color on hover
              borderColor: '#388E3C' // Border color on hover
            }
          }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#2c6095', // Text color
            borderColor: '#2c6095', // Border color
            '&:hover': {
              color: '#244b78', // Text color on hover
              borderColor: '#244b78' // Border color on hover
            }
          }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#2c6095', // Text color
            borderColor: '#2c6095', // Border color
            '&:hover': {
              color: '#244b78', // Text color on hover
              borderColor: '#244b78' // Border color on hover
            }
          }}
        >
          Send
        </Button>

        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#2196F3', // Text color
            borderColor: '#2196F3', // Border color
            '&:hover': {
              color: '#1976D2', // Text color on hover
              borderColor: '#1976D2' // Border color on hover
            }
          }}
        >
          Add Items
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#2c6095', // Text color
            borderColor: '#2c6095', // Border color
            '&:hover': {
              color: '#244b78', // Text color on hover
              borderColor: '#244b78' // Border color on hover
            }
          }}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#FFC107', // Text color
            borderColor: '#FFC107', // Border color
            '&:hover': {
              color: '#FFB300', // Text color on hover
              borderColor: '#FFB300' // Border color on hover
            }
          }}
        >
          Cancel
        </Button>
        <Button variant="outlined" size="small" color="error">
          Cancel
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#F44336', // Text color
            borderColor: '#F44336', // Border color
            '&:hover': {
              color: '#D32F2F', // Text color on hover
              borderColor: '#D32F2F' // Border color on hover
            }
          }}
        >
          Close
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#FF9800', // Text color
            borderColor: '#FF9800', // Border color
            '&:hover': {
              color: '#F57C00', // Text color on hover
              borderColor: '#F57C00' // Border color on hover
            }
          }}
        >
          Pending
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="button"
          sx={{
            color: '#9C27B0', // Text color
            borderColor: '#9C27B0', // Border color
            '&:hover': {
              color: '#7B1FA2', // Text color on hover
              borderColor: '#7B1FA2' // Border color on hover
            }
          }}
        >
          Reject
        </Button>
      </Box>
    </MainCard>
  );
};

export default LPRList;
