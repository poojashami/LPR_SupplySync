/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Table,
  Dialog,
  Button,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TableHead,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { useSelector } from 'react-redux';

const OprView = ({ oprViewData }) => {
  console.log('oprViewData', oprViewData);
  const { approvals } = useSelector((state) => state.Approvals);
  const [approval, setApproval] = useState([]);
  const [isApproved, setIsApproved] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [comment, setComment] = useState('');
  const [showTableBodies, setShowTableBodies] = useState({
    itemDetails: true,
    approvals: true
  });
  if (!oprViewData) return null;

  const handleClose2 = () => {
    setOpen2(false);
  };

  const { stockItems } = oprViewData;
  const [oprItemData, setOprItemData] = useState([]);
  // useEffect(() => {
  //   const mappedData = approvals?.map((item, index) => {
  //     return {
  //       id: index + 1,
  //       concurred_by: item.from_user_id,
  //       concurrence_time: item.createdAt,
  //       concurrence_remarks: item.comments,
  //       action: item.action
  //     };
  //   });
  // }, [approvals]);

  const get_data = async () => {
    try {
      const { data } = await axiosInstance.get('/api/approval/logs', {
        params: {
          doc_id: oprViewData?.opr_id,
          doc_type: 'OPR'
        }
      });
      const map = data?.map((item, index) => ({
        id: index + 1,
        ...item,
        updatedAt: item?.updatedAt.split('T')[0],
        concurrence_remarks: item?.comments,
        approval_status: item.status == 1 ? 'Pending' : item.status == 2 ? 'Approved' : 'Reject',
        user_name: `${item?.ApprovalMatrix?.User?.first_name} ${item?.ApprovalMatrix?.User?.last_name}`,
        from_user_name: item?.from_user_name
      }));
      console.log(map);
      setApproval(map);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    get_data();
    // GetApprovals(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oprViewData]);

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <Box>
              <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
                {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
              </IconButton>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const ApprovalHeader = [
    { field: 'id', headerName: 'Sl. No.', width: 30 },
    { field: 'user_name', headerName: 'Concurred By', width: 100 },
    { field: 'approval_status', headerName: 'Action', width: 100 },
    { field: 'updatedAt', headerName: 'Action Date', width: 100 },
    // { field: 'from_user_name', headerName: 'Request By', width: 120 },
    // { field: 'action', headerName: 'Request Status', width: 120 },
    // {
    //   field: 'createdAt',
    //   headerName: 'Request Date',
    //   width: 130,
    //   renderCell: (params) => <span>{params.value.split('T')[0]}</span>
    // },
    // { field: 'concurrence_remarks', headerName: 'Request Remark', width: 150 }
  ];


  const ApprovalHeader1 = [
    // { field: 'id', headerName: 'Sl. No.', width: 30 },
    // { field: 'user_name', headerName: 'Concurred By', width: 100 },
    // { field: 'approval_status', headerName: 'Action', width: 100 },
    { field: 'from_user_name', headerName: 'Request By', width: 120 },
    // { field: 'action', headerName: 'Request Status', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Request Date',
      width: 130,
      renderCell: (params) => <span>{params.value.split('T')[0]}</span>
    },
    { field: 'concurrence_remarks', headerName: 'Request Remark', width: 150 },

  ];


  const stockItemColumns = [
    { headerName: 'S.No', field: 'id', width: 60 },
    { headerName: 'Category', field: 'sub_group', width: 100 },
    { headerName: 'Sub Category', field: 'item_type', width: 100 },
    { headerName: 'Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 150 },
    { headerName: 'HSN Code', field: 'hs_code', width: 100 },
    {
      headerName: 'SON Req.',
      field: 'nafdac_name',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'NAFDAC Req.',
      field: 'nafdacRequired',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'NAFDAC Avl.',
      field: 'nafdac_available',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'CRIA Req.',
      field: 'cria',
      width: 150,
      renderCell: (params) => <span>{params.row.nafdacRequired === 'true' ? 'Applicable if goods Coming from India or China' : 'No'}</span>
    },
    { headerName: 'OPR Qty', field: 'qty', width: 100 },
    { headerName: 'UOM', field: 'uom_id', width: 80 },
    { headerName: 'Stock In Transit', field: 'stock_in_transit', width: 120 },
    { headerName: 'Stock In Hand', field: 'stock_in_hand', width: 120 },
    { headerName: 'Monthly Consumption', field: 'monthly_consumption', width: 150 },
    { headerName: 'Remarks', field: 'item_description', width: 150 }
  ];
  const handleClose = () => {
    setOpen(false);
  };

  const sendApprovalRequest = async () => {
    try {
      const { data } = await axiosInstance.post('/api/approval/logs', {
        doc_type: 'OPR',
        doc_id: oprViewData.opr_id,
        doc_number: oprViewData.opr_num,
        employee_id: 2,
        action: 'Accept',
        comments: comment,
        from_level: 0
      });
      toast.success(data?.message || 'Sent for approval');
      get_data();
      setComment();
      handleClose();
    } catch (error) {
      toast.error(error.message);
      setComment();
      handleClose();
    }
  };

  const accept = async (desc) => {
    setIsApproved(desc);

    if (open2) {
      try {
        await axiosInstance.post('/api/approval/logs', {
          approval_id: Number(approval[approval.length - 1].approval_id),
          doc_type: 'OPR',
          doc_id: oprViewData.opr_id,
          doc_number: oprViewData.opr_num,
          employee_id: 2,
          action: isApproved ? 'Accept' : 'Reject',
          comments: comment,
          from_level: approval[approval.length - 1].to_user_level
        });
        toast.success(isApproved ? 'Accepted' : 'Rejected');
        handleClose2();
        get_data();
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      setOpen2(true);
    }
  };

  useEffect(() => {
    console.log(stockItems);
    const mappedData = stockItems.map((item, index) => ({
      id: index + 1,
      item_type: item?.item_type,
      sub_group: item?.sub_group,
      item_code: item?.item_code,
      item_name: item?.item_name,
      item_description: item?.item_description,
      hs_code: item?.hs_code,
      nafdac_name: item?.nafdac_name,
      nafdac_available: item?.nafdacAvailable,
      nafdacRequired: item?.nafdacRequired,
      cria: item?.cria,
      uom_id: item?.uom_id,
      stock_in_transit: item?.stock_in_transit,
      stock_in_hand: item?.stock_in_hand,
      monthly_consumption: item?.monthly_consumption,
      qty: item?.qty
    }));
    console.log(mappedData);
    setOprItemData(mappedData);
  }, []);

  return (
    <>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>
          OPR Detail (
          <span className="text-primary" style={{ color: 'blue' }}>
            {oprViewData.opr_num}
          </span>
          )
        </h3>
      </Typography>
      <Box sx={{ marginBottom: '10px' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Vertical:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.vertical_name}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Company:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.company_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Division:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.division_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Buying From:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.buy_from}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Buying House Location:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.buying_house_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Request By (Dept):
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.dept_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Requested By (Person):
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.requested_by}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Quotations Email Alert:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.no_quot_email_alert}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  OPR Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.opr_date.split('T')[0]}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Shipment Mode:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.shipment_mode_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Shipment Type:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.shipment_type_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Delivery Timeline (<i>weeks</i>):
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.d_timeline_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  OPR Category:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.opr_description}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Additional Remark:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprViewData.remarks}</Typography>
              </TableCell>
              {/* {oprViewData?.status === '2' ||
                (oprViewData?.status === 2 && ( */}

              {/* ))} */}

              {/* <TableCell>
                <Typography>{oprViewData.suppliers}</Typography>
              </TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
        <Table>{renderTableHeader('itemDetails', 'Item Details')}</Table>
        {showTableBodies.itemDetails && stockItems && stockItems.length > 0 && (
          <Box sx={{ maxHeight: 400, minHeight: '100PX', width: '100%' }}>
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
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={oprItemData}
              columns={stockItemColumns}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          </Box>
        )}
        <Table>{renderTableHeader('approvals', 'Approval Details')}</Table>
        {showTableBodies.approvals && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                flexDirection: 'column',
                alignItem: 'center',
                paddingTop: '10px',
                gap: '10px'
              }}
            >
              <Typography variant="body1" sx={{ color: 'navy' }}>
                Requestor Detail
              </Typography>

              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  minHeight: '20vh',
                  maxWidth: '130vh',
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
                rows={approval}
                columns={ApprovalHeader1}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />

              <Typography variant="body1" sx={{ color: 'navy' }}>
                Approval Log
              </Typography>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  minHeight: '20vh',
                  maxWidth: '130vh',
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
                rows={approval}
                columns={ApprovalHeader}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />




              <Box sx={{ display: 'flex', width: '50%', justifyContent: 'center', flexDirection: 'row', alignItem: 'center' }}>
                {approval.length < 1 && <span>No Approval Data</span>}
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
              <Grid item xs={2} />
              <Grid item xs={10}>
                {/* <Typography variant="body1" sx={{ color: 'navy' }}>
                  OPR Approval
                </Typography> */}
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  id="remarks"
                  label="Remarks"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={2} />
              {oprViewData.status !== '15' && (
                <Grid item xs={2}>
                  <Button
                    // fullWidth
                    variant="outlined"
                    color="error"
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '7px'
                      }
                    }}
                    onClick={() => accept(false)}
                  >
                    Reject
                  </Button>
                </Grid>
              )}

              {oprViewData.status === '15' ? (
                <Grid item xs={6}>
                  <Button
                    // fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '7px'
                      }
                    }}
                    onClick={() => setOpen(true)}
                  >
                    Request for Approval
                  </Button>
                </Grid>
              ) : (
                <Grid item xs={3}>
                  <Button
                    // fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '7px'
                      }
                    }}
                    onClick={() => accept(true)}
                  >
                    Issue OPR
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Approval Request for OPR No. '}

          <span style={{ color: 'red' }}>{oprViewData?.opr_num}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This OPR will now be sent to respective approvers, do you wish to continue ?
          </DialogContentText>
          <TextField
            fullWidth
            sx={{ marginTop: '20px' }}
            id="Remarks"
            label="Remarks* (Mandatory)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={sendApprovalRequest} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open2} onClose={handleClose2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'OPR Approval'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* This OPR will now be sent to respective approvers, do you wish to continue ? */}
            This OPR will now be sent for RFQ to concerned Dept/Person.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose2}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={() => accept()} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OprView;
