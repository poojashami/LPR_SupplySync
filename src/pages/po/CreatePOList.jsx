import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import CreateIcon from '@mui/icons-material/Create';
import LPOCompare from './LPOCompare';
import PlusButton from 'components/CustomButton';
import { color } from 'framer-motion';

const CreatePOList = () => {
  const [showLPOCompare, setShowLPOCompare] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleCreateClick = (row) => {
    setSelectedRow(row);
    setShowLPOCompare(true);
  };

  const columnDefs = [
    { field: 'id', headerName: 'Sr. No', width: 60 },
    {
      field: 'rfq_no',
      headerName: 'RFQ No.',
      renderCell: (params) => (
        <div
          style={{
            color: 'navy',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
          onClick={() => handleCreateClick(params.row)}
        >
          {params.value}
        </div>
      ),
      width: 150
    },
    { field: 'rfq_dt', headerName: 'RFQ Dt.', width: 150 },
    { field: 'opr_num', headerName: 'LPR No.', width: 150 },
    { field: 'opr_description', headerName: 'LPR Category', width: 150 },
    { field: 'quote_status', headerName: 'Quote Status', width: 120 },
    { field: 'quote_rev', headerName: 'Quote Received', width: 120 },
    { field: 'vertical_name', headerName: 'Vertical', width: 120 },
    { field: 'company_name', headerName: 'Company', width: 120 },
    { field: 'division_name', headerName: 'Division', width: 120 },
    { field: 'd_timeline_name', headerName: 'RFQ Lead Time', width: 120 },
    { field: 'remarks', headerName: 'RFQ Remark', width: 150 }
  ];

  const oprData = [
    {
      id: 1,
      rfq_no: 'RFQ-1001',
      rfq_dt: '2024-02-20',
      opr_num: 'LPR-5001',
      opr_description: 'Electrical',
      quote_status: 'Pending',
      quote_rev: 3,
      vertical_name: 'Construction',
      company_name: 'XYZ Ltd.',
      division_name: 'Infra',
      d_timeline_name: '7 Days',
      remarks: 'Urgent',
      status: '2'
    },
    {
      id: 2,
      rfq_no: 'RFQ-1002',
      rfq_dt: '2024-02-21',
      opr_num: 'LPR-5002',
      opr_description: 'Mechanical',
      quote_status: 'Approved',
      quote_rev: 2,
      vertical_name: 'Automobile',
      company_name: 'ABC Corp.',
      division_name: 'Manufacturing',
      d_timeline_name: '5 Days',
      remarks: 'High Priority',
      status: '1'
    }
  ];

  // Render LPOCompare if showLPOCompare is true, else render DataGrid
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', fontWeight: 600 }}>
          <span>{!showLPOCompare ? 'Create LPO - List of OPR with Quotes' : 'Compare Quote'}</span>
          {showLPOCompare && <PlusButton label="Back" onClick={() => setShowLPOCompare(false)} />}
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

export default CreatePOList;
