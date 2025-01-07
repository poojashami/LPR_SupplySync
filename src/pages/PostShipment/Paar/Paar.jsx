import React, { useEffect, useState } from 'react';
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
  TableHead,
  IconButton,
  Select,
  MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toast } from 'react-toastify';
import CustomTypography from 'components/CustomTypography';
import CIItemDetail from 'pages/CommercialInvoice/CIItemDetail';
import { DataGrid } from '@mui/x-data-grid';
import { messageOpen } from 'Redux/Slices/StaticSlice';
import { useDispatch } from 'react-redux';
import CI_Data from 'components/BasicDataComponent/CI_data';

const Paar = ({ PaarData }) => {
  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);

  useEffect(() => {
    let data = PaarData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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
  }, [PaarData]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    updateDetails: true,
    etaDetails: true,
    itemDetails: true
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
      <CI_Data ci_id={PaarData?.ci_id} />
      <PaarForm PaarData={PaarData} />
      <Table sx={{ mt: 2 }}>
        {renderTableHeader('itemDetails', 'Items Data')}
        {showTableHeading.itemDetails && <CIItemDetail paarData={PaarData} />}
      </Table>
    </div>
  );
};

export default Paar;

const PaarForm = ({ PaarData }) => {
  console.log('PaarData:', PaarData);
  const dispatch = useDispatch();

  const [ItemsData, setItemsData] = useState(0);

  const getItemsData = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/shipping/advise/byid', {
        params: {
          shipment_advise_id: id
        }
      });
      const mappedData = data?.map((item, index) => ({
        id: index,
        shipment_advise_item_id: item?.shipment_advise_item_id,
        item_type: item?.po_item?.item_type,
        item_name: item?.po_item?.item_name,
        hsn_code: item?.hsn_code ? item?.hsn_code : 0
      }));
      setItemsData(mappedData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const TableHeader = [
    {
      field: 'item_type',
      headerName: 'Type',
      width: 150
    },
    {
      field: 'item_name',
      headerName: 'Item Name',
      width: 150,
      headerAlign: 'right',
      align: 'right'
    },
    {
      field: 'hsn_code',
      headerName: 'Updated HSN Code',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      rowSpanValueGetter: () => null,
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : ''),

      renderCell: (params) => {
        if (!params.row.summaryRow) {
          return (
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '6px',
                  textAlign: 'right'
                },
                '& .Mui-disabled': {
                  '-webkit-text-fill-color': '#4f4f4f'
                },
                width: '100%'
              }}
              type="number"
              name="hsn_code"
              value={ItemsData[params.row.id]?.hsn_code}
              onChange={(e) => handleChangeAddAmount(e, params.row)}
            />
          );
        }
        return (
          <span
            className="bold"
            style={{
              textAlign: 'right', // Right-align the header text
              marginRight: '20px', // Add margin to the right of the header
              fontWeight: 'bold' // Make the header text bold
            }}
          >
            {params.value}
          </span>
        );
      }
    }
  ];

  const handleChangeAddAmount = (e, row) => {
    const { value } = e.target;
    setItemsData((prevState) => prevState.map((item) => (item.id === row?.id ? { ...item, hsn_code: value } : item)));
    console.log('setItemsData', ItemsData);
  };

  useEffect(() => {
    console.log(PaarData);
    getItemsData(PaarData?.shipment_advice_id);
  }, [PaarData]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    updateDetails: true,
    etaDetails: true
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

  const initialValues = () => {
    if (PaarData.status === 1) {
      return {
        paar_no: PaarData?.paar_data?.paar_num,
        paar_date: dayjs(PaarData?.paar_data?.paar_date),
        received_on: dayjs(PaarData?.paar_data?.received_on),
        exchange_rate: PaarData?.paar_data?.exchange_rate,
        fob_invoice_amount: PaarData?.paar_data?.fob_invoice_amount,
        fob_uplift: PaarData?.paar_data?.fob_uplift,
        freight_uplift: PaarData?.paar_data?.freight_uplift,
        insurance_uplift: PaarData?.paar_data?.insurance_uplift,
        cif_value_naira: PaarData?.paar_data?.cif_value_naira,
        remarks: PaarData?.paar_data?.remarks,
        cfr_invoice_amount: PaarData?.paar_data?.cfr_invoice_amount,
        update_hsn_code: PaarData?.paar_data?.update_hsn_code
      };
    }

    return {
      pfi_num: PaarData?.pfi_num,
      pfi_id: PaarData?.pfi_id,
      ci_num: PaarData?.ci_num,
      ci_id: PaarData?.ci_id,
      paar_no: '',
      paar_date: dayjs(),
      received_on: dayjs(),
      exchange_rate: 0,
      fob_invoice_amount: 0,
      fob_uplift: '',
      freight_uplift: '',
      insurance_uplift: '',
      cif_value_naira: '',
      remarks: '',
      cfr_invoice_amount: 0,
      update_hsn_code: 'No'
    };
  };

  const [file, setFile] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (PaarData?.paar_data?.paar_amendment_requests?.length > 0) {
      let filterArr = PaarData?.paar_data?.paar_amendment_requests?.filter((i) => i.status == 1);
      setFormValuesRevise({
        paar_id: PaarData?.paar_data?.paar_id,
        pfi_num: PaarData?.pfi_num,
        pfi_id: PaarData?.pfi_id,
        ci_num: PaarData?.ci_num,
        ci_id: PaarData?.ci_id,
        paar_revised: filterArr[0].paar_revised,
        paar_amendment_date: dayjs(filterArr[0].paar_amendment_date)
      });
    }
  }, []);

  const [fileRevise, setFileRevise] = useState(null);
  const [formValuesRevise, setFormValuesRevise] = useState({
    paar_id: PaarData?.paar_data?.paar_id,
    pfi_num: PaarData?.pfi_num,
    pfi_id: PaarData?.pfi_id,
    ci_num: PaarData?.ci_num,
    ci_id: PaarData?.ci_id,
    paar_revised: 'No',
    paar_amendment_date: null
  });

  const handleDateChange = (newValue) => {
    setFormValuesRevise((prevValues) => ({
      ...prevValues,
      paar_amendment_date: newValue // Assuming you want to store the Date object
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

  const [base64Paar, setBase64Paar] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files;
    Object.values(selectedFile).forEach(async (file) => {
      if (file && file.type === 'application/pdf') {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await axiosInstance.post('/api/pfi/paar/validatepaar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.status === 200) {
            const data = response.data;

            setFormValues({
              ...formValues,
              paar_no: data?.paar_num,
              paar_date: dayjs(data?.paar_issue_date, 'DD/MM/YYYY')
            });
            setBase64Paar(data?.base64);
            setFile(Object.values(selectedFile));
          }
        } catch (error) {
          toast.error('Invalid PAAR Document');
        }
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
  const handleDrop2 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFileRevise(droppedFile);
    } else {
      alert('Please drop a PDF file.');
    }
  };
  const handleFileSelect2 = (e) => {
    const selectedFile = e.target.files;
    Object.values(selectedFile).forEach((file) => {
      if (file && file.type === 'application/pdf') {
        setFileRevise(Object.values(selectedFile));
      } else {
        alert('Please select a PDF file.');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    formData.append('ItemArr', ItemsData);
    let sendData = { ...formValues, file, ItemsData };
    console.log('formData', formData);
    try {
      await axiosInstance.post('/api/pfi/paar', sendData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Submit successfully');
    } catch (error) {
      console.error('Error deleting container allocations:', error);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    let sendData = { ...formValuesRevise, file: fileRevise };
    try {
      await axiosInstance.post('/api/pfi/paar/revise/request', sendData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Submit successfully');
    } catch (error) {
      console.error('Error deleting container allocations:', error);
    }
  };

  const [PaarRevised, setPaarRevised] = useState('');

  useEffect(() => {
    if (PaarRevised === 'Yes') {
      setFormValues({
        pfi_num: PaarData?.pfi_num,
        pfi_id: PaarData?.pfi_id,
        ci_num: PaarData?.ci_num,
        ci_id: PaarData?.ci_id,
        paar_no: '',
        paar_date: dayjs(),
        received_on: dayjs(),
        exchange_rate: 0,
        fob_invoice_amount: 0,
        fob_uplift: '',
        freight_uplift: '',
        insurance_uplift: '',
        cif_value_naira: '',
        remarks: '',
        cfr_invoice_amount: 0,
        update_hsn_code: 'No',
        revise: true
      });
    } else {
      setFormValues({
        pfi_num: PaarData?.pfi_num,
        pfi_id: PaarData?.pfi_id,
        ci_num: PaarData?.ci_num,
        ci_id: PaarData?.ci_id,
        paar_no: PaarData?.paar_data?.paar_num,
        paar_date: dayjs(PaarData?.paar_data?.paar_date),
        received_on: dayjs(PaarData?.paar_data?.received_on),
        exchange_rate: PaarData?.paar_data?.exchange_rate,
        fob_invoice_amount: PaarData?.paar_data?.fob_invoice_amount,
        fob_uplift: PaarData?.paar_data?.fob_uplift,
        freight_uplift: PaarData?.paar_data?.freight_uplift,
        insurance_uplift: PaarData?.paar_data?.insurance_uplift,
        cif_value_naira: PaarData?.paar_data?.cif_value_naira,
        remarks: PaarData?.paar_data?.remarks,
        cfr_invoice_amount: PaarData?.paar_data?.cfr_invoice_amount,
        update_hsn_code: PaarData?.paar_data?.update_hsn_code
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PaarRevised]);

  return (
    <Box>
      <Table component={'form'} onSubmit={handleSubmit}>
        {renderTableHeader('updateDetails', 'Update Details')}
        {showTableHeading.updateDetails && (
          <>
            {PaarData?.paar_data?.paar_amendment_requests?.length > 0 && (
              <Grid container spacing={2} sx={{ padding: '20px' }}>
                <Grid item xs={2}>
                  <Typography variant="body1">PAAR Revised</Typography>
                  <Select
                    fullWidth
                    name="PaarRevised"
                    value={PaarRevised}
                    onChange={(e) => setPaarRevised(e.target.value)}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      }
                    }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={2} sx={{ padding: '20px' }}>
              <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
                <Grid
                  marginTop="10px"
                  item
                  xs={12}
                  sm={8}
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
                          <Typography
                            onClick={() => dispatch(messageOpen({ type: 'base64', url: base64Paar }))}
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
                        <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                          {/* {values?.documentName ? values?.documentName : 'Upload file'} */}
                          Upload PAAR Document
                        </label>
                        <input multiple type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                      </>
                    )}
                  </div>
                </Grid>
                {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">PAAR No</Typography>
                <TextField
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="paar_no"
                  value={formValues.paar_no}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">PAAR Date</Typography>
                <DatePicker
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  name="paar_date"
                  value={formValues.paar_date}
                  onChange={(date) => setFormValues({ ...formValues, ['paar_date']: date })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Received On</Typography>
                <DatePicker
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  name="received_on"
                  value={formValues.received_on}
                  onChange={(date) => setFormValues({ ...formValues, ['received_on']: date })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">PAAR Exc Rate</Typography>
                <TextField
                  fullWidth
                  type="number"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="exchange_rate"
                  value={formValues.exchange_rate}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">CFR Invoice Amt(PAAR)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="cfr_invoice_amount"
                  value={formValues.cfr_invoice_amount}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">FOB Inv Amt (PAAR)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="fob_invoice_amount"
                  value={formValues.fob_invoice_amount}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">FOB Uplift</Typography>
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="fob_uplift"
                  value={formValues.fob_uplift}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Freight Uplift</Typography>
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="freight_uplift"
                  value={formValues.freight_uplift}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Insurance Uplift</Typography>
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="insurance_uplift"
                  value={formValues.insurance_uplift}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">CIF Value in Naira (PAAR)</Typography>
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="cif_value_naira"
                  value={formValues.cif_value_naira}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Remarks</Typography>
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                  id="insurance-basic"
                  variant="outlined"
                  name="remarks"
                  value={formValues.remarks}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>

              <Grid item xs={2}>
                <Typography variant="body1">Update HSN Code</Typography>
                <Select
                  fullWidth
                  value={formValues?.update_hsn_code || ''}
                  name="update_hsn_code"
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '6px'
                    }
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </Grid>
            </Grid>

            {formValues?.update_hsn_code == 'Yes' && (
              <Box sx={{ marginTop: '20px', width: '40vw' }}>
                <DataGrid
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      height: '25px !important'
                    },
                    '& .bold': {
                      fontWeight: 'bolder'
                    }
                  }}
                  rowHeight={35}
                  unstable_rowSpanning={true}
                  rows={ItemsData}
                  columns={TableHeader}
                  disableRowSelectionOnClick
                  hideFooterSelectedRowCount
                  hideFooterPagination
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {PaarRevised == 'Yes' ? (
                <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                  Revised
                </Button>
              ) : PaarRevised == 'No' ? (
                ''
              ) : (
                <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                  Submit
                </Button>
              )}
            </Box>
          </>
        )}
      </Table>

      {PaarData?.paar_data?.paar_id && (
        <Table>
          {renderTableHeader('etaDetails', 'Revise PAAR ')}
          {showTableHeading.etaDetails && (
            <>
              <Grid container spacing={2} sx={{ padding: '20px' }}>
                <Grid item xs={2}>
                  <Typography variant="body1">PAAR Need to be Revised</Typography>
                  <Select
                    fullWidth
                    value={formValuesRevise?.paar_revised || ''}
                    name="paar_revised"
                    onChange={(e) => setFormValuesRevise({ ...formValuesRevise, [e.target.name]: e.target.value })}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      }
                    }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">PAAR Amendment Req Letter sent to Bank- Date to Be filled </Typography>
                  <DatePicker
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '7px'
                      },
                      width: '100%'
                    }}
                    name="paar_amendment_date"
                    value={formValuesRevise.paar_amendment_date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
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
                    onDrop={handleDrop2}
                    onDragOver={handleDragOver}
                    onClick={handleClick2}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <Typography variant="body1" style={{ marginBottom: '8px' }}>
                        <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                      </Typography>
                      {fileRevise ? (
                        <ol>
                          {fileRevise.map((item, index) => (
                            <Typography component="li" key={index} variant="body1" style={{ marginBottom: '8px', textAlign: 'left' }}>
                              {item.name}
                            </Typography>
                          ))}
                        </ol>
                      ) : (
                        <>
                          <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                            {/* {values?.documentName ? values?.documentName : 'Upload file'} */}
                            Attach Request Letter
                          </label>
                          <input
                            multiple
                            type="file"
                            id="fileInput2"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect2}
                            accept=".pdf"
                          />
                        </>
                      )}
                    </div>
                  </Grid>
                  {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="contained" color="primary" type="submit" onClick={handleSubmit2} sx={{ mr: 2 }}>
                  Submit
                </Button>
              </Box>
            </>
          )}
        </Table>
      )}
    </Box>
  );
};
