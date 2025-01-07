import React, { useEffect, useRef, useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Box,
  Grid,
  Select,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  IconButton,
  Menu,
  TableHead,
  TableContainer
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PlusButton from 'components/CustomButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LcPfi from './LcPfi';
import Son from './Son';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { GetPFI } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';
import { messageOpen } from 'Redux/Slices/StaticSlice';

const FormMTable = () => {
  const dispatch = useDispatch();
  const { pfiData } = useSelector((state) => state.PFISlice);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [formMData, setFormMData] = useState([]);
  const [formMForm, setFormMForm] = useState(false);
  const [formMRowData, setFormMRowData] = useState({});
  const [lcForm, setLcForm] = useState(false);
  const [lcRowData, setLcRowData] = useState({});
  const [sonForm, setSonForm] = useState(false);
  const [sonRowData, setSonRowData] = useState({});
  const [dataforformm, setDataforformm] = useState({});
  const openAction = Boolean(anchorEl);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);

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

  // const handleOpenLC = (data) => {
  //   setLcRowData(data);
  //   setLcForm(true);
  // };

  // const handleOpenSon = (data) => {
  //   setSonRowData(data);
  //   setSonForm(true);
  // };

  const [pfi_data, setPfi_data] = useState(null);

  const set_applied_date = (e, data) => {
    try {
      handleClickOpen();
      setPfi_data(data);
      setFormMData((prev) => prev.map((item, index) => (index === data.id - 1 ? { ...item, dataforformm: e.target.value } : item)));
      setDataforformm(e.target.value);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFormMClose = () => {
    setFormMForm(false);
    setLcForm(false);
    setSonForm(false);
  };

  const fetchData = async () => {
    try {
      const formMDataMapped = pfiData.map((item, index) => ({
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
        // bank: item?.bank,
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
        status: item?.form_ms[0]?.form_m_num ? 'View' : item?.form_ms[0]?.form_m_date && 'Create',
        VendorsBanksDetailsMaster: item?.VendorsBanksDetailsMaster,
        bank: item?.VendorsBanksDetailsMaster?.bank_name,
        form_ms: item?.form_ms[0],
        dataforformm: item?.form_ms[0]?.form_m_date,
        insurenceId: item?.insurances[0]?.insurance_id,
        insurenceNum: item?.insurances[0]?.insurance_certificate_num,
        formM_id: item?.form_ms[0]?.form_m_id
      }));
      console.log('Fetching data:', formMDataMapped);
      setFormMData(formMDataMapped);
    } catch (error) {
      console.error('Error fetching data:', error); // Log error
      // setError(error); // Update state with error
    }
  };
  useEffect(() => {
    fetchData();
  }, [pfiData]);

  const FormMColumn = [
    {
      field: 'pfi_no',
      headerName: 'PFI No',
      width: 120
    },
    {
      headerName: 'Status',
      field: 'status',
      renderCell: (params) => (
        <Button
          onClick={() => {
            handleOpenFormM(params.row);
            handleClose();
          }}
          style={{ color: 'blue' }}
        >
          {params.row.status}
          {console.log(params.row.value)}
        </Button>
      )
    },
    { headerName: 'PFI Date', field: 'pfi_date' },
    {
      headerName: 'Applied Date',
      field: 'dataforformm',
      width: 180,
      renderCell: (params) => {
        {
          console.log('params', params?.value);
        }
        return !params?.value ? (
          <TextField
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              }
            }}
            type="date"
            variant="outlined"
            name="formm_date"
            value={params.row.dataforformm?.split('T')[0]}
            onChange={(e) => set_applied_date(e, params.row)}
          />
        ) : (
          params?.value?.split('T')[0]
        );
      }
    },
    // : {
    //     headerName: 'Applied Date',
    //     field: dataforformm,
    //     width: 180,
    //     renderCell: (params) => {
    //       return params.row.form_ms?.form_m_date?.split('T')[0];
    //     }
    //   },
    { headerName: 'Consignor', field: 'consignor' },
    { headerName: 'Consignee', field: 'consignee' },
    { headerName: 'PFI Category', field: 'pfi_category' },
    { headerName: 'PFI Desc', field: 'pfi_general_desc' },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'PI Total', field: 'total_value' },
    { headerName: 'Bank', field: 'bank' },
    { headerName: 'PI Created By', field: 'created_by' }
  ];

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseOped = () => {
    setOpen(false);
  };

  const handle_update_date = async () => {
    try {
      const { data } = await axiosInstance.post('/api/formm', {
        pfiId: pfi_data?.pfi_id,
        pfiNum: pfi_data?.pfi_no,
        formm_date: dataforformm
      });
      console?.log(data, {
        pfiId: pfi_data?.pfi_id,
        pfiNum: pfi_data?.pfi_no,
        formm_date: dataforformm
      });
      fetchData();
      handleCloseOped();
    } catch (error) {
      toast.error(error.message);
      handleCloseOped();
    }
  };

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
            {formMForm ? (
              <p>
                FORM M for PFI Num : <b style={{ color: 'blue' }}> ({formMRowData.pfi_no})</b>
              </p>
            ) : (
              <p>Pending FORM M Application</p>
            )}
            {formMForm ? <PlusButton label="Back" onClick={handleFormMClose} /> : ''}
          </Box>
        }
      >
        <div>
          {formMForm ? (
            <FormM formMData={formMRowData} onclose={handleFormMClose} />
          ) : (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '70vh',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              columns={FormMColumn}
              rows={formMData}
              loading={formMData?.length < 1 ? true : false}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}
        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'You are updating Form M Date'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You are updating Applied date for PFI No. <span style={{ color: 'red' }}>{pfi_data?.pfi_no}</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOped}>Disagree</Button>
            <Button onClick={handle_update_date} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </div>
  );
};
export default FormMTable;

