import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import { axiosInstance } from 'utils/axiosInstance';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompareIcon from '@mui/icons-material/Compare';
import { useNavigate } from 'react-router';
import { setCompareMode } from 'Redux/Slices/StaticSlice';
import { Chip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

const OPO_List = ({ setSelectedOpr }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { oprs, isFetching } = useSelector((state) => state.opr);
  const [oprData, setOprData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    oprs.length === 0 && getOprData();
  }, []);

  useEffect(() => {
    const mappedData = oprs.map((item, index) => ({
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
      dept_name: item.dept_name,
      d_timeline_name: item.delivery_timeline_name
    }));

    setOprData(mappedData);
  }, [oprs]);

  const handleViewClick = async (opr) => {
    const stockItems = await getStockItem(opr.opr_id);
    setSelectedOpr({ ...opr, stockItems });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleActionClick = async (quotation) => {
    // Your action logic here
    handleClose();
  };

  const columnDefs = [
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   width: 80,
    //   renderCell: (params) => (
    //     <div>
    //       <IconButton
    //         aria-label="more"
    //         id={`long-button-${params.row.id}`}
    //         aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
    //         aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
    //         aria-haspopup="true"
    //         onClick={(event) => handleClick(event, params.row.id)}
    //       >
    //         <MoreVertIcon />
    //       </IconButton>
    //       <Menu
    //         id="long-menu"
    //         anchorEl={anchorEl}
    //         open={openAction && anchorElRowId === params.row.id}
    //         onClose={handleClose}
    //         PaperProps={{
    //           style: {
    //             maxHeight: 30 * 8,
    //             width: '20ch'
    //           }
    //         }}
    //       >
    //         <MenuItem onClick={() => handleViewClick(params.row)}>
    //           <VisibilityIcon style={{ fontSize: 18, marginRight: '8px', color: 'grey' }} />
    //           View
    //         </MenuItem>
    //         <MenuItem onClick={() => handleActionClick(params.row)}>
    //           {' '}
    //           <EditIcon style={{ fontSize: 18, marginRight: '8px', color: 'blue' }} /> Edit
    //         </MenuItem>
    //         <MenuItem onClick={() => handleActionClick(params.row)}>
    //           {' '}
    //           <DeleteIcon style={{ fontSize: 18, marginRight: '8px', color: 'red' }} /> Delete
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => {
    //             console.log('oprs', oprs);
    //             dispatch(
    //               setCompareMode({
    //                 data: {
    //                   company_id: oprs[params.row.id - 1].companyMaster.company_id,
    //                   opr_id: oprs[params.row.id - 1].opr_id,
    //                   opr_num: oprs[params.row.id - 1].opr_num,
    //                   status: oprs[params.row.id - 1].status
    //                 }
    //               })
    //             );
    //             navigate('/opo/compare');
    //           }}
    //         >
    //           <CompareIcon style={{ fontSize: 18, marginRight: '8px', color: 'grey' }} /> Compare Quotes
    //         </MenuItem>
    //       </Menu>
    //     </div>
    //   )
    // },
    {
      field: 'action',
      headerName: 'Create',
      width: 60,
      renderCell: (params) => (
        <CreateIcon
          onClick={() => {
            dispatch(
              setCompareMode({
                data: {
                  company_id: oprs[params.row.id - 1].companyMaster.company_id,
                  opr_id: oprs[params.row.id - 1].opr_id,
                  opr_num: oprs[params.row.id - 1].opr_num,
                  status: oprs[params.row.id - 1].status
                }
              })
            );
            navigate('/opo/compare');
          }}
        />
        // <Button size="small" onClick={() => QuotationForm(rfq)}>
        //   Create Quotation
        // </Button>
      )
    },
    {
      field: 'opr_num',
      headerName: 'OPR No.',
      renderCell: (params) =>
        params?.row?.status === '2' ? (
          <Chip label={params.value} sx={{ width: '200px' }} color={'success'}>
            {/* <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
            {params.value}
          </div> */}
          </Chip>
        ) : (
          <Chip label={params.value} sx={{ width: '200px' }}>
            {/* <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div> */}
          </Chip>
        ),
      width: '150'
    },
    {
      headerName: 'Procurement Status',
      field: 'status_procurement',
      width: 150,
      renderCell: (params) =>
        params?.row?.status === '10' ? <span>Recommended By BH</span> : params?.row?.status === '11' && <span>OPO Created</span>
    },
    { headerName: 'Quote Status # ', field: 'quote_status', width: 120 },
    { headerName: 'Vertical', field: 'vertical_name', width: 120 },
    { headerName: 'Company', field: 'company_name', width: 120 },
    { headerName: 'Division', field: 'division_name', width: 120 },
    { headerName: 'Buying From', field: 'buy_from', width: 120 },
    { headerName: 'Buying House', field: 'buying_house_name', width: 120 },
    { headerName: 'Shipment Mode', field: 'shipment_mode_name', width: 120 },
    // {
    //   headerName: 'Quotation Received',
    //   field: 'id',
    //   width: 200,
    //   renderCell: (params) => (
    //     <Button
    //       onClick={() => {
    //         setCompareMode({ company_id: oprs[params.row.id - 1].companyMaster.company_id, opr_id: oprs[params.row.id - 1].opr_id });
    //       }}
    //       variant="outlined"
    //     >
    //       Compare Quotation
    //     </Button>
    //   )
    // },
    { headerName: 'Delivery Time', field: 'd_timeline_name', width: 120 },
    { headerName: 'Requested By Department', field: 'dept_name', width: 180 },
    { headerName: 'Requested By', field: 'requested_by', width: 120 },
    { headerName: 'Date', field: 'opr_date', width: 120 },
    { headerName: 'Additional Remarks', field: 'remarks', width: 150 },
    { headerName: 'OPR Category', field: 'opr_description', width: 150 }
    // { headerName: 'Potential Suppliers', field: 'suppliers', width: 150 }
  ];

  const getOprData = async () => {
    try {
      await GetOpr(dispatch);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
      setError('Failed to load OPR data');
    }
  };

  const getStockItem = async (oprId) => {
    try {
      const response = await axiosInstance.get(`/api/opr/items?opr_id=${oprId}`);
      console.log(response.data);
      return response.data.map((item, index) => ({
        id: index + 1,
        item_id: item.item_id,
        item_series: item.item_series,
        item_name: item.ItemsMaster.item_name,
        qty: item.qty,
        item_code: item.ItemsMaster.item_code,
        quantity_in_stock: item.quantity_in_stock,
        quantity_on_order: item.quantity_on_order,
        monthly_consumption: item.monthly_consumption,
        item_description: item.item_description,
        group_name: item.group_name,
        sub_group: item.sub_group,
        cria: item.cria,
        item_type: item?.ItemsMaster?.item_type,
        hs_code: item.hs_code,
        nafdac_name: item.nafdac_name,
        nafdac_category: item.nafdac_category,
        factory: item.factory,
        hsn_code: item.hsn_code,
        tolerance: item.tolerance,
        vendors: item.vendors,
        lead_time: item.lead_time,
        reorder_level: item.reorder_level,
        unit_price: item.unit_price,
        msrp: item.msrp,
        is_discontinued: item.is_discontinued,
        item_img: item.item_img,
        item_img_name: item.item_img_name,
        notes: item.notes,
        uom_id: item.ItemsMaster.UomMaster.uom_name,
        created_by: item.created_by,
        stock_in_hand: item.stock_in_hand,
        stock_in_transit: item.stock_in_transit
      }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data');
      return [];
    }
  };
  return (
    <MainCard title={'Create OPO - List of OPR with Quotes'}>
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
            '& .MuiDataGrid-scrollbar': {
              height: '8px'
            }
          }}
          loading={isFetching}
          rows={oprData}
          columns={columnDefs}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </MainCard>
  );
};

export default OPO_List;
