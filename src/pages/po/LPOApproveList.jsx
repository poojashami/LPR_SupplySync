import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import PlusButton from 'components/CustomButton';
import LPOView from './LPOView';
import LPOApprove from './LPOApprove';

const LPOApproveList = () => {
  const [viewLPO, setViewLPO] = useState(false);

  const cols = [
    {
      field: 'opo_num',
      headerName: 'LPO No.',
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
  const lpoData = [
    {
      id: 1,
      opo_num: 'LPO001',
      quo_num: 'QUO123',
      vendor_num: 'V001',
      vendor_name: 'Vendor A',
      delivery_term: 'FOB',
      payment_term: 'Net 30 Days',
      lead_time: '2 Weeks',
      total_cost: '5000 USD'
    },
    {
      id: 2,
      opo_num: 'LPO002',
      quo_num: 'QUO124',
      vendor_num: 'V002',
      vendor_name: 'Vendor B',
      delivery_term: 'CIF',
      payment_term: 'Net 15 Days',
      lead_time: '1 Month',
      total_cost: '7500 USD'
    },
    {
      id: 3,
      opo_num: 'LPO003',
      quo_num: 'QUO125',
      vendor_num: 'V003',
      vendor_name: 'Vendor C',
      delivery_term: 'EXW',
      payment_term: 'Net 45 Days',
      lead_time: '3 Weeks',
      total_cost: '3000 USD'
    },
    {
      id: 4,
      opo_num: 'LPO004',
      quo_num: 'QUO126',
      vendor_num: 'V004',
      vendor_name: 'Vendor D',
      delivery_term: 'FOB',
      payment_term: 'Net 30 Days',
      lead_time: '1 Week',
      total_cost: '4200 USD'
    },
    {
      id: 5,
      opo_num: 'LPO005',
      quo_num: 'QUO127',
      vendor_num: 'V005',
      vendor_name: 'Vendor E',
      delivery_term: 'CIF',
      payment_term: 'Advance Payment',
      lead_time: '1 Month',
      total_cost: '8900 USD'
    }
  ];

  const handleViewClick = async (data) => {
    setViewLPO(true);
  };
  const handleClose = async () => {
    setViewLPO(false);
  };

  return (
    <MainCard
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {viewLPO ? <span>Pending LPO Approvals </span> : viewLPO ? <span>LPO View </span> : <span>LPO List</span>}
          {viewLPO ? (
            <span>
              <PlusButton label="Back" onClick={handleClose} />
            </span>
          ) : (
            ''
          )}
        </Box>
      }
    >
      <div>
        {viewLPO ? (
          <LPOApprove />
        ) : (
          <Box sx={{ height: '50vh', width: '100%', marginBottom: '50px' }}>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                marginBottom: '20px',
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
                  alignItems: 'center',
                  minHeight: '30px'
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
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={lpoData}
              pageSize={5}
              columns={cols}
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          </Box>
        )}
      </div>
    </MainCard>
  );
};

export default LPOApproveList;
