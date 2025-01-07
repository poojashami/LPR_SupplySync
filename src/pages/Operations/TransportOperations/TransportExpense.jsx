import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, Select, MenuItem, Grid, TextField, Typography, Button, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import CustomNumberField from 'components/NoArrowTextField';
import dayjs from 'dayjs';

const TransportExpense = ({ setAddBillFormView, rowData, transportOperationsData }) => {
  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {' '}
            <p>Transport Expense Details</p>
            {/* <PlusButton label="Back" onClick={() => setAddBillFormView(false)} /> */}
          </Box>
        }
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Invoice Num:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>#PFI-202408-CI2</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  BL Num:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>05/05/2024</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Importer Name:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>05/05/2024</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Shipment Type:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>05/05/2024</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  No. of Container:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>05/05/2024</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Discharge Terminal:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>05/05/2024</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Transfer Terminal:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>05/05/2024</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TransportExpenseForm transportOperationsData={transportOperationsData} rowData={rowData} setAddBillFormView={setAddBillFormView} />
      </MainCard>
    </div>
  );
};

export default TransportExpense;

const TransportExpenseForm = ({ rowData, setAddBillFormView, transportOperationsData }) => {
  const initialValues = {
    payment_type: '',
    invoice_no: '',
    invoice_date: null,
    amount: '',
    vat: '',
    narration: ''
  };
  const [file, setFile] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [paymentType, setPaymentType] = useState([]);
  const [containers, setContainers] = useState([]);
  const [AddBillData, setAddBillData] = useState([]);

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    setContainers(containers.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const cols = [
    { headerName: 'Sr.No.', field: 'id', flex: 0.5, width: 50 },
    { headerName: 'Type of Container', field: 'type_of_container', flex: 1 },
    { headerName: 'No of Container', field: 'no_of_container', flex: 1 },
    { headerName: 'Rate', field: 'rate', flex: 1 },
    {
      headerName: 'Payment Type',
      field: 'payment_type',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: paymentType?.map((option) => option.name) || []
    },
    { headerName: 'Amount', field: 'amount', flex: 1, editable: true },
    { headerName: 'Paid amt', field: 'paid_amt', flex: 1, editable: true },
    { headerName: 'Payment Date', field: 'payment_date', flex: 1, editable: true, type: 'date' }
  ];

  useEffect(() => {
    if (rowData) {
      const data = rowData?.map((item, index) => ({
        id: index + 1,
        type_of_container: item?.type_of_container,
        no_of_container: item?.no_of_container_allocated,
        rate: item?.rate,
        payment_type: '',
        amount: '',
        paid_amt: '',
        payment_date: ''
      }));
      setContainers(data);
    }
  }, []);

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

  useEffect(() => {
    getPaymentType();
    getAddBill();
  }, []);

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

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const getPaymentType = async () => {
    try {
      // const response = await axiosInstance.get('/api/transport/payment/type');
      const lapseKey = transportOperationsData?.payment_terms?.split(',').map((data) => ({
        id: data,
        name: data
      }));
      setPaymentType(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const getAddBill = async () => {
    try {
      const { data } = await axiosInstance.get('/api/operation/container/allocation/add/bill', {
        params: {
          ci_id: transportOperationsData.ci_id
        }
      });
      setAddBillData(data);
      setFormValues(
        data && data?.length > 0
          ? {
              payment_type: data[0].payment_type,
              invoice_no: data[0].invoice_no,
              invoice_date: data[0].invoice_date,
              amount: data[0].amount,
              vat: data[0].vat,
              narration: data[0].narration,
              tdo_given_date: data[0].tdo_given_date,
              bank_name: data[0].bank_name,
              wht_deducted: data[0].wht_deducted,
              payment_amount: data[0].payment_amount,
              paid_from_bank: data[0].paid_from_bank,
              ref_number: data[0].ref_number,
              payment_date: data[0].payment_date
            }
          : initialValues
      );
      setContainers(
        data && data?.length > 0
          ? data[0]?.transport_add_bill_containers?.map((item, index) => ({
              id: index + 1,
              type_of_container: item.type_of_container,
              no_of_container: item.no_of_container,
              rate: item.rate,
              payment_type: item.payment_type,
              amount: item.amount,
              paid_amt: item.paid_amt,
              payment_date: ''
              // payment_date: dayjs(item.payment_date, 'MM/DD/YYYY')
            }))
          : rowData?.map((item, index) => ({
              id: index + 1,
              type_of_container: item?.type_of_container,
              no_of_container: item?.no_of_container_allocated,
              rate: item?.rate,
              payment_type: '',
              amount: '',
              paid_amt: '',
              payment_date: null
            }))
      );
    } catch (error) {
      console.error('Error fetching Add Biil Of Transport:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      bl_num: transportOperationsData.bl_awb_no,
      ci_id: transportOperationsData.ci_id,
      ci_num: transportOperationsData.ci_num,
      ...formValues,
      files: file,
      containers
    };
    try {
      console.log(data);
      const response = await axiosInstance.post('/api/operation/container/allocation/add/bill', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        toast.success('Form submitted successfully');
        setAddBillFormView(false);
      } else {
        console.error('Form submission failed:', response.status);
        toast.error('Error in Form submit');
      }
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  useEffect(() => {
    setFormValues({ ...formValues, total: Number(formValues?.vat) + Number(formValues?.amount) });
  }, [formValues]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ padding: '20px' }}>
        <Grid item xs={3}>
          <Typography variant="body1">Payment Type:</Typography>
          <Select
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            fullWidth
            value={formValues?.payment_type || ''}
            name="payment_type"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          >
            {paymentType.map((term) => (
              <MenuItem key={term.id} value={term.name}>
                {term.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Invoice No.:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            value={formValues?.invoice_no || ''}
            id="invoice_no"
            variant="outlined"
            name="invoice_no"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">Invoice Date:</Typography>
          <DatePicker
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            value={formValues.invoice_date ? dayjs(formValues.invoice_date) : null}
            onChange={(newDate) => {
              const formattedDate = dayjs(newDate).isValid() ? dayjs(newDate).format('YYYY-MM-DD') : '';
              setFormValues({ ...formValues, invoice_date: formattedDate });
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">Amount:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            value={formValues?.amount || ''}
            id="amount"
            variant="outlined"
            name="amount"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">VAT:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="vat"
            value={formValues?.vat || ''}
            variant="outlined"
            name="vat"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Total:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="total"
            variant="outlined"
            name="total"
            value={formValues?.total}
            // onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">TDO Given Date:</Typography>
          <DatePicker
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            value={formValues.tdo_given_date ? dayjs(formValues.tdo_given_date) : null}
            onChange={(newDate) => {
              const formattedDate = dayjs(newDate).isValid() ? dayjs(newDate).format('MM-DD-YYYY') : '';
              setFormValues({ ...formValues, tdo_given_date: formattedDate });
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1">Narration:</Typography>
          <TextField
            type="text"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            variant="outlined"
            name="narration"
            value={formValues?.narration}
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
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
            onClick={handleClick}
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
                    Transport Expense Document
                  </label>
                  <input
                    multiple
                    type="file"
                    id="fileInput"
                    name="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".pdf"
                  />
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
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
            },
            height: '200px'
          }}
          columns={cols}
          rows={containers}
          processRowUpdate={processRowUpdate}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </Grid>

      <Grid container spacing={2} sx={{ padding: '20px' }}>
        <Grid item xs={3}>
          <Typography variant="body1">Payment Date:</Typography>
          <DatePicker
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            value={formValues?.payment_date ? dayjs(formValues?.payment_date) : null}
            onChange={(newDate) => {
              const formattedDate = dayjs(newDate).isValid() ? dayjs(newDate).format('MM-DD-YYYY') : '';
              setFormValues({ ...formValues, payment_date: formattedDate });
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Reference Number:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="ref_number"
            variant="outlined"
            value={formValues?.ref_number}
            name="ref_number"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Payment Amount:</Typography>
          <CustomNumberField
            type="number"
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="payment_amount"
            variant="outlined"
            value={formValues?.payment_amount}
            name="payment_amount"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Paid From Bank:</Typography>
          <CustomNumberField
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="paid_from_bank"
            variant="outlined"
            value={formValues?.paid_from_bank}
            name="paid_from_bank"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">WHT Deducted:</Typography>
          <CustomNumberField
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="wht_deducted"
            variant="outlined"
            value={formValues?.wht_deducted}
            name="wht_deducted"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Bank Name:</Typography>
          <CustomNumberField
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              },
              width: '100%'
            }}
            id="bank_name"
            variant="outlined"
            value={formValues?.bank_name}
            name="bank_name"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
          Submit Transport Expense
        </Button>
      </Box>
    </Box>
  );
};
