import React, { useEffect } from 'react';
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
  FormHelperText
  // Autocomplete,
  // InputAdornment
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShippingInstructionPOList from './ShippingInstructionPOList';
import MainCard from 'components/MainCard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import formattedDateTime from 'utils/time';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { styled } from '@mui/system';
// import { DataGrid, GridFooterPlaceholder, GridToolbar } from '@mui/x-data-grid';
// import { Country, City } from 'country-state-city';
// import { GetDeliveryTerms, GetPaymentTerms, GetLeadTime, GetVendors, GetPackagingType } from 'Redux/Apis/GetApiCalls';
// import { QuotationSubmit } from 'Redux/Apis/PostApiCalls';
// import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from 'utils/axiosInstance';
import SelectFieldPadding from 'components/selectFieldPadding';
import ValidationStar from 'components/ValidationStar';
import { toast } from 'react-toastify';
import PlusButton from 'components/CustomButton';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ShippingInstructionDetail from './ShippingInstructionDetail';
import CheckListTableView from './CheckListTableView';
import ShippingAdditionalDetail from './ShippingAdditionalDetail';

export default function ShippingInstruction() {
  // console.log('formMode', formMode);
  // console.log('rfq', rfq);

  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    form_m_details: true,
    Additional_details: true,
    viewBLDetail: true,
    viewCheckListTable: true,
    shippingAddintionDetail: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});
  const [po_data, setPo_data] = useState(null);
  const [view_list, setView_list] = useState(null);
  const [view_filled, setView_filled] = useState(null);

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  console.log('po_data', po_data);

  useEffect(() => {
    if (po_data !== null) {
      const data = {
        no_of_previous_shipment: '',
        buyer_name: po_data?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
        buyer_address: `${po_data?.opo_master?.OprMaster?.BuyingHouse?.address_line1} ${po_data?.opo_master?.OprMaster?.BuyingHouse?.address_line2} ${po_data.opo_master.OprMaster.BuyingHouse.country}`,
        shipper_po_vendor: po_data?.VendorsMaster?.vendor_name,
        po_number: po_data?.po_num,
        supplier_ref_no: po_data?.opo_master?.quotation_master?.quo_num,
        delivery_terms: po_data?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name,
        shipment_mode: po_data?.opo_master?.OprMaster?.shipment_mode_name,
        port_of_loading: po_data?.opo_master.quotation_master.port_loading,
        ba_no: po_data?.ba_num,
        form_m_no: po_data?.opo_master?.pfi_masters[0]?.form_ms[0]?.form_m_num,
        consignee: po_data?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
        lc_no: po_data?.opo_master?.pfi_masters[0]?.letter_of_credits[0]?.lc_number
      };
      setFormValuesCharges(data);
      const data2 = {
        po_id: po_data?.po_id,
        po_number: po_data?.po_num,
        shipper: '',
        goods_description: '',
        port_of_discharge: po_data?.opo_master.quotation_master.RfqMaster.port_destination_name,
        final_destination: po_data?.opo_master.quotation_master.RfqMaster.port_destination_name,
        marks_nos: '',
        no_of_og_bl_req: '',
        notify_party: po_data?.opo_master?.OprMaster?.companyMaster?.company_name,
        no_of_non_negotiable_bl_copy_req: '',
        additional_information1: '',
        additional_information2: ''
      };
      setFormValues(data2);
    }
  }, [po_data]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = selectedLabelDocids.map((item) => item.req_doc_name).join(', ');
    const result2 = selectedBillDocids.map((item) => item.req_doc_name).join(', ');

    try {
      const { data } = await axiosInstance.post(
        '/api/shipping/instructions',
        { ...formValues, label_check: result, bill_of_loading_check: result2, files: file },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success(data?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [formValuesCharges, setFormValuesCharges] = useState({});

  const [selectedBillDocids, setSelectedBillDocids] = useState();
  const [rfqReqDocBilllist, setRfqReqDocBilllist] = useState([
    { req_doc_name: 'BL NUMBER & DATE', id: 1 },
    { req_doc_name: 'SHIPPED ON BOARD DATE & SIGNATURE', id: 2 },
    { req_doc_name: 'FREE TIME/DAYS', id: 3 },
    { req_doc_name: 'FREIGHT PREPAID', id: 4 },
    { req_doc_name: 'CONTAINERS No and Type DETAILS', id: 5 },
    { req_doc_name: 'Number & Kind of Package', id: 6 },
    {
      req_doc_name: 'Seal Numbers',
      id: 7
    },
    { req_doc_name: 'Gross/Net Weight to match with Packing list', id: 8 },
    { req_doc_name: 'DO NOT SHOW HS CODE ANYWHERE ON THE B/L', id: 9 },
    { req_doc_name: 'KINDLY EMAIL BL DRAFT FOR ', id: 10 }
  ]);

  const [docBillName, setDocBillName] = useState('');

  const doc_table_column = [
    {
      field: 'req_doc_name',
      headerName: 'Bill of Lading CheckList',
      flex: 1,
      valueSetter: (params) => {
        return params.value.toUpperCase();
      }
    }
  ];

  const [selectedLabelDocids, setSelectedLabelDocids] = useState();
  const [rfqReqDocLabellist, setRfqReqDocLabellist] = useState([
    { req_doc_name: 'Item name to match with PFI / Invoice item name', id: 1 },
    { req_doc_name: 'Production/Mgfg date to be mentioned', id: 2 },
    { req_doc_name: 'Expiry / Best Before date to be mentioned', id: 3 },
    { req_doc_name: 'Gross Weight & Net weight of the Item to be mentioned', id: 4 },
    { req_doc_name: 'Manufacturer Name & Address to be mentioned', id: 5 },
    { req_doc_name: 'Storage Condition to be mentioned', id: 6 },
    { req_doc_name: 'Country of Origin to be mentioned', id: 7 }
  ]);
  const [docLabelName, setDocLabelName] = useState('');

  const doc_Label_column = [{ field: 'req_doc_name', headerName: 'Label CheckList', flex: 1 }];

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file.');
    }
  };

  const handleClickFile = () => {
    document.getElementById('fileInput').click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files;
    Object.values(selectedFile).forEach((file) => {
      if (file && file.type === 'application/pdf') {
        setFile(Object.values(selectedFile));
      } else {
        alert('Please select a PDF file.');
      }
    });
  };

  const [file, setFile] = useState(null);

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="initial">
            Shipping Instructions - Status / Info #
          </Typography>
          <PlusButton
            label="Back"
            onClick={() => {
              setPo_data(null);
              setView_list(false);
              setView_filled(null);
            }}
          />
        </Box>
      }
    >
      {view_list && !view_filled ? (
        <form onSubmit={handleSubmit}>
          <Table>
            {renderTableHeader('userLoginDetails', 'Shipping Instruction for BL')}
            {showTableHeading.userLoginDetails && (
              <TableBody loading={true}>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Buyer Name </Typography>
                        <FormControl variant="outlined" fullWidth>
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="buyer_name"
                            name="buyer_name"
                            value={formValuesCharges.buyer_name}
                            disabled
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              },
                              '& .Mui-disabled': {
                                '-webkit-text-fill-color': '#4f4f4f'
                              }
                            }}
                          />
                          {!!errors.buyer_name && <FormHelperText error>{errors.buyer_name}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1">Buyer Address </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="buyer_address"
                          disabled
                          name="buyer_address"
                          value={formValuesCharges.buyer_address}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                        {!!errors.buyer_address && <FormHelperText error>{errors.buyer_address}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">PO vendor </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="shipper_po_vendor"
                          disabled
                          name="shipper_po_vendor"
                          value={formValuesCharges.shipper_po_vendor}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                        {!!errors.shipper_po_vendor && <FormHelperText error>{errors.shipper_po_vendor}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">PO Number</Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="po_number"
                          name="po_number"
                          value={formValuesCharges.po_number}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                        {!!errors.po_number && <FormHelperText error>{errors.po_number}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Supplier Ref No(Quote no) </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="supplier_ref_no"
                          name="supplier_ref_no"
                          value={formValuesCharges.supplier_ref_no}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Delivery Terms </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="delivery_terms"
                          name="delivery_terms"
                          value={formValuesCharges.delivery_terms}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '7px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                        {!!errors.delivery_terms && <FormHelperText error>{errors.delivery_terms}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Shipment mode</Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="shipment_mode"
                          name="shipment_mode"
                          disabled
                          value={formValuesCharges.shipment_mode}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">No of Previous shipment # </Typography>
                        <TextField
                          fullWidth
                          id="no_of_previous_shipment"
                          name="no_of_previous_shipment"
                          disabled
                          value={formValuesCharges.no_of_previous_shipment}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Amount of Previous shipment # </Typography>
                        <TextField
                          fullWidth
                          id="no_of_previous_shipment"
                          name="no_of_previous_shipment"
                          disabled
                          value={formValuesCharges.amount_of_previous_shipment}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Consignee </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="consignee"
                          disabled
                          name="consignee"
                          value={formValuesCharges.consignee}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />

                        {!!errors.payment_terms && <FormHelperText error>{errors.payment_terms}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Port of loading </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          disabled
                          id="port_of_loading"
                          name="port_of_loading"
                          value={formValuesCharges.port_of_loading}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                        {!!errors.port_of_loading && <FormHelperText error>{errors.port_of_loading}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Form M No</Typography>
                        <TextField
                          id="form_m_no"
                          name="form_m_no"
                          variant="outlined"
                          disabled
                          fullWidth
                          value={formValuesCharges.form_m_no}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">BA NO.</Typography>
                        <TextField
                          id="ba_no"
                          name="ba_no"
                          variant="outlined"
                          fullWidth
                          disabled
                          value={formValuesCharges.ba_no}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">L/C No.</Typography>
                        <TextField
                          id="lc_no"
                          name="lc_no"
                          variant="outlined"
                          fullWidth
                          // type="number"
                          disabled
                          value={formValuesCharges.lc_no}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
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
            {renderTableHeader('form_m_details', 'List')}
            {showTableHeading.form_m_details && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <MainCard title="CheckList">
                      <Grid fullWidth container justifyContent={'start'}>
                        <Grid fullWidth item xs={6}>
                          <Paper sx={{ height: 'auto', width: '100%' }}>
                            <DataGrid
                              getRowHeight={() => 'auto'}
                              sx={{
                                '& .MuiDataGrid-cell': {
                                  border: '1px solid rgba(224, 224, 224, 1)',
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'center'
                                },
                                '& .MuiDataGrid-columnHeader': {
                                  backgroundColor: '#f5f5f5',
                                  border: '1px solid rgba(224, 224, 224, 1)',
                                  height: '25px !important',
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'center'
                                },
                                '& .MuiDataGrid-scrollbar': {
                                  height: '8px'
                                }
                              }}
                              rows={rfqReqDocBilllist}
                              columns={doc_table_column}
                              onRowSelectionModelChange={(val) => {
                                return setSelectedBillDocids(
                                  rfqReqDocBilllist?.filter((item) => {
                                    return val.includes(item.id);
                                  })
                                );
                              }}
                              checkboxSelection
                              hideFooter
                              hideFooterPagination
                              hideFooterSelectedRowCount
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ height: '50px', width: '50px' }} />
                                <TextField
                                  id="docBillName"
                                  label="Add More..."
                                  sx={{
                                    '& .MuiInputBase-input': {
                                      // padding: '6px'
                                    },
                                    '& .MuiInputBase-input.Mui-disabled': {
                                      WebkitTextFillColor: '#000000'
                                    }
                                  }}
                                  value={docBillName}
                                  onChange={(e) => setDocBillName(e.target.value)}
                                />
                                <IconButton
                                  onClick={() => {
                                    setRfqReqDocBilllist((val) => [...val, { id: rfqReqDocBilllist.length, req_doc_name: docBillName }]);
                                    setDocBillName('');
                                  }}
                                  aria-label="add"
                                  sx={{ height: '50px', width: '50px' }}
                                >
                                  <AddCircleOutlineIcon sx={{ fontSize: '50px' }} color="success" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid fullWidth item xs={6}>
                          <Paper sx={{ height: 'auto', width: '100%' }}>
                            <DataGrid
                              getRowHeight={() => 'auto'}
                              sx={{
                                '& .MuiDataGrid-cell': {
                                  border: '1px solid rgba(224, 224, 224, 1)',
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'center'
                                },
                                '& .MuiDataGrid-columnHeader': {
                                  backgroundColor: '#f5f5f5',
                                  border: '1px solid rgba(224, 224, 224, 1)',
                                  height: '25px !important',
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'center'
                                },
                                '& .MuiDataGrid-scrollbar': {
                                  height: '8px'
                                }
                              }}
                              rows={rfqReqDocLabellist}
                              columns={doc_Label_column}
                              onRowSelectionModelChange={(val) => {
                                return setSelectedLabelDocids(
                                  rfqReqDocLabellist?.filter((item) => {
                                    return val.includes(item.id);
                                  })
                                );
                              }}
                              checkboxSelection
                              hideFooter
                              hideFooterPagination
                              hideFooterSelectedRowCount
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ height: '50px', width: '50px' }} />
                                <TextField
                                  id="docLabelName"
                                  label="Add More..."
                                  sx={{
                                    '& .MuiInputBase-input': {
                                      // padding: '6px'
                                    },
                                    '& .MuiInputBase-input.Mui-disabled': {
                                      WebkitTextFillColor: '#000000'
                                    }
                                  }}
                                  value={docLabelName}
                                  onChange={(e) => setDocLabelName(e.target.value)}
                                />
                                <IconButton
                                  onClick={() => {
                                    setRfqReqDocLabellist((val) => [...val, { id: rfqReqDocLabellist.length, req_doc_name: docLabelName }]);
                                    setDocLabelName('');
                                  }}
                                  aria-label="add"
                                  sx={{ height: '50px', width: '50px' }}
                                >
                                  <AddCircleOutlineIcon sx={{ fontSize: '50px' }} color="success" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </MainCard>

                    {/* <MainCard title="Label Checks List">
                      <Grid fullWidth container sx={{ width: '100%' }}>
                      
                      </Grid>
                    </MainCard> */}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>
            {renderTableHeader('Additional_details', 'Additional Details')}
            {showTableHeading.Additional_details && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '20px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Shipper</Typography>
                        <TextField
                          fullWidth
                          id="shipper"
                          name="shipper"
                          value={formValues?.shipper}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">Goods Description</Typography>
                        <TextField
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                          fullWidth
                          id="goods_description"
                          name="goods_description"
                          variant="outlined"
                          type="text"
                          value={formValues?.goods_description}
                          onChange={handleInputChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">
                          Port of Discharge<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="port_of_discharge"
                          name="port_of_discharge"
                          value={formValues?.port_of_discharge}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.port_of_discharge && <FormHelperText error>{errors.port_of_discharge}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">
                          Final Destination<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                        <TextField
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                          fullWidth
                          id="final_destination"
                          name="final_destination"
                          variant="outlined"
                          type="text"
                          value={formValues?.final_destination}
                          onChange={handleInputChange}
                        />
                        {!!errors.final_destination && <FormHelperText error>{errors.final_destination}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">
                          Marks and Nos <ValidationStar>*</ValidationStar>
                        </Typography>
                        <TextField
                          id="marks_nos"
                          name="marks_nos"
                          variant="outlined"
                          fullWidth
                          value={formValues?.marks_nos}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.marks_nos && <FormHelperText error>{errors.marks_nos}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">
                          No of Original BL Req <ValidationStar>*</ValidationStar>
                        </Typography>
                        <TextField
                          id="no_of_og_bl_req"
                          name="no_of_og_bl_req"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={formValues?.no_of_og_bl_req}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.no_of_og_bl_req && <FormHelperText error>{errors.no_of_og_bl_req}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1">
                          Notify Party<ValidationStar>*</ValidationStar>{' '}
                        </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="notify_party"
                          name="notify_party"
                          value={formValues?.notify_party}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.notify && <FormHelperText error>{errors.notify}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1">
                          No of Non Negotiable BL copy Req<ValidationStar>*</ValidationStar>
                        </Typography>
                        <TextField
                          id="no_of_non_negotiable_bl_copy_req"
                          name="no_of_non_negotiable_bl_copy_req"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={formValues?.no_of_non_negotiable_bl_copy_req}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.no_of_non_negotiable_bl_copy_req && (
                          <FormHelperText error>{errors.no_of_non_negotiable_bl_copy_req}</FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Typography variant="subtitle1">Additional Instruction- 1</Typography>
                        <TextField
                          id="additional_information1"
                          name="additional_information1"
                          variant="outlined"
                          fullWidth
                          type="text"
                          value={formValues?.additional_information1}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.additional_information1 && <FormHelperText error>{errors.additional_information1}</FormHelperText>}
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <Typography variant="subtitle1">Additional Instruction-2</Typography>
                        <TextField
                          id="additional_information2"
                          name="additional_information2"
                          variant="outlined"
                          fullWidth
                          type="text"
                          value={formValues?.additional_information2}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
                      <Grid
                        marginTop="10px"
                        item
                        xs={12}
                        sm={4}
                        borderRadius="15px"
                        style={{
                          border: '2px dashed #000',
                          padding: '30px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleClickFile}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                          <Typography variant="body1" style={{ marginBottom: '8px' }}>
                            <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                          </Typography>
                          {file ? (
                            <ol>
                              {file.map((item, index) => (
                                <Typography component="li" key={index} variant="body1" style={{ marginBottom: '8px', textAlign: 'left' }}>
                                  {item.name}
                                </Typography>
                              ))}
                            </ol>
                          ) : (
                            <>
                              <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                                Upload Details
                              </label>
                              <input
                                multiple
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                                accept=".pdf"
                              />
                            </>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 4 }}>
                Submit
              </Button>
            </Box>
          </TableContainer>
        </form>
      ) : (
        !view_filled && (
          <ShippingInstructionPOList
            view_filled={view_filled}
            setView_filled={setView_filled}
            setPo_data={setPo_data}
            setView_list={setView_list}
          />
        )
      )}

      {view_filled && (
        <Table>
          {renderTableHeader('userLoginDetails', 'Shipping Instruction for BL')}
          {showTableHeading.userLoginDetails && (
            <TableBody loading={true}>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Buyer Name </Typography>
                      <FormControl variant="outlined" fullWidth>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="buyer_name"
                          name="buyer_name"
                          value={formValuesCharges.buyer_name}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            },
                            '& .Mui-disabled': {
                              '-webkit-text-fill-color': '#4f4f4f'
                            }
                          }}
                        />
                        {!!errors.buyer_name && <FormHelperText error>{errors.buyer_name}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1">Buyer Address </Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="buyer_address"
                        disabled
                        name="buyer_address"
                        value={formValuesCharges.buyer_address}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                      {!!errors.buyer_address && <FormHelperText error>{errors.buyer_address}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">PO vendor </Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="shipper_po_vendor"
                        disabled
                        name="shipper_po_vendor"
                        value={formValuesCharges.shipper_po_vendor}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                      {!!errors.shipper_po_vendor && <FormHelperText error>{errors.shipper_po_vendor}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">PO Number</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="po_number"
                        name="po_number"
                        value={formValuesCharges.po_number}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                      {!!errors.po_number && <FormHelperText error>{errors.po_number}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Supplier Ref No(Quote no) </Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="supplier_ref_no"
                        name="supplier_ref_no"
                        value={formValuesCharges.supplier_ref_no}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Delivery Terms </Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="delivery_terms"
                        name="delivery_terms"
                        value={formValuesCharges.delivery_terms}
                        disabled
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '7px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                      {!!errors.delivery_terms && <FormHelperText error>{errors.delivery_terms}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Shipment mode</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="shipment_mode"
                        name="shipment_mode"
                        disabled
                        value={formValuesCharges.shipment_mode}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">No of Previous shipments #</Typography>
                      <TextField
                        fullWidth
                        id="no_of_previous_shipment"
                        name="no_of_previous_shipment"
                        disabled
                        value={formValuesCharges.no_of_previous_shipment}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '6px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Amount of Previous shipments # </Typography>
                      <TextField
                        fullWidth
                        id="no_of_previous_shipment"
                        name="no_of_previous_shipment"
                        disabled
                        value={formValuesCharges.amount_of_previous_shipment}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '6px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Consignee </Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="consignee"
                        disabled
                        name="consignee"
                        value={formValuesCharges.consignee}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />

                      {!!errors.payment_terms && <FormHelperText error>{errors.payment_terms}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Port of loading </Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        disabled
                        id="port_of_loading"
                        name="port_of_loading"
                        value={formValuesCharges.port_of_loading}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                      {!!errors.port_of_loading && <FormHelperText error>{errors.port_of_loading}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">Form M No</Typography>
                      <TextField
                        id="form_m_no"
                        name="form_m_no"
                        variant="outlined"
                        disabled
                        fullWidth
                        value={formValuesCharges.form_m_no}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">BA NO.</Typography>
                      <TextField
                        id="ba_no"
                        name="ba_no"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={formValuesCharges.ba_no}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
                          }
                        }}
                      />

                      {!!errors.ba_no && <FormHelperText error>{errors.ba_no}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle1">L/C No.</Typography>
                      <TextField
                        id="lc_no"
                        name="lc_no"
                        variant="outlined"
                        fullWidth
                        // type="number"
                        disabled
                        value={formValuesCharges.lc_no}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          },
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#4f4f4f'
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
      )}

      {view_filled && (
        <Table>
          {renderTableHeader('viewCheckListTable', 'CheckLists')}
          {showTableHeading.viewCheckListTable && (
            <div>
              <CheckListTableView po_data={po_data} />
            </div>
          )}
        </Table>
      )}
      {view_filled && (
        <Table>
          {renderTableHeader('shippingAddintionDetail', 'Shipping Additional Detail')}
          {showTableHeading.shippingAddintionDetail && (
            <div>
              <ShippingAdditionalDetail po_data={po_data} />
            </div>
          )}
        </Table>
      )}
    </MainCard>
  );
}
