import React from 'react';
import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomHeading from 'components/CustomHeading';
const RequireDocuments = () => {
  const additionalChargesBuyer = [
    {
      id: 1,
      charge_name: 'handling_fee',
      charges_by: 'supplier',
      charge_amount: 100.0
    },
    {
      id: 2,
      charge_name: 'shipping_cost',
      charges_by: 'logistics',
      charge_amount: 250.0
    },
    {
      id: 3,
      charge_name: 'custom_duty',
      charges_by: 'government',
      charge_amount: 500.0
    },
    {
      id: 4,
      charge_name: 'insurance_fee',
      charges_by: 'insurer',
      charge_amount: 150.0
    },
    {
      id: 5,
      charge_name: 'warehouse_storage',
      charges_by: 'warehouse',
      charge_amount: 300.0
    }
  ];
  const req_docs = [
    { id: 1, doc_name: 'Purchase Order', remarks: 'Approved by manager', is_available: 'Yes' },
    { id: 2, doc_name: 'Invoice', remarks: 'Pending review', is_available: 'No' },
    { id: 3, doc_name: 'Delivery Note', remarks: 'Delivered on time', is_available: 'Yes' },
    { id: 4, doc_name: 'Packing List', remarks: 'Checked and verified', is_available: 'Yes' },
    { id: 5, doc_name: 'Bill of Lading', remarks: 'Requires additional signature', is_available: 'No' }
  ];
  return (
    <Box padding={1}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <CustomHeading>Require Document</CustomHeading>
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

                alignItems: 'center',
                minHeight: '30px'
              },

              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            columns={[
              { headerName: 'Sr. No.', field: 'id', width: 60 },
              {
                headerName: 'Charge name',
                field: 'charge_name',
                width: 180,
                renderCell: (params) => {
                  return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                }
              },
              {
                headerName: 'Charges By',
                field: 'charges_by',
                width: 80,

                renderCell: (params) => {
                  return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                }
              },
              {
                headerName: 'Charges Amount',
                field: 'charge_amount',
                width: 120
              }
            ]}
            rows={additionalChargesBuyer}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomHeading>Additional Charges</CustomHeading>
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

                alignItems: 'center',
                minHeight: '30px'
              },

              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            columns={[
              { headerName: 'Sr. No.', field: 'id', width: 60 },
              {
                headerName: 'Charge name',
                field: 'charge_name',
                width: 180,
                renderCell: (params) => {
                  return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                }
              },
              {
                headerName: 'Charges By',
                field: 'charges_by',
                width: 80,

                renderCell: (params) => {
                  return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                }
              },
              {
                headerName: 'Charges Amount',
                field: 'charge_amount',
                width: 120
              }
            ]}
            rows={additionalChargesBuyer}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomHeading>Quotation Remark</CustomHeading>

          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              border: '1px solid rgba(224, 224, 224, 1)',
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(224, 224, 224, 1)',
                height: '25px !important',

                minHeight: '30px'
              },

              '& .MuiDataGrid-scrollbar': {
                height: '8px'
              }
            }}
            columns={[
              { headerName: 'Sr. No.', field: 'id', width: 60 },
              {
                headerName: 'Doc name',
                field: 'doc_name',
                width: 150
              },
              {
                headerName: 'Remarks',
                field: 'remarks',
                width: 200
              },
              {
                headerName: 'Is Available',
                field: 'is_available',
                width: 100
              }
            ]}
            rows={req_docs}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequireDocuments;
