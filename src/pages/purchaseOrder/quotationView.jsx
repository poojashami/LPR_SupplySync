import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from '@mui/material';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';
import { GetQuotationItem } from 'Redux/Apis/GetApiCalls';
import { POSubmit } from 'Redux/Apis/PostApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';

const ViewQuotation = ({ oprViewData, onClose }) => {
  const dispatch = useDispatch();
  const { quotationItem } = useSelector((state) => state.quotation);
  // const { quoCharges } = useSelector((state) => state.quotation);
  const [quotationItm, setQuotationItm] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const GeneratePO = async () => {
    setOpenDialog(true);
  };
  const handleConfirmDialogClose = async (confirmed) => {
    if (confirmed) {
      try {
        const SendData = {
          // quo_id, quo_num, total_cost, vendor_id,
          quo_id: oprViewData.quo_id,
          quo_num: oprViewData.quo_num,
          total_cost: oprViewData.total_cost,
          rfq_id: oprViewData.rfq_id,
          vendor_id: oprViewData.vendor_id
        };

        await POSubmit(dispatch, SendData);
        console.log('Generate Purchase Order', SendData);
        // Close the form dialog after submission
        onClose();
      } catch (error) {
        console.error('Error confirming OPR items:', error);
        // Handle error scenario if needed
      }
    } else {
      // Handle cancellation logic
    }
    setOpenDialog(false); // Close the dialog after handling action
  };

  useEffect(() => {
    GetQuotationItem(dispatch, oprViewData.quo_id);
  }, []);

  useEffect(() => {
    console.log(quotationItem);
    const mapdata = quotationItem?.map((item, index) => ({
      id: index + 1,
      item_type: item.item_type,
      itemSpecification: item.item_specification,
      itemDescription: item.item_description,
      oprQty: item.opr_qty,
      opoQty: item.opo_qtd,
      quoteQty: item.quote_qtd,
      rate: item.rate,
      remarks: item.remarks
    }));
    setQuotationItm(mapdata);
  }, [quotationItem]);

  // Define columns for quotationItm table
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'itemSpecification', headerName: 'Item Specification', width: 200 },
    { field: 'itemDescription', headerName: 'Item Description', width: 200 },
    { field: 'oprQty', headerName: 'OPO Quantity', width: 100 },
    { field: 'opoQty', headerName: 'OPO Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'remarks', headerName: 'Remarks', width: 150 }
  ];

  return (
    <MainCard>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>
          Quotation Number (
          <span className="text-primary" style={{ color: 'blue' }}>
            {oprViewData.quo_num}
          </span>
          ) Against RFQ No. (
          <span className="text-primary" style={{ color: 'blue' }}>
            {oprViewData.rfq_num}
          </span>
          )
        </h3>
      </Typography>
      <Box sx={{ marginBottom: '10px' }}>
        <Table>
          <TableBody>
            <TableCell>
              <Typography variant="h6">
                {/* <br></br> */}
                <h3>Basic Info</h3>
              </Typography>
            </TableCell>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center" marginTop={1}>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.vendor_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Reference No:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.referenceNo}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Reference Date:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.referenceDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Quotation Date:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.quo_date}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Currency:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.currency}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Delivery Terms:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.delivery_terms}</Typography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
            <TableCell>
              <Typography variant="h6">
                {/* <br></br> */}
                <h3>LOGISTICS</h3>
              </Typography>
            </TableCell>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center" marginTop={1}>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Country of Origin:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.country_origin}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Country of Supply:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.country_supply}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Port of Loading:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.port_loading}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Lead Time:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{oprViewData.lead_time}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Payment Terms:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography>{oprViewData.payment_terms}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Remarks:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography>{oprViewData.remarks}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Total Cost:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography>{oprViewData.total_cost}</Typography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {quotationItm && quotationItm.length > 0 && (
          <>
            <Typography variant="h6" style={{ textAlign: 'center', justifyContent: 'centre', margin: '20px' }}>
              <h3>Items Details</h3>
            </Typography>
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
                rows={quotationItm}
                columns={stockItemColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          </>
        )}

        <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
          <Button style={{ color: 'black' }} onClick={onClose}>
            Close
          </Button>
          <Button color="primary" variant="contained" onClick={GeneratePO}>
            Generate PO
          </Button>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs">
        <DialogTitle>Confirm Submit</DialogTitle>
        <DialogContent>
          Are you sure you want to Generate Purchase Order of against Quotation Number: <b>{oprViewData.quo_num}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDialogClose(false)} color="error">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmDialogClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ViewQuotation;
