import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableRow, IconButton, TableCell, TableHead, Box, TextField, Button, Grid } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import FullFeaturedCrudGrid from 'pages/CommercialInvoice/AddMargin';
import AddFreightCharges from 'pages/CommercialInvoice/AddFreightCharges';

const PurchaseOrder = ({ poData, GetCIList }) => {
  console.log('poData', poData);

  const dispatch = useDispatch();
  const [marginLine, setMarginLine] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [additionalCostData, setAdditionalCostData] = useState([]);
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    updateDetails: true,
    etaDetails: true,
    itemDetails: true,
    containerDetails: true,
    additinalCost: true,
    addCost: true
  });
  useEffect(() => {
    let data = poData?.quotation_master?.additional_costs?.filter((i) => i.reference_table_name === 'shippment_advise_master');
    setAdditionalCostData(data);
  }, [poData]);

  const handleInputTextField = (e, id, saiid) => {
    const { name, value } = e.target;
    setMarginLine((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: Number(value), shipment_advise_item_id: saiid }
    }));
  };

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

  const handleCreateGrn = async () => {
    try {
      let ItemDataArr = itemsData?.map((i, index) => ({ ...i, grn_qty: marginLine[index + 1]?.quantity }));

      console.log('pfi_id', poData?.opo_master?.pfi_masters[0]?.pfi_id);
      const { data } = await axiosInstance.post('/api/shipping/advise/creategrn', {
        po_id: poData?.po_id,
        quo_id: poData?.quo_id,
        pfi_id: poData?.opo_master?.pfi_masters[0]?.pfi_id,
        shippment_advise_id: poData?.shippment_advise_master?.shippment_advise_id,
        ItemDataArr: ItemDataArr
      });
      toast?.success(data?.message);
      await GetCIList(dispatch);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCI = async () => {
    try {
      const f_data = {
        addAdditinalCostArr: addAdditinalCostData,
        additinalCostDataArr: additinalCostData,
        additinalCostFreigthDataArr: additinalCostFreigthData,
        totalFreigth: totalFreigth,
        quo_num: poData?.quo_num,
        for_delivery_term: poData?.delivery_terms_name,

        po_id: poData?.po_id,
        quo_id: poData?.quo_id,
        po_num: poData?.po_num,
        pfi_id: poData?.opo_master?.pfi_masters[0]?.pfi_id,
        pfi_num: poData?.opo_master?.pfi_masters[0]?.pfi_num,
        shippment_advise_id: poData?.shippment_advise_master?.shippment_advise_id,
        // item_list: Object.values(marginLine),
        item_list: itemsData.map((item, index) => ({
          shipment_advise_item_id: item.shipment_advise_item_id,
          ci_rate: marginLine[index + 1]?.ci_rate,
          line_total: Number(marginLine[index + 1]?.ci_rate) * Number(item?.grn_qty)
        })),
        ci_amount:
          ciAmount +
          additionalCostData.reduce((acc, rate) => {
            return (acc += Number(rate.charge_amount));
          }, 0)
      };
      console.log(f_data);
      const { data } = await axiosInstance.post('/api/shipping/advise/createci', f_data);
      console.log(f_data);
      toast?.success(data?.message);
      await GetCIList(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const [ciAmount, setCiAmount] = useState(0);

  useEffect(() => {
    if (Object.values(marginLine)?.length > 0 && poData?.status >= 12) {
      let total = itemsData?.reduce((acc, rate, index) => {
        return (acc += Number(marginLine[index + 1]?.ci_rate) * rate.grn_qty);
      }, 0);
      setCiAmount(total);
    }
  }, [marginLine]);

  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 150 },
    { field: 'item_code', headerName: 'Item Code', width: 150 },
    { field: 'item_name', headerName: 'Item Name', width: 150 },
    { field: 'item_t', headerName: 'Item Vendor Name #', width: 150 },
    { field: 'rate', headerName: 'PO Rate', width: 100 },
    { field: 'opoQty', headerName: 'PO Quantity', width: 150 },
    poData?.status >= 12
      ? {
          field: 'grn_qty',
          headerName: 'GRN Qty',
          width: 150
        }
      : {
          field: 'quantity',
          headerName: 'Advice Qty',
          width: 150
        },
    poData?.status >= 12
      ? {
          field: 'ci_rate',
          headerName: 'CI Rate',
          width: 100,
          renderCell: (params) => (
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                },
                '& .Mui-disabled': {
                  '-webkit-text-fill-color': '#4f4f4f'
                }
              }}
              id="insurance-basic"
              variant="outlined"
              name="ci_rate"
              disabled={Boolean(params.value)}
              value={marginLine[params.row.id]?.ci_rate || params.value}
              onChange={(e) => handleInputTextField(e, params?.row?.id, params?.row?.shipment_advise_item_id)}
              fullWidth
            />
          )
        }
      : {
          field: 'grn_quantity',
          headerName: 'Inward Qty',
          width: 150,
          renderCell: (params) => (
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                },
                '& .Mui-disabled': {
                  '-webkit-text-fill-color': '#4f4f4f'
                }
              }}
              id="insurance-basic"
              variant="outlined"
              name="quantity"
              // disabled={Boolean(params.value)}
              value={marginLine[params.row.id]?.quantity || params.value}
              onChange={(e) => handleInputTextField(e, params?.row?.id, params?.row?.shipment_advise_item_id)}
              fullWidth
            />
          )
        },
    { field: 'balance_qty', headerName: 'Balance Qty #', width: 100 },
    { field: 'remarks', headerName: 'PO Remarks', width: 100 },
    {
      field: 'pack_type',
      headerName: 'Pack Type',
      width: 150
    },
    {
      field: 'pack_size',
      headerName: 'Pack Size',
      width: 150
    },
    {
      field: 'no_of_packs',
      headerName: 'Number of Packs',
      width: 150
    },
    poData?.status === 15
      ? {
          field: 'ci_line_total',
          headerName: 'Line Total',
          width: 100
        }
      : poData?.status >= 12 && {
          field: 'line_total',
          headerName: 'Line Total',
          width: 100
          // renderCell: (params) => <span>{Number(marginLine[params.row.id]?.ci_rate) * Number(params?.row?.grn_qty)}</span>
        }
  ];

  const GetPfiRateByItemId = (id) => {
    let arr = poData?.pfi_items?.filter((i) => i.item_id == id);
    return arr[0]?.rate;
  };

  const getItemsData = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/shipping/advise/byid', {
        params: {
          shipment_advise_id: id
        }
      });
      const mappedData = data?.map((item, index) => ({
        id: index + 1,
        shipment_advise_item_id: item?.shipment_advise_item_id,
        item_type: item?.po_item?.item_type,
        item_name: item?.po_item?.item_name,
        item_code: item?.po_item?.item_code,
        itemSpecification: item?.item_specification,
        itemDescription: item?.item_description,
        opoQty: item?.po_item?.po_qty,
        pfi_rate: GetPfiRateByItemId(item?.item_id),
        rate: item?.po_item?.rate,
        currency: item?.currency,
        remarks: item?.remarks,
        quantity: item?.quantity,
        pack_type: item?.pack_type_name,
        pack_size: item?.po_item?.pack_size,
        no_of_packs: item?.po_item?.no_packs,
        ci_rate: item?.ci_rate,
        // ci_rate: GetPfiRateByItemId(item?.item_id),
        grn_qty: item?.grn_qty,
        ci_line_total: item?.ci_line_total,
        line_total: item?.po_item?.line_total
      }));
      setItemsData(mappedData);
      console.log('data', data);
    } catch (error) {
      console.log(error);
    }
  };

  const containerCols = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'container_no', headerName: 'Container #', width: 150 },
    { field: 'container_size', headerName: 'Container size', width: 150 },
    { field: 'container_type_name', headerName: 'Container type', width: 150 },
    { field: 'gross_weight', headerName: 'Gross Weight', width: 100 },
    { field: 'net_weight', headerName: 'Net Weight', width: 100 },
    { field: 'packet_uom', headerName: 'Packet UOM', width: 100 }
  ];

  const fetchAdditionalCostData = async (id) => {
    try {
      const response = await axiosInstance.get('/api/quotation/additionalcost/ci/freight', {
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
        buyer_rate: item?.buyer_rate,
        supplier_rate: item?.supp_rate,
        pfi_rate: item?.pfi_rate,
        sa_rate: item?.sa_rate,
        ci_rate: item?.buyer_rate + item?.sa_rate,
        line_total: (item?.buyer_rate + item?.sa_rate) * item?.number_container,
        isNew: true
      }));
      setAdditinalFreigthCostData(mapped);

      const { data } = await axiosInstance.get('/api/quotation/additionalcost/ci', {
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
        add_amount: Number(item?.buyer_charges) + Number(item?.sa_charges)
      }));

      let totalFreigth = data?.reduce((accum, rate) => {
        return rate.heading === 'Freight_Charges' ? (accum = accum + Number(rate.buyer_charges) + Number(rate.supp_charges)) : (accum += 0);
      }, 0);
      setTotalFreigth(totalFreigth);
      let totalInlandBuy = newArr?.reduce((accum, rate) => {
        return (accum += Number(rate.buyer_charges));
      }, 0);
      let totalFOBSupp = newArr?.reduce((accum, rate) => {
        return (accum += Number(rate.supp_charges));
      }, 0);
      let totalPFI = newArr?.reduce((accum, rate) => {
        return (accum += Number(rate.pfi_charges));
      }, 0);
      let totalSA = newArr?.reduce((accum, rate) => {
        return (accum += Number(rate.sa_charges));
      }, 0);
      let totalAddAmount = newArr?.reduce((accum, rate) => {
        return (accum += Number(rate.add_amount));
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
          pfi_charges: totalPFI,
          sa_charges: totalSA,
          add_amount: totalAddAmount,
          summaryRow: true
        }
      ];
      setAdditinalCostData(newArray);
    } catch (error) {
      toast.error('Server Error');
    }
  };
  useEffect(() => {
    getItemsData(poData?.shippment_advise_master?.shippment_advise_id);
    fetchAdditionalCostData(poData?.quo_id);
  }, []);

  const [addAdditinalCostData, setAddAdditinalCostData] = useState([]);
  const [additinalCostData, setAdditinalCostData] = useState([]);
  const [additinalCostFreigthData, setAdditinalFreigthCostData] = useState([]);
  const [totalFreigth, setTotalFreigth] = useState(0);
  const [totalInlandFob, setTotalInlandFob] = useState(0);
  const [totalAddAdditionalCost, setTotalAddAdditionalCost] = useState(0);
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);
  const [freightChargesLength, setFreightChargesLength] = useState();

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
      field: 'pfi_charges',
      headerName: 'PFI Charges',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (value) => `${value}.00`,
      rowSpanValueGetter: () => null,
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
    {
      field: 'sa_charges',
      headerName: 'Shipment Advice Charges',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (value) => `${value}.00`,
      rowSpanValueGetter: () => null,
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    },
    {
      field: 'add_amount',
      headerName: 'CI Amount',
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

  return (
    <div>
      <Table>
        {renderTableHeader('basicDetails', 'Basic Details')}
        {showTableHeading.basicDetails && (
          <>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Supplier Name & Address
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '320px' }}>
                  <Typography>{`${poData?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name} ${poData?.opo_master?.OprMaster?.BuyingHouse?.address_line1} ${poData?.opo_master?.OprMaster?.BuyingHouse?.address_line2} ${poData?.opo_master?.OprMaster?.BuyingHouse.country}`}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PO Vendor
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.VendorsMaster?.vendor_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PO Number
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.po_num}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PO Value
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{formatNumber(poData?.total_cost)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Supplier Ref No(Quote no)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.opo_master?.quotation_master?.quo_num}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Delivery Term
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipment mode
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.opo_master?.OprMaster?.shipment_mode_name}</Typography>
                </TableCell>
                {/* <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Inco Term
                </Typography>
              </TableCell>
              <TableCell>
                <Typography></Typography>
              </TableCell> */}
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    FORM M No
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.form_m_num}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    BA No
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.ba_num}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    LC No
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.lc_num}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    No of Previous shipment
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography></Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Amount of Previous shipment
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography></Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Balance to Ship
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        )}
      </Table>

      <Table>
        {renderTableHeader('updateDetails', 'Details')}
        {showTableHeading.updateDetails && (
          <>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipment Status:
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '320px' }}>
                  <Typography>{poData?.shippment_advise_master?.shipment_status}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Invoice Amount:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.invoice_amount}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    BL/AWB no:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.bl_awb_no}</Typography>
                </TableCell>
                {/* <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    No of Container:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.shipment_status}</Typography>
                </TableCell> */}
              </TableRow>

              <TableRow container spacing={1} alignItems="center">
                <Typography variant="h5" color="primary" sx={{ margin: '20px' }}>
                  Bl Information
                </Typography>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    BL/AWB Dt:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.bl_awb_date?.split('T')[0]}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Type of BL:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.type_of_bl}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipment Type:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.shipment_type}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    CBM Information:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.cbm_information}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Free Days:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.free_days}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipping/Airline:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.shipping_vehicle}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vessel Name/Flight Number:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.vehicle_description}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Port of Loading:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.port_of_loading}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Port of Delivery:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.port_of_discharge}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Final Destination:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.final_destination}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Goods Description:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.goods_description}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipper name:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.shipper_name}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Consignee:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.consignee_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Notify Party:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.notify_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Freight:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.freight}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    ETA:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{poData?.shippment_advise_master?.eta}</Typography>
                </TableCell>
                {poData?.status >= 12 && (
                  <>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Total CI Amount:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {poData?.status === 15
                          ? poData?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_amount
                          : ciAmount +
                            additionalCostData.reduce((acc, rate) => {
                              return (acc += Number(rate.charge_amount));
                            }, 0)}
                      </Typography>
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </>
        )}
      </Table>

      <Table>
        {renderTableHeader('additinalCost', 'Additional Charges')}
        {showTableHeading.additinalCost && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  {additionalCostData?.map((cost, index) => (
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
          </TableBody>
        )}
      </Table>

      <Table>{renderTableHeader('itemDetails', 'Items Data')}</Table>
      {showTableHeading.itemDetails && (
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            minHeight: '30vh',
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
          rows={itemsData}
          columns={stockItemColumns}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      )}

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

      <Table>{renderTableHeader('containerDetails', 'Container Details')}</Table>
      {showTableHeading.containerDetails && (
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
          rows={poData?.add_shippment_containers?.map((item, index) => ({ id: index + 1, ...item }))}
          columns={containerCols}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end', gap: '12px', marginTop: '18px' }}>
        {poData?.status === 11 && (
          <Button variant="contained" color="primary" onClick={handleCreateGrn}>
            Create GRN
          </Button>
        )}
        {poData?.status === 12 && (
          <Button variant="contained" color="primary" onClick={handleCreateCI}>
            Create Invoice
          </Button>
        )}
      </Box>
    </div>
  );
};

export default PurchaseOrder;
