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
  TableHead,
  TableBody,
  TextField,
  TableCell,
  IconButton,
  Typography,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { toast } from 'react-toastify';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { GetRfq } from 'Redux/Apis/GetApiCalls';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from 'utils/axiosInstance';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ForwardIcon from '@mui/icons-material/Forward';
import { useDispatch, useSelector } from 'react-redux';
import ValidationStar from 'components/ValidationStar';
import RecommendIcon from '@mui/icons-material/Recommend';
import SelectFieldPadding from 'components/selectFieldPadding';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80%',
  overflowY: 'auto',
  borderRadius: '15px'
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
const Quote_Compare = ({ compareMode }) => {
  const dispatch = useDispatch();
  const [quote, setQuote] = useState([]);
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState({});
  const [doc_list, setDoc_list] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [quotesData, setQuotesData] = useState([]);
  const { rfqs } = useSelector((state) => state.rfq);
  const { cont_sizes } = useSelector((state) => state.static);
  const [openDia, setOpenDia] = React.useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');
  const [previous_charges, setPreviousCharges] = useState({});
  const [open2, setOpen2] = useState({ condition: false, id: 0, num: '' });
  const [convert_to_delivery_term, setConvert_to_deliveryTerm] = useState('CFR');
  const [FreightArray, setFreightArray] = useState([
    { no_of_container: '', types_of_container: '', rate: '', total_freight: '', isNew: true }
  ]);
  const [po_create_data, setPo_create_data] = useState({
    opo_description: '',
    unit_justification: '',
    procurement_justification: ''
  });
  const [formValuesCharges, setFormValuesCharges] = useState({
    bl: 0,
    vgm: 0,
    // rate: 0,
    miscellaneous: 0,
    // no_container: 0,
    container_seal: 0,
    // size_container: 0,
    // types_container: 0,
    total_freight_charges: 0,
    container_stuffing: 0,
    thc: 0,
    miscellaneous_inland: 0,
    inspection_charges: 0,
    special_packaging: 0,
    load_transportation: 0
  });
  const { quotationsByRFQ } = useSelector((state) => state.quotation);
  const [shippingTerms] = useState(['CFR', 'FOB', 'EXW']);
  const [isCFR, setIsCFR] = useState(false);
  const [isFOB, setIsFOB] = useState(false);
  const [isEXW, setIsEXW] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState([]);

  const handleClose2 = () => {
    setOpen2((val) => ({ ...val, condition: false }));
  };

  const handleInputChangeCharges = (e) => {
    const { name, value } = e.target;
    setFormValuesCharges({ ...formValuesCharges, [name]: value });
  };

  const handleInputChangeFreight = (e, index, field) => {
    const { value } = e.target;
    setFreightArray((prevArray) => prevArray?.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    if (field === 'rate') {
      setFreightArray((prevArray) =>
        prevArray?.map((item, i) => (i === index ? { ...item, total_freight: item.no_of_container * item.rate } : item))
      );
    }
  };

  const setTotalFreight = () => {
    const total = FreightArray?.reduce((sum, item) => sum + parseFloat(item.total_freight), 0);
    setFormValuesCharges({ ...formValuesCharges, total_freight_charges: total });
  };

  useEffect(() => {
    setTotalFreight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FreightArray]);

  function transformCosts(data) {
    return data?.map((group) => {
      const additionalCosts = group?.index?.map((item) => {
        if (item?.for_delivery_term === convert_to_delivery_term) return item.additionalCosts;
      });
      return { additionalCosts };
    });
  }

  const fetch_data = async () => {
    try {
      const { data } = await axiosInstance.get('/api/opr/items', {
        params: {
          opr_id: compareMode?.opr_id
        }
      });
      const mapped_data = data?.map((item, index) => ({
        id: index + 1,
        city: item?.ItemsMaster?.item_code,
        item_type: item?.ItemsMaster?.item_type,
        item_name: item?.ItemsMaster?.item_name,
        // item_spec: item?.item_description,
        opr_qty: item?.qty
      }));

      setItemsList(mapped_data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetch_data();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareMode]);

  const handleClickOpenDia = () => {
    setOpenDia(true);
  };
  const handleCloseDia = () => {
    setOpenDia(false);
  };

  const addFreightEntry = () => {
    setFreightArray((prevArray) => [
      ...prevArray,
      { no_of_container: '', types_of_container: '', rate: '', total_freight: '', isNew: true }
    ]);
  };

  const removeFreightEntry = (index) => {
    setFreightArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const vendorDetailsCols = [
    { headerName: 'Quote ID', field: 'quoteNum', width: 120 },
    { headerName: 'Vendor', field: 'vendor_name', width: 220 },
    { headerName: 'Date', field: 'quote_received_date' },
    { headerName: 'Delivery Terms', field: 'delivery_term' },
    { headerName: 'Remarks', field: 'remarks', width: 120 },
    { headerName: 'Lead Time', field: 'lead_time' },
    { headerName: 'Payment Terms', field: 'payment_terms', width: 250 },
    { headerName: 'Quote Curr', field: 'currency', width: 100 },

    {
      headerName: 'Product Cost',
      field: 'product_amt',
      width: 150,
      renderCell: (params) => <span>{formatNumber(params.value)}</span>
    },
    {
      headerName: 'Supp Freight costs',
      field: 'supp_freight_costs',
      renderCell: (params) => <span>{formatNumber(params.value)}</span>,
      width: 120
    },
    {
      headerName: 'Supp Add costs',
      field: 'supp_additional_costs',
      renderCell: (params) => <span>{formatNumber(params.value)}</span>,
      width: 120
    },
    // {
    //   headerName: 'Quote Amt',
    //   field: 'quote_amt',
    //   renderCell: (params) => <span>{formatNumber(params.value)}</span>,
    //   width: 120
    // },
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
      headerName: 'Inland Charges',
      field: 'inland_charges',
      renderCell: (params) => {
        return <span>{formatNumber(params.value)}</span>;
      },
      width: 120
    },
    {
      headerName: 'FOB Charges',
      field: 'fob_charges',
      renderCell: (params) => <span>{formatNumber(params.value)}</span>,
      width: 120
    },
    {
      headerName: 'Freight Charges',
      field: 'Freight_Charges',
      renderCell: (params) => <span>{formatNumber(params.value)}</span>,
      width: 120
    },
    {
      headerName: 'BH Add. costs',
      field: 'additional_costs',
      renderCell: (params) => <span>{formatNumber(Number(params.value))}</span>,
      width: 120
    },
    {
      headerName: 'Total Additional cost',
      field: 'effective_cost',
      renderCell: (params) => <span>{formatNumber(Number(params.value))}</span>,
      width: 150
    },
    {
      headerName: 'Final Comparable Amt',
      field: 'final_amount',
      // renderCell: (params) => <span>{formatNumber(params.value + params.row.effective_cost)}</span>,
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
      renderCell: (params) => <span>{formatNumber(((convertCurrency(Number(1), params.row.currency, currency))).toFixed(4))}</span>,
      // renderCell: (params) => <span>`1 USD ${rates[params.row.currency]}`</span>,
      renderHeader: () => {
        return <span>Conversion rate to {currency}</span>;
      },
      width: 150
    },
    {
      headerName: `Final Amt ${currency}`,
      field: 'final_amount_usd',
      width: 150,
      renderCell: (params) => <span>{formatNumber((Number(params.value) * convertCurrency(Number(1), params.row.currency, currency)).toFixed(2))}</span>
      // renderCell: (params) => <span>{params.value}</span>
    }
  ];
  const [showTableHeading, setShowTableHeading] = useState({
    documents: true,
    otherDetails: true,
    additionalDetails: true
  });
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  // eslint-disable-next-line no-unused-vars
  const [supplierCost, setSupplierCost] = useState('');

  const getData = async () => {
    const { data } = await axiosInstance.get(`/api/quotation/quotes?company_id=${compareMode.company_id}&opr_id=${compareMode.opr_id}`);
    // let aditionalCostAbc = data[0]?.RfqMaster?.quotation_masters[2]?.additional_costs?.map((item) => ({
    //   charge_amount: item?.charge_amount,
    //   charge_name: item?.charge_name
    // }));
    const filterQuo = data[0]?.RfqMaster?.quotation_masters?.filter((item) => item.status == 20);
    setSelectedQuotation(filterQuo);
    const filterSupplierCost = data[0]?.RfqMaster?.quotation_masters[2]?.additional_costs?.filter((item) => item.charges_by == 'Supplier');
    setSupplierCost(filterSupplierCost);
    const mappedData = data[data.length - 1]?.RfqMaster?.quotation_masters?.map((item, index) => {
      return {
        id: index + 1,
        quote_id: item?.quo_id,
        quoteNum: item?.quo_num,
        rfq_id: item?.rfq_id,
        vendor_id: item?.vendor_id,
        vendor_num: item?.VendorsMaster?.vendor_series,
        vendor_name: item?.VendorsMaster?.vendor_name,
        delivery_term: item?.delivery_terms_name,
        country_supply: item?.country_supply,
        country_origin: item?.country_origin,
        port_loading: item?.port_loading,
        lead_time: item?.lead_time,
        quote_received_date: item?.reference_date,
        remarks: item?.remarks,
        currency: item?.currency,
        payment_terms: item?.payment_terms,
        procurement_justification: item?.procurement_justification,
        product_amt: item?.quotation_items?.reduce((total, num) => {
          let amt = Number(num?.line_total);
          return amt + total;
        }, 0),
        quote_amt: Number(
          item?.additional_costs?.reduce((total, charge) => {
            if (charge.charges_by === 'Supplier' && charge.charge_amount) {
              return total + parseFloat(charge.charge_amount);
            }
            return total;
          }, 0) + Number(item?.total_cost)
        ),
        quote_all_Data: item?.quotation_items,
        additional_costs: item?.additional_costs?.reduce((total, charge) => {
          if (charge?.charges_by?.toUpperCase() === 'BUYER') {
            return total + parseFloat(charge.charge_amount) || 0;
          }
          return total;
        }, 0),
        supp_additional_costs: item?.additional_costs?.reduce((total, charge) => {
          if (charge.charges_by === 'Supplier' && charge.charge_amount && charge?.heading !== 'Freight_Charges') {
            return total + parseFloat(charge.charge_amount);
          }
          return total;
        }, 0),

        supp_freight_costs:
          item?.additional_costs?.length > 0 &&
          item?.additional_costs?.reduce((accumulator, currentValue) => {
            // Ensure for_delivery_term is neither null nor undefined, and the rest of the conditions are met
            if (
              currentValue?.heading === 'Freight_Charges' &&
              // currentValue?.for_delivery_term !== null &&
              // currentValue?.for_delivery_term !== undefined &&
              // currentValue?.for_delivery_term === convert_to_delivery_term &&
              currentValue?.charges_by?.toUpperCase() === 'SUPPLIER'
            ) {
              return Number(accumulator || 0) + Number(currentValue?.charge_amount || 0);
            } else {
              // Return accumulator unchanged if conditions aren't met
              return accumulator;
            }
          }, 0),

        fob_charges:
          item?.additional_costs?.length > 0 &&
          item?.additional_costs?.reduce((accumulator, currentValue) => {
            // Ensure for_delivery_term is neither null nor undefined, and the rest of the conditions are met
            if (
              currentValue?.heading === 'FOB' &&
              // currentValue?.for_delivery_term !== null &&
              // currentValue?.for_delivery_term !== undefined &&
              // currentValue?.for_delivery_term === convert_to_delivery_term &&
              currentValue?.charges_by?.toUpperCase() === 'BUYER'
            ) {
              return Number(accumulator || 0) + Number(currentValue?.charge_amount || 0);
            } else {
              // Return accumulator unchanged if conditions aren't met
              return accumulator;
            }
          }, 0), // Initial accumulator is 0

        inland_charges:
          item?.additional_costs?.length > 0 &&
          item?.additional_costs?.reduce((accumulator, currentValue) => {
            // Ensure for_delivery_term is neither null nor undefined, and the rest of the conditions are met
            if (
              currentValue?.heading === 'Inland_Charges' &&
              // currentValue?.for_delivery_term !== null &&
              // currentValue?.for_delivery_term !== undefined &&
              // currentValue?.for_delivery_term === convert_to_delivery_term &&
              currentValue?.charges_by?.toUpperCase() === 'BUYER'
            ) {
              return Number(accumulator || 0) + Number(currentValue?.charge_amount || 0);
            } else {
              // Return accumulator unchanged if conditions aren't met
              return accumulator;
            }
          }, 0), // Initial accumulator is 0
        // charge_name
        Freight_Charges:
          item?.additional_costs?.length > 0
            ? item.additional_costs.reduce((accumulator, currentValue) => {
              if (
                currentValue?.heading === 'Freight_Charges' &&
                currentValue?.for_delivery_term === convert_to_delivery_term &&
                currentValue?.charges_by?.toUpperCase() === 'BUYER' &&
                currentValue?.charge_name === 'total_freight_charges' &&
                (currentValue?.charge_amount !== '' || currentValue?.charge_amount !== null)
              ) {
                return Number(accumulator || 0) + Number(currentValue?.charge_amount || 0);
              }
              return accumulator;
            }, 0)
            : 0,
        effective_cost: Number(
          item?.additional_costs?.reduce((total, charge) => {
            if (charge.charge_amount) {
              return total + parseFloat(charge.charge_amount);
            }
            return total;
          }, 0)
        ),
        final_amount: formatNumber(
          Number(
            item?.quotation_items?.reduce((total, num) => {
              let amt = Number(num?.line_total);
              return amt + total;
            }, 0) +
            Number(
              item?.additional_costs?.reduce((total, charge) => {
                if (charge.charge_amount) {
                  return total + parseFloat(charge.charge_amount);
                }
                return total;
              }, 0)
            )
          )
        ),
        final_amount_usd: Number(
          item?.quotation_items?.reduce((total, num) => {
            let amt = Number(num?.line_total);
            return amt + total;
          }, 0) +
          Number(
            item?.additional_costs?.reduce((total, charge) => {
              if (charge.charge_amount) {
                return total + parseFloat(charge.charge_amount);
              }
              return total;
            }, 0)
          )
        ),
        items: item?.quotation_items?.map((x, i) => ({
          quo_num_id: index + 1,
          id: i + 1,
          rate: x?.rate,
          qty: x?.quote_qtd,
          item_id: x?.item_id,
          no_packs: x?.no_packs,
          pack_size: x?.pack_size,
          currency: item?.currency,
          product_amt: item?.quotation_items?.reduce((total, num) => {
            let amt = Number(num?.line_total);
            return amt + total;
          }, 0),
          quote_amt: Number(
            item?.additional_costs?.reduce((total, charge) => {
              if (charge.charges_by === 'Supplier' && charge.charge_amount) {
                return total + parseFloat(charge.charge_amount);
              }
              return total;
            }, 0) + Number(item?.total_cost)
          ),
          pack_type_name: x?.pack_type_name,
          delivery_term: item?.delivery_terms_name,
          add_cost: Number(
            item?.additional_costs?.reduce((total, charge) => {
              if (charge.charge_amount) {
                return total + parseFloat(charge.charge_amount);
              }
              return total;
            }, 0)
          )
        }))
      };
    });

    const mapped_docs = data[0]?.RfqMaster?.quotation_masters?.map((quote) =>
      quote.QuoDocs?.map((doc) => ({
        quotation_id: quote?.quo_num,
        document_name: doc?.q_doc_name,
        document_date: quote?.reference_date,
        file_name: doc?.q_doc_filename,
        notes: doc?.q_doc_remarks
      }))
    );
    setDoc_list(mapped_docs?.map((item, index) => ({ id: index + 1, ...item[0] })));
    const mappedCosts = data[0]?.RfqMaster?.quotation_masters?.map((quotation) => ({
      index: quotation.additional_costs?.map((cost) => {
        if (cost?.charge_name !== 'charges_by') {
          return {
            quote_id: quotation?.quo_id,
            for_delivery_term: cost?.for_delivery_term,
            additionalCosts: { [cost.charge_name]: Number(cost.charge_amount) }
          };
        }
      })
    }));
    setPreviousCharges(mappedCosts);
    setQuotesData(mappedData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convert_to_delivery_term]);

  const submit_add_charges = async (quo_num, quo_id, for_delivery_term, FreightArray, additional_cost) => {
    try {
      const { data } = await axiosInstance.put('/api/quotation/additional/cost', {
        quo_id,
        additional_cost,
        quo_num,
        for_delivery_term,
        FreightArray
      });
      setOpen2(false);
      fetch_data();
      getData();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const rates = {
    USD: 1.0,
    INR: 84.81,
    ZAR: 17.85,
    VEF: 5026890.55,
    CNY: 7.27,
    ANG: 1.78
  };

  const convertCurrency = (cost, from, to) => {
    if (from === to) {
      return Number(cost);
    } else {
      const costInUSD = cost / rates[from];
      const convertedCost = costInUSD * rates[to];
      return Number(convertedCost);
    }
  };

  const itemColumnRFQ = [
    { headerName: 'Sr.No.', field: 'id', width: 40 },
    { headerName: 'Item Category', field: 'item_type', width: 120 },
    { headerName: 'Item Code', field: 'city', width: 80 },
    { headerName: 'Item Name', field: 'item_name' },
    // { headerName: 'Item Spec', field: 'item_spec' },
    { headerName: 'OPR Qty', field: 'opr_qty', width: 80, renderCell: (params) => <span>{formatNumber(params.value)}</span> }
  ];

  const itemColumn = [
    { headerName: 'No. Packs', field: 'no_packs', renderCell: (params) => <span>{formatNumber(params.value)}</span> },
    { headerName: 'Pack Type', field: 'pack_type_name' },
    { headerName: 'Pack Size', field: 'pack_size' },
    {
      headerName: 'Rate',
      width: 80,
      field: 'rate',
      renderCell: (params) => <span>{convertCurrency(params?.value, params.row.currency, currency).toFixed(2)}</span>
    },
    {
      headerName: 'Eff Rate',
      width: 80,
      field: 'CalcRate',
      valueGetter: (_, row) => {
        let amt = 0;
        const calculateCFRAmount = (row) => {
          // let amtNew = Number((row.add_cost / row.quote_amt) * (row.qty * row.rate) + row.qty * row.rate) / row.qty;
          let amtNew = Number((row.add_cost / row.product_amt) * (row.qty * row.rate) + row.qty * row.rate) / row.qty;
          return amtNew;
        };
        if (row.delivery_term === 'CFR') {
          // amt = parseFloat(row.rate);
          amt = parseFloat(calculateCFRAmount(row));
        } else if (row.delivery_term === 'FOB') {
          if (convert_to_delivery_term === 'CFR') {
            amt = parseFloat(calculateCFRAmount(row));
          } else {
            amt = parseFloat(row.rate);
          }
        } else if (row.delivery_term === 'EXW') {
          if (convert_to_delivery_term === 'CFR' || convert_to_delivery_term === 'FOB') {
            amt = parseFloat(calculateCFRAmount(row));
          } else {
            amt = parseFloat(row.rate);
          }
        }

        let netAmt = amt;
        return convertCurrency(netAmt, row.currency, currency).toFixed(2);
        // return row.rate;
        // return convertCurrency(row.rate, row.currency, currency);
      }
    },
    {
      headerName: 'Quantity',
      field: 'qty',
      valueGetter: (_, row) => {
        return formatNumber(row.qty);
      }
    },
    {
      // headerName: 'Total',
      renderHeader: () => {
        return <span>Total ({currency})</span>
      },
      valueGetter: (_, row) => {
        let amt = 0;
        const calculateCFRAmount = (row) => {
          // let amtNew = Number((row.add_cost / row.quote_amt) * (row.qty * row.rate) + row.qty * row.rate) / row.qty;
          let amtNew = Number((row.add_cost / row.product_amt) * (row.qty * row.rate) + row.qty * row.rate) / row.qty;
          return amtNew;
        };
        if (row.delivery_term === 'CFR') {
          // amt = parseFloat(row.rate);
          amt = parseFloat(calculateCFRAmount(row));
        } else if (row.delivery_term === 'FOB') {
          if (convert_to_delivery_term === 'CFR') {
            amt = parseFloat(calculateCFRAmount(row));
          } else {
            amt = parseFloat(row.rate);
          }
        } else if (row.delivery_term === 'EXW') {
          if (convert_to_delivery_term === 'CFR' || convert_to_delivery_term === 'FOB') {
            amt = parseFloat(calculateCFRAmount(row));
          } else {
            amt = parseFloat(row.rate);
          }
        }

        let netAmt = amt;
        return convertCurrency(netAmt * row.qty, row.currency, currency).toFixed(2);
        // return row.rate;
        // return convertCurrency(row.rate, row.currency, currency);
      }
    }
  ];

  const getVendorDetails = async (id) => {
    const { data } = await axiosInstance.get(`/api/vendor/vendor/${id}`);
    const mappedData = {
      vendorName: data.vendor_name,
      email: data.email,
      phoneNumber: data.phone_number,
      alternate_phone_number: data.alternate_phone_number,
      vendorType: data.vendor_type_id,
      vendorStatus: data.vendor_status ? 'Active' : 'Inactive',
      registrationDate: data.registration_date,
      taxId: data.tax_id,
      contactPerson: data.contact_person,
      contactPersonPhone: data.contact_person_phone,
      contactPersonEmail: data.contact_person_email,
      paymentTerms: data.payment_terms_id,
      reference_by: data.reference_by,
      addressLine1: '123 Main St',
      addressLine2: 'Suite 400',
      pincode: '12345',
      country: 'USA',
      state: 'California',
      city: 'Los Angeles',
      addressLine11: '456 Secondary St',
      addressLine22: 'Apt 789',
      pincode1: '67890',
      country1: 'USA',
      state1: 'California',
      city1: 'San Francisco',
      complianceStatus: data.compliance_status,
      last_audited_docs: data.last_audited_docs_name,
      division: 'North America',
      tin_num: data.tin_num,
      gst_num: data.gst_num,
      vat_num: data.vat_num,
      bankName: 'Big Bank',
      bankAccountNumber: '1234567890',
      bankIfscCode: 'BIGB0000001',
      bank1_ref_cheque: 'Ref1234',
      buyinHouse: 'Internal',
      bankName1: 'Another Bank',
      bankAccountNumber1: '0987654321',
      bankIfscCode1: 'ANBK0000002',
      bank2_ref_cheque: 'Ref5678',
      notes: data.notes
    };
    setVendor(mappedData);
  };

  const handleOpen = async (quote) => {
    const formdata = quote?.procurement_justification
      ? {
        quo_id: quote?.quote_id,
        quo_num: quote?.quoteNum,
        total_cost: 1000,
        rfq_id: quote?.rfq_id,
        opr_id: compareMode.opr_id,
        opr_num: compareMode.opr_num,
        vendor_id: quote.vendor_id,
        item_list: quote.quote_all_Data,
        procurement_justification: quote?.procurement_justification
      }
      : {
        quo_id: quote?.quote_id,
        quo_num: quote?.quoteNum,
        rfq_id: quote?.rfq_id,
        opr_id: compareMode.opr_id,
        opr_num: compareMode.opr_num
      };
    setQuote(formdata);
    await getVendorDetails(quote?.vendor_id);
    setOpen(true);
  };

  const create_po = async (quotation) => {
    if (!openDia) {
      console.log(quotation);
      const formdata = quotation?.procurement_justification
        ? {
          quo_id: quotation?.quote_id,
          quo_num: quotation?.quoteNum,
          total_cost: 1000,
          rfq_id: quotation?.rfq_id,
          opr_id: compareMode.opr_id,
          opr_num: compareMode.opr_num,
          vendor_id: quotation.vendor_id,
          item_list: quotation.quote_all_Data,
          procurement_justification: quotation?.procurement_justification
        }
        : {
          quo_id: quotation?.quote_id,
          quo_num: quotation?.quoteNum,
          rfq_id: quotation?.rfq_id,
          opr_id: compareMode.opr_id,
          opr_num: compareMode.opr_num
        };
      setQuote(formdata);
      handleClickOpenDia();
    } else {
      try {
        const { data } = await axiosInstance.post(
          '/api/opo',
          quote?.procurement_justification
            ? { ...quote, unit_justification: po_create_data.unit_justification }
            : { ...quote, procurement_justification: po_create_data.procurement_justification }
        );
        toast.success(data.message);
        handleClose();
        handleCloseDia();
      } catch (error) {
        toast.error(error.message);
        handleClose();
        handleCloseDia();
      }
    }
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    rfqs?.length === 0 && GetRfq(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    // const data = quotationsByRFQ?.map((item, index) => ({
    //   srNo: index + 1,
    //   document: `Document ${1}`,
    //   documentDate: item.created_on,
    //   title: `title ${1}`,
    //   fileName: item.quote_doc_name,
    //   notes: `notes ${1}`,
    //   createdBy: 'User A',
    //   downloadFile: item.quote_doc
    // }));
    // setDocs(data);
  }, [quotationsByRFQ]);

  useEffect(() => {
    const ids = quotesData?.map((item, index) => {
      if (item?.procurement_justification) {
        return index + 1;
      }
    });
    setSelectedQuoteForView(ids);
  }, [quotesData]);

  const [selectedQuoteForView, setSelectedQuoteForView] = useState([]);
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
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Vendor Details
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vendor Name:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.vendorName}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Email:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Phone Number:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.phoneNumber}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Alternate Phone Number:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.alternate_phone_number}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vendor Type:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.vendorType}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vendor Status:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.vendorStatus}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Registration Date:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.registrationDate}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Tax ID:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.taxId}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Reference By:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.reference_by}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Contact Person:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.contactPerson}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Contact Person Phone:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.contactPersonPhone}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Contact Person Email:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.contactPersonEmail}</Typography>
                </TableCell>
              </TableRow>
              {/* <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Payment Term:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.paymentTerms}</Typography>
                </TableCell>
                <TableCell />
                <TableCell /> */}
              {compareMode.status !== '11' && (
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Actions:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button onClick={create_po} variant="contained" color="primary" endIcon={<RecommendIcon />}>
                      Confirm
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Modal>
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  minHeight: '120px',
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex'
                    // justifyContent: 'end',
                    // alignItems: 'center'
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
                rows={quotesData}
                columns={vendorDetailsCols}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  quotesData
                    ?.filter((item) => selectedQuoteForView.includes(item.id))
                    ?.map((quo) => {
                      if (quo?.delivery_term === 'CFR') {
                        setIsCFR(true);
                      } else if (quo?.delivery_term === 'FOB') {
                        setIsFOB(true);
                      } else if (quo?.delivery_term === 'EXW') {
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
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
                  <div style={{ flex: '1', fontWeight: 'bold' }}>OPR #:</div>
                  <div style={{ flex: '1' }}>{compareMode.opr_num}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                  <div style={{ flex: '1', fontWeight: 'bold' }}>Company #:</div>
                  <div style={{ flex: '1' }}>{compareMode.company_num}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                  <div style={{ flex: '1', fontWeight: 'bold' }}>Date:</div>
                  <div style={{ flex: '1' }}>{new Date().toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                  <div style={{ flex: '1', fontWeight: 'bold' }}>Convert to :</div>
                  <div style={{ flex: '1' }}>
                    <FormControl variant="standard" size="small">
                      <Select
                        onChange={(e) => setConvert_to_deliveryTerm(e.target.value)}
                        size="small"
                        labelId="convert_to_delivery_term-label"
                        id="convert_to_delivery_term"
                        value={convert_to_delivery_term}
                        label="convert_to_delivery_term"
                        style={{ textTransform: 'uppercase' }}
                      >
                        <MenuItem style={{ textTransform: 'uppercase' }} disabled>
                          <em>Select</em>
                        </MenuItem>
                        {isCFR &&
                          shippingTerms?.map((term) => (
                            <MenuItem key={term} disabled={term !== 'CFR'} value={term} style={{ textTransform: 'uppercase' }}>
                              {term}
                            </MenuItem>
                          ))}
                        {isFOB &&
                          shippingTerms?.map((term) => (
                            <MenuItem key={term} disabled={term !== 'FOB'} value={term} style={{ textTransform: 'uppercase' }}>
                              {term}
                            </MenuItem>
                          ))}
                        {isEXW &&
                          shippingTerms?.map((term) => (
                            <MenuItem key={term} value={term} style={{ textTransform: 'uppercase' }}>
                              {term}
                            </MenuItem>
                          ))}
                        {!isCFR &&
                          !isFOB &&
                          !isEXW &&
                          shippingTerms?.map((term) => (
                            <MenuItem key={term} value={term} style={{ textTransform: 'uppercase' }}>
                              {term}
                            </MenuItem>
                          ))}
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
                {itemsList?.length && (
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
                    rows={itemsList}
                    columns={itemColumnRFQ}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                  />
                )}
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} style={{ overflowX: 'scroll', scrollbarWidth: 'thin', width: 'max-content' }}>
            <div style={{ minWidth: 'auto', display: 'flex' }}>
              {quotesData?.length &&
                quotesData
                  ?.filter((item) => selectedQuoteForView.includes(item.id))
                  ?.map((quotation, index) => (
                    <Paper
                      key={index}
                      style={{ padding: 5, background: index % 2 === 0 ? '#ede7f6' : '#e3f2fd', minWidth: '600px', marginRight: '16px' }}
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
                        <div>
                          Vendor Detail{' '}
                          <span
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
                          </span>
                        </div>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <div>
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
                          </div>

                          {quotation?.procurement_justification && (
                            <div>
                              <span style={{ backgroundColor: 'blue', color: 'white', padding: '5px', borderRadius: '10px' }}>
                                Recommend
                              </span>
                            </div>
                          )}

                          <Tooltip title="Vendor Details">
                            {/* <IconButton aria-label="add_costs" onClick={() => handleOpen(quotation)}> */}
                            <IconButton
                              aria-label="add_costs"
                              onClick={() => {
                                console.log('Quotation:', quotation);
                                create_po(quotation);
                              }}
                            >
                              <DoneAllIcon color="info" />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="BUYER Additional Cost">
                          <IconButton
                            aria-label="add_costs"
                            onClick={() => {
                              setSelectedQuote(quotation?.delivery_term);

                              const mergedCosts = Object.assign({}, ...previous_charges[index].additionalCosts);

                              setFormValuesCharges((val) => ({ ...val, ...mergedCosts }));

                              setOpen2((val) => {
                                return { ...val, condition: true, id: quotation?.quote_id, num: quotation?.quoteNum };
                              });
                            }}
                          >
                            <AddCircleOutlineIcon color="success" />
                          </IconButton>
                        </Tooltip> */}
                        </div>
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Quote No.</div>
                        <div style={{ flex: '1' }}>{quotation?.quoteNum}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}> Vendor Name:</div>
                        <div style={{ flex: '1' }}>{quotation?.vendor_name}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Delivery Term:</div>
                        <div style={{ flex: '1' }}>{quotation?.delivery_term}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Country supply:</div>
                        <div style={{ flex: '1' }}>{quotation.country_supply}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Country origin:</div>
                        <div style={{ flex: '1' }}>{quotation?.country_origin}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Quote Currency:</div>
                        <div style={{ flex: '1' }}>{quotation?.currency}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Port of Loading:</div>
                        <div style={{ flex: '1' }}>{quotation?.port_loading}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}> Lead Time:</div>
                        <div style={{ flex: '1' }}>{quotation?.lead_time}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}> Additional Costs :</div>
                        <div style={{ flex: '1' }}>{formatNumber(quotation?.effective_cost)}{" "}{quotation?.currency}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}> Total Amount :</div>
                        <div style={{ flex: '1' }}>{formatNumber(quotation?.product_amt)} {" "}{quotation?.currency}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>Final Comparable Amt :</div>
                        <div style={{ flex: '1' }}>{formatNumber(Number(quotation?.product_amt + quotation?.effective_cost))}{" "}{quotation?.currency}</div>
                      </div>
                      <div style={{ width: '100%', border: '1px dotted black' }} />

                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}> Procurement Justification :</div>
                        <div style={{ flex: '1' }}>{quotation?.procurement_justification || 'N.A.'}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}> Unit Justification :</div>
                        <div style={{ flex: '1' }}>{quotation?.unit_justification || 'N.A.'}</div>
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
                          rows={quotation?.items}
                          columns={itemColumn}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          disableSelectionOnClick
                          hideFooterPagination
                          hideFooter
                        />
                      </div>
                    </Paper>
                  ))}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Table>
            {renderTableHeader('documents', 'Documents List')}
            {showTableHeading.documents && (
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
                    height: '25px !important'
                  },
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  }
                }}
                columns={[
                  { headerName: 'Sr.No.', field: 'id', width: 40, flex: 0.5 },
                  { headerName: 'Quote ID', field: 'quotation_id', width: 180, flex: 1 },
                  { headerName: 'Document', field: 'document_name', width: 180, flex: 1 },
                  { headerName: 'Document Date', field: 'document_date', width: 180, flex: 1 },
                  { headerName: 'File Name', field: 'file_name', width: 180, flex: 1 },
                  { headerName: 'Notes', field: 'notes', width: 180, flex: 1 }
                ]}
                rows={doc_list}
              />
            )}
          </Table>
        </Grid>
      </>
      <Dialog open={openDia} onClose={handleCloseDia} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Are you sure you want to select this quotation?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ marginBottom: '20px' }}>
            You have chosen the following quotation: <em style={{ color: 'red' }}>{quote.quo_num}</em>, <br />
            for <em style={{ color: 'red' }}>{quote?.opr_num}</em> Please confirm your selection to proceed.
          </DialogContentText>
          <Box fullWidth sx={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            {quote?.procurement_justification ? (
              <>
                <TextField
                  fullWidth
                  id="procurement_justification"
                  label="Procurement Justification"
                  name="procurement_justification"
                  value={quote?.procurement_justification}
                  disabled
                />
                {/* <TextField
                  fullWidth
                  id="opo_description"
                  label="OPO Description"
                  name="opo_description"
                  value={po_create_data?.opo_description}
                  onChange={(e) => setPo_create_data((val) => ({ ...val, [e.target.name]: e.target.value }))}
                /> */}
                <TextField
                  fullWidth
                  id="unit_justification"
                  label="Unit Justification"
                  name="unit_justification"
                  value={po_create_data?.unit_justification}
                  onChange={(e) => setPo_create_data((val) => ({ ...val, [e.target.name]: e.target.value }))}
                />
              </>
            ) : (
              <TextField
                fullWidth
                id="procurement_justification"
                label="Procurement Justification"
                name="procurement_justification"
                value={po_create_data?.procurement_justification}
                onChange={(e) => setPo_create_data((val) => ({ ...val, [e.target.name]: e.target.value }))}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDia} variant="outlined" color="error">
            <span style={{ color: 'red' }}>Cancel</span>
          </Button>
          <Button onClick={create_po} autoFocus variant="contained">
            {quote?.procurement_justification ? 'Generate OPO' : 'Recommend'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open2.condition} onClose={handleClose2}>
        <DialogTitle
          style={{
            backgroundColor: '#a1bcdb',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            fontSize: '15px'
          }}
        >
          Delivery Term Conversion
        </DialogTitle>
        <Divider />
        <TableBody>
          <TableCell colSpan={6} sx={{ fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Convert Delivery Term: &nbsp; &nbsp; <b>{selectedQuote} </b> <ForwardIcon /> <b> {convert_to_delivery_term}</b>
          </TableCell>
          <TableRow sx={{ marginBottom: '10px', marginTop: '20px' }}>
            <TableCell colSpan={6}>
              <Typography variant="h5" color="primary" sx={{ marginTop: '20px' }}>
                Inland Charges
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Load Transportation</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="load_transportation"
                    name="load_transportation"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.load_transportation}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Special Packaging</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="special_packaging"
                    name="special_packaging"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.special_packaging}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Inspection</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="inspection_charges"
                    name="inspection_charges"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.inspection_charges}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Inland Miscellaneous</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="miscellaneous_inland"
                    name="miscellaneous_inland"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.miscellaneous_inland}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {convert_to_delivery_term === 'FOB' ? (
                ''
              ) : (
                <>
                  <Typography variant="h5" color="primary" sx={{ marginTop: '20px' }}>
                    FOB Charges
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">THC</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="thc"
                        name="thc"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValuesCharges.thc}
                        onChange={handleInputChangeCharges}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Container Stuffing</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="container_stuffing"
                        name="container_stuffing"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValuesCharges.container_stuffing}
                        onChange={handleInputChangeCharges}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Container Seal</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="container_seal"
                        name="container_seal"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValuesCharges.container_seal}
                        onChange={handleInputChangeCharges}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">BL</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="bl"
                        name="bl"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValuesCharges.bl}
                        onChange={handleInputChangeCharges}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">VGM</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="vgm"
                        name="vgm"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValuesCharges.vgm}
                        onChange={handleInputChangeCharges}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Miscellaneous</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="miscellaneous"
                        name="miscellaneous"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValuesCharges.miscellaneous}
                        onChange={handleInputChangeCharges}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              <Typography variant="h5" color="primary" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                Freight Charges
              </Typography>
              <Grid container spacing={2} alignItems="center">
                {/* <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">No. of Container</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="no_container"
                    name="no_container"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.no_container}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Type and Size of Container</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="types_container"
                    name="types_container"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.types_container}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
             
                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Rate</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="rate"
                    name="rate"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.rate}
                    onChange={handleInputChangeCharges}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid> */}
                <Table>
                  <TableBody>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={12}>
                        {FreightArray?.map((item, index) => (
                          <Grid key={index + 1} container spacing={1} alignItems="center">
                            <Grid item xs={12} sm={0.3}>
                              <Typography variant="subtitle1">
                                {index + 1}
                                <ValidationStar>*</ValidationStar>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <TextField
                                label="No. of Container"
                                value={item.no_of_container}
                                onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-input': {
                                    padding: '8px'
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Select
                                fullWidth
                                as={SelectFieldPadding}
                                variant="outlined"
                                name="pack_type"
                                value={item.types_of_container || '0'}
                                onChange={(e) => handleInputChangeFreight(e, index, 'types_of_container')}
                              >
                                <MenuItem value="0" selected>
                                  <em>Not Selected</em>
                                </MenuItem>
                                {cont_sizes?.map((data, index) => (
                                  <MenuItem key={index} value={data?.container_type_master_id}>
                                    {data?.container_type_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <TextField
                                fullWidth
                                label="Rate"
                                onChange={(e) => handleInputChangeFreight(e, index, 'rate')}
                                value={item.rate}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-input': {
                                    padding: '8px'
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <TextField
                                fullWidth
                                label="Total Freight"
                                onChange={(e) => handleInputChangeFreight(e, index, 'total_freight')}
                                value={item.total_freight}
                                variant="outlined"
                                disabled
                                sx={{
                                  '& .MuiOutlinedInput-input': {
                                    padding: '8px'
                                  },
                                  '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: '#000000'
                                  }
                                }}
                              />
                            </Grid>
                            {index === FreightArray.length - 1 && (
                              <Grid item xs={12} sm={0.5}>
                                <IconButton aria-label="delete" size="large" onClick={addFreightEntry}>
                                  <AddIcon color="success" />
                                </IconButton>
                              </Grid>
                            )}
                            {index === FreightArray.length - 1 && index !== 0 && (
                              <Grid item xs={12} sm={0.5}>
                                <IconButton aria-label="delete" size="large" onClick={() => removeFreightEntry(index)}>
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1">Total Freight Charges</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="total_freight_charges"
                    name="total_freight_charges"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formValuesCharges.total_freight_charges}
                    onChange={handleInputChangeCharges}
                    disabled
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
        <DialogActions>
          <Button onClick={handleClose2} color="error" variant="outlined">
            Close
          </Button>
          <Button
            onClick={() => {
              submit_add_charges(
                open2.num,
                open2.id,
                convert_to_delivery_term,
                FreightArray,
                Object.entries(formValuesCharges)?.map(([key, value]) => ({ name: key, cost: value }))
              );
            }}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Quote_Compare;
