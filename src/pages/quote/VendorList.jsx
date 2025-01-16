import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create'; // Import Material UI's Create Icon
import QuoteForm from './QuoteForm';

const VendorList = () => {
  // Replace with your actual logic if dynamic
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleCreateClick = (vendor) => {
    setSelectedVendor(vendor); // Save the selected vendor details
    setShowQuoteForm(true); // Show the QuoteForm
  };

  const handleBackToList = () => {
    setShowQuoteForm(false); // Hide the QuoteForm and show the list
    setSelectedVendor(null); // Reset the selected vendor
  };
  // Hardcoded vendor data
  const VendorData = [
    {
      id: 1,
      vendor_series: 'VS-001',
      vendor_name: 'Vendor A',
      phone_number: '123-456-7890',
      email: 'vendorA@example.com',
      contact_person: 'John Doe',
      contact_person_phone: '123-123-1234',
      contact_person_email: 'johndoe@example.com'
    },
    {
      id: 2,
      vendor_series: 'VS-002',
      vendor_name: 'Vendor B',
      phone_number: '987-654-3210',
      email: 'vendorB@example.com',
      contact_person: 'Jane Smith',
      contact_person_phone: '987-987-9876',
      contact_person_email: 'janesmith@example.com'
    },
    {
      id: 3,
      vendor_series: 'VS-003',
      vendor_name: 'Vendor C',
      phone_number: '456-789-0123',
      email: 'vendorC@example.com',
      contact_person: 'Michael Brown',
      contact_person_phone: '456-456-4567',
      contact_person_email: 'michaelbrown@example.com'
    },
    {
      id: 4,
      vendor_series: 'VS-004',
      vendor_name: 'Vendor D',
      phone_number: '321-654-9870',
      email: 'vendorD@example.com',
      contact_person: 'Emily Davis',
      contact_person_phone: '321-321-3214',
      contact_person_email: 'emilydavis@example.com'
    },
    {
      id: 5,
      vendor_series: 'VS-005',
      vendor_name: 'Vendor E',
      phone_number: '654-321-7890',
      email: 'vendorE@example.com',
      contact_person: 'Chris Green',
      contact_person_phone: '654-654-6543',
      contact_person_email: 'chrisgreen@example.com'
    }
  ];

  // Vendor columns configuration
  const VendorColumn = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'action',
      headerName: 'Create',
      width: 80,
      renderCell: (params) => <CreateIcon style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleCreateClick(params.row)} />
    },
    { field: 'vendor_series', headerName: 'Vendor Num', width: 120 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 250 },
    { field: 'phone_number', headerName: 'Vendor Ph. No.', width: 150 },
    { field: 'email', headerName: 'Vendor Email', width: 200 },
    { field: 'contact_person', headerName: 'Contact Person Name', width: 180 },
    { field: 'contact_person_phone', headerName: 'Contact Person Ph. No.', width: 180 },
    { field: 'contact_person_email', headerName: 'Contact Person Email', width: 200 }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {showQuoteForm ? (
        // Render the QuoteForm when showQuoteForm is true
        <QuoteForm
          vendor={selectedVendor}
          onBack={handleBackToList} // Pass a callback to go back to the vendor list
        />
      ) : (
        // Render the Vendor DataGrid when showQuoteForm is false
        <Box sx={{ marginBottom: '10px', overflowX: 'auto', width: '98dvw' }}>
          <div style={{ overflow: 'hidden' }}>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={VendorData}
              columns={VendorColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooterPagination
              hideFooter
            />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default VendorList;
