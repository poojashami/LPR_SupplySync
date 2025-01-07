import React, { useState } from 'react';
import {
  Grid,
  Paper,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';

const QuotationCompare = ({ compareMode, setCompareMode }) => {
  const [rateList, setRateList] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState({});
  const getQuotationsById = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/quotation/service/bysrfqid', {
        params: {
          service_rfq_id: id
        }
      });
      const mappedData = data?.map((item, index) => ({
        id: index + 1,
        service_quo_id: item.service_quo_id,
        service_quo_num: item.service_quo_num,
        po_id: item.po_id,
        service_rfq_id: item.service_rfq_id,
        vendor_id: item.vendor_id,
        amount: item.amount,
        remarks: item.remarks,
        status: item.status
      }));
      setRateList(mappedData);
    } catch (error) {
      toast.error(error.message);
    }
  };
  React.useEffect(() => {
    getQuotationsById(compareMode.rfq_num);
    getQuoteDetail();
  }, []);

  const cols = [
    {
      headerName: 'Quotation No.',
      field: 'quo_num',
      width: 150
    },
    {
      headerName: 'Vendor Name',
      field: 'ci_no',
      width: 150
    },
    {
      headerName: 'Quo Date',
      field: 'bl_no',
      width: 150
    },
    {
      headerName: 'Lead Time',
      field: 'clp_date',
      width: 150
    },
    {
      headerName: 'Quotation Amt',
      field: 'shipment_type',
      width: 150
    },
    // {
    //   headerName: 'Port of Loading',
    //   field: 'port_of_loading',
    //   width: 150
    // },
    // {
    //   headerName: 'Port of Discharge',
    //   field: 'port_of_discharge',
    //   width: 150
    // },
    // {
    //   headerName: 'BL verified by',
    //   field: 'bl_verified_by',
    //   width: 150
    // }
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const getQuoteDetail = async () => {
    try {
      const { data } = await axiosInstance.get('/api/quotation/service/bysrfqid', {
        params: {
          service_rfq_id: compareMode.rfq_num
        }
      });
      const mappedData = data?.map((item, index) => ({
        id: index + 1,
        amount: item?.amount,
        valid_to: item?.valid_to,
        valid_from: item?.valid_from,
        shipping_line: item?.shipping_line,
        from_port: item?.from_port,
        to_port: item?.to_port,
        vehicle_schedule_ets: item?.vehicle_schedule_ets,
        vehicle_schedule_ets2: item?.vehicle_schedule_ets2,
        vehicle_schedule_ets3: item?.vehicle_schedule_ets3,
        vehicle_schedule_eta: item?.vehicle_schedule_eta,
        vehicle_schedule_eta2: item?.vehicle_schedule_eta2,
        vehicle_schedule_eta3: item?.vehicle_schedule_eta3,
        currency: item?.currency,
        quote_date: item?.quote_date,
        container_type: item?.container_type,
        remarks: item?.remarks
      }));
      console.log(mappedData);
      setQuotes(mappedData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmQuote = async (id) => {
    try {
      const { data } = await axiosInstance.put(
        '/api/quotation/service/confirm',
        {},
        {
          params: {
            service_quo_id: id,
            service_rfq_id: compareMode.id
          }
        }
      );
      toast.success(data.message);
      setCompareMode(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <>
        <Grid container xs={12} sm={12} lg={12}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '30px !important'
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
            rows={[
              {
                id: 1
              }
            ]}
            columns={cols}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2.5}>
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
                <div style={{ fontWeight: 'bold' }}>Quotes Details</div>
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
                  <div style={{ flex: '1', fontWeight: 'bold' }}>Container Type:</div>
                  <div style={{ flex: '1', color: 'green' }}>40HC</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                  <div style={{ flex: '1', fontWeight: 'bold' }}>Currency.:</div>
                  <div style={{ flex: '1' }}>
                    <FormControl variant="standard" size="small">
                      <Select
                        // onChange={(e) => setCurrency(e.target.value)}
                        size="small"
                        labelId="Currency-label"
                        id="Currency"
                        value={'USD'}
                        label="Currency"
                        style={{ textTransform: 'uppercase' }}
                      >
                        {/* {Object.keys(rates).map((cur, index) => ( */}
                        <MenuItem value={'USD'} style={{ textTransform: 'uppercase' }}>
                          USD
                        </MenuItem>
                        {/* ))} */}
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
                  marginTop: '7px'
                }}
              >
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    // '& .MuiDataGrid-cell': {
                    //   border: '1px solid rgba(224, 224, 224, 1)',
                    //   display: 'flex',
                    //   justifyContent: 'center',
                    //   alignItems: 'center'
                    // },
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
                  rows={[
                    { id: 1, list: 'Quote Date' },
                    { id: 2, list: 'Party' },
                    { id: 3, list: 'Shipping Line' },
                    { id: 4, list: 'Amount' },
                    { id: 5, list: 'ETS - ETA - Transit Time' },
                    { id: 6, list: 'ETS1 - ETA1 - Transit Time' },
                    { id: 7, list: 'ETS2 - ETA2 - Transit Time' },
                    { id: 8, list: 'Remarks' }
                  ]}
                  columns={[{ headerName: 'List', field: 'list', width: 220 }]}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <div style={{ minWidth: 'auto', display: 'flex' }}>
              {rateList.map((quotation, index) => (
                <Paper
                  key={index}
                  style={{
                    padding: 5,
                    background: index % 2 === 0 ? '#ede7f6' : '#e3f2fd',
                    minWidth: '250px',
                    marginRight: '16px',
                    height: '320px'
                  }}
                >
                  <Typography
                    gutterBottom
                    style={{
                      marginBottom: '1px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                      // fontSize: '12px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>Vendor Details</div>
                    <div style={{ cursor: 'pointer' }}>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setOpen(true);

                          setSelectedQuote({
                            service_quo_id: quotation.service_quo_id
                          });
                          // confirmQuote(quotation.service_quo_id);
                        }}
                      >
                        <DoneAllIcon color="primary" />
                      </IconButton>
                    </div>
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}>PO No.:</div>
                    <div style={{ flex: '1', color: 'red' }}>{quotation.po_id}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}>Vendor ID:</div>
                    <div style={{ flex: '1' }}>{quotation.vendor_id}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}>Amount:</div>
                    <div style={{ flex: '1' }}>{quotation.amount}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}> Vendor Name:</div>
                    <div style={{ flex: '1' }}>{quotation.vendor_name}</div>
                  </div>
                  {console.log(quotes[index]?.shipping_line)}
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      // '& .MuiDataGrid-cell': {
                      //   border: '1px solid rgba(224, 224, 224, 1)',
                      //   display: 'flex',
                      //   justifyContent: 'center',
                      //   alignItems: 'center'
                      // },
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
                    rows={[
                      { id: 1, list: quotes[index]?.quote_date },
                      { id: 2, list: 'ABC logistics' },
                      { id: 3, list: quotes[index]?.shipping_line },
                      { id: 4, list: quotes[index]?.amount },
                      {
                        id: 5,
                        list: `${quotes[index]?.vehicle_schedule_ets} | ${quotes[index]?.vehicle_schedule_eta} (${(new Date(quotes[index]?.vehicle_schedule_ets).getTime() - new Date(quotes[index]?.vehicle_schedule_eta).getTime()) / (1000 * 60 * 60 * 24)} Days)`
                      },
                      {
                        id: 6,
                        list: `${quotes[index]?.vehicle_schedule_ets2} | ${quotes[index]?.vehicle_schedule_eta2} (${(new Date(quotes[index]?.vehicle_schedule_ets2).getTime() - new Date(quotes[index]?.vehicle_schedule_eta2).getTime()) / (1000 * 60 * 60 * 24)} Days)`
                      },
                      {
                        id: 7,
                        list: `${quotes[index]?.vehicle_schedule_ets3} | ${quotes[index]?.vehicle_schedule_eta3} (${(new Date(quotes[index]?.vehicle_schedule_ets3).getTime() - new Date(quotes[index]?.vehicle_schedule_eta3).getTime()) / (1000 * 60 * 60 * 24)} Days)`
                      },
                      { id: 8, list: quotes[index]?.remarks }
                    ]}
                    columns={[{ headerName: 'List Item', field: 'list', width: 250 }]}
                    hideFooter
                    hideFooterPagination
                    hideFooterSelectedRowCount
                  />
                </Paper>
              ))}
            </div>
          </Grid>
        </Grid>
      </>
      {/* <div
        style={{
          height: 'auto',
          width: '100%',
          overflowY: 'auto',
          marginTop: '120px'
        }}
      >
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
          rows={[
            {
              id: 1,
              vendor: 'VENDOR911X3D',
              document_name: 'Quotation for Containers DEL to NIG',
              file_name: 'doc90Xc_2024-08-20'
            }
          ]}
          columns={[
            {
              headerName: 'Sl.No',
              field: 'id',
              width: 80
            },
            {
              headerName: 'Vendor',
              field: 'vendor',
              width: 120
            },
            {
              headerName: 'Document Name',
              field: 'document_name',
              width: 300
            },
            {
              headerName: 'File Name',
              field: 'file_name',
              width: 120,
              renderCell: (params) => <span style={{ color: 'blue' }}>{params.value}</span>
            },
            {
              headerName: 'Action',
              width: 80
            }
          ]}
        />
      </div> */}
      <Dialog open={open} onClose={handleClose} aria-labelledby={'confirm_service_quote'}>
        <DialogTitle id={'confirm_service_quote'}>
          You have selected the Quotation No. <span style={{ color: 'red' }}>{selectedQuote?.service_quo_id}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Do you accept this quotation ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuotationCompare;
