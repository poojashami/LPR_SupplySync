import { Box, Grid, Typography } from '@mui/material';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomParagraphLight from 'components/CustomParagraphLight';
import React from 'react';

const LpoAmountBackup = () => {
  const quotationAmountBreakup = [
    { label: 'Product Cost', value: '2236700 INR' },
    { label: 'Additional Charges', value: '700 INR' },
    { label: 'Transportation Charges', value: '12000 INR' },
    { label: 'Quotation Amount', value: '2249400 INR' }
  ];
  return (
    <Box padding={1}>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <CustomParagraphDark>
            Item Cost:
            <br />
            <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
          </CustomParagraphDark>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphLight>1000</CustomParagraphLight>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphDark>
            Addition Ch:
            <br />
            <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
          </CustomParagraphDark>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphLight>1000</CustomParagraphLight>
        </Grid>
        <Grid item xs={1.3}>
          <CustomParagraphDark>
            Transportation Ch:
            <br />
            <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
          </CustomParagraphDark>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphLight>1000</CustomParagraphLight>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphDark>Total VAT:</CustomParagraphDark>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphLight>1000</CustomParagraphLight>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphDark>
            Quotation Amt.:
            <br />
            <span style={{ fontSize: '9px' }}>(Ex. VAT)</span>
          </CustomParagraphDark>
        </Grid>
        <Grid item xs={1}>
          <CustomParagraphLight>1000</CustomParagraphLight>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LpoAmountBackup;
