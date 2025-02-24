import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
const LPRDetail = () => {
  const ApprovalHeader = [
    { field: 'id', headerName: 'Sr. No.', width: 60 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'ship_mode', headerName: 'Ship Mode', width: 100 },
    { field: 'buying_house', headerName: 'Buying House', width: 100 },
    { field: 'unit_justi', headerName: 'Unit Justification', width: 150 },
    { field: 'procure_justi', headerName: 'Procurement Justification', width: 150, flex: 1 },
    { field: 'total_cost', headerName: 'Total Cost', width: 100 }
  ];
  const approvalData = [
    {
      id: 1,
      vendor: 'ABC Suppliers',
      company: 'Tech Corp',
      department: 'IT',
      ship_mode: 'Air',
      buying_house: 'XYZ Trading',
      unit_justi: 'Essential Upgrade',
      procure_justi: 'Urgent Requirement',
      total_cost: '$5000'
    },
    {
      id: 2,
      vendor: 'Global Exports',
      company: 'Innovate Ltd',
      department: 'Procurement',
      ship_mode: 'Sea',
      buying_house: 'ABC Traders',
      unit_justi: 'Bulk Purchase',
      procure_justi: 'Cost Efficiency',
      total_cost: '$12000'
    },
    {
      id: 3,
      vendor: 'Best Supplies',
      company: 'NextGen Inc',
      department: 'Logistics',
      ship_mode: 'Road',
      buying_house: 'XYZ Trading',
      unit_justi: 'Warehouse Stock',
      procure_justi: 'Regular Demand',
      total_cost: '$8000'
    },
    {
      id: 4,
      vendor: 'Metro Traders',
      company: 'Smart Solutions',
      department: 'Finance',
      ship_mode: 'Rail',
      buying_house: 'DEF Imports',
      unit_justi: 'Operational Needs',
      procure_justi: 'Budget Approved',
      total_cost: '$6000'
    },
    {
      id: 5,
      vendor: 'Rapid Goods',
      company: 'Future Enterprises',
      department: 'Manufacturing',
      ship_mode: 'Air',
      buying_house: 'GHI Exports',
      unit_justi: 'Production Line',
      procure_justi: 'Quality Assurance',
      total_cost: '$15000'
    }
  ];

  return (
    <div>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
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

            alignItems: 'center'
          },
          '& .MuiDataGrid-scrollbar': {
            height: '8px'
          }
        }}
        columns={ApprovalHeader}
        rows={approvalData}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </div>
  );
};

export default LPRDetail;
