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

export default function ShipmentMode() {
  const navigate = useNavigate();
  const [shipmentModeNameData, setshipmentModeNameData] = useState([]);
  const [editingShipmentModeName, setEditingShipmentModeName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentModeToDelete, setshipmentModeToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getshipmentModeName();
  }, []);
  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'status',
      headerName: 'status',
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
    shipmentModeName: editingShipmentModeName ? editingShipmentModeName.name : '',
    status: editingShipmentModeName ? (editingShipmentModeName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    shipmentModeName: Yup.string().required('shipmentMode is required'),
    status: Yup.string().required('status is required')
  });
  const handleEdit = (shipmentModeName) => {
    setEditingShipmentModeName(shipmentModeName);
  };

  const handleDeleteClick = (shipmentModeName) => {
    setshipmentModeToDelete(shipmentModeName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/shipMode/mode?shipment_mode_id=${shipmentModeToDelete.shipmentModeID}`);
      getshipmentModeName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting shipmentModeName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setshipmentModeToDelete(null);
  };
  const getshipmentModeName = async () => {
    try {
      const response = await axiosInstance.get('/api/shipMode/modes');
      const shipmentModeNameList = response.data.map((data, index) => ({
        id: index + 1,
        shipmentModeID: data.shipment_mode_id,
        name: data.shipment_mode_name,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setshipmentModeNameData(shipmentModeNameList);
    } catch (error) {
      console.error('Error fetching shipmentModeNames:', error);
    }
  };

  const handleUpdateConfirm = async (values, resetForm) => {
    const payload = {
      shipment_mode_name: values.shipmentModeName,
      status: values.status
    };

    try {
      if (editingShipmentModeName) {
        await axiosInstance.put(`api/shipMode/mode?shipmentMode_id=${editingShipmentModeName.shipmentModeID}`, payload);
      } else {
        await axiosInstance.post('/api/shipMode/mode', payload);
      }

      getshipmentModeName();
      resetForm();
      setEditingShipmentModeName(null);
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating shipmentModeName:', error);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingShipmentModeName) {
      setUpdateDialogOpen(true);
    } else {
      handleUpdateConfirm(values, resetForm);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Shipment Mode</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingShipmentModeName ? editingShipmentModeName.id : 'new'}
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
                          Shipment Mode<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="shipmentModeName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="shipmentModeName" component="div" style={errorMessageStyle} />
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
                          {editingShipmentModeName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingShipmentModeName(null);
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
                <DialogContentText id="update-dialog-description">Are you sure you want to update this shipmentMode?</DialogContentText>
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
          }}
        rows={shipmentModeNameData}
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