import { Button, Box, TextField, Table, TableBody, TableCell, Grid, Typography, TableRow, Select, MenuItem } from '@mui/material';
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

export default function Currency() {
  const criaData = [
    { id: 1, name: 'Currency 1', status: 'Active', createdby: 'Raman', updatedby: 'Raghav' },
    { id: 2, name: 'Currency 2', status: 'Inactive', createdby: 'Raman', updatedby: 'Raghav' },
    { id: 3, name: 'Currency 3', status: 'Active', createdby: 'Raman', updatedby: 'Raghav' }
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        const color = status === 'Active' ? 'green' : 'red';

        return <Typography sx={{ color, fontWeight: 'bold' }}>{status}</Typography>;
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
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleEdit = (id) => {};

  const initialValues = {
    cria: '',
    status: ''
  };

  const validationSchema = Yup.object({
    cria: Yup.string().required('Cria is required'),
    status: Yup.string().required('Status is required')
  });

  const handleSubmit = (values, { resetForm }) => {
    // Handle form submission logic
    console.log(values);
    resetForm();
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Currency</span>
        </Box>
      }
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, resetForm }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Currency<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="cria" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="cria" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Status<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={SelectFieldPadding} name="status" variant="outlined" fullWidth>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Field>
                        <ErrorMessage name="status" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button type="submit" variant="contained" color="primary">
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button variant="outlined" color="secondary" onClick={() => resetForm()}>
                          Cancel
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
        rows={criaData}
        columns={columns}
        components={{
          Pagination: () => null // Hide pagination controls and text
        }}
        pagination={false} // Ensure pagination is disabled
      />
    </MainCard>
  );
}
