import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import CreateIcon from '@mui/icons-material/Create';
import PlusButton from 'components/CustomButton';
import LPOView from './LPOView';

const LPOViewList = () => {
  const [showLPOView, setShowLPOView] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleCreateClick = (row) => {
    setSelectedRow(row);
    setShowLPOView(true);
  };

  const columnDefs = [
    {
      field: 'action',
      headerName: 'Create',
      width: 60,
      renderCell: (params) => <CreateIcon style={{ cursor: 'pointer' }} onClick={() => handleCreateClick(params.row)} />
    },
    {
      field: 'opr_num',
      headerName: 'OPR No.',
      renderCell: (params) =>
        params?.row?.status === '2' ? (
          <Box
            sx={{
            
              color: 'navy', // Text color
              fontWeight: 'bold', // Bold text
              
            }}
          >
            {params.value}
          </Box>
        ) : (
          <Box
            sx={{
           
              color: 'navy', // Default text color
              fontWeight: 'bold', // Bold text
             
            }}
          >
            {params.value}
          </Box>
        ),
      width: 150 // Ensure this is a number
    },
    
    {
      headerName: 'Procurement Status',
      field: 'status_procurement',
      width: 150,
      renderCell: (params) =>
        params?.row?.status === '10' ? <span>Recommended By BH</span> : params?.row?.status === '11' && <span>LPO Created</span>
    },
    { headerName: 'Quote Status', field: 'quote_status', width: 120 },
    { headerName: 'Vertical', field: 'vertical_name', width: 120 },
    { headerName: 'Company', field: 'company_name', width: 120 },
    { headerName: 'Division', field: 'division_name', width: 120 },
    { headerName: 'Buying From', field: 'buy_from', width: 120 },
    { headerName: 'Buying House', field: 'buying_house_name', width: 120 },
    { headerName: 'Shipment Mode', field: 'shipment_mode_name', width: 120 },
    { headerName: 'Delivery Time', field: 'd_timeline_name', width: 120 },
    { headerName: 'Requested By Department', field: 'dept_name', width: 180 },
    { headerName: 'Requested By', field: 'requested_by', width: 120 },
    { headerName: 'Date', field: 'opr_date', width: 120 },
    { headerName: 'Additional Remarks', field: 'remarks', width: 150 },
    { headerName: 'OPR Category', field: 'opr_description', width: 150 }
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

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight:600, fontSize:"16px" }}>
          <span>{!showLPOView ? 'Create LPO - List of OPR with Quotes' : 'Quotes For Company: & OPR ID:OPR-324-OPR'}</span>
          {showLPOView && (
            <PlusButton
              label="Back"
              onClick={() => {
                setShowLPOView(false);
              }}
            />
          )}
        </Box>
      }
    >
      <Box sx={{ minHeight: 400, width: '100%' }}>
        {showLPOView ? (
          <LPOView rowData={selectedRow} onBack={() => setShowLPOView(false)} />
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

export default LPOViewList;
