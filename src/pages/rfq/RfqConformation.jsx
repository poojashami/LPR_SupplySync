import { toast } from 'react-toastify';
import VendorList from './VendorList';
import Paper from '@mui/material/Paper';
import formatNumber from 'utils/functions';
import MainCard from 'components/MainCard';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import '@ag-grid-community/styles/ag-grid.css';
import { Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { SubmitRFQ } from 'Redux/Apis/PostApiCalls';
import { axiosInstance } from 'utils/axiosInstance';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { useSelector, useDispatch } from 'react-redux';
import { ModuleRegistry } from '@ag-grid-community/core';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import ConfirmForm from 'components/BasicDataComponent/ConfrmForm';
import { setSelectedRows, clearRfqList } from 'Redux/Slices/RFQSlice';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GetRFQ_DocList, GetPortDestination } from 'Redux/Apis/GetApiCalls';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Table, TableCell, TableRow, Select, MenuItem, TextField, InputAdornment } from '@mui/material';

const doc_table_column = [{ field: 'req_doc_name', headerName: 'Document Name', flex: 1 }];

const RfqItemList = ({ setShowRfqConfirm }) => {
  const dispatch = useDispatch();
  const { rfqItemList: list, rfqDocList } = useSelector((state) => state.rfq);
  const { PortDestination } = useSelector((state) => state.rfq);
  const { leadTime, shipmentMode, shipmentType } = useSelector((state) => state.static);
  const [rfqReqDoclist, setRfqReqDoclist] = useState([]);
  const [selectedDocids, setSelectedDocids] = useState();
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [rfqItemList, setRfqItemList] = useState([]);
  const [doc_name, setDoc_name] = useState('');
  const [bh_id, setBhId] = useState(null);
  const [bh_Data, setBhData] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [respond_time, setRespondTime] = useState(0);

  function mergeItems(arr) {
    const aggregatedItems = {};
    arr.forEach((item) => {
      const key = `${item.item_id}|${item.company_name}`;
      if (!aggregatedItems[key]) {
        aggregatedItems[key] = { ...item };
      } else {
        aggregatedItems[key].qty += item.qty;
      }
    });
    return Object.values(aggregatedItems);
  }

  useEffect(() => {
    setRfqReqDoclist(
      rfqDocList?.map((item) => ({
        ...item,
        req_doc_name: item?.req_doc_name === 'CRIA' ? 'CRIA - Applicable if goods Coming from India or China' : item?.req_doc_name,
        id: item.req_doc_id
      }))
    );
  }, [rfqDocList]);
  const fetch_buying_house = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/bhouse/buyinghouses?buying_house_id=${id}`);
      setBhData(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (bh_id) {
      fetch_buying_house(bh_id);
    }
  }, [bh_id]);

  const removeItem = (id) => {
    console.log(id);
    setRfqItemList((prev) => prev?.filter((item) => item?.id != id));
  };

  useEffect(() => {
    GetRFQ_DocList(dispatch);
    GetPortDestination(dispatch);
    setBhId(list[0]?.bh_id);
    const mappedData = mergeItems(list)?.map((item, index) => ({
      id: index,
      opr_item_id: item.opr_item_id,
      item_id: item.item_id,
      item_code: item.item_code,
      item_name: item.item_name,
      item_description: item.item_description,
      qty: item.qty,
      quantity_in_stock: item.quantity_in_stock,
      quantity: 0,
      uom_name: item.uom_name,
      net_qty: item.net_qty,
      company_name: item.company_name,
      address_id: item.address_id
    }));
    setRfqItemList(mappedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calcNet = (val1, val2) => {
    return val1 + val2;
  };

  const columns = [
    { field: 'item_code', headerName: 'Item Code', width: 100, flex: 1 },
    { field: 'item_name', headerName: 'Item Name', width: 250, flex: 1 },
    { field: 'item_description', headerName: 'Remarks', width: 250, flex: 1 },
    { field: 'company_name', headerName: 'Company', width: 200, flex: 1 },
    { field: 'uom_name', headerName: 'UOM', width: 100, flex: 1 },
    // { field: 'item_description', headerName: 'Item Description', width: 300,flex:1 },
    { field: 'qty', headerName: 'Req Qty', width: 100, flex: 1, renderCell: (params) => formatNumber(params.value) },
    // { field: 'quantity_in_stock', headerName: 'Avl Qty', width: 100,flex:1 },
    // {
    //   field: 'add_quantity',
    //   headerName: 'Additional Qty',
    //   width: 150,
    //   editable: true,
    //   flex: 1,
    //   renderCell: (params) => formatNumber(params.value || '')
    // },
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [remarksArr, setRemarksArr] = useState([{ remark: '' }]);

  const handleInputChangeFile = (e, index, field) => {
    const { value } = e.target;
    setRemarksArr((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };
  const addFileEntry = () => {
    setRemarksArr((prevArray) => [...prevArray, { remark: '' }]);
  };
  const removeFileEntry = (index) => {
    setRemarksArr((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const handleOpenDialog = () => {
    let ids = { opr_item_ids: list.map((item) => item.opr_item_id) };
    let VendorIds = { vendor_ids: selectedVendor.map((item) => item.vendor_id) };
    console.log(rfqItemList);

    const mappedData = rfqItemList.map((item) => ({
      opr_item_id: item?.opr_item_id,
      opr_id: item?.opr_id,
      item_id: item?.item_id,
      quantity: item?.qty,
      stock_in_transit: item?.stock_in_transit,
      stock_in_hand: item?.stock_in_hand,
      monthly_consumption: item?.monthly_consumption,
      item_description: item?.item_description,
      status: item?.status,
      rfq_id: item?.rfq_id,
      address_id: item?.address_id
    }));

    const opr_ids = list.map((item) => ({
      opr_id: item?.opr_id_no
    }));

    const data = {
      selectedDoc: selectedDocids,
      item_list: mappedData,
      remarks: remarksArr,
      delivery_timeline: rfqDelivery,
      port_of_destination: portDestination,
      respond_time: respond_time,
      vendor_ids: VendorIds.vendor_ids,
      opr_item_ids: ids.opr_item_ids,
      opr_ids: opr_ids
    };
    console.log('rfqItemList', data);
    if (data.item_list.length > 0 && data.vendor_ids.length > 0) {
      setIsDialogOpen(true);
    } else if (data.item_list.length === 0) {
      window.alert('Item Not Found');
    } else {
      console.log('data.vendor_ids', data.vendor_ids);
      window.alert('Vendor Not Selected');
    }
  };
  const handleCloseDialog = () => setIsDialogOpen(false);

  const [rfqRemarks, setRfqRemarks] = useState('');
  const [rfqDelivery, setRfqDelivery] = useState('');
  const [portDestination, setPortDestination] = useState('');

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleSubmit = async () => {
    let ids = { opr_item_ids: list.map((item) => item.opr_item_id) };
    let VendorIds = { vendor_ids: selectedVendor.map((item) => item.vendor_id) };
    console.log(rfqItemList);
    const mappedData = rfqItemList.map((item) => ({
      opr_item_id: item?.opr_item_id,
      opr_id: item?.opr_id,
      item_id: item?.item_id,
      quantity: item?.qty,
      stock_in_transit: item?.stock_in_transit,
      stock_in_hand: item?.stock_in_hand,
      monthly_consumption: item?.monthly_consumption,
      item_description: item?.item_description,
      uom_name: item?.uom_name,
      status: item?.status,
      rfq_id: item?.rfq_id,
      address_id: item?.address_id,
      tolerance: item?.tolerance,
      bh_id: bh_id
    }));

    const opr_ids = list.map((item) => ({
      opr_id: item?.opr_id_no
    }));

    const data = {
      selectedDoc: selectedDocids,
      item_list: mappedData,
      remarks: remarksArr,
      shipment_type: shipmentType,
      shipment_mode: shipmentMode,
      delivery_timeline: rfqDelivery,
      port_of_destination: portDestination,
      vendor_ids: VendorIds.vendor_ids,
      opr_item_ids: ids.opr_item_ids,
      opr_ids: opr_ids,
      bh_id: bh_id,
      respond_time: respond_time
    };

    try {
      if (data.item_list.length > 0 && data.vendor_ids.length > 0) {
        console.log(data);
        await SubmitRFQ(dispatch, data);
        setShowRfqConfirm(false);
        dispatch(setSelectedRows([]));
        dispatch(clearRfqList());
        setSelectedVendor([]);
        // setShowItems(true);
      } else if (data.item_list.length === 0) {
        window.alert('Item Not Found');
      } else {
        window.alert('Vendor Not Selected');
      }
    } catch (err) {
      console.log({ 'Error in rfq submission': err });
    }
  };

  const processRowUpdater = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRfqItemList(rfqItemList.map((row) => (row.id === newRow.id ? updatedRow : row)));
    console.log(rfqItemList.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  return (
    <>
      <MainCard title={'Basic Information'}>
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

        <Grid container spacing={2} alignItems="center" sx={{ padding: '2vh' }}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              sx={{
                '& .MuiInputBase-input': {
                  padding: '6px'
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000000'
                }
              }}
              label=" OPR Lead time"
              value={`${leadTime?.map((item) => item)}`}
            />
          </Grid>
          {/* 
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            disabled
            sx={{
              '& .MuiInputBase-input': {
                padding: '6px'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000'
              }
            }}
            label="Tolerance %"
            value={`${leadTime?.map((item) => item)}`}
          />
        </Grid> */}

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
              }}
              id="delivery_timeline"
              name="delivery_timeline"
              label="Delivery Timeline"
              value={rfqDelivery}
              onChange={(e) => setRfqDelivery(e.target.value)}
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
            <Typography variant="subtitle1">Port of Delivery</Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            {/* <TextField
            fullWidth
            id="portDestination"
            name="portDestination"
            value={portDestination}
            onChange={(e) => setPortDestination(e.target.value)}
           sx={{
              '& .MuiInputBase-input': {
                padding: '6px'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000'
              }
            }}
          /> */}
            <Select
              // as={SelectFieldPadding}
              variant="outlined"
              fullWidth
              id="portDestination"
              name="portDestination"
              // label="Port of Discharge"
              value={portDestination}
              onChange={(e) => setPortDestination(e.target.value)}
            >
              <MenuItem value="">
                <em>Port of Discharge</em>
              </MenuItem>
              {PortDestination.map((data) => (
                <MenuItem key={data.port_destination_id} value={data.port_destination_id}>
                  {data.port_destination_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={1}>
            <Typography variant="subtitle1">Respond Time(Days) </Typography>
            <Typography variant="h6">(From RFQ Date)</Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
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
                  padding: '6px'
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
                alignItems="center"
                sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
              >
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Additional Remarks #</Typography>
                  <TextField
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': { padding: '6px' },
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

                {/* <Grid item xs={12} sm={2}>
            <Select
              sx={{ '& .MuiInputBase-input': { padding: '6px' } }}
              variant="outlined"
              fullWidth
              id="portDestination"
              name="portDestination"
              value={portDestination}
              onChange={(e) => setPortDestination(e.target.value)}
            >
              <MenuItem value="">
                <em>Port of Discharge</em>
              </MenuItem>
              {PortDestination.map((data) => (
                <MenuItem key={data.port_destination_id} value={data.port_destination_id}>
                  {data.port_destination_name}
                </MenuItem>
              ))}
            </Select>
          </Grid> */}

                {/* <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              sx={{
                '& .MuiInputBase-input': { padding: '6px' },
                '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' }
              }}
              id="payment_terms"
              name="payment_terms"
              disabled
            />
          </Grid> */}
              </Grid>
            ))}
          </Grid>
          {/* <Grid item xs={12} sm={1}>
          <Typography variant="subtitle1">Remarks</Typography>
        </Grid> */}
          {/* <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              id="remarks"
              name="remarks"
              label="Remarks"
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
        </Grid>
      </MainCard>
      <MainCard title="Item List to Create RFQ">
        <div className="ag-theme-alpine" style={{ height: 'auto', width: '100%' }}>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
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
                '& .MuiDataGrid-checkboxInput': {
                  padding: '0px' // To remove extra padding around the checkbox
                },
                '& .MuiCheckbox-root': {
                  width: '18px',
                  height: '18px'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px' // Customize the size of the checkmark icon
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              pageSize={5}
              columns={columns}
              rows={rfqItemList}
              hideFooterPagination
              rowsPerPageOptions={[5, 10, 20]}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              // onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdater}
            />
          </div>
        </div>
      </MainCard>

      <br></br>

      {/* Display vendor list */}
      <MainCard title="Select Vendor">
        <VendorList setSelectedVendor={setSelectedVendor} selectedVendor={selectedVendor} />
      </MainCard>
      <br></br>
      <MainCard title="Required Documents at the time of Shipping">
        <Grid fullWidth container sx={{ width: '100%' }}>
          <Grid fullWidth item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
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
                rows={rfqReqDoclist}
                columns={doc_table_column}
                onRowSelectionModelChange={(val) => {
                  return setSelectedDocids(
                    rfqReqDoclist?.filter((item) => {
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
                    id="doc_name"
                    label="Document Name"
                    sx={{
                      '& .MuiInputBase-input': {
                        // padding: '6px'
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
                      setRfqReqDoclist((val) => [...val, { id: rfqReqDoclist.length, req_doc_name: doc_name }]);
                      setDoc_name('');
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
      <Box display="flex" justifyContent="flex-end" mx={'20px'}>
        <Box display="flex" flexDirection={'row'} gap={'10px'} my={'10px'}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Issue RFQ
          </Button>
          <ConfirmForm isOpen={isDialogOpen} onClose={handleCloseDialog} onConfirm={() => handleSubmit()} type={'RFQ'} />
          {/* <Button variant="contained" onClick={() => handleSubmit()}>
            Submit
          </Button> */}
        </Box>
      </Box>
    </>
  );
};

export default RfqItemList;
