import {
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  Grid,
  Typography,
  TableRow,
  Select,
  MenuItem,
  useMediaQuery
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

export default function Nafdac() {
  const navigate = useNavigate();

  const nafdacData = [
    { id: 1, name: 'Nafdac 1', status: 'Active', createdby: 'Raman', updatedby: 'Raghav' },
    { id: 2, name: 'Nafdac 2', status: 'Inactive', createdby: 'Raman', updatedby: 'Raghav' },
    { id: 3, name: 'Nafdac 3', status: 'Active', createdby: 'Raman', updatedby: 'Raghav' }
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
    certificateName: '',
    dateFrom: '',
    dateTo: '',
    document: null
  };

  const validationSchema = Yup.object({
    certificateName: Yup.string().required('Certificate is required'),
    dateFrom: Yup.date().required('Date From is required').nullable(),
    dateTo: Yup.date().required('Date To is required').min(Yup.ref('dateFrom'), 'Date To cannot be earlier than Date From').nullable(),
    document: Yup.mixed()
      .required('Document is required')
      .test('fileSize', 'File is too large', (value) => {
        // Check if file is selected and validate size if needed
        return !value || (value && value.size <= 5 * 1024 * 1024); // Example size limit: 5MB
      })
  });
  const handleBackClick = () => {
    navigate('/mastertab');
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>NAFDAC</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body1" component="div">
            <strong>Item Name</strong>: <span>Example Item</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body1" component="div">
            <strong>Item Code</strong>: <span>EX123</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body1" component="div">
            <strong>Item Type</strong>: <span>Example Type</span>
          </Typography>
        </Grid>
      </Grid>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          // Handle form submission logic
          console.log(values);
          resetForm();
        }}
      >
        {({ setFieldValue, errors, touched, isSubmitting, resetForm }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Name<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="certificateName" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="certificateName" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          From<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field
                          as={FieldPadding}
                          name="dateFrom"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          fullWidth
                        />
                        <ErrorMessage name="dateFrom" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          To<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field
                          as={FieldPadding}
                          name="dateTo"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          fullWidth
                        />
                        <ErrorMessage name="dateTo" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Upload Document<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button variant="contained" component="label">
                          Upload Doc
                          <input
                            type="file"
                            name="document"
                            hidden
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              setFieldValue('document', file);
                            }}
                          />
                        </Button>
                        {errors.document && touched.document ? <div style={errorMessageStyle}>{errors.document}</div> : null}
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" sx={{ padding: 1 }}>
                      <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                          Submit
                        </Button>
                      </Grid>
                      <Grid item sx={{ marginLeft: '10px' }}>
                        <Button variant="outlined" color="secondary" onClick={() => resetForm()}>
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={1}></Grid>
                    <Grid item xs={12} sm={1}></Grid>
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
        rows={nafdacData}
        columns={columns}
        components={{
          Pagination: () => null // Hide pagination controls and text
        }}
        pagination={false} // Ensure pagination is disabled
      />
    </MainCard>
  );
}
