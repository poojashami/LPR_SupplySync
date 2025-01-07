import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';

const RFQTable = () => {
  const rfqData = [
    {
      rfq_id: 14,
      rfq_num: 'RFQ-154-RFQ',
      remarks: null,
      created_on: '2024-06-28T17:27:53.660Z',
      created_by: null,
      updated_on: null,
      updated_by: null,
      status: null,
      vendor_list: '1,2,4,5'
    }
  ];

  const rfqColumn = [
    {
      field: 'rfq_id',
      headerName: 'RFQ ID',
      width: 150,
      renderCell: (params) => (
        <Link component="button" onClick={() => handleRfqIdClick(params.value)}>
          {params.value}
        </Link>
      )
    },
    { headerName: 'RFQ Number', field: 'rfq_num' },
    { headerName: 'Remarks', field: 'remarks' },
    { headerName: 'Created On', field: 'created_on' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Vendor List', field: 'vendor_list' }
  ];

  const handleRfqIdClick = (rfqId) => {
    console.log('RFQ ID clicked:', rfqId);
  };

  return (
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
          borderBottom: '2px solid rgba(224, 224, 224, 1)'
        }
      }}
      rows={rfqData}
      columns={rfqColumn}
      pageSize={5}
      rowsPerPageOptions={[5]}
      getRowId={(row) => row.rfq_id}
    />
  );
};

export default RFQTable;
