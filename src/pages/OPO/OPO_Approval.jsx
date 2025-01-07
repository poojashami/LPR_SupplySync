import { toast } from 'react-toastify';
import OprView from 'pages/opr/oprView';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from 'utils/axiosInstance';
import { setopr_id } from 'Redux/Slices/StaticSlice';
import { useSelector, useDispatch } from 'react-redux';
import { GetPurchaseOrder } from 'Redux/Apis/GetApiCalls';
import { Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Grid, TextField } from '@mui/material';

const OPO_Approval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [podata, setPodata] = useState([]);
  const { purchaseOrder } = useSelector((state) => state.purchaseOrder);

  const handleClose = () => {
    setOpen(false);
  };

  const fetch_approvals = async () => {
    try {
      const { data } = await axiosInstance.get('/api/approval/logs');
      const mappedData = data
        ?.filter((item) => item.from_user_id === JSON.parse(localStorage.getItem('userInfo')).email)
        ?.map((po, index) => ({
          id: index + 1,
          opo_id: po.approval_id,
          opo_num: po.doc_type,
          quo_num: po.doc_num,
          vendor_id: po.from_user_id,
          total_cost: po.from_user_level,
          quo_id: po.comments,
          created_on: po.createdAt.split('T')[0],
          status1: po.action,
          status2: po.action
          // final_doc_dispatch_no: po.final_doc_dispatch_no,
          // dispatch_date: po.dispatch_date
        }));
      // .filter((item) => item.status === '1');
      console.log(mappedData);
      setPodata(mappedData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    purchaseOrder?.length <= 0 && GetPurchaseOrder(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetch_approvals();
  }, []);
  const cols = [
    { field: 'id', headerName: 'SL.No', width: 20 },
    // { field: 'opo_id', headerName: 'Approval ID', width: 120 },
    {
      field: 'opo_num',
      headerName: 'Doc Type',
      width: 100,
      renderCell: (params) => (
        <div
          // onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: '#4680FF' }}
          aria-hidden="true"
        >
          {params.value}
        </div>
      )
    },
    { field: 'quo_num', headerName: 'Doc Num', width: 150 },
    { field: 'vendor_id', headerName: 'Assigned To', width: 150 },
    { field: 'total_cost', headerName: 'Approval Level', width: 150 },
    { field: 'created_on', headerName: 'Generate Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <div>
          {params.value === 3 ? (
            <Button
              variant="text"
              style={{ color: '#4680FF', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
              // onClick={() => handlePaymentPO(params.row)}
            >
              Request Payment
            </Button>
          ) : params.value === 1 ? (
            <Chip label="Send to Vendor" sx={{ width: '200px' }} />
          ) : params.value === 6 ? (
            <Chip label="Payment Done" color="success" sx={{ width: '200px' }} />
          ) : params.value === 5 ? (
            <Chip label="Payment Processing" color="info" sx={{ width: '200px' }} />
          ) : params.value === '8' || params.value === 8 ? (
            <Button
              // onClick={() => handleShowDocs(params.row)}
              variant="text"
              style={{ color: 'green', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
            >
              Ready for dispatch
            </Button>
          ) : params.value === '10' || params.value === 10 ? (
            <Button
              onClick={() => {
                // console.log(quotationData[params.id - 1]);
                // alert(`${quotationData[params.id - 1]?.dispatch_date} ${quotationData[params.id - 1]?.final_doc_dispatch_no}`);
                // handleShowDocs(params.row);
              }}
              variant="text"
              style={{ color: 'green', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
            >
              Final Payment
            </Button>
          ) : (
            <Chip label="Pending at L1" color="warning" sx={{ width: '200px' }} />
          )}
        </div>
      )
    },
    {
      field: 'status1',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <Button
          onClick={() => {
            dispatch(setopr_id(params.row));
            navigate('/opr');
          }}
          disabled={params.row.status === '6' || params.row.status === 6}
          size="small"
        >
          Proceed
        </Button>
      )
    }
    // {
    //   field: 'status2',
    //   headerName: 'Level 2',
    //   width: 120,
    //   renderCell: (params) => (
    //     <Button disabled size="small">
    //       {params.row.status === 5 ? 'Approved' : 'Approve'}
    //     </Button>
    //   )
    // },
    // {
    //   field: 'download_doc',
    //   headerName: 'View Doc ',
    //   width: 120
    //     renderCell: (params) => (
    //       <Button onClick={() => handleDocClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
    //         <RemoveRedEyeIcon style={{ color: 'grey', backgroundColor: 'transparent' }} />
    //       </Button>
    //     )
    // }

    // { field: 'created_on', headerName: 'OPO Date', width: 120 }
  ];
  return (
    <>
      <MainCard title={'Pending for approval'}>
        <DataGrid
          rows={podata}
          columns={cols}
          getRowHeight={() => 'auto'}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
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
            }
          }}
        />
      </MainCard>

      <Dialog open={open} onClose={handleClose} aria-labelledby={'approve'}>
        <DialogTitle id={'approve'}>Approval Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Documents</DialogContentText>
          <Box sx={{ height: '50vh' }}>
            <OprView rowData={'asdasd'} />
          </Box>
          {/* <Grid container spacing={2}>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="remarks"
                label="remarks"
              />
            </Grid>
          </Grid> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OPO_Approval;
