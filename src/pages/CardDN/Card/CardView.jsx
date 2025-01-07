import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box, IconButton, Button } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';

const CardView = ({ approvalViewData }) => {
  const [cardDetailData, setCardDetailData] = useState([]);
  const [showTableHeading, setShowTableHeading] = useState({
    oprDetails: true,
    cardDetail: true
  });
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  console.log('approvalViewData', approvalViewData);
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
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
  const cardDetailColumn = [
    { headerName: 'Sr No', field: 'sno' },
    { headerName: 'Expense Type', field: 'expense_type' },
    { headerName: 'Payment Date', field: 'payment_date' },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Amount', field: 'amount' },
    { headerName: 'Narration', field: 'narration' },
    { headerName: 'APAP1-Approval', field: 'appa1_approval' },
    { headerName: 'APAP2-Approval', field: 'appa2_approval' },
    { headerName: 'HO-Approval', field: 'ho_approval' },
    { headerName: 'Accounts Approval', field: 'accounts_approval' },
    { headerName: 'Reimbursement', field: 'reimbursement' }
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/pfi/list');
        console.log('Fetching data:', response.data);
        const pendingAllData = response.data.map((item, index) => ({
          id: index + 1,
          sno: index + 1,
          expense_type: item.expense_type || 'CI-000',
          payment_date: item.payment_date || 'Net 30',
          date: item.date || 'N/A',
          amount: item.amount || 'N/A',
          narration: item.narration || 'Electronic components',
          appa1_approval: item.appa1_approval || 'Electronics',
          appa2_approval: item.appa2_approval || 'USD',
          ho_approval: item.ho_approval || 25000,
          accounts_approval: item.accounts_approval || 'N/A',
          reimbursement: item.reimbursement || 'N/A'
        }));
        console.log('Fetching data:', pendingAllData);
        setCardDetailData(pendingAllData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Table>
        {renderTableHeader('oprDetails', 'OPR-22-CMC-0092')}
        {showTableHeading.oprDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  UK-MUM/CO-Ordinator Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.co_ordinator_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.pfi_no}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Invoice No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.inv_no}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Description of Goods:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.description_of_goods}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Unit:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.unit}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Origin
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.port_of_origin}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Vessel
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.vessel}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Revised ETA Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.revised_eta_date}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  No. of Containers & Size
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.no_of_container_size}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Gross Weight/CBM
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.gross_weight_cbm}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  CFR Amount
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.cfr_amount}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Remmittance Terms:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.remittance_terms}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  BL/AWB No.
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.awb_number}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  FORM M No.
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.form_m_no}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Sender:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.sender}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  ETA:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.eta}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  C No:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.c_no}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Free Days
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.free_days}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Destination
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.port_of_destination}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <br />
      <Table sx={{ paddingTop: 2 }}>
        {renderTableHeader('cardDetail', 'Card List')}
        {showTableHeading.cardDetail && <DataGrid getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }} rows={cardDetailData} columns={cardDetailColumn} hideFooter />}
      </Table>
    </div>
  );
};

export default CardView;
