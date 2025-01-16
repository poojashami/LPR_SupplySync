import React, { useState } from 'react';
import RFQView from './RFQView';
import { Box } from 'iconsax-react';
import MainCard from 'components/MainCard';
import { Button, Grid, IconButton, Paper, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import VendorList from './VendorList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
const GenerateRFQ = () => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedDocids, setSelectedDocids] = useState();
  const [doc_name, setDoc_name] = useState('');

  const calcNet = (val1, val2) => {
    return val1 + val2;
  };
  const rfqItemcolumns = [
    { field: 'item_code', headerName: 'Item Code', width: 100, flex: 1 },
    { field: 'item_name', headerName: 'Item Name', width: 250, flex: 1 },
    { field: 'item_description', headerName: 'Remarks', width: 250, flex: 1 },
    { field: 'company_name', headerName: 'Company', width: 200, flex: 1 },
    { field: 'uom_name', headerName: 'UOM', width: 100, flex: 1 },
    { field: 'qty', headerName: 'Req Qty', width: 100, flex: 1, renderCell: (params) => formatNumber(params.value) },

    {
      field: 'tolerance',
      headerName: 'Tolerance %',
      width: 150,
      editable: true,
      flex: 1,
      renderCell: (params) => formatNumber(params.value || '')
    },
    {
      field: 'net_qty',
      headerName: 'Net Qty',
      width: 100,
      renderCell: (params) => calcNet(Number(params?.row?.quantity), Number(params?.row?.qty)),
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <IconButton aria-label="delete" color="error" size="small" onClick={() => removeItem(params.id)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];
  const rfqItemData = [
    {
      id: 1,
      item_code: 'ITM001',
      item_name: 'Laptop',
      item_description: 'Dell Latitude 5420',
      company_name: 'ABC Corp',
      uom_name: 'Piece',
      qty: 10,
      tolerance: 5,
      net_qty: 10 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 2,
      item_code: 'ITM002',
      item_name: 'Monitor',
      item_description: 'Dell 24-inch UltraSharp',
      company_name: 'XYZ Pvt Ltd',
      uom_name: 'Piece',
      qty: 20,
      tolerance: 2,
      net_qty: 20 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 3,
      item_code: 'ITM003',
      item_name: 'Keyboard',
      item_description: 'Logitech Wireless Keyboard K780',
      company_name: 'DEF Enterprises',
      uom_name: 'Piece',
      qty: 50,
      tolerance: 10,
      net_qty: 50 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 4,
      item_code: 'ITM004',
      item_name: 'Mouse',
      item_description: 'Logitech MX Master 3',
      company_name: 'ABC Corp',
      uom_name: 'Piece',
      qty: 30,
      tolerance: 3,
      net_qty: 30 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 5,
      item_code: 'ITM005',
      item_name: 'Printer',
      item_description: 'HP LaserJet Pro M404dn',
      company_name: 'XYZ Pvt Ltd',
      uom_name: 'Piece',
      qty: 5,
      tolerance: 1,
      net_qty: 5 // This can be calculated dynamically using `calcNet`
    }
  ];
  const doc_table_column = [{ field: 'req_doc_name', headerName: 'Document Name', flex: 1 }];

  const doc_table_data = [
    { id: 1, req_doc_name: 'Commercial Invoice' },
    { id: 2, req_doc_name: 'Packing List' },
    { id: 3, req_doc_name: 'Certificate Of Analysis' }
  ];
  return (
    <>
      <RFQView />
      <MainCard title="Item List to Create RFQ">
        <div className="ag-theme-alpine" style={{ height: 'auto', width: '100%' }}>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
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
              pageSize={5}
              columns={rfqItemcolumns}
              rows={rfqItemData}
              hideFooterPagination
              rowsPerPageOptions={[5, 10, 20]}
              // rowModesModel={rowModesModel}
              // onRowModesModelChange={handleRowModesModelChange}
              // processRowUpdate={processRowUpdater}
            />
          </div>
        </div>
      </MainCard>
      <MainCard title="Select Vendor">
        <VendorList />
      </MainCard>
      <MainCard title="Required Documents at the time of Shipping">
        <Grid fullWidth container sx={{ width: '100%' }}>
          <Grid fullWidth item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <Paper sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid rgba(224, 224, 224, 1)',
                    height: '25px !important',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  }
                }}
                rows={doc_table_data}
                columns={doc_table_column}
                // onRowSelectionModelChange={(val) => {
                //   return setSelectedDocids(
                //     rfqReqDoclist?.filter((item) => {
                //       return val.includes(item.id);
                //     })
                //   );
                // }}
                checkboxSelection
                hideFooter
                hideFooterPagination
                // hideFooterSelectedRowCount
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ height: '50px', width: '50px' }} />
                  <TextField
                    id="doc_name"
                    label="Document Name"
                    sx={{
                      '& .MuiInputBase-input': {
                        // padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                    value={doc_name}
                    onChange={(e) => setDoc_name(e.target.value)}
                  />
                  <IconButton aria-label="add" size="small" sx={{ height: '50px', width: '50px' }}>
                    <AddCircleOutlineIcon sx={{ fontSize: '50px' }} color="success" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </MainCard>
      <Box display="flex" justifyContent="flex-end" mx={'20px'}>
        <Button variant="outlined" size="small" color="error">
          Cancel
        </Button>
        <Button variant="contained" size="small" color="primary">
          Issue RFQ
        </Button>
        {/* <ConfirmForm isOpen={isDialogOpen} onClose={handleCloseDialog} onConfirm={() => handleSubmit()} type={'RFQ'} /> */}
      </Box>
    </>
  );
};

export default GenerateRFQ;
