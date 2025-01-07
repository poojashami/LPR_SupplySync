import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CustomTypography from 'components/CustomTypography';
import CI_Data from 'components/BasicDataComponent/CI_data';

const SonOperations = ({ SonData }) => {
  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);

  useEffect(() => {
    let data = SonData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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
  }, [SonData]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true
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
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
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
    <div>
      <CI_Data ci_id={NafdacData?.ci_id} />
      <SonForm SonData={SonData} />
    </div>
  );
};

export default SonOperations;

const SonForm = ({ SonData }) => {
  // console.log(SonData?.data[0]);
  const [file, setFile] = useState(null);
  const [openLapse, setOpenLapse] = useState(false);
  const [formValues, setFormValues] = useState(
    SonData?.operations_son?.operations_son_id
      ? {
          operations_son_id: SonData?.operations_son?.operations_son_id,
          ci_id: SonData?.ci_id,
          ci_num: SonData?.ci_num,
          penalty_payment_date: dayjs(SonData?.operations_son?.penalty_payment_date),
          penalty_approved_date: dayjs(SonData?.operations_son?.penalty_approved_date),
          bill_date: dayjs(SonData?.operations_son?.bill_date),
          payment_type: SonData?.operations_son?.payment_type,
          bill_num: SonData?.operations_son?.bill_num,
          amount: SonData?.operations_son?.amount,
          remit_charges: SonData?.operations_son?.remit_charges,
          vat: SonData?.operations_son?.vat,
          total: SonData?.operations_son?.total,
          narration: SonData?.operations_son?.narration,
          penalty_approved_by: SonData?.operations_son?.penalty_approved_by
        }
      : {
          ci_id: SonData?.ci_id,
          ci_num: SonData?.ci_num,
          penalty_payment_date: dayjs(SonData?.operations_son?.penalty_payment_date),
          penalty_approved_date: dayjs(SonData?.operations_son?.penalty_approved_date),
          bill_date: dayjs(SonData?.operations_son?.bill_date),
          payment_type: SonData?.operations_son?.payment_type,
          bill_num: SonData?.operations_son?.bill_num,
          amount: SonData?.operations_son?.amount,
          remit_charges: SonData?.operations_son?.remit_charges,
          vat: SonData?.operations_son?.vat,
          total: SonData?.operations_son?.total,
          narration: SonData?.operations_son?.narration,
          penalty_approved_by: SonData?.operations_son?.penalty_approved_by
        }
  );
  const [lapseForm, setLapseForm] = useState({ operations_son_id: '45', lapse_type: 0, lapse_amount: 0, lapse_narration: '', files: [] });
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

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleClick2 = () => {
    document.getElementById('fileInput2').click();
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
        });
      }
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const { data } = openLapse
        ? await axiosInstance.post('/api/operation/son/lapse', lapseForm, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        : await axiosInstance.post('/api/operation/son', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

      console.log(data);
      toast.success(openLapse ? 'Lapse updated successfully' : 'SON Updated successfully');
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true
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
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
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
    <Box component="form" onSubmit={handleSubmit}>
      <Table>
        {renderTableHeader('otherDetails', 'Update Details')}
        {showTableHeading.otherDetails && (
          <>
            <Grid container spacing={2} sx={{ padding: '20px' }}>
              <Grid item xs={2}>
                <Typography variant="body1">Payment Type:</Typography>
                <Select
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  fullWidth
                  defaultValue={1}
                  name="payment_type"
                  value={formValues?.payment_type}
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
                <Typography variant="body1">Bill No.:</Typography>
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
                  name="bill_no"
                  value={formValues?.bill_num}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Bill Date:</Typography>
                <DatePicker
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  value={formValues.bill_date}
                  onChange={(date) => setFormValues({ ...formValues, ['bill_date']: date })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Amount:</Typography>
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
                  name="amount"
                  value={formValues.amount}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Remit Charges:</Typography>
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
                  name="remit_charges"
                  value={formValues.remit_charges}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">VAT:</Typography>
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
                  name="vat"
                  value={formValues.vat}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Total:</Typography>
                <TextField
                  disabled
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  value={formValues.total}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Narration:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="narration"
                  value={formValues.narration}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Penalty Approved BY:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="penalty_approved_by"
                  value={formValues.penalty_approved_by}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Penalty Approved Date:</Typography>
                <DatePicker
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  name="penalty_approved_date"
                  value={formValues.penalty_approved_date}
                  onChange={(date) => setFormValues({ ...formValues, ['penalty_approved_date']: date })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Penalty Payment Date:</Typography>
                <DatePicker
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  value={formValues.penalty_payment_date}
                  onChange={(date) => setFormValues({ ...formValues, ['penalty_payment_date']: date })}
                  name="penalty_payment_date"
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
                          SON Document
                        </label>
                        <input multiple type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                      </>
                    )}
                  </div>
                </Grid>
                {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
              </Grid>
            </Grid>

            {openLapse && (
              <>
                <Table>
                  {renderTableHeader('basicDetails', 'Lapse Details')}
                  {showTableHeading.basicDetails && (
                    <>
                      <Grid container spacing={2} sx={{ padding: '20px' }}>
                        <Grid item xs={2}>
                          <Typography variant="body1">Lapse Type:</Typography>
                          <Select
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                            fullWidth
                            defaultValue={1}
                            name="lapse_type"
                            onChange={(e) => setLapseForm({ ...lapseForm, [e.target.name]: e.target.value })}
                          >
                            <MenuItem value={1} selected>
                              Not Selected
                            </MenuItem>
                            <MenuItem value={2}>No SONCAP/Import Permit</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body1">Amount:</Typography>
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
                            name="lapse_amount"
                            onChange={(e) => setLapseForm({ ...lapseForm, [e.target.name]: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body1">Narration:</Typography>
                          <TextField
                            type="text"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
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
                              {lapseForm.files.length > 0 ? (
                                <ol>
                                  {lapseForm.files.map((item, index) => (
                                    <Typography
                                      component="li"
                                      key={index}
                                      variant="body1"
                                      style={{ marginBottom: '8px', textAlign: 'left' }}
                                    >
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
                                  <input
                                    multiple
                                    type="file"
                                    id="fileInput2"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelectLapse}
                                    accept=".pdf"
                                  />
                                </>
                              )}
                            </div>
                          </Grid>
                          {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Table>
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
              {openLapse ? (
                <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenLapse(false)}>
                  Close Lapse
                </Button>
              ) : (
                <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenLapse(true)}>
                  Add Lapse
                </Button>
              )}
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                {openLapse ? 'Submit Lapse' : SonData?.operations_son?.operations_son_id ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </>
        )}
      </Table>
    </Box>
  );
};
