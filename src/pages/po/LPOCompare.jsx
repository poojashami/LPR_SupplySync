import {
  Box,
  Grid,
  Paper,
  Table,
  Modal,
  Select,
  Button,
  Dialog,
  Divider,
  Tooltip,
  MenuItem,
  TableRow,
  TableBody,
  TextField,
  TableCell,
  Typography,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  TableHead
} from '@mui/material';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomParagraphLight from 'components/CustomParagraphLight';
import { messageOpen } from 'Redux/Slices/StaticSlice';
import { useNavigate } from 'react-router';
import SubmitButton from 'components/CustomSubmitBtn';
import CancelButton from 'components/CustomCancelButton';
const LPOCompare = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    documentsList: true
  });
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');
  const { rfqs } = useSelector((state) => state.rfq);
  const [selectedQuote, setSelectedQuote] = useState('');
  const { cont_sizes } = useSelector((state) => state.static);
  const [previous_charges, setPreviousCharges] = useState({});
  const [open2, setOpen2] = useState({ condition: false, id: 0, num: '' });
  const [convert_to_delivery_term, setConvert_to_deliveryTerm] = useState('CFR');
  const [selectedQuoteForView, setSelectedQuoteForView] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const [po_create_data, setPo_create_data] = useState({
    opo_description: '',
    unit_justification: '',
    procurement_justification: ''
  });
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const create_po = async (quotation) => {
    navigate('/po/draft');
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '8px !important' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600} textTransform={'none'}>
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

  const rates = {
    USD: 1.0,
    INR: 84.07,
    ZAR: 17.42,
    VEF: 56.24,
    CNY: 7.18
  };
  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}
    >
      <Typography variant="body2" color="textSecondary">
        No quotation has been obtained.
      </Typography>
    </Box>
  );
  const convertCurrency = (cost, from, to) => {
    if (from === to) {
      return Number(cost);
    } else {
      const costInUSD = cost / rates[from];
      const convertedCost = costInUSD * rates[to];
      return Number(convertedCost);
    }
  };
  const doc_list = [
    {
      id: 1,
      quotation_id: 'QID-001',
      document_name: 'Quotation Document',
      document_date: '2025-01-10',
      file_name: 'quote_001.pdf',
      notes: 'First quotation document for project A.'
    },
    {
      id: 2,
      quotation_id: 'QID-002',
      document_name: 'Quotation Document',
      document_date: '2025-01-11',
      file_name: 'quote_002.pdf',
      notes: 'Second quotation document for project B.'
    },
    {
      id: 3,
      quotation_id: 'QID-003',
      document_name: 'Purchase Order',
      document_date: '2025-01-12',
      file_name: 'po_003.pdf',
      notes: 'Purchase order for equipment supply.'
    },
    {
      id: 4,
      quotation_id: 'QID-004',
      document_name: 'Invoice',
      document_date: '2025-01-13',
      file_name: 'invoice_004.pdf',
      notes: 'Final invoice for project C.'
    },
    {
      id: 5,
      quotation_id: 'QID-005',
      document_name: 'Delivery Note',
      document_date: '2025-01-14',
      file_name: 'delivery_note_005.pdf',
      notes: 'Delivery note for shipped items.'
    }
  ];
  const vendorDetailsCols = [
    { headerName: 'RFQ Lead Time', field: 'rfq_lead_time' },

    { headerName: 'Vendor Lead Time', field: 'vendor_lead_time' },
    { headerName: 'Payment Term', field: 'payment_terms', width: 120 },
    { headerName: 'Quote Curr.', field: 'currency', width: 100 },

    {
      headerName: 'Product Cost',
      field: 'product_amt',
      width: 120
      // renderCell: (params) => <span>{formatNumber(params.value)}</span>
    },
    {
      headerName: 'Vendor Add. costs',
      field: 'supp_additional_costs',
      // renderCell: (params) => <span>{formatNumber(params.value)}</span>,
      width: 120
    },
    {
      headerName: 'Transportation Ch.',
      field: 'supp_freight_costs',
      // renderCell: (params) => <span>{formatNumber(params.value)}</span>,
      width: 120
    },

    {
      headerName: 'Convert to Compare(DT)',
      field: 'delivery',
      renderCell: (params) => {
        if (params?.row?.delivery_term !== 'CFR') {
          return (
            <Tooltip title="BUYER Additional Cost">
              <IconButton
                aria-label="add_costs"
                onClick={() => {
                  setSelectedQuote(params?.row?.delivery_term);
                  const mergedCosts = Object.assign({}, ...transformCosts(previous_charges)[params?.row?.id - 1].additionalCosts);
                  setFormValuesCharges((val) => ({ ...val, ...mergedCosts }));
                  setOpen2({ condition: true, id: params?.row?.quote_id, num: params?.row?.quoteNum });
                }}
              >
                <AddCircleOutlineIcon color="success" />
              </IconButton>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Conversion not applicable on CFR">
              <span>N.A.</span>
            </Tooltip>
          );
        }
      },
      width: 92,
      sortable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      headerName: 'Transportation Ch. for Compare',
      field: 'inland_charges',
      renderCell: () => {
        // return <span>{formatNumber(params.value)}</span>;
      },
      width: 120
    },

    {
      headerName: 'BH Add. Costs',
      field: 'additional_costs',
      // renderCell: (params) => <span>{formatNumber(Number(params.value))}</span>,
      width: 120
    },
    {
      headerName: 'Total Additional Cost',
      field: 'effective_cost',
      // renderCell: (params) => <span>{formatNumber(Number(params.value))}</span>,
      width: 150
    },
    {
      headerName: 'Final Comparable Amt',
      field: 'final_amount',
      width: 150
    },
    {
      headerName: 'Converted Curr',
      field: 'quote_all_Data',
      renderHeader: () => {
        return (
          <FormControl variant="standard" size="small">
            <Select
              onChange={(e) => setCurrency(e.target.value)}
              size="small"
              labelId="Currency-label"
              id="Currency"
              value={currency}
              label="Currency"
              style={{ textTransform: 'uppercase' }}
            >
              {Object.keys(rates)?.map((cur, index) => (
                <MenuItem key={index} value={cur} style={{ textTransform: 'uppercase' }}>
                  {cur}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
      renderCell: () => {
        return <span>{`${currency}`}</span>;
      },
      width: 120
    },
    {
      headerName: 'Conversion rates',
      field: 'currencyRates',
      renderCell: (params) => <span>{formatNumber(convertCurrency(Number(1), params.row.currency, currency).toFixed(4))}</span>,
      renderHeader: () => {
        return <span>Conversion rate to {currency}</span>;
      },
      width: 150
    },
    {
      headerName: `Final Amt ${currency}`,
      field: 'final_amount_usd',
      width: 150,
      renderCell: (params) => (
        <span>{formatNumber((Number(params.value) * convertCurrency(Number(1), params.row.currency, currency)).toFixed(2))}</span>
      )
    }
  ];
  const vendorDetailsData = [
    {
      id: 1,
      quoteNum: 'Q1234',
      vendor_name: 'Vendor A',
      quote_received_date: '2025-01-10',
      delivery_term: 'CFR',
      remarks: 'Fast delivery',
      lead_time: '7 days',
      payment_terms: 'Net 30',
      currency: 'USD',
      product_amt: 1200.5,
      supp_additional_costs: 50,
      quote_amt: 1250.5,
      delivery: 'CFR',
      inland_charges: 100,
      fob_charges: 200,
      Freight_Charges: 300,
      additional_costs: 150,
      effective_cost: 250,
      final_amount: 1500.5,
      quote_all_Data: 'USD',
      currencyRates: 1,
      final_amount_usd: 1500.5,
      document_name: 'Quotation Document',
      document_date: '2025-01-10',
      file_name: 'quote_001.pdf',
      notes: 'First quotation document for project A.'
    },
    {
      id: 2,
      quoteNum: 'Q1235',
      vendor_name: 'Vendor B',
      quote_received_date: '2025-01-11',
      delivery_term: 'FOB',
      remarks: 'Standard delivery',
      lead_time: '10 days',
      payment_terms: 'Net 45',
      currency: 'EUR',
      product_amt: 1000,
      supp_additional_costs: 70,
      quote_amt: 1070,
      delivery: 'FOB',
      inland_charges: 80,
      fob_charges: 150,
      Freight_Charges: 250,
      additional_costs: 120,
      effective_cost: 200,
      final_amount: 1270,
      quote_all_Data: 'EUR',
      currencyRates: 1.1,
      final_amount_usd: 1397,
      document_name: 'Quotation Document',
      document_date: '2025-01-10',
      file_name: 'quote_001.pdf',
      notes: 'First quotation document for project A.'
    },
    {
      id: 3,
      quoteNum: 'Q1236',
      vendor_name: 'Vendor C',
      quote_received_date: '2025-01-12',
      delivery_term: 'EXW',
      remarks: 'High quality',
      lead_time: '5 days',
      payment_terms: 'Net 15',
      currency: 'INR',
      product_amt: 90000,
      supp_additional_costs: 5000,
      quote_amt: 95000,
      delivery: 'EXW',
      inland_charges: 3000,
      fob_charges: 0,
      Freight_Charges: 8000,
      additional_costs: 2000,
      effective_cost: 10000,
      final_amount: 105000,
      quote_all_Data: 'INR',
      currencyRates: 0.012,
      final_amount_usd: 1260,
      document_name: 'Quotation Document',
      document_date: '2025-01-10',
      file_name: 'quote_001.pdf',
      notes: 'First quotation document for project A.'
    }
  ];
  const vendorDetailsMainData = [
    {
      id: 1,
      quoteNum: 'Q001',
      vendor_name: 'Vendor Alpha',
      quote_received_date: '2025-01-10',
      delivery_term: 'CFR',
      remarks: 'Urgent delivery required'
    },
    {
      id: 2,
      quoteNum: 'Q002',
      vendor_name: 'Vendor Beta',
      quote_received_date: '2025-01-12',
      delivery_term: 'FOB',
      remarks: 'Negotiation pending'
    },
    {
      id: 3,
      quoteNum: 'Q003',
      vendor_name: 'Vendor Gamma',
      quote_received_date: '2025-01-14',
      delivery_term: 'EXW',
      remarks: 'Includes additional services'
    },
    {
      id: 4,
      quoteNum: 'Q004',
      vendor_name: 'Vendor Delta',
      quote_received_date: '2025-01-16',
      delivery_term: 'DAP',
      remarks: 'High priority order'
    },
    {
      id: 5,
      quoteNum: 'Q005',
      vendor_name: 'Vendor Epsilon',
      quote_received_date: '2025-01-18',
      delivery_term: 'FCA',
      remarks: 'Standard delivery schedule'
    }
  ];
  const vendorDetailsColsMain = [
    { headerName: 'Quotation No.', field: 'quoteNum', width: 100 },
    { headerName: 'Quotation Date', field: 'quote_received_date', width: 100 },
    { headerName: 'Vendor', field: 'vendor_name', width: 100 },
    { headerName: 'Delivery Term', field: 'delivery_term', width: 110 },
    { headerName: 'Quotation Remark', field: 'remarks', width: 200 }
  ];
  const itemColumn = [
    { headerName: 'No. Packs', field: 'no_packs', renderCell: (params) => <span>{formatNumber(params.value)}</span> },
    { headerName: 'Pack Type', field: 'pack_type_name' },
    { headerName: 'Pack Size', field: 'pack_size' },
    {
      headerName: 'Rate',
      width: 80,
      field: 'rate'
    },
    {
      headerName: 'Eff Rate',
      width: 80,
      field: 'CalcRate'
    },
    {
      headerName: 'Quantity',
      field: 'qty'
    }
  ];
  const itemsList = [
    {
      id: 1,
      no_packs: 10,
      pack_type_name: 'Box',
      pack_size: '12x500ml',
      rate: 50.5,
      CalcRate: 48.2,
      qty: 120
    },
    {
      id: 2,
      no_packs: 20,
      pack_type_name: 'Carton',
      pack_size: '24x1L',
      rate: 70.0,
      CalcRate: 68.5,
      qty: 240
    }
  ];
  const itemColumnRFQ = [
    { headerName: 'Sr.No.', field: 'id', width: 40 },
    { headerName: 'Item Category', field: 'item_type', width: 120 },
    { headerName: 'Item Code', field: 'city', width: 80 },
    { headerName: 'Item Name', field: 'item_name' },
    { headerName: 'OPR Qty', field: 'opr_qty', width: 80, renderCell: (params) => <span>{formatNumber(params.value)}</span> }
  ];
  const itemsListRFQ = [
    {
      id: 1,
      item_type: 'Electronics',
      city: 'ELEC001',
      item_name: 'Smartphone',
      opr_qty: 150
    },
    {
      id: 2,
      item_type: 'Furniture',
      city: 'FURN002',
      item_name: 'Office Chair',
      opr_qty: 75
    }
  ];

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={6}>
          {
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '120px',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'start'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center'
                },
                '& .MuiCheckbox-root': {
                  padding: 0,
                  margin: '0 auto', // Center align the checkbox
                  width: '18px',
                  height: '18px'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay
              }}
              pageSize={5}
              rows={vendorDetailsMainData}
              checkboxSelection
              rowsPerPageOptions={[5]}
              columns={vendorDetailsColsMain}
              selectionModel={selectionModel}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setIsCFR(false);
                setIsFOB(false);
                setIsEXW(false);
                vendorDetailsMainData
                  ?.filter((item) => newRowSelectionModel.includes(item.id))
                  ?.map((quo) => {
                    if (quo?.delivery_term === 'CFR') {
                      setIsCFR(true);
                      setIsFOB(false);
                      setIsEXW(false);
                    } else if (quo?.delivery_term === 'FOB' && !isCFR) {
                      setIsCFR(false);
                      setIsFOB(true);
                      setIsEXW(false);
                    } else if (quo?.delivery_term === 'EXW' && !isCFR && !isFOB) {
                      setIsCFR(false);
                      setIsFOB(false);
                      setIsEXW(true);
                    }
                  });
                setSelectedQuoteForView(newRowSelectionModel);
              }}
              disableSelectionOnClick
              hideFooterSelectedRowCount
              hideFooterPagination
              hideFooter
            />
          }
        </Grid>

        <Grid item xs={12} md={6}>
          {
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '120px',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'start'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay
              }}
              pageSize={5}
              rows={vendorDetailsData}
              loading={vendorDetailsData?.length === 0}
              rowsPerPageOptions={[5]}
              columns={vendorDetailsCols}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                vendorDetailsData
                  ?.filter((item) => newRowSelectionModel.includes(item.id))
                  ?.map((quo) => {
                    if (quo?.delivery_term === 'CFR') {
                      setIsCFR(true);
                      setIsFOB(false);
                      setIsEXW(false);
                    } else if (quo?.delivery_term === 'FOB') {
                      setIsCFR(false);
                      setIsFOB(true);
                      setIsEXW(false);
                    } else if (quo?.delivery_term === 'EXW') {
                      setIsCFR(false);
                      setIsFOB(false);
                      setIsEXW(true);
                    }
                  });
                setSelectedQuoteForView(newRowSelectionModel);
              }}
              disableSelectionOnClick
              hideFooterSelectedRowCount
              hideFooterPagination
              hideFooter
            />
          }
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item md={4}>
          <Paper style={{ padding: 5, background: '#e8eaf6' }}>
            <Typography
              gutterBottom
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>OPR Details</div>
            </Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 5px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                  OPR #:
                </Typography>
                {/* <div style={{ flex: '1' }}>{compareMode.opr_num}</div> */}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                  Company #:
                </Typography>
                {/* <div style={{ flex: '1' }}>{compareMode.company_num}</div> */}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                  Date:
                </Typography>
                <div style={{ flex: '1' }}>{new Date().toLocaleDateString()}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                  Convert to :
                </Typography>
                <div style={{ flex: '1' }}>
                  <FormControl variant="standard" size="small">
                    <Select
                      onChange={(e) => setConvert_to_deliveryTerm(e.target.value)}
                      size="small"
                      labelId="convert_to_delivery_term-label"
                      id="convert_to_delivery_term"
                      // value={convert_to_delivery_term}
                      label="convert_to_delivery_term"
                      style={{ textTransform: 'uppercase' }}
                    >
                      <MenuItem style={{ textTransform: 'uppercase' }} disabled>
                        <em>Select</em>
                      </MenuItem>
                      {/* {isCFR
                        ? shippingTerms?.map((term) => (
                            <MenuItem key={term} disabled={term !== 'CFR'} value={term} style={{ textTransform: 'uppercase' }}>
                              {term}
                            </MenuItem>
                          ))
                        : isFOB
                          ? shippingTerms?.map((term) => (
                              <MenuItem key={term} disabled={term !== 'FOB'} value={term} style={{ textTransform: 'uppercase' }}>
                                {term}
                              </MenuItem>
                            ))
                          : isEXW
                            ? shippingTerms?.map((term) => (
                                <MenuItem key={term} value={term} style={{ textTransform: 'uppercase' }}>
                                  {term}
                                </MenuItem>
                              ))
                            : shippingTerms?.map((term) => (
                                <MenuItem key={term} value={term} style={{ textTransform: 'uppercase' }}>
                                  {term}
                                </MenuItem>
                              ))} */}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            <div
              style={{
                height: 'auto',
                width: '100%',
                overflowY: 'auto',
                marginTop: '107px',
                marginBottom: '35px'
              }}
            >
              {itemsListRFQ?.length && (
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    minHeight: '80px',
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)',
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'start',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '25px !important'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      height: '25px !important'
                    },
                    '& .MuiDataGrid-scrollbar': {
                      height: '8px'
                    }
                  }}
                  loading={itemsListRFQ?.length === 0}
                  pageSize={5}
                  rows={itemsListRFQ}
                  columns={itemColumnRFQ}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  hideFooterPagination
                  hideFooter
                />
              )}
            </div>
          </Paper>
        </Grid>
        <Grid item md={8}>
          <div style={{ display: 'flex', overflowX: 'scroll', scrollbarWidth: 'thin', height: 'max-content' }}>
            {/* ?.filter((item) => selectedQuoteForView.includes(item.id)) */}
            {vendorDetailsData ? (
              vendorDetailsData?.map((quotation, index) => (
                <Paper
                  key={index}
                  style={{ padding: 5, background: index % 2 === 0 ? '#ede7f6' : '#e3f2fd', minWidth: '600px', marginRight: '10px' }}
                >
                  <Typography
                    gutterBottom
                    style={{
                      marginBottom: '1px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px'
                    }}
                  >
                    <Typography variant="body" style={{ fontSize: '12px', fontWeight: 600 }}>
                      Vendor Detail:
                      {/* <span
                          onClick={() => handleOpen(quotation)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleOpen(quotation);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          style={{ cursor: 'pointer', color: 'blue' }}
                        >
                          {quotation?.vendor_num}
                        </span> */}
                      <span tabIndex={0} role="button" style={{ cursor: 'pointer', color: 'blue' }}>
                        VEN376476
                      </span>
                    </Typography>
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {/* <div>
                          {selectedQuotation.length > 0 ? (
                            selectedQuotation[0]?.quo_num === quotation?.quoteNum ? (
                              <span style={{ backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '10px' }}>
                                Selected
                              </span>
                            ) : (
                              <span style={{ backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '10px' }}>
                                Not Selected
                              </span>
                            )
                          ) : (
                            ''
                          )}
                        </div> */}

                      {/* {quotation?.procurement_justification && (
                          <div>
                            <span style={{ backgroundColor: 'blue', color: 'white', padding: '5px', borderRadius: '10px' }}>Recommend</span>
                          </div>
                        )} */}
                      <div>
                        <span style={{ backgroundColor: 'blue', color: 'white', padding: '5px', borderRadius: '10px' }}>Recommend</span>
                      </div>
                      <IconButton aria-label="add_costs" onClick={handleOpen}>
                        <DoneAllIcon color="info" />
                      </IconButton>
                      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description" sx={{ marginBottom: '20px' }}>
                            You have chosen the following quotation: <em style={{ color: 'red' }}>{quotation.quo_num}</em>, <br />
                            for <em style={{ color: 'red' }}>{quotation?.opr_num}</em> Please confirm your selection to proceed.
                          </DialogContentText>
                          <Box fullWidth sx={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ fontSize: '11px', color: '#333' }}>
                              Procurement Justification
                            </Typography>
                            <TextField
                              fullWidth
                              id="procurement_justification"
                              name="procurement_justification"
                              value={quotation?.procurement_justification}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '8px',
                                  fontSize: '11px'
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                  WebkitTextFillColor: '#000000'
                                }
                              }}
                            />
                            <Typography variant="h6" sx={{ fontSize: '11px', color: '#333' }}>
                              Unit Justification
                            </Typography>
                            <TextField
                              fullWidth
                              id="unit_justification"
                              name="unit_justification"
                              value={po_create_data?.unit_justification}
                              onChange={(e) => setPo_create_data((val) => ({ ...val, [e.target.name]: e.target.value }))}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '8px',
                                  fontSize: '11px'
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                  WebkitTextFillColor: '#000000'
                                }
                              }}
                            />
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <SubmitButton onClick={handleClose} v>
                            Cancel
                          </SubmitButton>
                          <CancelButton onClick={create_po} autoFocus>
                            Generate OPO
                          </CancelButton>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      Quote No.
                    </Typography>
                    <div style={{ flex: '1' }}>{quotation?.quoteNum}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      {' '}
                      Vendor Name:
                    </Typography>
                    <div style={{ flex: '1' }}>{quotation?.vendor_name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      Delivery Term:
                    </Typography>
                    <div style={{ flex: '1' }}>{quotation?.delivery_term}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      {' '}
                      Vendor Lead Time:
                    </Typography>
                    <div style={{ flex: '1' }}>{quotation?.lead_time}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      Quote Currency:
                    </Typography>
                    <div style={{ flex: '1' }}>{quotation?.currency}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      {' '}
                      Additional Costs :
                    </Typography>
                    <div style={{ flex: '1' }}>
                      {formatNumber(quotation?.effective_cost)} {quotation?.currency}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      {' '}
                      Total Amount :
                    </Typography>
                    <div style={{ flex: '1' }}>
                      {formatNumber(quotation?.product_amt)} {quotation?.currency}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      Final Comparable Amt :
                    </Typography>
                    <div style={{ flex: '1' }}>
                      {formatNumber(Number(quotation?.product_amt + quotation?.effective_cost))} {quotation?.currency}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                      {' '}
                      Procurement Justification :
                    </Typography>
                    <div style={{ flex: '1' }}>{quotation?.procurement_justification || 'N.A.'}</div>
                  </div>

                  <div
                    style={{
                      height: 'auto',
                      width: 'auto',
                      overflowY: 'auto'
                    }}
                  >
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      sx={{
                        minHeight: '80px',
                        '& .MuiDataGrid-cell': {
                          border: '1px solid rgba(224, 224, 224, 1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        },
                        '& .MuiDataGrid-columnHeader': {
                          backgroundColor: '#f5f5f5',
                          border: '1px solid rgba(224, 224, 224, 1)',
                          height: '25px !important'
                        },
                        '& .MuiDataGrid-scrollbar': {
                          height: '8px'
                        }
                      }}
                      rows={itemsList}
                      columns={itemColumn}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      hideFooterPagination
                      hideFooter
                    />
                  </div>
                  <Box paddingTop={2}>
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                      <Grid item xs={3}>
                        <CustomParagraphDark>Document</CustomParagraphDark>
                        <CustomParagraphLight
                          sx={{ cursor: 'pointer', color: 'navy', fontWeight: 'bold' }}
                          onClick={() => dispatch(messageOpen({ type: 'base64', url: document.file_name }))} // Ensure this triggers correctly
                        >
                          {quotation.document_name}
                        </CustomParagraphLight>
                      </Grid>
                      <Grid item xs={3}>
                        <CustomParagraphDark>Document Date</CustomParagraphDark>
                        <CustomParagraphLight>{quotation.document_date}</CustomParagraphLight>
                      </Grid>
                      <Grid item xs={6}>
                        <CustomParagraphDark>Note</CustomParagraphDark>
                        <CustomParagraphLight>{quotation.notes}</CustomParagraphLight> {/* Fixed this */}
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              ))
            ) : (
              <div>Getting Quotes...</div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default LPOCompare;
