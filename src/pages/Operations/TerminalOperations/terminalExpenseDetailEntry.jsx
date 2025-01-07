import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, Button, TextField } from '@mui/material';
import { Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const ContainerDetailsTable = () => {
  const [terminalExpenseDetailData, setTerminalExpenseDetailData] = useState([
    {
      id: 1,
      terminal: '',
      invoice_no: '',
      invoice_date: dayjs(),
      amount: '',
      vat: '',
      total: '',
      narration: '',
      document: null
    }
  ]);

  const [containerDetailData, setContainerDetailData] = useState([
    {
      id: 1,
      container_id: 1,
      sr_no: 1,
      container_num: '',
      type: '',
      arrival_date: dayjs(),
      discharge_date: dayjs(),
      transfer_date: dayjs(),
      fixed_amount: '',
      storage_amount: '',
      from_date: dayjs(),
      to_date: dayjs()
    }
  ]);

  const [submittedData, setSubmittedData] = useState([]);
  const FileUploadCell = ({ id, api, field }) => {
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        api.setEditCellValue({ id, field, value: file.name });
        console.log('File selected:', file);
      }
    };

    return (
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onChange={handleFileChange}
      >
        Upload file
        <VisuallyHiddenInput type="file" />
      </Button>
    );
  };
  const handleInputChange = (e, id, field) => {
    const { value } = e.target;
    setTerminalExpenseDetailData((prevData) => prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleInputChangeContainer = (e, id, field) => {
    const { value } = e.target;
    setContainerDetailData((prevData) => prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleGetAll = async () => {
    try {
      const { data } = await axiosInstance.get('/api/shipping/expenses', {
        params: {
          shipping_id: 5
        }
      });
      const { data: container_data } = await axiosInstance.get('/api/container/container_by_ship_id', {
        params: {
          shipping_id: 5
        }
      });
      const mappedContainerData = container_data.map((item, index) => ({
        id: index + 1,
        container_id: item.container_id,
        container_num: item.container_num,
        type: item.type,
        arrival_date: dayjs(item.arrival_date),
        discharge_date: dayjs(item.discharge_date),
        transfer_date: dayjs(item.transfer_date),
        fixed_amount: item.fixed_amount,
        storage_amount: item.storage_amount,
        from_date: dayjs(item.from_date),
        to_date: dayjs(item.to_date)
      }));
      setContainerDetailData(mappedContainerData);
      const mappedData = data.map((item, index) => ({
        ...item,
        id: index + 1,
        terminal: 'Terminal',
        invoice_no: item.invoice_no,
        invoice_date: dayjs(),
        amount: item.amount,
        vat: item.vat,
        total: item.total,
        narration: item.narration,
        document: null
      }));
      setSubmittedData(mappedData);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    handleGetAll();
  }, []);

  const handleSubmit = async () => {
    try {
      const { data } = await axiosInstance.post('/api/shipping/expenses', {
        ...terminalExpenseDetailData[0],
        shipping_id: 5,
        expenses_type: 'Terminal'
      });
      toast.success(data?.message);
    } catch (error) {
      toast.error(error.message);
    }
    setSubmittedData((prevData) => [...prevData, ...terminalExpenseDetailData]);
    setTerminalExpenseDetailData([]);
  };

  const handleSubmitContainer = async () => {
    const { data } = await axiosInstance.put('/api/container/addexpenses', { container_expenses: containerDetailData });
    console.log(data);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'terminal',
      headerName: 'Terminal *',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.terminal}
          onChange={(e) => handleInputChange(e, params.row.id, 'terminal')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice No *',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.invoice_no}
          onChange={(e) => handleInputChange(e, params.row.id, 'invoice_no')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'invoice_date',
      headerName: 'Invoice Date *',
      width: 150,
      renderCell: (params) => (
        <DatePicker
          value={params.row.invoice_date}
          onChange={(date) => handleInputChange({ target: { value: date } }, params.row.id, 'invoice_date')}
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'amount',
      headerName: 'Amount *',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.amount}
          onChange={(e) => handleInputChange(e, params.row.id, 'amount')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'vat',
      headerName: 'VAT *',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.vat}
          onChange={(e) => handleInputChange(e, params.row.id, 'vat')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.total}
          onChange={(e) => handleInputChange(e, params.row.id, 'total')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'narration',
      headerName: 'Narration *',
      width: 200,
      renderCell: (params) => (
        <TextField
          value={params.row.narration}
          onChange={(e) => handleInputChange(e, params.row.id, 'narration')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'document',
      headerName: 'Documents',
      width: 150,
      renderCell: () => <FileUploadCell />
    }
  ];

  const containerDetailcolumns = [
    {
      field: 'id',
      headerName: 'Sr. No',
      width: 80
    },
    {
      field: 'container_num',
      headerName: 'Container No',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.container_num}
          onChange={(e) => handleInputChangeContainer(e, params.row.id, 'container_num')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'type',
      headerName: 'Type *',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.type}
          onChange={(e) => handleInputChangeContainer(e, params.row.id, 'type')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'arrival_date',
      headerName: 'Arrival Date',
      width: 150,
      renderCell: (params) => (
        <DatePicker
          value={params.row.arrival_date}
          onChange={(date) => handleInputChangeContainer({ target: { value: date } }, params.row.id, 'arrival_date')}
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'discharge_date',
      headerName: 'Discharge Date',
      width: 150,
      renderCell: (params) => (
        <DatePicker
          value={params.row.discharge_date}
          onChange={(date) => handleInputChangeContainer({ target: { value: date } }, params.row.id, 'discharge_date')}
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'transfer_date',
      headerName: 'Transfer Date',
      width: 150,
      renderCell: (params) => (
        <DatePicker
          value={params.row.transfer_date}
          onChange={(date) => handleInputChangeContainer({ target: { value: date } }, params.row.id, 'transfer_date')}
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'fixed_amount',
      headerName: 'Fixed Amount',
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.fixed_amount}
          onChange={(e) => handleInputChangeContainer(e, params.row.id, 'fixed_amount')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'storage_amount',
      headerName: 'Storage Amount',
      width: 200,
      renderCell: (params) => (
        <TextField
          value={params.row.storage_amount}
          onChange={(e) => handleInputChangeContainer(e, params.row.id, 'storage_amount')}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'from_date',
      headerName: 'From Date',
      width: 150,
      renderCell: (params) => (
        <DatePicker
          value={params.row.from_date}
          onChange={(date) => handleInputChangeContainer({ target: { value: date } }, params.row.id, 'from_date')}
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    },
    {
      field: 'to_date',
      headerName: 'To Date',
      width: 150,
      renderCell: (params) => (
        <DatePicker
          value={params.row.to_date}
          onChange={(date) => handleInputChangeContainer({ target: { value: date } }, params.row.id, 'to_date')}
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%',
            marginTop: '10px'
          }}
        />
      )
    }
  ];

  const showDetailColumn = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'terminal', headerName: 'Terminal *', width: 150 },
    { field: 'invoice_no', headerName: 'Invoice No *', width: 150 },
    { field: 'invoice_date', headerName: 'Invoice Date *', width: 150 },
    { field: 'amount', headerName: 'Amount *', width: 150 },
    { field: 'vat', headerName: 'VAT *', width: 150 },
    { field: 'total', headerName: 'Total', width: 150 },
    { field: 'narration', headerName: 'Narration *', width: 200 },
    {
      field: 'document',
      headerName: 'Documents',
      width: 150,
      renderCell: () => <Link component="button">View Docs</Link>
    }
  ];

  return (
    <>
      <Box sx={{ height: 'auto', width: '100%', bgcolor: '#e3e8e5', mt: 0 }}>
        <Box sx={{ height: 'auto', width: '100%', bgcolor: '#e3e8e5', mt: 0 }}>
          <Typography variant="subtitle1" fontWeight={500}>
            Add New Terminal Expense <span style={{ color: 'red' }}> - Provisional</span>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 'auto', width: '100%' }}>
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
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          columns={columns}
          rows={terminalExpenseDetailData}
          hideFooter
          autoHeight
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 2
          }}
        >
          {/* <Button variant="outlined" color="secondary" onClick={handleAddRow} startIcon={<AddIcon />} sx={{ marginRight: 2 }}>
            Add
          </Button> */}
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 'auto', width: '100%', bgcolor: '#e3e8e5', mt: 4 }}>
        <Typography variant="h5" fontWeight={500}>
          Container Details
        </Typography>
      </Box>

      <Box sx={{ height: 'auto', width: '100%', mt: 1 }}>
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
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          columns={containerDetailcolumns}
          rows={containerDetailData}
          hideFooter
          autoHeight
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 2
          }}
        >
          {/* <Button variant="outlined" color="secondary" onClick={handleAddRow} startIcon={<AddIcon />} sx={{ marginRight: 2 }}>
            Add
          </Button> */}
          <Button variant="contained" onClick={handleSubmitContainer}>
            Submit
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 'auto', width: '100%', bgcolor: '#e3e8e5', mt: 4 }}>
        <Typography variant="h5" fontWeight={500}>
          Expense Details
        </Typography>
      </Box>

      <Box sx={{ height: 'auto', width: '100%', mt: 1 }}>
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
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          columns={showDetailColumn}
          rows={submittedData}
          hideFooter
          autoHeight
        />
      </Box>
    </>
  );
};

export default ContainerDetailsTable;
