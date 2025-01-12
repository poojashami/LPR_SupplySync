import { Box, Typography, IconButton, Grid, Table, TableRow, TableHead, TableCell } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import VendorList from './VendorList';
import AdditionalInformationView from './AdditionalInformationView';
import ItemList from './ItemList';

const QuoteView = ({ selectedRFQ, onBack }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqDetail: true,
    quotedetail: true,
    itemList: true
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
    { label: 'RFQ Num', value: 'Tech Corp' },
    { label: 'Port of Destination', value: 'LPR1234' },
    { label: 'Respond Time(Days)', value: '+1 123-456-7890' },
    { label: 'Delivery_time', value: 'example@techcorp.com' },
    { label: 'Created On', value: '123 Tech Street, North Division, Electronics City' },
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];

  return (
    <MainCard title={`View RFQ No. (${selectedRFQ})`} onBack={onBack}>
      <Table>{renderTableHeader('rfqDetail', 'RFQ Details')}</Table>
      {showTableHeading.rfqDetail && (
        <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            {shipmentData.map((item, index) => (
              <Grid item xs={3} key={index}>
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
        </Grid>
      )}
      <Table>{renderTableHeader('quotedetail', 'Vendor Details')}</Table>
      {showTableHeading.quotedetail && <VendorList />}
      <AdditionalInformationView />
      <Table sx={{ paddingTop: '20px' }}>{renderTableHeader('itemList', 'Item Details')}</Table>
      {showTableHeading.itemList && <ItemList />}
    </MainCard>
  );
};

export default QuoteView;
