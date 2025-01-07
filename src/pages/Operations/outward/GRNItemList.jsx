import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { Button, Typography, Box, Table, TableBody, TableCell, Grid, TableRow } from '@mui/material';
import { toast } from 'react-toastify';
import CustomNumberField from 'components/NoArrowTextField';
import { GetQuotationItem, GetQuotation } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
const GRNItemList = ({ poGRNData }) => {
  const [marginLine, setMarginLine] = useState({});
  const dispatch = useDispatch();
  const { quotations } = useSelector((state) => state.quotation);
  const [quotationItm, setQuotationItm] = useState([]);
  console.log('poGRNData', poGRNData);
  useEffect(() => {
    GetQuotationItem(dispatch, poGRNData.quo_id);
    GetQuotation(dispatch, poGRNData.quo_id);
  }, []);

  useEffect(() => {
    try {
      axiosInstance.get('/api/po/itemlist?po_id=6').then(({ data }) => {
        const mapdata = data?.map((item, index) => ({
          item_id: item.item_id,
          id: index + 1,
          item_type: item?.ItemsMaster?.item_type,
          itemSpecification: item?.ItemsMaster?.item_code,
          itemDescription: item.po_item_description,
          uom: item.uom,
          item_name: item?.ItemsMaster?.item_name,
          oprQty: item.po_qty,
          opoQty: item.po_qty,
          quoteQty: item.quote_qtd,
          rate: item.rate,
          remarks: item.remarks
        }));
        setQuotationItm(mapdata);
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, []);

  const handleSubmitQuantity = async (e) => {
    e.preventDefault();
    const itemList = Object.values(marginLine);
    const mappedData = {
      buying_house_id: 5,
      po_id: poGRNData.po_id,
      vendor_id: poGRNData.vendor_id,
      po_item_id_lists: [quotationItm.map((item, index) => ({ grn_qty: itemList[index].quantity, po_item_id: item.quo_item_id }))]
    };
    const { data } = await axiosInstance.post('/api/bhouse/grnentry', mappedData);
    toast.success(data.message);
  };

  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category' },
    { field: 'itemSpecification', headerName: 'Item Specification' },
    { field: 'itemDescription', headerName: 'Item Description' },
    { field: 'oprQty', headerName: 'OPO Quantity' },
    { field: 'opoQty', headerName: 'OPO Quantity' },
    { field: 'quoteQty', headerName: 'Quote Quantity' },
    { field: 'quantity', headerName: 'Quantity', width: 150 },
    { field: 'rate', headerName: 'Rate' },
    { field: 'remarks', headerName: 'Remarks', width: 150 }
  ];

  return (
    <>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>
          Goods Received Note Number (
          <span className="text-primary" style={{ color: 'blue' }}>
            {poGRNData.grn_num}
          </span>
          ) GRN Generate By (
          <span className="text-primary" style={{ color: 'blue' }}>
            {poGRNData.created_by}
          </span>
          )
        </h3>
      </Typography>
      <Box>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
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
          </TableBody>
        </Table>
      </Box>
      <div>
        <Typography variant="h6">
          <h3>Items Details</h3>
        </Typography>
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
          pagination={false}
          hideFooterPagination
        />
      </div>
      {/* <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" color="error" sx={{ ml: 2 }}>
          Close
        </Button>
        <Button variant="contained" onClick={handleSubmitQuantity} sx={{ ml: 2 }}>
          Save
        </Button>
      </div> */}
    </>
  );
};

export default GRNItemList;
