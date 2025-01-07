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
  TableContainer,
  TableHead,
  Paper,
  DialogContent,
  Chip
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DocView from './docPo';
import POView from './poView';
import { poPaymentRequest } from 'Redux/Apis/PostApiCalls';
import { GetPurchaseOrder, GetPaymentType } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import formattedDateTime from 'utils/time';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ServiceRFQPage from './ServiceRFQPage';
import PlusButton from 'components/CustomButton';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

export default function QuotationPage() {
  const dispatch = useDispatch();
  const { purchaseOrder } = useSelector((state) => state.purchaseOrder);
  const { paymentTypes } = useSelector((state) => state.paymentTerms);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotationData, setQuotationData] = useState([]);
  const [poData, setPoData] = useState(null);
  const [poDataByRow, setPoDataByRow] = useState();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [showDoc, setShowDoc] = useState(null);
  const [remarks, setRemarks] = useState();
  const [paymentTerm, setPaymentTerm] = useState();
  const [amount, setAmount] = useState();
  const [poDoc, setPoDoc] = useState(null);
  const [openServiceRFQPage, setOpenServiceRFQPage] = useState(false);
  const [doc_list, setDoc_list] = useState([]);

  useEffect(() => {
    GetPurchaseOrder(dispatch);
    GetPaymentType(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDocuments = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/document/docbyentityid', {
        params: {
          entity_id: id
        }
      });
      setDoc_list(data);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const closeShowDoc = () => {
    setShowDoc(null);
  };

  const renderMilestones = (milestones) => {
    return (
      <table style={{ width: '100%' }}>
        <tbody>
          <tr style={{ display: 'flex', alignItems: 'center' }}>
            {milestones.map((milestone, index) => {
              const trimmedMilestone = milestone.trim(); // Clean up spaces
              const isCompleted = trimmedMilestone.charAt(trimmedMilestone.length - 1) === 'D'; // Check if completed
              return (
                <>
                  <td
                    key={index}
                    style={{
                      padding: '5px',
                      border: 'lightgrey solid 1px',
                      marginRight: '5px',
                      backgroundColor: isCompleted ? '#aff3af' : 'lightorange'
                    }}
                  >
                    {isCompleted ? (
                      <CloudDoneIcon style={{ fontSize: '16px', marginRight: '4px', color: 'blue' }} />
                    ) : (
                      <PendingActionsIcon style={{ fontSize: '16px', marginRight: '4px', color: 'red' }} />
                    )}
                    {/* </td>
                  <td key={index} style={{ padding: '5px' }}> */}
                    <span>{trimmedMilestone.substring(0, trimmedMilestone.length - 2)}</span> {/* Remove last 2 characters */}
                  </td>
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };

  const TableHeader = [
    { field: 'id', headerName: 'Sr No.', width: 40 },
    {
      field: 'download_doc',
      headerName: 'View Doc ',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => handleDocClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          <RemoveRedEyeIcon style={{ color: 'grey', backgroundColor: 'transparent' }} />
        </Button>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <div>
          {params.value === 3 ? (
            <Chip onClick={() => handlePaymentPO(params.row)} label="Request For Payment" color="info" sx={{ width: '200px' }} />
          ) : params.value === 1 ? (
            <Chip label="Send to Vendor" sx={{ width: '200px', color: 'white', backgroundColor: '#de5b37' }} />
          ) : params.value === 6 ? (
            <Chip label=" Payment Done" color="success" sx={{ width: '200px' }} />
          ) : params.value === 5 ? (
            <Chip label="Accepted" sx={{ width: '200px', color: 'white', background: '#ff7043' }} />
          ) : params.value === '8' || params.value === 8 ? (
            <Chip
              label="GDN Sent"
              // onClick={() => handleShowDocs(params.row)}
              sx={{ width: '200px', color: 'white', background: '#00b0ff' }}
            />
          ) : params.value === '10' || params.value === 10 ? (
            <Button
              onClick={() => {
                // console.log(quotationData[params.id - 1]);
                alert(`${quotationData[params.id - 1]?.dispatch_date} ${quotationData[params.id - 1]?.final_doc_dispatch_no}`);
                // handleShowDocs(params.row);
              }}
              variant="text"
              style={{ color: 'green', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
            >
              Final Payment
            </Button>
          ) : params.value === '7' || params.value === 7 ? (
            <Chip label="Payment Done" sx={{ width: '200px', color: 'white', backgroundColor: '#81c784' }} />
          ) : (
            <Chip
              // onClick={() => handleShowDocs(params.row)}
              label="Ready for dispatch"
              sx={{ width: '200px', color: 'white', backgroundColor: '#e9723e' }}
            />
          )}
        </div>
      )
    },
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
    { field: 'quo_num', headerName: 'OPO Number', width: 200 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 150 },
    { field: 'total_cost', headerName: 'Total Amount', width: 150 },
    { field: 'created_on', headerName: 'PO Date', width: 120 },
    {
      field: 'milestone',
      headerName: 'Payment Status',
      width: 500,
      renderCell: (params) => {
        const milestones = params.value.split(','); // Split milestones string into array
        return <div>{renderMilestones(milestones)}</div>; // Render multiple milestone sections in a single column
      }
    }
  ];

  const handleSave = async () => {
    let data = {
      doc_type: poDataByRow?.status === 8 ? 'f_po' : 'po',
      doc_id: poDataByRow.po_id,
      po_number: poDataByRow.po_num,
      po_amount: poDataByRow.total_cost,
      advice_amount: +amount,
      advice_date: formattedDateTime,
      remarks: remarks,
      payment_type_id: paymentTerm
    };

    console.log('Submit Data:', data);
    await poPaymentRequest(dispatch, data);
    setOpen(false);
    await GetPurchaseOrder(dispatch);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handlePaymentPO = async (params) => {
    console.log(params);
    setPoDataByRow(params);
    setOpen(true);
  };

  const handleShowDocs = async (params) => {
    console.log(params);
    setPoDataByRow(params);
    getDocuments(params.po_id);
    setOpen2(true);
  };

  const handleViewClick = async (quotation) => {
    setPoData({ ...quotation });
  };

  const handleDocClick = async (quotation) => {
    setPoDoc({ ...quotation });
  };

  useEffect(() => {
    console.log(purchaseOrder);
    const mappedData = purchaseOrder?.map((po, index) => ({
      id: index + 1,
      po_id: po.po_id,
      po_num: po.po_num,
      quo_num: po.opo_nums,
      vendor_id: po.vendor_id,
      po_amount: po?.total_cost,
      vendor_name: po?.VendorsMaster?.vendor_name,
      total_cost:
        po.total_cost +
        po?.opo_master?.quotation_master?.additional_costs?.reduce((acc, amount) => {
          return amount.charges_by === 'Supplier' && !amount.reference_table_name
            ? (acc = Number(acc) + Number(amount.charge_amount))
            : acc;
        }, 0),
      quo_id: po.quo_id,
      created_on: po.created_on.split('T')[0],
      status: po.status,
      final_doc_dispatch_no: po.final_doc_dispatch_no,
      disptach_date: po.disptach_date,
      lead_time: po.lead_time,
      acceptance_remarks: po.acceptance_remarks,
      po_items: po.po_items,
      VendorsMaster: po.VendorsMaster,
      opo_master: po?.opo_master,
      OprMaster: po?.opo_master?.OprMaster,
      BuyingHouse: po?.opo_master?.OprMaster?.BuyingHouse,
      companyMaster: po?.opo_master?.OprMaster?.companyMaster,
      AddressMasters: po?.opo_master?.OprMaster?.companyMaster?.AddressMasters,
      quotation_master: po?.opo_master?.quotation_master,
      milestone: po?.opo_master?.quotation_master?.payment_milestones
        ?.map((item) => `${item.milestone} ${item.percentage}% ${item.status === 5 ? 'D' : 'P'}`)
        ?.join(', ')
    }));
    // .filter((item) => item.status === '1');
    console.log(mappedData);
    setQuotationData(mappedData);
  }, [purchaseOrder]);

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
            {!openServiceRFQPage && !showQuotationForm ? <span>Issued Purchase Order </span> : ''}
            {showQuotationForm && <PlusButton>Back</PlusButton>}
          </Box>
        }
      >
        {poData ? (
          <POView oprViewData={poData} onClose={handleViewClose} />
        ) : poDoc ? (
          <DocView oprViewData={poDoc} onClose={handleViewClose} />
        ) : openServiceRFQPage ? (
          <ServiceRFQPage onClickServiceRFQ={openServiceRFQPage} />
        ) : (
          <div>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '70vh',
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
            <Dialog
              open={open2}
              onClose={handleClose2}
              PaperProps={{
                style: {
                  // height: '70vh',
                  width: '90vh',
                  border: '10px solid #a1bcdb'
                }
              }}
            >
              <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
                Document List for PO No. <b style={{ color: 'blue' }}>{poDataByRow?.po_num}</b> Dt-
                <b style={{ color: 'blue' }}>{poDataByRow?.created_on}</b>
              </DialogTitle>
              <Divider />
              <div style={{ padding: '20px' }}>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ maxWidth: '30px' }}>
                          Sl. No.
                        </TableCell>
                        <TableCell align="center">Document</TableCell>
                        <TableCell align="center">File Name</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doc_list?.map((item, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{item?.type}</TableCell>
                          <TableCell align="center">{item?.doc_name}</TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                setShowDoc({
                                  file: item?.doc_base64,
                                  doc_name: item?.doc_name
                                })
                              }
                              variant="contained"
                              color="primary"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <DialogActions>
                <Button onClick={handleClose2} color="primary">
                  Close
                </Button>
                {poDataByRow?.status === 8 && (
                  <Button
                    onClick={() => {
                      handleClose2();
                      handlePaymentPO(poDataByRow);
                    }}
                    color="primary"
                    variant="contained"
                  >
                    Create Payment Request
                  </Button>
                )}
              </DialogActions>
            </Dialog>
            <Dialog open={showDoc} onClose={closeShowDoc} aria-labelledby={showDoc?.doc_name}>
              <DialogTitle id={showDoc?.doc_name}>{showDoc?.doc_name}</DialogTitle>
              <DialogContent>
                <img src={`data:image/png;base64,${showDoc?.file}`} alt="file" />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeShowDoc} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </MainCard>
    </>
  );
}
