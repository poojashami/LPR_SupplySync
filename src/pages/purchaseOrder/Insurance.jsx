import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Box,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton
} from '@mui/material';
import PlusButton from 'components/CustomButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import { Menu } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';

const InsuranceTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [formMData, setFormMData] = useState([]);
  const [formMForm, setFormMForm] = useState(false);
  const [formMRowData, setFormMRowData] = useState({});
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleOpenFormM = (data) => {
    setFormMRowData(data);
    setFormMForm(true);
  };

  const handleFormMClose = () => {
    setFormMForm(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/pfi/list');
        console.log('Fetching data:', response.data);
        const formMDataMapped = response.data.map((item, index) => ({
          id: index + 1,
          pfi_id: item.pfi_id || 2,
          pfi_no: item.pfi_num || 'PI-001',
          pfi_date: item.pfi_date || '2024-07-15',
          consignor: item.controlling_office || 'N/A',
          consignee: item.company_id || 'N/A',
          pfi_category: item.shipment_mode || 'Electronics',
          bank: item.bank || 'HDFC',
          currency: item.currency || 'USD',
          total_value: item.total_value || 25000,
          pfi_general_desc: item.pfi_general_desc || 'N/A',
          created_by: item.created_by || 'N/A',
          insurance: item.insurance || 2,
          bank_branch: item.bank_branch || 'PI-001',
          account_number: item.account_number || '2024-07-15',
          fob: item.fob || 'N/A',
          transport_and_doc_charge: item.transport_and_doc_charge || 'N/A',
          freight_charges: item.freight_charges || 'Electronics',
          pfi_amount: item.pfi_amount || 'HDFC',
          mode_payment: item.mode_payment || 'USD',
          supplier_name: item.supplier_name || 25000,
          no_of_shipment: item.no_of_shipment || 'N/A',
          duty_role: item.duty_role || 'N/A',
          levy: item.levy || 'Electronics',
          port_of_discharge: item.port_of_discharge || 'HDFC',
          port_of_loading: item.port_of_loading || 'USD',
          country_of_origin: item.country_of_origin || 25000,
          country_of_supply: item.country_of_supply || 'N/A'
        }));
        console.log('Fetching data:', formMDataMapped);
        setFormMData(formMDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };
    fetchData();
  }, []);

  const FormMColumn = [
    {
      field: 'pfi_no',
      headerName: 'PFI No',
      width: 80
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenFormM(params.row);
                handleClose();
              }}
            >
              <strong>Create Insurance</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'PFI Date', field: 'pfi_date' },
    { headerName: 'Consignor', field: 'consignor' },
    { headerName: 'Consignee', field: 'consignee' },
    { headerName: 'PFI Category', field: 'pfi_category' },
    { headerName: 'PFI Desc', field: 'pfi_general_desc' },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'PI Total', field: 'total_value' },
    { headerName: 'Bank', field: 'bank' },
    { headerName: 'PI Created By', field: 'created_by' }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {!formMForm ? (
              <p>PFI Pending for Insurance</p>
            ) : (
              <p>
                Add Insurance for PFI Num : <b style={{ color: 'blue' }}> ({formMRowData.pfi_no})</b>
              </p>
            )}
            {formMForm && <PlusButton label="Back" onClick={handleFormMClose} />}
          </Box>
        }
      >
        <div>{formMForm ? <Insurance insuranceRowData={formMRowData} /> : <DataGrid getRowHeight={() => 'auto'}
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
          }} columns={FormMColumn} rows={formMData} />}</div>
      </MainCard>
    </div>
  );
};
export default InsuranceTable;

const Insurance = ({ insuranceRowData }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                PFI Date:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>05/05/2024</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                PFI Amount:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>13,220</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Currency:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>USD</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Bank:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>GTB</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <AddInsuranceForm />
    </div>
  );
};

