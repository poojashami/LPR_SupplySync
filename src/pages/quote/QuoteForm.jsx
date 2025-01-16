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
  Radio
} from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import RFQView from './QuoteView';
import ItemList from './ItemList';
import VendorList from './VendorList';
import DocumentDetail from './DocumentDetail';
import MainCard from 'components/MainCard';
import SelectFieldPadding from 'components/selectFieldPadding';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
    itemListRfq: true,
    vendorlist: true,
    requireDoc: true,
    paymentTerms: true,
    freightCharges: true,
    additionalCharges: true,
    requireDoc: true,
    itemDetail: true
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
    { name: 'C.I.', remark: '', file: null, selected: false },
    { name: 'Packing List', remark: '', file: null, selected: false },
    { name: 'Way Bill', remark: '', file: null, selected: false },
    { name: 'Cert of Analysis', remark: '', file: null, selected: false },
    { name: 'Others', remark: '', file: null, selected: false }
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
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={500}>
              {sectionLabel}
            </Typography>
            <IconButton size="small" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const TableHeader = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'shipment_type', headerName: 'Shipment Type', width: 120 },
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
      field: 'item_name_label',
      headerName: 'Item Label Name',
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
    {
      field: 'cria',
      headerName: 'CRIA Req #',
      width: 80,
      renderCell: (params) => {
        return (
          <span>
            {params.row.name === 'total'
              ? ''
              : params.row?.nafdac_req === 'true'
                ? params.row?.cria_req === 'true'
                  ? is_cria_required
                    ? 'Yes'
                    : 'No'
                  : 'N'
                : 'N'}
          </span>
        );
      }
    },
    // { field: 'address', headerName: 'Shipping address', width: 200 },
    { field: 'uom', headerName: 'UOM', width: 70 },
    { field: 'quantity', headerName: 'OPR Qty', width: 75 },
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
    { label: 'RFQ Num', value: 'Tech Corp' },
    { label: 'Port of Destination', value: 'LPR1234' },
    { label: 'Respond Time(Days)', value: '+1 123-456-7890' },
    { label: 'Delivery_time', value: 'example@techcorp.com' },
    { label: 'Created On', value: '123 Tech Street, North Division, Electronics City' },
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  return (
    <MainCard>
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
        <Table>{renderTableHeader('createrfqForm', 'Create Quote')}</Table>
        {showTableHeading.createrfqForm && (
          <Grid container spacing={2} mt={'1px'}>
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Shipment Mode<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            </Grid>
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Shipment Type <ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Vendor Name<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Vendor Address<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            </Grid>

            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Vendor Quote No<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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

            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Vendor Quote Date<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Currency<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Delivery Terms<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Buyer Lead Time<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Lead Time<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Lead Initiation Point<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Country of Origin<ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            </Grid>

            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Country of Supply
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Port of Loading
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Port of Delivery
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Quote Valid Till
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
            <Grid item xs={12} sm={1} paddingTop={'20px !important'}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Remarks
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} paddingTop={'20px'}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '5px'
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
        )}
        <Table>{renderTableHeader('paymentTerms', 'Payment Terms')}</Table>
        {showTableHeading.paymentTerms && (
          <Box mb={1}>
            <Grid item xs={12} sm={1}>
              <Typography variant="body" style={{ fontSize: '11px' }}>
                Payment Terms<span style={{ color: 'red' }}>*</span>{' '}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '5px',
                    fontSize: '12px'
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

            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  MileStone
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  Percentage
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  Initiation Point
                </Typography>
              </Grid>
            </Grid>

            {data.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={3}>
                  <Select
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '5px',
                        fontSize: '12px'
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
                        padding: '5px',
                        fontSize: '12px'
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
                        padding: '5px',
                        fontSize: '12px'
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
                <Grid item xs={12} sm={1}>
                  <Box>
                    <Button variant="contained" size="small" color="primary" onClick={handleAdd}>
                      Add
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button fullWidth variant="outlined" size="small" color="error" onClick={() => handleRemove(index)}>
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
        <Table>{renderTableHeader('freightCharges', 'Delivery/Transportation')}</Table>
        {showTableHeading.freightCharges && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                {FreightArray?.map((item, index) => (
                  <Grid key={index + 1} container spacing={1}>
                    <Grid item xs={12} sm={0.5}>
                      <Typography variant="subtitle1" align="center" marginTop={'20px'}>
                        {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        No of Truck/vehicle
                        <ValidationStar>*</ValidationStar>
                      </Typography>
                      <TextField
                        value={item.no_of_container}
                        onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '5px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body" style={{ fontSize: '11px' }} align="center"></Typography>
                      <Select
                        fullWidth
                        as={SelectFieldPadding}
                        variant="outlined"
                        name="pack_type"
                        value={item.types_of_container || '0'}
                        onChange={(e) => handleInputChangeFreight(e, index, 'types_of_container')}
                        sx={{
                          marginTop: '23px',
                          '& .MuiSelect-select': {
                            padding: '5px'
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
                    {index === FreightArray.length - 1 && (
                      <Grid item xs={12} sm={0.5} marginTop={'20px'}>
                        <IconButton aria-label="add" size="small" onClick={addFreightEntry}>
                          <AddIcon color="success" />
                        </IconButton>
                      </Grid>
                    )}
                    {index === FreightArray.length - 1 && index !== 0 && (
                      <Grid item xs={12} sm={0.5} marginTop={'20px'}>
                        <IconButton aria-label="delete" size="small" onClick={() => removeFreightEntry(index)}>
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
        <Table>{renderTableHeader('additionalCharges', 'Additional Charges')}</Table>
        {showTableHeading.additionalCharges && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={12}>
                {FreightArray?.map((item, index) => (
                  <Grid key={index + 1} container display={'flex'} alignItems={'center'} spacing={2}>
                    <Grid item xs={12} sm={0.5}>
                      <Typography variant="subtitle1" align="center">
                        {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2.1}>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        Head of Expense
                        <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        value={item.head_of_expense}
                        onChange={(e) => handleInputChangeFreight(e, index, 'head_of_expense')}
                        variant="outlined"
                        sx={{
                          padding: '5px',
                          '& .MuiOutlinedInput-input': {
                            padding: '5px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        Amount
                        <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        value={item.no_of_container}
                        onChange={(e) => handleInputChangeFreight(e, index, 'no_of_container')}
                        variant="outlined"
                        sx={{
                          padding: '5px',
                          '& .MuiOutlinedInput-input': {
                            padding: '5px'
                          }
                        }}
                      />
                    </Grid>

                    {index === FreightArray.length - 1 && (
                      <Grid item xs={12} sm={1}>
                        <IconButton aria-label="add" size="small" onClick={addFreightEntry}>
                          <AddIcon color="success" />
                        </IconButton>
                      </Grid>
                    )}
                    {index === FreightArray.length - 1 && index !== 0 && (
                      <Grid item xs={12} sm={1}>
                        <IconButton aria-label="delete" size="small" onClick={() => removeFreightEntry(index)}>
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
        <Table>
          {renderTableHeader('requireDoc', 'Required Document List')}
          {showTableHeading.requireDoc && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={0.3}></Grid>
                    <Grid item xs={12} sm={2}>
                      {' '}
                      <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                        Documents Required
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                        Will Be Provided
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                        Remarks
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={0.3}>
                      <Grid item xs={12} sm={2}></Grid>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        1
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        Packing List
                      </Typography>
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

                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={0.3}>
                      <Grid item xs={12} sm={2}></Grid>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        2
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        Certificate of Origin
                      </Typography>
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
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('requireDoc', 'Upload Documents')}
          {showTableHeading.requireDoc && (
            <TableBody>
              <Typography variant="h5" sx={{ color: '#0060ff', marginTop: '5px', marginBottom: '10px' }}>
                Select Files
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <form>
                    <Grid container spacing={2}>
                      {listDoc.map((file, index) => (
                        <Grid item xs={2} key={index}>
                          <Typography variant="body2" sx={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={file?.selected}
                              onChange={() => handleCheckboxChange(index)}
                              style={{ marginRight: '5px' }}
                            />
                            {file.name}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </form>
                </Grid>
              </Grid>

              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  {fileArray?.map((item, index) => (
                    <Grid
                      key={index + 1}
                      container
                      spacing={1}
                      alignItems="center"
                      sx={{ border: '1px dotted gray', borderRadius: '12px', margin: '2px', padding: '8px' }}
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
                              padding: '5px',
                              fontSize: '12px'
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
                          placeholder="Remarks"
                          onChange={(e) => handleInputChangeFile(e, index, 'remark')}
                          onBlur={(e) => {
                            e.target.value === '' && toast.error('Remarks are required');
                          }}
                          value={item.remark}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '5px',
                              fontSize: '12px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <div>
                          <Button
                            component="label"
                            sx={{ marginBottom: '0' }}
                            size="small"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                          >
                            Upload File
                            <VisuallyHiddenInput type="file" onChange={(e) => handleFileChangeFile(e, index)} />
                          </Button>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        {item.file && <span style={{ color: 'blue' }}>{item.file.name}</span>}
                      </Grid>
                      {/* {index === fileArray.length - 1 && ( */}
                      <Grid item xs={12} sm={0.5}>
                        <IconButton aria-label="add" size="small" onClick={addFileEntry}>
                          <AddIcon color="success" />
                        </IconButton>
                      </Grid>
                      {/* )} */}
                      {/* {index === fileArray.length - 1 && index !== 0 && index > 6 && ( */}
                      <Grid item xs={12} sm={0.5}>
                        <IconButton aria-label="delete" size="small" onClick={() => removeFileEntry(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Grid>
                      {/* )} */}
                    </Grid>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>{renderTableHeader('itemDetail', 'Item Details')}</Table>
        {showTableHeading.itemDetail && (
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
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" size="small" color="secondary" sx={{ mr: 2 }} onClick={() => resetForm()}>
            Cancel
          </Button>
          <Button variant="contained" size="small" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>

      {/* <Box mt={'10px'}>
        <Table>{renderTableHeader('itemListRfq', 'Item List to Create RFQ')}</Table>
        {showTableHeading.itemListRfq && <ItemList />}
      </Box>
      <Box mt={'10px'}>
        <Table>{renderTableHeader('vendorlist', 'Select Vendor')}</Table>
        {showTableHeading.vendorlist && <VendorList />}
      </Box>
      <Box mt={'10px'}>
        <Table>{renderTableHeader('requireDoc', 'Required Document at The Time of Shipping')}</Table>
        {showTableHeading.requireDoc && <DocumentDetail />}
      </Box> */}
    </MainCard>
  );
};

export default QuoteForm;
