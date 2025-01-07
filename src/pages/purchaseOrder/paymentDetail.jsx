import React, { useState } from 'react';
import { Paper, Table, TableBody, TableRow, TableCell, Typography, Box, Divider } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { axiosInstance } from 'utils/axiosInstance';

const PaymentDetail = ({ details }) => {
  const [imageUrl, setImageUrl] = useState(null);
  if (!details) return <div>Loading...</div>;
  console.log('detail', details);
  const columnDefs = [
    { headerName: 'Payment Date', field: 'payment_date', sortable: true, filter: true, width: 150 },
    { headerName: 'Payment Amount', field: 'payment_amount', sortable: true, filter: true, width: 150 },
    { headerName: 'From Bank Detail ID', field: 'from_bank_detail_id', sortable: true, filter: true, width: 150 },
    { headerName: 'To Bank Detail ID', field: 'to_bank_detail_id', sortable: true, filter: true, width: 150 },
    { headerName: 'Bank Charges', field: 'bank_charge', sortable: true, filter: true, width: 150 },
    { headerName: 'Bank Reference No', field: 'bank_reference_no', sortable: true, filter: true, width: 150 }
  ];

  // Transform the details object into a format suitable for AG Grid
  const rowData = [
    {
      payment_date: details.payment_date,
      payment_amount: details.payment_amount,
      from_bank_detail_id: details.from_bank_detail_id,
      to_bank_detail_id: details.to_bank_detail_id,
      bank_charge: details.bank_charge,
      bank_reference_no: details.bank_reference_no
    }
  ];
  const getImage = async (payment_request_id) => {
    try {
      const response = await axiosInstance.get(`/api/payment-transactions/transactionfile?payment_request_id=${5}`);

      //   const response = await axios.get(`/api/payment-transactions/transactionfile`);
      console.log('response', response);

      // Assuming the response contains the URL of the image
      if (response.data && response.data.receipt_image) {
        setImageUrl(response.data.receipt_image);
      }
    } catch (error) {
      console.error('Error fetching payment request data:', error);
    }
  };
  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom marginTop={2}>
        Payment Request Details
      </Typography>
      <Box my={2}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Advice Amount:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.paymentRequest?.advice_amount}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Advice Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.paymentRequest?.advice_date}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Advice Remarks:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.paymentRequest?.advice_remarks}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PO Amount:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.paymentRequest?.po_amount}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PO Number:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.paymentRequest?.po_number}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Payment Type:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.payment_type}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Status:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.status}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank Charge:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.bank_charge}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank Reference No:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{details?.bank_reference_no}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Divider />

      <Typography variant="h4" align="center" gutterBottom marginTop={2}>
        Payment Details
      </Typography>
      <Box my={2} style={{ height: '200px', width: '100%' }}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact columnDefs={columnDefs} rowData={rowData} domLayout="autoHeight" />
        </div>
      </Box>
      <Typography variant="h4" align="center" gutterBottom marginTop={2}>
        Document
      </Typography>
      <Box my={2} display="flex" alignItems="center">
        <Box
          onClick={getImage}
          sx={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: '4px',
            marginRight: '20px',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          <Typography variant="button">View Image</Typography>
        </Box>
        {imageUrl && (
          <Box
            component="img"
            src={`data:image/jpeg;base64,${imageUrl}`}
            alt="Transaction"
            sx={{ maxHeight: '200px', borderRadius: '8px', boxShadow: 3 }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default PaymentDetail;
