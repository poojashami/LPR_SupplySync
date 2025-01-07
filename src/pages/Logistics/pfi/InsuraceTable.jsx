import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
  MenuItem,
  IconButton,
  Menu,
  Select,
  TableHead,
  TableContainer
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlusButton from 'components/CustomButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GetPFI } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';

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

  const dispatch = useDispatch();
  const { pfiData: pfi_data } = useSelector((state) => state.PFISlice);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formMDataMapped = pfi_data.map((item, index) => ({
          id: index + 1,
          pfi_id: item?.pfi_id,
          pfi_no: item?.pfi_num,
          pfi_date: item?.createdAt?.split('T')[0],
          pfi_amount: item?.amount,
          consignor: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
          consignee: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          pfi_category: item?.opo_master?.OprMaster?.item_super_group_master?.item_super_group_name,
          pfi_general_desc: item?.pfi_description,
          currency: item?.opo_master?.quotation_master?.currency,
          total_value:
            item?.opo_master?.quotation_master?.additional_costs?.length > 0
              ? Number(item?.amount) +
              item?.opo_master?.quotation_master?.additional_costs?.reduce((acc, amount) => {
                return amount.reference_table_name ? (acc = Number(acc) + Number(amount.charge_amount)) : acc;
              }, 0)
              : Number(item?.amount),
          payment_terms: item?.opo_master?.quotation_master.payment_terms,
          shipment_type: item?.opo_master?.OprMaster.shipment_mode_name,
          shipment_window: item?.opo_master?.quotation_master.lead_time,
          pfi_created_by: item?.createdAt,
          opr_no: item?.opo_master?.OprMaster.opr_num,
          pi_sender: item?.pfi_sender_id,
          pi_sender_date: item?.pfi_sent_date,
          pfi_description: item?.pfi_description,
          pfi_created_time: item?.createdAt?.split('T')[0],
          supplier: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
          buyer: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          port_of_loading: item?.opo_master?.quotation_master?.port_of_loading,
          country_of_origin_of_goods: item?.opo_master?.quotation_master?.country_origin,
          country_of_supply: item?.opo_master?.quotation_master?.country_supply,
          port_of_dc: `${item?.opo_master?.quotation_master?.country_supply} ${item?.opo_master?.quotation_master.port_loading}`,
          final_destination: item?.opo_master?.quotation_master?.RfqMaster?.port_destination_name,
          country_of_final_destination: item?.opo_master?.OprMaster.companyMaster.AddressMasters[0].country,
          delivery_time: item?.opo_master?.quotation_master.lead_time,
          delivery_terms: item?.opo_master?.quotation_master.delivery_terms_quo.delivery_terms_name,
          form_m_no: item?.document_name,
          bank: item?.bank,
          delivery_time1: item?.opo_master?.quotation_master.lead_time,
          delivery_date: item?.exchange_date,
          inland_charges: item?.inhand_charges,
          freight_charges: item?.freight_charges,
          inspection_charges: item?.inspection_charges,
          thc_fob: item?.thc_charges,
          container_stuffing: item?.container_stuffing,
          container_seal: item?.container_seal,
          bl: item?.bl,
          vgm: item?.vgm,
          miscellaneous_fob: item?.miscellaneous_fob,
          thc_doc: item?.thc_charges,
          advising_commission: item?.advising_commission,
          lc_commission: item?.llc_commission,
          courier: item?.courier,
          miscellaneous_doc: item?.miscellaneous_doc,
          approval_status: item?.approval_status,
          status_updated_by: item?.status_updated_by,
          status_updated_time: item?.updatedAt,
          status_remarks: item?.status_remarks,
          additional_charges: item?.opo_master?.quotation_master.additional_costs,
          status: item?.insurances?.length,
          VendorsBanksDetailsMaster: item?.VendorsBanksDetailsMaster,
          bank: item?.VendorsBanksDetailsMaster?.bank_name
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
              disabled={params.row.status}
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
    {
      headerName: 'Insurance',
      field: 'status',
      renderCell: (params) => (
        <Button
          onClick={() => {
            handleOpenFormM(params.row);
            handleClose();
          }}
          style={{ color: 'blue' }}
        >
          {params.row.status != 0 ? 'View' : 'Create'}
        </Button>
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
    { headerName: 'PI Created By', field: 'pfi_created_time' }
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
        <div>
          {formMForm ? (
            <Insurance insuranceRowData={formMRowData} onclose={handleFormMClose} />
          ) : (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '70vh',
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
              columns={FormMColumn}
              rows={formMData}
              hideFooter
              hideFooterSelectedRowCount
              hideFooterPagination
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};
export default InsuranceTable;

const Insurance = ({ insuranceRowData, onclose }) => {
  console.log('insuranceRowData', insuranceRowData);
  return (
    <div>
      <Pfi_Data pfi_id={insuranceRowData?.pfi_id} />
      <AddInsuranceForm insuranceRowData={insuranceRowData} onclose={onclose} />
    </div>
  );
};

const AddInsuranceForm = ({ insuranceRowData, onclose }) => {
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
  const fetchData = async (id) => {
    const { data } = await axiosInstance.get('/api/insurance/bypfiid', {
      params: {
        pfi_id: id
      }
    });
    if (data?.data?.length) {
      setInitialValues({
        pfiDate: new Date().toISOString(),
        pfiValue: data?.data[0]?.pfiValue,
        currency: data?.data[0]?.currency,
        bank: data?.data[0]?.bank,
        pfiNum: data?.data[0]?.pfiNum,
        pfiId: data?.data[0]?.pfiId,
        applicationDate: data?.data[0]?.application_date,
        insurancePremiumRate: data?.data[0]?.insurance_premium_rate,
        insuranceCertNo: data?.data[0]?.insurance_certificate_num,
        invoiceNo: data?.data[0]?.invoice_no,
        formMDate: data?.data[0]?.form_applied_date,
        insuranceCompany: data?.data[0]?.insurance_company,
        insuranceClause: data?.data[0]?.insurance_clause,
        exchangeRate: data?.data[0]?.exchange_rate,
        paymentDate: data?.data[0]?.payment_date,
        remarks: data?.data[0]?.remarks,
        sumInsuredUSD: data?.data[0]?.sum_insured_usd,
        sumInsuredNaira: data?.data[0]?.sum_insured_naira,
        premiumAmount: data?.data[0]?.premium_amount_naira,
        file: data?.data[0]?.file
      });
      setFormValues({
        pfiDate: new Date().toISOString(),
        pfiValue: data?.data[0]?.pfiValue,
        currency: data?.data[0]?.currency,
        bank: data?.data[0]?.bank,
        pfiNum: data?.data[0]?.pfiNum,
        pfiId: data?.data[0]?.pfiId,
        applicationDate: data?.data[0]?.application_date,
        insurancePremiumRate: data?.data[0]?.insurance_premium_rate,
        insuranceCertNo: data?.data[0]?.insurance_certificate_num,
        invoiceNo: data?.data[0]?.invoice_no,
        formMDate: data?.data[0]?.form_applied_date,
        insuranceCompany: data?.data[0]?.insurance_company,
        insuranceClause: data?.data[0]?.insurance_clause,
        exchangeRate: data?.data[0]?.exchange_rate,
        paymentDate: data?.data[0]?.payment_date,
        remarks: data?.data[0]?.remarks,
        sumInsuredUSD: data?.data[0]?.sum_insured_usd,
        sumInsuredNaira: data?.data[0]?.sum_insured_naira,
        premiumAmount: data?.data[0]?.premium_amount_naira,
        file: data?.data[0]?.file
      });
      setFile(data?.data[0]?.file);
    }
  };

  const [file, setFile] = useState(null);
  const [initialValues, setInitialValues] = useState({
    pfiDate: new Date().toISOString(),
    pfiValue: insuranceRowData?.total_value,
    currency: insuranceRowData?.currency,
    bank: insuranceRowData?.bank,
    pfiNum: insuranceRowData.pfi_no,
    pfiId: insuranceRowData?.pfi_id,
    applicationDate: null,
    insurancePremiumRate: '',
    insuranceCertNo: '',
    invoiceNo: '',
    formMDate: null,
    sumInsuredUSD: (Number(insuranceRowData?.total_value) * 1.1).toFixed(2),
    insuranceCompany: '',
    insuranceClause: '',
    exchangeRate: '',
    paymentDate: null,
    sumInsuredNaira: '',
    premium_amount_naira: '',
    remarks: '',
    file: null
  });

  useEffect(() => {
    fetchData(insuranceRowData.pfi_id);
  }, []);

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      sumInsuredNaira: (Number(insuranceRowData?.total_value) * 1.1 * formValues.exchangeRate).toFixed(2),
      premiumAmount: (Number(Number(prevValues.sumInsuredNaira) * formValues.insurancePremiumRate) / 100).toFixed(2)
    }));
  }, [formValues.exchangeRate, formValues.insurancePremiumRate]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'exchangeRate') {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
        sumInsuredNaira: (Number(insuranceRowData?.total_value) * 1.1 * value).toFixed(2)
      }));
    } else if (name === 'insurancePremiumRate') {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
        premiumAmount: (Number(Number(prevValues.sumInsuredNaira) * value) / 100).toFixed(2)
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
    }
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
    console.log('sdfsdf');
    event.preventDefault();

    try {
      const newErrors = {};

      // Validate form fields
      Object.keys(formValues).forEach((key) => {
        if (formValues[key] === '') {
          newErrors[key] = 'This field is required';
        }
      });

      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        if (formValues[key] && key !== 'file') {
          formData.append(key, formValues[key]);
        }
      });

      if (file && file.length > 0) {
        file.forEach((fileItem, index) => {
          formData.append(`file[${index}]`, fileItem);
          formData.append(`pfi_id`, insuranceRowData?.pfi_id);
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

      console.log('Response:', response);
      onclose();

      // Handle successful submission
      if (response.status === 200) {
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
    <TableContainer>
      <Table>{renderTableHeader('viewPaymentDetails', 'Insurance Info')}</Table>
      {showTableBodies.viewPaymentDetails && (
        <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, marginTop: '50px' }}>
          <Grid container spacing={2}>
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
              <Typography variant="body1">Application Date</Typography>
              <DatePicker
                value={formValues.applicationDate ? dayjs(formValues.applicationDate) : null}
                onChange={handleDateChange('applicationDate')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    error={!!errors.applicationDate}
                    helperText={errors.applicationDate}
                  />
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
                disabled
                // onChange={handleInputChange}
                value={formValues.sumInsuredUSD}
                fullWidth
                name="sumInsuredUSD"
                sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
                variant="outlined"
              />
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
              <Typography variant="body1">Sum Insured (Naira)</Typography>
              <TextField
                onChange={handleInputChange}
                value={formValues.sumInsuredNaira}
                fullWidth
                disabled
                name="sumInsuredNaira"
                sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body1">Premium Amount (Naira)</Typography>
              <TextField
                disabled
                onChange={handleInputChange}
                value={formValues.premiumAmount}
                fullWidth
                name="premiumAmount"
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
            {/* <Grid item xs={2}>
              <Typography variant="body1">Form M Applied Date</Typography>
              <DatePicker
                value={formValues.formMDate ? dayjs(formValues.formMDate) : null}
                onChange={handleDateChange('formMDate')}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" fullWidth error={!!errors.formMDate} helperText={errors.formMDate} />
                )}
                sx={{ '& .MuiInputBase-input': { padding: '7px' }, width: '100%' }}
              />
            </Grid> */}



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
      )}
    </TableContainer>
  );
};
