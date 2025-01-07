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
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import CI_Data from 'components/BasicDataComponent/CI_data';

export default function CustomClearance({ onClose, CustomClearanceData }) {
  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);
  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = CustomClearanceData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
    let Freigth = data?.filter((i) => i.charge_name == 'total_freight_charges');
    setFreightAdditionalCost(Freigth[0]?.charge_amount);
    let fob = data?.reduce((acc, total) => {
      return total.heading === 'FOB' ? (acc = acc + Number(total.charge_amount)) : (acc += 0);
    }, 0);
    setFobAdditionalCost(fob);
    let Inland = data?.reduce((acc, total) => {
      return total.heading === 'Inland_Charges' ? (acc = acc + Number(total.charge_amount)) : (acc += 0);
    }, 0);
    setInlandCost(Inland);

    if (CustomClearanceData?.add_shippment_containers?.length > 0) {
      let totalContainer = CustomClearanceData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = CustomClearanceData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = CustomClearanceData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (CustomClearanceData?.shipment_advise_items?.length > 0) {
      let totalPackage = CustomClearanceData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [CustomClearanceData]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicInformation: true,
    forexTable: true,
    searchOption: true
  });
  const initialValues = CustomClearanceData?.custom_clearance?.re_examination_required
    ? {
        goods_examination_booking_dt: CustomClearanceData?.custom_clearance?.goods_examination_booking_dt,
        goods_examination_dont_dt: CustomClearanceData?.custom_clearance?.goods_examination_dont_dt,
        re_examination_required: CustomClearanceData?.custom_clearance?.re_examination_required,
        re_examination_booking_dt: CustomClearanceData?.custom_clearance?.re_examination_booking_dt,
        re_examination_done_dt: CustomClearanceData?.custom_clearance?.re_examination_done_dt,
        customs_release_received_on: CustomClearanceData?.custom_clearance?.customs_release_received_on,
        customs_gate_release_rev_dt: CustomClearanceData?.custom_clearance?.customs_gate_release_rev_dt,
        custom_query: CustomClearanceData?.custom_clearance?.custom_query,
        query_raised_on_dt: CustomClearanceData?.custom_clearance?.query_raised_on_dt,
        query_types: {
          low_value: false,
          wrong_hs_code: false,
          capital_flight: false,
          non_declared_item: false,
          others: false
        },
        query_resolved_on_dt: CustomClearanceData?.custom_clearance?.query_resolved_on_dt,
        exchange_con_rev: CustomClearanceData?.custom_clearance?.exchange_con_rev,
        exchange_con_rev_dt: CustomClearanceData?.custom_clearance?.exchange_con_rev_dt
      }
    : {
        // Goods Examination Dates
        goods_examination_booking_dt: null,
        goods_examination_dont_dt: null,

        // Re-Examination Required and Dates (conditionally rendered)
        re_examination_required: 'No', // Default to "No"
        re_examination_booking_dt: null,
        re_examination_done_dt: null,

        // Customs Release Dates
        customs_release_received_on: null,
        customs_gate_release_rev_dt: null,

        // Custom Query
        custom_query: 'No', // Default to "No"
        query_raised_on_dt: null,

        // Type of Query (checkboxes)
        query_types: {
          low_value: false,
          wrong_hs_code: false,
          capital_flight: false,
          non_declared_item: false,
          others: false
        },

        // Query Resolved Date
        query_resolved_on_dt: null,

        // Exchange Controlled Received
        exchange_con_rev: 'No', // Default to "No"
        exchange_con_rev_dt: null
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

  const handleSubmit = async (values, { resetForm }) => {
    const selectedQueries = Object.entries(values.query_types)
      .filter(([key, value]) => value === true) // Filter by the value being true
      .map(([key]) => key) // Extract the keys
      .join(', '); // Join the keys with a comma and space

    // Convert the keys to a more readable format (e.g., "low_value" to "Low Value")
    let arr = selectedQueries.split(', '); // Split the string into an array
    let updatedArr = arr.map(
      (item) =>
        item
          .split('_') // Split by underscore
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(' ') // Join the words back with a space
    );

    let updatedStr = updatedArr.join(', ');

    let SendData = CustomClearanceData?.custom_clearance?.custom_clearance_id
      ? {
          custom_clearance_id: CustomClearanceData?.custom_clearance?.custom_clearance_id,
          ci_id: CustomClearanceData.ci_id,
          pfi_id: CustomClearanceData.pfi_id,
          pfi_no: CustomClearanceData.pfi_num,
          ci_num: CustomClearanceData.ci_num,
          ...values,
          updatedStr
        }
      : {
          ci_id: CustomClearanceData.ci_id,
          pfi_id: CustomClearanceData.pfi_id,
          pfi_no: CustomClearanceData.pfi_num,
          ci_num: CustomClearanceData.ci_num,
          ...values,
          updatedStr
        };
    console.log('Form Submitted with Values:', SendData);
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/custom/clearance', SendData);
      console.log('Successfully:', data);
      toast.success('Successfully');
      // onclose();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
      toast.error('Error in Updated');
    }
  };

  const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    fontSize: '5px'
  }));

  return (
    <>
      <CI_Data ci_id={CustomClearanceData?.ci_id} />
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
                        {/* Examination Booking Date */}
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Goods Examination Booking Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field
                            as={FieldPadding}
                            type="date"
                            name="goods_examination_booking_dt"
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                          <ErrorMessage name="goods_examination_booking_dt" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Examination Done Date */}
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Goods Examination Done Dt<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="goods_examination_dont_dt" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="goods_examination_dont_dt" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Re-Examination Required */}
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

                        {/* Re-Examination Dates */}
                        {values.re_examination_required === 'Yes' && (
                          <>
                            <Grid item xs={12} sm={3}>
                              <CustomTypography>
                                Re Examination Booking Dt<ValidationStar>*</ValidationStar>
                              </CustomTypography>
                              <Field
                                as={FieldPadding}
                                type="date"
                                name="re_examination_booking_dt"
                                variant="outlined"
                                fullWidth
                                size="small"
                              />
                              <ErrorMessage name="re_examination_booking_dt" component="div" style={errorMessageStyle} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <CustomTypography>
                                Re Examination Done Dt<ValidationStar>*</ValidationStar>
                              </CustomTypography>
                              <Field
                                as={FieldPadding}
                                type="date"
                                name="re_examination_done_dt"
                                variant="outlined"
                                fullWidth
                                size="small"
                              />
                              <ErrorMessage name="re_examination_done_dt" component="div" style={errorMessageStyle} />
                            </Grid>
                          </>
                        )}

                        {/* Customs Release Received On */}
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

                        {/* Customs Gate Release Received Dt */}
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

                        {/* Custom Query */}
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

                        {/* Query Raised On Dt */}
                        {values.custom_query === 'Yes' && (
                          <Grid item xs={12} sm={3}>
                            <CustomTypography>
                              Query Raised On Dt<ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <Field as={FieldPadding} type="date" name="query_raised_on_dt" variant="outlined" fullWidth size="small" />
                            {/* <ErrorMessage name="query_raised_on_dt" component="div" style={errorMessageStyle} /> */}
                          </Grid>
                        )}

                        {/* Query Type Selection */}
                        {values.custom_query === 'Yes' && (
                          <Grid item xs={12} sm={12}>
                            <Typography variant="h6" color={'darkblue'}>
                              Select Type of Query
                            </Typography>
                            <Grid container spacing={1}>
                              {['Low Value', 'Wrong HS Code', 'Capital Flight', 'Non Declared Item', 'Others'].map((label, index) => {
                                const fieldName = label.toLowerCase().replace(/ /g, '_'); // Low Value -> low_value

                                return (
                                  <Grid item xs={12} sm={2} key={index}>
                                    <FormControlLabel
                                      control={
                                        <Field as={StyledCheckbox} name={`query_types.${fieldName}`} type="checkbox" color="primary" />
                                      }
                                      label={label}
                                      labelPlacement="end"
                                    />
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Grid>
                        )}

                        {/* Query Resolved On */}
                        <Grid item xs={12} sm={3}>
                          <CustomTypography>
                            Query Resolved On<ValidationStar>*</ValidationStar>
                          </CustomTypography>
                          <Field as={FieldPadding} type="date" name="query_resolved_on_dt" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="query_resolved_on_dt" component="div" style={errorMessageStyle} />
                        </Grid>

                        {/* Exchange Controlled Received */}
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

                        {/* Exchange Controlled Received Date */}
                        {values.exchange_con_rev === 'Yes' && (
                          <Grid item xs={12} sm={3}>
                            <CustomTypography>
                              Exchange Controlled Received Dt<ValidationStar>*</ValidationStar>
                            </CustomTypography>
                            <Field as={FieldPadding} type="date" name="exchange_con_rev_dt" variant="outlined" fullWidth size="small" />
                            {/* <ErrorMessage name="exchange_con_rev_dt" component="div" style={errorMessageStyle} /> */}
                          </Grid>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
