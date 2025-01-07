import React, { useState, useEffect, useRef } from 'react';
import { GetQuotationItem, GetQuotationCharges, GetQuotation } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Button, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import logo from '../../../assets/images/LogoB.png';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
// import {logo} from '../../../public/Images/LogoB.png';
// import { QuotationChargesSubmit } from 'Redux/Apis/PostApiCalls';

const POView = ({ oprViewData, onClose }) => {
  const dispatch = useDispatch();

  console.log('oprViewData.........................', oprViewData);

  const { quotationItem } = useSelector((state) => state.quotation);
  // const { quoCharges } = useSelector((state) => state.quotation);
  const { quotations } = useSelector((state) => state.quotation);
  const [quotationItm, setQuotationItm] = useState(null);

  useEffect(() => {
    GetQuotationItem(dispatch, oprViewData.quo_id);
    GetQuotation(dispatch, oprViewData.quo_id);
  }, []);

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

  useEffect(() => {
    const mapdata = quotationItem?.map((item, index) => ({
      id: index + 1,
      item_type: item.item_type,
      itemSpecification: item.item_specification,
      itemDescription: item.item_description,
      uom: item.uom,
      item_name: item.item_name,
      oprQty: item.opr_qty,
      opoQty: item.opo_qtd,
      quoteQty: item.quote_qtd,
      rate: item.rate,
      remarks: item.remarks
    }));
    setQuotationItm(mapdata);
  }, [quotationItem]);

  return (
    <>
      <MainCard>
        <Typography variant="h6">
          <h3 style={{ padding: '0', margin: '0' }}>
            Purchase Order Number (
            <span className="text-primary" style={{ color: 'blue' }}>
              {oprViewData.po_num}
            </span>
            ) Purchase Order Generate Date (
            <span className="text-primary" style={{ color: 'blue' }}>
              {/* {oprViewData.created_on.split('T')[0]} */}
            </span>
            )
          </h3>
        </Typography>

        <Box sx={{ marginBottom: '10px' }}>
          <Table>
            <TableBody>
              <TableCell>
                <Typography variant="h6">
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
                      <Typography>{quotations[0]?.vendorName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Quotation Num:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.quo_num}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Reference No:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.reference_no}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Reference Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.reference_date}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Quotation Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.quo_date}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Currency:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.currency}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Delivery Terms:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.delivery_terms_name}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
              <TableCell>
                <Typography variant="h6">
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
                      <Typography>{quotations[0]?.country_origin}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Country of Supply:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.country_supply}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Port of Loading:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.port_loading}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Lead Time:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotations[0]?.lead_time_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Payment Terms:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography>{quotations[0]?.payment_terms}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Remarks:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography>{quotations[0]?.remarks}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Total Cost:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography>{quotations[0]?.total_cost}</Typography>
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
                <DataGrid getRowHeight={() => 'auto'}
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
          }} rows={quotationItm} columns={stockItemColumns} pageSize={5} rowsPerPageOptions={[5]} />
              </div>
            </>
          )}
        </Box>
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" onClick={onClose} sx={{ ml: 2 }}>
            Close
          </Button>
        </div>
      </MainCard>
    </>
  );
};

export default POView;
