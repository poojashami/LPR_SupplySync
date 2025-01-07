import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Button, TableHead, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { axiosInstance } from 'utils/axiosInstance';

// const OpoView = ({ opos }) => {
const OPO_Data = ({ opo_master_id, itemStatus }) => {
  // console.log('QuoDocs', opos);

  const [opos, setOpos] = useState({});

  const fetch_data = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/opo?opo_master_id=${opo_master_id}`);
      console.log(data);
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        opo_num: item?.opo_num,
        quo_num: item?.quo_num,
        item_id: item?.opo_items,
        vendor_id: item?.vendor_id,
        opo_id: item?.opo_master_id,
        lead_time: item?.quotation_master?.lead_time,
        vendor_name: item?.VendorsMaster?.vendor_name,
        total_cost: item?.quotation_master?.total_cost,
        vendor_num: item?.VendorsMaster?.vendor_series,
        payment_term: item?.quotation_master?.payment_terms,
        payment_term_id: item?.quotation_master?.payment_terms,
        delivery_term: item?.quotation_master?.delivery_terms_name,
        delivery_term_id: item?.quotation_master?.delivery_terms,
        total_cost_usd: item?.quotation_master?.total_cost,
        procurement_justification: item.procurement_justification,
        unit_justification: item.unit_justification,
        opo_description: item.opo_description,
        quotation_master: item?.quotation_master,
        OprMaster: item?.OprMaster,
        VendorsMaster: item?.VendorsMaster,
        opo_items: item?.opo_items
      }));
      console.log('mappedData', mappedData[0]);
      setOpos(mappedData[0]);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  const [quotationItm, setQuotationItm] = useState([]);

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
  console.log('opos?.opo_items', opos?.opo_items);
  useEffect(() => {
    const mapdata = opos?.opo_items?.map((item, index) => ({
      id: index + 1,
      item_type: item?.item_type,
      item_name: item?.item_name,
      item_code: item?.item_code,
      item_description: item?.ItemsMaster?.item_description,
      hsn_code: item?.ItemsMaster?.hsn_code,
      cria: item?.ItemsMaster?.cria,
      nafdac_name: item?.ItemsMaster?.nafdac_name,
      no_packs: item?.no_packs,
      oprQty: item?.opr_qty,
      pack_size: item?.pack_size,
      pack_type: item?.pack_type_name,
      line_total: item?.line_total,
      quoteQty: item?.quote_qtd,
      rate: item?.rate,
      remarks: item?.remarks
    }));
    setQuotationItm(mapdata);
  }, []);

  // Define columns for quotationItm table
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_description', headerName: 'Item Description', width: 200 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },
    { field: 'cria', headerName: 'CRIA', width: 100 },
    { field: 'son', headerName: 'SON', width: 100 },
    { field: 'nafdac_name', headerName: 'NAFDAC', width: 100 },
    { field: 'oprQty', headerName: 'OPR Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 }
  ];

  return (
    <MainCard>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0.5vh' }}>
          OPO Number (
          <span className="text-primary" style={{ color: 'blue' }}>
            {opos?.opo_num}
          </span>
          ) Against Quotation No. (
          <span className="text-primary" style={{ color: 'blue' }}>
            {opos?.quo_num}
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
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Vendor Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.vendor_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Quotation Reference No:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.reference_no}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        OPR Nums:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.currency}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Currency:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.currency}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Port of Loading:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.port_loading}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Delivery Terms:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.delivery_terms_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Payment Terms:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.payment_terms}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Quotation Remarks:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.remarks}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Unit:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography></Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        FORM M No.:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography></Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        LC No.:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography></Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Country of Origin:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.country_origin}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Country of Supply:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.country_supply}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Shipment Mode:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.OprMaster?.ShipMode?.shipment_mode_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Shipment Type:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.delivery_terms_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Port of Loading:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.port_loading}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Port of DC:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography></Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Country of DC:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography></Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Delivery Time:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{`${opos?.quotation_master?.delivery_terms} Weeks`}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Delivery Location:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.quotation_master?.port_of_loading}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        OPO Description:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos.opo_description}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('otherDetails', 'OPR Details')}
          {showTableHeading.otherDetails && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Vertical:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.OprMaster?.vertical_opr?.vertical_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Company:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.OprMaster?.companyMaster?.company_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Department:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.OprMaster?.Division?.division_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Ship Mode:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.OprMaster?.ShipMode?.shipment_mode_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Buying House:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos?.OprMaster?.BuyingHouse?.buying_house_name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Unit Justification:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos.unit_justification}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Procurement Justification:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>{opos.procurement_justification}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('additinalCost', 'Additional Charges')}
          {showTableHeading.additinalCost && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    {opos?.quotation_master?.additional_costs?.map((cost, index) => (
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

        {quotationItm && quotationItm.length > 0 && itemStatus && (
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
                        border: '1px solid rgba(224, 224, 224, 1)',
                        height: '25px !important',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      },
                      '& .MuiDataGrid-scrollbar': {
                        height: '8px'
                      }
                    }}
                    rows={quotationItm}
                    columns={stockItemColumns}
                    hideFooter
                    hideFooterPagination
                  />
                </div>
              </>
            )}
          </Table>
        )}
      </Box>
    </MainCard>
  );
};

export default OPO_Data;
