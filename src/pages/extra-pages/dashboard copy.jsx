// material-ui
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton
} from '@mui/material';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { BarChart as MuiChart } from '@mui/x-charts/BarChart';
import { BarChart, PieChart, pieArcLabelClasses } from '@mui/x-charts';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const paymentData = [
  {
    title: 'Pending PO Payments',
    details: {
      total: 800,
      within1Week: 500,
      within1To2Weeks: 100,
      moreThan2Weeks: 200
    }
  },
  {
    title: 'Pending Expense/Service Payments',
    details: {
      total: 430,
      within1Week: 130,
      within1To2Weeks: 100,
      moreThan2Weeks: 200
    }
  },
  {
    title: 'Upcoming PO Payments',
    details: {
      total: 450,
      within1Week: 110,
      within1To2Weeks: 120,
      moreThan2Weeks: 220
    }
  },
  {
    title: 'Pending PO Payments(Final)',
    details: {
      total: 400,
      within1Week: 100,
      within1To2Weeks: 120,
      moreThan2Weeks: 180
    }
  }
];

export default function SamplePage() {
  const [selectedTitle, setSelectedTitle] = useState(paymentData[0].title);
  const [chartData, setChartData] = useState(paymentData[0].details);

  const handleSelectChange = (event) => {
    const selected = event.target.value;
    setSelectedTitle(selected);

    // Update chart data based on selected title
    const selectedData = paymentData.find((item) => item.title === selected);
    setChartData(selectedData.details);
  };
  const getArcLabel = (data) => {
    const totalValue = pieData.reduce((acc, item) => acc + item.value, 0);
    const percentage = ((data.value / totalValue) * 100).toFixed(2); // Calculate percentage with two decimals
    return `${percentage}%`;
  };

  const pieData = [
    { label: 'Within 1 Week', id: 'Within 1 Week', value: chartData.within1Week, color: '#B2BABB' },
    { label: 'Within 1 to 2 Weeks', id: 'Within 1 to 2 Weeks', value: chartData.within1To2Weeks, color: '#F1948A' },
    { label: 'More Than 2 Weeks', id: 'More Than 2 Weeks', value: chartData.moreThan2Weeks, color: '#F8C471' },
    { label: 'Pending PO Payments(Final)', id: 'Pending PO Payments(Final)', value: chartData.moreThan2Weeks, color: '#98D8EF' }
  ];

  const categories = paymentData.map((item) => item.title); // Extract titles for x-axis categories
  const series = [
    {
      // label: 'Within 1 Week',
      data: paymentData.map((item) => item.details.within1Week)
    },
    {
      // label: 'Within 1 to 2 Weeks',
      data: paymentData.map((item) => item.details.within1To2Weeks)
    },
    {
      // label: 'More Than 2 Weeks',
      data: paymentData.map((item) => item.details.moreThan2Weeks)
    }
  ];

  const [showTableHeading, setShowTableHeading] = useState({
    treasuryBHCards: true,
    treasuryBhChart: true,
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
  const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
    },
    backgroundColor: theme.palette.background.paper
  }));
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
  return (
    <MainCard title="Dashboard">
      {/* <Table sx={{ marginBottom: '10px' }}>{renderTableHeader('treasuryBHCards', ' Treasury at BH Card')}</Table>
      {showTableHeading.treasuryBHCards && (
        <Grid container spacing={3}>
          {paymentData.map((payment, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ fontSize: '12px', fontWeight: '600', color: '#185b9f', paddingLeft: '10px' }}
                  >
                    {payment.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                      margin: 1
                    }}
                  >
                    <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                      <Box>
                        Total:
                        <Box variant="h6" sx={{ fontWeight: '700', color: '#AF7AC5', fontSize: '20px' }}>
                          {payment.details.total}
                        </Box>
                      </Box>
                    </Card>
                    <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                      <Box>
                        Within 1 wk:
                        <Box variant="h6" sx={{ fontWeight: '700', color: '#B2BABB', fontSize: '20px' }}>
                          {payment.details.within1Week}
                        </Box>
                      </Box>
                    </Card>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                      margin: 1
                    }}
                  >
                    <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                      <Box>
                        Within 1-2 wk:
                        <Box sx={{ fontWeight: '700', color: '#F1948A', fontSize: '20px' }}>{payment.details.within1To2Weeks}</Box>
                      </Box>
                    </Card>
                    <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                      <Box>
                        More than 2 wk:
                        <Box sx={{ fontWeight: '700', color: '#F8C471', fontSize: '20px' }}>{payment.details.moreThan2Weeks}</Box>
                      </Box>
                    </Card>
                  </Box>
                </>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )} */}
      <Table sx={{ marginBottom: '10px' }}>{renderTableHeader('treasuryBHCards', ' Treasury at BH Card')}</Table>
      {showTableHeading.treasuryBHCards && (
        <Grid container spacing={2}>
          {paymentData.map((payment, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <>
                <StyledCard style={{ paddingTop: '10px' }}>
                  <>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: '12px', fontWeight: '600', color: '#185b9f', paddingLeft: '10px' }}
                    >
                      {payment.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1,
                        margin: 1,
                        padding: '5px',
                        px: 2,
                        backgroundColor: 'aliceblue',
                        borderRadius: '10px',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ fontWeight: '500', fontSize: '20x' }}>Total:</Box>
                      <Box variant="h6" sx={{ fontWeight: '700', color: '#AF7AC5', fontSize: '20px' }}>
                        {payment.details.total}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1,
                        margin: 1,
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                        <Box>{'<'} 1 wk</Box>
                        <Box variant="h6" sx={{ fontWeight: '700', color: '#B2BABB', fontSize: '16px' }}>
                          {payment.details.within1Week}
                        </Box>
                      </Card>
                      <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                        <Box>
                          1-2 wk
                          <Box sx={{ fontWeight: '700', color: '#F1948A', fontSize: '16px' }}>{payment.details.within1To2Weeks}</Box>
                        </Box>
                      </Card>
                      <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                        <Box>
                          {'>'} 2 wk
                          <Box sx={{ fontWeight: '700', color: '#F8C471', fontSize: '16px' }}>{payment.details.moreThan2Weeks}</Box>
                        </Box>
                      </Card>
                    </Box>
                  </>
                </StyledCard>
              </>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard style={{ paddingTop: '10px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <FormControl>
                  <Select
                    labelId="payment-select-label"
                    value={selectedTitle}
                    onChange={handleSelectChange}
                    sx={{
                      '& .MuiSelect-select': {
                        padding: '4px',
                        fontSize: '11px'
                      },
                      '& .MuiMenuItem-root': {
                        fontSize: '11px'
                      }
                    }}
                  >
                    {paymentData.map((item, index) => (
                      <MenuItem key={index} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <PieChart
                  series={[
                    {
                      outerRadius: 60,
                      data: pieData,
                      arcLabel: getArcLabel
                    }
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontSize: 14
                    }
                  }}
                  margin={{ right: 0 }}
                  width={135}
                  height={135}
                  legend={{ hidden: true }}
                />
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      )}
      <Table sx={{ marginBottom: '10px', marginTop: '10px' }}>{renderTableHeader('treasuryBHCards', ' Treasury at BH Card')}</Table>
      {showTableHeading.treasuryBHCards && (
        <Grid container spacing={2}>
          {paymentData.map((payment, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <>
                <StyledCard style={{ paddingTop: '10px' }}>
                  <>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: '12px', fontWeight: '600', color: '#185b9f', paddingLeft: '10px' }}
                    >
                      {payment.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1,
                        margin: 1,
                        padding: '5px',
                        px: 2,
                        backgroundColor: 'aliceblue',
                        borderRadius: '10px',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ fontWeight: '500', fontSize: '20x' }}>Total:</Box>
                      <Box variant="h6" sx={{ fontWeight: '700', color: '#AF7AC5', fontSize: '20px' }}>
                        {payment.details.total}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1,
                        margin: 1,
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                        <Box>{'<'} 1 wk</Box>
                        <Box variant="h6" sx={{ fontWeight: '700', color: '#B2BABB', fontSize: '16px' }}>
                          {payment.details.within1Week}
                        </Box>
                      </Card>
                      <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                        <Box>
                          1-2 wk
                          <Box sx={{ fontWeight: '700', color: '#F1948A', fontSize: '16px' }}>{payment.details.within1To2Weeks}</Box>
                        </Box>
                      </Card>
                      <Card sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                        <Box>
                          {'>'} 2 wk
                          <Box sx={{ fontWeight: '700', color: '#F8C471', fontSize: '16px' }}>{payment.details.moreThan2Weeks}</Box>
                        </Box>
                      </Card>
                    </Box>
                  </>
                </StyledCard>
              </>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <BarChart
                xAxis={[{ scaleType: 'band', data: categories }]}
                colors={['#B2BABB', '#F1948A', '#F8C471']}
                series={series}
                width={300}
                height={180}
              />
            </StyledCard>
          </Grid>
        </Grid>
      )}
      <Table sx={{ marginBottom: '10px', marginTop: '10px' }}>{renderTableHeader('treasuryBhChart', ' Treasury at BH Chart')}</Table>
      {showTableHeading.treasuryBhChart && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <FormControl>
                <Select
                  labelId="payment-select-label"
                  value={selectedTitle}
                  onChange={handleSelectChange}
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '4px',
                      fontSize: '11px'
                    },
                    '& .MuiMenuItem-root': {
                      fontSize: '11px'
                    }
                  }}
                >
                  {paymentData.map((item, index) => (
                    <MenuItem key={index} value={item.title}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <PieChart
                series={[
                  {
                    outerRadius: 100,
                    data: pieData,
                    arcLabel: getArcLabel // Use the updated arcLabel function
                  }
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14
                  }
                }}
                margin={{ right: 0 }}
                width={250}
                height={250}
                legend={{ hidden: true }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: categories }]}
              colors={['#B2BABB', '#F1948A', '#F8C471']}
              series={series}
              width={500}
              height={300}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <LineChart
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
          <MuiChart
            xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            height={300}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
}
