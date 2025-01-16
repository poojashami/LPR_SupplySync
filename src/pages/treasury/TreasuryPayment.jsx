import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import TreasuryApprove from './TreasuryApprove';
import { Box, Button } from '@mui/material';
import PlusButton from 'components/CustomButton';

const TreasuryPayment = () => {
  const [showApprove, setShowApprove] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

  const TableHeader = [
    { field: 'index', headerName: 'S.No.', width: 80 },
    { field: 'payment_request_id', headerName: 'Req.No.', width: 80 },
    { headerName: 'PO.ID.', field: 'po_id', width: 80 },
    {
      field: 'po_number',
      headerName: 'Purchase Order',
      width: 100,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'po_amount', headerName: 'PO Amount', width: 100 },
    { field: 'advice_date', headerName: 'Advise date', width: 100 },
    { field: 'advice_amount', headerName: 'Advise Amount', width: 120 },
    { field: 'advice_remarks', headerName: 'Advise Remark', width: 200 },
    {
      field: 'status',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => {
        const { status } = params.row;

        const renderProceedButton = () => (
          <Button
            variant="outlined"
            style={{
              color: status === 4 ? 'gray' : 'blue',
              borderColor: status === 4 ? 'gray' : 'blue',
              fontSize: '11px',
              padding: '5px',
              pointerEvents: status === 4 ? 'none' : 'auto'
            }}
            onClick={() => status !== 4 && handleAcceptPO(params.row)}
          >
            {status === 4 ? 'Proceed to pay' : 'Proceed to pay'}
          </Button>
        );

        const renderRejectButton = () => {
          if (status === 1 || status === 2) {
            return (
              <Button
                variant="outlined"
                color="error"
                style={{ marginLeft: '10px', fontSize: '11px', padding: '5px' }}
                onClick={() => handleReject(params.row)}
              >
                Reject
              </Button>
            );
          } else if (status === 4) {
            return (
              <Button variant="outlined" color="error" style={{ marginLeft: '10px', fontSize: '11px', padding: '5px' }}>
                Rejected
              </Button>
            );
          }
          return null;
        };

        return (
          <>
            {params.row.status === 3 || params.row.status === 5 ? (
              <Button
                variant="outlined"
                style={{
                  color: 'green',
                  borderColor: 'green',
                  fontSize: '11px',
                  padding: '5px'
                }}
                onClick={() => status !== 4 && handleAcceptPO(params.row)}
              >
                Payment Done
              </Button>
            ) : (
              <>
                {renderProceedButton()}
                {renderRejectButton()}
              </>
            )}
          </>
        );
      }
    }
  ];

  const tableData = [
    {
      id: 1,
      index: 1,
      payment_request_id: 'REQ001',
      po_id: 'PO001',
      po_number: 'PO-12345',
      po_amount: 5000,
      advice_date: '2025-01-10',
      advice_amount: 4500,
      advice_remarks: 'Partial payment advised',
      status: 1
    },
    {
      id: 2,
      index: 2,
      payment_request_id: 'REQ002',
      po_id: 'PO002',
      po_number: 'PO-67890',
      po_amount: 10000,
      advice_date: '2025-01-11',
      advice_amount: 10000,
      advice_remarks: 'Full payment advised',
      status: 3
    },
    {
      id: 3,
      index: 3,
      payment_request_id: 'REQ003',
      po_id: 'PO003',
      po_number: 'PO-54321',
      po_amount: 7000,
      advice_date: '2025-01-12',
      advice_amount: 7000,
      advice_remarks: 'Payment pending',
      status: 4
    },
    {
      id: 4,
      index: 4,
      payment_request_id: 'REQ004',
      po_id: 'PO004',
      po_number: 'PO-09876',
      po_amount: 6000,
      advice_date: '2025-01-13',
      advice_amount: 3000,
      advice_remarks: 'Partial payment received',
      status: 2
    },
    {
      id: 5,
      index: 5,
      payment_request_id: 'REQ005',
      po_id: 'PO005',
      po_number: 'PO-11223',
      po_amount: 8000,
      advice_date: '2025-01-14',
      advice_amount: 0,
      advice_remarks: 'No payment advised',
      status: 5
    }
  ];

  const handleViewClick = (purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder); // Save selected PO data
    setShowApprove(true); // Show TreasuryPayment component
  };

  return (
    <MainCard
      title={
        <Box>
          <span>{showApprove ? 'Approve Payment' : 'Treasury Payment'}</span>
          {showApprove && <PlusButton onClick={setShowApprove(false)}>Back</PlusButton>}
        </Box>
      }
    >
      {showApprove ? (
        <TreasuryApprove purchaseOrder={selectedPurchaseOrder} />
      ) : (
        <>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(224, 224, 224, 1)',
                height: '25px !important',
                display: 'flex'
              },
              '& .MuiDataGrid-checkboxInput': {
                padding: '0px'
              },
              '& .MuiCheckbox-root': {
                width: '18px',
                height: '18px'
              },
              '& .MuiSvgIcon-root': {
                fontSize: '20px'
              }
            }}
            rows={tableData}
            columns={TableHeader}
            pageSize={5}
            rowsPerPageOptions={[5]}
            hideFooter
            // checkboxSelection
          />
        </>
      )}
    </MainCard>
  );
};

export default TreasuryPayment;
