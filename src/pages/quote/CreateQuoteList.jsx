import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';
import CreateQuotePage from './CreateQuotePage';
import { Box } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { width } from '@mui/system';

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
      field: 'id',
      headerName: 'Sr. No.',
      width: 60
    },
    {
      field: 'rfq_num',
      headerName: 'RFQ No',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewRFQ(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      width: 100
    },
    { field: 'created_on', headerName: 'RFQ Dt.', sort: 'desc', width: 100 },
    { field: 'lpr_no', headerName: 'LPR No.', sort: 'desc', width: 100 },
    { field: 'delivery_term', headerName: 'Delivery Term', width: 150 },
    { field: 'delivery_time', headerName: 'Delivery Time', width: 150 },
    { field: 'port_of_destination_name', headerName: 'Factory Name', width: 150 },
    { field: 'quotes_sent', headerName: 'Quotes Received', width: 100 },
    { field: 'created_by', headerName: 'Created By', width: 100 },
    { field: 'delivery_address', headerName: 'Delivery Address', width: 150, flex: 1 }
  ];
  const quoteData = [
    {
      id: 1,
      rfq_num: 'RFQ-001',
      created_on: '2025-01-10',
      lpr_no: 'LPR-101',
      delivery_term: 'Ex-Works',
      delivery_time: '30 Days',
      port_of_destination_name: 'Factory A',
      quotes_sent: '5',
      created_by: 'John Doe',
      delivery_address: '123 Industrial Road, City A'
    },
    {
      id: 2,
      rfq_num: 'RFQ-002',
      created_on: '2025-01-12',
      lpr_no: 'LPR-102',
      delivery_term: 'FOB',
      delivery_time: '45 Days',
      port_of_destination_name: 'Factory B',
      quotes_sent: '8',
      created_by: 'Jane Smith',
      delivery_address: '456 Commercial Avenue, City B'
    },
    {
      id: 3,
      rfq_num: 'RFQ-003',
      created_on: '2025-01-15',
      lpr_no: 'LPR-103',
      delivery_term: 'CIF',
      delivery_time: '60 Days',
      port_of_destination_name: 'Factory C',
      quotes_sent: '3',
      created_by: 'Emily Davis',
      delivery_address: '789 Industrial Park, City C'
    },
    {
      id: 4,
      rfq_num: 'RFQ-004',
      created_on: '2025-01-18',
      lpr_no: 'LPR-104',
      delivery_term: 'DDP',
      delivery_time: '25 Days',
      port_of_destination_name: 'Factory D',
      quotes_sent: '10',
      created_by: 'Michael Brown',
      delivery_address: '101 Industrial Boulevard, City D'
    }
  ];

  return (
    <>
      {viewMode ? (
        <CreateQuotePage selectedRFQ={selectedRFQ} onBack={() => setViewMode(false)} />
      ) : (
        <MainCard title={'Create Quotation - Pending RFQ'}>
          <Box sx={{ width: '100%' }}>
            {!viewMode && (
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
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
                rows={quoteData}
                columns={QuoteColumn}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            )}
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default CreateQuoteList;
