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

const PfiMargin = ({ setCompany, closePfi, itemData, opoList }) => {
  console.log('opoList', opoList);
  console.log('itemData', itemData);

  const [shipmentMode, setShipmentMode] = useState([]);
  const [selectShipmentMode, setSelectShipmentMode] = useState('');
  const [selectPaymentMode, setSelectPaymentMode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shipmentModeData = await getShipmentMode();
        setShipmentMode(shipmentModeData);
      } catch (error) {
        toast.error('Server Error');
      }
    };
    fetchData();
  }, []);

  const [totalSuplierCost, setTotalSuplierCost] = useState(0);
  const [totalBuyerCost, setTotalBuyerCost] = useState(0);
  const [grandTotalSuplierCost, setGrandTotalSuplierCost] = useState(0);
  const [grandTotalBuyerCost, setGrandTotalBuyerCost] = useState(0);

  const [TotalSuplierFreigthCost, setTotalSuplierFreigthCost] = useState(0);
  const [TotalBuyerFreigthCost, setTotalBuyerFreigthCost] = useState(0);

  const [grandTotalSuplierFreigthCost, setGrandTotalSuplierFreigthCost] = useState(0);
  const [grandTotalBuyerFreigthCost, setGrandTotalBuyerFreigthCost] = useState(0);

  const [additinalCostSupplierData, setAdditinalCostSupplierData] = useState([]);
  const [additinalCostBuyerData, setAdditinalCostBuyerData] = useState([]);
  const [additinalCostSupplierFreightData, setAdditinalCostSupplierFreightData] = useState([]);
  const [additinalCostBuyerFreightData, setAdditinalCostBuyerFreightData] = useState([]);

  const [addAdditinalCostSupplier, setAddAdditinalCostSupplier] = useState(0);
  const [addAdditinalCostBuyer, setAddAdditinalCostBuyer] = useState(0);
  const [addAdditinalCostSupplierFreight, setAddAdditinalCostSupplierFreight] = useState(0);
  const [addAdditinalCostBuyerFreight, setAddAdditinalCostBuyerFreight] = useState(0);

  const [addAdditinalCostData, setAddAdditinalCostData] = useState([]);

  const [margin, setMargin] = useState(0);
  const [marginLine, setMarginLine] = useState({});
  const [additionalCostAddAmount, setAdditionalCostAddAmount] = useState({});
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
    const mappedData = opoList[0]?.quotation_master?.additional_costs?.map((item, index) => ({
      id: index + 1,
      ...item
    }));
    const SupplierAdditinalCost = mappedData.filter((item) => {
      return item.charges_by === 'Supplier' && item.heading !== 'Freight_Charges';
    });
    const updatedSupplierCosts = SupplierAdditinalCost.map((item, index) => ({
      _id: index,
      ...item,
      add_amount: 0
    }));
    const totalSupplierChargeAmount = SupplierAdditinalCost.reduce((total, cost) => {
      return Number(total) + Number(cost.charge_amount);
    }, 0);
    setAddAdditinalCostSupplier(totalSupplierChargeAmount);
    setAdditinalCostSupplierData(updatedSupplierCosts);

    const BuyerAdditinalCost = mappedData.filter((item) => {
      return item.charges_by === 'Buyer' && item.heading !== 'Freight_Charges';
    });
    const updatedBuyerCosts = BuyerAdditinalCost.map((item, index) => ({
      _id: index,
      ...item,
      add_amount: 0
    }));
    const totalBuyerChargeAmount = BuyerAdditinalCost.reduce((total, cost) => {
      return Number(total) + Number(cost.charge_amount);
    }, 0);
    setAddAdditinalCostBuyer(totalBuyerChargeAmount);
    setAdditinalCostBuyerData(updatedBuyerCosts);

    const SupplierAdditinalFrieightCost = mappedData.filter((item) => {
      return item.charges_by === 'Supplier' && item.heading === 'Freight_Charges';
    });
    const updatedSupplierFreigthCosts = SupplierAdditinalFrieightCost.map((item, index) => ({
      _id: index,
      ...item,
      add_amount: 0
    }));
    const totalBuyerFreightChargeAmount = SupplierAdditinalFrieightCost.reduce((total, cost) => {
      return Number(total) + Number(cost.charge_amount);
    }, 0);
    setAddAdditinalCostSupplierFreight(totalBuyerFreightChargeAmount);
    setAdditinalCostSupplierFreightData(updatedSupplierFreigthCosts);

    const BuyerAdditinalFrieightCost = mappedData.filter((item) => {
      return item.charges_by === 'Buyer' && item.heading === 'Freight_Charges';
    });
    const updatedBuyerFreigthCosts = BuyerAdditinalFrieightCost.map((item, index) => ({
      _id: index,
      ...item,
      add_amount: 0
    }));
    const totalSupplierFreightChargeAmount = BuyerAdditinalFrieightCost.reduce((total, cost) => {
      return Number(total) + Number(cost.charge_amount);
    }, 0);
    setAddAdditinalCostBuyerFreight(totalSupplierFreightChargeAmount);
    setAdditinalCostBuyerFreightData(updatedBuyerFreigthCosts);

    console.log('mappedData', mappedData);
    const totalAmount = calculateTotal(itemData);
    setTotal(totalAmount);

    const marginLines = itemData.reduce((acc, item) => {
      acc[item.id] = { marginByLine: 0 };
      return acc;
    }, {});
    setMarginLine(marginLines);
    setOpoNums(opoList.map((item) => item.opo_num));
  }, [itemData, opoList]);

  const handleChange = (e) => {
    console.log('addAdditinalCostData', addAdditinalCostData);
    setSelectedOPO({ num: opoList?.filter((item) => item.opo_id === e.target.value)[0].opo_num, id: e.target.value });
  };

  useEffect(() => {
    const calculateLineTotalAfterMargin = itemData.reduce((acc, item) => {
      const marginByLine = marginLine[item.id]?.marginByLine || 0;
      const rateWithMargin = AddMarginItems(item.rate, marginByLine);
      const lineTotalWithMargin = Number(item.oprQty) * rateWithMargin;
      return acc + lineTotalWithMargin;
    }, 0);
    setLineTotalAfterMargin(calculateLineTotalAfterMargin);
  }, [itemData, marginLine, AddMarginItems]);

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + Number(item.oprQty) * Number(item.rate), 0);
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
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = { marginByLine: value };
        return acc;
      }, {})
    );
  };

  const submitPfi = async (e) => {
    e.preventDefault();
    const mappedData = itemData?.map((item, index) => ({
      ...item,
      // index: index + 1,
      // item_code: item.item_type,
      // item_id: item.item_id,
      // item_name: item.item_specification,
      // item_description: item.item_description,
      // oprQty: item.opr_qty,
      // rate: item.rate,
      line_total_margin: Number(item.oprQty) * Number(item.rate),
      margin_percent: Number(marginLine[index + 1]?.marginByLine || 0)
      // remarks: 'Remarks Static Coded'
    }));
    const formData = {
      // payment_request_id: oprViewData?.payment_request_id,
      amount: lineTotalAfterMargin.toFixed(2),
      // company_id: 5,
      // pfi_id: pfi[0].pfi_id,
      shipment_mode: selectShipmentMode,
      payment_mode: selectPaymentMode,
      opo_ids: opoList?.map((item) => item?.opo_id).join(','),
      opo_nums: opoList?.map((item) => item?.opo_num).join(','),
      selectedOPOnum: selectedOPO?.num,
      selectedOPOid: selectedOPO?.id,
      pfiDescription: pfiDescription,
      remarks: remarks,
      items: mappedData,
      addAdditinalCostArr: addAdditinalCostData,
      quo_id: opoList[0]?.quo_id,
      quo_num: opoList[0]?.quo_num,
      for_delivery_term: opoList[0]?.quotation_master?.delivery_terms_name
    };
    const { data } = await axiosInstance.post('/api/pfi/create', formData);
    toast.success(data.message);
    closePfi();
    setCompany(null);
  };

  const TableAddMargin = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_code', headerName: 'Item Code', width: 150 },
    { field: 'item_name', headerName: 'Item Name', width: 150 },
    { field: 'oprQty', headerName: 'OPR Qty', width: 75 },
    { field: 'rate', headerName: 'PO Rate', width: 100 },
    {
      field: 'line_total',
      headerName: 'Total',
      width: 100,
      renderCell: (params) => <span>{Number(Number(params.row.oprQty) * Number(params.row.rate)).toFixed(4)}</span>
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
        <span>{Number(AddMarginItems(params.row.rate, marginLine[params.row.id]?.marginByLine || 0)).toFixed(4)}</span>
      )
    },
    {
      field: 'line_total_with_margin',
      headerName: 'Total With Margin',
      width: 150,
      renderCell: (params) => (
        <span>{Number(params.row.oprQty) * AddMarginItems(params.row.rate, marginLine[params.row.id]?.marginByLine || 0)}</span>
      )
    }
  ];

  const TableSupplierAdditionalCost = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'charge_name', headerName: 'Charge Name', width: 250 },
    { field: 'charge_amount', headerName: `Charge Amount in ${opoList[0]?.quotation_master?.currency}`, width: 180 },
    { field: 'heading', headerName: 'Charges Heading', width: 200 },
    {
      field: 'add_amount',
      headerName: 'Add Amount',
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
          name="add_amount"
          value={additinalCostSupplierData[params.row._id]?.add_amount}
          onChange={(e) => {
            setAdditinalCostSupplierData((prevState) =>
              prevState.map((item) => (item._id === params.row._id ? { ...item, add_amount: e.target.value } : item))
            );
          }}
        />
      )
    }
  ];

  useEffect(() => {
    const totalAddAmount = additinalCostSupplierData.reduce((sum, item) => {
      return sum + parseFloat(item.add_amount);
    }, 0);
    setTotalSuplierCost(totalAddAmount);
    setGrandTotalBuyerCost(totalAddAmount + addAdditinalCostSupplier);
  }, [additinalCostSupplierData]);

  useEffect(() => {
    const totalAddAmount = additinalCostBuyerData.reduce((sum, item) => {
      return sum + parseFloat(item.add_amount);
    }, 0);
    setTotalBuyerCost(totalAddAmount);
    setGrandTotalSuplierCost(totalAddAmount + addAdditinalCostBuyer);
  }, [additinalCostBuyerData]);

  useEffect(() => {
    const totalAddAmount = additinalCostSupplierFreightData.reduce((sum, item) => {
      return sum + parseFloat(item.add_amount);
    }, 0);
    setTotalSuplierFreigthCost(totalAddAmount);
    setGrandTotalSuplierFreigthCost(totalAddAmount + addAdditinalCostSupplierFreight);
  }, [additinalCostSupplierFreightData]);

  useEffect(() => {
    const totalAddAmount = additinalCostBuyerFreightData.reduce((sum, item) => {
      return sum + parseFloat(item.add_amount);
    }, 0);
    setTotalBuyerFreigthCost(totalAddAmount);
    setGrandTotalBuyerFreigthCost(totalAddAmount + addAdditinalCostBuyerFreight);
  }, [additinalCostBuyerFreightData]);

  const TableBuyerAdditionalCost = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'charge_name', headerName: 'Charge Name', width: 250 },
    { field: 'charge_amount', headerName: `Charge Amount in ${opoList[0]?.quotation_master?.currency}`, width: 180 },
    { field: 'heading', headerName: 'Charges Heading', width: 200 },
    {
      field: 'add_amount',
      headerName: 'Add Amount',
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
          name="add_amount"
          value={additinalCostBuyerData[params.row._id]?.add_amount}
          onChange={(e) => {
            setAdditinalCostBuyerData((prevState) =>
              prevState.map((item) => (item._id === params.row._id ? { ...item, add_amount: e.target.value } : item))
            );
          }}
        />
      )
    }
  ];

  const TableSupplierFreigthAdditionalCost = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'charge_name', headerName: 'Charge Name', width: 250 },
    { field: 'charge_amount', headerName: `Charge Amount in ${opoList[0]?.quotation_master?.currency}`, width: 180 },
    { field: 'heading', headerName: 'Charges Heading', width: 200 },
    {
      field: 'add_amount',
      headerName: 'Add Amount',
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
          name="add_amount"
          value={additinalCostSupplierFreightData[params.row._id]?.add_amount}
          onChange={(e) => {
            setAdditinalCostSupplierFreightData((prevState) =>
              prevState.map((item) => (item._id === params.row._id ? { ...item, add_amount: e.target.value } : item))
            );
          }}
        />
      )
    }
  ];

  const TableBuyerFreigthAdditionalCost = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'charge_name', headerName: 'Charge Name', width: 250 },
    { field: 'charge_amount', headerName: `Charge Amount in ${opoList[0]?.quotation_master?.currency}`, width: 180 },
    { field: 'heading', headerName: 'Charges Heading', width: 200 },
    {
      field: 'add_amount',
      headerName: 'Add Amount',
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
          name="add_amount"
          value={additinalCostBuyerFreightData[params.row._id]?.add_amount}
          onChange={(e) => {
            setAdditinalCostBuyerFreightData((prevState) =>
              prevState.map((item) => (item._id === params.row._id ? { ...item, add_amount: e.target.value } : item))
            );
          }}
        />
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
                        <Typography variant="subtitle1">PFI Description</Typography>
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
                  loading={!itemData?.length}
                  rows={itemData}
                  columns={TableAddMargin}
                  pagination={false}
                  hideFooterPagination
                />
                <Grid container style={{ margin: '10px' }}>
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
                </Grid>
                <Grid container spacing={2} style={{ margin: '10px' }}>
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
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
                      onChange={(e) => setSelectShipmentMode(e.target.value)}
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
                  <Grid item xs={2} sm={2} sx={{ justifyContent: 'center', alignContent: 'center' }}>
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
                      <MenuItem value="LC">LC</MenuItem>
                      <MenuItem value="BOC">BOC</MenuItem>
                      <MenuItem value="MBF">MBF</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </div>

              <div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: 'blue' }}>Supplier Cost</strong>
                  <strong>Total Supplier Charge Amount : {addAdditinalCostSupplier}</strong>
                  <strong>Total Supplier Add Amount : {totalSuplierCost}</strong>
                  <strong>Grand Supplier Total Amount : {grandTotalBuyerCost}</strong>
                </div>

                <div>
                  {/* <SupplierAdditinalCostSupplier
                    rows={additinalCostSupplierData}
                    columns={TableSupplierAdditionalCost}
                    setRows={setAdditinalCostSupplierData}
                  /> */}
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
                    rows={additinalCostSupplierData}
                    columns={TableSupplierAdditionalCost}
                    pagination={false}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                  />
                </div>
              </div>

              <div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: 'blue' }}>Buyer Cost</strong>
                  <strong>Total Buyer Charge Amount : {addAdditinalCostBuyer}</strong>
                  <strong>Total Buyer Add Amount : {totalBuyerCost}</strong>
                  <strong>Grand Buyer Total Amount : {grandTotalSuplierCost}</strong>
                </div>
                <div>
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
                    rows={additinalCostBuyerData}
                    columns={TableBuyerAdditionalCost}
                    pagination={false}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                  />
                </div>
              </div>

              <div>
                <FullFeaturedCrudGrid rows={addAdditinalCostData} setRows={setAddAdditinalCostData} />
              </div>

              <div style={{ color: 'Black' }}>
                <h3> Frieght Cost</h3>
              </div>

              <div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: 'blue' }}>Supplier Frieght Cost</strong>
                  <strong>Total Supplier Frieght Charge Amount : {addAdditinalCostSupplierFreight}</strong>
                  <strong>Total Supplier Frieght Add Amount : {TotalSuplierFreigthCost}</strong>
                  <strong>Grand Supplier Frieght Total Amount : {grandTotalSuplierFreigthCost}</strong>
                </div>
                <div>
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
                    rows={additinalCostSupplierFreightData}
                    columns={TableSupplierFreigthAdditionalCost}
                    pagination={false}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                  />
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: 'blue' }}>Buyer Frieght Cost</strong>
                  <strong>Total Buyer Frieght Charge Amount : {addAdditinalCostBuyerFreight}</strong>
                  <strong>Total Buyer Frieght Add Amount : {TotalBuyerFreigthCost}</strong>
                  <strong>Grand Buyer Frieght Total Amount : {grandTotalBuyerFreigthCost}</strong>
                </div>
                <div>
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
                    rows={additinalCostBuyerFreightData}
                    columns={TableBuyerFreigthAdditionalCost}
                    pagination={false}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                  />
                </div>
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
    </>
  );
};

export default PfiMargin;
