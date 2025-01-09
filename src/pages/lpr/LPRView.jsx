import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import LPRApprove from './LPRApprove';
const LPRView = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    approvedlpr: true,
    heading3: true
  });
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
  const shipmentData = [
    { label: 'LPR No', value: 'LPR1234' },
    { label: 'Vertical', value: 'Engineering' },
    { label: 'Company', value: 'Tech Corp' },
    { label: 'Division', value: 'North Division' },
    { label: 'LPR Category', value: 'Electronics' },
    { label: 'Shipment Mode', value: 'Air' },
    { label: 'Buying Through', value: 'Direct Purchase' },
    { label: 'OPR Category', value: '5 days' },
    { label: 'Delivery Time', value: '10 days' },
    { label: 'Requested By Department', value: 'Procurement' },
    { label: 'Requested By', value: 'John Doe' },
    { label: 'Date', value: '2024-10-09' },
    { label: 'Additional Remarks', value: 'Urgent shipment required' }
  ];

  return (
    <Box>
      <Table>{renderTableHeader('viewLPR', 'View LPR')}</Table>
      {showTableHeading.viewLPR && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {shipmentData
              .reduce((acc, item, index) => {
                // Create a new array if the index is a multiple of 3
                if (index % 4 === 0) acc.push([]);
                // Push the current item to the last sub-array
                acc[acc.length - 1].push(item);
                return acc;
              }, [])
              .map((row, rowIndex) => (
                <Grid container item xs={12} key={rowIndex} spacing={2}>
                  {row.map((item, itemIndex) => (
                    <Grid item xs={3} key={itemIndex}>
                      {' '}
                      {/* Each item takes 4/12 of the row */}
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
          </Grid>
        </Grid>
      )}

      {/* <LPRApprove /> */}
    </Box>
  );
};

export default LPRView;
