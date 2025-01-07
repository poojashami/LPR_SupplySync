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


const ContainerTrackngTable = ({ toggleViewContainerTracking }) => {






  const [containerDetials, setContainerDetials] = useState([])


  const fetch_data = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/commercial/invoice/container/details/bl?bl_num=458753154512`);
      // Insert 'id' to each object
      const transformDat = data.map((item, index) => ({
        ...item,
        id: index + 1  // Adding 'id' (you can use any value or logic)
      }));



      setContainerDetials(transformDat)

      da
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);


  const columns = [
    { field: 'id', headerName: 'Sr No', width: 100, },
    { field: 'ciNo', headerName: 'CI No', width: 100, },
    { field: 'bl_num', headerName: 'BL No', width: 100, },
    { field: 'oprNo', headerName: 'OPR No', width: 100, },
    { field: 'consigneeName', headerName: 'Consignee Name', width: 200, },
    { field: 'shippingLine', headerName: 'Shipping Line', width: 150, },
    { field: 'container_no', headerName: 'Number', width: 100, },
    { field: 'sealNo', headerName: 'Seal No', width: 100, },
    { field: 'container_type', headerName: 'Type', width: 100, editable: true },
    { field: 'eta', headerName: 'ETA', width: 130, editable: true },
    { field: 'uom', headerName: 'UOM', width: 80, editable: true },
    { field: 'net_weight', headerName: 'Net', width: 110, editable: true },
    { field: 'gross_weight', headerName: 'Gross', width: 110, editable: true },
    { field: 'pack_num', headerName: 'Pack Number', width: 110, editable: true },
    { field: 'pack_type', headerName: 'Pack Type', width: 110, editable: true },
    { field: 'freeDays', headerName: 'Free Days', width: 120, editable: true },
    { field: 'dt_status', headerName: 'Status', width: 150, editable: true },
    { field: 'dt_name', headerName: 'Name', width: 150, editable: true },
    { field: 'dt_date', headerName: 'Date', width: 150, editable: true, type: 'date' },
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
        { field: 'container_no', headerName: 'Number', width: 100 },
        { field: 'sealNo', headerName: 'Seal No', width: 120 },
        { field: 'container_type', headerName: 'Type', width: 100 },
        { field: 'eta', headerName: 'ETA', width: 130 },
      ],
    },
    {
      groupId: 'Weight',
      description: '',
      children: [
        { field: 'uom', headerName: 'UOM', width: 80 },
        { field: 'net_weight', headerName: 'Net', width: 110 },
        { field: 'gross_weight', headerName: 'Gross', width: 110 }
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
      <Box
        sx={{
          height: 400,
          width: '100%',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          padding: '10px'
        }}
      >
        <Grid container spacing={1}>

          <Grid item sm={12}>
            <DataGrid
              rows={containerDetials}
              columns={columns}
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModel}
              rowHeight={25}
              columnHeaderHeight={25}
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

          </Grid>
          <Grid item sm={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 'auto' }}
              onClick={toggleViewContainerTracking}
            >
              Back To Details
            </Button>
          </Grid>

        </Grid>




      </Box>



    </div>
  );
};


export default ContainerTrackngTable;
