/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, Grid, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import { Typography, IconButton } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import QuotationView from './poView';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { GetPurchaseOrder } from 'Redux/Apis/GetApiCalls';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogActions, TextField, Button } from '@mui/material';
import { AcceptPOSubmit } from 'Redux/Apis/PostApiCalls';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { axiosInstance } from 'utils/axiosInstance';
import { styled } from '@mui/system';
import ValidationStar from 'components/ValidationStar';
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import dayjs from 'dayjs';
import { setPO, setPOGRN } from 'Redux/Slices/POSlice';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export default function QuotationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { purchaseOrder } = useSelector((state) => state.purchaseOrder);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotationData, setQuotationData] = useState([]);
  const [poData, setPoData] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [remarks, setRemarks] = useState(false);
  const [dispatchDate, setDispatchDate] = useState(dayjs());
  const [poNum, setPoNum] = useState(false);
  const [fileArray, setFileArray] = useState([{ file: null, name: '', remark: '' }]);
  const [confirmation, setConfirmation] = useState('');
  const [paymentViewData, setPaymentViewData] = useState({ img: '' });

  useEffect(() => {
    GetPurchaseOrder(dispatch);
  }, []);
  const handleInputChangeFile = (e, index, field) => {
    const { value } = e.target;
    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };
  const handleFileChangeFile = (e, index) => {
    const file = e.target.files[0];

    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, file: file } : item)));
  };
  const addFileEntry = () => {
    setFileArray((prevArray) => [...prevArray, { file: null, name: '', remark: '' }]);
  };
  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });
  const removeFileEntry = (index) => {
    setFileArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const renderMilestones = (milestones) => {
    return (
      <table style={{ width: '100%' }}>
        <tbody>
          <tr style={{ display: 'flex', alignItems: 'center' }}>
            {milestones.map((milestone, index) => {
              const trimmedMilestone = milestone.trim(); // Clean up spaces
              const isCompleted = trimmedMilestone.charAt(trimmedMilestone.length - 1) === 'D'; // Check if completed
              return (
                <>
                  <td key={index} style={{ padding: '5px', border: 'lightgrey solid 1px', marginRight: '5px', backgroundColor: isCompleted ? '#aff3af' : 'lightorange' }}>
                    {isCompleted ? (
                      <CloudDoneIcon style={{ fontSize: '16px', marginRight: '4px', color: 'blue' }} />
                    ) : (
                      <PendingActionsIcon style={{ fontSize: '16px', marginRight: '4px', color: 'red' }} />
                    )}
                    {/* </td>
                  <td key={index} style={{ padding: '5px' }}> */}
                    <span>{trimmedMilestone.substring(0, trimmedMilestone.length - 2)}</span> {/* Remove last 2 characters */}
                  </td>
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };


  const TableHeader = [
    { field: 'id', headerName: 'Sr No.', width: 80 },
    {
      field: 'status',
      headerName: 'PO Status',
      width: 180,
      renderCell: (params) => (
        <div>
          {params.value === '2' || params.value === 2 ? (
            <Chip
              label="Acceptance Pending"
              onClick={() => handleAcceptPO(params.row)}
              sx={{ width: '200px', background: '#b2ebf2', color: 'black' }}
            />
          ) : params.value === '6' || params.value === 6 || params.value === 9 ? (
            <Chip
              label="Payment Confirmation Pending"
              onClick={() => handleAcceptPayment(params.row)}
              color="info"
              sx={{ width: '200px' }}
            />
          ) : params.value === '4' ? (
            <Button variant="text" style={{ color: 'red', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Rejected By Vendor
            </Button>
          ) : params.value === '5' ? (
            <Chip label="Payment Processing" color="info" sx={{ width: '200px' }} />
          ) : params.value === '7' || params.value === 7 ? (
            <Chip
              onClick={() => {
                dispatch(setPO(params.row));
                navigate('/dispatch');
                // handleSubmitFiles(params.row);
              }}
              label="Order In Process"
              sx={{ width: '200px', background: '#00e676', color: 'black' }}
            />
          ) : params.value === '8' || params.value === 8 ? (
            <Chip
              onClick={() => {
                dispatch(setPOGRN(params.row));
                navigate('/dispatch');
                // handleSubmitFiles(params.row);
              }}
              label="Dispatch req. received"
              sx={{ width: '200px', background: '#fff59d', color: 'black' }}
            />
          ) : params.value === '10' || params.value === 10 ? (
            <Button variant="text" style={{ color: 'green', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Final Payment Done
            </Button>
          ) : params.value === '11' || params.value === 11 ? (
            <Chip label=" Shipment Advise Done" color="info" sx={{ width: '200px' }} />
          ) : (
            <Chip label="Payment Processing" sx={{ width: '200px', color: 'white', background: '#4F75FF' }} />
          )}
        </div>
      )
    },
    {
      field: 'po_num',
      headerName: 'Purchase Order Number',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'quo_num', headerName: 'OPO Numbers', width: 200 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 150 },
    { field: 'total_cost', headerName: 'Total Amount', width: 150 },
    { field: 'created_on', headerName: 'PO Date', width: 120 },
    {
      field: 'milestone',
      headerName: 'Payment Status',
      width: 500,
      renderCell: (params) => {
        const milestones = params.value.split(','); // Split milestones string into array
        return <div>{renderMilestones(milestones)}</div>; // Render multiple milestone sections in a single column
      }
    },
  ];

  const handleSave = async () => {
    let status = 0;
    if (confirmation === 'yes') {
      status = 1;
    } else if (confirmation === 'no') {
      status = 0;
    }
    const data = {
      po_id: poNum.po_id,
      status: status,
      remarks: remarks,
      updated_by: 'Admin'
    };
    await AcceptPOSubmit(dispatch, data);
    console.log('Data:', data);
    setOpen(false);
    await GetPurchaseOrder(dispatch);
  };

  const handleSave2 = async (params) => {
    console.log(params);
    if (params?.status === 9) {
      const { data } = await axiosInstance.post('/api/po/finalpaymentconfirm', {
        po_id: params.po_id,
        final_doc_dispatch_no: remarks,
        disptach_date: dispatchDate
      });
      console.log('Data:', data);
    } else {
      const { data } = await axiosInstance.post('/api/po/paymentconfirm', {
        status: params.status,
        po_id: params.po_id,
        remarks: remarks
      });
      console.log('Data:', data);
    }

    setOpen2(false);
    await GetPurchaseOrder(dispatch);
  };

  const handleSave3 = async (params) => {
    try {
      const file_data_arr = fileArray.map((item) => ({
        file: item?.file,
        type: item?.name,
        title: item?.remark
      }));
      const { data } = await axiosInstance.post(
        '/api/po/completecnfrm',
        {
          po_id: params.po_id,
          pocompletion_docslist: file_data_arr
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setOpen3(false);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }

    console.log('Data:', data);
    setOpen2(false);
    await GetPurchaseOrder(dispatch);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleViewClick = async (quotation) => {
    console.log('Clicked');
    setPoData({ ...quotation });
  };

  const handleAcceptPO = async (params) => {
    setPoNum(params);
    setOpen(true);
  };
  // const handleSubmitFiles = async (params) => {
  //   setPoNum(params);
  //   setOpen3(true);
  // };
  const handleAcceptPayment = async (params) => {
    setPoNum(params);
    const { data } = await axiosInstance.get('/api/payment-transactions/bydocid', {
      params: {
        doc_id: params.po_id
      }
    });
    setPaymentViewData({
      img: `data:image/png;base64,${data[0]?.receipt_image}`,
      bank_charges: data[0]?.bank_charge,
      bank_refenence_no: data[0]?.bank_refenence_no,
      createdAt: data[0]?.createdAt,
      created_by: data[0]?.created_by,
      doc_id: data[0]?.doc_id,
      from_bank_detail_id: data[0]?.from_bank_detail_id,
      payment_amount: data[0]?.payment_amount,
      payment_date: data[0]?.payment_date,
      payment_request_id: data[0]?.payment_request_id
    });
    setOpen2(true);
  };

  const handleRadioChange = (event) => {
    setConfirmation(event.target.value);
  };

  useEffect(() => {
    console.log('purchaseOrder', purchaseOrder);
    const mappedData = purchaseOrder
      ?.map((po, index) => ({
        id: index + 1,
        po_id: po.po_id,
        po_num: po.po_num,
        quo_num: po.opo_nums,
        vendor_id: po.vendor_id,
        po_amount: po.total_cost,
        total_cost: Number(po.total_cost) +
          po?.opo_master?.quotation_master?.additional_costs?.reduce((acc, amount) => { return amount.charges_by === "Supplier" && !amount.reference_table_name ? acc = Number(acc) + Number(amount.charge_amount) : acc }, 0),
        vendor_name: po?.VendorsMaster?.vendor_name,
        quo_id: po.quo_id,
        created_on: po.created_on.split('T')[0],
        status: po.status,
        final_doc_dispatch_no: po.final_doc_dispatch_no,
        disptach_date: po.disptach_date,
        lead_time: po.lead_time,
        acceptance_remarks: po.acceptance_remarks,
        po_items: po.po_items,
        VendorsMaster: po.VendorsMaster,
        quotation_master: po?.opo_master?.quotation_master,
        milestone: po?.opo_master?.quotation_master?.payment_milestones
          ?.map((item) => `${item.milestone} ${item.percentage}% ${item.status === 5 ? 'D' : 'P'}`)
          ?.join(', ')
      }))
      .filter((item) => item.status !== '1' && item.status !== 1);

    setQuotationData(mappedData);
  }, [purchaseOrder]);

  const handleViewClose = () => {
    setPoData(null);
    setShowQuotationForm(false);
  };
  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showQuotationForm ? <span>Purchase Order Status</span> : <span>Create Quotation</span>}

            {/* {!showQuotationForm ? (
              <Button color="primary" className="plus-btn-color" onClick={handleCreateOpr}>
                + Create Quotation
              </Button>
            ) : (
              <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
                Back
              </Button>
            )} */}
          </Box>
        }
      >
        {poData ? (
          <QuotationView vendor_mode={true} oprViewData={poData} handleAcceptPO={handleAcceptPO} onClose={handleViewClose} />
        ) : (
          <div>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '70vh',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',

                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={quotationData}
              columns={TableHeader}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />

            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: '50vh',
                  height: '46vh',
                  width: '75vh',
                  border: '10px solid #a1bcdb'
                }
              }}
            >
              <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
                Purchase Order No.- <b style={{ color: 'blue' }}>({poNum.po_num})</b> Dt-<b style={{ color: 'blue' }}>{poNum.created_on}</b>
              </DialogTitle>
              <Divider />
              <div style={{ padding: '20px' }}>
                <p>
                  {/* Are you sure you want to confirm PO num is <b>({poNum.po_num})</b>, date is <b>({poNum.created_on})</b> and Amount is
                  <b>({poNum.total_cost})</b> ? */}
                  <b>Do you want to confirm this Purchase Order (PO)?</b>
                </p>
                <FormControl>
                  {/* <FormLabel id="demo-radio-buttons-group-label">Are You Sure to Confirm this PO?</FormLabel> */}
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    style={{ display: 'flex', width: '100%', flexDirection: 'row' }}
                    value={confirmation}
                    onChange={handleRadioChange}
                  >
                    <div>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    </div>
                    <div>
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </div>
                  </RadioGroup>
                </FormControl>
                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="remarks"
                    name="remarks"
                    placeholder="Remarks"
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Grid>
              </div>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={open2}
              onClose={handleClose2}
              PaperProps={{
                style: {
                  maxHeight: '50vh',
                  height: '46vh',
                  width: '75vh',
                  border: '10px solid #a1bcdb'
                }
              }}
            >
              <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
                Purchase Order No.- <b style={{ color: 'blue' }}>({poNum.po_num})</b> Date-
                <b style={{ color: 'blue' }}>{poNum.created_on}</b>
              </DialogTitle>
              <Divider />
              <div style={{ padding: '20px' }}>
                <img width={500} height={400} src={paymentViewData?.img} alt="" />
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Bank Info</TableCell>
                        <TableCell align="right">Created</TableCell>
                        <TableCell align="right">Payment Amt</TableCell>
                        <TableCell align="right">Payment Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell scope="row">
                          {paymentViewData?.bank_charges}
                          {paymentViewData?.bank_refenence_no}
                        </TableCell>
                        <TableCell align="right">
                          {paymentViewData?.createdAt?.split('T')[0]} By: {paymentViewData?.created_by}
                        </TableCell>
                        <TableCell align="right">{paymentViewData?.payment_amount}</TableCell>
                        <TableCell align="right">{paymentViewData?.payment_date}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <p>
                  <b>Do you Accept this Payment?</b>
                </p>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    style={{ display: 'flex', width: '100%', flexDirection: 'row' }}
                    value={confirmation}
                    onChange={handleRadioChange}
                  >
                    <div>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    </div>
                    <div>
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </div>
                  </RadioGroup>
                </FormControl>
                {poNum?.status === 9 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        variant="outlined"
                        id="remarks"
                        name="remarks"
                        placeholder="Dispatch Doc. No."
                        onChange={(e) => setRemarks(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      {console.log(poNum?.status)}
                      <DatePicker
                        value={dispatchDate}
                        onChange={(date) => setDispatchDate(date)}
                        sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item xs={6} sm={6}>
                    <TextField
                      variant="outlined"
                      id="remarks"
                      name="remarks"
                      fullWidth
                      placeholder="Remarks"
                      onChange={(e) => setRemarks(e.target.value)}
                      sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
                    />
                  </Grid>
                )}
              </div>
              <DialogActions>
                <Button onClick={handleClose2} color="primary">
                  Close
                </Button>
                <Button onClick={() => handleSave2(poNum)} color="primary" variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={open3}
              onClose={handleClose3}
              PaperProps={{
                style: {
                  minWidth: '50vw',
                  maxHeight: '70vh',
                  height: '46vh',
                  border: '10px solid #a1bcdb'
                }
              }}
            >
              <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
                Upload Docs for Purchase Order No.- <b style={{ color: 'blue' }}>({poNum.po_num})</b> Dt-
                <b style={{ color: 'blue' }}>{poNum.created_on}</b>
              </DialogTitle>
              <Divider />
              <div style={{ padding: '20px' }}>
                {fileArray?.map((item, index) => (
                  <Grid
                    key={index + 1}
                    container
                    spacing={1}
                    alignItems="center"
                    sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
                  >
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        {index + 1}
                        <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Doc Name"
                        value={item.name}
                        onChange={(e) => handleInputChangeFile(e, index, 'name')}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Remark"
                        onChange={(e) => handleInputChangeFile(e, index, 'remark')}
                        value={item.remark}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div>
                        <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                          Select
                          <VisuallyHiddenInput type="file" onChange={(e) => handleFileChangeFile(e, index)} />
                        </Button>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      {item.file && <span style={{ color: 'blue' }}>{item.file.name}</span>}
                    </Grid>
                    {index !== 4 && (
                      <Grid item xs={12} sm={1}>
                        <IconButton aria-label="add" size="large" onClick={addFileEntry}>
                          <AddCircleOutlineIcon fontSize="large" color="success" />
                        </IconButton>
                      </Grid>
                    )}
                    {fileArray.length !== 1 && (
                      <Grid item xs={12} sm={1}>
                        <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
                          <DeleteIcon fontSize="large" color="error" />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </div>
              <DialogActions>
                <Button onClick={handleClose3} color="primary">
                  Close
                </Button>
                <Button onClick={() => handleSave3(poNum)} color="primary" variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </MainCard>
    </>
  );
}
