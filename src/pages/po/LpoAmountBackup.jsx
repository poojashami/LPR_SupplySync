import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const LpoAmountBackup = () => {
  const quotationAmountBreakup = [
    { label: 'Product Cost', value: '2236700 INR' },
    { label: 'Additional Charges', value: '700 INR' },
    { label: 'Transportation Charges', value: '12000 INR' },
    { label: 'Quotation Amount', value: '2249400 INR' }
  ];
  return (
    <Box>
      <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
        <Grid container spacing={2}>
          {quotationAmountBreakup.map((item, index) => (
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
    </Box>
  );
};

export default LpoAmountBackup;
