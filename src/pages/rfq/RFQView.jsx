import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const RFQView = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqView: true,
    lprForm: true,
    heading2: true,
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
    { label: 'Company Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  return (
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
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RFQView;
