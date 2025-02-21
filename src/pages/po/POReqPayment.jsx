import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Chip } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MainCard from 'components/MainCard';
import PaymentForm from './PaymentForm';
import PlusButton from 'components/CustomButton';
const paymentTreasuryData = [
  {
    id: 1,
    download_doc: 'Document 1',
    status: 3,
    po_num: 'PO-001',
    quo_num: 'OPO-12345',
    vendor_name: 'Vendor A',
    total_cost: 5000,
    created_on: '2024-01-15',
    milestone: 'Milestone 1,Milestone 2,Milestone 3'
  },
  {
    id: 2,
    download_doc: 'Document 2',
    status: 6,
    po_num: 'PO-002',
    quo_num: 'OPO-67890',
    vendor_name: 'Vendor B',
    total_cost: 7500,
    created_on: '2024-02-20',
    milestone: 'Milestone 1,Milestone 2'
  },
  {
    id: 3,
    download_doc: 'Document 3',
    status: 1,
    po_num: 'PO-003',
    quo_num: 'OPO-54321',
    vendor_name: 'Vendor C',
    total_cost: 6200,
    created_on: '2024-03-12',
    milestone: 'Milestone 1'
  },
  {
    id: 4,
    download_doc: 'Document 4',
    status: 10,
    po_num: 'PO-004',
    quo_num: 'OPO-13579',
    vendor_name: 'Vendor D',
    total_cost: 9100,
    created_on: '2024-04-05',
    milestone: 'Milestone 1,Milestone 2,Milestone 3,Milestone 4'
  }
];

const POReqPayment = () => {
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const renderMilestones = (milestones) => {
    return milestones.map((milestone, index) => <Chip key={index} label={milestone.trim()} sx={{ margin: '2px' }} />);
  };

  const handleDocClick = (row) => {
    alert(`Viewing document for ${row.po_num}`);
  };

  const handlePaymentPO = (row) => {
    alert(`Requesting payment for ${row.po_num}`);
  };

  const handleViewClick = (row) => {
    setOpenPaymentForm(true);
  };
  const paymentTreasuryColumns = [
    { field: 'id', headerName: 'Sr No.', width: 40 },
    {
      field: 'download_doc',
      headerName: 'View Doc',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => handleDocClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          <RemoveRedEyeIcon style={{ color: 'grey', backgroundColor: 'transparent' }} />
        </Button>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <div
          style={{
           
           
            cursor: params.value === 3 || params.value === 10 ? 'pointer' : 'default',
            color:
              params.value === 3
                ? '#1976d2' // Info color
                : params.value === 1
                ? '#de5b37'
                : params.value === 6
                ? '#388e3c' // Success color
                : params.value === 10
                ? 'cadetblue'
                : '#e9723e' // Default color for "Ready for dispatch"
          }}
          onClick={
            params.value === 3 ? () => handlePaymentPO(params.row) : undefined
          }
        >
          {params.value === 3
            ? 'Request For Payment'
            : params.value === 1
            ? 'Send to Vendor'
            : params.value === 6
            ? 'Payment Done'
            : params.value === 10
            ? 'Final Payment'
            : 'Ready for dispatch'}
        </div>
      )
    },    
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: '#4680FF' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'quo_num', headerName: 'OPO Number', width: 200 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 150 },
    { field: 'total_cost', headerName: 'Total Amount', width: 150 },
    { field: 'created_on', headerName: 'PO Date', width: 120 },
    {
      field: 'milestone',
      headerName: 'Payment Status',
      width: 500,
      renderCell: (params) => {
        const milestones = params.value.split(',');
        return <div>{renderMilestones(milestones)}</div>;
      }
    }
  ];
  return (
    <MainCard
      title={
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} fontWeight={600} fontSize={'16px'}>
          <span>{openPaymentForm ? 'Payment Form' : 'Treasury List'}</span>

          {openPaymentForm && (
            <span>
              <PlusButton
                label="Back"
                onClick={() => {
                  setOpenPaymentForm(false);
                }}
              />
            </span>
          )}
        </Box>
      }
    >
      {openPaymentForm ? (
        <PaymentForm />
      ) : (
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            height:'85vh',
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
            }
          }}
          rows={paymentTreasuryData}
          columns={paymentTreasuryColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      )}
    </MainCard>
  );
};

export default POReqPayment;
