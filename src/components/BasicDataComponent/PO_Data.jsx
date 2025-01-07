import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Table, TableBody, TableCell, TableRow, IconButton, TableHead } from '@mui/material';
import 'jspdf-autotable';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { GetPurchaseOrder } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';



const PO_Data = ({ po_id, itemView, onclose }) => {
  const dispatch = useDispatch();
  const { purchaseOrder } = useSelector((state) => state.purchaseOrder);

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

  const [poData, setPoData] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    GetPurchaseOrder(dispatch, po_id);
  }, []);

  useEffect(() => {
    console.log(purchaseOrder);
    const mappedData = purchaseOrder?.map((po, index) => ({
      id: index + 1,
      po_id: po.po_id,
      po_num: po.po_num,
      quo_num: po.opo_nums,
      vendor_id: po.vendor_id,
      vendor_name: po?.VendorsMaster?.vendor_name,
      total_cost: po.total_cost,
      quo_id: po.quo_id,
      created_on: po.created_on.split('T')[0],
      status: po.status,
      final_doc_dispatch_no: po.final_doc_dispatch_no,
      disptach_date: po.disptach_date,
      lead_time: po.lead_time,
      acceptance_remarks: po.acceptance_remarks,
      po_items: po.po_items,
      VendorsMaster: po.VendorsMaster
    }));
    setPoData(mappedData[0]);
    setAllData(purchaseOrder);
  }, [purchaseOrder]);

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

  const [quotationItm, setQuotationItm] = useState(null);

  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'vendor_item_name', headerName: 'Vendor Item Name', width: 200 },
    { field: 'vendor_hs_name', headerName: 'Vendor HS Name', width: 200 },
    { field: 'oprQty', headerName: 'PO Quantity', width: 100 },
    { field: 'tolerance_qty', headerName: 'Tolerance Quantity', width: 100 },
    { field: 'inward_qty', headerName: 'Inward Quantity', width: 100 },
    { field: 'pending_inward_qty', headerName: 'Pending Inward Quantity', width: 100 },
    { field: 'pending_outward_qty', headerName: 'Pending Outward Quantity', width: 100 },
    { field: 'qty_uom', headerName: 'Quantity UOM', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'tax', headerName: 'TAX', width: 100 },
    { field: 'tax_assess_value', headerName: 'TAX Assess Value', width: 100 },
    { field: 'total_tax_value', headerName: 'Total Tax Value', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 },
    { field: 'opo_num', headerName: 'OPO Num', width: 120 }
  ];

  useEffect(() => {
    const mapdata = poData?.po_items?.map((item, index) => ({
      id: index + 1,
      item_type: item?.item_type,
      item_name: item?.item_name,
      item_code: item?.item_code,
      no_packs: item?.no_packs,
      oprQty: item?.po_qty,
      pack_size: item?.pack_size,
      pack_type: item?.pack_type,
      line_total: item?.line_total,
      rate: item?.rate,
      opo_num: item?.opo_num,
      tolerance_qty: item.ItemsMaster?.tolerance,
      qty_uom: item.ItemsMaster?.uom
    }));
    setQuotationItm(mapdata);
  }, []);

  return (
    <>
      <MainCard>
        <Typography variant="h6">
          <h3 style={{ padding: '0', margin: '0' }}>
            Purchase Order Number (
            <span className="text-primary" style={{ color: 'blue' }}>
              {poData?.po_num}
            </span>
            ) Purchase Order Generate Date (
            <span className="text-primary" style={{ color: 'blue' }}>
              {poData?.created_on?.split('T')[0]}
            </span>
            )
          </h3>
        </Typography>

        <Box sx={{ marginBottom: '10px' }}>
          <Table>
            {renderTableHeader('otherDetails', 'Basic Details')}
            {showTableHeading.otherDetails && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          PO Num:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.po_num}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          OPO Nums:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.quo_num}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Delivery Time:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.lead_time}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Delivery Terms:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Payment Terms:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Tolerance:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Remarks:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.acceptance_remarks}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Additional Remarks:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Freight, Packaging & Forwading Instructions:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Aceptance Copy:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Received Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Lead Time Start From:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Table>
            {renderTableHeader('basicDetails', 'Vendor Details')}
            {showTableHeading.basicDetails && (
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
                        <Typography>{poData?.VendorsMaster?.vendor_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vendor Num:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.VendorsMaster?.vendor_series}</Typography>
                      </Grid>
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Currency:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography></Typography>
                      </Grid> */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vendor Quo No:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{allData[0]?.quotation_master?.quo_num}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vendor Quo Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>
                          {console.log('allData', allData)}
                          {allData[0]?.quotation_master?.quo_date}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Contact Person:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.VendorsMaster?.contact_person}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Contact Person Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.VendorsMaster?.contact_person_email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{poData?.VendorsMaster?.email}</Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          {quotationItm && quotationItm.length > 0 && itemView && (
            <>
              <Table>{renderTableHeader('otherDetails', 'Items Details')}</Table>
              {showTableHeading.otherDetails && (
                <>
                  <div style={{ overflowX: 'scroll' }}>
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      sx={{
                        minHeight: '30vh',
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
                      scrollbarSize={10}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </Box>
        {onclose && (
          <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" onClick={onClose} sx={{ ml: 2 }}>
              Close
            </Button>
          </div>
        )}
      </MainCard>
    </>
  );
};

export default PO_Data;
