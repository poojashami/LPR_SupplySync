import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  IconButton,
  Menu
} from '@mui/material';
import PlusButton from 'components/CustomButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';

const ContainerAllocation = () => {
  const navigate = useNavigate();
  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {' '}
            <p>Container Allocation - SI NO : SREG-54656</p>
            {/* <PlusButton label="Back" onClick={() => navigate(-1)} /> */}
          </Box>
        }
      >
        <ContainerAllocationForm />
        <ContainerAllocationTable />
        <ContainerTable />
      </MainCard>
    </div>
  );
};

export default ContainerAllocation;

const ContainerAllocationForm = () => {
  const initialFormValues = {
    transporter: '',
    container_count: '',
    container_types: 1,
    rate: '',
    tdo_given_date: null,
    delivery_location: '',
    payment_terms: 1
  };

  const [formValues, setFormValues] = useState([initialFormValues]);
  const [typeContainer, setTypeContainer] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const addForm = () => {
    setFormValues([...formValues, { ...initialFormValues }]);
  };

  const removeForm = (index) => {
    if (formValues.length > 1) {
      setFormValues(formValues.filter((_, i) => i !== index));
    }
  };

  // const handleSubmit = () => {
  //   console.log(formValues);
  // };
  useEffect(() => {
    getTypeOfContainer();
    getPaymentTerms();
    getContainerAllocationDetails();
  }, []);
  const getContainerAllocationDetails = async () => {
    try {
      const response = await axiosInstance.get('/api/operation/container/allocation ');
      console.log('container response', response.data);

      setTypeContainer(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };
  const getTypeOfContainer = async () => {
    try {
      const response = await axiosInstance.get('/api/operation/container/type/dropdown');
      const lapseKey = response.data.map((data) => ({
        id: data.container_type_master_id,
        name: data.container_type_name
      }));
      setTypeContainer(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };
  const getPaymentTerms = async () => {
    try {
      const response = await axiosInstance.get('/api/operation/container/payment/term/dropdown');
      const lapseKey = response.data.map((data) => ({
        id: data.payment_term_container_master_id,
        name: data.payment_term_container_name
      }));
      setPaymentTerms(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };
  const handleSubmit = async () => {
    try {
      const payload = formValues.map((form) => ({
        ci_id: 12,
        ci_num: 56,
        pfi_id: 22,
        pfi_num: 33,
        form_m_id: 44,
        form_m_num: 55,
        transporter: form.transporter,
        container_count: form.container_count,
        container_types: form.container_types,
        rate: form.rate,
        tdo_given_date: form.tdo_given_date,
        delivery_location: form.delivery_location,
        payment_terms: form.payment_terms
      }));

      const response = await axiosInstance.post('/api/operation/container/allocation', payload);

      if (response.status === 201) {
        console.log('Form submitted successfully:', response.data);
        toast.success('Form submitted successfully');
        setFormValues([initialFormValues]);
      } else {
        console.error('Form submission failed:', response.status);
        toast.error('Error in Form submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <Box>
      {formValues.map((form, index) => (
        <Grid container spacing={2} sx={{ padding: '20px', mb: 2 }} key={index}>
          <Grid item xs={2}>
            <Typography variant="body1">Transporter</Typography>
            <TextField
              fullWidth
              sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
              id={`transporter-${index}`}
              variant="outlined"
              value={formValues[index].transporter}
              onChange={(e) => {
                const newFormValues = [...formValues];
                newFormValues[index].transporter = e.target.value;
                setFormValues(newFormValues);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">No. of Container</Typography>
            <TextField
              type="number"
              fullWidth
              sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
              id={`no-of-container-${index}`}
              variant="outlined"
              value={formValues[index].container_count}
              onChange={(e) => {
                const newFormValues = [...formValues];
                newFormValues[index].container_count = e.target.value;
                setFormValues(newFormValues);
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body1">Types of Container</Typography>
            <Select
              sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
              fullWidth
              id={`container-types-${index}`}
              value={formValues[index].container_types}
              onChange={(e) => {
                const newFormValues = [...formValues];
                newFormValues[index].container_types = e.target.value;
                setFormValues(newFormValues);
              }}
            >
              <MenuItem value={1}>Not Selected</MenuItem>
              {typeContainer.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">Rate</Typography>
            <TextField
              type="number"
              fullWidth
              sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
              id={`rate-${index}`}
              variant="outlined"
              value={formValues[index].rate}
              onChange={(e) => {
                const newFormValues = [...formValues];
                newFormValues[index].rate = e.target.value;
                setFormValues(newFormValues);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">TDO Given Date</Typography>
            <DatePicker
              fullWidth
              sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
              value={formValues[index].tdo_given_date ? dayjs(formValues[index].tdo_given_date) : null}
              onChange={(newDate) => {
                const formattedDate = dayjs(newDate).isValid() ? dayjs(newDate).format('YYYY-MM-DD') : '';
                const newFormValues = [...formValues];
                newFormValues[index].tdo_given_date = formattedDate;
                setFormValues(newFormValues);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">Delivery Location</Typography>
            <TextField
              fullWidth
              sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
              id={`delivery-location-${index}`}
              variant="outlined"
              value={formValues[index].delivery_location}
              onChange={(e) => {
                const newFormValues = [...formValues];
                newFormValues[index].delivery_location = e.target.value;
                setFormValues(newFormValues);
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body1">Payment Term</Typography>
            <Select
              sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
              fullWidth
              defaultValue={1}
              name="payment_terms"
              id={`payment-terms-${index}`}
              value={formValues[index].payment_terms}
              onChange={(e) => {
                const newFormValues = [...formValues];
                newFormValues[index].payment_terms = e.target.value;
                setFormValues(newFormValues);
              }}
            >
              <MenuItem value={1}>Not Selected</MenuItem>
              {paymentTerms.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {index === 0 ? (
              <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={addForm}>
                Add Form
              </Button>
            ) : (
              <>
                <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={addForm}>
                  Add More
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => removeForm(index)}>
                  Remove
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      ))}

      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit Allocation
        </Button>
      </Grid>
    </Box>
  );
};

const ContainerAllocationTable = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);
  const [containerData, setContainerData] = useState([]);

  const [selected, setSelected] = useState([]);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  useEffect(() => {
    getContainerAllocationDetails();
  }, []);

  const getContainerAllocationDetails = async () => {
    try {
      const response = await axiosInstance.get('/api/operation/container/allocation');
      const payload = response.data.map((item, index) => ({
        id: index + 1,
        container_allocation_id: item.container_allocation_id,
        ci_id: item.ci_id,
        ci_num: item.ci_num,
        form_m_id: item.form_m_id,
        form_m_num: item.form_m_num,
        transporter: item.transporter,
        num_of_container_allocated: item.container_count,
        type_of_container_allocated: item.container_types,
        rate: item.rate,
        tds_given_date: item.tdo_given_date,
        delivery_location: item.delivery_location,
        payment_term: item.payment_terms
      }));
      console.log('container response', payload);

      setContainerData(payload);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const handleSelectionModelChange = (newSelectionModel) => {
    const selectedRows = containerData.filter((row) => newSelectionModel.includes(row.id));
    setSelected(selectedRows);
  };

  const handleDelete = async () => {
    let data = selected.map((i) => i.container_allocation_id).join(', ');

    console.log(selected, selected.map((i) => i.container_allocation_id).join(', '));

    try {
      const response = await axiosInstance.delete('/api/operation/container/allocation', {
        params: { container_allocation_id: data }
      });

      console.log('Deleted successfully:', response.data);
      toast.success('Deleted successfully');
      getContainerAllocationDetails();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
    }
  };
  const pfiColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
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
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                navigate('/operations/transport/expense');
              }}
            >
              <strong>Add Bill</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'Transporter', field: 'transporter', width: 250 },
    { headerName: 'No. of Container Allocated', field: 'num_of_container_allocated', width: 100 },
    { headerName: 'Type of Container Allocated', field: 'type_of_container_allocated', width: 100 },
    { headerName: 'Rate', field: 'rate', width: 100 },
    { headerName: 'TDS Given Date', field: 'tds_given_date', width: 100 },
    { headerName: 'Delivery Location', field: 'delivery_location', width: 200 },
    { headerName: 'Payment Term', field: 'payment_term', width: 100 }
  ];

  return (
    <div style={{ paddingTop: '2vh' }}>
      <div>
        <h3>Container Allocation Details</h3>
      </div>
      <DataGrid getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
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
          }}
        rows={containerData}
        columns={pfiColumn}
        pageSizeOptions={[5]}
        style={{ minHeight: '20vh', height: '50vh', width: '100%' }}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={handleSelectionModelChange}
        selectionModel={selected.map((v) => v.id)}
        filterModel={{
          items: pfiColumn.map((col) => ({
            columnField: col.field,
            operatorValue: 'contains',
            value: ''
          }))
        }}
      />
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="standard"
          sx={{
            border: '1px solid red',
            color: 'red'
          }}
          onClick={handleDelete}
          // disabled={selectedRows.length === 0}
        >
          Delete Allocation
        </Button>
      </Grid>
    </div>
  );
};

const ContainerTable = () => {
  const rows = [
    {
      id: 1
    }
  ];

  const pfiColumn = [
    { headerName: 'Payment Type', field: 'payment_type', width: 100 },
    { headerName: 'Party', field: 'party', width: 100 },
    { headerName: 'Invoice No.', field: 'invoice_num', width: 100 },
    { headerName: 'Invoice Date', field: 'invoice_date', width: 100 },
    { headerName: 'Amount', field: 'amount', width: 100 },
    { headerName: 'VAT', field: 'vat', width: 100 },
    { headerName: 'Deduction', field: 'deduction', width: 100 },
    { headerName: 'Total', field: 'total', width: 100 },
    { headerName: 'Narration', field: 'narration', width: 100 },
    { headerName: 'Document', field: 'document', width: 100 }
  ];

  return (
    <div style={{ paddingTop: '5vh' }}>
      <DataGrid getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }} columns={pfiColumn} rows={rows} style={{ minHeight: '20vh' }} />
    </div>
  );
};
