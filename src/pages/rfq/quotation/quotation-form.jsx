import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  Autocomplete,
  InputAdornment,
  FormControlLabel,
  RadioGroup,
  Radio,
  Modal
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import formattedDateTime from 'utils/time';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { Country, City } from 'country-state-city';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { QuotationSubmit } from 'Redux/Apis/PostApiCalls';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { GetDeliveryTerms, GetPaymentTerms, GetPortDestination, GetLeadTime, GetVendors, GetPackagingType } from 'Redux/Apis/GetApiCalls';
import { axiosInstance } from 'utils/axiosInstance';
import SelectFieldPadding from 'components/selectFieldPadding';
import ValidationStar from 'components/ValidationStar';
import ConfirmForm from 'components/BasicDataComponent/ConfrmForm';
// import { GetContainerSizes } from 'Redux/Apis/GetApiCalls';

export default function QuotationForm({ onClose, formMode, rfq }) {
  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });
  const { vendor_id } = useSelector((state) => state?.static);
  console.log('vendor_id', vendor_id);
  const [showTableHeading, setShowTableHeading] = useState({
    rfq_Details: true,
    userPersonalDetail: true,
    currentAddressDetails: true,
    permanentAddressDetails: true,
    ChargesDetails: true,
    paymentTerm: true,
    BreakupAmountDetails: true,
    FreightPersonalDetail: true,
    userLoginDetails: true
  });
  const [formValues, setFormValues] = useState(null);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [quote_valid_till, setQuote_valid_till] = useState(null);
  // const [cities, setCities] = useState([]);
  const [itemCost, setItemCost] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [faqItemData, setFaqItemData] = useState([]);
  const { cont_sizes } = useSelector((state) => state.static);
  const { PortDestination } = useSelector((state) => state.rfq);
  const { vendors } = useSelector((state) => state.vendorMaster);
  const [bh_Data, setBhData] = useState(null);
  // const label = { inputProps: { 'aria-label': 'Status Switch' } };
  const { quoPackagingType } = useSelector((state) => state.quotation);
  const { deliveryTerms } = useSelector((state) => state.deliveryTerms);
  // const { paymentTerms } = useSelector((state) => state.paymentTerms);

  const doc_options = ['Quotation', 'Proforma Invoice', 'TDS', 'MSDS', 'Brochure', 'Drawing', 'Other'];

  const [fileArray, setFileArray] = useState([
    { name: 'Quotation', remark: '', file: null },
    { name: 'Proforma Invoice', remark: '', file: null },
    { name: 'TDS', remark: '', file: null },
    { name: 'MSDS', remark: '', file: null },
    { name: 'Brochure', remark: '', file: null },
    { name: 'Drawing', remark: '', file: null },
    { name: 'Other', remark: '', file: null }
  ]);

  const [FreightArray, setFreightArray] = useState([{ no_of_container: '', types_of_container: '', rate: '', total_freight: '' }]);
  const [ReqDocs, setReqDocs] = useState([]);
  const [status, setStatus] = useState(0);
  const [is_cria_required, setIs_cria_required] = useState(false);
  const [data, setData] = useState([{ milestone: '', percentage_value: 0, initiated_point: '' }]);
  const [vendor, setVendor] = useState({});

  const [initialFormValues] = useState({
    vendor_id: vendors?.filter((vendor) => vendor?.vendor_id === vendor_id)[0]?.vendor_id || '',
    reference_no: rfq.rfq_num,
    reference_date: rfq.created_on,
    quo_date: formattedDateTime,
    currency: '',
    delivery_terms: '',
    lead_time: '',
    lead_initiation_point: '',
    payment_terms: '',
    remarks: ''
  });

  // useEffect(() => {
  //   getVendorDetails(vendor_id);
  // }, [vendor_id, ]);

  useEffect(() => {
    setFormValues(initialFormValues);
    getVendorDetails(vendor_id);
  }, [vendors]);

  const triggers = [
    'On PFI',
    'On PO acceptance',
    'With LC',
    'On Form M',
    'On Shipment readiness',
    'With Scan-doc',
    'Before OBL',
    'After 30 Days of BL date',
    'On Credit'
  ];

  const milestones_options = [
    '1st Advance',
    '2nd Advance',
    '3rd Advance',
    'Confirm LC',
    'Unconfirm LC',
    'On Credit',
    'Full & Final',
    'On Installation'
  ];

  const triggers1 = ['On PFI', 'On PO acceptance', 'On Form M', 'With LC', 'With Advance Payment'];

  const [CountryPort, setCountryPort] = useState([]);

  const fetch_buying_house = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/bhouse/buyinghouses?buying_house_id=${id}`);
      setBhData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (rfq?.buying_house_id) {
      fetch_buying_house(rfq?.buying_house_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfq?.buying_house_id]);

  useEffect(() => {
    let uniqueArr = PortDestination.filter(
      (country_name, index, self) => index === self.findIndex((t) => t.country_name === country_name.country_name)
    );
    setCountryPort(uniqueArr);
  }, [PortDestination]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [name]: value };
      return newData;
    });
  };

  useEffect(() => {
    setTotalCost(
      faqItemData?.reduce((total, num) => {
        let sum = total + Number(num?.rate) * Number(num?.quote_qtd);
        return sum;
      }, 0)
    );
  }, [faqItemData]);

  const handleInputChangeFile = (e, index, field) => {
    const { value } = e.target;
    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };
  const handleInputChangeFreight = (e, index, field) => {
    console.log('faqItemData', faqItemData);
    const { value } = e.target;
    setFreightArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    if (field === 'rate') {
      setFreightArray((prevArray) =>
        prevArray.map((item, i) => (i === index ? { ...item, total_freight: item.no_of_container * item.rate } : item))
      );
    }
  };
  const handleInputChangeFileData = (e, index, field) => {
    const { value } = e.target;
    setReqDocs((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };
  const handleInputChangeDoc = (e, index, field) => {
    const { value } = e.target;
    const isAvailable = value === 'yes';
    setReqDocs((prevArray) =>
      prevArray.map((item, i) =>
        i === index || item.name === 'CRIA - Applicable if goods Coming from India or China' ? { ...item, [field]: true } : item
      )
    );
    setReqDocs((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: isAvailable } : item)));
  };
  const handleFileChangeFile = (e, index) => {
    const file = e.target.files[0];

    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, file: file } : item)));
  };
  const addFileEntry = () => {
    setFileArray((prevArray) => [...prevArray, { file: null, name: '', remark: '' }]);
  };
  const addFreightEntry = () => {
    setFreightArray((prevArray) => [...prevArray, { no_of_container: '', types_of_container: '', rate: '', total_freight: '' }]);
  };
  const validateForm = () => {
    const newErrors = {};

    // Validate Vendor Name
    if (!formValues.vendor_id) {
      newErrors.vendor_id = 'Vendor Name is required';
    }

    // Validate Reference No
    if (!formValues.reference_no) {
      newErrors.reference_no = 'Reference No is required';
    }

    // Validate Reference Date
    if (!formValues.reference_date) {
      newErrors.reference_date = 'Reference Date is required';
    }

    // Validate Quotation Date
    if (!formValues.quo_date) {
      newErrors.quo_date = 'Quotation Date is required';
    }

    // Validate Currency
    if (!formValues.currency) {
      newErrors.currency = 'Currency is required';
    }

    // Validate Delivery Terms
    if (!formValues.delivery_terms) {
      newErrors.delivery_terms = 'Delivery Terms are required';
    }

    // Validate Lead Time
    if (!formValues.lead_time) {
      newErrors.lead_time = 'Lead Time is required';
    }

    // Validate Country of Origin
    if (!formValues.country_origin) {
      newErrors.country_origin = 'Country of Origin is required';
    }

    // Validate Country of Supply
    if (!formValues.country_supply) {
      newErrors.country_supply = 'Country of Supply is required';
    }

    // Validate Port of Loading
    if (!formValues.port_loading) {
      newErrors.port_loading = 'Port of Loading is required';
    }

    // Validate File
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    getCountry();
    GetLeadTime(dispatch);
    GetPaymentTerms(dispatch);
    GetDeliveryTerms(dispatch);
    GetVendors(dispatch);
    GetPackagingType(dispatch);
    GetPortDestination(dispatch);
    // GetContainerSizes(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [countries, setCountries] = useState([]);

  function getCountry() {
    let countries = Country.getAllCountries();

    const uniqueByName = countries.reduce((accumulator, current) => {
      const nameExists = accumulator.some((item) => item.currency === current.currency);
      if (!nameExists) {
        accumulator.push({
          currency: current.currency,
          name: current.name,
          isoCode: current.isoCode
        });
      }
      return accumulator;
    }, []);
    setCountries(uniqueByName);
  }
  // function getCities(id) {
  //   let citiesInCountry = City.getCitiesOfCountry(id);
  //   const filteredCities = citiesInCountry.filter(
  //     (currentItem, index, array) => index === array.findIndex((item) => item.name === currentItem.name)
  //   );
  //   setCities(filteredCities);
  // }
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const handleOriginChange = (event, value) => {
    if (value?.name?.toUpperCase()?.trim() === 'INDIA' || value?.name?.toUpperCase()?.trim() === 'CHINA') {
      setIs_cria_required(true);
    } else {
      setIs_cria_required(false);
    }
    setFormValues({
      ...formValues,
      country_origin: value.name
    });
  };
  const handleSupplyChange = (event, value) => {
    setFormValues({
      ...formValues,
      country_supply: value.country_name
    });
    let shipment_type = rfq?.shipment_mode;
    let Ports = PortDestination.filter((i) => i.country_name == value.country_name);
    // setFilterPorts(Ports?.filter((i) => i?.port_destination_name?.includes(shipment_type)));
    setFilterPorts(Ports);
  };
  const [filterPorts, setFilterPorts] = useState([]);
  const handlePortChange = (event, value) => {
    setFormValues({
      ...formValues,
      port_loading: value.port_destination_name
    });
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      {/* <OCREngine file={fileArray[0].file} searchWord={'IMP102252882P'} /> */}
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    if (validateForm()) setIsDialogOpen(true);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);

  // const handleInputTextField = (e, id) => {
  //   console.log('faqItemData', faqItemData);
  //   const { name, value } = e.target;
  //   const updatedItemCost = {
  //     ...itemCost,
  //     [id]: {
  //       ...itemCost[id],
  //       [name]: value
  //     }
  //   };
  //   setItemCost(updatedItemCost);
  // };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setFaqItemData(faqItemData.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const TableHeader = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 120 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 120 },
    {
      field: 'item_name_vendor',
      headerName: 'Vendor Item Name',
      width: 250,
      editable: true,
      renderHeader: (params) => (
        <div>
          <Button onClick={() => handleCopyButtonClick(params?.colDef?.field)} style={{ cursor: 'pointer' }}>
            Copy
          </Button>
          <span>{params.colDef.headerName}</span>
        </div>
      )
    },
    {
      field: 'item_name_label',
      headerName: 'Item Label Name',
      width: 250,
      editable: true,
      renderHeader: (params) => (
        <div>
          <Button onClick={() => handleCopyButtonClick(params?.colDef?.field)} style={{ cursor: 'pointer' }}>
            Copy
          </Button>
          <span>{params.colDef.headerName}</span>
        </div>
      )
    },
    {
      field: 'cria',
      headerName: 'CRIA Req #',
      width: 80,
      renderCell: () => {
        return <span>{is_cria_required ? 'Yes' : 'No'}</span>;
      }
    },
    // { field: 'address', headerName: 'Shipping address', width: 200 },
    { field: 'uom', headerName: 'U.O.M.', width: 70 },
    { field: 'quantity', headerName: 'OPR Qty', width: 75 },
    {
      field: 'quote_qtd',
      headerName: `Quote Qty`,
      width: 150,
      editable: true,
      renderHeader: (params) => (
        <div>
          <Button onClick={() => handleCopyButtonClick(params?.colDef?.field)} style={{ cursor: 'pointer' }}>
            Copy
          </Button>
          <span>{params.colDef.headerName}</span>
        </div>
      )
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 100,
      editable: true
    },
    {
      field: 'total_cost',
      headerName: 'Amount',
      width: 100,
      renderCell: (params) => (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '6px'
              },
              '& .Mui-disabled': {
                '-webkit-text-fill-color': '#4f4f4f'
              }
            }}
            type="text"
            name="total"
            disabled
            value={Number(faqItemData[params.row.id - 1].rate) * Number(faqItemData[params.row.id - 1].quote_qtd) || '0'}
          />
        </div>
      )
    },
    {
      field: 'pack_type',
      headerName: 'Pack Type',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: quoPackagingType.map((data) => data.package_type)
    },
    {
      field: 'pack_size',
      headerName: 'Pack Size',
      width: 100,
      editable: true
    },
    {
      field: 'no_packs',
      headerName: 'No. of Packs',
      width: 100,
      renderCell: (params) => (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '6px'
              },
              '& .Mui-disabled': {
                '-webkit-text-fill-color': '#4f4f4f'
              }
            }}
            type="text"
            name="no_packs"
            disabled
            value={
              (Number(faqItemData[params.row.id - 1].pack_size) &&
                Number(faqItemData[params.row.id - 1].quote_qtd) / Number(faqItemData[params.row.id - 1].pack_size)) ||
              ''
            }
          />
        </div>
      )
    },
    {
      field: 'opr_remark',
      headerName: 'OPR Remarks',
      width: 200
    },
    {
      field: 'remarks',
      headerName: 'Vendor Remarks',
      width: 200,
      editable: true
    }
  ];

  const handleRFQInputChange = (e, field, id) => {
    const newValue = e.target.value;
    setFaqItemData(faqItemData.map((row) => (row.id === id ? { ...row, [field]: newValue } : row)));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (name === 'vendor_id') {
      getVendorDetails(value);
    }
    if (!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  const dateValue = formattedDateTime.split(' ')[0];
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('formValues', formValues);
    faqItemData.map((_, index) => {
      if (itemCost[index + 1] === undefined || itemCost[index + 1].remarks === undefined) {
        console.log(itemCost[index + 1]);
      }
    });

    // fileArray.map((item) => {
    //   if (item.remark === '') {
    //     console.log(item);
    //     setRemarksItems(true);
    //   }
    // });

    const mapFrontendToBackendKeys = (frontendData) => {
      const mappedData = faqItemData?.map((item, index) => ({
        id: index + 1,
        rfq_item_id: item.rfq_item_id,
        item_type: item.item_type,
        item_code: item.item_code,
        item_id: item.itemId,
        item_name: item.item_name,
        opr_qty: item.quantity,
        item_name_vendor: item.item_name_vendor,
        item_name_label: item.item_name_label,
        quote_qtd: item.quote_qtd,
        rate: item.rate,
        uom: item.uom,
        remarks: item.remarks,
        line_total: Number(item.rate) * Number(item.quote_qtd),
        pack_type: quoPackagingType?.find((type) => item.pack_type === type?.package_type)?.package_id,
        pack_size: item.pack_size,
        no_packs: Number(item.quote_qtd) / Number(item.pack_size)
      }));

      const fileMap = fileArray
        ?.filter((item) => item.file)
        ?.map((item) => ({
          q_doc_name: item.name,
          q_doc_remarks: item.remark,
          q_doc: item.file
        }));
      return {
        quotation_details: {
          rfq_id: rfq?.rfq_id,
          ...frontendData,
          opr_lead_time: rfq?.delivery_timeline_in_weeks,
          port_of_loading: rfq.port_of_destination_name,
          charges: {
            ...formValuesCharges
          },
          total_cost: totalCost,
          ReuireDocData: ReqDocs,
          ItemData: mappedData
        },
        quotation_docslist: fileMap
      };
    };
    if (validateForm()) {
      try {
        const requestData = mapFrontendToBackendKeys({
          ...formValues,
          FreightArray: FreightArray,
          payment_terms: `${data?.map((item) => `${item?.milestone} ${item?.percentage_value}% - ${item?.initiated_point}`).join('')}`,
          payment_milestone: data
        });
        console.log('requestData', requestData);
        await QuotationSubmit(dispatch, requestData);
        toast.success('Quotation Created Successfully');
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  // const calculateTotalCost = (itemCost) => {
  //   let totalCost = {};
  //   let sum = 0;
  //   for (let key in itemCost) {
  //     const qty = itemCost[key].qty;
  //     const rate = itemCost[key].rate;
  //     totalCost[key] = qty * rate;
  //     const cost = qty * rate;
  //     sum += cost;
  //   }
  //   setTotalCost(sum);
  //   // setSum((preVal) => preVal + totalCost);
  //   return totalCost;
  // };

  // const calculateTotalpacks = (itemCost) => {
  //   let totalCost = {};
  //   for (let key in itemCost) {
  //     const qty = itemCost[key].qty;
  //     const pack_size = itemCost[key].pack_size;
  //     totalCost[key] = qty / pack_size;
  //   }
  //   // setSum((preVal) => preVal + totalCost);
  //   return totalCost;
  // };
  const [CopyItemData, setCopyItemData] = useState([]);
  const fetchItems = async () => {
    const { data } = await axiosInstance.get(`/api/rfqitem/itemsbyrfqid?rfqid=${rfq?.rfq_id}`);
    const mappedData = data?.map((item, index) => ({
      id: index + 1,
      rfq_item_id: item.rfq_item_id,
      itemId: item.item_id,
      rfq_id: item.rfq_id,
      item_type: item?.ItemsMaster?.item_super_group_master?.item_super_group_name,
      item_code: item.ItemsMaster?.item_code,
      item_name: item.ItemsMaster?.item_name,
      uom: item?.uom_name,
      address: `${item.AddressMaster.city}, ${item.AddressMaster.country}`,
      quantity: item.quantity,
      item_name_vendor: '',
      item_name_label: '',
      qty: '',
      quote_qtd: '',
      rate: '',
      remarks: '',
      opr_remark: item?.opr_item_remark,
      total: '',
      pack_type: '',
      pack_size: '',
      no_packs: ''
    }));
    setCopyItemData(mappedData);
    setFaqItemData(mappedData);
  };

  const handleCopyButtonClick = (columnName) => {
    console.log('columnName', columnName);
    if (columnName === 'quote_qtd') {
      setFaqItemData(
        faqItemData.map((item) => {
          return {
            ...item,
            quote_qtd: item?.quantity
          };
        })
      );
    } else if (columnName === 'item_name_vendor') {
      setFaqItemData(
        faqItemData.map((item) => {
          return {
            ...item,
            item_name_vendor: item?.item_name
          };
        })
      );
    } else if (columnName === 'item_name_label') {
      setFaqItemData(
        faqItemData.map((item) => {
          return {
            ...item,
            item_name_label: item?.item_name
          };
        })
      );
    } else {
      ('');
    }
  };

  const removeFileEntry = (index) => {
    setFileArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };
  const removeFreightEntry = (index) => {
    setFreightArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const fetchRequireDoc = async () => {
    const { data } = await axiosInstance.get(`/api/reqdoc/list/byids?rfq_id=${rfq?.rfq_id}`);
    const mappedData = data?.map((item) => ({ available: undefined, name: item.rfq_req_doc_master_name, remark: '' }));
    setStatus(mappedData.length);
    setReqDocs(mappedData);
  };

  useEffect(() => {
    fetchItems();
    fetchRequireDoc();
  }, []);

  const [formValuesCharges, setFormValuesCharges] = useState({});
  const [formValuesTotal, setFormValuesTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    for (let charges in formValuesCharges) {
      total = total + Number(formValuesCharges[charges]);
    }
    setFormValuesTotal(total);
    console.log('charges', total);
  }, [formValuesCharges]);

  useEffect(() => {
    const charges = FreightArray.reduce((accumulator, currentValue) => {
      return accumulator + currentValue?.total_freight;
    }, 0);

    setFormValuesCharges((val) => ({ ...val, total_freight_charges: charges }));
  }, [FreightArray]);

  const handleInputChangeCharges = (e) => {
    const { name, value } = e.target;
    setFormValuesCharges({ ...formValuesCharges, [name]: value });

    if (!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const sortedCountries = countries.sort((a, b) => {
    return a.currency.localeCompare(b.currency);
  });

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

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const getVendorDetails = async (id) => {
    const { data } = await axiosInstance.get(`/api/vendor/vendor/${id}`);
    const mappedData = {
      vendorName: data?.vendor_name,
      email: data?.email,
      phoneNumber: data?.phone_number,
      alternate_phone_number: data?.alternate_phone_number,
      vendorType: data?.vendor_type_id,
      vendorStatus: data?.vendor_status ? 'Active' : 'Inactive',
      registrationDate: data?.registration_date,
      taxId: data?.tax_id,
      contactPerson: data?.contact_person,
      contactPersonPhone: data?.contact_person_phone,
      contactPersonEmail: data?.contact_person_email,
      paymentTerms: data?.payment_terms_id,
      reference_by: data?.reference_by,
      addressLine1: data?.AddressDetailsMasters[0]?.addressLine1,
      addressLine2: data?.AddressDetailsMasters[0]?.addressLine2,
      pincode: data?.AddressDetailsMasters[0]?.pincode,
      country: data?.AddressDetailsMasters[0]?.country,
      state: data?.AddressDetailsMasters[0]?.state,
      city: data?.AddressDetailsMasters[0]?.city,
      addressLine11: data?.addressLine11,
      addressLine22: data?.addressLine22,
      pincode1: data?.pincode1,
      country1: data?.country1,
      state1: data?.state1,
      city1: data?.city1,
      complianceStatus: data?.compliance_status,
      last_audited_docs: data?.last_audited_docs_name,
      division: data?.division,
      tin_num: data?.tin_num,
      gst_num: data?.gst_num,
      vat_num: data?.vat_num,
      bankName: data?.bankName,
      bankAccountNumber: data?.bankAccountNumber,
      bankIfscCode: data?.bankIfscCode,
      bank1_ref_cheque: data?.bank1_ref_cheque,
      buyinHouse: data?.buyinHouse,
      bankName1: data?.bankName1,
      bankAccountNumber1: data?.bankAccountNumber1,
      bankIfscCode1: data?.bankIfscCode1,
      bank2_ref_cheque: data?.bank2_ref_cheque,
      notes: data?.notes,
      currency: data?.currency
    };
    console.log('mappedData', mappedData);
    setFormValues({ ...formValues, currency: data?.currency });
    setVendor(mappedData);
  };

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
                  <Typography>{vendor?.vendorName}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Email:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Phone Number:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.phoneNumber}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Alternate Phone Number:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.alternate_phone_number}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vendor Type:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.vendorType}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vendor Status:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.vendorStatus}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Registration Date:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.registrationDate}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Tax ID:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.taxId}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Reference By:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.reference_by}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Contact Person:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.contactPerson}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Contact Person Phone:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.contactPersonPhone}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Contact Person Email:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor?.contactPersonEmail}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Address:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {vendor?.city}, {vendor?.state}, {vendor?.country}
                  </Typography>
                </TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Modal>
      <Table>{renderTableHeader('rfq_Details', 'Buying House Info')}</Table>
      {showTableHeading.rfq_Details && (
        <Table>
          <TableRow>
            <TableCell>Consignee Name :</TableCell>
            <TableCell>{bh_Data?.buying_house_name}</TableCell>

            <TableCell>Consignee Code :</TableCell>
            <TableCell>{bh_Data?.buying_house_code}</TableCell>

            <TableCell>Contact Number :</TableCell>
            <TableCell>{bh_Data?.contact_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contact email :</TableCell>
            <TableCell>{bh_Data?.contact_email}</TableCell>

            <TableCell>Address :</TableCell>
            <TableCell
              colSpan={4}
            >{`${bh_Data?.address_line1}, ${bh_Data?.address_line2} ,${bh_Data?.city},${bh_Data?.state},${bh_Data?.country},${bh_Data?.postal_code}`}</TableCell>
          </TableRow>
        </Table>
      )}

      {formValues && (
        <form onSubmit={handleSubmit}>
          <Table>
            {renderTableHeader('userLoginDetails', 'Basic Info')}
            {showTableHeading.userLoginDetails && (
              <TableBody loading={true}>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Shipment Mode</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          value={rfq?.shipment_mode}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Shipment Type</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          value={rfq?.shipment_type}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Vendor Name<ValidationStar>*</ValidationStar>
                          {formValues?.vendor_id !== '' && (
                            <InfoIcon
                              onClick={() => {
                                setOpen(true);
                                getVendorDetails(formValues?.vendor_id);
                              }}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <FormControl variant="outlined" fullWidth>
                          <Select
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              },
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: '#000000'
                              }
                            }}
                            id="vendor_id"
                            name="vendor_id"
                            disabled
                            value={formValues?.vendor_id}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="">
                              <em>select</em>
                            </MenuItem>
                            {vendors.map((data) => (
                              <MenuItem key={data?.vendor_id} value={data?.vendor_id}>
                                {data.vendor_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {!!errors.vendor_id && <FormHelperText error>{errors.vendor_id}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Vendor Address</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          value={formValues?.vendor_id !== '' ? `${vendor?.city}, ${vendor?.state}, ${vendor?.country}` : ''}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Reference No<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="reference_no"
                          name="reference_no"
                          value={formValues.reference_no}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          disabled
                        />
                        {!!errors.reference_no && <FormHelperText error>{errors.reference_no}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Reference Date<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          type="date"
                          id="reference_date"
                          name="reference_date"
                          variant="outlined"
                          fullWidth
                          value={formValues.reference_date}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          disabled
                        />
                        {!!errors.reference_date && <FormHelperText error>{errors.reference_date}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Quotation Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          type="date"
                          id="quo_date"
                          name="quo_date"
                          variant="outlined"
                          fullWidth
                          value={dateValue}
                          onChange={handleInputChange}
                          // InputLabelProps={{
                          //   shrink: true
                          // }}
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
                        {!!errors.quo_date && <FormHelperText error>{errors.quo_date}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Currency<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <FormControl variant="outlined" fullWidth>
                          <Select
                            as={SelectFieldPadding}
                            id="currency"
                            name="currency"
                            value={formValues.currency}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="">
                              <em>select</em>
                            </MenuItem>
                            {sortedCountries.map((data) => (
                              <MenuItem key={data.currency} value={data.currency}>
                                {data.currency}
                              </MenuItem>
                            ))}
                          </Select>
                          {!!errors.currency && <FormHelperText error>{errors.currency}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Delivery Terms<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          as={SelectFieldPadding}
                          id="delivery_terms"
                          name="delivery_terms"
                          variant="outlined"
                          fullWidth
                          value={formValues.delivery_terms}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {deliveryTerms.map((data) => (
                            <MenuItem key={data.delivery_terms_id} value={data.delivery_terms_id}>
                              {data.delivery_terms_name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.delivery_terms && <FormHelperText error>{errors.delivery_terms}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Buyer Lead Time</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          disabled
                          value={rfq.delivery_timeline_in_weeks}
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
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Lead Time<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        {/* <Select
                        as={SelectFieldPadding}
                        fullWidth
                        variant="outlined"
                        id="lead_time"
                        name="lead_time"
                        value={formValues.lead_time}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>select</em>
                        </MenuItem>
                        {leadTime.map((data) => (
                          <MenuItem key={data.lead_time_id} value={data.lead_time_id}>
                            {data.lead_time_name}
                          </MenuItem>
                        ))}
                      </Select> */}
                        <TextField
                          fullWidth
                          id="lead_time"
                          name="lead_time"
                          value={formValues.lead_time}
                          onChange={handleInputChange}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
                          }}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                        {!!errors.lead_time && <FormHelperText error>{errors.lead_time}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Lead Initiation Point</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        {/* <TextField
                        fullWidth
                        id="lead_initiation_point"
                        name="lead_initiation_point"
                        value={formValues.lead_initiation_point}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '6px'
                          }
                        }}
                      /> */}

                        <Select
                          fullWidth
                          as={SelectFieldPadding}
                          variant="outlined"
                          name="lead_initiation_point"
                          value={formValues.lead_initiation_point || ''}
                          onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                        >
                          {triggers1.map((data, index) => (
                            <MenuItem key={index} value={data}>
                              {data}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.lead_time && <FormHelperText error>{errors.lead_time}</FormHelperText>}
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Country of Origin<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          sx={{
                            '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root': {
                              padding: '0px !important',
                              bgcolor: 'red'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          fullWidth
                          id="country_origin"
                          name="country_origin"
                          value={formValues.country_origin}
                          onChange={(event, value) => handleOriginChange(event, value)}
                          options={countries}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params, index) => (
                            <TextField
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '6px'
                                }
                              }}
                              key={index}
                              {...params}
                              variant="outlined"
                            />
                          )}
                        />
                        {!!errors.country_origin && <FormHelperText error>{errors.country_origin}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Country of Supply<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                          fullWidth
                          id="country_supply"
                          name="country_supply"
                          value={formValues.country_supply}
                          onChange={(event, value) => handleSupplyChange(event, value)}
                          options={CountryPort}
                          getOptionLabel={(option) => option.country_name}
                          renderInput={(params) => <TextField {...params} variant="outlined" />}
                        />
                        {!!errors.country_supply && <FormHelperText error>{errors.country_supply}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">
                          Port of Loading<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                          fullWidth
                          id="port_loading"
                          name="port_loading"
                          value={formValues.port_loading}
                          onChange={(event, value) => handlePortChange(event, value)}
                          options={filterPorts}
                          getOptionLabel={(option) => option.port_destination_name}
                          renderInput={(params) => <TextField {...params} variant="outlined" />}
                        />
                        {!!errors.port_loading && <FormHelperText error>{errors.port_loading}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Port of Delivery</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          disabled
                          value={rfq.port_of_destination_name}
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

                      {/* Date will be Select this is not mandotory */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Quote Valid Till ##</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          type="date"
                          id="quote_valid_till"
                          name="quote_valid_till"
                          variant="outlined"
                          value={quote_valid_till}
                          onChange={handleInputChange}
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

                      {/* <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        type='number'
                        id="remarks"
                        name="remarks"
                        placeholder='From RFQ Issue Date'
                        value={rfqRemarks}
                        onChange={(e) => setRfqRemarks(e.target.value)}
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

                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Remarks</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          id="remarks"
                          name="remarks"
                          variant="outlined"
                          type="text"
                          value={formValues.remarks}
                          onChange={handleInputChange}
                        />
                        {!!errors.remarks && <FormHelperText error>{errors.remarks}</FormHelperText>}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>
            {renderTableHeader('paymentTerm', 'Payment Term')}
            {showTableHeading.paymentTerm && (
              <Box sx={{ padding: '15px 25px' }}>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1">
                    Payment Terms<ValidationStar>*</ValidationStar>{' '}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '6px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                    id="payment_terms"
                    name="payment_terms"
                    value={data?.map((item) => `${item?.milestone} ${item?.percentage_value}% - ${item?.initiated_point}, `)}
                    disabled
                  />
                  {!!errors.payment_terms && <FormHelperText error>{errors.payment_terms}</FormHelperText>}
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography>MileStone</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>Percentage</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>Initiation Point </Typography>
                  </Grid>
                </Grid>
                {data?.map((item, index) => (
                  <Grid container spacing={2} key={index} sx={{ marginTop: '2px' }}>
                    <Grid item xs={12} sm={4}>
                      {/* <TextField
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        }
                      }}
                      value={item?.milestone}
                      name="milestone"
                      id="milestone"
                      onChange={(e) => handleChange(index, e)}
                    /> */}
                      <Select
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          }
                        }}
                        variant="outlined"
                        name="milestone"
                        value={item?.milestone || ''}
                        onChange={(e) => handleChange(index, e)}
                      >
                        {milestones_options.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          }
                        }}
                        id="percentage_value"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        value={item?.percentage_value}
                        name="percentage_value"
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      {/* <TextField
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        }
                      }}
                      id="initiated_point"
                      value={item?.initiated_point}
                      name="initiated_point"
                      onChange={(e) => handleChange(index, e)}
                    /> */}

                      <Select
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          }
                        }}
                        variant="outlined"
                        name="initiated_point"
                        value={item.initiated_point || ''}
                        onChange={(e) => handleChange(index, e)}
                      >
                        {triggers.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    {!(data?.length - 1 > index) && (
                      <Grid item xs={12} sm={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="success"
                          onClick={() => setData((prevVal) => [...prevVal, { milestone: '', percentage_value: 0, initiated_point: '' }])}
                          disabled={data.reduce((sum, item) => Number(sum) + Number(item.percentage_value), Number(0)) >= 100}
                        >
                          Add
                        </Button>
                      </Grid>
                    )}

                    {!(data?.length - 1 <= index) && (
                      <Grid item xs={12} sm={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          id={`btn-${index}`}
                          disabled={data?.length - 1 <= index}
                          onClick={() => setData((prevVal) => prevVal.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Box>
            )}
          </Table>

          <Table>
            {renderTableHeader('logistics', 'Freight Charges')}
            {showTableHeading.FreightPersonalDetail && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    {FreightArray?.map((item, index) => (
                      <Grid key={index + 1} container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={0.3}>
                          <Typography variant="subtitle1">
                            {index + 1}
                            <ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
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
                        <Grid item xs={12} sm={2}>
                          {/* <TextField
                          fullWidth
                          label="Type of Container"
                          onChange={(e) => handleInputChangeFreight(e, index, 'types_of_container')}
                          value={item.types_of_container}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        /> */}
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
                            {cont_sizes.map((data, index) => (
                              <MenuItem key={index} value={data?.container_type_master_id}>
                                {data?.container_type_name}
                              </MenuItem>
                            ))}
                          </Select>
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
            )}
          </Table>

          <Table>
            {renderTableHeader('ChargesDetails', 'Additional Charges')}
            {showTableHeading.ChargesDetails && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '20px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Typography variant="h5" color="primary" sx={{ marginTop: '20px' }}>
                        Inland Charges
                      </Typography>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
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
                      <Grid item xs={12} sm={1}>
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
                      <Grid item xs={12} sm={1}>
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
                        {!!errors.inspection_charges && <FormHelperText error>{errors.inspection_charges}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
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

                    {formValues.delivery_terms === 2 ? (
                      ''
                    ) : (
                      <>
                        <Typography variant="h5" color="primary" sx={{ marginTop: '20px' }}>
                          FOB Charges
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={1}>
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
                            {!!errors.thc && <FormHelperText error>{errors.thc}</FormHelperText>}
                          </Grid>
                          <Grid item xs={12} sm={1}>
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
                            {!!errors.container_stuffing && <FormHelperText error>{errors.container_stuffing}</FormHelperText>}
                          </Grid>
                          <Grid item xs={12} sm={1}>
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
                            {!!errors.container_seal && <FormHelperText error>{errors.container_seal}</FormHelperText>}
                          </Grid>
                          <Grid item xs={12} sm={1}>
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
                            {!!errors.bl && <FormHelperText error>{errors.bl}</FormHelperText>}
                          </Grid>
                          <Grid item xs={12} sm={1}>
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
                            {!!errors.vgm && <FormHelperText error>{errors.vgm}</FormHelperText>}
                          </Grid>
                          <Grid item xs={12} sm={1}>
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
                            {!!errors.miscellaneous && <FormHelperText error>{errors.miscellaneous}</FormHelperText>}
                          </Grid>
                        </Grid>
                      </>
                    )}

                    <Typography variant="h5" color="primary" sx={{ marginTop: '20px' }}>
                      Freight Charges
                    </Typography>
                    {FreightArray?.map((item, index) => (
                      <Grid key={index + 1} container spacing={1} alignItems="center" sx={{ padding: '20px' }}>
                        <Grid item xs={12} sm={0.5}>
                          <Typography variant="subtitle1">
                            {index + 1}
                            <ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            label="No. of Container"
                            value={item.no_of_container}
                            disabled
                            onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              },
                              '& .Mui-disabled': {
                                WebkitTextFillColor: '#000000'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          {/* <TextField
                          fullWidth
                          label="Type of Container"
                          onChange={(e) => handleInputChangeFreight(e, index, 'types_of_container')}
                          value={item.types_of_container}
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
                        /> */}
                          <Select
                            fullWidth
                            as={SelectFieldPadding}
                            variant="outlined"
                            name="pack_type"
                            value={item.types_of_container || '0'}
                            // onChange={(e) => handleInputChangeFreight(e, index, 'types_of_container')}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              },
                              '& .Mui-disabled': {
                                WebkitTextFillColor: '#000000'
                              }
                            }}
                            disabled
                          >
                            <MenuItem value="0" selected>
                              <em>Not Selected</em>
                            </MenuItem>
                            {cont_sizes.map((data, index) => (
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
                            label="Freight Amount"
                            // onChange={(e) => handleInputChangeFreight(e, index, 'total_freight')}
                            value={item.total_freight}
                            variant="outlined"
                            disabled
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              },
                              '& .Mui-disabled': {
                                WebkitTextFillColor: '#000000'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={0.5}></Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Total Freight Amount</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          id="total_freight_charges"
                          name="total_freight_charges"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={formValuesCharges?.total_freight_charges}
                          // onChange={handleInputChangeCharges}
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
                        {!!errors.total_freight_charges && <FormHelperText error>{errors.total_freight_charges}</FormHelperText>}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>
            {renderTableHeader('paymentTerm', 'Required Document List')}
            {showTableHeading.paymentTerm && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={1} alignItems="center" sx={{ margin: '2px', padding: '8px' }}>
                      <Grid item xs={12} sm={0.3}>
                        {/* <Typography variant="body1" color="initial">
                        Sl.No.
                      </Typography> */}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1" color="initial">
                          Documents Required
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1" color="initial">
                          Will Be Provided
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body1" color="initial">
                            Remarks
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {ReqDocs?.map((item, index) => (
                      <Grid key={index + 1} container spacing={1} alignItems="center" sx={{ margin: '2px', padding: '8px' }}>
                        <Grid item xs={12} sm={0.2}>
                          <Typography variant="subtitle1">{index + 1}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            disabled
                            label="Document Name"
                            value={item.name}
                            onChange={(e) => handleInputChangeFileData(e, index, 'name')}
                            variant="outlined"
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
                        <Grid item xs={12} sm={2}>
                          <RadioGroup
                            row
                            value={
                              item.name === 'CRIA - Applicable if goods Coming from India or China' && is_cria_required
                                ? 'yes'
                                : item.available === undefined
                                  ? ''
                                  : item.available
                                    ? 'yes'
                                    : 'no'
                            }
                            onChange={(e) => handleInputChangeDoc(e, index, 'available')}
                          >
                            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            required={item.available === undefined ? '' : item.available === 'yes' ? false : true}
                            label="Remark"
                            onChange={(e) => handleInputChangeFileData(e, index, 'remark')}
                            onBlur={(e) => {
                              item.available === undefined
                                ? ''
                                : item.available === 'yes'
                                  ? false
                                  : e.target.value === '' && toast.error('Remarks are required');
                              // e.target.value === '' && toast.error('Remarks are required');
                            }}
                            value={item.remark}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>
            {renderTableHeader('logistics', 'Upload Documents')}
            {showTableHeading.userPersonalDetail && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    {fileArray?.map((item, index) => (
                      <Grid
                        key={index + 1}
                        container
                        spacing={1}
                        alignItems="center"
                        sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
                      >
                        <Grid item xs={12} sm={0.2}>
                          <Typography variant="subtitle1">{index + 1}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            label="Document Name #"
                            value={item.name}
                            disabled={index <= 6}
                            onChange={(e) => handleInputChangeFile(e, index, 'name')}
                            variant="outlined"
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
                        {index === fileArray.length - 1 && index !== 0 && index > 6 && (
                          <Grid item xs={12} sm={0.5}>
                            <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>{renderTableHeader('BreakupAmountDetails', 'Quotation Amount Breakup')}</Table>
          <Table>
            {showTableHeading.BreakupAmountDetails && (
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: '500' }}>FOB Cost</TableCell>
                  <TableCell>{totalCost}</TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>Inland Charges:</TableCell>
                  <TableCell>{formValuesTotal - Number(formValuesCharges?.total_freight_charges)}</TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>Freight Cost:</TableCell>
                  <TableCell>{formValuesCharges?.total_freight_charges}</TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>Quotation Amount:</TableCell>
                  <TableCell>{totalCost + formValuesTotal}</TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
            <Table>
              {renderTableHeader('permanentAddressDetails', 'Item Details')}
              {showTableHeading.permanentAddressDetails && (
                <>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        border: '1px solid rgba(224, 224, 224, 1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0'
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
                    rows={faqItemData.map((row) => ({
                      ...row,
                      handleInputChange: (e, field) => handleRFQInputChange(e, field, row.id)
                    }))}
                    columns={TableHeader}
                    processRowUpdate={processRowUpdate}
                    rowsPerPageOptions={[5]}
                    hideFooterPagination
                    rowHeight={35}
                    slots={{ toolbar: GridToolbar }}
                  />
                </>
              )}
            </Table>
          </TableContainer>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Box textAlign="right" marginRight="20px" marginBottom="20px">
              <Typography>
                <b>Total Cost: {totalCost}</b>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {/* <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
            {formMode === 'create' ? 'Submit' : 'Update'}
          </Button> */}
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              {formMode === 'create' ? 'Submit' : 'Update'}
            </Button>
            <ConfirmForm isOpen={isDialogOpen} onClose={handleCloseDialog} onConfirm={handleSubmit} />
            {/* <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button> */}
          </Box>
        </form>
      )}
    </>
  );
}
