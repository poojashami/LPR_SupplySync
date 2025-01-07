import { Box, Divider, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import QuotationForm from '../quotation/quotation-form';
import QuotationView from './poView';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Dialog, DialogTitle, DialogActions, TextField, Button } from '@mui/material';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';

export default function QuotationPage() {
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotationData, setQuotationData] = useState([]);
  const [poData, setPoData] = useState(null);
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState(false);
  const [poNum, setPoNum] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const TableHeader = [
    { field: 'po_id', headerName: 'PO ID', width: 80 },
    {
      field: 'po_num',
      headerName: 'Purchase Order Number',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
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
      headerName: 'PO Status',
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value === '3' || params.value === 3 ? (
            <Button
              variant="text"
              style={{ border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}
              onClick={() => handleAcceptPO(params.row)}
            >
              Acceptance Pending
            </Button>
          ) : params.value === '6' || params.value === 6 ? (
            <Button variant="text" style={{ color: 'green', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Payment Done & Accepted
            </Button>
          ) : params.value === '4' ? (
            <Button variant="text" style={{ color: 'red', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Rejected By Vendor
            </Button>
          ) : params.value === '5' ? (
            <Button variant="text" style={{ color: 'orange', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Accepted
            </Button>
          ) : params.value === '7' ? (
            <Button variant="text" style={{ color: 'red', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Rejected By Buying HousePayment Request List

            </Button>
          ) : (
            <Button variant="text" style={{ color: 'orange', border: '1px solid #e5e0e0', borderRadius: '8px', fontSize: '0.75rem' }}>
              Payment Processing...
            </Button>
          )}
        </div>
      )
    }
  ];
  console.log(poNum);

  const handleSave = async () => {
    if (confirmation === 'yes') {
      try {
        const { data } = await axiosInstance.post('api/service/pos/accpetvend', { service_po_id: poNum.po_id, remarks });
        toast.success(data.message);
        fetchData();
      } catch (error) {
        toast.error(error.success);
      }
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewClick = async (quotation) => {
    console.log('Clicked');
    setPoData({ ...quotation });
  };

  const handleAcceptPO = async (params) => {
    setPoNum(params);
    setOpen(true);
  };

  const handleRadioChange = (event) => {
    setConfirmation(event.target.value);
  };

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/service/pos/vacceptance');
      console.log(data);

      const mappedData = data?.map((po, index) => ({
        id: index + 1,
        po_id: po?.po_id || '',
        po_num: po?.po_num || '',
        quo_num: po?.quo_num || '',
        vendor_id: po?.vendor_id || '',
        total_cost: po?.total_cost || '',
        quo_id: po?.quo_id || '',
        created_on: po?.createdAt.split('T')[0] || '',
        status: po?.status || ''
      }));

      setQuotationData(mappedData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewClose = () => {
    setPoData(null);
    setShowQuotationForm(false);
  };
  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showQuotationForm ? <span>Accept Purchase Order </span> : <span>Create Quotation</span>}

            {/* {!showQuotationForm ? (
              <Button color="primary" className="plus-btn-color" onClick={handleCreateOpr}>
                + Create Quotation
              </Button>
            ) : (
              <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
                Back
              </Button>
            )} */}
          </Box>
        }
      >
        {poData ? (
          <QuotationView oprViewData={poData} onClose={handleViewClose} />
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
                  maxHeight: '50vh',
                  height: '46vh',
                  width: '75vh',
                  border: '10px solid #a1bcdb'
                }
              }}
            >
              <DialogTitle style={{ backgroundColor: '#a1bcdb' }}>
                Purchase Order No.- <b style={{ color: 'blue' }}>({poNum.po_num})</b> Dt-<b style={{ color: 'blue' }}>{poNum.created_on}</b>
              </DialogTitle>
              <Divider />
              <div style={{ padding: '20px' }}>
                <p>
                  {/* Are you sure you want to confirm PO num is <b>({poNum.po_num})</b>, date is <b>({poNum.created_on})</b> and Amount is
                  <b>({poNum.total_cost})</b> ? */}
                  <b>Do you want to confirm this Purchase Order (PO)?</b>
                </p>
                <FormControl>
                  {/* <FormLabel id="demo-radio-buttons-group-label">Are You Sure to Confirm this PO?</FormLabel> */}
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    style={{ display: 'flex', width: '100%', flexDirection: 'row' }}
                    value={confirmation}
                    onChange={handleRadioChange}
                  >
                    <div>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    </div>
                    <div>
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </div>
                  </RadioGroup>
                </FormControl>
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