const FormM = ({ formMData, onclose }) => {
  return (
    <div>
      <Pfi_Data pfi_id={formMData?.pfi_id} />
      <FormMForm formMData={formMData} onclose={onclose} />
    </div>
  );
};

// export default FormM;

const FormMForm = ({ formMData, onclose }) => {
  // console.log(formMData);
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

  const [doc, setDoc] = useState(null);

  const getBanks = async () => {
    try {
      const { data } = await axiosInstance.get('/api/vendor/bankdropdn');
      setBankList(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    // GetFormMData();
    getBanks();
    return () => {};
  }, []);

  const [file, setFile] = useState(null);
  const [formValues, setFormValues] = useState();

  useEffect(() => {
    setFormValues(
      formMData?.form_ms
        ? {
            form_m_id: formMData?.formM_id,
            pfiNum: formMData?.pfi_no,
            pfiId: formMData?.pfi_id,
            insurenceId: formMData?.insurenceId,
            insurenceNum: formMData?.insurenceNum,
            formM_number: formMData?.form_ms?.form_m_num,
            formm_date: formMData?.form_ms?.form_m_date,
            pi_description: formMData?.form_ms?.pfi_description,
            formm_expiry_date: formMData?.form_ms?.form_m_expiry_date?.slice(0, 10),
            ba_number: formMData?.form_ms?.ba_num,
            formm_rec_date: formMData?.form_ms?.form_m_recd_date
          }
        : {
            form_m_id: formMData?.formM_id,
            pfiNum: formMData?.pfi_no,
            pfiId: formMData?.pfi_id,
            insurenceId: formMData?.insurenceId,
            insurenceNum: formMData?.insurenceNum,
            formM_number: '',
            formm_date: null,
            pi_description: '',
            formm_expiry_date: null,
            ba_number: '',
            formm_rec_date: new Date().toISOString()
          }
    );
  }, [formMData]);
  const [bankList, setBankList] = useState([]);
  const [base64FormM, setbase64FormM] = useState(null);

  const dispatch = useDispatch();

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) {
      alert('No files dropped');
      return;
    }

    for (const file of droppedFiles) {
      if (file && file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axiosInstance.post('/api/formm/validatedoc', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.status === 200) {
            const data = response.data;

            setFormValues({
              form_m_id: formMData?.formM_id,
              pfiNum: formMData?.pfi_no,
              pfiId: formMData?.pfi_id,
              insurenceId: formMData?.insurenceId,
              insurenceNum: formMData?.insurenceNum,
              formM_number: data?.formM_number,
              formm_date: formMData?.form_ms?.form_m_date,
              pi_description: formMData?.form_ms?.pfi_description,
              formm_expiry_date: dayjs(data?.formm_expiry_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              ba_number: data?.ba_number,
              formm_rec_date: formMData?.form_ms?.form_m_recd_date || new Date().toISOString()
            });
            setbase64FormM(data?.base64);
            setFile(Array.from(droppedFiles));
          } else {
            toast.error('Please upload a valid FORM M document');
            throw new Error('Error uploading file');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error('There was an error uploading the file. Please try again.');
        }
      } else {
        alert('Please drop a valid PDF file.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files;

    Object.values(selectedFile).forEach(async (file) => {
      if (file && file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await axiosInstance.post('/api/formm/validatedoc', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.status === 200) {
            const data = response.data;
            console.log('API Response: ', response.data);
            setFormValues(
              formMData?.form_ms
                ? {
                    form_m_id: formMData?.formM_id,
                    pfiNum: formMData?.pfi_no,
                    pfiId: formMData?.pfi_id,
                    insurenceId: formMData?.insurenceId,
                    insurenceNum: formMData?.insurenceNum,
                    formM_number: data?.formM_number,
                    formm_date: formMData?.form_ms?.form_m_date,
                    pi_description: formMData?.form_ms?.pfi_description,
                    formm_expiry_date: dayjs(data?.formm_expiry_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                    ba_number: data?.ba_number,
                    formm_rec_date: formMData?.form_ms?.form_m_recd_date
                  }
                : {
                    form_m_id: formMData?.formM_id,
                    pfiNum: formMData?.pfi_no,
                    pfiId: formMData?.pfi_id,
                    insurenceId: formMData?.insurenceId,
                    insurenceNum: formMData?.insurenceNum,
                    formM_number: data?.formM_number,
                    formm_date: null,
                    pi_description: '',
                    formm_expiry_date: dayjs(data?.formm_expiry_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                    ba_number: data?.ba_number,
                    formm_rec_date: new Date().toISOString()
                  }
            );
            setbase64FormM(data?.base64);
            setFile(Object.values(selectedFile));
          } else {
            toast.error('Please upload a valid FORM M document');
            throw new Error('Error uploading file');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      } else {
        alert('Please select a PDF file.');
      }
    });
  };

  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    const { data } = await axiosInstance.post('/api/formm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    onclose();
    console.log(data);
  };

  return (
    <TableContainer>
      <Table>{renderTableHeader('viewPaymentDetails', 'FORM M Info')}</Table>
      {showTableBodies.viewPaymentDetails && (
        <Box component="form" onSubmit={handleSubmit}>
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
                {doc && <iframe title="title" src={`data:application/pdf;base64${doc}`} frameBorder="0" />}
                {file ? (
                  <ol>
                    {file.map((item, index) => (
                      <Typography
                        onClick={() => dispatch(messageOpen({ type: 'base64', url: base64FormM }))}
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
                      Upload FORMM Doc
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      // multiple
                      id="fileInput"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                      accept=".pdf"
                    />
                  </>
                )}
              </div>
            </Grid>
            {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: '50px' }}>
            <Grid item xs={2}>
              <Typography variant="body1">FORMM No. (11 Digit)</Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                id="insurance-basic"
                variant="outlined"
                placeholder="Form M"
                name="formM_number"
                disabled
                value={formValues?.formM_number}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">FORMM Applied Date</Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                type="date"
                variant="outlined"
                disabled
                name="formm_date"
                value={formValues?.formm_date ? formValues?.formm_date.slice(0, 10) : ''}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">FORMM Expiry Date</Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                type="date"
                variant="outlined"
                disabled
                name="formm_expiry_date"
                value={formValues?.formm_expiry_date ? formValues?.formm_expiry_date : ''}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">BA No. (11 Digit)</Typography>
              <TextField
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                disabled
                variant="outlined"
                value={formValues?.ba_number}
                name="ba_number"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">FORMM Recd. Date</Typography>
              <TextField
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                type="date"
                variant="outlined"
                name="formm_rec_date"
                value={formValues?.formm_rec_date ? formValues?.formm_rec_date.slice(0, 10) : ''}
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
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
