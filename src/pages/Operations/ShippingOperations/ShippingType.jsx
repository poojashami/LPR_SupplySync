import React from 'react';
import { Button, Container, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';

const ShippingType = () => {
  const navigate = useNavigate();

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Shipping Component</span>
          {/* <PlusButton label="Back" onClick={handleBackToTable} /> */}
        </Box>
      }
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => navigate('/expense')}>
            Shipping Expense
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={() => navigate('/lapse')}>
            Lapse
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={() => navigate('/containerDetails')}>
            Container Details
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ShippingType;
