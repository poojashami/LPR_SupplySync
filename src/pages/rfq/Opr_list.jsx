import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setopr_deliveryTerm, setopr_shipmentMode, setopr_shipmentType } from 'Redux/Slices/StaticSlice';

const Opr_list = ({ setOpr_list, setShowItems }) => {
  const dispatch = useDispatch();
  const { oprs, isFetching } = useSelector((state) => state.opr);
  const [oprData, setOprData] = useState([]);
  const [shipment_mode, setShipment_mode] = useState(null);
  const [opr_cat, setOpr_cat] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    getOprData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mappedData = oprs
      .map((item, index) => ({
        id: index + 1,
        opr_id: item.opr_id,
        opr_num: item.opr_num,
        buy_from: item.buy_from,
        buy_house: item.buy_house,
        opr_date: item?.opr_date?.split('T')[0],
        requested_by: item.requested_by,
        remarks: item.remarks,
        opr_description: item?.item_super_group_master?.item_super_group_name,
        suppliers: item.suppliers,
        no_quot_email_alert: item.no_quot_email_alert,
        status: item.status,
        created_on: item.created_on,
        created_by: item.created_by,
        vertical_name: item.vertical_name,
        company_name: item?.companyMaster?.company_name,
        division_name: item.division_name,
        buying_house_name: item.buying_house_name,
        shipment_mode_name: item.shipment_mode_name,
        shipment_type_name: item?.shipment_type_master?.shipment_type_name,
        dept_name: item.dept_name,
        d_timeline_name: `${item.delivery_timeline_id} Weeks`,
        remaining_item_count: item?.remaining_item_count
      }))
      .filter((item) => item.remaining_item_count > 0 && item.status < 5);

    setOprData(mappedData);
  }, [oprs]);

  const columnDefs = [
    {
      field: 'opr_num',
      headerName: 'OPR No.',
      renderCell: (params) => (
        <div style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      width: 120
    },
    { headerName: 'Vertical', field: 'vertical_name', width: 120 },
    { headerName: 'Company', field: 'company_name', width: 120 },
    { headerName: 'Division', field: 'division_name', width: 120 },
    { headerName: 'OPR Category', field: 'opr_description', width: 150 },
    { headerName: 'Shipment Mode', field: 'shipment_mode_name', width: 120 },
    { headerName: 'Buying From', field: 'buy_from', width: 120 },
    { headerName: 'Buying House', field: 'buying_house_name', width: 120 },
    { headerName: 'Left for RFQ', field: 'remaining_item_count', width: 120 },
    { headerName: 'Delivery Time', field: 'd_timeline_name', width: 120 },
    { headerName: 'Requested By Department', field: 'dept_name', width: 180 },
    { headerName: 'Requested By', field: 'requested_by', width: 120 },
    { headerName: 'Date', field: 'opr_date', width: 120 },
    { headerName: 'Additional Remarks', field: 'remarks', width: 150 }
  ];

  const getOprData = async () => {
    try {
      await GetOpr(dispatch);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
      setError('Failed to load OPR data');
    }
  };
  const handleSelectionModelChange = (selectionModel) => {
    const selectedIDs = new Set(selectionModel);
    const selectedRowData = oprData.filter((row) => selectedIDs.has(row.id));
    const times = selectedRowData?.map((item) => item?.d_timeline_name);
    const opr_ids = selectedRowData?.map((item) => item?.opr_id);
    const shipmentMode = selectedRowData[0]?.shipment_mode_name;
    const shipmentType = selectedRowData?.map((item) => item?.shipment_type_name);
    console.log('shipmentMode', shipmentMode);
    console.log('shipmentType', shipmentType);

    selectedRowData[0]?.shipment_mode_name === undefined && setShipment_mode(null);
    selectedRowData[0]?.opr_description === undefined && setOpr_cat(null);

    selectedRowData[0]?.shipment_mode_name !== undefined && setShipment_mode(selectedRowData[0]?.shipment_mode_name);
    selectedRowData[0]?.opr_description !== undefined && setOpr_cat(selectedRowData[0]?.opr_description);
    dispatch(setopr_deliveryTerm(times.filter((item, index) => times.indexOf(item) === index)));
    dispatch(setopr_shipmentMode(shipmentMode));
    dispatch(setopr_shipmentType(shipmentType));
    setOpr_list(opr_ids);
  };
  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Box sx={{ minHeight: 400, width: '100%' }}>
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            minHeight: '70vh',
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
            '& .MuiDataGrid-checkboxInput': {
              padding: '0px' // To remove extra padding around the checkbox
            },
            '& .MuiCheckbox-root': {
              width: '18px',
              height: '18px'
            },
            '& .MuiSvgIcon-root': {
              fontSize: '20px' // Customize the size of the checkmark icon
            },

            '& .MuiDataGrid-scrollbar': {
              height: '8px'
            }
          }}
          onRowSelectionModelChange={handleSelectionModelChange}
          isRowSelectable={(params) => {
            return opr_cat === null || opr_cat === undefined
              ? true
              : params.row.opr_description === opr_cat && params.row.shipment_mode_name === shipment_mode;
          }}
          checkboxSelection
          loading={isFetching}
          rows={oprData}
          columns={columnDefs}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '50px' }}>
        <Button variant="outlined" color="primary" onClick={() => setShowItems(true)}>
          Proceed
        </Button>
      </Box>
    </>
  );
};

export default Opr_list;
