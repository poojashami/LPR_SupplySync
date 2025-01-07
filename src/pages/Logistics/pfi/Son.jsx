import React, { useState } from 'react';
import {
  Box,
  Select,
  TableContainer,
  MenuItem,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import ocr from 'utils/ocrEngine';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';

const Son = ({ SonData, onclose }) => {
  return (
    <div>
      <Pfi_Data pfi_id={SonData?.pfi_id} />
      <SonForm SonData={SonData} onclose={onclose} />
    </div>
  );
};

export default Son;

const SonForm = ({ SonData, onclose }) => {
  const [showTableBodies, setShowTableBodies] = useState({
    viewPaymentDetails: true
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
              {!showTableBodies[sectionName] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const fetchData = async (id) => {
    const { data } = await axiosInstance.get('/api/pfi/son/bypfiid', {
      params: {
        pfi_id: id
      }
    });
    if (data?.data?.length) {
      setInitialValues({
        pfiDate: data?.data[0]?.pfi_date,
        pfiNum: data?.data[0]?.pfi_num,
        pfiId: data?.data[0]?.pfi_id,
        payment_types: data?.data[0]?.permit_type,
        son_permit_app_date: data?.data[0]?.son_date,
        invoice_rec_date: data?.data[0]?.invoice_received_date,
        pay: data?.data[0]?.pay_not,
        permit_no: data?.data[0]?.permit_num
      });
      setFormValues({
        pfiDate: data?.data[0]?.pfi_date,
        pfiNum: data?.data[0]?.pfi_num,
        pfiId: data?.data[0]?.pfi_id,
        payment_types: data?.data[0]?.permit_type,
        son_permit_app_date: data?.data[0]?.son_date,
        invoice_rec_date: data?.data[0]?.invoice_received_date,
        pay: data?.data[0]?.pay_not,
        permit_no: data?.data[0]?.permit_num
      });
      setFile(data?.data[0]?.file);
    }
  };
  React.useEffect(() => {
    fetchData(SonData?.pfi_id);
  }, []);
  const [file, setFile] = useState(null);
  const [initialValues, setInitialValues] = useState({
    pfiDate: new Date().toISOString(),
    pfiNum: SonData?.pfi_no,
    pfiId: SonData?.pfi_id,
    payment_types: '',
    son_permit_app_date: dayjs(),
    invoice_rec_date: dayjs(),
    pay: '',
    permit_no: ''
  });

  const [formValues, setFormValues] = useState(initialValues);
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

  const handleFileSelect = async (e) => {
    if (!formValues?.permit_no) {
      toast.info('Please Enter Permit first!');
    } else {
      const selectedFiles = e.target.files;
      const pdfFiles = Array.from(selectedFiles).filter((file) => file.type === 'application/pdf');

      if (pdfFiles.length === 0) {
        toast.info('Please select at least one PDF file.');
        return;
      }
      setFile(pdfFiles);
      for (const file of pdfFiles) {
        const found = await ocr(file, formValues?.permit_no);
        if (found) toast.success('File Validation Success');
        if (!found) toast.error('File Failed');
      }
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    try {
      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        if (formValues[key] && key !== 'file') {
          formData.append(key, formValues[key]);
        }
      });
      if (file && file.length > 0) {
        file.forEach((fileItem, index) => {
          formData.append(`file[${index}]`, fileItem);
          formData.append(`pfi_id`, SonData?.pfi_id);
        });
      }
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const { data } = await axiosInstance.post('/api/pfi/son', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(data);
      onclose();
      toast.success('Form Submitted successfully');
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  return (
    <TableContainer>
      <Table>{renderTableHeader('viewPaymentDetails', 'SON Permit Details')}</Table>
      {showTableBodies.viewPaymentDetails && (
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={2}>
              <Typography variant="body1">SON Type:</Typography>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                fullWidth
                defaultValue={1}
                name="payment_types"
                value={formValues.payment_types}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              >
                <MenuItem value={1} selected>
                  Not Selected
                </MenuItem>
                <MenuItem value={2}>Single</MenuItem>
                <MenuItem value={3}>Annual</MenuItem>
                <MenuItem value={4}>Supplier PC</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Application Date:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                value={formValues.son_permit_app_date ? dayjs(formValues.son_permit_app_date) : null}
                onChange={(date) => setFormValues({ ...formValues, ['son_permit_app_date']: date })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Invoice Received Date:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                value={formValues.invoice_rec_date ? dayjs(formValues.invoice_rec_date) : null}
                onChange={(date) => setFormValues({ ...formValues, ['invoice_rec_date']: date })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Payment Amount:(NGN)#</Typography>
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
                name="pay"
                value={formValues.pay}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Permit No.:</Typography>
              <TextField
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="permit_no"
                value={formValues.permit_no}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
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
                        {/* {values?.documentName ? values?.documentName : 'Upload file'} */}
                        Upload SON Certificate
                      </label>
                      <input multiple type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                    </>
                  )}
                </div>
              </Grid>
              {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
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
