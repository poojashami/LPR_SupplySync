import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  TableHead,
  IconButton,
  Button,
  Dialog,
  TextField
} from '@mui/material';
import formatNumber from 'utils/functions';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllQuotationsByRFQ, GetApprovals } from 'Redux/Apis/GetApiCalls';
import ViewQuotation from 'pages/rfq/quotation/view';
import { useNavigate } from 'react-router';
import { setCompareMode } from 'Redux/Slices/StaticSlice';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';

const OpoView = ({ rowData, IsViewAll = true, GeneratePO }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const { quotationsByRFQ } = useSelector((state) => state.quotation);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [dataToSend, setDataToSend] = useState({});
  const [isApproved, setIsApproved] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [approval, setApproval] = useState([]);

  const handleCloseDialogue = () => {
    setOpen3(false);
  };

  const handleOpenDialogue = () => {
    setOpen3(true);
  };

  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <Typography variant="h6" color="textSecondary">
        No Record Found
      </Typography>
    </Box>
  );
  const [additionalChargesBuyer, setAdditionalChargesBuyer] = useState([]);
  const [req_docs, setReq_docs] = useState([]);

  useEffect(() => {
    const req_data = rowData?.quo_require_docs?.map((item, index) => ({
      id: index + 1,
      doc_name: item?.doc_name,
      remarks: item?.doc_remarks,
      is_available: item?.isAvailable ? 'Yes' : 'No'
    }));
    setReq_docs(req_data);
    // let data = rowData?.quotation_master?.additional_costs?.filter((i) => i.charges_by !== 'Supplier');
    let data = rowData?.quotation_master?.additional_costs?.map((item, index) => ({ id: index + 1, ...item }));
    setAdditionalChargesBuyer(data);
  }, [rowData]);

  const accept = async (desc) => {
    setIsApproved(desc);

    if (open2) {
      try {
        await axiosInstance.post('/api/approval/logs', {
          approval_id: Number(approval[approval.length - 1].approval_id),
          doc_type: 'OPO',
          doc_id: rowData.opo_id,
          doc_number: rowData.opo_num,
          employee_id: 2,
          action: isApproved ? 'Accept' : 'Reject',
          comments: comment,
          from_level: approval[approval.length - 1].to_user_level
        });
        toast.success(isApproved ? 'Accepted' : 'Rejected');
        handleClose2();
        get_data(rowData.opo_id);
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      setOpen2(true);
    }
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  // useEffect(() => {
  //   const mappedData = approvals?.map((item, index) => {
  //     return {
  //       id: index + 1,
  //       concurred_by: item.from_user_id,
  //       concurrence_time: item.createdAt,
  //       concurrence_remarks: item.comments,
  //       action: item.action
  //     };
  //   });
  //   console.log('approvals', approvals);

  //   setApproval(mappedData);
  // }, [approvals]);

  const [isCriaRequired, setIsCriaRequired] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  useEffect(() => {
    const mappedData = quotationsByRFQ?.map((item, index) => {
      const totalCharge =
        item?.additional_costs?.reduce((sum, charge) => {
          return sum + parseFloat(charge.charge_amount);
        }, 0) || 0;

      setIsCriaRequired(item?.country_origin?.trim()?.toUpperCase() === 'INDIA' || item?.country_origin?.trim()?.toUpperCase() === 'CHINA');
      if (rowData?.quo_num === item.quo_num) {
        setTotalCost(item.total_cost + totalCharge);
      }
      return {
        id: index + 1,
        quo_id: item.quo_id,
        quo_num: item.quo_num,
        rfq_id: item.rfq_id,
        rfq_num: item.reference_no,
        vendor_name: item.VendorsMaster?.vendor_name,
        referenceDate: item.reference_date,
        quo_date: item.quo_date,
        currency: item.currency,
        delivery_terms: item.delivery_terms_name,
        country_origin: item.country_origin,
        country_supply: item.country_supply,
        port_loading: item.port_loading,
        lead_time: item.lead_time,
        payment_terms: item.payment_terms,
        remarks: item.remarks,
        total_cost: item.total_cost,
        quotation_items: item.quotation_items,
        QuoDocs: item.QuoDocs,
        additional_costs: item.additional_costs,
        additional_cost: totalCharge,
        final_amount: item.total_cost + totalCharge,
        payment_milestones: item.payment_milestones,
        all_data: item
      };
    });
    setQuotations(mappedData);
    const filterData = mappedData.filter((item) => item.quo_num === rowData?.quo_num);

    const getPaymentData = (data) => {
      const mappedData = data[0]?.payment_milestones?.map((item, index) => {
        return {
          id: index + 1,
          term: `${item?.milestone}`,
          percentage: item?.percentage,
          amount: Number(item?.percentage / 100) * totalCost,
          payment_status: item?.status
        };
      });

      setPaymentMilestone(mappedData === undefined ? [] : mappedData);
    };
    getPaymentData(filterData);
  }, [quotationsByRFQ]);

  const [paymentMilestone, setPaymentMilestone] = useState([]);

  const paymentHeader = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'term', headerName: 'Payment Term', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'due_on', headerName: 'Due on', width: 100 },
    { field: 'paid_amt', headerName: 'Paid Amt', width: 100 },
    { field: 'date', headerName: 'Date', width: 100 },
    {
      field: 'payment_status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <div style={{ cursor: 'pointer' }} aria-hidden="true">
          {params.value == 5 ? <b style={{ color: 'green' }}>Done</b> : <b style={{ color: 'red' }}> Not Done</b>}
        </div>
      )
    }
  ];

  useEffect(() => {
    GetAllQuotationsByRFQ(dispatch, rowData?.quotation_master?.rfq_id);
    GetApprovals(dispatch, rowData?.quo_id, rowData?.quo_num);
  }, []);

  const [quotationItm, setQuotationItm] = useState([]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additinalCost: true,
    ItemDetails: true,
    ReqDocsDetails: true,
    ApprovalDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  useEffect(() => {
    get_data(rowData?.opo_id);
  }, []);

  const get_data = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/approval/logs', {
        params: {
          doc_id: id,
          doc_type: 'OPO'
        }
      });
      const map = data?.map((item, index) => ({
        id: index + 1,
        ...item,
        updatedAt: item?.updatedAt?.split('T')[0],
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

  const handleClose = () => {
    setOpen(false);
  };

  const sendApprovalRequest = async () => {
    try {
      const { data } = await axiosInstance.post('/api/approval/logs', {
        doc_type: 'OPO',
        doc_id: rowData.opo_id,
        doc_number: rowData.opo_num,
        employee_id: 2,
        action: 'Accept',
        comments: comment,
        from_level: 0
      });
      toast.success(data?.message || 'Sent for approval');
      get_data(rowData.opo_id);
      setComment();
      handleClose();
    } catch (error) {
      toast.error(error.message);
      setComment();
      handleClose();
    }
  };

  const submit = async () => {
    try {
      const newDataToSend = {
        ...dataToSend,
        items_list: rowData?.opo_items,
        total_cost: rowData?.total_cost,
        opo_ids: rowData?.opo_id,
        opo_nums: rowData?.opo_num,
        vendor_id: rowData?.vendor_id,
        lead_time: rowData?.quotation_master.lead_time,
        payment_terms: rowData?.quotation_master.payment_terms,
        delivery_terms: rowData?.delivery_term_id,
        quo_id: rowData?.quo_id
      };

      setDataToSend(newDataToSend);

      const { data } = await axiosInstance.post('/api/po/create', newDataToSend);
      toast.success(data.message);
      setDataToSend({});
      handleCloseDialogue();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
      toast.error(errorMessage);
    }
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

  useEffect(() => {
    const mapdata = rowData?.opo_items?.map((item, index) => ({
      id: index + 1,
      item_type: item?.item_type,
      item_name: item?.item_name,
      item_code: item?.item_code,
      item_description: item?.ItemsMaster?.item_description,
      item_name_vendor: item?.quotation_item?.item_name_vendor,
      item_name_label: item?.quotation_item?.item_name_label,
      hsn_code: item?.ItemsMaster?.hsn_code,
      cria: item?.ItemsMaster?.cria,
      nafdac_name: item?.ItemsMaster?.nafdac_name,
      no_packs: item?.no_packs,
      nafdac_available: item?.ItemsMaster?.nafdacAvailable,
      nafdacRequired: item?.ItemsMaster?.nafdacRequired,
      oprQty: item?.opr_qty,
      pack_size: item?.pack_size,
      pack_type: item?.pack_type_name,
      line_total: item?.line_total,
      quoteQty: item?.quote_qtd,
      rate: item?.rate,
      remarks: item?.remarks
    }));
    setQuotationItm(mapdata);
  }, []);

  // Define columns for quotationItm table
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name_vendor', headerName: 'Vendor Item Name', width: 200 },
    { field: 'item_name_label', headerName: 'Item Label Name', width: 200 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_description', headerName: 'Item Description', width: 250 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },
    {
      headerName: 'NAFDAC Req.',
      field: 'nafdac_available',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'SON Req.',
      field: 'nafdac_availabl',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'CRIA Req.',
      field: 'cria',
      width: 150,
      renderCell: (params) => (
        <span>
          {params.row.criaRequired === 'true' ? (isCriaRequired ? 'Required' : 'Applicable if goods Coming from India or China') : 'No'}
        </span>
      )
    },
    { field: 'oprQty', headerName: 'OPR Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 }
  ];

  const ApprovalHeader = [
    { field: 'id', headerName: 'BY', width: 50 },
    { field: 'user_name', headerName: 'Concurred By', width: 100 },
    { field: 'concurrence_remarks', headerName: 'Concurrence Remarks', width: 200 },
    { field: 'updatedAt', headerName: 'Concurrence Time', width: 200 },
    { field: 'action', headerName: 'Action', width: 100 },
    { field: 'approval_status', headerName: 'Last Status', width: 100 }
  ];
  const QuotationHeader = [
    {
      field: 'quo_num',
      headerName: 'Quotation No.',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    {
      field: 'status_quo',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <div style={{ cursor: 'pointer' }} aria-hidden="true">
          {rowData?.quo_num === params.row.quo_num ? (
            <b style={{ color: 'green' }}>Selected</b>
          ) : (
            <b style={{ color: 'red' }}> Not Selected</b>
          )}
        </div>
      )
    },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 200 },
    { field: 'quo_date', headerName: 'Quo Date', width: 100 },
    { field: 'delivery_terms', headerName: 'Delivery Terms', width: 100 },
    { field: 'lead_time', headerName: 'Lead Time', width: 80 },
    { field: 'currency', headerName: 'Currency', width: 80 },
    { field: 'total_cost', headerName: 'Amount', width: 80 },
    { field: 'additional_cost', headerName: 'Additional Costs', width: 80 },
    { field: 'final_amount', headerName: 'Final Total', width: 80 }
  ];

  const [quotationRowData, setQuotationRowData] = useState(null);

  const handleViewClick = async (quotation) => {
    setQuotationRowData({ ...quotation });
  };
  const handleViewClose = () => {
    setQuotationRowData(null);
  };

  return (
    <MainCard>
      {quotationRowData ? (
        <ViewQuotation oprViewData={quotationRowData} onClose={handleViewClose} />
      ) : (
        <>
          <Typography variant="h6">
            <h3 style={{ padding: '0', margin: '0.5vh' }}>
              OPO Number (
              <span className="text-primary" style={{ color: 'blue' }}>
                {rowData?.opo_num}
              </span>
              ) Against Quotation No. (
              <span className="text-primary" style={{ color: 'blue' }}>
                {rowData?.quo_num}
              </span>
              )
            </h3>
          </Typography>
          <Box sx={{ marginBottom: '10px' }}>
            <Table>
              {renderTableHeader('basicDetails', 'Basic Details')}
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
                          <Typography>{rowData?.vendor_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Quotation Reference No:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.reference_no}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            OPR Num:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.opr_num}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Currency:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.currency}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Delivery Terms:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.delivery_terms_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Payment Terms:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.payment_terms}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Quotation Remarks:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.remarks}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Unit:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.companyMaster?.company_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            FORM M No.:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.form_m_num}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            LC No.:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.lc_num}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Country of Origin:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.country_origin}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Country of Supply:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.country_supply}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Shipment Mode:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.ShipMode?.shipment_mode_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Shipment Term:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.delivery_terms_name}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Shipment Type:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.RfqMaster.shipment_type}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Port of Loading:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.port_loading}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Port of Delivery:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.RfqMaster?.port_destination_master?.port_destination_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Country of Delivery:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.RfqMaster?.port_destination_master?.country_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Delivery Time:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{`${rowData?.OprMaster.delivery_timeline_id} Weeks`}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Delivery Location:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.quotation_master?.port_of_loading}</Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            OPO Description:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData.opo_description}</Typography>
                        </Grid> */}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>

            <Table>
              {renderTableHeader('otherDetails', 'OPR Details')}
              {showTableHeading.otherDetails && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Vertical:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.vertical_opr?.vertical_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Company:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.companyMaster?.company_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Department:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.Division?.division_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Ship Mode:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.ShipMode?.shipment_mode_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Buying House:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData?.OprMaster?.BuyingHouse?.buying_house_name}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Unit Justification:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData.unit_justification}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Procurement Justification:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{rowData.procurement_justification}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Total Cost:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography>{formatNumber(Number(rowData?.total_cost))}</Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {/* <TableBody>
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Grid container spacing={2} alignItems="center">
                          {additionalChargesBuyer?.map((cost, index) => (
                            <Grid item xs={12} sm={3} key={index} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                              <Typography variant="body1" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {cost?.charge_name?.replace(/_/g, ' ')}:
                              </Typography>
                              <Typography>
                                {'  '} {cost?.charge_amount}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody> */}
            {IsViewAll && (
              <>
                <Table>{renderTableHeader('additinalCost', 'Additional Charges & Required Documents')}</Table>
                {showTableHeading.additinalCost && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      sx={{
                        minHeight: '20vh',
                        maxWidth: '60vh',
                        '& .MuiDataGrid-cell': {
                          border: '1px solid rgba(224, 224, 224, 1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize'
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
                      columns={[
                        { headerName: 'Sr.No.', field: 'id', width: 50 },
                        {
                          headerName: 'Charge name',
                          field: 'charge_name',
                          width: 180,
                          // flex: 1,
                          renderCell: (params) => {
                            return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                          }
                        },
                        {
                          headerName: 'Charges By',
                          field: 'charges_by',
                          width: 80,
                          flex: 1,
                          renderCell: (params) => {
                            return <span>{params?.value?.replace(/_/g, ' ')}</span>;
                          }
                        },
                        {
                          headerName: 'Charges Amount',
                          field: 'charge_amount',
                          width: 120
                          // flex: 1
                        }
                      ]}
                      rows={additionalChargesBuyer}
                      hideFooter
                      hideFooterPagination
                      hideFooterSelectedRowCount
                    />
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      sx={{
                        minHeight: '20vh',
                        maxWidth: '60vh',
                        '& .MuiDataGrid-cell': {
                          border: '1px solid rgba(224, 224, 224, 1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize'
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
                      columns={[
                        { headerName: 'Sr.No.', field: 'id', width: 50 },
                        {
                          headerName: 'Doc name',
                          field: 'doc_name',
                          width: 180
                        },
                        {
                          headerName: 'Remarks',
                          field: 'remarks',
                          width: 80,
                          flex: 1
                        },
                        {
                          headerName: 'Is Available',
                          field: 'is_available',
                          width: 100
                        }
                      ]}
                      rows={req_docs}
                      hideFooter
                      hideFooterPagination
                      hideFooterSelectedRowCount
                    />
                  </Box>
                )}
              </>
            )}

            <Table>
              {renderTableHeader('ApprovalDetails', 'Approval And Quotation Details & Payment Details')}
              {showTableHeading.ApprovalDetails && (
                <>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {/* {approval?.length > 0 && ( */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'blue' }}>
                        <b>Approval Details</b>
                      </span>
                      <DataGrid
                        getRowHeight={() => 'auto'}
                        sx={{
                          minHeight: '20vh',
                          maxWidth: '60vh',
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
                        slots={{
                          noRowsOverlay: CustomNoRowsOverlay
                        }}
                      />
                    </Box>
                    {/* )} */}
                    {quotations?.length > 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'blue' }}>
                            <b>Quotations Details</b>
                          </span>

                          <button
                            onClick={() => {
                              dispatch(
                                setCompareMode({
                                  data: {
                                    company_id: rowData?.OprMaster?.company_id,
                                    opr_id: rowData?.OprMaster?.opr_id,
                                    opr_num: rowData?.OprMaster?.opr_num
                                  }
                                })
                              );
                              navigate('/opo/compare');
                            }}
                          >
                            View Comparison
                          </button>
                        </Box>

                        <DataGrid
                          getRowHeight={() => 'auto'}
                          sx={{
                            minHeight: '20vh',
                            maxWidth: '60vh',
                            border: '1px solid lightgrey',
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
                          rows={quotations}
                          columns={QuotationHeader}
                          hideFooter
                          hideFooterPagination
                        />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'blue' }}>
                        <b>Payment Details</b>
                      </span>
                      <DataGrid
                        getRowHeight={() => 'auto'}
                        sx={{
                          minHeight: '20vh',
                          maxWidth: '60vh',
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
                        rows={paymentMilestone}
                        columns={paymentHeader}
                        hideFooter
                        hideFooterPagination
                        hideFooterSelectedRowCount
                        slots={{
                          noRowsOverlay: CustomNoRowsOverlay
                        }}
                      />
                    </Box>
                  </div>
                </>
              )}
            </Table>

            <>
              <Table>{renderTableHeader('ItemDetails', 'Items Details')}</Table>
              {showTableHeading.ItemDetails && (
                <>
                  <div style={{ overflowX: 'auto', width: '90dvw' }}>
                    <DataGrid
                      sx={{
                        minHeight: '30vh',
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
                      rowHeight={20}
                      hideFooter
                      hideFooterPagination
                    />
                  </div>
                </>
              )}
            </>
          </Box>
        </>
      )}

      {GeneratePO && (
        <>
          <div style={{ padding: '20px' }}>
            <TextField
              id="remarks"
              label="Additional Information"
              name="remarks"
              value={dataToSend?.remarks}
              onChange={(e) => setDataToSend((val) => ({ ...val, [e.target.name]: e.target.value }))}
            />
          </div>
          <Box sx={{ width: '90dvw', display: 'flex', alignItems: 'end', gap: '12px' }}>
            {approval?.length < 1 && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                onClick={() => setOpen(true)}
              >
                Send for Approval
              </Button>
            )}

            <Button
              variant="contained"
              color="success"
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              onClick={() => accept(true)}
            >
              Accept
            </Button>

            <Button
              variant="outlined"
              color="error"
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              onClick={() => accept(false)}
            >
              Reject
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleOpenDialogue();
                // submit();
              }}
            >
              Create PO
            </Button>
          </Box>
        </>
      )}

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Approval Request for OPO No. '}

          <span style={{ color: 'red' }}>{rowData?.opo_num}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This OPO will now be sent to respective approvers, do you wish to continue ?
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
      <Dialog open={open2} onClose={handleClose2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'OPR Approval'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This OPR will now be sent to respective approvers, do you wish to continue ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose2}>
            No
          </Button>
          <Button variant="contained" color="primary" onClick={() => accept()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open3} onClose={handleCloseDialogue} aria-labelledby={'merged'}>
        <DialogTitle id={'merged'}></DialogTitle>
        <DialogContent>
          <DialogContentText>
            {'You are going to raise a PO from OPO No.'}
            <ol>
              <li>
                <em style={{ color: 'red' }}>{rowData?.opo_num}</em>
              </li>
            </ol>
          </DialogContentText>
          {/* <Box fullWidth sx={{ display: 'flex', gap: '12px' }}>
            <TextField
              fullWidth
              id="remarks"
              label="Remarks"
              name="remarks"
              value={dataToSend?.remarks}
              onChange={(e) => setDataToSend((val) => ({ ...val, [e.target.name]: e.target.value }))}
            />
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogue} variant="outlined" color="error">
            Cancel
          </Button>
          <Button onClick={submit} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default OpoView;
