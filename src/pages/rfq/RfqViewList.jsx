import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';

import ViewGenerateRfqPage from './ViewGenerateRfqPage';

const RfqViewList = () => {
  const [showOprItemList, setShowOprItemList] = useState(false);
  const [generateRFQ, setGenerateRFQ] = useState(false);

  const handleRowClick = (params) => {
    if (params.field === 'opr_num') {
      setShowOprItemList(true);
    }
  };

  const rfqColumn = [
    { headerName: 'Sr. No.', field: 'id', width: 60 },
    { headerName: 'RFQ No.', field: 'rfq_no', width: 100 },
    { headerName: 'RFQ Dt.', field: 'rfq_dt', width: 100 },

    {
      field: 'opr_num',
      headerName: 'LPR No.',
      renderCell: (params) => (
        <div style={{ cursor: 'pointer', color: 'navy', textDecoration: 'none' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      width: 100
    },
    { headerName: 'LPR Category', field: 'lpr_cat', width: 100 },
    { headerName: 'Company Name', field: 'company_name', width: 130 },
    { headerName: 'Delivery Term', field: 'delivery_term', width: 100 },
    { headerName: 'Delivery Time', field: 'delivery_time', width: 100 },
    { headerName: 'Quote Received', field: 'quote_receive', width: 100 },
    { headerName: 'RFQ Status', field: 'rfq_status', width: 125 },
    { headerName: 'Created By', field: 'created_by', width: 100 },
    { headerName: 'RFQ Lead Time', field: 'rfq_lead_time', width: 100 },
    { headerName: 'Response Time (Days)', field: 'response_time', width: 100 },
    { headerName: 'LPR Remark', field: 'lpr_remark', width: 300 }
  ];

  const rfqData = [
    {
      id: 1,
      rfq_no: 'RFQ-001',
      rfq_dt: '2025-01-05',
      opr_num: 'LPR-101',
      lpr_cat: 'Electronics',
      company_name: 'ABC Corporation',
      delivery_term: 'Ex-Works',
      delivery_time: '30 Days',
      quote_receive: '5',
      rfq_status: 'Open',
      created_by: 'John Doe',
      rfq_lead_time: '15 Days',
      response_time: '10',
      lpr_remark: 'Urgent order, expedited delivery preferred.'
    },
    {
      id: 2,
      rfq_no: 'RFQ-002',
      rfq_dt: '2025-01-10',
      opr_num: 'LPR-102',
      lpr_cat: 'Furniture',
      company_name: 'DEF Industries',
      delivery_term: 'FOB',
      delivery_time: '45 Days',
      quote_receive: '8',
      rfq_status: 'Closed',
      created_by: 'Jane Smith',
      rfq_lead_time: '20 Days',
      response_time: '12',
      lpr_remark: 'Standard order, no rush.'
    },
    {
      id: 3,
      rfq_no: 'RFQ-003',
      rfq_dt: '2025-01-12',
      opr_num: 'LPR-103',
      lpr_cat: 'Textiles',
      company_name: 'GHI Textiles',
      delivery_term: 'CIF',
      delivery_time: '60 Days',
      quote_receive: '3',
      rfq_status: 'Pending Approval',
      created_by: 'Emily Davis',
      rfq_lead_time: '18 Days',
      response_time: '15',
      lpr_remark: 'Awaiting additional vendor quotes.'
    },
    {
      id: 4,
      rfq_no: 'RFQ-004',
      rfq_dt: '2025-01-15',
      opr_num: 'LPR-104',
      lpr_cat: 'Automotive',
      company_name: 'JKL Motors',
      delivery_term: 'DDP',
      delivery_time: '25 Days',
      quote_receive: '10',
      rfq_status: 'In Progress',
      created_by: 'Michael Brown',
      rfq_lead_time: '12 Days',
      response_time: '8',
      lpr_remark: 'High priority, ensure timely processing.'
    }
  ];

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{showOprItemList ? 'View RFQ No.' : 'RFQ List'}</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            {showOprItemList && (
              <PlusButton
                label="Back"
                onClick={() => {
                  setShowOprItemList(false);
                  setGenerateRFQ(false);
                }}
              />
            )}
          </div>
        </Box>
      }
    >
      <Box sx={{ width: '100%' }}>
        {showOprItemList ? (
          <ViewGenerateRfqPage showItems={showOprItemList} setShowItems={setShowOprItemList} />
        ) : (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              height: '85vh',
              fontSize: '11px',
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
              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            rows={rfqData}
            columns={rfqColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onCellClick={handleRowClick}
          />
        )}
      </Box>
    </MainCard>
  );
};

export default RfqViewList;
