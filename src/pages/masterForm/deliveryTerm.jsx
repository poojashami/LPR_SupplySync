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

export default function DeliveryTerm() {
  const navigate = useNavigate();
  const [deliveryTermNameData, setdeliveryTermNameData] = useState([]);
  const [editingdeliveryTermName, setEditingdeliveryTermName] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deliveryTermToDelete, setdeliveryTermToDelete] = useState(null);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getdeliveryTermName();
  }, []);

  const handleEdit = (deliveryTermName) => {
    setEditingdeliveryTermName(deliveryTermName);
  };

  const handleDeleteClick = (deliveryTermName) => {
    setdeliveryTermToDelete(deliveryTermName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/delivery/terms?delivery_terms_id=${deliveryTermToDelete.deliveryTermID}`);
      getdeliveryTermName();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting deliveryTermName:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setdeliveryTermToDelete(null);
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
    deliveryTermName: editingdeliveryTermName ? editingdeliveryTermName.name : '',
    status: editingdeliveryTermName ? (editingdeliveryTermName.status === 'Active' ? '1' : '2') : '1'
  };

  const validationSchema = Yup.object({
    deliveryTermName: Yup.string().required('deliveryTermName is required'),
    status: Yup.string().required('Status is required')
  });

  const getdeliveryTermName = async () => {
    try {
      const response = await axiosInstance.get('/api/delivery/terms');
      const deliveryTermNameList = response.data.map((data, index) => ({
        id: index + 1,
        deliveryTermID: data.delivery_terms_id,
        name: data.delivery_terms_name,
        status: data.status == 1 ? 'Active' : 'Inactive',
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setdeliveryTermNameData(deliveryTermNameList);
    } catch (error) {
      console.error('Error fetching deliveryTermNames:', error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      delivery_terms_name: values.deliveryTermName,
      status: values.status
    };

    try {
      let response;
      if (editingdeliveryTermName) {
        response = await axiosInstance.put(`/api/delivery/terms?delivery_terms_id=${editingdeliveryTermName.deliveryTermID}`, payload);
      } else {
        response = await axiosInstance.post('/api/delivery/terms', payload);
      }

      getdeliveryTermName();
      resetForm();
      setEditingdeliveryTermName(null);
    } catch (error) {
      console.error('Error submitting deliveryTermName:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Delivery Terms</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        key={editingdeliveryTermName ? editingdeliveryTermName.id : 'new'}
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
                          Delivery Term Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="deliveryTermName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="deliveryTermName" component="div" style={errorMessageStyle} />
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
                          {editingdeliveryTermName ? 'Update' : 'Submit'}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm();
                            setEditingdeliveryTermName(null);
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
        rows={deliveryTermNameData}
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
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this deliveryTerm?</DialogContentText>
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
