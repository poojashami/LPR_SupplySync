import {
  Button,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Switch
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { useEffect, useState } from 'react';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import { toast } from 'react-toastify';

export default function PaymentTerms() {
  const navigate = useNavigate();
  const label = { inputProps: { 'aria-label': 'Status Switch' } };
  const [paymentTermsNameData, setPaymentTermsNameData] = useState([]);
  const [editingPaymentTermsName, setEditingPaymentTermsName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentTermsToDelete, setpaymentTermsToDelete] = useState(null);
  const [status, setStatus] = useState(true);
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [penaltyData, setPenaltyData] = useState([]);
  const [data, setData] = useState([{ milestone: '', percentage_value: 0 }]);
  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getpaymentTermsName();
    getPenaltyTerms();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [name]: value };
      return newData;
    });
  };

  const handleEdit = (paymentTermsName, setValues) => {
    setEditingPaymentTermsName(paymentTermsName);
    // Set form values when an edit is initiated
    setValues({
      paymentTermsName: paymentTermsName.name,
      paymentType: paymentTermsName.payment_type_id || '',
      penaltyTerm: paymentTermsName.penalty_terms_id || '',
      status: paymentTermsName.status === 'Active' ? '1' : '2'
    });
  };

  const handleDeleteClick = (paymentTermsName) => {
    setpaymentTermsToDelete(paymentTermsName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/payment/term_delete?payment_terms_id=${paymentTermsToDelete.paymentTermsID}`);
      getpaymentTermsName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting paymentTermsName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setpaymentTermsToDelete(null);
  };

  const columns = [
    { field: 'id', headerName: 'SL.NO.', width: 60 },
    { field: 'name', headerName: 'Name', width: 450 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        const color = status === 'Active' ? 'green' : 'red';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography sx={{ color, fontWeight: 'bold' }}>{status}</Typography>
          </Box>
        );
      }
    },
    { field: 'createdby', headerName: 'Created By', width: 150 },
    { field: 'updatedby', headerName: 'Updated By', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];
  const getPenaltyTerms = async () => {
    try {
      const response = await axiosInstance.get('/api/payment/penalty/term_dropdown');

      const PaymentTermsData = response.data.map((data) => ({
        penaltyId: data.penalty_terms_id,
        name: data.penalty_terms_name
      }));
      setPenaltyData(PaymentTermsData);
    } catch (error) {
      throw new Error('Error fetching department');
    }
  };

  const getpaymentTermsName = async () => {
    try {
      const response = await axiosInstance.get('/api/payment/term_list');
      const paymentTermsNameList = response.data.map((data, index) => ({
        id: index + 1,
        paymentTermsID: data.payment_terms_id,
        name: data.payment_terms,
        paymentType: data.payment_type_id,
        penaltyTerm: data.penalty_terms_id,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setPaymentTermsNameData(paymentTermsNameList);
    } catch (error) {
      console.error('Error fetching paymentTermsNames:', error);
    }
  };

  const submit_payment_term = async () => {
    try {
      const res = await axiosInstance.post('/api/paymentterms/create', {
        payment_terms: data.map((item) => `${item.percentage_value}% ${item.milestone}`).join(', '),
        milestone_data: data,
        status: status
      });
      setData([{ milestone: '', percentage_value: 0 }]);
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Payment Terms</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">Payment Term</Typography>
          <TextField
            fullWidth
            id="mainTerm"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              }
            }}
            value={data?.map((item) => `${item?.percentage_value}% ${item?.milestone} `)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="body1">Status</Typography>
          <Switch checked={status} onChange={(e) => setStatus(e.target.checked)} {...label} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          {' '}
          <Typography>MileStone</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography>Percentage</Typography>
        </Grid>
      </Grid>
      {data?.map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: '2px' }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              value={item?.milestone}
              name="milestone"
              id="milestone"
              onChange={(e) => handleChange(index, e)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              id="percentage_value"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              value={item?.percentage_value}
              name="percentage_value"
              onChange={(e) => handleChange(index, e)}
            />
          </Grid>
          {!(data?.length - 1 > index) && (
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={() => setData((prevVal) => [...prevVal, { milestone: '', percentage: 0 }])}
                disabled={data?.length - 1 > index}
              >
                Add
              </Button>
            </Grid>
          )}

          {!(data?.length - 1 <= index) && (
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                id={`btn-${index}`}
                disabled={data?.length - 1 <= index}
                onClick={() => setData((prevVal) => prevVal.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </Grid>
          )}
        </Grid>
      ))}
      <Grid container spacing={0}>
        <Button variant="contained" color="primary" onClick={submit_payment_term}>
          Submit
        </Button>
      </Grid>
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
            borderBottom: '2px solid rgba(224, 224, 224, 1)',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center'
          }
        }}
        rows={paymentTermsNameData}
        columns={columns}
        pagination={false}
        components={{
          Pagination: () => null
        }}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this paymentTerms?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <NoButton onClick={handleDeleteCancel}>
            <span>No</span>
          </NoButton>
          <YesButton onClick={handleDeleteConfirm}>
            <span>Yes</span>
          </YesButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
