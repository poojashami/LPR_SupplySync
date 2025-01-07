import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { borderRadius } from '@mui/system';
import { NoButton, YesButton } from 'components/DialogActionsButton';

export default function CityMaster() {
  const navigate = useNavigate();
  const [stateData, setStateData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [editingState, setEditingState] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getStates();
    getCountry();
  }, []);
  const columns = [
    { field: 'stateName', headerName: 'State', width: 150 },
    { field: 'name', headerName: 'City', width: 150 },
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
    { field: 'created_by', headerName: 'Created By', width: 150 },
    { field: 'updated_by', headerName: 'Updated By', width: 150 },
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
    cityName: editingState ? editingState.name : '',
    stateName: editingState ? editingState.state : '',
    status: editingState ? (editingState.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    cityName: Yup.string().required('City is required'),
    stateName: Yup.string().required('Select State'),
    status: Yup.string().required('Status is required')
  });
  const handleEdit = (cityName) => {
    setEditingState(cityName);
  };

  const handleDeleteClick = (cityName) => {
    setStateToDelete(cityName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/city?city_id=${stateToDelete.city_id}`);
      getStates();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting cityName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStateToDelete(null);
  };

  const getCountry = async () => {
    try {
      const response = await axiosInstance.get('/api/state/dropdown');
      const cityNameList = response.data.map((data) => ({
        state_id: data.state_id,
        state: data.state
      }));
      setCountryData(cityNameList);
    } catch (error) {
      console.error('Error fetching cityNames:', error);
    }
  };
  console.log('state data Id', stateData);
  const getStates = async () => {
    try {
      const response = await axiosInstance.get('/api/city');
      const cityNameList = response.data.map((data, index) => ({
        id: index + 1,
        city_id: data.city_id,
        name: data.city,
        state: data.state_id,
        stateName: data.StateName,
        status: data.status == 1 ? 'Active' : 'Inactive',
        created_by: data.created_by,
        updated_by: data.updated_by
      }));
      setStateData(cityNameList);
    } catch (error) {
      console.error('Error fetching cityNames:', error);
    }
  };

  const handleUpdateConfirm = async (values, resetForm) => {
    const payload = {
      cityName: values.cityName,
      state_id: values.stateName,
      status: values.status
    };
    console.log('data', payload);

    try {
      if (editingState) {
        await axiosInstance.put(`/api/city?city_id=${editingState.city_id}`, payload);
      } else {
        await axiosInstance.post('/api/city', payload);
      }

      getStates();
      resetForm();
      setEditingState(null);
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating cityName:', error);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingState) {
      setUpdateDialogOpen(true);
    } else {
      handleUpdateConfirm(values, resetForm);
    }
  };
  console.log('editingState', editingState);

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>City</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingState ? editingState.id : 'new'}
      >
        {({ isSubmitting, resetForm, values }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          State <ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={SelectFieldPadding} name="stateName" variant="outlined" fullWidth>
                          {countryData.map((country) => (
                            <MenuItem key={country.state_id} value={country.state_id}>
                              {country.state}
                            </MenuItem>
                          ))}
                        </Field>
                        <ErrorMessage name="stateName" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          City <ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="cityName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="cityName" component="div" style={errorMessageStyle} />
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
                          {editingState ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingState(null);
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

            {/* Update Confirmation Dialog */}
            <Dialog
              open={updateDialogOpen}
              onClose={() => setUpdateDialogOpen(false)}
              aria-labelledby="update-dialog-title"
              aria-describedby="update-dialog-description"
            >
              <DialogTitle id="update-dialog-title">Confirm Update</DialogTitle>
              <DialogContent>
                <DialogContentText id="update-dialog-description">Are you sure you want to update city?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <NoButton onClick={() => setUpdateDialogOpen(false)}>
                  <span>No</span>
                </NoButton>
                <YesButton onClick={() => handleUpdateConfirm(values, resetForm)}>
                  <span>Yes</span>
                </YesButton>
              </DialogActions>
            </Dialog>
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
        rows={stateData}
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
        <DialogTitle
          id="alert-dialog-title"
          style={{ backgroundColor: '#a1bcdb', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', fontSize: '15px' }}
        >
          {'Confirm Deletion'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText marginTop="20px" id="alert-dialog-description">
            Are you sure you want to delete this shipment mode?
          </DialogContentText>
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
