import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  Grid,
  TableRow,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  TextField
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { useEffect, useState } from 'react';
import { NoButton, YesButton } from 'components/DialogActionsButton';

export default function BuyingHouse() {
  const navigate = useNavigate();

  const [buyingHouseNameData, setbuyingHouseNameData] = useState([]);
  const [editingBuyingHouseName, setEditingBuyingHouseName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buyingHouseToDelete, setbuyingHouseToDelete] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getBuyingHouse();
  }, []);
  useEffect(() => {
    const getCountry = async () => {
      try {
        const response = await axiosInstance.get('/api/country/dropdown');
        const countries = response.data.map((data) => ({
          country_id: data.country_id,
          country: data.country
        }));
        setCountryData(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    getCountry();
  }, []);

  const handleCountryChange = async (event, value, setFieldValue) => {
    setFieldValue('country', value?.country || ''); // Set Formik field value
    setStateData([]); // Reset states
    setCityData([]); // Reset cities
    setLoadingStates(true);

    try {
      const response = await axiosInstance.get(`/api/state/dropdown?country_id=${value?.country_id}`);
      const states = response.data.map((data) => ({
        state_id: data.state_id,
        state: data.state
      }));
      setStateData(states);
      setLoadingStates(false);
    } catch (error) {
      console.error('Error fetching states:', error);
      setLoadingStates(false);
    }
  };

  const handleStateChange = async (event, value, setFieldValue) => {
    setFieldValue('state', value?.state || ''); // Set Formik field value
    setCityData([]); // Reset cities
    setLoadingCities(true);

    try {
      const response = await axiosInstance.get(`/api/city/dropdown?state_id=${value?.state_id}`);
      const cities = response.data.map((data) => ({
        city_id: data.city_id,
        city: data.city
      }));
      setCityData(cities);
      setLoadingCities(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setLoadingCities(false);
    }
  };

  const handleEdit = (buyingHouseName) => {
    setEditingBuyingHouseName(buyingHouseName);
  };

  const handleDeleteClick = (buyingHouseName) => {
    setbuyingHouseToDelete(buyingHouseName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/bhouse/delete?buying_house_id=${buyingHouseToDelete.buyingHouseID}`);
      getBuyingHouse();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting buyingHouseName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setbuyingHouseToDelete(null);
  };

  const columns = [
    { field: 'name', headerName: 'House Name', width: 150 },
    { field: 'buying_house_code', headerName: 'Buying House Code', width: 150 },
    { field: 'contact_number', headerName: 'Number', width: 150 },
    { field: 'contact_email', headerName: 'Email', width: 150 },
    { field: 'address_line1', headerName: 'Line 1', width: 150 },
    { field: 'address_line2', headerName: 'Line 2', width: 150 },
    { field: 'postal_code', headerName: 'Pincode', width: 150 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
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

  const initialValues = {
    buyingHouseName: editingBuyingHouseName ? editingBuyingHouseName.name : '',
    contact_number: '',
    contact_email: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    country: '',
    state: '',
    city: '',
    status: editingBuyingHouseName ? (editingBuyingHouseName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    buyingHouseName: Yup.string().required('buyingHouseName is required'),
    contact_number: Yup.string().required('Status is required'),
    contact_email: Yup.string().required('Status is required'),
    address_line1: Yup.string().required('Status is required'),
    address_line2: Yup.string().required('Status is required'),
    postal_code: Yup.string().required('Status is required'),
    country: Yup.string().required('Status is required'),
    state: Yup.string().required('Status is required'),
    city: Yup.string().required('Status is required'),
    status: Yup.string().required('Status is required')
  });

  const getBuyingHouse = async () => {
    try {
      const response = await axiosInstance.get('/api/bhouse/list');
      console.log('buying response', response);
      const buyingHouseNameList = response.data.map((data, index) => ({
        id: index + 1,
        buyingHouseID: data.buying_house_id,
        name: data.buying_house_name,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by,
        contact_number: data.contact_number,
        contact_email: data.contact_email,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postal_code,
        buying_house_code: data.buying_house_code
      }));
      setbuyingHouseNameData(buyingHouseNameList);
    } catch (error) {
      console.error('Error fetching buyingHouseNames:', error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      buying_house_name: values.buyingHouseName,
      contact_number: values.contact_number,
      contact_email: values.contact_email,
      address_line1: values.address_line1,
      address_line2: values.address_line2,
      city: values.city,
      state: values.state,
      country: values.country,
      postal_code: values.postal_code,
      status: values.status
    };
    console.log('Payload', payload);
    try {
      let response;
      if (editingBuyingHouseName) {
        response = await axiosInstance.put(`/api/bhouse/update?buying_house_id=${editingBuyingHouseName.buyingHouseID}`, payload);
      } else {
        response = await axiosInstance.post('/api/bhouse/create', payload);
      }

      getBuyingHouse();
      resetForm();
      setEditingBuyingHouseName(null);
    } catch (error) {
      console.error('Error submitting buyingHouseName:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Buying House</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingBuyingHouseName ? editingBuyingHouseName.id : 'new'}
      >
        {({ isSubmitting, resetForm, setFieldValue }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Buying House Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="buyingHouseName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="buyingHouseName" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Contact Number<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="contact_number" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="contact_number" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Contact Email<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="contact_email" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="contact_email" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Address Line 1<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="address_line1" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="address_line1" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Address Line 2<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="address_line2" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="address_line2" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Pincode<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="postal_code" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="postal_code" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Country<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          options={countryData}
                          getOptionLabel={(option) => option.country}
                          onChange={(event, value) => handleCountryChange(event, value, setFieldValue)}
                          renderInput={(params) => <TextField {...params} label="Select Country" variant="outlined" fullWidth />}
                        />
                        <ErrorMessage name="country" component="div" style={{ color: 'red' }} />
                      </Grid>

                      {/* State */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          State<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          options={stateData}
                          getOptionLabel={(option) => option.state}
                          onChange={(event, value) => handleStateChange(event, value, setFieldValue)}
                          renderInput={(params) => <TextField {...params} label="Select State" variant="outlined" fullWidth />}
                        />
                        <ErrorMessage name="state" component="div" style={{ color: 'red' }} />
                      </Grid>

                      {/* City */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          City<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          options={cityData}
                          getOptionLabel={(option) => option.city}
                          onChange={(event, value) => setFieldValue('city', value?.city || '')}
                          renderInput={(params) => <TextField {...params} label="Select City" variant="outlined" fullWidth />}
                        />
                        <ErrorMessage name="city" component="div" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Status<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={SelectFieldPadding} name="status" variant="outlined" fullWidth>
                          <MenuItem value="1">Active</MenuItem>
                          <MenuItem value="2">Inactive</MenuItem>
                        </Field>
                        <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button type="submit" variant="contained" color="primary">
                          {editingBuyingHouseName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingBuyingHouseName(null);
                          }}
                        >
                          Refresh
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>
        )}
      </Formik>

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
            borderBottom: '2px solid rgba(224, 224, 224, 1)'
          }
        }}
        rows={buyingHouseNameData}
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
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this buyingHouse?</DialogContentText>
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
