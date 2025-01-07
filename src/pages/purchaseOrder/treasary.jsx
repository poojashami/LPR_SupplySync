import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import POView from './poView';
import { Dialog, DialogTitle, DialogActions, Chip, TextField, Button, Divider, Grid, Box } from '@mui/material';
import PaymentForm from './paymentForm';
import { axiosInstance } from 'utils/axiosInstance';
import PaymentDetail from './paymentDetail';
import PfiMargin from './pfiMargin';
import CompanyForPfi from './companyForPfi';
import PlusButton from 'components/CustomButton';
import DocPFI from './docPfi';

const Treasury = () => {
  const [quotationData, setQuotationData] = useState([]);
  const [poData, setPoData] = useState(null);
  const [pfiData, setPfiData] = useState(null);
  const [pfiDataToShow, setPfiDataToShow] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [poNum, setPoNum] = useState(null);
  const [company, setCompany] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPaymentRequestId, setSelectedPaymentRequestId] = useState(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [pfi, setPfi] = useState({});
  useEffect(() => {
    paymentRequestData();
  }, []);

  const TableHeader = [
    { field: 'index', headerName: 'S.No.', width: 80 },
    { field: 'payment_request_id', headerName: 'Req.No.', width: 80 },
    { headerName: 'PO.ID.', field: 'po_id', width: 80 },
    {
      field: 'po_number',
      headerName: 'Purchase Order',
      width: 100,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'po_amount', headerName: 'PO Amount', width: 100 },
    { field: 'advice_date', headerName: 'Advise date', width: 100 },
    { field: 'advice_amount', headerName: 'Advise Amount', width: 120 },
    { field: 'advice_remarks', headerName: 'Advise Remark', width: 200 },
    {
      field: 'status',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => {
        const { status } = params.row;
        const renderProceedButton = () => {
          // if (status === 1 || status === 2) {
          return (
            <Button
              variant="outlined"
              style={{
                color: status === 4 ? 'gray' : 'blue',
                borderColor: status === 4 ? 'gray' : 'blue',
                fontSize: '11px',
                padding: '5px',
                pointerEvents: status === 4 ? 'none' : 'auto'
              }}
              onClick={() => status !== 4 && handleAcceptPO(params.row)}
            >
              {status === 4 ? 'Proceed to pay' : 'Proceed to pay'}
            </Button>
          );
          // }
          // return null;
        };

        const renderRejectButton = () => {
          if (status === 1 || status === 2) {
            return (
              <Button
                variant="outlined"
                color="error"
                style={{ marginLeft: '10px', fontSize: '11px', padding: '5px' }}
                onClick={() => handleReject(params.row)}
              >
                Reject
              </Button>
            );
          } else if (status === 4) {
            return (
              <Button variant="outlined" color="error" style={{ marginLeft: '10px', fontSize: '11px', padding: '5px' }}>
                Rejected
              </Button>
            );
          }
          return null;
        };

        return (
          <>
            {params.row.status === 3 || params.row.status === 5 ? (
              <Button
                variant="outlined"
                style={{
                  color: 'green',
                  borderColor: 'green',
                  fontSize: '11px',
                  padding: '5px'
                }}
                // onClick={() => handleOpenPaymentPage(params.row)}
                onClick={() => status !== 4 && handleAcceptPO(params.row)}
              >
                Payment Done
              </Button>
            ) : (
              <>
                {renderProceedButton()}
                {renderRejectButton()}
              </>
            )}
          </>
        );
      }
    },
    // {
    //   field: 'generate_pfi',
    //   headerName: 'Generate PFI',
    //   width: 180,
    //   renderCell: (params) => (
    //     <div>
    //       <Button
    //         variant="link"
    //         disabled={params.row.status === 3 || params.row.status === 5 ? false : true}
    //         style={{ color: 'blue' }}
    //         onClick={() => handlePfiPO(params.row)}
    //       >
    //         <Chip
    //           sx={{
    //             color: 'black',
    //             ':hover': {
    //               color: 'white'
    //             }
    //           }}
    //           variant={params.row.status === 3 || params.row.status === 5 ? 'outlined' : 'standard'}
    //           label={params.row.status === 3 || params.row.status === 5 ? 'Proceed' : 'Payment Left'}
    //         />
    //       </Button>
    //     </div>
    //   )
    // }
  ];
  const handleRejectSave = async () => {
    if (!remarks.trim()) {
      alert('Please provide remarks before rejecting.');
      return;
    }

    const data = {
      request_id: selectedPaymentRequestId,
      remarks: remarks
    };

    try {
      await axiosInstance.post('api/payment-transactions/reject', data);
      setRejectDialogOpen(false);
      paymentRequestData();
    } catch (error) {
      console.error('Error rejecting the payment:', error);
    }
  };
  const handleRejectClose = (event, reason) => {
    setRejectDialogOpen(false);
    if (reason !== 'backdropClick') {
      handleRejectClose();
    }
  };
  const handleReject = (params) => {
    setSelectedPaymentRequestId(params.payment_request_id);
    setRejectDialogOpen(true);
  };
  const handleViewClick = async (quotation) => {
    setPoData({ ...quotation });
  };
  const handlePfiPO = (quotation) => {
    setPfiData({ ...quotation });
  };
  const handleAcceptPO = async (params) => {
    setPoNum(params);
    setShowPaymentForm(true);
  };
  const paymentRequestData = async () => {
    try {
      const response = await axiosInstance.get(`api/paymentrequests/fortreasury`);
      const mappedData = response.data.map((item, index) => ({
        index: index + 1,
        id: item.payment_request_id,
        payment_request_id: item.payment_request_id,
        po_id: item.po_id,
        po_number: item.po_number,
        po_amount: item.po_amount,
        doc_type: item.doc_type,
        advice_date: item.advice_date,
        advice_amount: item.advice_amount,
        advice_remarks: item.advice_remarks,
        status: item.status,
        created_by: item.created_by,
        updated_by: item.updated_by,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        payment_type_id: item.payment_type_id,
        payment_milestone: item.payment_milestone,
        all_data: item
        // paymentType: {
        //   payment_type_id: item?.paymentType.payment_type_id,
        //   payment_type_name: item?.paymentType.payment_type_name,
        //   created_by: item?.paymentType.created_by,
        //   updated_by: item?.paymentType.updated_by,
        //   createdAt: item?.paymentType.createdAt,
        //   updatedAt: item?.paymentType.updatedAt
        // }
      }));
      setQuotationData(mappedData);
    } catch (error) {
      console.error('Error fetching payment request data:', error);
    }
  };
  //   const getPaymentDetails = async (id) => {
  //     try {
  //       const response = await axiosInstance.get(`/api/payment-transactions/transaction?payment_request_id=${id}
  // `);
  //       console.log('response', response.data);
  //       setPaymentDetails(response.data);
  //     } catch (error) {
  //       console.error('Error fetching payment request data:', error);
  //     }
  //   };

  const handleViewClose = () => {
    setPfiData(null);
    setPoData(null);
    setShowPaymentForm(false);
  };

  const handlePaymentFormClose = () => {
    setShowPaymentForm(false);
  };

  const handleSuccessfulSubmit = () => {
    setShowPaymentForm(false);
  };

  return (
    <>
      <Dialog open={rejectDialogOpen} onClose={handleRejectClose}>
        <DialogTitle style={{ backgroundColor: '#a1bcdb', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', fontSize: '15px' }}>
          Reject Payment
        </DialogTitle>
        <Divider />
        <div style={{ padding: '20px' }}>
          <p>Are you sure you want to reject this payment?</p>
          <Grid item xs={12} sm={2}>
            <TextField
              variant="outlined"
              fullWidth
              id="remarks"
              name="remarks"
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Grid>
        </div>
        <DialogActions>
          <Button onClick={handleRejectClose} color="primary" variant="contained">
            Close
          </Button>
          <Button onClick={handleRejectSave} color="primary" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Start Component */}
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {pfiData ? (
              <span>Create Proforma Invoice</span>
            ) : !showPaymentForm && !showPaymentDetail ? (
              <span>Payment Request List</span>
            ) : (
              <span>Payment Detail</span>
            )}

            {(showPaymentForm || showPaymentDetail) && (
              <PlusButton
                label="Back"
                onClick={() => {
                  setShowPaymentForm(false);
                  setShowPaymentDetail(false);
                }}
              />
            )}
          </Box>
        }
      >
        {showPaymentForm ? (
          <PaymentForm
            poData={poNum}
            onClose={handlePaymentFormClose}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            paymentRequestData={paymentRequestData}
          />
        ) : showPaymentDetail ? (
          <PaymentDetail details={paymentDetails} /> // Pass payment details as props
        ) : poData ? (
          <POView oprViewData={poData} onClose={handleViewClose} />
        ) : pfiData ? (
          <>
            {!company && !pfiDataToShow && (
              <CompanyForPfi
                setPfi={setPfi}
                setPfiDataToShow={setPfiDataToShow}
                setCompany={setCompany}
                oprViewData={pfiData}
                onClose={handleViewClose}
              />
            )}
            {pfiDataToShow && (
              <DocPFI
                pfi={pfi}
                setPfiDataToShow={setPfiDataToShow}
                setCompany={setCompany}
                oprViewData={pfiData}
                onClose={handleViewClose}
              />
            )}
            {company && <PfiMargin pfi={pfi} oprViewData={pfiData} setCompany={setCompany} company={company} onClose={handleViewClose} />}
          </>
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
          </div>
        )}
      </MainCard>
    </>
  );
};

export default Treasury;
