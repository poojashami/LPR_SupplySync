import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import CardDetails from './CardDetails';

const CustomNoRowsOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}
  >
    <Typography variant="h6" color="textSecondary">
      No Record Found
    </Typography>
  </Box>
);

const CardTable = () => {
  const [show, setShow] = useState(false);
  if (!show)
    return (
      <MainCard
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <p>Ready to close card</p>
          </Box>
        }
      >
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Doc No.</TableCell>
                <TableCell align="left">
                  <TextField
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '7px'
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="left">Date Range</TableCell>
                <TableCell align="left" sx={{ display: 'flex', gap: '12px' }}>
                  {' '}
                  <DatePicker value={dayjs()} />
                  <DatePicker value={dayjs()} />
                  <Button variant="contained" color="primary">
                    Search Card
                  </Button>
                  <Button onClick={() => setShow(true)} variant="contained" color="secondary">
                    Reset
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
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
          slots={{
            noRowsOverlay: CustomNoRowsOverlay
          }}
          sx={{ height: '200px' }}
          rows={[]}
          columns={[{ headerName: 'SL No.', field: 'id' }]}
        />
      </MainCard>
    );
  else return <CardDetails />;
};

export default CardTable;
