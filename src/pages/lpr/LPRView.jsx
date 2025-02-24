import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton
}
  from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const LPRView = () => {
  const formValues = useSelector((state) => state.lpr.formValues);
  const [showTableHeading, setShowTableHeading] = React.useState({
    viewLPR: true,
    lprForm: true,
    approvedlpr: true,
    heading3: true,
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
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
    { label: 'LPR No', value: formValues.lpr_num }, 
    { label: 'LPR Date', value: formValues.lprDate },
    { label: 'Vertical', value: formValues.vertical },
    { label: 'Company', value: formValues.company },
    { label: 'Division', value: formValues.division },
    { label: 'Requested By Department', value: formValues.requestedByDept },
    { label: 'Requested By', value: formValues.requestedBy },
    { label: 'Quotations Email Alert', value: formValues.quotationEmailAlert },
    { label: 'No. Min Quotation', value: formValues.noMinQuote },
    { label: 'LPR Category', value: formValues.lprCategory },
    { label: 'Delivery Type', value: formValues.deliveryType },
    { label: 'Delivery Time', value: formValues.deliveryTime },
    { label: 'Additional Remarks', value: formValues.additionalRemarks },
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

  // Rest of the component remains unchanged
  // ...
};

export default LPRView;