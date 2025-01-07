import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { MenuItem, Select, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import PlusButton from 'components/CustomButton';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import ValidationStar from 'components/ValidationStar';
import CustomTypography from 'components/CustomTypography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button } from '@mui/material';

export default function NimashaSeaProtection() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      expense: 'Sea Protection Levy',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: ''
    }
  ]);
  const [last_rows] = useState([
    {
      expense: 'Subtotal',
      unit: '',
      rate_usd: '',
      amount_ngn: '',
      remark: '',
      fontWeight: 'normal'
    },
    {
      expense: 'VAT',
      unit: '',
      rate_usd: '',
      amount_ngn: '',
      remark: '',
      fontWeight: 'normal'
    },
    {
      expense: 'Total Amount Before Adjustment',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: '',
      fontWeight: 'bold'
    },
    {
      expense: 'Less - Discount (if Any)',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: '',
      fontWeight: 'normal'
    },
    {
      expense: 'Less - Amount Adjusted',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: '',
      fontWeight: 'normal'
    },
    {
      expense: 'Total Amount After Discount/Adjustment',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: '',
      fontWeight: 'bold'
    }
  ]);
  const [initialValuesInvoice, setInitialValuesInvoice] = useState({
    vessel_name: '',
    vessel_grt: '',
    vessel_length: '',
    vessel_qty_to_discharge: '',
    bill_no: '',
    bill_date: null,
    amount: 0,
    vat: 0,
    total: 0,
    remark: '',
    exchange_rate: ''
  });
  const [formValuesInvoice, setFormValuesInvoice] = useState(initialValuesInvoice);
  const [initialValuesPayment, setInitialValuesPayment] = useState({
    payment_done_by: '',
    payment_date: '',
    payment_amount: '',
    paid_through_bank: '',
    ref_no: ''
  });
  const [formValuesPayment, setFormValuesPayment] = useState(initialValuesPayment);

  const [showTableHeading, setShowTableHeading] = useState({
    invoiceDetail: true,
    expenseInformation: true,
    paymentInformation: true
  });

  const [sadFile, setSadFile] = useState(null);
  const navigate = useNavigate();

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
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
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

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file only.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleClick = (id) => {
    document.getElementById(id).click();
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    // Validation for required fields
    const requiredFields = [
      'vessel_name',
      'vessel_grt',
      'vessel_length',
      'vessel_qty_to_discharge',
      'bill_no',
      'bill_date',
      'amount',
      'vat',
      'total',
      'remark',
      'exchange_rate'
    ];
    const missingFields = requiredFields.filter((field) => !formValuesInvoice[field]);

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Log data for submission
    console.log('Submit Data Successfully');
    console.log('Submit data', formValuesInvoice);

    // You can now send formValuesInvoice to an API
    // Example:
    // axios.post('/api/endpoint', formValuesInvoice)
    //   .then(response => console.log('Response:', response))
    //   .catch(error => console.error('Error:', error));
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formValuesPayment.payment_done_by) {
      errors.payment_done_by = 'Payment Done By is required';
    }
    if (formValuesPayment.payment_done_by === 'Agent') {
      if (!formValuesPayment.payment_date) {
        errors.payment_date = 'Payment Date is required';
      }
      if (!formValuesPayment.payment_amount) {
        errors.payment_amount = 'Payment Amount is required';
      }
      if (!formValuesPayment.paid_through_bank) {
        errors.paid_through_bank = 'Paid Through Bank is required';
      }
      if (!formValuesPayment.ref_no) {
        errors.ref_no = 'Ref No is required';
      }
    }
    if (Object.keys(errors).length > 0) {
      alert('Please fill all required fields');
      console.error(errors);
      return;
    }
    console.log('Submit Payment Successfully');
    console.log('submit payment', formValuesPayment);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'SR.No.',
      width: 70
    },
    {
      field: 'expense',
      headerName: 'Expense',
      flex: 1,
      editable: true,
      renderCell: (params) => <span style={{ fontWeight: params.row.fontWeight }}>{params.value}</span>
    },
    {
      field: 'unit',
      headerName: 'Qty',
      width: 100,
      editable: true
    },
    {
      field: 'rate_usd',
      headerName: 'Rate (USD)',
      type: 'number',
      width: 120,
      editable: true
    },
    {
      field: 'amount_usd',
      headerName: 'Amount (USD)',
      type: 'number',
      width: 120,
      editable: true
    },
    {
      field: 'amount_ngn',
      headerName: 'Amount (NGN)',
      type: 'number',
      flex: 1,
      width: 120,
      editable: true
    },
    {
      field: 'remark',
      headerName: 'Remark',
      width: 200,
      editable: true
    }
  ];

  const columnGroupingModel = [
    {
      groupId: 'Provisional',
      children: [{ field: 'unit' }, { field: 'rate_usd' }, { field: 'amount_usd' }, { field: 'amount_ngn' }, { field: 'remark' }]
    }
  ];
  const handleAddRow = () => {
    const newId = expenses.length > 0 ? Math.max(...expenses.map((expense) => expense.id)) + 1 : 1;

    const newRow = {
      id: newId,
      expense: '',
      unit: '',
      rate_usd: '',
      amount_usd: '',
      amount_ngn: '',
      remark: ''
    };

    setExpenses((prevExpenses) => {
      return [...prevExpenses, newRow];
    });
  };
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    console.log(id, field, value);

    setExpenses((prevExpenses) => {
      return prevExpenses.map((row) => (row.id === id ? { ...row, [field]: value } : row));
    });
  };
  const handleRowUpdate = (newRow) => {
    console.log('Row update triggered');
    console.log('Updated Row:', newRow);

    setExpenses((prevExpenses) => {
      return prevExpenses.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row));
    });

    return newRow;
  };
  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Bulk Nimasa Sea Protection Levy Expense Detail
          <PlusButton
            label="Back"
            onClick={() => {
              setShowShippingExpense(!showShippingExpense);
              navigate('/operations/shipping');
            }}
          />
        </Box>
      }
    >
      <Box component="form" paddingLeft={1} onSubmit={handleSubmitForm}>
        <>
          <Table>
            {renderTableHeader('invoiceDetail', 'Invoice Details')}
            {showTableHeading.invoiceDetail && (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Vessel Name</CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="vessel_name"
                    variant="outlined"
                    name="vessel_name"
                    value={formValuesInvoice?.vessel_name}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Vessel GRT</CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="vessel_grt"
                    variant="outlined"
                    name="vessel_grt"
                    value={formValuesInvoice?.vessel_grt}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Vessel Length</CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="vessel_length"
                    variant="outlined"
                    name="vessel_length"
                    value={formValuesInvoice?.vessel_length}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">Vessel Qty to Discharge</CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="vessel_qty_to_discharge"
                    variant="outlined"
                    name="vessel_qty_to_discharge"
                    value={formValuesInvoice?.vessel_qty_to_discharge}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Bill No <ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="bill_no"
                    variant="outlined"
                    name="bill_no"
                    value={formValuesInvoice?.bill_no}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Bill Date<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <DatePicker
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    value={formValuesInvoice.bill_date ? dayjs(formValuesInvoice.bill_date) : null}
                    onChange={(date) =>
                      setFormValuesInvoice({
                        ...formValuesInvoice,
                        ['bill_date']: date
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Amount<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="amount"
                    variant="outlined"
                    name="amount"
                    value={formValuesInvoice?.amount}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    VAT<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="vat"
                    variant="outlined"
                    name="vat"
                    value={formValuesInvoice?.vat}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Total<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="total"
                    variant="outlined"
                    name="total"
                    value={formValuesInvoice?.total}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Remark<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="remark"
                    variant="outlined"
                    name="remark"
                    value={formValuesInvoice?.remark}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Exchange Rate<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    id="exchange_rate"
                    variant="outlined"
                    name="exchange_rate"
                    value={formValuesInvoice?.exchange_rate}
                    onChange={(e) => setFormValuesInvoice({ ...formValuesInvoice, [e.target.name]: e.target.value })}
                  />
                </Grid>
              </Grid>
            )}
          </Table>
        </>
        <Table sx={{ marginTop: 2 }}>{renderTableHeader('expenseInformation', 'Expense Information')}</Table>
        {showTableHeading.expenseInformation && (
          <Grid container spacing={2} display={'flex'} alignItems={'flex-end'}>
            <Grid item xs={12}>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'start'
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
                onCellEditCommit={handleCellEditCommit}
                processRowUpdate={handleRowUpdate}
                rows={[...expenses, ...last_rows]}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                columnGroupingModel={columnGroupingModel}
                getRowId={(row) => row.expense}
                hideFooter
                hideFooterPagination
                hideFooterSelectedRowCount
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleAddRow}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  Add Row
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={3}>
              <CustomTypography variant="body">
                SAD Document<ValidationStar>*</ValidationStar>
              </CustomTypography>
              <Grid
                item
                borderRadius="15px"
                style={{
                  border: '2px dashed #000',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onDrop={(e) => handleDrop(e, setSadFile)}
                onDragOver={handleDragOver}
                onClick={() => handleClick('sadFileInput')}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <CustomTypography variant="body1" style={{ marginBottom: '8px' }}>
                    <CloudUploadIcon style={{ fontSize: '50px', color: 'blue' }} />
                  </CustomTypography>
                  {sadFile ? (
                    sadFile.name
                  ) : (
                    <>
                      <label htmlFor="sadFileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                        Upload File
                      </label>
                      <input
                        type="file"
                        id="sadFileInput"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(e, setSadFile)}
                        accept=".pdf"
                      />
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
            {/* <Grid item xs={4}></Grid> */}
            <Grid item xs={4}></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button variant="contained" color="primary" size="small" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      <Grid sx={{ marginTop: 2 }}>
        <Box paddingLeft={1}>
          <Table>
            {renderTableHeader('paymentInformation', 'Payment Information')}
            {showTableHeading.paymentInformation && (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="body">
                    Payment Done By<ValidationStar>*</ValidationStar>
                  </CustomTypography>
                  <Select
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '2px'
                      },
                      width: '100%'
                    }}
                    fullWidth
                    value={formValuesPayment?.payment_done_by}
                    onChange={(e) => {
                      setFormValuesPayment({
                        ...formValuesPayment,
                        ['payment_done_by']: e.target.value
                      });
                    }}
                    defaultValue={0}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Client">Client</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                  </Select>
                </Grid>
                {formValuesPayment.payment_done_by === 'Agent' && (
                  <>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Payment Date<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <DatePicker
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '2px'
                          },
                          width: '100%'
                        }}
                        value={formValuesPayment.payment_date ? dayjs(formValuesPayment.payment_date) : null}
                        onChange={(date) =>
                          setFormValuesPayment({
                            ...formValuesPayment,
                            ['payment_date']: date
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Payment Amount<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <TextField
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '2px'
                          },
                          width: '100%'
                        }}
                        id="payment_amount"
                        variant="outlined"
                        name="payment_amount"
                        value={formValuesPayment?.payment_amount}
                        onChange={(e) =>
                          setFormValuesPayment({
                            ...formValuesPayment,
                            [e.target.name]: e.target.value
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Paid Through Bank<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <TextField
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '2px'
                          },
                          width: '100%'
                        }}
                        id="paid_through_bank"
                        variant="outlined"
                        name="paid_through_bank"
                        value={formValuesPayment?.paid_through_bank}
                        onChange={(e) =>
                          setFormValuesPayment({
                            ...formValuesPayment,
                            [e.target.name]: e.target.value
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTypography variant="body">
                        Ref No <ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <TextField
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '2px'
                          },
                          width: '100%'
                        }}
                        id="ref_no"
                        variant="outlined"
                        name="ref_no"
                        value={formValuesPayment?.ref_no}
                        onChange={(e) =>
                          setFormValuesPayment({
                            ...formValuesPayment,
                            [e.target.name]: e.target.value
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTypography variant="body">
                        Upload Payment Copy<ValidationStar>*</ValidationStar>
                      </CustomTypography>
                      <input type="file" style={{ display: 'block', marginTop: '8px' }} required />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display={'flex'} justifyContent={'end'} textAlign={'center'}>
                        <Button variant="contained" size="small" color="primary" type="btn" sx={{ mr: 2 }} onClick={handleSubmitPayment}>
                          Submit
                        </Button>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Table>
        </Box>
      </Grid>
    </MainCard>
  );
}
