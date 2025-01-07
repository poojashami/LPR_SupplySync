import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  Snackbar,
  Alert,
  TableRow,
  Typography,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router';
import PlusButton from 'components/CustomButton';
import CustomNumberField from 'components/NoArrowTextField';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import CustomTypography from 'components/CustomTypography';

const ShippingLapse = ({ setShowShippingExpense, showShippingExpenseData }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // const [file, setFile] = useState(null);
  // const [openLapse, setOpenLapse] = useState(false);

  const GetShippingExpense = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/commercial/invoice/shipping/expense/lapse?ci_id=${id}`);
      console.log('setShippingExpenseData', data);
      setLapseForm(
        data?.shipping_lapse_id
          ? {
              ci_id: data?.ci_id,
              ci_num: data?.ci_num,
              lapse_type: data?.lapse_type,
              lapse_amount: data?.lapse_amount,
              lapse_narration: data?.lapse_narration,
              files: []
            }
          : {
              ci_id: showShippingExpenseData?.ci_id,
              ci_num: showShippingExpenseData?.ci_num,
              lapse_type: '',
              lapse_amount: 0,
              lapse_narration: '',
              files: []
            }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [lapseTypes, setLapseTypes] = useState([]);
  const [lapseForm, setLapseForm] = useState({});
  useEffect(() => {
    getLapseType();
    GetShippingExpense(showShippingExpenseData?.ci_id);
  }, [showShippingExpenseData]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      // setFile(droppedFile);
      setLapseForm({ ...lapseForm, files: Object.values(selectedFile) });
    } else {
      alert('Please drop a PDF file.');
    }
  };

  const handleFileSelectLapse = (e) => {
    const selectedFile = e.target.files;
    Object.values(selectedFile).forEach((file) => {
      if (file && file.type === 'application/pdf') {
        // setFile(Object.values(selectedFile));
        setLapseForm({ ...lapseForm, files: Object.values(selectedFile) });
      } else {
        alert('Please select a PDF file.');
      }
    });
  };

  const handleClick2 = () => {
    document.getElementById('fileInput2').click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/api/operation/shipping/lapse', lapseForm, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Lapse Submitted successfully');

      setShowShippingExpense(false);
      setLapseForm({
        ci_id: showShippingExpenseData?.ci_id,
        ci_num: showShippingExpenseData?.ci_num,
        lapse_type: 0,
        lapse_amount: 0,
        lapse_narration: '',
        files: []
      });
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const getLapseType = async () => {
    try {
      const response = await axiosInstance.get('/api/shipping/lapse/dropdown');
      const lapseKey = response.data.map((data) => ({
        id: data.shipping_lapse_master_id,
        name: data.shipping_lapse_name
      }));
      setLapseTypes(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Shipping Lapse</span>
          <PlusButton label="Back" onClick={() => setShowShippingExpense(false)} />
        </Box>
      }
    >
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Table style={{ padding: '2vh' }}>
        <TableBody>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">PFI Number:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.pfi_num}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.pfi_date}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">OPO No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.opo_num}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Delivery Unit:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.company_name}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Supplier Name:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.supplier_name}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">FORM M No.:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.form_m_num}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">FORM M Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.form_m_date}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Expiry Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.form_m_expiry_date}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">BA No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.ba_num}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">LC No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.lc_num}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Product Description:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.product_description}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Shipment Status:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.shipment_status}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">No of Previous shipment:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.no_of_previous_shipment}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Value Of Previous Shipment:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.value_of_previous_shipment}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">BL No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.bl_awb_no}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">BL Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.bl_awb_date}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Free Days:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.free_days}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Shipment Mode:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.shipment_mode_name}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Vessel Name, No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{`${showShippingExpenseData?.shippment_advise_master?.shipping_vehicle}, ${showShippingExpenseData?.shippment_advise_master?.vehicle_description}`}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Port Of Loading:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.port_of_loading}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Port Of DC:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.port_of_dc}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Commercial Invoice No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.ci_num}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Commercial Invoice Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.ci_date}</CustomTypography>
            </TableCell>

            <TableCell>
              <CustomTypography variant="subtitle1">Rotation Number:</CustomTypography>
            </TableCell>
            <TableCell colSpan={5}>
              <CustomTypography>{showShippingExpenseData?.assessment?.rotation_no}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Supplier ETA:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.eta}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">OPR No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData?.opr_num}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Total (A+B+C):</CustomTypography>
            </TableCell>
            <TableCell colSpan={5}>
              <CustomTypography>{showShippingExpenseData?.pfi_amount}</CustomTypography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container spacing={2} sx={{ padding: '20px' }}>
        <Grid item xs={3}>
          <Typography variant="body1">Lapse Type:</Typography>
          <Select
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            fullWidth
            value={lapseForm.lapse_type || ''}
            name="lapse_type"
            onChange={(e) => setLapseForm({ ...lapseForm, [e.target.name]: e.target.value })}
          >
            {/* <MenuItem value={1}>Not Selected</MenuItem> */}
            {lapseTypes.map((type, i) => (
              <MenuItem key={i} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">Amount:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="insurance-basic"
            value={lapseForm.lapse_amount || ''}
            variant="outlined"
            name="lapse_amount"
            onChange={(e) => setLapseForm({ ...lapseForm, [e.target.name]: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">Narration:</Typography>
          <TextField
            type="text"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            value={lapseForm.lapse_narration || ''}
            variant="outlined"
            name="lapse_narration"
            onChange={(e) => setLapseForm({ ...lapseForm, [e.target.name]: e.target.value })}
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
            onClick={handleClick2}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="body1" style={{ marginBottom: '8px' }}>
                <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
              </Typography>
              {lapseForm?.files?.length > 0 ? (
                <ol>
                  {lapseForm.files.map((item, index) => (
                    <Typography component="li" key={index} variant="body1" style={{ marginBottom: '8px', textAlign: 'left' }}>
                      {item.name}
                    </Typography>
                  ))}
                </ol>
              ) : (
                <>
                  <label htmlFor="fileInput2" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                    {/* {values?.documentName ? values?.documentName : 'Upload file'} */}
                    Lapse Expense Document
                  </label>
                  <input multiple type="file" id="fileInput2" style={{ display: 'none' }} onChange={handleFileSelectLapse} accept=".pdf" />
                </>
              )}
            </div>
          </Grid>
          {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%'
        }}
      >
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit Lapse
        </Button>
      </Box>
    </MainCard>
  );
};

export default ShippingLapse;
