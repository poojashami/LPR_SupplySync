import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
  TableBody,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip
} from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import SelectFieldPadding from 'components/selectFieldPadding';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomParagraphLight from 'components/CustomParagraphLight';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomHeading from 'components/CustomHeading';
const faqItemDatalist = [
  {
    id: 1,
    shipment_type: 'Air',
    item_type: 'Electronics',
    item_code: 'ELEC001',
    item_name: 'Smartphone',
    item_name_vendor: 'VendorPhone',
    item_name_label: 'LabelPhone',
    cria_req: 'true',
    nafdac_req: 'true',
    uom: 'PCS',
    quantity: 100,
    quote_qtd: 90,
    rate: 500,
    total_cost: 45000,
    pack_type: 'Box',
    pack_size: 10,
    no_packs: 9,
    opr_remark: 'Handle with care',
    remarks: 'Urgent shipment'
  },
  {
    id: 2,
    shipment_type: 'Sea',
    item_type: 'Apparel',
    item_code: 'APP002',
    item_name: 'T-Shirt',
    item_name_vendor: 'VendorTShirt',
    item_name_label: 'LabelTShirt',
    cria_req: 'false',
    nafdac_req: 'false',
    uom: 'PCS',
    quantity: 200,
    quote_qtd: 180,
    rate: 20,
    total_cost: 3600,
    pack_type: 'Bundle',
    pack_size: 20,
    no_packs: 9,
    opr_remark: 'Fold neatly',
    remarks: 'Pack in eco-friendly material'
  },
  {
    id: 3,
    shipment_type: 'Land',
    item_type: 'Furniture',
    item_code: 'FURN003',
    item_name: 'Chair',
    item_name_vendor: 'VendorChair',
    item_name_label: 'LabelChair',
    cria_req: 'true',
    nafdac_req: 'false',
    uom: 'PCS',
    quantity: 50,
    quote_qtd: 45,
    rate: 100,
    total_cost: 4500,
    pack_type: 'Crate',
    pack_size: 5,
    no_packs: 9,
    opr_remark: 'Fragile item',
    remarks: 'Double-check for damage'
  },
  {
    id: 4,
    shipment_type: 'Air',
    item_type: 'Pharmaceuticals',
    item_code: 'PHAR004',
    item_name: 'Vaccine',
    item_name_vendor: 'VendorVaccine',
    item_name_label: 'LabelVaccine',
    cria_req: 'true',
    nafdac_req: 'true',
    uom: 'Vials',
    quantity: 1000,
    quote_qtd: 950,
    rate: 15,
    total_cost: 14250,
    pack_type: 'Box',
    pack_size: 50,
    no_packs: 19,
    opr_remark: 'Store in cold chain',
    remarks: 'Priority shipment'
  },
  {
    id: 5,
    shipment_type: 'Sea',
    item_type: 'Chemicals',
    item_code: 'CHEM005',
    item_name: 'Sodium Chloride',
    item_name_vendor: 'VendorSodium',
    item_name_label: 'LabelSodium',
    cria_req: 'false',
    nafdac_req: 'false',
    uom: 'Kg',
    quantity: 500,
    quote_qtd: 450,
    rate: 10,
    total_cost: 4500,
    pack_type: 'Bag',
    pack_size: 50,
    no_packs: 9,
    opr_remark: 'Ensure dry storage',
    remarks: 'Standard packaging'
  }
];
const QuoteForm = () => {
  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });
  const [showTableHeading, setShowTableHeading] = useState({
    createrfqForm: true,
    basicInfo: true,
    requireDoc: true,
    paymentTerms: true,
    freightCharges: true,
    additionalCharges: true,
    itemDetail: true,
    quoteAmount: true
  });
  const [faqItemData, setFaqItemData] = useState(faqItemDatalist);
  const [ReqDocs, setReqDocs] = useState([]);
  const { cont_sizes } = useSelector((state) => state.static);
  const [FreightArray, setFreightArray] = useState([{ no_of_container: '', types_of_container: '', rate: '', total_freight: '' }]);
  const { quoPackagingType } = useSelector((state) => state.quotation);
  const { deliveryTerms } = useSelector((state) => state.deliveryTerms);
  const milestonesOptions = ['Milestone 1', 'Milestone 2', 'Milestone 3'];
  const triggers = ['Trigger 1', 'Trigger 2', 'Trigger 3'];
  const [is_cria_required, setIs_cria_required] = useState(false);

  // Hardcoded initial data
  const [data, setData] = useState([{ milestone: 'Milestone 1', percentage_value: 50, initiated_point: 'Trigger 1' }]);

  const handleRemove = (index) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    // Add a new default row to the data
    setData((prevData) => [...prevData, { milestone: '', percentage_value: '', initiated_point: '' }]);
  };
  const handleInputChangeFreight = (e, index, field) => {
    const { value } = e.target;
    if (field === 'rate') {
      if (/^\d*\.?\d*$/.test(value)) {
        setFreightArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
        setFreightArray((prevArray) =>
          prevArray.map((item, i) => (i === index ? { ...item, total_freight: item.no_of_container * item.rate } : item))
        );
      }
    } else {
      setFreightArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    }
  };
  const addFreightEntry = () => {
    setFreightArray((prevArray) => [...prevArray, { no_of_container: '', types_of_container: '', rate: '', total_freight: '' }]);
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

  const [amounts, setAmounts] = useState([0]); // Start with one default TextField
  const handleIncrement = () => {
    setAmounts([...amounts, 0]); // Add a new 0 value to the array to render a new TextField
  };
  const handleDecrement = (index) => {
    const newAmounts = [...amounts];
    newAmounts.splice(index, 1); // Remove the TextField at the given index
    setAmounts(newAmounts);
  };
  const handleChange = (index, event) => {
    const newAmounts = [...amounts];
    newAmounts[index] = event.target.value; // Update the value of the specific TextField
    setAmounts(newAmounts);
  };

  const [fileArray, setFileArray] = useState([]);
  const [listDoc, setlistDoc] = useState([
    { name: 'Quotation.', remark: '', file: null, selected: false },
    { name: 'Proforma Invoice', remark: '', file: null, selected: false },
    { name: 'TDS', remark: '', file: null, selected: false },
    { name: 'MSDS', remark: '', file: null, selected: false },
    { name: 'Brochure', remark: '', file: null, selected: false },
    { name: 'Drowing', remark: '', file: null, selected: false },
    { name: 'Other', remark: '', file: null, selected: false }
  ]);
  const handleCheckboxChange = (index) => {
    const updatedFileArray = [...listDoc];
    updatedFileArray[index].selected = !updatedFileArray[index].selected;
    setlistDoc(updatedFileArray);
  };
  useEffect(() => {
    setFileArray(listDoc.filter((item) => item.selected));
  }, [listDoc]);
  const handleFileChangeFile = (e, index) => {
    const file = e.target.files[0];
    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, file: file } : item)));
  };
  const addFileEntry = () => {
    setFileArray((prevArray) => [...prevArray, { file: null, name: '', remark: '' }]);
  };
  const removeFileEntry = (index) => {
    setFileArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };
  const handleSubmit = () => {};
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
  const TableHeader = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'item_cat', headerName: 'Item Category', width: 120 },
    { field: 'group', headerName: 'Group', width: 100 },
    { field: 'subgroup', headerName: 'Sub Group', width: 120 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 120 },
    {
      field: 'item_name_vendor',
      headerName: 'Vendor Item Name',
      width: 250,
      editable: true,
      renderHeader: (params) => (
        <div>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleCopyButtonClick(params?.colDef?.field)}
            style={{ cursor: 'pointer' }}
          >
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
          <span>{params.colDef.headerName}</span>
        </div>
      )
    },

    // { field: 'address', headerName: 'Shipping address', width: 200 },
    { field: 'uom', headerName: 'UOM', width: 70 },
    { field: 'quantity', headerName: 'LPR Qty', width: 75 },
    {
      field: 'quote_qtd',
      headerName: `Quote Qty`,
      width: 150,
      editable: true,
      sortable: false,
      renderHeader: (params) => (
        <div>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleCopyButtonClick(params?.colDef?.field)}
            style={{ cursor: 'pointer' }}
          >
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
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
          {params.row.name === 'total' ? (
            <span style={{ fontWeight: 'bold' }}>{params.value}</span>
          ) : (
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
          )}
        </div>
      )
    },
    {
      field: 'pack_type',
      headerName: 'Pack Type',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: quoPackagingType.map((data) => data.package_type),
      valueGetter: (value, row) => {
        if (row.name !== 'total') {
          if (value === '') {
            return `select`;
          }
          return value;
        } else {
          return '';
        }
      }
    },
    {
      field: 'pack_uom',
      headerName: 'Pack UOM',
      width: 100,
      editable: true
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
              (Number(faqItemData[params.row.id - 1]?.pack_size) &&
                Number(faqItemData[params.row.id - 1]?.quote_qtd) / Number(faqItemData[params.row.id - 1]?.pack_size)) ||
              ''
            }
          />
        </div>
      )
    },
    {
      field: 'opr_remark',
      headerName: 'LPR Item Remarks',
      width: 200
    },
    {
      field: 'remarks',
      headerName: 'Vendor Item Remarks',
      width: 200,
      editable: true
    },
    {
      field: 'vatRate',
      headerName: 'VAT Rate',
      width: 200,
      editable: true
    },
    {
      field: 'itemVatTotal',
      headerName: 'Item VAT Total',
      width: 200,
      editable: true
    },
    {
      field: 'roundOfVat',
      headerName: 'Round off VAT',
      width: 200,
      editable: true
    },
    {
      field: 'itemAmount',
      headerName: 'Item Amount Incl. VAT',
      width: 200,
      editable: true
    }
  ];
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

  const shipmentData = [
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  return (
    <>
      <Table>{renderTableHeader('createrfqForm', 'Buying House Info')}</Table>
      {showTableHeading.createrfqForm && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {shipmentData.map((item, index) => (
              <Grid item xs={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                    {item.label}:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

      <form onSubmit={handleSubmit}>
        <Table>{renderTableHeader('basicInfo', 'Basic Info')}</Table>
        {showTableHeading.basicInfo && (
          <Box padding={1}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                    RFQ N0.:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                    djhdjkk
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                    RFQ Dt.:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                    djhdjkk
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
                    Respond Time(Days):
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
                    djhdjkk
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Shipment Mode<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="lprNo"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid> */}

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  RFQ Delivery Term<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="vertical"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Vendor Name<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="company"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Vendor Address<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="division"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid> */}

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Vendor Quote No<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="lprCategory"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Tooltip title="Vendor Quote Date" placement="right" arrow>
                  <CustomParagraphLight>
                    Vendor Quote Dt.<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="shipmentMode"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Quote Currency<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="buyingThrough"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Vendor Delivery Terms<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="leftForRFQ"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Tooltip title="Buyer Lead Time" placement="right" arrow>
                  <CustomParagraphLight>
                    RFQ Lead Time<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="deliveryTime"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>
                  Vendor Lead Time<ValidationStar>*</ValidationStar>
                </CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="requestedByDept"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Tooltip title="Lead Initiation Point" placement="right" arrow>
                  <CustomParagraphLight>
                    Lead Initiation Point<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="requestedBy"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* <Grid item xs={12} sm={2}>
                <Tooltip title="Country of Origin" placement="right" arrow>
                  <CustomParagraphLight>
                    Country of Origin<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={2}>
                <Tooltip title="Country of Supply" placement="right" arrow>
                  <CustomParagraphLight>
                    Country of Supply<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="additionalRemarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={2}>
                <Tooltip title="Port of Loading" placement="right" arrow>
                  <CustomParagraphLight>
                    Port of Loading<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="additionalRemarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={2}>
                <Tooltip title="Port of Delivery" placement="right" arrow>
                  <CustomParagraphLight>
                    Port of Delivery<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="additionalRemarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid> */}

              <Grid item xs={12} sm={2}>
                <Tooltip title="Quote Valid Till" placement="right" arrow>
                  <CustomParagraphLight>
                    Quote Valid Upto<ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Tooltip>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="additionalRemarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>Quote Remark</CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="additionalRemarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>Delivery Address</CustomParagraphLight>
                <TextField
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  name="additionalRemarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Table sx={{ marginTop: '10px' }}>{renderTableHeader('paymentTerms', 'Payment Term')}</Table>
        {showTableHeading.paymentTerms && (
          <Box padding={1}>
            <Grid item xs={12} sm={5}>
              <CustomParagraphLight>
                Payment Terms<span style={{ color: 'red' }}>*</span>{' '}
              </CustomParagraphLight>
              <TextField
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '4px',
                    fontSize: '11px'
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000'
                  }
                }}
                id="payment_terms"
                name="payment_terms"
                value={data
                  .filter((item) => item.milestone && item.percentage_value && item.initiated_point)
                  .map((item) => `${item.milestone} ${item.percentage_value}% - ${item.initiated_point}`)
                  .join(', ')}
                disabled
              />
            </Grid>

            <Grid container sx={{ marginTop: '10px' }}>
              <Grid item xs={12} sm={3}>
                <CustomParagraphLight>MileStone</CustomParagraphLight>
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>Percentage</CustomParagraphLight>
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomParagraphLight>Initiation Point</CustomParagraphLight>
              </Grid>
            </Grid>

            {data.map((item, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={2}>
                  <Select
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                    variant="outlined"
                    name="milestone"
                    value={item.milestone || ''}
                    onChange={(e) =>
                      setData((prevData) => prevData.map((row, i) => (i === index ? { ...row, milestone: e.target.value } : row)))
                    }
                  >
                    {milestonesOptions.map((data, index) => (
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
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                    id="percentage_value"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                    value={item.percentage_value}
                    name="percentage_value"
                    onChange={(e) =>
                      setData((prevData) => prevData.map((row, i) => (i === index ? { ...row, percentage_value: e.target.value } : row)))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Select
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                    variant="outlined"
                    name="initiated_point"
                    value={item.initiated_point || ''}
                    onChange={(e) =>
                      setData((prevData) => prevData.map((row, i) => (i === index ? { ...row, initiated_point: e.target.value } : row)))
                    }
                  >
                    {triggers.map((data, index) => (
                      <MenuItem key={index} value={data}>
                        {data}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={0.3}>
                  <IconButton aria-label="add" size="small" onClick={handleAdd}>
                    <AddIcon color="success" />
                  </IconButton>
                </Grid>

                <Grid item xs={12} sm={0.3}>
                  <IconButton aria-label="delete" size="small" onClick={() => handleRemove(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
        <Table>{renderTableHeader('freightCharges', 'Delivery/Transportation Charges')}</Table>
        {showTableHeading.freightCharges && (
          <Box padding={1}>
            {FreightArray?.map((item, index) => (
              <Grid container spacing={1}>
                <Grid item xs={12} sm={0.3} marginTop={'16px'}>
                  <CustomParagraphLight>{index + 1}</CustomParagraphLight>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>
                    No of Truck/vehicle
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <CustomParagraphLight>Type of Truck</CustomParagraphLight>
                  <Select
                    fullWidth
                    as={SelectFieldPadding}
                    variant="outlined"
                    name="pack_type"
                    value={item.types_of_container || '0'}
                    onChange={(e) => handleInputChangeFreight(e, index, 'types_of_container')}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  >
                    <MenuItem value="0" selected>
                      <em>Not Selected</em>
                    </MenuItem>
                    <MenuItem value="30 ton">30 ton</MenuItem>
                    <MenuItem value="45 ton">45 ton</MenuItem>
                    <MenuItem value="15 ton">15 ton</MenuItem>
                    <MenuItem value="10 ton">10 ton</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>
                    Transpotation Rate
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>
                    Transpotation Amt.
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <CustomParagraphLight>
                    VAT
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>
                    Transport Amt. incl. VAT
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                {index === FreightArray.length - 1 && (
                  <Grid item xs={12} sm={0.3} display={'flex'} alignItems={'end'}>
                    <IconButton aria-label="add" size="small" onClick={addFreightEntry}>
                      <AddIcon color="success" />
                    </IconButton>
                  </Grid>
                )}
                {index === FreightArray.length - 1 && index !== 0 && (
                  <Grid item xs={12} sm={0.3} display={'flex'} alignItems={'end'}>
                    <IconButton aria-label="delete" size="small" onClick={() => removeFreightEntry(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
          </Box>
        )}
        <Table>{renderTableHeader('additionalCharges', 'Additional Charges')}</Table>
        {showTableHeading.additionalCharges && (
          <Box padding={1}>
            {FreightArray?.map((item, index) => (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={0.3}>
                  <CustomParagraphLight>{index + 1}</CustomParagraphLight>
                </Grid>
                <Grid item xs={12} sm={1.2}>
                  <CustomParagraphLight>
                    Head of Expense
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    value={item.head_of_expense}
                    onChange={(e) => handleInputChangeFreight(e, index, 'head_of_expense')}
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={0.7}>
                  <CustomParagraphLight>
                    Amount
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <CustomParagraphLight>
                    VAT
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>
                    Amt. incl. VAT
                    <ValidationStar>*</ValidationStar>
                  </CustomParagraphLight>
                  <TextField
                    value={item.no_of_container}
                    onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000'
                      }
                    }}
                  />
                </Grid>
                {index === FreightArray.length - 1 && (
                  <Grid item xs={12} sm={0.3}>
                    <IconButton aria-label="add" size="small" onClick={addFreightEntry}>
                      <AddIcon color="success" />
                    </IconButton>
                  </Grid>
                )}
                {index === FreightArray.length - 1 && index !== 0 && (
                  <Grid item xs={12} sm={0.3}>
                    <IconButton aria-label="delete" size="small" onClick={() => removeFreightEntry(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}
          </Box>
        )}
        <Table>
          {renderTableHeader('requireDoc', 'Required Document List at the time of Shipment')}
          {showTableHeading.requireDoc && (
            <Box padding={1}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={0.3}></Grid>
                <Grid item xs={12} sm={2}>
                  {' '}
                  <CustomParagraphDark>Documents Required</CustomParagraphDark>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomParagraphDark>Will Be Provided</CustomParagraphDark>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomParagraphDark>Remarks</CustomParagraphDark>
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={0.3}>
                  <Grid item xs={12} sm={2}></Grid>
                  <CustomParagraphLight>1</CustomParagraphLight>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>Commercial Invoice</CustomParagraphLight>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <RadioGroup
                    row
                    value={'Yes'}
                    onChange={(e) => handleInputChangeDoc(e, index, 'available')}
                    sx={{ fontSize: '10px !important' }}
                    style={{ fontSize: '10px !important' }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio color="primary" />}
                      label={<Typography style={{ fontSize: '11px' }}>Yes</Typography>} // Font size for label
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio color="primary" />}
                      label={<Typography style={{ fontSize: '11px' }}>No</Typography>} // Font size for label
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    onChange={(e) => handleInputChangeFileData(e, index, 'remark')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        padding: '5px'
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={0.3}>
                  <Grid item xs={12} sm={2}></Grid>
                  <CustomParagraphLight>1</CustomParagraphLight>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>Packing List</CustomParagraphLight>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <RadioGroup
                    row
                    value={'Yes'}
                    onChange={(e) => handleInputChangeDoc(e, index, 'available')}
                    sx={{ fontSize: '10px !important' }}
                    style={{ fontSize: '10px !important' }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio color="primary" />}
                      label={<Typography style={{ fontSize: '11px' }}>Yes</Typography>} // Font size for label
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio color="primary" />}
                      label={<Typography style={{ fontSize: '11px' }}>No</Typography>} // Font size for label
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    onChange={(e) => handleInputChangeFileData(e, index, 'remark')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        padding: '5px'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={0.3}>
                  <Grid item xs={12} sm={2}></Grid>
                  <CustomParagraphLight>2</CustomParagraphLight>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomParagraphLight>Certificate of Analysis</CustomParagraphLight>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <RadioGroup
                    row
                    value={'Yes'}
                    onChange={(e) => handleInputChangeDoc(e, index, 'available')}
                    sx={{ fontSize: '11px' }} // Ensures the font size is 11px for the entire group
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio color="primary" />}
                      label={<Typography style={{ fontSize: '11px' }}>Yes</Typography>} // Font size for label
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio color="primary" />}
                      label={<Typography style={{ fontSize: '11px' }}>No</Typography>} // Font size for label
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    onChange={(e) => handleInputChangeFileData(e, index, 'remark')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        padding: '5px'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Table>
        <Table>
          {renderTableHeader('requireDoc', 'Upload Documents')}
          {showTableHeading.requireDoc && (
            <Box padding={1}>
              <CustomHeading>Select Files</CustomHeading>
              <Grid container spacing={1} display={'flex'} alignItems={'center'} marginBottom={1}>
                <Grid item xs={12} alignItems={'center'}>
                  <form>
                    <Grid container spacing={1}>
                      {listDoc.map((file, index) => (
                        <Grid item xs={2} key={index}>
                          <CustomParagraphLight>
                            <input
                              type="checkbox"
                              checked={file?.selected}
                              onChange={() => handleCheckboxChange(index)}
                              style={{ marginRight: '5px' }}
                            />
                            {file.name}
                          </CustomParagraphLight>
                        </Grid>
                      ))}
                    </Grid>
                  </form>
                </Grid>
              </Grid>

              {fileArray?.map((item, index) => (
                <Grid
                  key={index + 1}
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ border: '1px dotted gray', borderRadius: '12px', margin: '2px', padding: '8px' }}
                >
                  <Grid item xs={12} sm={0.2}>
                    <CustomParagraphLight>{index + 1}</CustomParagraphLight>
                  </Grid>
                  <Grid item xs={12} sm={2} paddingTop={'0 !important'}>
                    <CustomParagraphLight>Document Name</CustomParagraphLight>
                    <TextField
                      placeholder="Document Name"
                      value={item.name}
                      disabled={index <= 6}
                      onChange={(e) => handleInputChangeFile(e, index, 'name')}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          padding: '4px',
                          fontSize: '12px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} paddingTop={'0 !important'}>
                    <CustomParagraphLight>Remarks</CustomParagraphLight>
                    <TextField
                      fullWidth
                      onChange={(e) => handleInputChangeFile(e, index, 'remark')}
                      onBlur={(e) => {
                        e.target.value === '' && toast.error('Remarks are required');
                      }}
                      value={item.remark}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          padding: '4px',
                          fontSize: '12px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1.5} display={'flex'} alignItems={'end'}>
                    <Button
                      component="label"
                      size="small"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        backgroundColor: '#2c6095',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#244b78'
                        }
                      }}
                    >
                      Upload File
                      <VisuallyHiddenInput type="file" onChange={(e) => handleFileChangeFile(e, index)} />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    {item.file && <span style={{ color: 'navy', fontSize: '10px' }}>{item.file.name}</span>}
                  </Grid>
                  {/* {index === fileArray.length - 1 && ( */}
                  <Grid item xs={12} sm={0.3}>
                    <IconButton aria-label="add" size="small" onClick={addFileEntry}>
                      <AddIcon color="success" />
                    </IconButton>
                  </Grid>
                  {/* )} */}
                  {/* {index === fileArray.length - 1 && index !== 0 && index > 6 && ( */}
                  <Grid item xs={12} sm={0.3}>
                    <IconButton aria-label="delete" size="small" onClick={() => removeFileEntry(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                  {/* )} */}
                </Grid>
              ))}
            </Box>
          )}
        </Table>
        <Table>{renderTableHeader('quoteAmount', 'Quotation Amount Breakup')}</Table>
        {showTableHeading.quoteAmount && (
          <Box padding={1}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <CustomParagraphDark>
                  Item Cost:
                  <br />
                  <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
                </CustomParagraphDark>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphLight>1000</CustomParagraphLight>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphDark>
                  Addition Ch:
                  <br />
                  <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
                </CustomParagraphDark>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphLight>1000</CustomParagraphLight>
              </Grid>
              <Grid item xs={1.3}>
                <CustomParagraphDark>
                  Transportation Ch:
                  <br />
                  <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
                </CustomParagraphDark>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphLight>1000</CustomParagraphLight>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphDark>Total VAT:</CustomParagraphDark>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphLight>1000</CustomParagraphLight>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphDark>
                  Quotation Amt.:
                  <br />
                  <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
                </CustomParagraphDark>
              </Grid>
              <Grid item xs={1}>
                <CustomParagraphLight>1000</CustomParagraphLight>
              </Grid>
            </Grid>
          </Box>
        )}
        <Table>{renderTableHeader('itemDetail', 'Item Details')}</Table>
        {showTableHeading.itemDetail && (
          <Box padding={1}>
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
              // rows={faqItemData.map((row) => ({
              //   ...row,
              //   handleInputChange: (e, field) => handleRFQInputChange(e, field, row.id)
              // }))}
              rows={faqItemData}
              columns={TableHeader}
              // processRowUpdate={processRowUpdate}
              rowsPerPageOptions={[5]}
              hideFooterPagination
              // isCellEditable={(params) => params.row.name !== 'total'}
              disableColumnSorting
              rowHeight={35}
              // slots={{ toolbar: GridToolbar }}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            sx={{
              mr: 2,
              backgroundColor: '#cd640d',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#cd640d'
              }
            }}
            onClick={() => resetForm()}
          >
            Cancel
          </Button>
          <Button
            size="small"
            type="submit"
            sx={{
              backgroundColor: '#2c6095',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#244b78'
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default QuoteForm;
