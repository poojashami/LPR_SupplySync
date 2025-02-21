import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import CreateIcon from '@mui/icons-material/Create';
import LPOCompare from './LPOCompare';
import PlusButton from 'components/CustomButton';
import { color } from 'framer-motion';

const POList = () => {
  const [showLPOCompare, setShowLPOCompare] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // To store the selected row data

  const handleCreateClick = (row) => {
    setSelectedRow(row); // Set the selected row data
    setShowLPOCompare(true); // Show the LPOCompare component
  };

  const columnDefs = [
    {
      field: 'action',
      headerName: 'Create',
      width: 60,
      renderCell: (params) => (
        <CreateIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleCreateClick(params.row)} // Pass the row data
        />
      )
    },
    {
      field: 'rfq_no',
      headerName: 'RFQ No.',
      renderCell: (params) => (
        <div
          style={{
            color: params?.row?.status === '2' ? 'navy' : 'red'
          }}
        >
          {params.value}
        </div>
      ),
      width: 150
    },
    {
      field: 'rfq_dt',
      headerName: 'RFQ Dt.',

      width: 150
    },
    {
      field: 'opr_num',
      headerName: 'LPR No.',

      width: 150
    },
    { headerName: 'LPR Category', field: 'opr_description', width: 150 },

   
    { headerName: 'Quote Status', field: 'quote_status', width: 120 },
    { headerName: 'Quote Received', field: 'quote_rev', width: 120 },
    { headerName: 'Vertical', field: 'vertical_name', width: 120 },
    { headerName: 'Company', field: 'company_name', width: 120 },
    { headerName: 'Division', field: 'division_name', width: 120 },
       { headerName: 'RFQ Lead Time', field: 'd_timeline_name', width: 120 },
    { headerName: 'RFQ Remark', field: 'remarks', width: 150 },
  ];

  const oprData = [
    {
      id: 1,
      opr_num: 'OPR001',
      status: '2',
      status_procurement: '10',
      quote_status: 'Received',
      vertical_name: 'Retail',
      company_name: 'ABC Corp',
      division_name: 'North Division',
      buy_from: 'Supplier A',
      buying_house_name: 'House X',
      shipment_mode_name: 'Air',
      d_timeline_name: '2 Weeks',
      dept_name: 'Logistics',
      requested_by: 'John Doe',
      opr_date: '2025-01-01',
      remarks: 'Urgent order',
      opr_description: 'Electronics'
    },
    {
      id: 2,
      opr_num: 'OPR002',
      status: '11',
      status_procurement: '11',
      quote_status: 'Pending',
      vertical_name: 'Manufacturing',
      company_name: 'XYZ Ltd',
      division_name: 'South Division',
      buy_from: 'Supplier B',
      buying_house_name: 'House Y',
      shipment_mode_name: 'Sea',
      d_timeline_name: '1 Month',
      dept_name: 'Procurement',
      requested_by: 'Jane Smith',
      opr_date: '2025-01-05',
      remarks: 'Regular order',
      opr_description: 'Machinery'
    }
  ];

  // Render LPOCompare if showLPOCompare is true, else render DataGrid
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', fontWeight: 600 }}>
          <span>{!showLPOCompare ? 'Create LPO - List of OPR with Quotes' : 'Quotes For Company: & OPR ID:OPR-324-OPR'}</span>
          {showLPOCompare && (
            <PlusButton
              label="Back"
              onClick={() => {
                setShowLPOCompare(false);
              }}
            />
          )}
        </Box>
      }
    >
      <Box sx={{ minHeight: 400, width: '100%' }}>
        {showLPOCompare ? (
          <LPOCompare rowData={selectedRow} onBack={() => setShowLPOCompare(false)} />
        ) : (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              minHeight: '85vh',
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
            rows={oprData}
            columns={columnDefs}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </Box>
    </MainCard>
  );
};

export default POList;