const AddInsuranceForm = () => {
  const [file, setFile] = useState(null);

  const initialValues = {
    pfiDate: new Date().toISOString(),
    pfiValue: 1200,
    currency: 'USD',
    bank: 'HDFC',
    pfiNum: 'PFI-311X2024',
    pfiId: 4,
    applicationDate: null,
    insurancePremiumRate: '',
    insuranceCertNo: '',
    invoiceNo: '',
    formMDate: null,
    insuranceCompany: '',
    insuranceClause: '',
    exchangeRate: '',
    paymentDate: null,
    remarks: '',
    file: null
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Handle date change
  const handleDateChange = (name) => (date) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: date ? dayjs(date).toDate() : null
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newErrors = {};

      // Validate form fields
      Object.keys(formValues).forEach((key) => {
        if (formValues[key] === '') {
          console.log(formValues[key]);
          newErrors[key] = 'This field is required';
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

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
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.post('/api/insurance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response:', response.data.message);
      toast.success(response.data.message);
      // Handle successful submission
      if (response.status === 201) {
        console.log('Form submitted successfully!');
        setFormValues(initialValues);
        setFile(null);
        setErrors({});
      } else {
        // Handle server errors
        console.error('Submission failed:', response.statusText);
      }
    } catch (error) {
      // Handle network errors
      console.error('Error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, marginTop: '50px' }}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Typography variant="body1">Application Date</Typography>
          <DatePicker
            value={formValues.applicationDate ? dayjs(formValues.applicationDate) : null}
            onChange={handleDateChange('applicationDate')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" fullWidth error={!!errors.applicationDate} helperText={errors.applicationDate} />
            )}
            sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Insurance Premium Rate</Typography>
          <TextField
            fullWidth
            type="number"
            name="insurancePremiumRate"
            value={formValues.insurancePremiumRate}
            onChange={handleInputChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
            InputProps={{ endAdornment: <InputAdornment position="start">%</InputAdornment> }}
            error={!!errors.insurancePremiumRate}
            helperText={errors.insurancePremiumRate}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Insurance Cert. No.</Typography>
          <TextField
            fullWidth
            name="insuranceCertNo"
            value={formValues.insuranceCertNo}
            onChange={handleInputChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
            error={!!errors.insuranceCertNo}
            helperText={errors.insuranceCertNo}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Sum Insured (USD)</Typography>
          <TextField
            onChange={handleInputChange}
            value={formValues.sumInsuredUSD}
            fullWidth
            name="sumInsuredUSD"
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Premium Amount (Naira)</Typography>
          <TextField
            onChange={handleInputChange}
            value={formValues.premiumAmount}
            fullWidth
            name="premiumAmount"
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Sum Insured (Naira)</Typography>
          <TextField
            onChange={handleInputChange}
            value={formValues.sumInsuredNaira}
            fullWidth
            name="sumInsuredNaira"
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Invoice/DN No.</Typography>
          <TextField
            fullWidth
            name="invoiceNo"
            value={formValues.invoiceNo}
            onChange={handleInputChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
            error={!!errors.invoiceNo}
            helperText={errors.invoiceNo}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Form M Applied Date</Typography>
          <DatePicker
            value={formValues.formMDate ? dayjs(formValues.formMDate) : null}
            onChange={handleDateChange('formMDate')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" fullWidth error={!!errors.formMDate} helperText={errors.formMDate} />
            )}
            sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Insurance Company</Typography>
          <Select
            name="insuranceCompany"
            value={formValues.insuranceCompany}
            onChange={handleSelectChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            fullWidth
            variant="outlined"
            labelId="company-label"
            error={!!errors.insuranceCompany}
            helperText={errors.insuranceCompany}
          >
            <MenuItem value={1}>Company A</MenuItem>
            <MenuItem value={2}>Company B</MenuItem>
            <MenuItem value={3}>Company C</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Insurance Clause</Typography>
          <Select
            name="insuranceClause"
            value={formValues.insuranceClause}
            onChange={handleSelectChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            fullWidth
            variant="outlined"
            labelId="clause-label"
            error={!!errors.insuranceClause}
            helperText={errors.insuranceClause}
          >
            <MenuItem value={1}>Clause A</MenuItem>
            <MenuItem value={2}>Clause B</MenuItem>
            <MenuItem value={3}>Clause C</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Exchange Rate</Typography>
          <TextField
            fullWidth
            type="number"
            name="exchangeRate"
            value={formValues.exchangeRate}
            onChange={handleInputChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
            error={!!errors.exchangeRate}
            helperText={errors.exchangeRate}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Payment Date</Typography>
          <DatePicker
            value={formValues.paymentDate ? dayjs(formValues.paymentDate) : null}
            onChange={handleDateChange('paymentDate')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" fullWidth error={!!errors.paymentDate} helperText={errors.paymentDate} />
            )}
            sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="body1">Remarks</Typography>
          <TextField
            fullWidth
            name="remarks"
            value={formValues.remarks}
            onChange={handleInputChange}
            sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
            variant="outlined"
            error={!!errors.remarks}
            helperText={errors.remarks}
          />
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
                    Upload Insurance Certificate
                  </label>
                  <input type="file" id="fileInput" multiple style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};
