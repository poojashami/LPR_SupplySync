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
  DialogTitle
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
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { useEffect, useState } from 'react';
import { NoButton, YesButton } from 'components/DialogActionsButton';
import WarningIcon from '@mui/icons-material/Warning';

export default function Branch() {
  const navigate = useNavigate();
  const [branchNameData, setbranchNameData] = useState([]);
  const [editingBranchName, setEditingBranchName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getbranchName();
  }, []);

  const handleEdit = (branchName) => {
    setEditingBranchName(branchName);
  };

  const handleDeleteClick = (branchName) => {
    setBranchToDelete(branchName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/branch/branch?branch_id=${branchToDelete.branchID}`);
      getbranchName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting branchName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBranchToDelete(null);
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
    branchName: editingBranchName ? editingBranchName.name : '',
    status: editingBranchName ? (editingBranchName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    branchName: Yup.string().required('branchName is required'),
    status: Yup.string().required('Status is required')
  });

  const getbranchName = async () => {
    try {
      const response = await axiosInstance.get('/api/branch/branches');
      const branchNameList = response.data.map((branchName, index) => ({
        id: index + 1,
        branchID: branchName.branch_id,
        name: branchName.branch_name,
        status: branchName.status == 1 ? 'Active' : 'Inactive',
        createdby: branchName.created_by,
        updatedby: branchName.updated_by
      }));
      setbranchNameData(branchNameList);
    } catch (error) {
      console.error('Error fetching branchNames:', error);
    }
  };

  const handleUpdateConfirm = async (values, resetForm) => {
    const payload = {
      branch_name: values.branchName,
      status: values.status
    };

    try {
      if (editingBranchName) {
        await axiosInstance.put(`/api/branch/branch?branch_id=${editingBranchName.branchID}`, payload);
      } else {
        await axiosInstance.post('/api/branch/branch', payload);
      }
      getbranchName();
      resetForm();
      setEditingBranchName(null);
      setUpdateDialogOpen(false); // Close the modal after update
    } catch (error) {
      console.error('Error submitting branchName:', error);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingBranchName) {
      setUpdateDialogOpen(true);
    } else {
      handleUpdateConfirm(values, resetForm);
    }
  };
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Branch</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting, resetForm, values }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Branch Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="branchName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="branchName" component="div" style={errorMessageStyle} />
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
                          {editingBranchName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingBranchName(null);
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
                    &nbsp;{editingBranchName ? editingBranchName.name : 'Branch'}&nbsp;
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
        rows={branchNameData}
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
            <span style={{ color: 'black', fontWeight: 'bold' }}>&nbsp;{branchToDelete ? branchToDelete.name : 'Branch'}</span>?
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
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this branch?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <NoButton onClick={handleDeleteCancel}>
            <span>No</span>
          </NoButton>
          <YesButton onClick={handleDeleteConfirm}>
            <span>Yes</span>
          </YesButton>
        </DialogActions>
      </Dialog> */}
    </MainCard>
  );
}
