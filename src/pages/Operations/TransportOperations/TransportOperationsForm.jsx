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
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import CustomNumberField from 'components/NoArrowTextField';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CustomTypography from 'components/CustomTypography';
import ContainerTacking from './ContainerTrackingTable';
import CI_Data from 'components/BasicDataComponent/CI_data';

const TransportOperationsForm = ({ TransportOperationsData, setTransportForm }) => {
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

  const [containerTrackingView, setViewConterTracking] = useState(true);

  const toggleViewContainerTracking = () => {
    setViewConterTracking(!containerTrackingView);
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

  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = TransportOperationsData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (TransportOperationsData?.add_shippment_containers?.length > 0) {
      let totalContainer = TransportOperationsData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = TransportOperationsData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = TransportOperationsData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (TransportOperationsData?.shipment_advise_items?.length > 0) {
      let totalPackage = TransportOperationsData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [TransportOperationsData]);

  return (
    <div>
      {containerTrackingView ? (
        <>
          <CI_Data ci_id={TransportOperationsData?.ci_id} />
          <TransportOperationForm
            setTransportForm={setTransportForm}
            data={TransportOperationsData}
            toggleViewContainerTracking={toggleViewContainerTracking}
          />
        </>
      ) : (
        <ContainerTacking toggleViewContainerTracking={toggleViewContainerTracking} />
      )}
    </div>
  );
};

export default TransportOperationsForm;

const TransportOperationForm = ({ setTransportForm, data, toggleViewContainerTracking }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [openLapse, setOpenLapse] = useState(false);
  const [lapseTypes, setLapseTypes] = useState([]);
  const [error, setError] = useState('');
  const [lapseForm, setLapseForm] = useState({
    pfi_id: data.pfi_id,
    pfi_no: data.pfi_id,
    ci_num: data.ci_num,
    ci_id: 3,
    lapse_type: 0,
    lapse_amount: 0,
    lapse_narration: '',
    files: []
  });
  useEffect(() => {
    getLapseType();
  }, [openLapse]);

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
      const { data } = await axiosInstance.post('/api/operation/transport/operation/lapse', lapseForm, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Lapse updated successfully');
      setOpenLapse(false);
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const getLapseType = async () => {
    try {
      const response = await axiosInstance.get('/api/transport/operation/lapse/dropdown');
      const lapseKey = response.data.map((data) => ({
        id: data.transport_operation_lapse_master_id,
        name: data.transport_operation_lapse_name
      }));
      setLapseTypes(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
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
    <>
      <Box>
        {openLapse && (
          <>
            <Table>
              {renderTableHeader('basicDetails', 'Add Lapse')}
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
                        value={lapseForm.lapse_type}
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
                    <Grid item xs={2}>
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

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                  >
                    <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenLapse(false)}>
                      Close Lapse
                    </Button>
                    <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }} onClick={handleSubmit}>
                      Submit Lapse
                    </Button>
                  </Box>
                </>
              )}
            </Table>
          </>
        )}

        {openLapse ? (
          <>
            {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenLapse(false)}>
              Close Lapse
            </Button>
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }} onClick={handleSubmit}>
              Submit Lapse
            </Button>
          </Box> */}
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center', // Vertically centers the items within the flex container
              justifyContent: 'center', // Horizontally centers the items within the flex container
              mt: 5,
              width: '100%'
            }}
          >
            <Button variant="contained" sx={{ mr: 2 }} onClick={() => setOpenLapse(true)}>
              Add Lapse
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 2 }}
              // onClick={() => navigate('/operations/transport/container/allocation')}
              onClick={() => setTransportForm(true)}
            >
              Container Allocation
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/operations/container_details')}
              color="primary"
              type="submit"
              sx={{ mr: 2 }}
            >
              Update Container Tracking
            </Button>

            <Button variant="contained" onClick={toggleViewContainerTracking} color="primary" type="submit" sx={{ mr: 2 }}>
              Update Container Tracking2
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};
