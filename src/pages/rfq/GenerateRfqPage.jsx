import React, { useState } from 'react';
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
  InputAdornment,
  Select,
  MenuItem
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import RFQView from './RFQView';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import formatNumber from 'utils/functions';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
const GenerateRfqPage = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqView: true,
    createrfqForm: true,
    itemListRfq: true,
    vendorlist: true,
    requireDoc: true
  });
  const [doc_name, setDoc_name] = useState('');
  const { leadTime, shipmentMode, shipmentType, rfqDelivery, portDestination, respond_time } = useSelector((state) => state.static);
  const [remarksArr, setRemarksArr] = useState([{ remark: '' }]);
  const handleInputChangeFile = (e, index, key) => {
    const updatedRemarks = [...remarksArr];
    updatedRemarks[index][key] = e.target.value;
    setRemarksArr(updatedRemarks);
  };
  const addFileEntry = () => {
    setRemarksArr([...remarksArr, { remark: '' }]);
  };

  const removeFileEntry = (index) => {
    const updatedRemarks = remarksArr.filter((_, i) => i !== index);
    setRemarksArr(updatedRemarks);
  };

  const calcNet = (val1, val2) => {
    return val1 + val2;
  };
  const shipmentData = [
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  const rfqItemcolumns = [
    { field: 'item_code', headerName: 'Item Code', width: 100, flex: 1 },
    { field: 'item_name', headerName: 'Item Name', width: 250, flex: 1 },
    { field: 'item_description', headerName: 'Remarks', width: 250, flex: 1 },
    { field: 'company_name', headerName: 'Company', width: 200, flex: 1 },
    { field: 'uom_name', headerName: 'UOM', width: 100, flex: 1 },
    { field: 'qty', headerName: 'Req Qty', width: 100, flex: 1, renderCell: (params) => formatNumber(params.value) },

    {
      field: 'tolerance',
      headerName: 'Tolerance %',
      width: 150,
      editable: true,
      flex: 1,
      renderCell: (params) => formatNumber(params.value || '')
    },
    {
      field: 'net_qty',
      headerName: 'Net Qty',
      width: 100,
      renderCell: (params) => calcNet(Number(params?.row?.quantity), Number(params?.row?.qty)),
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <IconButton aria-label="delete" color="error" onClick={() => removeItem(params.id)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];
  const rfqItemData = [
    {
      id: 1,
      item_code: 'ITM001',
      item_name: 'Laptop',
      item_description: 'Dell Latitude 5420',
      company_name: 'ABC Corp',
      uom_name: 'Piece',
      qty: 10,
      tolerance: 5,
      net_qty: 10 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 2,
      item_code: 'ITM002',
      item_name: 'Monitor',
      item_description: 'Dell 24-inch UltraSharp',
      company_name: 'XYZ Pvt Ltd',
      uom_name: 'Piece',
      qty: 20,
      tolerance: 2,
      net_qty: 20 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 3,
      item_code: 'ITM003',
      item_name: 'Keyboard',
      item_description: 'Logitech Wireless Keyboard K780',
      company_name: 'DEF Enterprises',
      uom_name: 'Piece',
      qty: 50,
      tolerance: 10,
      net_qty: 50 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 4,
      item_code: 'ITM004',
      item_name: 'Mouse',
      item_description: 'Logitech MX Master 3',
      company_name: 'ABC Corp',
      uom_name: 'Piece',
      qty: 30,
      tolerance: 3,
      net_qty: 30 // This can be calculated dynamically using `calcNet`
    },
    {
      id: 5,
      item_code: 'ITM005',
      item_name: 'Printer',
      item_description: 'HP LaserJet Pro M404dn',
      company_name: 'XYZ Pvt Ltd',
      uom_name: 'Piece',
      qty: 5,
      tolerance: 1,
      net_qty: 5 // This can be calculated dynamically using `calcNet`
    }
  ];
  const doc_table_column = [{ field: 'req_doc_name', headerName: 'Document Name', flex: 1 }];

  const [doc_table_data, setDoc_table_data] = useState([
    { id: 1, req_doc_name: 'Commercial Invoice' },
    { id: 2, req_doc_name: 'Packing List' },
    { id: 3, req_doc_name: 'Certificate Of Analysis' }
  ]);

  // const doc_table_data = [
  //   { id: 1, req_doc_name: 'Commercial Invoice' },
  //   { id: 2, req_doc_name: 'Packing List' },
  //   { id: 3, req_doc_name: 'Certificate Of Analysis' }
  // ];
  const VendorColumn = [
    { field: 'lprNo', headerName: 'Sr No.', width: 100 },
    { field: 'vertical', headerName: 'Item Name', width: 100 },
    { field: 'company', headerName: 'Vendor Serial', width: 150 },
    { field: 'division', headerName: 'Vendor Name', width: 150 },
    { field: 'lprCategory', headerName: 'Contact Person', width: 150 },
    { field: 'shipmentMode', headerName: 'Compliance Status', width: 150 }
  ];

  const VendorData = [
    {
      id: 1,
      select: false,
      lprNo: 1,
      vertical: 'Item A',
      company: 'VS-001',
      division: 'Vendor A',
      lprCategory: 'John Doe',
      shipmentMode: 'Compliant'
    },
    {
      id: 2,
      select: false,
      lprNo: 2,
      vertical: 'Item B',
      company: 'VS-002',
      division: 'Vendor B',
      lprCategory: 'Jane Smith',
      shipmentMode: 'Non-Compliant'
    },
    {
      id: 3,
      select: false,
      lprNo: 3,
      vertical: 'Item C',
      company: 'VS-003',
      division: 'Vendor C',
      lprCategory: 'Michael Brown',
      shipmentMode: 'Pending'
    },
    {
      id: 4,
      select: false,
      lprNo: 4,
      vertical: 'Item D',
      company: 'VS-004',
      division: 'Vendor D',
      lprCategory: 'Emily Davis',
      shipmentMode: 'Compliant'
    }
  ];
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={500}>
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
    <MainCard>
      <Box>
        <Table>{renderTableHeader('rfqView', 'View RFQ')}</Table>
        {showTableHeading.rfqView && (
          <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
            <Grid container spacing={2}>
              {shipmentData
                .reduce((acc, item, index) => {
                  if (index % 4 === 0) acc.push([]);
                  acc[acc.length - 1].push(item);
                  return acc;
                }, [])
                .map((row, rowIndex) => (
                  <Grid container item xs={12} key={rowIndex} spacing={2}>
                    {row.map((item, itemIndex) => (
                      <Grid item xs={3} key={itemIndex}>
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
                ))}

              <Grid item xs={12} sm={3}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  OPR Lead time
                </Typography>
                <TextField
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '5px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                  value={`${leadTime?.map((item) => item)}`}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  OPR Lead time
                </Typography>
                <TextField
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
                  }}
                  id="delivery_timeline"
                  name="delivery_timeline"
                  value={rfqDelivery}
                  // onChange={(e) => setRfqDelivery(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '5px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  Port of Delivery
                </Typography>

                <Select
                  variant="outlined"
                  fullWidth
                  id="portDestination"
                  name="portDestination"
                  value={portDestination}
                  onChange={(e) => setPortDestination(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '5px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Port of Discharge</em>
                  </MenuItem>
                  {/* {PortDestination.map((data) => (
                  <MenuItem key={data.port_destination_id} value={data.port_destination_id}>
                    {data.port_destination_name}
                  </MenuItem>
                ))} */}
                </Select>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body" style={{ fontSize: '11px' }}>
                  Respond Time(Days)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  id="respond_time"
                  name="respond_time"
                  placeholder="From RFQ Issue Date"
                  value={respond_time}
                  onChange={(e) => setRespondTime(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '5px'
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                {remarksArr?.map((item, index) => (
                  <Grid
                    key={index}
                    container
                    spacing={1}
                    display={'flex'}
                    alignItems="center"
                    sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
                  >
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body" style={{ fontSize: '11px' }}>
                        Additional Remarks
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': { padding: '5px' },
                          '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' }
                        }}
                        id={`remark-${index}`}
                        name="remark"
                        onChange={(e) => handleInputChangeFile(e, index, 'remark')}
                        value={item?.remark}
                      />
                    </Grid>

                    {index !== 0 && (
                      <Grid item xs={12} sm={0.5}>
                        <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Grid>
                    )}

                    {index === remarksArr.length - 1 && (
                      <Grid item xs={12} sm={0.5}>
                        <IconButton aria-label="add" size="large" onClick={addFileEntry}>
                          <AddIcon color="success" />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>
      <Table>{renderTableHeader('createrfqForm', 'Item List to Create RFQ')}</Table>
      {showTableHeading.createrfqForm && (
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
            '& .MuiDataGrid-checkboxInput': {
              padding: '0px' // To remove extra padding around the checkbox
            },
            '& .MuiCheckbox-root': {
              width: '18px',
              height: '18px'
            },
            '& .MuiSvgIcon-root': {
              fontSize: '20px' // Customize the size of the checkmark icon
            }
          }}
          pageSize={5}
          columns={rfqItemcolumns}
          rows={rfqItemData}
          hideFooterPagination
          rowsPerPageOptions={[5, 10, 20]}
        />
      )}
      <Box mt={'10px'}>
        <Table>{renderTableHeader('itemListRfq', 'Selected Vendor')}</Table>
        {showTableHeading.itemListRfq && (
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
              '& .MuiDataGrid-checkboxInput': {
                padding: '0px' // To remove extra padding around the checkbox
              },
              '& .MuiCheckbox-root': {
                width: '18px',
                height: '18px'
              },
              '& .MuiSvgIcon-root': {
                fontSize: '20px' // Customize the size of the checkmark icon
              }
            }}
            rows={VendorData}
            columns={VendorColumn}
            pageSize={5}
            checkboxSelection
            rowsPerPageOptions={[5]}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        )}
      </Box>
      <Box mt={'10px'}>
        <Table>{renderTableHeader('vendorlist', 'Required Documents at the time of Shipping')}</Table>
        {showTableHeading.vendorlist && (
          <Box>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex'
                },
                '& .MuiDataGrid-checkboxInput': {
                  padding: '0px' // To remove extra padding around the checkbox
                },
                '& .MuiCheckbox-root': {
                  width: '18px',
                  height: '18px'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px' // Customize the size of the checkmark icon
                }
              }}
              rows={doc_table_data}
              columns={doc_table_column}
              onRowSelectionModelChange={(val) => {
                return setSelectedDocids(
                  doc_table_data?.filter((item) => {
                    return val.includes(item.id);
                  })
                );
              }}
              checkboxSelection
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />

            <TextField
              id="doc_name"
              variant="outlined"
              placeholder="Document Name"
              sx={{
                '& .MuiInputBase-input': {
                  padding: '6px'
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000000'
                }
              }}
              value={doc_name}
              onChange={(e) => setDoc_name(e.target.value)}
            />
            <IconButton
              onClick={() => {
                setDoc_table_data((val) => [...val, { id: doc_table_data.length, req_doc_name: doc_name }]);
                setDoc_name('');
              }}
              aria-label="add"
            >
              <AddCircleOutlineIcon sx={{ fontSize: '50px' }} color="success" />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="flex-end" mx={'20px'}>
        <Box display="flex" flexDirection={'row'} gap={'10px'} my={'10px'}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Issue RFQ
          </Button>
          {/* <ConfirmForm isOpen={isDialogOpen} onClose={handleCloseDialog} onConfirm={() => handleSubmit()} type={'RFQ'} /> */}
        </Box>
      </Box>
    </MainCard>
  );
};

export default GenerateRfqPage;
