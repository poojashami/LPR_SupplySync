import { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Box, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import ValidationStar from 'components/ValidationStar';
import CustomTypography from 'components/CustomTypography';
import { DataGrid } from '@mui/x-data-grid';

const QuoteComparision = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetail: true,
    quotecompare: true,
    paymentInformation: true
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
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="h7" fontWeight={600}>
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

  const columns = [
    {
      field: 'id',
      headerName: 'SR.No.',
      width: 70
    },
    {
      field: 'container_type',
      headerName: 'Container Type',
      flex: 1,
      editable: true,
      renderCell: (params) => <span style={{ fontWeight: params.row.fontWeight }}>{params.value}</span>
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 100,
      editable: true
    },
    {
      field: 'other_charge',
      headerName: 'Other Ch',
      type: 'number',
      width: 120,
      editable: true
    },
    {
      field: 'free_days_at_pod',
      headerName: 'Free Days At POD',
      type: 'number',
      width: 120,
      editable: true
    }
  ];

  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    console.log(id, field, value);

    setExpenses((prevExpenses) => {
      return prevExpenses.map((row) => (row.id === id ? { ...row, [field]: value } : row));
    });
  };
  const handleRowUpdate = (newRow) => {
    console.log('Row update triggered');
    console.log('Updated Row:', newRow);

    setExpenses((prevExpenses) => {
      return prevExpenses.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row));
    });

    return newRow;
  };
  const quotes = [
    {
      id: 1,
      title: 'Quote1',
      partyName: 'Party 1 Name',
      partyInfo: 'Party 1 Info',
      quoteInfo: 'Quote 1 Info',
      paymentTerm: 'Payment Term 1',
      shippingLine: 'Shipping Line 1',
      freeDaysPOL: 'Free Days POL 1',
      ets: '2024-01-10',
      eta: '2024-01-20',
      sailingDays: '10 days',
      rateValidity: '2024-12-31',
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      remark: 'Remark 1 for Quote 1',
      additionalComment: 'Additional Comment 1 for Quote 1',
      expenses: [
        {
          id: 1,
          container_type: '20GP',
          rate: 1200,
          other_charge: 100,
          free_days_at_pod: 7,
          fontWeight: 'bold'
        },
        {
          id: 2,
          container_type: '40GP',
          rate: 1800,
          other_charge: 150,
          free_days_at_pod: 10,
          fontWeight: 'normal'
        }
      ]
    },
    {
      id: 2,
      title: 'Quote2',
      partyName: 'Party 2 Name',
      partyInfo: 'Party 2 Info',
      quoteInfo: 'Quote 2 Info',
      paymentTerm: 'Payment Term 2',
      shippingLine: 'Shipping Line 2',
      freeDaysPOL: 'Free Days POL 2',
      ets: '2024-02-05',
      eta: '2024-02-15',
      sailingDays: '10 days',
      rateValidity: '2024-11-30',
      dateFrom: '2024-02-01',
      dateTo: '2024-11-30',
      remark: 'Remark 2 for Quote 2',
      additionalComment: 'Additional Comment 2 for Quote 2',
      expenses: [
        {
          id: 1,
          container_type: '20GP',
          rate: 1200,
          other_charge: 100,
          free_days_at_pod: 7,
          fontWeight: 'bold'
        },
        {
          id: 2,
          container_type: '40GP',
          rate: 1800,
          other_charge: 150,
          free_days_at_pod: 10,
          fontWeight: 'normal'
        }
      ]
    }
  ];

  const QuoteComponent = ({ quote }) => (
    <Box component="form" paddingLeft={1} border={'dotted'} borderRadius={3} boxShadow={3}>
      <Typography display={'flex'} justifyContent={'center'} variant="h5">
        {quote.title}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Party Name
          </Typography>
          <CustomTypography>{quote.partyName}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Party Info
          </Typography>
          <CustomTypography>{quote.partyInfo}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Quote Info
          </Typography>
          <CustomTypography>{quote.quoteInfo}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Payment Term
          </Typography>
          <CustomTypography>{quote.paymentTerm}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Shipping Line <ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.shippingLine}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Free Days POL<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.freeDaysPOL}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            ETS<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.ets}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            ETA<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.eta}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Saling Days<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.sailingDays}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Rate Validity<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.rateValidity}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Date From<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.dateFrom}</CustomTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Date To<ValidationStar>*</ValidationStar>
          </Typography>
          <CustomTypography>{quote.dateTo}</CustomTypography>
        </Grid>
        {/* Add more fields as necessary */}
      </Grid>
      <Table sx={{ mt: 2 }}>
        {renderTableHeader('freightquote', 'Freight Quote')}
        {showTableHeading.freightquote}
      </Table>
      <Grid container spacing={2} display={'flex'} alignItems={'flex-end'}>
        <Grid item xs={12}>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'start'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(224, 224, 224, 1)',
                height: '25px !important',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }}
            rows={quotes[0].expenses}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.container_type}
            hideFooter
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Remark
          </Typography>
          <CustomTypography>{quote.remark}</CustomTypography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Additional Comment
          </Typography>
          <CustomTypography>{quote.additionalComment}</CustomTypography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body" fontSize={'12px'} fontWeight={600}>
            Upload Payment Copy<ValidationStar>*</ValidationStar>
          </Typography>
          <input type="file" style={{ display: 'block', marginTop: '8px' }} required />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <MainCard title={'Quote Comparision'}>
      <Table>
        {renderTableHeader('basicDetail', 'Basic Details')}
        {showTableHeading.basicDetail && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">OPR No</CustomTypography>
                    <CustomTypography>jhdsjhdb</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">OPO No</CustomTypography>
                    <CustomTypography>USD</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">PO No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Vendor Name</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">No of Privious Shipement</CustomTypography>
                    <CustomTypography>jhdsjhdb</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Amt of Privious Shipement</CustomTypography>
                    <CustomTypography>USD</CustomTypography>
                  </Grid>
                  {/* ..........................Buyer Info.................... */}
                  <Grid xs={12} mt={2}>
                    <Typography fontWeight="600">Buyer Info</Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Consignee Name</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">PFI No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">CI No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">BL No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">FORM M No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">BA No</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">LC No</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  {/* ..........................Shipment Info	.................... */}
                  <Grid xs={12} mt={2}>
                    <Typography fontWeight="600">Shipment Info </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Delivery Term</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Mode of Shipment</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Type of Shipment</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">CBM</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">No of Pack/Box/Bags</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Net Weight</CustomTypography>
                    <CustomTypography>10 Dec 2024</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Gross Weight</CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Port Of Loading </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Port Of Discharge </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">No of Contianers </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Size & Type </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTypography fontWeight="600">Count </CustomTypography>
                    <CustomTypography>Bank A</CustomTypography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('quotecompare', 'Quote Comparsion')}
        {showTableHeading.quotecompare}
      </Table>
      <Box
        display={'flex'}
        gap={2}
        mt={1}
        sx={{
          //   maxHeight: '500px',
          overflowY: 'auto',
          maxWidth: '100%',
          overflowX: 'auto',
          padding: 1
        }}
      >
        {quotes.map((quote) => (
          <QuoteComponent key={quote.id} quote={quote} />
        ))}
      </Box>
    </MainCard>
  );
};

export default QuoteComparision;
