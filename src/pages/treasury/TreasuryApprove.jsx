import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { Box, Button } from '@mui/material';
import PlusButton from 'components/CustomButton';
import TreasuryView from './TreasuryView';

const TreasuryApprove = () => {
  const [showApprove, setShowApprove] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

  const TableHeader = [
    {
      field: 'opo_num',
      headerName: 'OPO No.',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { headerName: 'Quotation No.', field: 'quo_num', width: 120 },
    { headerName: 'Vendor No.', field: 'vendor_num', width: 120 },
    { headerName: 'Vendor Name', field: 'vendor_name', width: 180 },
    { headerName: 'Delivery Term', field: 'delivery_term', width: 100 },
    { headerName: 'Payment Term', field: 'payment_term', width: 250 },
    { headerName: 'Lead time', field: 'lead_time', width: 100 },
    { headerName: 'Quote Cost', field: 'total_cost', width: 150 }
  ];

  const tableData = [
    {
      id: 1,
      opo_num: 'OPO001',
      quo_num: 'QUO001',
      vendor_num: 'VND001',
      vendor_name: 'Vendor A',
      delivery_term: 'FOB',
      payment_term: 'Net 30',
      lead_time: '14 days',
      total_cost: 15000
    },
    {
      id: 2,
      opo_num: 'OPO002',
      quo_num: 'QUO002',
      vendor_num: 'VND002',
      vendor_name: 'Vendor B',
      delivery_term: 'CIF',
      payment_term: 'Net 45',
      lead_time: '21 days',
      total_cost: 20000
    },
    {
      id: 3,
      opo_num: 'OPO003',
      quo_num: 'QUO003',
      vendor_num: 'VND003',
      vendor_name: 'Vendor C',
      delivery_term: 'EXW',
      payment_term: 'Net 15',
      lead_time: '10 days',
      total_cost: 18000
    },
    {
      id: 4,
      opo_num: 'OPO004',
      quo_num: 'QUO004',
      vendor_num: 'VND004',
      vendor_name: 'Vendor D',
      delivery_term: 'DAP',
      payment_term: 'Net 60',
      lead_time: '30 days',
      total_cost: 25000
    },
    {
      id: 5,
      opo_num: 'OPO005',
      quo_num: 'QUO005',
      vendor_num: 'VND005',
      vendor_name: 'Vendor E',
      delivery_term: 'CPT',
      payment_term: 'Net 20',
      lead_time: '7 days',
      total_cost: 12000
    }
  ];

  const handleViewClick = (row) => {
    setSelectedPurchaseOrder(row);
    setShowApprove(true);
  };

  const handleBackClick = () => {
    setSelectedPurchaseOrder(null);
    setShowApprove(false);
  };
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{showApprove ? 'Approve Payment' : 'Treasury Payment'}</span>
          {showApprove && <PlusButton label={'Back'} onClick={handleBackClick} />}
        </Box>
      }
    >
      {showApprove ? (
        <TreasuryView purchaseOrder={selectedPurchaseOrder} />
      ) : (
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
        />
      )}
    </MainCard>
  );
};

export default TreasuryApprove;
