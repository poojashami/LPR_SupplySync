import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import { axiosInstance } from 'utils/axiosInstance';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { Chip } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditOrp from './EditOrp';
import { toast } from 'react-toastify';

const OprTable = ({ setSelectedOpr }) => {
  const { oprs, isFetching } = useSelector((state) => state.opr);

  const { opr_id: id_for_approval } = useSelector((state) => state.static);
  const [error, setError] = useState(null);
  const [oprData, setOprData] = useState([]);
  const dispatch = useDispatch();
  const [editOpr, setEditOpr] = useState(false);
  const [rowEditOpr, setRowEditOpr] = useState(false);

  const handleOpenEditOpr = (data) => {
    setRowEditOpr(data);
    setEditOpr(true);
  };
  const handleCloseEditOpr = () => {
    setEditOpr(false);
    handleClose();
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For the delete confirmation dialog
  const [documentToDelete, setDocumentToDelete] = useState(null); // Store the document to delete

  // Step 1: Open the delete confirmation dialog
  const handleOprDelete = (data) => {
    setDocumentToDelete(data); // Store the document to be deleted
    setOpenDeleteDialog(true); // Open the confirmation dialog
    handleClose();
  };

  // Step 2: Proceed with the deletion when confirmed
  const confirmDelete = async () => {
    try {
      if (documentToDelete) {
        const response = await axiosInstance.delete(`/api/opr/opr?opr_id=${documentToDelete?.opr_id}`);
        if (response.status === 204) {
          toast.success('Delete Successfully');
        } else {
          toast.error('Failed to delete document');
        }
      }
      setOpenDeleteDialog(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('An error occurred while deleting the document');
      setOpenDeleteDialog(false); // Close the dialog in case of an error
    }
  };

  // Step 3: Close the dialog without doing anything (onCancel)
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    oprs.length === 0 && getOprData();
    // GetApprovals(dispatch, rowData?.quo_id, rowData?.quo_num);
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
      total_items: item.total_item_count,
      remaining_items_for_rfq: item.remaining_item_count,
      suppliers: item.suppliers,
      shipment_type_name: item?.shipment_type_master?.shipment_type_name,
      no_quot_email_alert: item.no_quot_email_alert,
      status: item.status,
      created_on: item?.created_on?.split('T')[0],
      created_by: item?.created_by?.split('T')[0],
      vertical_name: item.vertical_name,
      company_name: item?.companyMaster?.company_name,
      division_name: item.division_name,
      buying_house_name: item.buying_house_name,
      shipment_mode_name: item.shipment_mode_name,
      dept_name: item.dept_name,
      d_timeline_name: item.delivery_timeline_id
    }));
    setOprData(mappedData);
    if (id_for_approval !== null) {
      handleViewClick(mappedData?.filter((item) => item.opr_num === id_for_approval?.quo_num)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const columnDefs = [
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 30 * 8,
                width: '20ch'
              }
            }}
          >
            <MenuItem onClick={() => handleViewClick(params.row)}>
              <VisibilityIcon style={{ fontSize: 18, marginRight: '8px', color: 'grey' }} />
              View
            </MenuItem>
            <MenuItem onClick={() => handleOpenEditOpr(params.row)}>
              {' '}
              <EditIcon style={{ fontSize: 18, marginRight: '8px', color: 'blue' }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleOprDelete(params.row)}>
              {' '}
              <DeleteIcon style={{ fontSize: 18, marginRight: '8px', color: 'red' }} /> Delete
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                setCompareMode({ company_id: oprs[params.row.id - 1].companyMaster.company_id, opr_id: oprs[params.row.id - 1].opr_id });
              }}
            >
              <CompareIcon style={{ fontSize: 18, marginRight: '8px', color: 'grey' }} /> Compare Quotes
            </MenuItem> */}
          </Menu>
        </div>
      )
    },
    {
      field: 'opr_num',
      headerName: 'OPR No.',
      renderCell: (params) =>
        params?.row?.status === '2' || params?.row?.status === 'created' ? (
          <Chip
            onClick={() => handleViewClick(params.row)}
            label={params.value}
            sx={{ width: '200px', background: '#a8d5d5d4', color: '#04494d' }}
          >
            {/* <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
            {params.value}
          </div> */}
          </Chip>
        ) : (
          <Chip onClick={() => handleViewClick(params.row)} label={params.value} sx={{ width: '200px' }}>
            {/* <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div> */}
          </Chip>
        ),
      width: 150
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 180,

      renderCell: (params) => (
        <Chip
          label={
            params.value === 'created' || params.value === '1'
              ? 'Pending For RFQ'
              : params.value === '3'
                ? 'OPR in Draft'
                : params.value === '5'
                  ? 'RFQ Created'
                  : params.value === '15'
                    ? 'Send For Approval'
                    : params.value === '16'
                      ? 'Waiting for Approvals'
                      : params.value === '10'
                        ? 'Recommended'
                        : params.value === '11'
                          ? 'OPO Generated'
                          : params.value
          }
          sx={{ width: '200px', bgcolor: '#cecece', color: 'black' }}
        />
      )
    },
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
    { headerName: 'OPR Category', field: 'opr_description', width: 150 },
    { headerName: 'Total Items', field: 'total_items', width: 100 },
    { headerName: 'Remaining Items for rfq', field: 'remaining_items_for_rfq', width: 100 }
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
        sub_group: item?.ItemsMaster?.item_super_group_master?.item_super_group_name,
        item_type: item?.ItemsMaster?.item_type,
        hs_code: item?.ItemsMaster?.hsn_code,
        nafdac_name: item?.ItemsMaster?.nafdacRequired,
        nafdacAvailable: item?.ItemsMaster?.nafdacAvailable,
        nafdacRequired: item?.ItemsMaster?.nafdacRequired,
        cria: item?.ItemsMaster?.criaRequired,
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
        uom_id: item?.uom_name,
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
    <div>
      {editOpr ? (
        <EditOrp rowEditOpr={rowEditOpr} oprIdNew={rowEditOpr.opr_id} oprNumNew={rowEditOpr.opr_num} onclose={handleCloseEditOpr} />
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Box sx={{ width: '100%' }}>
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
              slots={{ toolbar: GridToolbar }}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
            <Dialog open={openDeleteDialog} onClose={cancelDelete}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>Are you sure you want to delete this Item?</DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      )}
    </div>
  );
};

export default OprTable;
