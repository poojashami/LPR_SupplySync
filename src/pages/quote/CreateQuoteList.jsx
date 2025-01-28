import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';
import CreateQuotePage from './CreateQuotePage';
import { Box } from '@mui/material';
import PlusButton from 'components/CustomButton';

const CreateQuoteList = () => {
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [createQuoteOpen, setCreateQuoteOpen] = useState(false);

  const handleViewRFQ = (rfq) => {
    setSelectedRFQ(rfq.rfq_num);
    setViewMode(true);
  };
  const handleCreateQuote = () => {
    setCreateQuoteOpen(true); // Open Create Quote Page
    setViewMode(false); // Ensure viewMode is false when creating quote
  };
  const QuoteColumn = [
    {
      field: 'key',
      headerName: 'SL. NO.',
      width: 80,
      flex: 0.5
    },
    {
      field: 'rfq_num',
      headerName: 'RFQ Number',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewRFQ(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      flex: 1
    },
    { field: 'created_on', headerName: 'Created On', sort: 'desc', flex: 1 },
    { field: 'delivery_timeline_in_weeks', headerName: 'Delivery Time', width: 150, flex: 1 },
    { field: 'port_of_destination_name', headerName: 'Port of Destination', width: 150, flex: 1 },
    { field: 'quotes_sent', headerName: 'Quotes Received', flex: 1 },
    { field: 'created_by', headerName: 'Created By', flex: 1 }
  ];

  const QuoteData = [
    {
      id: 1,
      key: 1,
      rfq_num: 'RFQ-1001',
      created_on: '2025-01-01',
      delivery_timeline_in_weeks: '2 Weeks',
      port_of_destination_name: 'Port of New York',
      quotes_sent: 5,
      created_by: 'John Doe'
    },
    {
      id: 2,
      key: 2,
      rfq_num: 'RFQ-1002',
      created_on: '2025-01-02',
      delivery_timeline_in_weeks: '3 Weeks',
      port_of_destination_name: 'Port of Los Angeles',
      quotes_sent: 3,
      created_by: 'Jane Smith'
    }
  ];

  return (
    <>
      {viewMode ? (
        <CreateQuotePage  selectedRFQ={selectedRFQ} onBack={() => setViewMode(false)} />
      ) : (
        <MainCard title={'Create Quotation - Pending RFQ'}>
          <Box sx={{ width: '100%' }}>
            {!viewMode && (
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
                    margin: '0 auto',
                    width: '18px',
                    height: '18px'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px'
                  },
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  },
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
            )}
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default CreateQuoteList;
