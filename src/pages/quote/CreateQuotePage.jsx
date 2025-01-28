import { Box, Typography, IconButton, Grid, Table, TableRow, TableHead, TableCell } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import AdditionalInformationView from './AdditionalInformationView';
import ItemList from './ItemList';
import { DataGrid } from '@mui/x-data-grid';
import QuoteForm from './QuoteForm';
import CreateIcon from '@mui/icons-material/Create';
import PlusButton from 'components/CustomButton';

const CreateQuotePage = ({ selectedRFQ, onBack }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqDetail: true,
    quotedetail: true,
    itemList: true
  });
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const handleCreateClick = (rowData) => {
    console.log('Selected Vendor:', rowData);
    setShowQuoteForm(true);
  };

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
  const VendorData = [
    {
      id: 1,
      vendor_series: 'VS-001',
      vendor_name: 'Vendor A',
      phone_number: '123-456-7890',
      email: 'vendorA@example.com',
      contact_person: 'John Doe',
      contact_person_phone: '123-123-1234',
      contact_person_email: 'johndoe@example.com'
    },
    {
      id: 2,
      vendor_series: 'VS-002',
      vendor_name: 'Vendor B',
      phone_number: '987-654-3210',
      email: 'vendorB@example.com',
      contact_person: 'Jane Smith',
      contact_person_phone: '987-987-9876',
      contact_person_email: 'janesmith@example.com'
    },
    {
      id: 3,
      vendor_series: 'VS-003',
      vendor_name: 'Vendor C',
      phone_number: '456-789-0123',
      email: 'vendorC@example.com',
      contact_person: 'Michael Brown',
      contact_person_phone: '456-456-4567',
      contact_person_email: 'michaelbrown@example.com'
    },
    {
      id: 4,
      vendor_series: 'VS-004',
      vendor_name: 'Vendor D',
      phone_number: '321-654-9870',
      email: 'vendorD@example.com',
      contact_person: 'Emily Davis',
      contact_person_phone: '321-321-3214',
      contact_person_email: 'emilydavis@example.com'
    },
    {
      id: 5,
      vendor_series: 'VS-005',
      vendor_name: 'Vendor E',
      phone_number: '654-321-7890',
      email: 'vendorE@example.com',
      contact_person: 'Chris Green',
      contact_person_phone: '654-654-6543',
      contact_person_email: 'chrisgreen@example.com'
    }
  ];
  const VendorColumn = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'action',
      headerName: 'Create',
      width: 80,
      renderCell: (params) => (
        <IconButton style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleCreateClick(params.row)}>
          <CreateIcon />
        </IconButton>
      )
    },
    { field: 'vendor_series', headerName: 'Vendor Num', width: 120 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 250 },
    { field: 'phone_number', headerName: 'Vendor Ph. No.', width: 150 },
    { field: 'email', headerName: 'Vendor Email', width: 200 },
    { field: 'contact_person', headerName: 'Contact Person Name', width: 180 },
    { field: 'contact_person_phone', headerName: 'Contact Person Ph. No.', width: 180 },
    { field: 'contact_person_email', headerName: 'Contact Person Email', width: 200 }
  ];

  if (showQuoteForm) {
    return (
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {`Create Quote for RFQ No. (${selectedRFQ})`}
            <PlusButton label={'Back'} onClick={() => setShowQuoteForm(false)} />
          </Box>
        }
      >
        <QuoteForm />
      </MainCard>
    );
  } else {
    return (
      <>
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              View RFQ's
              <PlusButton label={'Back'} onClick={onBack} />
            </Box>
          }
        >
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
          {showTableHeading.quotedetail && (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={VendorData}
              columns={VendorColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              hideFooterPagination
              hideFooter
            />
          )}
          <AdditionalInformationView />
          <Table sx={{ paddingTop: '20px' }}>{renderTableHeader('itemList', 'Item Details')}</Table>
          {showTableHeading.itemList && <ItemList />}
        </MainCard>
      </>
    );
  }
};

export default CreateQuotePage;
