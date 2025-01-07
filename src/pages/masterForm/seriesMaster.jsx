import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, Grid, TableRow, MenuItem } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';

export default function SeriesMaster() {
  const navigate = useNavigate();
  const [seriesData, setSeriesData] = useState([]);

  const handleBackClick = () => {
    navigate('/mastertab');
  };

  useEffect(() => {
    getgroupName();
  }, []);
  const columns = [
    { field: 'docType', headerName: 'Name', width: 150 },
    { field: 'prefix', headerName: 'Prefix', width: 150 },
    { field: 'range_start', headerName: 'Range Start', width: 150 },
    { field: 'range_end', headerName: 'Range End', width: 150 },
    { field: 'suffix', headerName: 'Suffix', width: 150 },
    { field: 'format', headerName: 'Format', width: 150 },
    { field: 'createdby', headerName: 'Created By', width: 150 },
    { field: 'updatedby', headerName: 'Updated By', width: 150 }
  ];

  const initialValues = {
    docType: '',
    prefix: '',
    range_start: '',
    range_end: '',
    suffix: '',
    format: 'I',
    validity: ''
  };

  const validationSchema = Yup.object({
    docType: Yup.string().required('Document Type is required'),
    prefix: Yup.string().required('Prefix is required'),
    range_start: Yup.string().required('Range Start is required'),
    range_end: Yup.string().required('Range End is required'),
    suffix: Yup.string().required('Suffix is required'),
    format: Yup.string().required('Format is required'),
    validity: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Validity must be in the format YYYY-MM-DD')
    // .required('Validity is required')
  });

  const getgroupName = async () => {
    try {
      const response = await axiosInstance.get('/api/series');
      const groupNameList = response.data.map((data, index) => ({
        id: index + 1,
        series_id: data.series_id,
        docType: data.doc_code,
        prefix: data.prefix,
        range_start: data.range_start,
        range_end: data.range_end,
        suffix: data.suffix,
        format: data.int_ext,
        createdby: data.created_by,
        updatedby: data.updated_by
      }));
      setSeriesData(groupNameList);
    } catch (error) {
      console.error('Error fetching groupNames:', error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      series_id: 11,
      doc_code: values.docType,
      prefix: values.prefix,
      range_start: values.range_start,
      range_end: values.range_end,
      suffix: values.suffix,
      additional: values.remark,
      int_ext: values.format,
      current_num: '101',
      series_status: '1',
      validity: values.validity,
      created_on: new Date().toISOString(),
      created_by: new Date().toISOString(),
      updated_on: null,
      updated_by: null
    };

    try {
      await axiosInstance.post('/api/series', payload);
      getgroupName();
      resetForm();
    } catch (error) {
      console.error('Error updating series:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Master Series</span>
          <PlusButton label="Back" onClick={handleBackClick} />
        </Box>
      }
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, resetForm, values }) => (
          <Form>
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Doc Type <ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="docType" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="docType" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Prefix<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="prefix" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="prefix" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Range Start<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="range_start" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="range_start" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Range End<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="range_end" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="range_end" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Suffix<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="suffix" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="suffix" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Format<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={SelectFieldPadding} name="format" variant="outlined" fullWidth>
                          <MenuItem value="I">Internal</MenuItem>
                          <MenuItem value="E">External</MenuItem>
                        </Field>
                        <ErrorMessage name="format" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Validity
                          <br />
                          <span style={{ fontSize: '9px' }}>(YYYY-MM-DD)</span>
                          <ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="validity" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="validity" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">Remark</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Field as={FieldPadding} name="remark" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="remark" component="div" style={errorMessageStyle} />
                      </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="end" alignItems="center" marginTop="15px">
                      <Grid item xs={12} sm={1}>
                        <Button type="submit" variant="contained" color="primary">
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={1} marginLeft="10px">
                        <Button variant="outlined" color="secondary" onClick={() => resetForm()}>
                          Cancel
                        </Button>
                      </Grid>
                    </Box>
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
        rows={seriesData}
        columns={columns}
        pagination={false}
        pageSize={seriesData.length}
        components={{
          Pagination: () => null
        }}
      />
    </MainCard>
  );
}
