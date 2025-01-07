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
import { NoButton, YesButton } from 'components/DialogActionsButton';

export default function Role() {
  const navigate = useNavigate();
  const [roleNameData, setroleNameData] = useState([]);
  const [editingRoleName, setEditingRoleName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setroleToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getRoleName();
  }, []);
  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
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
    roleName: editingRoleName ? editingRoleName.name : '',
    status: editingRoleName ? (editingRoleName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    roleName: Yup.string().required('role is required'),
    status: Yup.string().required('Status is required')
  });
  const handleEdit = (roleName) => {
    setEditingRoleName(roleName);
  };

  const handleDeleteClick = (roleName) => {
    setroleToDelete(roleName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/role/delete?role_id=${roleToDelete.roleID}`);
      getRoleName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting roleName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setroleToDelete(null);
  };
  const getRoleName = async () => {
    try {
      const response = await axiosInstance.get('/api/role/list');
      const roleNameList = response.data.map((data, index) => ({
        id: index + 1,
        roleID: data.role_id,
        name: data.role_name,
        item_role_description: data.item_role_description,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setroleNameData(roleNameList);
    } catch (error) {
      console.error('Error fetching roleNames:', error);
    }
  };

  const handleUpdateConfirm = async (values, resetForm) => {
    const payload = {
      role_name: values.roleName,
      status: values.status
    };

    try {
      if (editingRoleName) {
        await axiosInstance.put(`/api/role/update?role_id=${editingRoleName.roleID}`, payload);
      } else {
        await axiosInstance.post('/api/role/create', payload);
      }

      getRoleName();
      resetForm();
      setEditingRoleName(null);
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating roleName:', error);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingRoleName) {
      setUpdateDialogOpen(true);
    } else {
      handleUpdateConfirm(values, resetForm);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Role</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingRoleName ? editingRoleName.id : 'new'}
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
                          Role<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="roleName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="roleName" component="div" style={errorMessageStyle} />
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
                          {editingRoleName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingRoleName(null);
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
                <DialogContentText id="update-dialog-description">Are you sure you want to update this role?</DialogContentText>
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
        rows={roleNameData}
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
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this role?</DialogContentText>
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
