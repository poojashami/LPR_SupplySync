import MainCard from 'components/MainCard';
import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import {
  TextField,
  TableHead,
  TableCell,
  IconButton,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableRow,
  Typography,
  Select,
  MenuItem
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toast } from 'react-toastify';
import FullFeaturedCrudGrid from './AddMargin';
import { getShipmentMode } from 'allapi/getAllAPIS';
import OpoView from 'pages/OPO/OpoView';
import { GetPortDestination } from 'Redux/Apis/GetApiCalls';
import { useSelector, useDispatch } from 'react-redux';
import AddFreightCharges from './AddFreightCharges';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import formatNumber from 'utils/functions';

const PfiMargin = ({ setCompany, closePfi, itemData, opoList }) => {
  const dispatch = useDispatch();
  const { PortDestination } = useSelector((state) => state.rfq);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [shipmentMode, setShipmentMode] = useState([]);
  const [selectShipmentMode, setSelectShipmentMode] = useState('');
  const [selectPaymentMode, setSelectPaymentMode] = useState('');
  const [selectPortOfDelivery, setSelectPortOfDelivery] = useState(null);
  const [freightChargesLength, setFreightChargesLength] = useState();
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    setItemList(itemData);
    GetPortDestination(dispatch);
    const fetchData = async () => {
      try {
        const shipmentModeData = await getShipmentMode();
        setShipmentMode(shipmentModeData);
      } catch (error) {
        toast.error('Server Error');
      }
    };
    fetchData();

    const fetchAdditionalCostData = async (id) => {
      try {
        const response = await axiosInstance.get('/api/quotation/additionalcost/freight', {
          params: {
            quo_id: id
          }
        });
        console.log('response.data', response.data);
        setFreightChargesLength(response.data.length);
        let mapped = response.data.map((item, index) => ({
          id: index + 1,
          number_container: item?.number_container,
          type_container: Number(item?.type_container),
          buyer_rate: item?.buyer_charges,
          supplier_rate: item?.supp_charges,
          pfi_rate: item?.buyer_charges + item?.supp_charges,
          line_total: (item?.buyer_charges + item?.supp_charges) * item?.number_container,
          isNew: true
        }));
        setAdditinalFreigthCostData(mapped);

        const { data } = await axiosInstance.get('/api/quotation/additionalcost/compressdata', {
          params: {
            quo_id: id
          }
        });
        console.log('data', data);
        const RemoveFreigth = data.filter((i) => i.heading !== 'Freight_Charges');
        const newArr = RemoveFreigth?.map((item, index) => ({
          id: index + 1,
          _id: index,
          ...item,
          add_amount: Number(item?.buyer_charges) + Number(item?.supp_charges)
        }));

        let totalFreigth = data?.reduce((accum, rate) => {
          return rate.heading === 'Freight_Charges'
            ? (accum = accum + Number(rate.buyer_charges) + Number(rate.supp_charges))
            : (accum += 0);
        }, 0);
        setTotalFreigth(totalFreigth);
        // let totalFOBBuyer = newArr?.reduce((accum, rate) => {
        //   return rate.heading === 'FOB' ? (accum += Number(rate.buyer_charges)) : (accum += 0);
        // }, 0);
        // let totalFOBSupplier = newArr?.reduce((accum, rate) => {
        //   return rate.heading === 'FOB' ? (accum += Number(rate.supp_charges)) : (accum += 0);
        // }, 0);
        // let totalInlandBuyer = newArr?.reduce((accum, rate) => {
        //   return rate.heading === 'Inland_Charges' ? (accum += Number(rate.buyer_charges)) : (accum += 0);
        // }, 0);
        // let totalInlandSupplier = newArr?.reduce((accum, rate) => {
        //   return rate.heading === 'Inland_Charges' ? (accum += Number(rate.supp_charges)) : (accum += 0);
        // }, 0);
        let totalInlandBuy = newArr?.reduce((accum, rate) => {
          return (accum += Number(rate.buyer_charges));
        }, 0);
        let totalFOBSupp = newArr?.reduce((accum, rate) => {
          return (accum += Number(rate.supp_charges));
        }, 0);

        let newArray = [
          ...newArr,
          {
            id: 203,
            _id: 203,
            heading: 'Y',
            charge_name: 'Total',
            buyer_charges: totalInlandBuy,
            supp_charges: totalFOBSupp,
            add_amount: Number(totalInlandBuy) + Number(totalFOBSupp),
            summaryRow: true
          }
          // let newArray = [
          //   ...newArr,
          //   {
          //     id: 200,
          //     _id: 200,
          //     heading: 'FOB',
          //     charge_name: 'Total FOB',
          //     buyer_charges: totalFOBBuyer,
          //     supp_charges: totalFOBSupplier,
          //     add_amount: 0,
          //     summaryRow: true
          //   },
          //   {
          //     id: 201,
          //     _id: 201,
          //     heading: 'Inland_Charges',
          //     charge_name: 'Total Inland',
          //     buyer_charges: totalInlandBuyer,
          //     supp_charges: totalInlandSupplier,
          //     add_amount: 0,
          //     summaryRow: true
          //   },
          //   {
          //     id: 203,
          //     _id: 203,
          //     heading: 'Y',
          //     charge_name: 'Total',
          //     buyer_charges: totalInlandBuy,
          //     supp_charges: totalFOBSupp,
          //     add_amount: 0,
          //     summaryRow: true
          //   }
          // { id: '15', charge_name: 'Total', buyer_charges: 686, supp_charges: 658, add_amount: 100, summaryRow: true }
        ];
        setAdditinalCostData(newArray);
      } catch (error) {
        toast.error('Server Error');
      }
    };
    fetchAdditionalCostData(opoList[0]?.quo_id);
  }, []);

  const [addAdditinalCostData, setAddAdditinalCostData] = useState([]);
  const [additinalCostData, setAdditinalCostData] = useState([]);
  const [additinalCostFreigthData, setAdditinalFreigthCostData] = useState([]);
  const [totalFreigth, setTotalFreigth] = useState(0);
  const [totalInlandFob, setTotalInlandFob] = useState(0);
  const [totalAddAdditionalCost, setTotalAddAdditionalCost] = useState(0);
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);

  useEffect(() => {
    let total = Number(totalFreigth) + Number(totalInlandFob) + Number(totalAddAdditionalCost);
    setTotalAdditionalCost(total);
  }, [totalFreigth, totalInlandFob, totalAddAdditionalCost]);

  useEffect(() => {
    let totalFreight = additinalCostFreigthData?.reduce((total, item) => {
      return total + Number(item.number_container) * Number(item.pfi_rate);
    }, 0);
    console.log('totalFreight', totalFreight);
    setTotalFreigth(totalFreight);
  }, [additinalCostFreigthData]);

  useEffect(() => {
    let totalInlandFob = additinalCostData?.reduce((total, item) => {
      return item.charge_name === 'Total' ? total + 0 : total + Number(item.add_amount);
    }, 0);
    setTotalInlandFob(totalInlandFob);
  }, [additinalCostData]);

  useEffect(() => {
    let totalInlandFob = addAdditinalCostData?.reduce((total, item) => {
      return total + Number(item.charge_amount);
    }, 0);
    setTotalAddAdditionalCost(totalInlandFob);
  }, [addAdditinalCostData]);

  const TableHeaderAdditionalCost = [
    {
      field: 'heading',
      headerName: 'Heading',
      width: 150,
      valueFormatter: (value) => (value === 'FOB' ? 'FOB Charges' : value === 'Inland_Charges' ? 'Inland Charges' : '')
    },
    {
      field: 'charge_name',
      headerName: 'Charges',
      width: 250,
      valueFormatter: (value) => (value === 'Total' ? 'Total' : value?.toUpperCase()?.replace('_', ' ')),
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    },
    {
      field: 'buyer_charges',
      headerName: 'Buying House Charge',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      rowSpanValueGetter: () => null,
      valueFormatter: (value) => `${value}.00`,
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    },
    {
      field: 'supp_charges',
      headerName: 'Supplier Charge',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (value) => `${value}.00`,
      rowSpanValueGetter: () => null,
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    },
    // {
    //   field: 'advice_charges',
    //   headerName: 'Shipment Advice Charge',
    //   width: 150,
    //   headerAlign: 'right',
    //   align: 'right',
    //   valueFormatter: (value) => `${value}.00`,
    //   rowSpanValueGetter: () => null,
    //   cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    // },
    {
      field: 'add_amount',
      headerName: 'Add Amount',
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
                  textAlign: 'right' // Ensure text is right-aligned inside the input
                },
                '& .Mui-disabled': {
                  '-webkit-text-fill-color': '#4f4f4f'
                },
                width: '100%'
              }}
              type="number"
              name="add_amount"
              value={additinalCostData[params.row._id]?.add_amount}
              onChange={(e) => handleChangeAddAmount(e, params.row)}
              onBlur={(e) => handleBlurAddAmount(e)}
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
    console.log('index', row?.charge_name);
    setAdditinalCostData((prevState) =>
      prevState.map((item) => (item.charge_name === row?.charge_name ? { ...item, add_amount: value } : item))
    );
    // setTotalRow({ ...totalRow, add_amount: totalRow.add_amount + Number(value) });
  };

  const handleBlurAddAmount = (e) => {
    setAdditinalCostData((prevState) =>
      prevState.map((item) => (item.charge_name === 'Total' ? { ...item, add_amount: totalInlandFob } : item))
    );
    // setTotalRow({ ...totalRow, add_amount: totalRow.add_amount + Number(value) });
  };

  const [margin, setMargin] = useState(0);
  const [marginLine, setMarginLine] = useState({});
  const [total, setTotal] = useState(0);
  const [lineTotalAfterMargin, setLineTotalAfterMargin] = useState(0);
  const [opoNums, setOpoNums] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [selectedOPO, setSelectedOPO] = useState({
    id: '',
    num: ''
  });

  const AddMarginItems = useCallback((val, mar) => {
    return Number(val) + (Number(mar) / 100) * Number(val);
  }, []);

  useEffect(() => {
    const totalAmount = calculateTotal(itemList);
    setTotal(totalAmount);

    const marginLines = itemList?.reduce((acc, item) => {
      acc[item.id] = { marginByLine: 0 };
      return acc;
    }, {});
    setMarginLine(marginLines);
    setOpoNums(opoList.map((item) => item.opo_num));
  }, [itemList, opoList]);

  const handleChange = (e) => {
    setSelectedOPO({ num: opoList?.filter((item) => item.opo_id === e.target.value)[0].opo_num, id: e.target.value });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setItemList(itemList.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  useEffect(() => {
    const calculateLineTotalAfterMargin = itemList?.reduce((acc, item) => {
      const marginByLine = marginLine[item.id]?.marginByLine || 0;
      const rateWithMargin = AddMarginItems(item.rate, marginByLine);
      const lineTotalWithMargin = Number(item.oprQty) * rateWithMargin;
      return acc + lineTotalWithMargin;
    }, 0);
    setLineTotalAfterMargin(calculateLineTotalAfterMargin);
  }, [itemList, marginLine, AddMarginItems]);

  const calculateTotal = (items) => {
    return items?.reduce((acc, item) => acc + Number(item.oprQty) * Number(item.rate), 0);
  };

  const handleInputTextField = (e, id) => {
    const { name, value } = e.target;
    setMarginLine((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: Number(value) }
    }));
  };

  const handleAllMargin = (e) => {
    const value = e.target.value;
    setMargin(value);
    setMarginLine((prev) =>
      Object.keys(prev)?.reduce((acc, key) => {
        acc[key] = { marginByLine: value };
        return acc;
      }, {})
    );
  };

  const submitPfi = async (e) => {
    e.preventDefault();
    const mappedData = itemList?.map((item, index) => ({
      ...item,
      rate_with_margin: Number(AddMarginItems(item.rate, marginLine[index + 1]?.marginByLine || 0)).toFixed(2),
      line_total_margin: Number(Number(item.oprQty) * AddMarginItems(item.rate, marginLine[index + 1]?.marginByLine || 0)).toFixed(2),
      margin_percent: Number(marginLine[index + 1]?.marginByLine || 0)
    }));
    const formData = {
      amount: lineTotalAfterMargin.toFixed(2),
      shipment_mode: selectShipmentMode,
      payment_mode: selectPaymentMode,
      opo_ids: opoList?.map((item) => item?.opo_id).join(','),
      opo_nums: opoList?.map((item) => item?.opo_num).join(','),
      selectedOPOnum: selectedOPO?.num,
      selectedOPOid: selectedOPO?.id,
      pfiDescription: pfiDescription,
      remarks: remarks,
      items: mappedData,
      portOfDelivery: selectPortOfDelivery,
      addAdditinalCostArr: addAdditinalCostData,
      additinalCostDataArr: additinalCostData,
      additinalCostFreigthDataArr: additinalCostFreigthData,
      totalFreigth: totalFreigth,
      quo_id: opoList[0]?.quo_id,
      quo_num: opoList[0]?.quo_num,
      for_delivery_term: opoList[0]?.quotation_master?.delivery_terms_name
    };
    console.log('formData', formData);
    const { data } = await axiosInstance.post('/api/pfi/create', formData);
    toast.success(data.message);
    closePfi();
    setCompany(null);
  };

  const TableAddMargin = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_code', headerName: 'Item Code', width: 150 },
    { field: 'item_name', headerName: 'Item Name', width: 150 },
    {
      field: 'bh_item_name',
      headerName: 'PFI Item Name',
      width: 150,
      editable: true
    },

    { field: 'oprQty', headerName: 'OPR Qty', width: 75 },
    { field: 'rate', headerName: 'PO Rate', width: 100 },
    {
      field: 'line_total',
      headerName: 'Total',
      width: 100,
      renderCell: (params) => <span>{Number(Number(params.row.oprQty) * Number(params.row.rate)).toFixed(2)}</span>
    },
    {
      field: 'add_margin',
      headerName: 'Add Margin (%)',
      width: 150,
      renderCell: (params) => (
        <TextField
          sx={{
            '& .MuiInputBase-input': {
              padding: '6px'
            },
            '& .Mui-disabled': {
              '-webkit-text-fill-color': '#4f4f4f'
            },
            width: '100%'
          }}
          type="number"
          name="marginByLine"
          value={marginLine[params.row.id]?.marginByLine || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    },
    {
      field: 'rate_with_margin',
      headerName: 'Rate With Margin',
      width: 150,
      renderCell: (params) => (
        <span>{Number(AddMarginItems(params.row.rate, marginLine[params.row.id]?.marginByLine || 0)).toFixed(2)}</span>
      )
    },
    {
      field: 'line_total_with_margin',
      headerName: 'Total With Margin',
      width: 150,
      renderCell: (params) => (
        <span>
          {Number(Number(params.row.oprQty) * AddMarginItems(params.row.rate, marginLine[params.row.id]?.marginByLine || 0)).toFixed(2)}
        </span>
      )
    }
  ];

  const [pfiDescription, setPfiDescription] = useState('');

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
      <MainCard>
        <OpoView rowData={opoList[0]} IsViewAll={false} />
        {/* <Table>
          {renderTableHeader('basicDetails', 'Basic Detail')}
          {showTableHeading.basicDetails && (
            <Grid container spacing={2} sx={{ padding: '12px' }}>
              <Grid item xs={2}>
                OPO Numbers:
              </Grid>
              <Grid item xs={2}>
                {opoNums.join(',')}
              </Grid>
            </Grid>
          )}
        </Table> */}
        <Table>
          {renderTableHeader('otherDetails', 'Generate PFi')}
          {showTableHeading.otherDetails && (
            <>
              <Table style={{ marginTop: '10px' }}>
                <TableBody>
                  <TableRow>
                    <Grid container fullWidth>
                      <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Select Company</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '7px'
                            }
                          }}
                          fullWidth
                          id="select_opo"
                          value={selectedOPO?.id}
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>
                            <em>none</em>
                          </MenuItem>
                          {opoList?.map((item, index) => (
                            <MenuItem key={index} value={item?.opo_id}>
                              {item?.OprMaster?.companyMaster?.company_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Add Margin (%) to All Items</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          id="margin"
                          name="margin"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={margin}
                          onChange={handleAllMargin}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '7px'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1">PFI General Description</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          id="margin"
                          name="margin"
                          variant="outlined"
                          fullWidth
                          type="text"
                          value={pfiDescription}
                          onChange={(e) => setPfiDescription(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '7px'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </TableRow>
                </TableBody>
              </Table>
              <div style={{ marginTop: '20px' }}>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
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
                  rows={itemList}
                  pagination={false}
                  hideFooterPagination
                  columns={TableAddMargin}
                  loading={!itemList?.length}
                  processRowUpdate={processRowUpdate}
                />
                {/* <Grid container style={{ margin: '10px' }}>
                  <Grid item xs={2} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Total
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    {total.toFixed(2)}
                  </Grid>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Total With Margin
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    {lineTotalAfterMargin.toFixed(2)}
                  </Grid>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Total Additional Cost
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    {totalAdditionalCost}
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Remarks
                  </Grid>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    <TextField
                      id="remarks"
                      name="remarks"
                      variant="outlined"
                      fullWidth
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          padding: '7px'
                        }
                      }}
                    />
                  </Grid>
                </Grid> */}
                <Grid container spacing={2} style={{ margin: '10px' }}>
                  <Grid item xs={1} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Mode of Shipment
                  </Grid>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    <Select
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                      value={selectShipmentMode}
                      onChange={(e) => {
                        handleClickOpen();
                        setSelectShipmentMode(e.target.value);
                      }}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>select</em>
                      </MenuItem>
                      {shipmentMode.map((mode) => (
                        <MenuItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={1} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Mode of Payment
                  </Grid>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    <Select
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                      value={selectPaymentMode}
                      onChange={(e) => setSelectPaymentMode(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>select</em>
                      </MenuItem>
                      <MenuItem value="Confirm Letter of Credit - CLC">Confirm Letter of Credit - CLC</MenuItem>
                      <MenuItem value="Unconfirm Letter of Credit - ULC">Unconfirm Letter of Credit - ULC</MenuItem>
                      <MenuItem value="Bill for Collection - BOC">Bill for Collection - BOC</MenuItem>
                      <MenuItem value="Not Valid for Forex - NVF">Not Valid for Forex - NVF</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={1} sm={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    Port of Delivery ##
                  </Grid>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    <Select
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                      fullWidth
                      onChange={(e) => setSelectPortOfDelivery(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>select</em>
                      </MenuItem>
                      {PortDestination?.map((item, index) => (
                        <MenuItem key={index} value={item?.port_destination_id}>
                          {item?.port_destination_name}
                        </MenuItem>
                      ))}
                      {/* <MenuItem value="CLC">Confirm Letter of Credit - CLC</MenuItem>
                      <MenuItem value="ULC">Unconfirm Letter of Credit - ULC</MenuItem>
                      <MenuItem value="BOC">Bill for Collection - BOC</MenuItem>
                      <MenuItem value="NVF">Not Valid for Forex - NVF</MenuItem> */}
                    </Select>
                  </Grid>
                </Grid>
              </div>

              <Box sx={{ marginTop: '20px' }}>
                <DataGrid
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)',
                      padding: '0px'
                      // margin: '12px'
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
                  rowHeight={25}
                  unstable_rowSpanning={true}
                  rows={additinalCostData}
                  columns={TableHeaderAdditionalCost}
                  disableRowSelectionOnClick
                  hideFooter
                  hideFooterSelectedRowCount
                  hideFooterPagination
                />
              </Box>

              {/* <div>
                <h4>Total Inland & FOB: {Number(totalInlandFob) + Number(totalAddAdditionalCost)}</h4>
              </div> */}

              <div>
                <FullFeaturedCrudGrid rows={addAdditinalCostData} setRows={setAddAdditinalCostData} />
              </div>
              {/* <div>
                <h4>Total Add Additinal Amount: {totalAddAdditionalCost}</h4>
              </div> */}
              <div>
                <h4>Total Inland & FOB: {formatNumber(Number(totalInlandFob) + Number(totalAddAdditionalCost))}</h4>
              </div>
              <div>
                <AddFreightCharges
                  freightChargesLength={freightChargesLength}
                  rows={additinalCostFreigthData}
                  setRows={setAdditinalFreigthCostData}
                />
              </div>

              <div>
                <h4>Total Freight: {formatNumber(totalFreigth)}</h4>
              </div>

              <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
                {/* <Button variant="outlined" color="error" onClick={closePfi} sx={{ ml: 2 }}>
                  Close
                </Button> */}
                <Button variant="contained" onClick={submitPfi} sx={{ ml: 2 }}>
                  Generate PFI
                </Button>
              </div>
            </>
          )}
        </Table>
      </MainCard>

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">You have changed the Shipment type for this PFI.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PfiMargin;
