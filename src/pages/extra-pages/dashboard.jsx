// material-ui
import * as React from 'react';
import MainCard from 'components/MainCard';
import { Card, CardActions, CardContent, Button, Typography, Grid } from '@mui/material';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
  return (
    <MainCard title="Dashboard">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                OPR
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description for OPR.
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Quotation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description for Quotation.
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                PO
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description for PO.
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Vendor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description for Vendor.
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <LineChart
            // width={600}
            height={300}
            series={[{ data: uData, label: 'uv', area: true, showMark: false }]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            sx={{
              [`& .${lineElementClasses.root}`]: {
                display: 'none'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            // width={500}
            height={300}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
}
