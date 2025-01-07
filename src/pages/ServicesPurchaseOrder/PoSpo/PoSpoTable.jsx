import React from 'react';

import {
  Button,
  Box,
  DialogActions,
  TextField,
  Divider,
  DialogTitle,
  Dialog,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Select,
  MenuItem,
  Menu,
  Link
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DocView from './docPo';
import QuotationView from './poView';
import { poPaymentRequest } from 'Redux/Apis/PostApiCalls';
import { GetPurchaseOrder, GetPaymentType } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import formattedDateTime from 'utils/time';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
export default function PoSpoTable() {
  const dispatch = useDispatch();
  const { paymentTypes } = useSelector((state) => state.paymentTerms);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  // const [selectedQuotation, setSelectedQuotation] = useState(null);
  // const [formMode, setFormMode] = useState('create');
  const [quotationData, setQuotationData] = useState([]);
  const [poData, setPoData] = useState(null);
  const [poDataByRow, setPoDataByRow] = useState();
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState();
  const [paymentTerm, setPaymentTerm] = useState();
  const [amount, setAmount] = useState();
  const [poDoc, setPoDoc] = useState(null);
  console.log('paymentTypes:', paymentTypes);
  useEffect(() => {
    GetPurchaseOrder(dispatch);
    GetPaymentType(dispatch);
  }, []);

  const TableHeader = [
    { field: 'po_id', headerName: 'PO ID', width: 80 },
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   width: 80,
    //   renderCell: (params) => (
    //     <div>
    //       <IconButton
    //         aria-label="more"
    //         id={`long-button-${params.row.id}`}
    //         aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
    //         aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
    //         aria-haspopup="true"
    //         onClick={(event) => handleClick(event, params.row.id)}
    //       >
    //         <MoreVertIcon />
    //       </IconButton>
    //       <Menu
    //         id="long-menu"
    //         anchorEl={anchorEl}
    //         open={openAction && anchorElRowId === params.row.id}
    //         onClose={handleCloseMenu}
    //         PaperProps={{
    //           style: {
    //             maxHeight: 48 * 4.5,
    //             width: '20ch'
    //           }
    //         }}
    //       >
    //         <MenuItem>
    //           <Link component="button" onClick={() => handleOpenServiceRFQ(params.row)}>
    //             <strong>Create Service RFQ</strong>
    //           </Link>
    //         </MenuItem>
    //       </Menu>
    //     </div>
    //   )
    // },
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: '#4680FF' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'quo_num', headerName: 'Quotation Number', width: 150 },
    { field: 'vendor_id', headerName: 'Vendor Name', width: 150 },
    { field: 'total_cost', headerName: 'Total Amount', width: 150 },
    { field: 'created_on', headerName: 'PO Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <div>
          {params.value === 4 ? (
            <Button
              variant="text"
              style={{ color: '#4680FF', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
              onClick={() => handlePaymentPO(params.row)}
            >
              Request Payment
            </Button>
          ) : params.value === 1 ? (
            <Button variant="text" style={{ color: 'blue', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Send to Vendor
            </Button>
          ) : params.value === 6 ? (
            <Button variant="text" style={{ color: 'green', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Payment Done
            </Button>
          ) : params.value === 5 ? (
            <Button variant="text" style={{ color: 'orange', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Payment Processing
            </Button>
          ) : params.value === 4 ? (
            <Button
              variant="text"
              onChange={() => setOpen(true)}
              style={{ color: 'blue', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
            >
              Send For Payment
            </Button>
          ) : (
            <Button variant="text" style={{ color: 'orange', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Vendor Acceptance..
            </Button>
          )}
        </div>
      )
    },
    {
      field: 'download_doc',
      headerName: 'View Doc ',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => handleDocClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          <RemoveRedEyeIcon style={{ color: 'grey', backgroundColor: 'transparent' }} />
        </Button>
      )
    }
  ];

  const handleSave = async () => {
    let data = {
      doc_type: 'service_po',
      doc_id: poDataByRow.service_quo_id,
      po_number: poDataByRow.po_num,
      po_amount: poDataByRow.total_cost,
      advice_amount: +amount,
      advice_date: formattedDateTime,
      remarks: remarks,
      payment_type_id: paymentTerm
    };
    await poPaymentRequest(dispatch, data);
    setOpen(false);
    await GetPurchaseOrder(dispatch);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentPO = async (params) => {
    console.log('rowdat', params);
    setPoDataByRow(params);
    setOpen(true);
  };

  const handleViewClick = async (quotation) => {
    setPoData({ ...quotation });
  };

  const handleDocClick = async (quotation) => {
    setPoDoc({ ...quotation });
  };

  const GetPoData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/service/pos');
      console.log('PO TABLE', data);
      const mappedData = data?.map((po, index) => ({
        id: index + 1,
        po_id: po.po_id,
        po_num: po?.po_num || 'PO11X2055',
        quo_num: po.service_quo_num || 'PO11X2055',
        vendor_id: po.vendor_id,
        total_cost: po.amount,
        quo_id: po.service_quo_id,
        created_on: po.createdAt.split('T')[0],
        status: po.status,
        service_quo_id: po.service_quo_id
      }));
      setQuotationData(mappedData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    GetPoData();
  }, []);

  const handleViewClose = () => {
    setPoData(null);
    setPoDoc(null);
    setShowQuotationForm(false);
  };
  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {<span>View Purchase Order </span>}
            {showQuotationForm && <PlusButton>Back</PlusButton>}
          </Box>
        }
      >
        {poData ? (
          <QuotationView oprViewData={poData} onClose={handleViewClose} />
        ) : poDoc ? (
          <DocView oprViewData={poDoc} onClose={handleViewClose} />
        ) : (
          <div>
            <DataGrid
              getRowHeight={() => 'auto'}
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
              }}
              rows={quotationData}
              columns={TableHeader}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />

            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  height: '70vh',
                  width: '90vh',
                  border: '10px solid #a1bcdb'
                }
              }}
            >
              <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
                Payment Request for PO No. <b style={{ color: 'blue' }}>{poDataByRow?.po_num}</b> Dt-
                <b style={{ color: 'blue' }}>{poDataByRow?.created_on}</b>
              </DialogTitle>
              <Divider />
              <div style={{ padding: '20px' }}>
                <Table>
                  <TableBody>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={12}></TableCell>
                    </TableRow>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={12}>
                        <Typography variant="subtitle1">Payment Type</Typography>
                        <Select
                          variant="outlined"
                          fullWidth
                          id="payment_type"
                          name="payment_type"
                          value={paymentTerm}
                          onChange={(e) => setPaymentTerm(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {paymentTypes?.map((data) => (
                            <MenuItem key={data.payment_type_id} value={data.payment_type_id}>
                              {data.payment_type_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={12}>
                        <Typography variant="subtitle1">Amount </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          type="number"
                          id="amount"
                          name="amount"
                          placeholder="Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <TableCell colSpan={12}>
                        <Typography variant="subtitle1">Remarks </Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="remarks"
                          name="remarks"
                          placeholder="Remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </MainCard>
    </>
  );
}
