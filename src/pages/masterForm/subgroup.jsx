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

export default function SubGroup() {
  const navigate = useNavigate();
  const [groupNameData, setGroupNameData] = useState([]);
  const [subGroupData, setSubGroupData] = useState([]);
  const [editingGroupName, setEditingGroupName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setgroupToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };
  useEffect(() => {
    getSubGroup();
    getgroupName();
  }, []);

  const columns = [
    { field: 'subGroupName', headerName: 'Name', width: 150 },
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
    groupName: editingGroupName ? editingGroupName.groupName : '',
    subGroupName: editingGroupName ? editingGroupName.subGroupName : '',
    status: editingGroupName ? (editingGroupName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    groupName: Yup.string().required('Group is required'),
    subGroupName: Yup.string().required('Sub Group is required'),
    status: Yup.string().required('Status is required')
  });
  const handleEdit = (groupName) => {
    const selectedGroup = groupNameData.find((group) => group.groupID === groupName.item_parent_group_id);
    setEditingGroupName({ ...groupName, groupName: selectedGroup ? selectedGroup.groupID : '' });
  };

  const handleDeleteClick = (groupName) => {
    setgroupToDelete(groupName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/itemgroup/subgroup/delete?item_sub_group_id=${groupToDelete.groupID}`);
      getSubGroup();
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
      const newData = response.data.map((data) => ({
        gpName: data.item_group_name,
        groupID: data.item_group_id
      }));
      console.log('groupNameData', response);

      setGroupNameData(newData);
    } catch (error) {
      console.error('Error fetching groupNames:', error);
    }
  };
  const getSubGroup = async () => {
    try {
      const response = await axiosInstance.get('/api/itemgroup/subgroup/list');
      console.log('subgroup', response);
      const subGroupNameList = response.data.map((data, index) => ({
        id: index + 1,
        groupID: data.item_sub_group_id,
        subGroupName: data.item_sub_group_name,
        item_sub_group_description: data.item_sub_group_description,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setSubGroupData(subGroupNameList);
    } catch (error) {
      console.error('Error fetching groupNames:', error);
    }
  };
  const handleUpdateConfirm = async (values, resetForm) => {
    const selectedGroup = groupNameData.find((group) => group.groupID === values.groupName);
    const payload = {
      item_group_name: values.groupName,
      item_sub_group_name: values.subGroupName,
      item_parent_group_id: selectedGroup.groupID, // Use the groupID as item_parent_group_id
      status: values.status
    };

    try {
      if (editingGroupName) {
        await axiosInstance.put(`/api/itemgroup/subgroup/update?item_sub_group_id=${editingGroupName.groupID}`, payload);
      } else {
        await axiosInstance.post('/api/itemgroup/subgroup/create', payload);
      }

      getSubGroup();
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

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Sub Group</span>
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
                        <Field as={SelectFieldPadding} name="groupName" variant="outlined" value={values.groupName} fullWidth>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {groupNameData.map((data, index) => (
                            <MenuItem key={index} value={data.groupID}>
                              {data.gpName}
                            </MenuItem>
                          ))}
                        </Field>
                        <ErrorMessage name="groupName" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Sub Group<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="subGroupName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="subGroupName" component="div" style={errorMessageStyle} />
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
              <DialogTitle id="update-dialog-title">Confirm Update</DialogTitle>
              <DialogContent>
                <DialogContentText id="update-dialog-description">Are you sure you want to update this group?</DialogContentText>
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
        rows={subGroupData}
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
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this group?</DialogContentText>
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
