import {
  Box,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  TextField,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  TableContainer
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { FormControl } from '@mui/base';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from 'utils/axiosInstance';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';

const LcPfi = ({ lcData, bankList, onclose }) => {
  return (
    <div>
      <Pfi_Data pfi_id={lcData?.pfi_id} />
      <LcForm lcData={lcData} bankList={bankList} onclose={onclose} />
    </div>
  );
};

export default LcPfi;

const LcForm = ({ lcData, bankList, onclose }) => {
  console.log('lcData', lcData);
  const [showTableBodies, setShowTableBodies] = useState({
    viewPaymentDetails: true,
    paymentForm: true
  });
  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const [formValues, setFormValues] = useState(
    lcData?.lc
      ? {
          application_date: lcData?.lc?.application_date || dayjs(),
          lc_id: lcData?.lc?.letter_of_credit_id,
          lc_type: lcData?.lc?.lc_type,
          lc_amount: lcData?.lc?.lc_amount,
          latest_shipment_date: lcData?.lc?.latest_shipment_date || dayjs(),
          lc_expiry_date: lcData?.lc?.lc_expiry_date || dayjs(),
          lc_toleranceL: lcData?.lc?.lc_toleranceL,
          tolerance_value: lcData?.lc?.tolerance_value,
          payment_term: lcData?.lc?.payment_term,
          tenor_days: 0,
          off_shore_charges_borne_by: lcData?.lc?.off_shore_charges_borne_by,
          confirmation_charges: lcData?.lc?.confirmation_charges,
          confirm_bank_name: lcData?.lc?.confirm_bank_name,
          confirm_bank_swift_code: lcData?.lc?.confirm_bank_swift_code,
          lc_advising_bank_name: lcData?.lc?.lc_advising_bank_name,
          lc_advising_bank_code: lcData?.lc?.lc_advising_bank_code,
          lc_number: lcData?.lc?.lc_number,
          lc_issue_date: lcData?.lc?.lc_issue_date || dayjs(),
          lc_status: lcData?.lc?.lc_status
        }
      : {
          application_date: lcData?.lc?.application_date || dayjs(),
          lc_type: '',
          lc_amount: '',
          latest_shipment_date: dayjs(),
          lc_expiry_date: dayjs(),
          lc_toleranceL: '',
          tolerance_value: '',
          payment_term: '',
          tenor_days: 0,
          off_shore_charges_borne_by: '',
          confirmation_charges: '',
          confirm_bank_name: '',
          confirm_bank_swift_code: '',
          lc_advising_bank_name: '',
          lc_advising_bank_code: '',
          lc_number: '',
          lc_issue_date: dayjs(),
          lc_status: 0
        }
  );
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files;
    Object.values(selectedFile).forEach((file) => {
      if (file && file.type === 'application/pdf') {
        setFile(Object.values(selectedFile));
      } else {
        alert('Please select a PDF file.');
      }
    });
  };
  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] && key !== 'file') {
        formData.append(key, formValues[key]);
      }
    });

    if (file && file.length > 0) {
      file.forEach((fileItem, index) => {
        formData.append(`file[${index}]`, fileItem);
      });
    }
    const { data } = await axiosInstance.post('/api/lc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    onclose();
    toast.success(data?.message);
    console.log(data);
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton aria-label="expand row" size="small" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableBodies[sectionName] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const handleToleranceChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (value === 'no') {
      setFormValues((prevState) => ({
        ...prevState,
        tolerance_value: ''
      }));
    }
  };
  return (
    <TableContainer>
      <Table>{renderTableHeader('viewPaymentDetails', 'Create LC')}</Table>
      {showTableBodies.viewPaymentDetails && (
        <Box component="form" paddingLeft={1} onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={2}>
              <Typography variant="body1">LC Application Date:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                value={dayjs(formValues.application_date)}
                onChange={(date) => setFormValues({ ...formValues, ['application_date']: date })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">LC Type:</Typography>
              <FormControl component="fieldset">
                <RadioGroup aria-label="lc-type" name="lc_type" value={formValues.lc_type} row onChange={handleChange}>
                  <FormControlLabel value="ulc" control={<Radio />} label="ULC" />
                  <FormControlLabel value="clc" control={<Radio />} label="CLC" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">LC Amount:</Typography>
              <TextField
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="lc_amount"
                value={formValues?.lc_amount}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Latest Dt of Shipment:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                name="latest_shipment_date"
                value={dayjs(formValues.latest_shipment_date)}
                onChange={(date) => setFormValues({ ...formValues, ['latest_shipment_date']: date })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">LC Expiry Dt:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                name="lc_expiry_date"
                value={dayjs(formValues.lc_expiry_date)}
                onChange={(date) => setFormValues({ ...formValues, ['lc_expiry_date']: date })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Tolerance</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="lc_toleranceL"
                  name="lc_toleranceL"
                  value={formValues.lc_toleranceL}
                  row
                  onChange={handleToleranceChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="YES" />
                  <FormControlLabel value="no" control={<Radio />} label="NO" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {formValues.lc_toleranceL === 'yes' && (
              <Grid item xs={2}>
                <Typography variant="body1">Tolerance %</Typography>
                <TextField
                  name="tolerance_value"
                  type="number"
                  value={formValues.tolerance_value}
                  onChange={handleChange}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            )}
            <Grid item xs={3}>
              <Typography variant="body1">Payment Term</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="payment_term"
                  name="payment_term"
                  value={formValues.payment_term}
                  row
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                >
                  <FormControlLabel value="at_sight" control={<Radio />} label="At Sight" />
                  <FormControlLabel value="deferred" control={<Radio />} label="Deferred" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {formValues.payment_term === 'deferred' && (
              <Grid item xs={2}>
                <Typography variant="body1">Tenor Days</Typography>
                <TextField
                  name="tenor_days"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  id="tenor-days"
                  variant="outlined"
                  value={formValues.tenor_days || ''}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">from BL Date</InputAdornment>
                  }}
                />
              </Grid>
            )}
            <Grid item xs={3}>
              <Typography variant="body1">Off Shore Charges Borne By</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="lc-type"
                  name="off_shore_charges_borne_by"
                  value={formValues.off_shore_charges_borne_by}
                  row
                  onChange={handleChange}
                >
                  <FormControlLabel value="applicant" control={<Radio />} label="Applicant" />
                  <FormControlLabel value="beneficiary" control={<Radio />} label="Beneficiary" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">Confirmation Charges Borne By</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="lc-type"
                  name="confirmation_charges"
                  value={formValues.confirmation_charges}
                  row
                  onChange={handleChange}
                >
                  <FormControlLabel value="1" control={<Radio />} label="Applicant" />
                  <FormControlLabel value="2" control={<Radio />} label="Beneficiary" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {/* <Grid item xs={2}>
              <Typography variant="body1">Confirmation Charges Borne By</Typography>
              <TextField
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="confirmation_charges"
                value={formValues?.confirmation_charges}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid> */}
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={12}>
              <hr style={{ border: '1px solid #A1BCDB', margin: '5px 0' }} />
            </Grid>

            <Grid item xs={3}>
              <Typography variant="body1">Confirming Bank Name:</Typography>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                fullWidth
                value={formValues?.confirm_bank_name}
                onChange={(e) => {
                  setFormValues({ ...formValues, ['confirm_bank_name']: e.target.value });
                }}
                defaultValue={0}
              >
                <MenuItem value={0} selected>
                  Not Selected
                </MenuItem>
                {bankList?.map((item, index) => (
                  <MenuItem key={index} value={item?.v_banks_detail_id}>
                    {item?.bank_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">Confirming Bank Swift Code</Typography>
              <TextField
                name="confirm_bank_swift_code"
                variant="outlined"
                placeholder="Enter Swift Code"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                value={formValues?.confirm_bank_swift_code || ''}
                onChange={(e) => setFormValues({ ...formValues, ['confirm_bank_swift_code']: e.target.value })}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">LC Advising Bank Name:</Typography>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                fullWidth
                value={formValues?.lc_advising_bank_name}
                onChange={(e) => {
                  setFormValues({ ...formValues, ['lc_advising_bank_name']: e.target.value });
                }}
                defaultValue={0}
              >
                <MenuItem value={0} selected>
                  Not Selected
                </MenuItem>
                {bankList?.map((item, index) => (
                  <MenuItem key={index} value={item?.v_banks_detail_id}>
                    {item?.bank_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">LC Advising Bank Swift Code</Typography>
              <TextField
                name="lc_advising_bank_code"
                variant="outlined"
                placeholder="Enter Swift Code"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                value={formValues?.lc_advising_bank_code || ''}
                onChange={(e) => setFormValues({ ...formValues, ['lc_advising_bank_code']: e.target.value })}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <hr style={{ border: '1px solid #A1BCDB', margin: '5px 0' }} />
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={3}>
              <Typography variant="body1">LC Number:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="lc_number"
                value={formValues.lc_number}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>
                }}
                onChange={(e) => setFormValues({ ...formValues, ['lc_number']: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">LC Issue Date:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                value={formValues.lc_issue_date ? dayjs(formValues.lc_issue_date) : null}
                onChange={(date) => setFormValues({ ...formValues, ['lc_issue_date']: date })}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">LC Status:</Typography>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                fullWidth
                defaultValue={0}
                name="lc_status"
                value={formValues.lc_status}
                onChange={(e) => setFormValues({ ...formValues, ['lc_status']: e.target.value })}
              >
                <MenuItem value={0} selected>
                  Not Selected
                </MenuItem>
                <MenuItem value={20}>LC Application on Hold</MenuItem>
                <MenuItem value={30}>LC Application Sent</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
            <Grid
              marginTop="10px"
              item
              xs={12}
              sm={4}
              borderRadius="15px"
              style={{
                border: '2px dashed #000',
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleClick}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" style={{ marginBottom: '8px' }}>
                  <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                </Typography>
                {file ? (
                  <ol>
                    {file.map((item, index) => (
                      <Typography component="li" key={index} variant="body1" style={{ marginBottom: '8px', textAlign: 'left' }}>
                        {item.name}
                      </Typography>
                    ))}
                  </ol>
                ) : (
                  <>
                    <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                      Upload LC Certificate
                    </label>
                    <input multiple type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                  </>
                )}
              </div>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </TableContainer>
  );
};
