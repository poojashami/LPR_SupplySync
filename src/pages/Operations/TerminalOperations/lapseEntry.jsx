import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import { TableHead, IconButton, Table, TableRow, TableCell, TableBody, Typography, Box, Button, TextField, Link } from '@mui/material';
import {
  TableHead,
  IconButton,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Sample data
const data = {
  supplierName: 'Supplier Name',
  ciNo: 'CI number',
  ciDate: 'CI date',
  blNo: 'BL number',
  blDate: 'BL date'
};

const TerminalLapseEntry = () => {
  const [terminalExpenseDetailData, setTerminalExpenseDetailData] = useState([
    {
      id: 1,
      terminal: '',
      invoice_no: '',
      invoice_date: '',
      amount: '',
      vat: '',
      total: '',
      narration: '',
      documents: null
    }
  ]);

  const handleInputChange = (e, id, field) => {
    const { value } = e.target;
    setTerminalExpenseDetailData((prevData) => prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = () => {
    // Here you can handle the submission logic
    console.log('Submitted Data:', terminalExpenseDetailData);
    setTerminalExpenseDetailData([]);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      width: 80
    },
    {
      field: 'terminal',
      headerName: 'Lapse Type',
      width: 200,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select value={params.row.terminal} onChange={(e) => handleInputChange(e, params.row.id, 'terminal')} displayEmpty>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="type1">Type 1</MenuItem>
            <MenuItem value="type2">Type 2</MenuItem>
            <MenuItem value="type3">Type 3</MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      field: 'invoice_no',
      headerName: 'Amount',
      width: 200,
      renderCell: (params) => (
        <TextField
          value={params.row.invoice_no}
          onChange={(e) => handleInputChange(e, params.row.id, 'invoice_no')}
          fullWidth
          size="small"
          sx={{ height: '36px' }}
        />
      )
    },
    {
      field: 'invoice_date',
      headerName: 'Narration',
      width: 200,
      renderCell: (params) => (
        <TextField
          value={params.row.invoice_date}
          onChange={(e) => handleInputChange(e, params.row.id, 'invoice_date')}
          fullWidth
          size="small"
          sx={{ height: '36px' }}
        />
      )
    },
    {
      field: 'documents',
      headerName: 'Documents',
      width: 200,
      renderCell: () => (
        <IconButton>
          <UploadFileIcon />
        </IconButton>
      )
    }
  ];

  return (
    <>
      {/* Lapse entry Header */}
      <Table style={{ padding: '2vh' }}>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Supplier Name:
              </Typography>
            </TableCell>
            <TableCell>{data.supplierName}</TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                CI No:
              </Typography>
            </TableCell>
            <TableCell>{data.ciNo}</TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                CI Date:
              </Typography>
            </TableCell>
            <TableCell>{data.ciDate}</TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                BL No:
              </Typography>
            </TableCell>
            <TableCell>{data.blNo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                BL Date:
              </Typography>
            </TableCell>
            <TableCell>{data.blDate}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box sx={{ height: 'auto', width: '100%', bgcolor: '#e3e8e5', mt: 0 }}>
        <Typography variant="subtitle1" fontWeight={500}>
          Add Lapse
        </Typography>
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
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TerminalLapseEntry;
