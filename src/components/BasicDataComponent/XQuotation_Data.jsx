import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Button, TableHead, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';
import { GetQuotation, GetQuotationItem } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const Quotation_Data = ({ quo_id, onClose, ItemStatus }) => {
  const dispatch = useDispatch();
  const { quotations } = useSelector((state) => state.quotation);
  const [quotationItm, setQuotationItm] = useState(null);

  const [quotationData, setQuotationData] = useState({});
  console.log('QuoDocs', quotationData);

  useEffect(() => {
    GetQuotation(dispatch, quo_id);
  }, []);

  useEffect(() => {
    const mappedData = quotations?.map((item, index) => ({
      id: index + 1,
      quo_id: item?.quo_id,
      quo_num: item?.quo_num,
      rfq_id: item?.rfq_id,
      rfq_num: item?.reference_no,
      vendor_name: item?.VendorsMaster.vendor_name,
      referenceDate: item?.reference_date,
      quo_date: item?.quo_date,
      currency: item?.currency,
      delivery_terms: item?.delivery_terms_name,
      country_origin: item?.country_origin,
      country_supply: item?.country_supply,
      port_loading: item?.port_loading,
      lead_time: item?.lead_time,
      payment_terms: item?.payment_terms,
      remarks: item?.remarks,
      total_cost: item?.total_cost,
      quotation_items: item?.quotation_items,
      QuoDocs: item?.QuoDocs,
      additional_costs: item?.additional_costs
    }));

    setQuotationData(mappedData[0]);
  }, [quotations]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additinalCost: true,
    ItemDetails: true,
    ReqDocsDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
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

  useEffect(() => {
    GetQuotationItem(dispatch, quotationData.quo_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mapdata = quotationData?.quotation_items?.map((item, index) => ({
      id: index + 1,
      item_type: item.item_type,
      item_name: item.item_name,
      item_code: item.item_code,
      no_packs: item.no_packs,
      oprQty: item.opr_qty,
      pack_size: item.pack_size,
      pack_type: item.pack_type,
      line_total: item.line_total,
      quoteQty: item.quote_qtd,
      rate: item.rate,
      remarks: item.remarks
    }));
    setQuotationItm(mapdata);
  }, []);

  // Define columns for quotationItm table
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'oprQty', headerName: 'OPR Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 },
    { field: 'remarks', headerName: 'Remarks', width: 150 }
  ];

  return (
    <MainCard>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>
          Quotation Number (
          <span className="text-primary" style={{ color: 'blue' }}>
            {quotationData?.quo_num}
          </span>
          ) Against RFQ No. (
          <span className="text-primary" style={{ color: 'blue' }}>
            {quotationData?.rfq_num}
          </span>
          )
        </h3>
      </Typography>
      <Box sx={{ marginBottom: '10px' }}>
        <Table>
          {renderTableHeader('basicDetails', 'Basic Details')}
          {showTableHeading.basicDetails && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center" marginTop={1}>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Vendor Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.vendor_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        RFQ No:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.rfq_num}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        RFQ Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.referenceDate}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Quotation Date:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.quo_date}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Currency:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.currency}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Delivery Terms:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.delivery_terms}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('otherDetails', 'Logictics Details')}
          {showTableHeading.otherDetails && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center" marginTop={1}>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Country of Origin:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.country_origin}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Country of Supply:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.country_supply}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Port of Loading:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.port_loading}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Lead Time:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{quotationData?.lead_time}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Payment Terms:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography>{quotationData?.payment_terms}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Remarks:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography>{quotationData?.remarks}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Total Cost:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography>{quotationData?.total_cost}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('ReqDocsDetails', 'Docs Details')}
          {showTableHeading.ReqDocsDetails && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  {/* <Grid container spacing={2} alignItems="center"> */}
                  {quotationData?.QuoDocs?.map((item, index) => (
                    <Grid container spacing={2} alignItems="center" key={index}>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Document Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{item.q_doc_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Remarks:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{item.q_doc_remarks}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Document:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{item.q_doc_file ? 'View Document' : 'File Not Given'}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                  {/* </Grid> */}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('additinalCost', 'Additional Cost Details')}
          {showTableHeading.additinalCost && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    {quotationData?.additional_costs?.map((cost, index) => (
                      <Grid item xs={12} sm={3} key={index} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          {cost?.charge_name?.replace(/_/g, ' ')}:
                        </Typography>
                        <Typography>
                          {'  '} {cost?.charge_amount}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        {quotationItm && quotationItm.length > 0 && ItemStatus && (
          <Table>
            {renderTableHeader('ItemDetails', 'Items Details')}
            {showTableHeading.ItemDetails && (
              <>
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
          </Table>
        )}

        {onClose && (
          <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
            <Button color="primary" variant="contained" onClick={onClose}>
              Close
            </Button>
          </Box>
        )}
      </Box>
    </MainCard>
  );
};

export default Quotation_Data;
