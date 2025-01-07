import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, Button } from '@mui/material';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { GetCIList } from 'Redux/Apis/GetApiCalls';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


const ContainerTrackngTable = () => {

  const [containerDetials, setContainerDetials] = useState([
    {
      id: 1,
      srNo: 1,
      ciNo: 'CI001',
      blNo: 'BL12345',
      oprNo: 'OPR123',
      consigneeName: 'John Doe',
      shippingLine: 'Maersk Line',
      number: '1234567890',
      sealNo: 'SEA123456',
      type: 'Full Container Load',
      eta: '2024-12-20',
      uom: 'PCS',
      net: 500,
      gross: 550,
      pack_num: 10,
      pack_type: 'Boxes',
      freeDays: 5,
      dt_status: 'Pending',
      dt_name: 'James Smith',
      dt_date: '2024-12-10',
      tr_status: 'Completed',
      tr_name: 'Alice Johnson',
      tr_date: '2024-12-15',
      do_receivedOn: '2024-12-11',
      do_validTill: '2024-12-20',
      do_rev_status: 'Valid',
      do_rev_revalidTill_1: '2024-12-18',
      do_rev_revalidTill_2: '2024-12-25',
      tdo_receivedOn: '2024-12-12',
      tdo_validTill: '2024-12-22',
      tdo_rev_status: 'Pending',
      tdo_rev_revalidTill_1: '2024-12-19',
      tdo_rev_revalidTill_2: '2024-12-26',
    }
  ])

  const columns2 = [
    { field: 'srNo', headerName: 'Sr No', width: 100, editable: true, },
    { field: 'ciNo', headerName: 'CI No', width: 100 },
    { field: 'blNo', headerName: 'BL No', width: 100 },
    { field: 'oprNo', headerName: 'OPR No', width: 100 },
    { field: 'consigneeName', headerName: 'Consignee Name', width: 200 },
    { field: 'shippingLine', headerName: 'Shipping Line', width: 150 },
    { field: 'number', headerName: 'Number', width: 100 },
    { field: 'sealNo', headerName: 'Seal No', width: 100 },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'eta', headerName: 'ETA', width: 130 },
    { field: 'uom', headerName: 'UOM', width: 80 },
    { field: 'net', headerName: 'Net', width: 110 },
    { field: 'gross', headerName: 'Gross', width: 110 },
    { field: 'pack_num', headerName: 'Number', width: 110 },
    { field: 'pack_type', headerName: 'Type', width: 110 },
    { field: 'freeDays', headerName: 'Free Days', width: 120 },
    { field: 'dt_status', headerName: 'Status', width: 150 },
    { field: 'dt_name', headerName: 'Name', width: 150 },
    { field: 'dt_date', headerName: 'Date', width: 150 },
    { field: 'tr_status', headerName: 'Status', width: 150 },
    { field: 'tr_name', headerName: 'Name', width: 150 },
    { field: 'tr_date', headerName: 'Date', width: 150 },
    { field: 'do_receivedOn', headerName: 'Received On', width: 100 },
    { field: 'do_validTill', headerName: 'Valid Till', width: 150 },
    { field: 'do_rev_status', headerName: 'Status', width: 150 },
    { field: 'do_rev_revalidTill_1', headerName: 'Revalid Till-1', width: 100 },
    { field: 'do_rev_revalidTill_2', headerName: 'Revalid Till-2', width: 100 },
    { field: 'tdo_receivedOn', headerName: 'Received On', width: 100 },
    { field: 'tdo_validTill', headerName: 'Valid Till', width: 100 },
    { field: 'tdo_rev_status', headerName: 'Status', width: 100 },
    { field: 'tdo_rev_revalidTill_1', headerName: 'Revalid Till-1', width: 100 },
    { field: 'tdo_rev_revalidTill_2', headerName: 'Revalid Till-2', width: 100 },
  ];
  const columns = [
    { field: 'srNo', headerName: 'Sr No', width: 100, editable: true },
    { field: 'ciNo', headerName: 'CI No', width: 100, editable: true },
    { field: 'blNo', headerName: 'BL No', width: 100, editable: true },
    { field: 'oprNo', headerName: 'OPR No', width: 100, editable: true },
    { field: 'consigneeName', headerName: 'Consignee Name', width: 200, editable: true },
    { field: 'shippingLine', headerName: 'Shipping Line', width: 150, editable: true },
    { field: 'number', headerName: 'Number', width: 100, editable: true },
    { field: 'sealNo', headerName: 'Seal No', width: 100, editable: true },
    { field: 'type', headerName: 'Type', width: 100, editable: true },
    { field: 'eta', headerName: 'ETA', width: 130, editable: true },
    { field: 'uom', headerName: 'UOM', width: 80, editable: true },
    { field: 'net', headerName: 'Net', width: 110, editable: true },
    { field: 'gross', headerName: 'Gross', width: 110, editable: true },
    { field: 'pack_num', headerName: 'Pack Number', width: 110, editable: true },
    { field: 'pack_type', headerName: 'Pack Type', width: 110, editable: true },
    { field: 'freeDays', headerName: 'Free Days', width: 120, editable: true },
    { field: 'dt_status', headerName: 'Status', width: 150, editable: true },
    { field: 'dt_name', headerName: 'Name', width: 150, editable: true },
    { field: 'dt_date', headerName: 'Date', width: 150, editable: true, type: 'date', },
    { field: 'tr_status', headerName: 'Status', width: 150, editable: true },
    { field: 'tr_name', headerName: 'Name', width: 150, editable: true },
    { field: 'tr_date', headerName: 'Date', width: 150, editable: true },
    { field: 'do_receivedOn', headerName: 'Received On', width: 100, editable: true },
    { field: 'do_validTill', headerName: 'Valid Till', width: 150, editable: true },
    { field: 'do_rev_status', headerName: 'Status', width: 150, editable: true },
    { field: 'do_rev_revalidTill_1', headerName: 'Revalid Till-1', width: 100, editable: true },
    { field: 'do_rev_revalidTill_2', headerName: 'Revalid Till-2', width: 100, editable: true },
    { field: 'tdo_receivedOn', headerName: 'Received On', width: 100, editable: true },
    { field: 'tdo_validTill', headerName: 'Valid Till', width: 100, editable: true },
    { field: 'tdo_rev_status', headerName: 'Status', width: 100, editable: true },
    { field: 'tdo_rev_revalidTill_1', headerName: 'Revalid Till-1', width: 100, editable: true },
    { field: 'tdo_rev_revalidTill_2', headerName: 'Revalid Till-2', width: 100, editable: true }
  ];



  const columnGroupingModel = [
    {
      groupId: 'Container No',
      description: '',
      children: [
        { field: 'number', headerName: 'Number', width: 100 },
        { field: 'sealNo', headerName: 'Seal No', width: 120 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'eta', headerName: 'ETA', width: 130 },
      ],
    },
    {
      groupId: 'Weight',
      description: '',
      children: [
        { field: 'uom', headerName: 'UOM', width: 80 },
        { field: 'net', headerName: 'Net', width: 110 }
      ],
    },
    {
      groupId: 'Pack',
      description: '',
      children: [
        { field: 'pack_num', headerName: 'Pack Number', width: 120 },
        { field: 'pack_type', headerName: 'Pack Type', width: 100 },
      ]
    },
    {
      groupId: 'Discharge Terminal',
      description: '',
      children: [
        { field: 'dt_status', headerName: 'Status', width: 150 },
        { field: 'dt_name', headerName: 'Name', width: 150 },
        { field: 'dt_date', headerName: 'Date', width: 150 },
      ],
    },
    {
      groupId: 'Transfer',
      description: '',
      children: [
        { field: 'tr_status', headerName: 'Status', width: 150 },
        { field: 'tr_name', headerName: 'Name', width: 150 },
        { field: 'tr_date', headerName: 'Date', width: 150 },
      ],
    },
    {
      groupId: 'DO  Info',
      description: '',
      children: [
        { field: 'do_receivedOn', headerName: 'Received On', width: 100 },
        { field: 'do_validTill', headerName: 'Valid Till', width: 150 },
      ],
    },
    {
      groupId: 'DO Revalidation',
      description: '',
      children: [
        { field: 'do_rev_status', headerName: 'Status', width: 150 },
        { field: 'do_rev_revalidTill_1', headerName: 'Revalid Till-1', width: 100 },
        { field: 'do_rev_revalidTill_2', headerName: 'Revalid Till-2', width: 100 },
      ],
    },
    {
      groupId: 'TDO  Info',
      description: '',
      children: [
        { field: 'tdo_receivedOn', headerName: 'Received On', width: 100 },
        { field: 'tdo_validTill', headerName: 'Name', width: 150 },
      ],
    },
    {
      groupId: 'TDO Revalidation',
      description: '',
      children: [
        { field: 'tdo_rev_status', headerName: 'Status', width: 150 },
        { field: 'tdo_rev_revalidTill_1', headerName: 'Revalid Till-1', width: 100 },
        { field: 'tdo_rev_revalidTill_2', headerName: 'Revalid Till-2', width: 100 },
      ],
    },
  ];
  return (
    <div>
      {/* <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>EXchange Controll Doc(ECD)</span>
          </Box>
        }
      >
        <form onSubmit={handleSubmit}>
          <div>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid rgba(224, 224, 224, 1)'
                }
              }}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              columns={SonColumn}
              rows={NafdacData}
            />
          </div>
          <Box>
            <Button variant="contained" type="submit" onclick={handleSubmit}>
              Submit
            </Button>`  
          </Box>
        </form>
      </MainCard> */}
      {/* <Box sx={{ height: 400, width: '100%', box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; }}> */}
      <Box
        sx={{
          height: 400,
          width: '100%',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          padding: '10px'
        }}
      >
        <DataGrid
          rows={containerDetials}
          columns={columns}
          disableRowSelectionOnClick
          columnGroupingModel={columnGroupingModel}
          // sx={{
          //   '& .MuiDataGrid-cell': {
          //     border: '1px solid rgba(224, 224, 224, 1)', // Adds grid lines to cells
          //   },
          //   '& .MuiDataGrid-columnHeaders': {
          //     background: 'gray'
          //   },
          //   '& .MuiDataGrid-columnHeader': {
          //     border: '1px solid rgba(224, 224, 224, 1)', // Adds right border to each column header
          //   },
          // }}

          rowHeight={25}
          columnHeaderHeight={25}
          // sx={{
          //   // Style for cells
          //   '& .MuiDataGrid-cell': {
          //     border: '1px solid rgba(224, 224, 224, 1)', // Adds grid lines to cells
          //     paddingLeft: '2px'
          //   },
          //   // Style for column headers
          //   '& .MuiDataGrid-columnHeaders': {
          //     background: 'gray', // Background color for header
          //     borderBottom: '2px solid rgba(224, 224, 224, 1)', // Adds bottom border to header row
          //   },
          //   // Style for each column header cell
          //   '& .MuiDataGrid-columnHeader': {
          //     border: '1px solid rgba(224, 224, 224, 1)', // Adds right border to each column header
          //     paddingLeft: '2px'
          //   },
          //   // Style for group header cell (when using column grouping)
          //   '& .MuiDataGrid-columnHeaderGroup': {
          //     textAlign: 'center', // Centers the group header text
          //     fontWeight: 'bold', // Optional: make group headers bold
          //   }
          // }}

          sx={{
            // Style for cells
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)', // Adds grid lines to cells
              paddingLeft: '2px',
            },
            // Style for column headers
            '& .MuiDataGrid-columnHeaders': {
              background: 'gray', // Background color for header
              borderBottom: '2px solid rgba(224, 224, 224, 1)', // Adds bottom border to header row
            },
            // Style for each column header cell
            '& .MuiDataGrid-columnHeader': {
              border: '1px solid rgba(224, 224, 224, 1)', // Adds right border to each column header
              paddingLeft: '2px',
            },
            // Style for group header cell (when using column grouping)
            '& .MuiDataGrid-columnHeaderGroup': {
              textAlign: 'center', // Centers the group header text
              fontWeight: 'bold', // Optional: makes group headers bold
            },
          }}
        />


      </Box>


    </div>
  );
};


export default ContainerTrackngTable;
