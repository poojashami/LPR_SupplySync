import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { axiosInstance } from 'utils/axiosInstance';
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import {
  Box,
  Select,
  TableContainer,
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

import { DatePicker } from '@mui/x-date-pickers';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlusButton from 'components/CustomButton';
import NafdacForm from './NafdacForm';
import NafdacPfiCard from './NafdacPfiCard';
import NafdacPermiView from './NafdacPermitView';
import { useDispatch, useSelector } from 'react-redux';
import { GetPFI } from 'Redux/Apis/GetApiCalls';

const NafdacTable = () => {
  const [file, setFile] = useState(null);

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



  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [nafdacData, setNafdacData] = useState([]);


  const [nafdacView, setNafdacView] = useState(false);
  const [nafdacRowData, setNafdacRowData] = useState({});
  const openAction = Boolean(anchorEl);

  const [currentRow, setCurrentRow] = useState({}); //for dispaly data in pfi card in detail and create view
  const [viewNafdacFrom, setViewNafdacFrom] = useState(false);
  const [viewNafdacDetail, setViewNafdacDetail] = useState(false);

  const toggleNafdacFromView = () => {
    setViewNafdacFrom(!viewNafdacFrom);
  };

  const toggleNafdacDetail = () => {
    setViewNafdacDetail(!viewNafdacDetail);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };


  const handleNafdacView = (data) => {
    setNafdacRowData(data);
    setNafdacView(true);
  };


  const handleNafdacClose = () => {
    setNafdacView(false);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get('/api/pfi/list');
  //       console.log('Fetching data:', response.data);
  //       const formMDataMapped = response.data.map((item, index) => ({
  //         id: index + 1,
  //         pfi_id: item.pfi_id || 2,
  //         pfi_no: item.pfi_num || 'PI-001',
  //         pfi_date: item.pfi_date || '2024-07-15',
  //         consignor: item.controlling_office || 'N/A',
  //         consignee: item.company_id || 'N/A',
  //         pfi_category: item.shipment_mode || 'Electronics',
  //         bank: item.bank || 'HDFC',
  //         currency: item.currency || 'USD',
  //         total_value: item.total_value || 25000,
  //         pfi_general_desc: item.pfi_general_desc || 'N/A',
  //         created_by: item.created_by || 'N/A',
  //         pfi_amount: item.pfi_amount || '2000 USD',
  //         nafdac_pfi: item.nafdac_pfi
  //       }));
  //       console.log('Fetching data:', formMDataMapped);
  //       setNafdacData(formMDataMapped);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setError(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const dispatch = useDispatch();
  const { pfiData: pfi_data } = useSelector((state) => state.PFISlice);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formMDataMapped = pfi_data?.map((item, index) => ({
          id: index + 1,
          pfi_id: item?.pfi_id,
          pfi_no: item?.pfi_num,
          pfi_date: item?.createdAt?.split('T')[0],
          pfi_amount: item?.amount,
          consignor: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
          consignee: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          pfi_category: item?.opo_master?.OprMaster?.item_super_group_master?.item_super_group_name,
          pfi_general_desc: item?.pfi_description,
          currency: item?.opo_master.quotation_master?.currency,
          total_value: item?.amount,
          payment_terms: item?.opo_master.quotation_master.payment_terms,
          shipment_type: item?.opo_master.OprMaster.shipment_mode_name,
          shipment_window: item?.opo_master.quotation_master.lead_time,
          pfi_created_by: item?.createdAt,
          opr_no: item?.opo_master.OprMaster.opr_num,
          pi_sender: item?.pfi_sender_id,
          pi_sender_date: item?.pfi_sent_date,
          pfi_description: item?.pfi_description,
          nafdac_pfi: item?.nafdac_pfi,
          pfi_created_time: item?.createdAt?.split('T')[0],
          supplier: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
          buyer: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          port_of_loading: item?.opo_master?.quotation_master?.port_of_loading,
          country_of_origin_of_goods: item?.opo_master?.quotation_master?.country_origin,
          country_of_supply: item?.opo_master?.quotation_master?.country_supply,
          port_of_dc: `${item?.opo_master?.quotation_master?.country_supply} ${item?.opo_master.quotation_master.port_loading}`,
          final_destination: item?.opo_master?.quotation_master?.RfqMaster?.port_destination_name,
          country_of_final_destination: item?.opo_master.OprMaster.companyMaster.AddressMasters[0].country,
          delivery_time: item?.opo_master.quotation_master.lead_time,
          delivery_terms: item?.opo_master.quotation_master.delivery_terms_quo.delivery_terms_name,
          form_m_no: item?.document_name,
          bank: item?.bank,
          delivery_time1: item?.opo_master.quotation_master.lead_time,
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
          additional_charges: item?.opo_master.quotation_master.additional_costs,
          status: item?.son_pfis?.length,
          VendorsBanksDetailsMaster: item?.VendorsBanksDetailsMaster
        }));
        console.log('Fetching data:', !!formMDataMapped?.nafdac_pfi);
        setNafdacData(formMDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);


  const nafdacColumn = [
    {
      field: 'pfi_no',
      headerName: 'PFI No',
      headerName: 'PFI No',
      width: 120
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
                handleNafdacView(params.row);
                handleClose();
              }}
            >
              <strong>Apply Nafdac Permit</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },

    {
      headerName: 'Status',
      field: 'status',
      renderCell: (params) => (
        // <Button
        //   onClick={() => {
        //     handleNafdacView(params.row);
        //     toggleNafdacFromView();
        //     handleClose();
        //   }}
        //   style={{ color: 'blue' }}
        // >
        //   {params.row.nafdac_pfi !== null ? 'View' : 'Create'}
        // </Button>
        // <Button
        //   onClick={() => {
        //     handleNafdacView(params.row);
        //     toggleNafdacFromView();
        //     handleClose();
        //   }}
        //   style={{ color: 'blue' }}
        // >
        //   {params.row.nafdac_pfi !== null ? 'View' : 'Create'}
        // </Button>
        <Button
          onClick={() => {
            // toggleNafdacFromView()
            params.row.nafdac_pfi !== null ? toggleNafdacFromView() : toggleNafdacFromView();
            setCurrentRow(params.row);
          }}
          style={{ color: 'blue' }}
        >
          {params.row.nafdac_pfi !== null ? 'View' : 'Create'}
        </Button>
      )
    },
    { headerName: 'PI Date', field: 'pfi_date', width: 150 },
    { headerName: 'Importer Name', field: 'consignor', width: 300 },
    { headerName: 'Port Of DC', field: 'consignee', width: 200 }
  ];

  const [showTableBodies, setShowTableBodies] = useState({
    viewPaymentDetails: true
  });

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
          // formData.append(`pfi_id`, SonData?.pfi_id);
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
      toast.success('Form Submitted successfully');
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const [initialValues, setInitialValues] = useState({
    pfiDate: new Date().toISOString(),
    pfiNum: 'PFI-311X2024',
    // pfiId: SonData?.pfi_id,
    payment_types: '',
    son_permit_app_date: dayjs(),
    invoice_rec_date: dayjs(),
    pay: '',
    permit_no: ''
  });


  const [formValues, setFormValues] = useState(initialValues);


  const ApplyNafdacPermitForm = [
    {
      field: 'pfi_no',
      headerName: 'PFI No',
      width: 80
    },
    {
      field: 'pfi_date',
      headerName: 'PFI Date',
      width: 80
    }
  ];


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
            {viewNafdacFrom ? <p>NAFDAC Permit </p> : <p>Pending NAFDAC Permit</p>}
            {/* {viewNafdacFrom || viewNafdacDetail ? (
              {
                viewNafdacFrom && <p>
                <PlusButton label="Back" onClick={toggleNafdacFromView} />
              </p>
              }
            {
              viewNafdacDetail && <p>
                <PlusButton label="Back" onClick={toggleNafdacDetail} />
              </p>

            } ) : (
            ''
            )} */}

            {viewNafdacFrom || viewNafdacDetail ? (
              <>
                {viewNafdacFrom && (
                  <p>
                    <PlusButton label="Back" onClick={toggleNafdacFromView} />
                  </p>
                )}
                {viewNafdacDetail && (
                  <p>
                    <PlusButton label="Back" onClick={toggleNafdacDetail} />
                  </p>
                )}
              </>
            ) : (
              ''
            )}
          </Box>
        }
      >
        {viewNafdacFrom || viewNafdacDetail ? (
          <>
            <NafdacPfiCard pfidata={currentRow} />

            {viewNafdacFrom && <NafdacForm pfidata={currentRow} closeform={toggleNafdacFromView} />}
            {viewNafdacDetail && <NafdacPermiView pfidata={currentRow} />}
          </>
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
            columns={nafdacColumn}
            rows={nafdacData}
          />
        )}
      </MainCard>

      <TableContainer>
        {showTableBodies.viewPaymentDetails && (
          // <Box component="form" onSubmit={handleSubmit}>
          //   <Grid container spacing={2} sx={{ marginTop: '10px' }}>
          //     <Grid item xs={2}>
          //       <Typography variant="body1">NAFDAC Permit Status:</Typography>
          //       <Select
          //         sx={{
          //           '& .MuiInputBase-input': {
          //             padding: '7px'
          //           },
          //           width: '100%'
          //         }}
          //         fullWidth
          //         defaultValue={1}
          //         name="permit_status"
          //         value={formValues.payment_types}
          //         onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          //       >
          //         <MenuItem value={1} selected>
          //           Not Selected
          //         </MenuItem>
          //         <MenuItem value={2}>required</MenuItem>
          //         <MenuItem value={3}>available</MenuItem>
          //       </Select>
          //     </Grid>
          //     <Grid item xs={2}>
          //       <Typography variant="body1">Permit Type:</Typography>
          //       <Select
          //         sx={{
          //           '& .MuiInputBase-input': {
          //             padding: '7px'
          //           },
          //           width: '100%'
          //         }}
          //         fullWidth
          //         defaultValue={1}
          //         name="permit_types"
          //         onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          //       >
          //         <MenuItem value={1} selected>
          //           Not Selected
          //         </MenuItem>
          //         <MenuItem value={2}>a</MenuItem>
          //         <MenuItem value={3}>b</MenuItem>
          //         <MenuItem value={4}>c type PC</MenuItem>
          //       </Select>
          //     </Grid>
          //     <Grid item xs={2}>
          //       <Typography variant="body1">NAFDAC Permit Application Date:</Typography>
          //       <DatePicker
          //         sx={{
          //           '& .MuiInputBase-input': {
          //             padding: '7px'
          //           },
          //           width: '100%'
          //         }}
          //         value={formValues.son_permit_app_date ? dayjs(formValues.son_permit_app_date) : null}
          //         onChange={(date) => setFormValues({ ...formValues, ['nafdac_permit_app_date']: date })}
          //       />
          //     </Grid>
          //     <Grid item xs={2}>
          //       <Typography variant="body1">Invoice Received Date:</Typography>
          //       <DatePicker
          //         sx={{
          //           '& .MuiInputBase-input': {
          //             padding: '7px'
          //           },
          //           width: '100%'
          //         }}
          //         value={formValues.invoice_rec_date ? dayjs(formValues.invoice_rec_date) : null}
          //         onChange={(date) => setFormValues({ ...formValues, ['invoice_rec_date']: date })}
          //       />
          //     </Grid>
          //     <Grid item xs={2}>
          //       <Typography variant="body1">Payment Amount:</Typography>
          //       <TextField
          //         type="number"
          //         sx={{
          //           '& .MuiInputBase-input': {
          //             padding: '7px'
          //           },
          //           width: '100%'
          //         }}
          //         id="insurance-basic"
          //         variant="outlined"
          //         name="pay"
          //         value={formValues.pay}
          //         onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          //       />
          //     </Grid>
          //     <Grid item xs={2}>
          //       <Typography variant="body1">Permit No.:</Typography>
          //       <TextField
          //         sx={{
          //           '& .MuiInputBase-input': {
          //             padding: '7px'
          //           },
          //           width: '100%'
          //         }}
          //         id="insurance-basic"
          //         variant="outlined"
          //         name="permit_no"
          //         value={formValues.permit_no}
          //         onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          //       />
          //     </Grid>

          //     <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
          //       <Grid
          //         marginTop="10px"
          //         item
          //         xs={12}
          //         sm={4}
          //         borderRadius="15px"
          //         style={{
          //           border: '2px dashed #000',
          //           padding: '30px',
          //           textAlign: 'center',
          //           cursor: 'pointer',
          //           position: 'relative',
          //           display: 'flex',
          //           flexDirection: 'column',
          //           justifyContent: 'center',
          //           alignItems: 'center'
          //         }}
          //         onDrop={handleDrop}
          //         onDragOver={handleDragOver}
          //         onClick={handleClick}
          //       >
          //         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          //           <Typography variant="body1" style={{ marginBottom: '8px' }}>
          //             <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
          //           </Typography>
          //           {file ? (
          //             <ol>
          //               {file.map((item, index) => (
          //                 <Typography component="li" key={index} variant="body1" style={{ marginBottom: '8px', textAlign: 'left' }}>
          //                   {item.name}
          //                 </Typography>
          //               ))}
          //             </ol>
          //           ) : (
          //             <>
          //               <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
          //                 {/* {values?.documentName ? values?.documentName : 'Upload file'} */}
          //                 Upload NAFDAC Permit Details
          //               </label>
          //               <input multiple type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
          //             </>
          //           )}
          //         </div>
          //       </Grid>
          //       {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
          //     </Grid>
          //   </Grid>

          //   <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          //     <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
          //       Submit
          //     </Button>
          //   </Box>
          // </Box>
          <></>
        )}
      </TableContainer>

      {/* nafdac form  */}
    </div>
  );
};

export default NafdacTable;
