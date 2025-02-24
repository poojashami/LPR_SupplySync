import { Box } from '@mui/material';
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import PlusButton from 'components/CustomButton';
import MainLPOView from './MainLPOView';
import { useEffect } from 'react';

const MainLPOListTable = ({ mode }) => {
  const [activeView, setActiveView] = useState(null);

  useEffect(() => {
    setActiveView(null);
  }, [mode]);

  const cols = [
    { headerName: 'Sr. No.', field: 'id', width: 60 },
    {
      field: 'opo_num',
      headerName: 'LPO No.',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(mode)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { headerName: 'LPO Dt.', field: 'lpo_date', width: 120 },
    {
      headerName: 'LPO status',
      field: 'lpo_status',
      width: 150,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case 'Send to Vendor':
            color = 'green';
            break;
          case 'Pending Acceptance':
            color = 'orange';
            break;
          case 'Pending Payment':
            color = 'red';
            break;
          default:
            color = 'black';
        }
        return <span style={{ color, fontWeight: 'bold' }}>{params.value}</span>;
      }
    },
    { headerName: 'Quotation No.', field: 'quo_num', width: 120 },
    { headerName: 'LPR No.', field: 'lpr_no', width: 120 },
    { headerName: 'RFQ No.', field: 'rfq_no', width: 120 },
    { headerName: 'RFQ Date.', field: 'rfq_date', width: 120 },
    { headerName: 'Vendor Code', field: 'vendor_code', width: 120 },
    { headerName: 'Vendor Name', field: 'vendor_name', width: 180 },
    { headerName: 'Delivery Type', field: 'delivery_type', width: 100 },
    { headerName: 'Payment Term', field: 'payment_term', width: 250 },
    { headerName: 'RFQ Lead Time', field: 'rfq_lead_time', width: 250 },
    { headerName: 'Vendor Lead time', field: 'vendor_lead_time', width: 150 },
    { headerName: 'Quote Currency.', field: 'quote_currency', width: 150 },
    { headerName: 'Quote Amt.', field: 'quote_amt', width: 150 }
  ];

  const lpoData = [
    {
      id: 1,
      opo_num: 'LPO123',
      lpo_date: '2025-02-19',
      lpo_status: 'Send to Vendor',
      quo_num: 'Q123',
      lpr_no: 'LPR001',
      rfq_no: 'RFQ123',
      rfq_date: '2025-02-10',
      vendor_code: 'V001',
      vendor_name: 'Vendor One',
      delivery_type: 'Air',
      payment_term: 'Net 30',
      rfq_lead_time: '5 days',
      vendor_lead_time: '7 days',
      quote_currency: 'USD',
      quote_amt: '$1,200'
    },
    {
      id: 2,
      opo_num: 'LPO124',
      lpo_date: '2025-02-18',
      lpo_status: 'Pending Acceptance',
      quo_num: 'Q124',
      lpr_no: 'LPR002',
      rfq_no: 'RFQ124',
      rfq_date: '2025-02-09',
      vendor_code: 'V002',
      vendor_name: 'Vendor Two',
      delivery_type: 'Sea',
      payment_term: 'Net 60',
      rfq_lead_time: '10 days',
      vendor_lead_time: '14 days',
      quote_currency: 'EUR',
      quote_amt: '€900'
    },
    {
      id: 3,
      opo_num: 'LPO125',
      lpo_date: '2025-02-17',
      lpo_status: 'Pending Payment',
      quo_num: 'Q125',
      lpr_no: 'LPR003',
      rfq_no: 'RFQ125',
      rfq_date: '2025-02-08',
      vendor_code: 'V003',
      vendor_name: 'Vendor Three',
      delivery_type: 'Road',
      payment_term: 'Net 45',
      rfq_lead_time: '8 days',
      vendor_lead_time: '10 days',
      quote_currency: 'GBP',
      quote_amt: '£700'
    }
  ];

  const handleViewClick = (selectedMode) => {
    setActiveView(selectedMode);
  };

  const handleClose = () => {
    setActiveView(null);
  };

  return (
    <>
      {!activeView && (
        <MainCard
          title={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              {mode === 'draft' ? 'Draft List' : mode === 'approve' ? 'Pending PO Approvals List' : 'Issued PO List'}
            </Box>
          }
        >
          <Box>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                height: '85vh',
                border: '1px solid rgba(224, 224, 224, 1)',
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
                  alignItems: 'center',
                  minHeight: '30px'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={lpoData}
              pageSize={5}
              columns={cols}
              rowsPerPageOptions={[5]}
            />
          </Box>
        </MainCard>
      )}

      {/* Detail View Card */}
      {activeView && (
        <MainCard
          title={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              {activeView === 'draft' ? 'Draft PO' : activeView === 'approve' ? 'Pending PO Approvals' : 'Issued PO'}
              <PlusButton label="Back" onClick={handleClose} />
            </Box>
          }
        >
          <MainLPOView mode={mode} />
        </MainCard>
      )}
    </>
  );
};

export default MainLPOListTable;
