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
      total: 50,
      within1Week: 500,
      within1To2Weeks: 100,
      moreThan2Weeks: 200
    }
  },
  {
    title: 'Pending Expense/Service Payments',
    details: {
      total: 4000,
      within1Week: 1300,
      within1To2Weeks: 1394,
      moreThan2Weeks: 2000
    }
  },
  {
    title: 'Upcoming PO Payments',
    details: {
      total: 330,
      within1Week: 1840,
      within1To2Weeks: 1847,
      moreThan2Weeks: 2984
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

  const pieData = [
    { label: 'Within 1 Week', id: 'Within 1 Week', value: chartData.within1Week, color: '#AF7AC5' },
    { label: 'Within 1 to 2 Weeks', id: 'Within 1 to 2 Weeks', value: chartData.within1To2Weeks, color: '#B2BABB' },
    { label: 'More Than 2 Weeks', id: 'More Than 2 Weeks', value: chartData.moreThan2Weeks, color: '#F1948A' }
  ];

  const getArcLabel = ({ value }) => `${value}`;
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

  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(3)
  }));

  const HighlightBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(0.5, 0),
    borderRadius: '8px',
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary
  }));
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
  return (
    <MainCard title="Dashboard">
      <Table sx={{ marginBottom: '10px' }}>{renderTableHeader('viewLPR', ' Treasury at BH')}</Table>
      {showTableHeading.viewLPR && (
        <Grid container spacing={3}>
          {paymentData.map((payment, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <StyledCardContent>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ fontSize: '12px', fontWeight: '600', color: '#185b9f' }}
                  >
                    {payment.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <HighlightBox display={'flex'} justifyContent={'space-between'}>
                      <span>Total:</span> <span style={{ fontWeight: '700', color: '#AF7AC5' }}>{payment.details.total}</span>
                    </HighlightBox>
                    <HighlightBox>
                      <span>Within 1 wk:</span> <span style={{ fontWeight: '700', color: '#B2BABB' }}>{payment.details.within1Week} </span>
                    </HighlightBox>
                    <HighlightBox>
                      <span>Within 1-2 wk:</span>{' '}
                      <span style={{ fontWeight: '700', color: '#F1948A' }}>{payment.details.within1To2Weeks}</span>
                    </HighlightBox>
                    <HighlightBox>
                      <span>More than 2 wk:</span>{' '}
                      <span style={{ fontWeight: '700', color: '#F8C471' }}>{payment.details.moreThan2Weeks}</span>
                    </HighlightBox>
                  </Typography>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
      <Table sx={{ marginBottom: '10px', marginTop: '10px' }}>{renderTableHeader('viewLPR', ' Treasury at BH')}</Table>
      {showTableHeading.viewLPR && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center' // Optional: if you want text inside Box to also be centered
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
                    arcLabel: getArcLabel
                  }
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14
                  }
                }}
                margin={{ right: 5 }}
                width={250}
                height={250}
                legend={{ hidden: true }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: categories }]}
              colors={['#AF7AC5', '#B2BABB', '#F1948A']}
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
