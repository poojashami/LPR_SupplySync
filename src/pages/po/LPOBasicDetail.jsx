import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const LPOBasicDetail = () => {
  const lpoData = [
    { label: 'Quotation No.', value: 'OPR-56789' },
    { label: 'Quotation Dt.', value: 'OPR-56789' },
    { label: 'Quote Ref. No.', value: 'LPR1234' },
    { label: 'RFQ No.', value: 'OPR-56789' },

    { label: 'LPR No', value: 'OPR-56789' },
    { label: 'Quotation Currency', value: 'USD' },
    { label: 'Delivery Term', value: 'FOB (Free on Board)' },
    { label: 'Payment Term', value: 'Net 30 Days' },
    { label: 'Vendor Lead Time', value: '4 Weeks' },
    { label: 'Delivery Address', value: '123 Tech Street, Electronics City, CA' },
    { label: 'Quotation Remarks', value: 'Prices valid for 60 days' }
  ];
  return (
    <div>
      <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
        <Grid container spacing={2}>
          {lpoData
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
    </div>
  );
};

export default LPOBasicDetail;
