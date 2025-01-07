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
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { NoButton, YesButton } from 'components/DialogActionsButton';

export default function Group() {
  const navigate = useNavigate();
  const [groupNameData, setgroupNameData] = useState([]);
  const [editingGroupName, setEditingGroupName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setgroupToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getgroupName();
  }, []);

  const handleEdit = (groupName) => {
    setEditingGroupName(groupName);
  };

  const handleDeleteClick = (groupName) => {
    setgroupToDelete(groupName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/itemgroup/delete?item_group_id=${groupToDelete.groupID}`);
      getgroupName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting groupName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setgroupToDelete(null);
  };
  const getgroupName = async () => {
    try {
      const response = await axiosInstance.get('/api/itemgroup/list');
      const groupNameList = response.data.map((data, index) => ({
        id: index + 1,
        groupID: data.item_group_id,
        name: data.item_group_name,
        item_group_description: data.item_group_description,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setgroupNameData(groupNameList);
    } catch (error) {
      console.error('Error fetching groupNames:', error);
    }
  };

  const handleUpdateConfirm = async (values, resetForm) => {
    const payload = {
      item_group_name: values.groupName,
      status: values.status
    };

    try {
      if (editingGroupName) {
        await axiosInstance.put(`/api/itemgroup/update?item_group_id=${editingGroupName.groupID}`, payload);
      } else {
        await axiosInstance.post('/api/itemgroup/create', payload);
      }

      getgroupName();
      resetForm();
      setEditingGroupName(null);
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating groupName:', error);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingGroupName) {
      setUpdateDialogOpen(true);
    } else {
      handleUpdateConfirm(values, resetForm);
    }
  };

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
    groupName: editingGroupName ? editingGroupName.name : '',
    status: editingGroupName ? (editingGroupName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    groupName: Yup.string().required('Group is required'),
    status: Yup.string().required('Status is required')
  });

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Group</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingGroupName ? editingGroupName.id : 'new'}
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
                          Group<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="groupName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="groupName" component="div" style={errorMessageStyle} />
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
                          {editingGroupName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingGroupName(null);
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
                    &nbsp;{editingGroupName ? editingGroupName.name : 'Group'}&nbsp;
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
        rows={groupNameData}
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
          <span style={{ fontWeight: '600' }}>{'Confirm Deletion'}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} />
            Are you sure you want to delete this
            <span style={{ color: 'black', fontWeight: 'bold' }}>&nbsp;{groupToDelete ? groupToDelete.name : 'group'}</span>?
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
