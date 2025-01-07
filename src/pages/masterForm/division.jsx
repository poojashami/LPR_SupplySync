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

export default function Division() {
  const navigate = useNavigate();
  const [divisionNameData, setdivisionNameData] = useState([]);
  const [editingdivisionName, setEditingdivisionName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [divisionToDelete, setdivisionToDelete] = useState(null);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getdivisionName();
  }, []);

  const handleEdit = (divisionName) => {
    setEditingdivisionName(divisionName);
  };

  const handleDeleteClick = (divisionName) => {
    setdivisionToDelete(divisionName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/division/delete?division_id=${divisionToDelete.divisionID}`);
      getdivisionName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting divisionName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setdivisionToDelete(null);
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
    divisionName: editingdivisionName ? editingdivisionName.name : '',
    status: editingdivisionName ? (editingdivisionName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    divisionName: Yup.string().required('divisionName is required'),
    status: Yup.string().required('Status is required')
  });

  const getdivisionName = async () => {
    try {
      const response = await axiosInstance.get('/api/division/divisions');
      const divisionNameList = response.data.map((divisionName, index) => ({
        id: index + 1,
        divisionID: divisionName.division_id,
        name: divisionName.division_name,
        status: divisionName.status == 1 ? 'Active' : 'Inactive',
        createdby: divisionName.created_by,
        updatedby: divisionName.updated_by
      }));
      setdivisionNameData(divisionNameList);
    } catch (error) {
      console.error('Error fetching divisionNames:', error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      division_name: values.divisionName,
      status: values.status
    };

    try {
      let response;
      if (editingdivisionName) {
        response = await axiosInstance.put(`/api/division/update?division_id=${editingdivisionName.divisionID}`, payload);
      } else {
        response = await axiosInstance.post('/api/division/division', payload);
      }

      getdivisionName();
      resetForm();
      setEditingdivisionName(null);
    } catch (error) {
      console.error('Error submitting divisionName:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Division</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingdivisionName ? editingdivisionName.id : 'new'}
      >
        {({ isSubmitting, resetForm }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Division Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="divisionName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="divisionName" component="div" style={errorMessageStyle} />
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
                          {editingdivisionName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingdivisionName(null);
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
        rows={divisionNameData}
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
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this division?</DialogContentText>
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
