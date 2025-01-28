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
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600}>
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
    { label: 'LPR No', value: 'LPR001JBJKKJ878' },
    { label: 'LPR Date', value: '2024-10-09' },
    { label: 'Vertical', value: 'Engineering' },
    { label: 'Company', value: 'Tech Corp' },
    { label: 'Division', value: 'North Division' },
    { label: 'Requested By Department', value: 'Procurement' },
    { label: 'Requested By', value: 'John Doe' },
    { label: ' Quotations Email Alert', value: 'Air' },
    { label: 'No. Min Quotation', value: '3' },
    { label: 'LPR Category', value: 'Electronics' },
    { label: 'Buying Through', value: 'Direct Purchase' },
    { label: 'OPR Category', value: '5 days' },
    { label: ' Delivery Type', value: '5 days' },
    { label: 'Delivery Time', value: '10 days' },
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
                if (index % 4 === 0) acc.push([]);
                acc[acc.length - 1].push(item);
                return acc;
              }, [])
              .map((row, rowIndex) => (
                <Grid container item xs={12} key={rowIndex} spacing={2}>
                  {row.map((item, itemIndex) => (
                    <Grid item xs={3} key={itemIndex}>
                      {' '}
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '600', fontSize: '11px', color: '#333' }}>
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
    </Box>
  );
};

export default LPRView;
