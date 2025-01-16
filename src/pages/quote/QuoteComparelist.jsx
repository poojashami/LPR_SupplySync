import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, Chip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import QuoteCompare from './QuoteCompare';
import PlusButton from 'components/CustomButton';
import MainCard from 'components/MainCard';

const QuoteComparelist = () => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const quotecomListColumn = [
    {
      field: 'action',
      headerName: 'Create',
      width: 60,
      renderCell: (params) => (
        <CreateIcon
          onClick={() => {
            setSelectedQuote({
              company_id: params.row.company_id,
              opr_id: params.row.opr_id,
              opr_num: params.row.opr_num,
              status: params.row.status
            });
          }}
          style={{ cursor: 'pointer' }}
        />
      )
    },
    { headerName: 'OPR No.', field: 'opr_num', width: 120 },
    {
      headerName: 'Procurement Status',
      field: 'status_procurement',
      width: 150,
      renderCell: (params) =>
        params?.row?.status === '10' ? <span>Recommended By BH</span> : params?.row?.status === '11' && <span>OPO Created</span>
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

  const quoteComData = [
    {
      id: 1,
      action: '',
      opr_num: 'OPR001',
      status_procurement: '10',
      quote_status: 'Approved',
      vertical_name: 'Textiles',
      company_name: 'ABC Ltd.',
      division_name: 'North Division',
      buy_from: 'Local Supplier',
      buying_house_name: 'House A',
      shipment_mode_name: 'Air',
      d_timeline_name: '30 Days',
      dept_name: 'Procurement',
      requested_by: 'John Doe',
      opr_date: '2024-01-10',
      remarks: 'Urgent Order',
      opr_description: 'Category A'
    },
    {
      id: 2,
      action: '',
      opr_num: 'OPR002',
      status_procurement: '11',
      quote_status: 'Pending',
      vertical_name: 'Electronics',
      company_name: 'XYZ Corp.',
      division_name: 'West Division',
      buy_from: 'International Vendor',
      buying_house_name: 'House B',
      shipment_mode_name: 'Sea',
      d_timeline_name: '60 Days',
      dept_name: 'Operations',
      requested_by: 'Jane Smith',
      opr_date: '2024-01-12',
      remarks: 'Needs Verification',
      opr_description: 'Category B'
    },
    {
      id: 3,
      action: '',
      opr_num: 'OPR003',
      status_procurement: '2',
      quote_status: 'Rejected',
      vertical_name: 'Metals',
      company_name: 'LMN Pvt. Ltd.',
      division_name: 'South Division',
      buy_from: 'Distributor',
      buying_house_name: 'House C',
      shipment_mode_name: 'Truck',
      d_timeline_name: '15 Days',
      dept_name: 'Logistics',
      requested_by: 'Mark Lee',
      opr_date: '2024-01-15',
      remarks: 'Follow up required',
      opr_description: 'Category C'
    }
  ];

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {selectedQuote
              ? `Quotes For Company: ${selectedQuote.company_name} & OPR ID: ${selectedQuote.opr_num}`
              : 'Create OPO - List of OPR with Quotes'}
          </span>
          {selectedQuote && <PlusButton label="Back" onClick={() => setSelectedQuote(null)} />}
        </Box>
      }
    >
      {selectedQuote ? (
        // Render QuoteCompare when a quote is selected
        <QuoteCompare quoteData={selectedQuote} />
      ) : (
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
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
              alignItems: 'center'
            },
            '& .MuiCheckbox-root': {
              padding: 0,
              margin: '0 auto', // Center align the checkbox
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
          rows={quoteComData}
          columns={quotecomListColumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      )}
    </MainCard>
  );
};

export default QuoteComparelist;
