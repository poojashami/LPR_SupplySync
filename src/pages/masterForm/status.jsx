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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import WarningIcon from '@mui/icons-material/Warning';

export default function StatusMaster() {
  const navigate = useNavigate();
  const [statusNameData, setStatusNameData] = useState([]);
  const [editingStatusName, setEditingStatusName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const initialValues = {
    module: editingStatusName ? editingStatusName.module : '',
    table_name: editingStatusName ? editingStatusName.table_name : '',
    field_name: editingStatusName ? editingStatusName.field_name : '',
    value: editingStatusName ? editingStatusName.value : '',
    description: editingStatusName ? editingStatusName.description : ''
  };
  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getshipmentModeName();
  }, []);

  const columns = [
    { field: 'id', headerName: 'S.No', width: 60 },
    { field: 'module', headerName: 'Module', width: 100 },
    { field: 'table_name', headerName: 'Table Name', width: 100 },
    { field: 'field_name', headerName: 'Field Name', width: 100 },
    { field: 'value', headerName: 'Value', width: 100 },
    { field: 'description', headerName: 'Description', width: 100 },
    { field: 'created_by', headerName: 'Created By', width: 100 },
    { field: 'updated_by', headerName: 'Updated By', width: 100 },
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

  const validationSchema = Yup.object({
    module: Yup.string().required('Module is required'),
    table_name: Yup.string().required('Table Name is required'),
    field_name: Yup.string().required('Field Name is required'),
    value: Yup.string().required('Value is required'),
    description: Yup.string().required('Description is required')
  });

  const handleEdit = (data) => {
    setEditingStatusName(data);
  };

  const handleDeleteClick = (shipmentModeName) => {
    setStatusToDelete(shipmentModeName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/status?status_id=${statusToDelete.status_id}`);
      getshipmentModeName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStatusToDelete(null);
  };

  const getshipmentModeName = async () => {
    try {
      const response = await axiosInstance.get('/api/status');
      const shipmentModeNameList = response.data.map((data, index) => ({
        id: index + 1,
        status_id: data.status_id,
        module: data.module,
        table_name: data.table_name,
        field_name: data.field_name,
        value: data.value,
        description: data.description,
        created_by: data.created_by,
        updated_by: data.updated_by
      }));
      setStatusNameData(shipmentModeNameList);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleUpdateConfirm = async (values, resetForm) => {
    const payload = {
      module: values.module,
      table_name: values.table_name,
      field_name: values.field_name,
      value: values.value,
      description: values.description
    };

    try {
      if (editingStatusName) {
        await axiosInstance.put(`api/status?status_id=${editingStatusName.status_id}`, payload);
      } else {
        await axiosInstance.post('/api/status', payload);
      }

      getshipmentModeName();
      resetForm();
      setEditingStatusName(null);
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingStatusName) {
      setUpdateDialogOpen(true);
    } else {
      handleUpdateConfirm(values, resetForm);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Status Master</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ resetForm, values }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Module<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="module" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="module" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Table Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="table_name" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="table_name" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Field Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="field_name" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="field_name" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Value<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="value" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="value" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Description<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="description" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="description" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, display: 'block', marginLeft: 'auto' }}>
                          {editingStatusName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingStatusName(null);
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
            <Dialog
              open={updateDialogOpen}
              onClose={() => setUpdateDialogOpen(false)}
              aria-labelledby="update-dialog-title"
              aria-describedby="update-dialog-description"
            >
              <DialogTitle
                id="update-dialog-title"
                style={{ backgroundColor: '#a1bcdb', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', fontSize: '15px' }}
              >
                <span style={{ fontWeight: '600' }}> Confirm Update</span>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="update-dialog-description" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                  <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} /> Are you sure you want to update this
                  <span style={{ color: 'black', fontWeight: 'bold' }}>
                    &nbsp;{editingStatusName ? editingStatusName.name : 'Group'}&nbsp;
                  </span>{' '}
                  ?
                </DialogContentText>
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

      <Box sx={{ height: 400, width: '100%', marginTop: '2rem' }}>
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
          }} rows={statusNameData} columns={columns} pageSize={5} />
      </Box>

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
          <span style={{ fontWeight: '600' }}>{'Confirm Deletion'}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} />
            Are you sure you want to delete this
            <span style={{ color: 'black', fontWeight: 'bold' }}>&nbsp;{statusToDelete ? statusToDelete.name : 'group'}</span>?
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
