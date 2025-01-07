// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Box,
  IconButton,
  Button,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import SelectFieldPadding from 'components/selectFieldPadding';
import FieldPadding from 'components/FieldPadding';
import CustomTypography from 'components/CustomTypography';

export default function CustomClearancePage({ onClose, onFormSubmit, formMode }) {
  const [showTableHeading, setShowTableHeading] = useState({
    basicInformation: true,
    forexTable: true,
    searchOption: true
  });
  const initialValues = {
    goods_examination_booking_dt: '',
    goods_examination_dont_dt: '',
    re_examination_required: '',
    re_examination_booking_dt: '',
    re_examination_done_dt: '',
    customs_release_received_on: '',
    customs_gate_release_rev_dt: '',
    custom_query: '',
    query_raised_on: '',
    query_raised_on_dt: '',
    exchange_con_rev: '',
    exchange_con_rev_dt: ''
  };

  const validationSchema = Yup.object({
    goods_examination_booking_dt: Yup.date().required('Goods Examination Booking Date is required').typeError('Invalid date'),
    goods_examination_dont_dt: Yup.date().required('Goods Examination Done Date is required').typeError('Invalid date'),
    re_examination_required: Yup.string().required('Re Examination Required is required'),
    re_examination_booking_dt: Yup.date().required('Re Examination Booking Date is required').typeError('Invalid date'),
    re_examination_done_dt: Yup.date().required('Re Examination Done Date is required').typeError('Invalid date'),
    customs_release_received_on: Yup.date().required('Customs Release Received On is required').typeError('Invalid date'),
    customs_gate_release_rev_dt: Yup.date().required('Customs Gate Release Received Date is required').typeError('Invalid date')
    // custom_query: Yup.string().required('Custom Query is required'),
    // query_raised_on: Yup.string().required('Query Raised On is required'),
    // query_raised_on_dt: Yup.date().required('Query Raised On Date is required').typeError('Invalid date'),
    // exchange_con_rev: Yup.string().required('Query Raised On is required'),
    // exchange_con_rev_dt: Yup.date().required('Query Raised On Date is required').typeError('Invalid date')
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <CustomTypography variant="h7" fontWeight={600}>
              {sectionLabel}
            </CustomTypography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const handleSubmit = (values, { resetForm }) => {
    console.log('Form Submitted with Values:', values);
    // Perform API call or further actions here
    resetForm(); // Reset form after submission if needed
  };
  const pfiData = [
    {
      goods_examination_booking_dt: '2024-12-01',
      goods_examination_done_dt: '2024-12-02',
      re_examination_required: 'Yes',
      re_examination_booking_dt: '2024-12-05',
      re_examination_done_dt: '2024-12-06',
      customs_release_received_on: '2024-12-07',
      customs_gate_release_rev_dt: '2024-12-08',
      custom_query: 'Yes',
      query_raised_on: 'Missing Documents',
      query_raised_on_dt: '2024-12-09'
    },
    {
      goods_examination_booking_dt: '2024-11-25',
      goods_examination_done_dt: '2024-11-26',
      re_examination_required: 'No',
      re_examination_booking_dt: 'N/A',
      re_examination_done_dt: 'N/A',
      customs_release_received_on: '2024-11-27',
      customs_gate_release_rev_dt: '2024-11-28',
      custom_query: 'No',
      query_raised_on: 'N/A',
      query_raised_on_dt: 'N/A'
    },
    {
      goods_examination_booking_dt: '2024-10-15',
      goods_examination_done_dt: '2024-10-16',
      re_examination_required: 'Yes',
      re_examination_booking_dt: '2024-10-18',
      re_examination_done_dt: '2024-10-19',
      customs_release_received_on: '2024-10-20',
      customs_gate_release_rev_dt: '2024-10-21',
      custom_query: 'Yes',
      query_raised_on: 'Incorrect Valuation',
      query_raised_on_dt: '2024-10-22'
    }
  ];

  const tableStyles = {
    border: '1px solid #ddd',
    fontSize: '12px',
    '& th, & td': {
      padding: '3px',
      border: '1px solid #ddd'
    }
  };
  const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    fontSize: '5px'
    // transform: 'scale(1.5)', // Adjust the scale for the desired size
    // margin: theme.spacing(0.5) // Optional margin adjustment
  }));

  return (
    <MainCard title={'Custom Clearance'}>
      <Table>
        {renderTableHeader('searchOption', 'Basic Information')}
        {showTableHeading.searchOption && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignor Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Consignee Info:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'12-03-2024'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Form M No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Indicorp'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Vendor Bank'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Advising Bank:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'Delhi'}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">LC No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'30000'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">LC Amount:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell>
              {/* <TableCell>
                <CustomTypography variant="subtitle1">Delivery Timeline:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
              </TableCell> */}
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, resetForm }) => (
          <Form>
            <Table>
              {renderTableHeader('basicInformation', 'Goods Examination Detail Form')}
              {showTableHeading.basicInformation && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Goods Examination Booking Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="goods_examination_booking_dt" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="goods_examination_booking_dt" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Goods Examination Done Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} name="goods_examination_dont_dt" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="goods_examination_dont_dt" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Re Examination Required<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={SelectFieldPadding}
                            name="re_examination_required"
                            variant="outlined"
                            value={values.re_examination_required}
                            fullWidth
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Field>
                          <ErrorMessage name="re_examination_required" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Re Examination Booking Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="re_examination_booking_dt" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="re_examination_booking_dt" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Re Examination Done Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="re_examination_done_dt" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="re_examination_done_dt" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Customs Release Received On<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={FieldPadding}
                            type="date"
                            name="customs_release_received_on"
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                          <ErrorMessage name="customs_release_received_on" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Customs Gate Release Received Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={FieldPadding}
                            type="date"
                            name="customs_gate_release_rev_dt"
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                          <ErrorMessage name="customs_gate_release_rev_dt" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Custom Query<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={SelectFieldPadding} name="custom_query" variant="outlined" value={values.custom_query} fullWidth>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Field>
                          {/* <ErrorMessage name="custom_query" component="div" style={errorMessageStyle} /> */}
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Query Raised On Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="query_raised_on_dt" variant="outlined" fullWidth size="small" />
                          {/* <ErrorMessage name="query_raised_on_dt" component="div" style={errorMessageStyle} /> */}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Exchange Controlled Received<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={SelectFieldPadding}
                            name="exchange_con_rev"
                            variant="outlined"
                            value={values.exchange_con_rev}
                            fullWidth
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Field>
                          {/* <ErrorMessage name="exchange_con_rev" component="div" style={errorMessageStyle} /> */}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Exchange Controlled Received Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="exchange_con_rev_dt" variant="outlined" fullWidth size="small" />
                          {/* <ErrorMessage name="exchange_con_rev_dt" component="div" style={errorMessageStyle} /> */}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Typography variant="h6" color={'darkblue'}>
                            <u>Select Type of Query</u>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControlLabel control={<StyledCheckbox color="primary" />} label="Low Value" labelPlacement="end" />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControlLabel control={<StyledCheckbox color="primary" />} label="Wrong HS Code" labelPlacement="end" />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControlLabel control={<StyledCheckbox color="primary" />} label="Capital Flight" labelPlacement="end" />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControlLabel control={<StyledCheckbox color="primary" />} label="Non Declared Item" labelPlacement="end" />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControlLabel control={<StyledCheckbox color="primary" />} label="Others" labelPlacement="end" />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => {
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Table sx={{ mt: 2 }}>
        {renderTableHeader('forexTable', 'Goods Examination Detail Table')}
        {showTableHeading.forexTable && (
          <Box sx={{ display: 'flex' }}>
            <Grid container>
              <Grid item xs={12}>
                <Table sx={tableStyles}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '10px' }}>Goods Examination Booking Dt</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Goods Examination Done Dt</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Re Examination Required</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Re Examination Booking Dt</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Re Examination Done Dt</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Customs Release Received On</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Customs Gate Release Received Dt</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Custom Query</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Query Raised On</TableCell>
                      <TableCell sx={{ fontSize: '10px' }}>Query Raised On Dt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pfiData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '10px' }}>{row.goods_examination_booking_dt}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.goods_examination_done_dt}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.re_examination_required}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.re_examination_booking_dt}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.re_examination_done_dt}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.customs_release_received_on}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.customs_gate_release_rev_dt}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.custom_query}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.query_raised_on}</TableCell>
                        <TableCell sx={{ fontSize: '10px' }}>{row.query_raised_on_dt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Box>
        )}
      </Table>
    </MainCard>
  );
}
