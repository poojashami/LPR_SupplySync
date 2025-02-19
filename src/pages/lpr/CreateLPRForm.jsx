import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormValues } from '../../Redux/Slices/LprSlice';
import { ToastContainer, toast } from 'react-toastify';
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  MenuItem,
  InputAdornment,
  TableBody,
} from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SelectFieldPadding from 'components/selectFieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ItemForm from './ItemForm';
import ItemTable from './ItemTable';

const CreateLPRForm = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const [fileArray, setFileArray] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const formValues = useSelector((state) => state.lpr.formValues);
  const [errors, setErrors] = useState({});

  const VisuallyHiddenInput = styled('input')({
    display: 'none',
  });

  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    heading2: true,
    heading3: true,
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleFileChangeFile = (e) => {
    const files = e.target.files;
    setFileArray(files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormValues({ ...formValues, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.vertical) newErrors.vertical = 'Vertical is required';
    if (!formValues.company) newErrors.company = 'Company is required';
    if (!formValues.division) newErrors.division = 'Division is required';
    if (!formValues.lprCategory) newErrors.lprCategory = 'LPR Category is required';
    if (!formValues.deliveryTime) newErrors.deliveryTime = 'Delivery Time is required';
    if (!formValues.requestedByDept) newErrors.requestedByDept = 'Requested By Department is required';
    if (!formValues.requestedBy) newErrors.requestedBy = 'Requested By is required';
    if (!formValues.lprDate) newErrors.lprDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formValues);
      setFormValues({
        vertical: '',
        company: '',
        division: '',
        lprCategory: '',
        deliveryTime: '',
        requestedByDept: '',
        requestedBy: '',
        lprDate: '',
        additionalRemarks: '',
        noMinQuote: '',
        quotationEmailAlert: '',
        deliveryType: '',
      });
    }
  };

  const handleAddItems = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        vertical: formValues.vertical,
        company: formValues.company,
        division: formValues.division,
        lpr_category: formValues.lprCategory,
        delivery_time: formValues.deliveryTime,
        requested_dept: formValues.requestedByDept,
        requested_by: formValues.requestedBy,
        lpr_date: formValues.lprDate,
        additional_remarks: formValues.additionalRemarks,
        no_min_quote: formValues.noMinQuote,
        quotation_email_alert: formValues.quotationEmailAlert,
        delivery_type: formValues.deliveryType,
      };

      const response = await fetch('http://localhost:5000/api/create/lpr-master', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data posted successfully:', data);

      // Show success toast
      toast.success('LPR created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setShowItemForm(true);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);

      // Show error toast
      toast.error('Failed to create LPR. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <Box>
      <ToastContainer />
      {!showItemForm ? (
        <>
          <Table>{renderTableHeader('lprForm', 'Create LPR')}</Table>
          {showTableHeading.lprForm && (
            <Box padding={1}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      LPR Date<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="lprDate"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.lprDate}
                      onChange={handleChange}
                    />
                    {errors.lprDate && <div style={errorMessageStyle}>{errors.lprDate}</div>}
                  </Grid>

                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Vertical<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="vertical"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.vertical}
                      onChange={handleChange}
                    />
                    {errors.vertical && <div style={errorMessageStyle}>{errors.vertical}</div>}
                  </Grid>

                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Company<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="company"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.company}
                      onChange={handleChange}
                    />
                    {errors.company && <div style={errorMessageStyle}>{errors.company}</div>}
                  </Grid>

                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Division<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="division"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.division}
                      onChange={handleChange}
                    />
                    {errors.division && <div style={errorMessageStyle}>{errors.division}</div>}
                  </Grid>

                  <Grid item xs={6}>
                    <Table>
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Request Details
                      </Typography>
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    Req Dept<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="requestedByDept"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.requestedByDept}
                                    onChange={handleChange}
                                  />
                                  {errors.requestedByDept && <div style={errorMessageStyle}>{errors.requestedByDept}</div>}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    Req By<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="requestedBy"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.requestedBy}
                                    onChange={handleChange}
                                  />
                                  {errors.requestedBy && <div style={errorMessageStyle}>{errors.requestedBy}</div>}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    No. Min Quotation
                                    <ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="noMinQuote"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.noMinQuote}
                                    onChange={handleChange}
                                  />
                                  {errors.noMinQuote && <div style={errorMessageStyle}>{errors.noMinQuote}</div>}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    Quotations Email Alert
                                    <ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="quotationEmailAlert"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.quotationEmailAlert}
                                    onChange={handleChange}
                                  />
                                  {errors.quotationEmailAlert && <div style={errorMessageStyle}>{errors.quotationEmailAlert}</div>}
                                </Box>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Typography variant="body2">
                                Procurement Indent
                                <ValidationStar>*</ValidationStar>
                              </Typography>
                              <Box
                                sx={{
                                  p: 2,
                                  border: '1px dashed grey',
                                  borderRadius: '5px',
                                  height: '75px'
                                }}
                              >
                                <Button
                                  fullWidth
                                  component="label"
                                  variant="contained"
                                  sx={{
                                    marginBottom: '0',
                                    backgroundColor: '#2c6095',
                                    color: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#244b78'
                                    }
                                  }}
                                  startIcon={<CloudUploadIcon />}
                                >
                                  {fileArray?.length > 0
                                    ? `${fileArray?.length} ${fileArray?.length === 1 ? 'File' : 'Files'} uploaded`
                                    : 'Upload File'}
                                  <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChangeFile(e)} />
                                </Button>
                              </Box>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>

                  <Grid item xs={6}>
                    <Table>
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Shipment Details
                      </Typography>
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                  Delivery Type
                                  <ValidationStar>*</ValidationStar>
                                </Typography>
                                <SelectFieldPadding
                                  name="deliveryType"
                                  variant="outlined"
                                  value={formValues.deliveryType}
                                  onChange={handleChange}
                                  fullWidth
                                >
                                  <MenuItem value="EX Factory">EX Factory</MenuItem>
                                  <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
                                  <MenuItem value="Courier">Courier</MenuItem>
                                </SelectFieldPadding>

                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                  Delivery Time
                                  <ValidationStar>*</ValidationStar>
                                </Typography>
                                <FieldPadding
                                  name="deliveryTime"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={formValues.deliveryTime}
                                  onChange={handleChange}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end" sx={{ fontSize: '8px' }}>
                                        Days
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                {errors.deliveryTime && <div style={errorMessageStyle}>{errors.deliveryTime}</div>}
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2">LPR Category</Typography>
                                <SelectFieldPadding
                                  name="lprCategory"
                                  variant="outlined"
                                  value={formValues.lprCategory}
                                  onChange={handleChange}
                                  fullWidth
                                >
                                  <MenuItem value="EX Factory">EX Factory</MenuItem>
                                  <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
                                  <MenuItem value="Courier">Courier</MenuItem>
                                </SelectFieldPadding>
                              </Grid>

                              <Grid item xs={12} sm={8}>
                                <Typography variant="body2">Additional Remark</Typography>
                                <FieldPadding
                                  name="additionalRemarks"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={formValues.additionalRemarks}
                                  onChange={handleChange}
                                />
                                {errors.additionalRemarks && <div style={errorMessageStyle}>{errors.additionalRemarks}</div>}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size="small"
                    type="button"
                    onClick={handleAddItems}
                    sx={{
                      backgroundColor: '#2c6095',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#244b78'
                      }
                    }}
                  >
                    Add Items
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </>
      ) : (
        <>
          <ItemForm />
          <ItemTable />
        </>
      )}
    </Box>
  );
};

export default CreateLPRForm;