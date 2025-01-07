import React, { useState, useEffect } from 'react';
import PFIForm from '../Logistics/pfi/pfiForm';
import 'jspdf-autotable';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import formattedDateTime from 'utils/time';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ValidationStar from 'components/ValidationStar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Grid,
  Table,
  Radio,
  Select,
  Dialog,
  Button,
  Divider,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  RadioGroup,
  Typography,
  IconButton,
  FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText
} from '@mui/material';
// import PfiMargin from './pfiMargin';
import { AcceptPOSubmit } from 'Redux/Apis/PostApiCalls';
// import {logo} from '../../../public/Images/LogoB.png';
// import { QuotationChargesSubmit } from 'Redux/Apis/PostApiCalls';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { axiosInstance } from 'utils/axiosInstance';
import { GetPaymentType } from 'Redux/Apis/GetApiCalls';
import { poPaymentRequest } from 'Redux/Apis/PostApiCalls';
import Quotation_Data from 'components/BasicDataComponent/Quotation_Data';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { NoButton, YesButton } from 'components/DialogActionsButton';

const POView = ({ oprViewData, onClose, vendor_mode }) => {
  console.log('oprViewData', oprViewData);
  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });

  const dispatch = useDispatch();
  const [open3, setOpen3] = useState();
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState();
  const [open2, setOpen2] = useState(false);
  const [comment, setComment] = useState('');
  const [approval, setApproval] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [isApproved, setIsApproved] = useState(false);
  // const [paymentTerm, setPaymentTerm] = useState(100);
  const [approvalPOOpen, setApprovalPOOpen] = useState(false);
  const [fileArray, setFileArray] = useState([
    { name: 'PO Signed Copy', remark: '', file: null },
    { name: 'PFI', remark: '', file: null }
  ]);
  let selectedMilestone = `${milestones[0]?.milestone} ${milestones[0]?.percentage}%`;
  let selectedMilestoneArr = milestones[0];
  const [amount, setAmount] = useState();
  const [confirmation, setConfirmation] = useState('');
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additionalCost: false,
    additionalChargesBreakup: true,
    approvals: true,
    PaymentRequest: true,
    ItemDetails: true,
    ReqDocsDetails: true
  });

  const handleAcceptPO = () => {
    setOpen3(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleRadioChange = (event) => {
    setConfirmation(event.target.value);
  };

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChangeFile = (e, index) => {
    const file = e.target.files[0];

    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, file: file } : item)));
  };

  const removeFileEntry = (index) => {
    setFileArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };
  const addFileEntry = () => {
    setFileArray((prevArray) => [...prevArray, { file: null, name: '', remark: '' }]);
  };

  const sendApprovalRequest = async () => {
    try {
      const { data } = await axiosInstance.post('/api/approval/logs', {
        doc_type: 'PO',
        doc_id: oprViewData.po_id,
        doc_number: oprViewData.po_num,
        employee_id: 2,
        action: 'Accept',
        comments: comment,
        from_level: 0
      });
      toast.success(data?.message || 'Sent for approval');
      get_data();
      setComment();
      handleClose();
    } catch (error) {
      toast.error(error.message);
      setComment();
      handleClose();
    }
  };
  const handleInputChangeFile = (e, index, field) => {
    const { value } = e.target;
    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };
  const ApprovalHeader = [
    { field: 'id', headerName: 'Sl. No.', width: 60 },
    { field: 'user_name', headerName: 'Concurred By', width: 100 },
    { field: 'concurrence_remarks', headerName: 'Concurrence Remarks', width: 200 },
    {
      field: 'createdAt',
      headerName: 'Concurrence Time',
      width: 200,
      renderCell: (params) => <span>{params.value.split('T')[0]}</span>
    },
    { field: 'approval_status', headerName: 'Action', width: 100 },
    { field: 'action', headerName: 'Last Status', width: 100 }
  ];

  const [milestoneAmount, setMilestoneAmount] = useState();
  useEffect(() => {
    GetPaymentType(dispatch);
    getMilestones();
  }, []);

  const [handlePfi, setHandlePfi] = useState(false);
  const handleClosePfi = () => setHandlePfi(false);
  const handleOpenPfi = () => setHandlePfi(true);
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

  const [quotationItm, setQuotationItm] = useState(null);

  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'vendor_item_name', headerName: 'Vendor Item Name', width: 200 },
    { field: 'vendor_hs_name', headerName: 'Vendor HS Name', width: 200 },
    { field: 'oprQty', headerName: 'PO Quantity', width: 100 },
    { field: 'tolerance_qty', headerName: 'Tolerance Quantity', width: 100 },
    { field: 'inward_qty', headerName: 'Inward Quantity', width: 100 },
    { field: 'pending_inward_qty', headerName: 'Pending Inward Quantity', width: 100 },
    { field: 'pending_outward_qty', headerName: 'Pending Outward Quantity', width: 100 },
    { field: 'qty_uom', headerName: 'Quantity UOM', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'tax', headerName: 'TAX', width: 100 },
    { field: 'tax_assess_value', headerName: 'TAX Assess Value', width: 100 },
    { field: 'total_tax_value', headerName: 'Total Tax Value', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 },
    { field: 'opo_num', headerName: 'OPO Num', width: 120 }
  ];

  const [selectedVendorBank, setSelectedVendorBank] = useState([]);
  const [bankTypeId, setBankTypeId] = useState('');

  // eslint-disable-next-line no-unused-vars
  const handleSave = async () => {
    console.log('milestones', milestones);
    let data = {
      doc_type: oprViewData?.status === 8 ? 'f_po' : 'po',
      doc_id: oprViewData.po_id,
      po_number: oprViewData.po_num,
      po_amount: oprViewData.total_cost,
      advice_amount: +amount,
      advice_date: formattedDateTime,
      vendor_id: oprViewData.vendor_id,
      bank_type_id: bankTypeId,
      amount_payment_term: milestoneAmount,
      remarks: remarks,
      payment_type_id: milestones[0]?.payment_milestone_id
    };

    console.log('Submit Data:', data);
    await poPaymentRequest(dispatch, data);
    // setOpen(false);
    // await GetPurchaseOrder(dispatch);
  };

  const handleAcceptPOSubmit = async () => {
    try {
      const data = {
        po_id: oprViewData?.po_id,
        status: confirmation === 'yes' ? true : false,
        remarks: remarks,
        po_num: oprViewData?.po_num,
        fileArray: fileArray,
        updated_by: 'Admin'
      };
      await AcceptPOSubmit(dispatch, data);
      console.log('Data:', data);
      onClose();
      setOpen3(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const mapdata = oprViewData?.po_items?.map((item, index) => ({
      id: index + 1,
      item_type: item?.item_type,
      item_name: item?.item_name,
      item_code: item?.item_code,
      no_packs: item?.no_packs,
      oprQty: item?.po_qty,
      pack_size: item?.pack_size,
      pack_type: item?.pack_type,
      line_total: item?.line_total,
      rate: item?.rate,
      opo_num: item?.opo_num,
      tolerance_qty: item?.ItemsMaster?.tolerance,
      qty_uom: item?.ItemsMaster?.uom,
      vendor_item_name: item?.ItemsMaster?.item_description,
      vendor_hs_name: item?.ItemsMaster?.hsn_code,
      inward_qty: item?.grn_qty,
      pending_inward_qty: item?.po_qty - item?.grn_qty
    }));
    setQuotationItm(mapdata);
  }, []);


  const getMilestones = async () => {
    try {
      const { data } = await axiosInstance.get('/api/quotation/quotes/milestone', {
        params: {
          quo_id: oprViewData?.quo_id
        }
      });
      setMilestones(data);
      setMilestoneAmount(Number((Number(data[0]?.percentage) / 100) * oprViewData?.total_cost));
      setAmount(Number((Number(data[0]?.percentage) / 100) * oprViewData?.total_cost));
      console.log('data', data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const accept = async (desc) => {
    setIsApproved(desc);

    if (open2) {
      try {
        await axiosInstance.post('/api/approval/logs', {
          approval_id: Number(approval[approval.length - 1].approval_id),
          doc_type: 'PO',
          doc_id: oprViewData.po_id,
          doc_number: oprViewData.po_num,
          employee_id: 2,
          action: isApproved ? 'Accept' : 'Reject',
          comments: comment,
          from_level: approval[approval.length - 1].to_user_level
        });
        toast.success(isApproved ? 'Accepted' : 'Rejected');
        setApprovalPOOpen(false);
        handleClose2();
        get_data();
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      setOpen2(true);
    }
  };

  const get_data = async () => {
    try {
      const { data } = await axiosInstance.get('/api/approval/logs', {
        params: {
          doc_id: oprViewData?.po_id,
          doc_type: 'PO'
        }
      });
      const map = data?.map((item, index) => ({
        id: index + 1,
        ...item,
        concurrence_remarks: item?.comments,
        approval_status: item.status == 1 ? 'Pending' : item.status == 2 ? 'Accepted' : 'Rejected',
        user_name: `${item?.ApprovalMatrix?.User?.first_name} ${item?.ApprovalMatrix?.User?.last_name}`
      }));
      setApproval(map);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    get_data();
    // GetApprovals(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oprViewData]);

  return handlePfi ? (
    <PFIForm closePfi={handleClosePfi} poData={oprViewData} />
  ) : (
    <>
      <MainCard>
        <Box sx={{ display: 'flex', height: '35px', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            <h3 style={{ padding: '0', margin: '0' }}>
              PO #
              <span className="text-primary" style={{ color: 'blue' }}>
                {oprViewData.po_num}
              </span>{' '}
              Dated{' '}
              <span className="text-primary" style={{ color: 'blue' }}>
                {oprViewData?.created_on.split('T')[0]}
              </span>
            </h3>
          </Typography>
          {/* <PlusButton label={'Request Payment'} onClick={() => setOpen(true)} /> */}
        </Box>

        <Box sx={{ marginBottom: '10px' }}>
          <Table>
            {renderTableHeader('otherDetails', 'Basic Details')}
            {showTableHeading.otherDetails && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          PO Num:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.po_num}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          OPO Numbers:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.quo_num}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Delivery Time:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.lead_time}</Typography>
                      </Grid>
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Tolerance:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Remarks:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.acceptance_remarks}</Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Additional Remarks:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Freight, Packaging & Forwarding Instructions:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Acceptance Copy:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Received Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Lead Time Start From:
                        </Typography>
                      </Grid> */}

                      {/* {!vendor_mode && (
                        <Grid item xs={12} sm={2}>
                          <Button onClick={() => setOpen(true)} variant="outlined" color="primary" size="small">
                            Send for Approval
                          </Button>
                        </Grid>
                      )} */}
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>
            {renderTableHeader('basicDetails', 'Vendor Details')}
            {showTableHeading.basicDetails && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vendor Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.VendorsMaster?.vendor_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vendor Num:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.VendorsMaster?.vendor_series}</Typography>
                      </Grid>
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Currency:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vendor Reference Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Contact Person:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.VendorsMaster?.contact_person}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Contact Person Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.VendorsMaster.contact_person_email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{oprViewData?.VendorsMaster.email}</Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          {/* Additional Charges Table */}
          <Table>
            {renderTableHeader('additionalChargesBreakup', 'PO Amount Breakup')}
            {showTableHeading.additionalChargesBreakup && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          FOB Cost:
                        </Typography>
                        <Typography>
                          {'  '}{' '}
                          {Number(oprViewData?.po_amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Inland Charges:
                        </Typography>
                        <Typography>
                          {oprViewData?.quotation_master?.additional_costs?.reduce((acc, amount) => {
                            return amount.charges_by === 'Supplier' && !amount.reference_table_name && amount.heading !== 'Freight_Charges'
                              ? (acc = Number(acc) + Number(amount.charge_amount))
                              : acc;
                          }, 0)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Freight Cost:
                        </Typography>
                        <Typography>
                          {oprViewData?.quotation_master?.additional_costs?.reduce((acc, amount) => {
                            return amount.charges_by === 'Supplier' && !amount.reference_table_name && amount.heading === 'Freight_Charges'
                              ? (acc = Number(acc) + Number(amount.charge_amount))
                              : acc;
                          }, 0)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          PFI Amount:
                        </Typography>
                        <Typography>
                          {'  '} {oprViewData?.total_cost}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>{renderTableHeader('additionalCost', 'Quotation Details')}</Table>
          {showTableHeading.additionalCost && <Quotation_Data quo_id={oprViewData.quo_id} ItemStatus={true} />}
        </Box>
      </MainCard>
      <Divider />

      {!vendor_mode && (
        <Table>
          {renderTableHeader('approvals', 'PO Approval & Payment Info.')}
          {showTableHeading.approvals && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
                // padding: '16px'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <Box
                    sx={{
                      backgroundColor: '#f5f5f5',
                      padding: '10px'
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'navy' }}>
                      Approval Log
                    </Typography>
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          border: '1px solid rgba(224, 224, 224, 1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
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
                      rows={approval}
                      columns={ApprovalHeader}
                      hideFooter
                      hideFooterPagination
                      hideFooterSelectedRowCount
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      {/* {approval.length < 1 && <span>No Approval Data</span>} */}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    sx={{
                      backgroundColor: '#f5f5f5',
                      padding: '10px'
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'navy' }} marginBottom={'15px'}>
                      Approval of PO{' '}
                      <span className="text-primary" style={{ color: 'blue' }}>
                        #({oprViewData.po_num})
                      </span>
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1">Remarks</Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <TextField
                          fullWidth
                          id="remarks"
                          // label="Remarks"
                          value={comment}
                          variant="outlined"
                          onChange={(e) => setComment(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end', paddingTop: '10px' }}>
                      <Button variant="outlined" color="error" onClick={() => accept(false)} sx={{ ml: 2 }}>
                        Reject
                      </Button>
                      {oprViewData.status > 3 && oprViewData.status > '3' && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (comment.trim() !== '') {
                              // Check if the remarks field is not empty
                              accept(true);
                              setIsApproved(true);
                              setApprovalPOOpen(true);
                            }
                          }}
                          sx={{ ml: 2 }}
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Table>
      )}

      {!vendor_mode && (
        <div style={{ padding: '20px', border: '2px dashed black', borderRadius: '12px' }}>
          <Table>
            {/* {renderTableHeader('PaymentRequest', 'Payment Request #')}
            {showTableHeading.PaymentRequest && ( */}
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={3}></TableCell>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle1">Payment Type</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="text"
                    disabled
                    id="payment_type"
                    name="payment_type"
                    placeholder="payment_type"
                    value={selectedMilestone}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .Mui-disabled': {
                        '-webkit-text-fill-color': '#4f4f4f'
                      },
                      width: '100%'
                    }}
                  />
                </TableCell>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle1">Amount Payable</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="text"
                    disabled
                    value={milestoneAmount}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .Mui-disabled': {
                        '-webkit-text-fill-color': '#4f4f4f'
                      },
                      width: '100%'
                    }}
                  />
                </TableCell>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle1">Amount Requested</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Amount"
                    value={amount}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .Mui-disabled': {
                        '-webkit-text-fill-color': '#4f4f4f'
                      },
                      width: '100%'
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      console.log('Input Value:', inputValue);
                      console.log('Milestone Amount:', milestoneAmount);

                      if (inputValue <= milestoneAmount) {
                        setAmount(inputValue);
                      } else {
                        alert(`Amount cannot be greater than ${selectedMilestoneArr?.percentage}% of total amount`);
                      }
                    }}
                  />
                </TableCell>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle1">Vendor Bank </Typography>
                  <Select
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .Mui-disabled': {
                        '-webkit-text-fill-color': '#4f4f4f'
                      },
                      width: '100%'
                    }}
                    variant="outlined"
                    value={bankTypeId}
                    fullWidth
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setSelectedVendorBank(oprViewData?.VendorsMaster?.VendorsBanksDetailsMasters?.filter((item) => item.bank_type_id));
                      setBankTypeId(selectedValue);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {oprViewData?.VendorsMaster?.VendorsBanksDetailsMasters?.map((item, index) => (
                      <MenuItem value={item?.bank_type_id} key={index}>
                        {item?.bank_name}{' '}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle1">Remarks </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="remarks"
                    name="remarks"
                    placeholder="Remarks"
                    value={remarks}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .Mui-disabled': {
                        '-webkit-text-fill-color': '#4f4f4f'
                      },
                      width: '100%'
                    }}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </TableCell>
                <TableCell
                  colSpan={3}
                  sx={{
                    '.MuiTableCell-root': {
                      paddingBottom: '0px'
                    }
                  }}
                >
                  <Button fullWidth onClick={handleSave} color="primary" variant="contained">
                    Confirm
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
            {/* )} */}
          </Table>
          <div style={{ display: 'flex', marginLeft: '50px' }}>
            <Typography variant="body1">
              <b>Selected Vendor Bank Details :</b>{' '}
            </Typography>
            <Typography variant="body1">
              <b>Bank Name:</b> {selectedVendorBank[0]?.bank_name}, <b>Acount No.:</b>
              {selectedVendorBank[0]?.bank_account_number}, <b>IFSC Code:</b>
              {selectedVendorBank[0]?.bank_ifsc_code}
            </Typography>
          </div>
        </div>
      )}

      {quotationItm && quotationItm?.length > 0 && (
        <>
          <Table>{renderTableHeader('otherDetails', 'Items Details')}</Table>
          {showTableHeading.otherDetails && (
            <>
              <div style={{ overflowX: 'scroll' }}>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
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
                  rows={quotationItm}
                  columns={stockItemColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  scrollbarSize={10}
                  hideFooter
                  hideFooterPagination
                />
              </div>
            </>
          )}
        </>
      )}

      <Dialog
        open={approvalPOOpen}
        onClose={() => setApprovalPOOpen(false)}
        aria-labelledby="update-dialog-title"
        aria-describedby="update-dialog-description"
      >
        <DialogTitle id="update-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="update-dialog-description">
            You are {isApproved ? 'accepting' : 'rejecting'} this purchase order.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <NoButton onClick={() => setApprovalPOOpen(false)}>
            <span>No</span>
          </NoButton>
          <YesButton onClick={() => accept(true)}>
            <span>Yes</span>
          </YesButton>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'PO Approval'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This PO will now be sent to respective approvers, do you wish to continue ?
          </DialogContentText>
          <TextField
            fullWidth
            sx={{ marginTop: '20px' }}
            id="Remarks"
            label="Remarks* (Mandatory)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            No
          </Button>
          <Button variant="contained" color="primary" onClick={sendApprovalRequest} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end', paddingTop: '10px' }}>
        <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
          Close
        </Button>
        {oprViewData?.status === 2 && (
          <Button variant="contained" disabled={open3} onClick={handleAcceptPO} sx={{ ml: 2 }}>
            Accept PO
          </Button>
        )}

        {/* {oprViewData.status > 3 && oprViewData.status > '3' && !vendor_mode && (
          <Button variant="contained" onClick={handleOpenPfi} sx={{ ml: 2 }}>
            Create PFI
          </Button>
        )} */}
      </div>
      {/* <Dialog
        open={open3}
        onClose={() => setOpen3(false)}
        PaperProps={{
          style: {
            maxHeight: '50vh',
            height: '46vh',
            width: '75vh',
            border: '10px solid #a1bcdb'
          }
        }}
      > */}
      {/* <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
        Purchase Order No.- <b style={{ color: 'blue' }}>({oprViewData?.po_num})</b> Dt-
        <b style={{ color: 'blue' }}>{oprViewData?.created_on}</b>
      </DialogTitle>
      <Divider /> */}

      {open3 && (
        <div style={{ border: '2px black dotted', padding: '5px', margin: '20px 0px', borderRadius: '12px' }}>
          <div style={{ padding: '20px' }}>
            <p>
              <b>Do you want to confirm this Purchase Order (PO)?</b>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="remarks"
                  name="remarks"
                  placeholder="Remarks"
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
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
                        File {index + 1}
                        <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Document Name"
                        value={item.name}
                        onChange={(e) => handleInputChangeFile(e, index, 'name')}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Remark"
                        onChange={(e) => handleInputChangeFile(e, index, 'remark')}
                        onBlur={(e) => {
                          e.target.value === '' && toast.error('Remarks are required');
                        }}
                        value={item.remark}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div>
                        <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                          Upload File
                          <VisuallyHiddenInput type="file" onChange={(e) => handleFileChangeFile(e, index)} />
                        </Button>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      {item.file && <span style={{ color: 'blue' }}>{item.file.name}</span>}
                    </Grid>
                    {index === fileArray.length - 1 && (
                      <Grid item xs={12} sm={0.5}>
                        <IconButton aria-label="delete" size="large" onClick={addFileEntry}>
                          <AddIcon color="success" />
                        </IconButton>
                      </Grid>
                    )}
                    {index === fileArray.length - 1 && index !== 1 && (
                      <Grid item xs={12} sm={0.5}>
                        <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </div>
          <DialogActions>
            <Button onClick={() => setOpen3(false)} color="primary" variant="outlined">
              Close
            </Button>
            <Button onClick={handleAcceptPOSubmit} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </div>
      )}

      {/* </Dialog> */}
    </>
  );
};

export default POView;
