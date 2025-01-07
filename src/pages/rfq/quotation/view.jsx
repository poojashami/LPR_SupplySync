import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from 'utils/axiosInstance';
import { GetQuotationItem } from 'Redux/Apis/GetApiCalls';
import CustomTypography from 'components/CustomTypography';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Button, TableHead, IconButton } from '@mui/material';

const ViewQuotation = ({ oprViewData, onClose }) => {
  console.log('QuoDocs', oprViewData);
  const dispatch = useDispatch();
  const [quotationItm, setQuotationItm] = useState(null);
  const [bh_Data, setBhData] = useState(null);

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additinalCost: true,
    ItemDetails: true,
    ReqDocsDetails: true,
    ReqDocumentssDetails: true,
    rfq_Details: true,
    BreakupAmountDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const fetch_buying_house = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/bhouse/buyinghouses?buying_house_id=${id}`);
      setBhData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (oprViewData?.RfqMaster?.buying_house_id) {
      fetch_buying_house(oprViewData?.RfqMaster?.buying_house_id);
    }
  }, [oprViewData]);

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
    GetQuotationItem(dispatch, oprViewData.quo_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mapdata = oprViewData?.quotation_items?.map((item, index) => ({
      id: index + 1,
      item_type: item.item_type,
      item_name: item.item_name,
      item_name_label: item.item_name_label,
      item_name_vendor: item.item_name_vendor,
      item_code: item.item_code,
      item_uom: item?.uom_name,
      no_packs: item.no_packs,
      oprQty: item.opr_qty,
      pack_size: item.pack_size,
      pack_type: item.pack_type_name,
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
    { field: 'item_type', headerName: 'Item Category', width: 150 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_name_vendor', headerName: 'Vendor Item Name', width: 200 },
    { field: 'item_name_label', headerName: 'Label Item Name', width: 200 },
    { field: 'oprQty', headerName: 'OPR Quantity', width: 100 },
    { field: 'quoteQty', headerName: 'Quote Quantity', width: 100 },
    { field: 'item_uom', headerName: 'Item UOM', width: 100 },
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
            {oprViewData.quo_num}
          </span>
          ) Against RFQ No. (
          <span className="text-primary" style={{ color: 'blue' }}>
            {oprViewData.rfq_num}
          </span>
          )
        </h3>
      </Typography>

      <Table>{renderTableHeader('rfq_Details', 'Buying House Info')}</Table>
      {showTableHeading.rfq_Details && (
        <Table>
          <TableRow>
            <TableCell>Consignee Name :</TableCell>
            <TableCell>{bh_Data?.buying_house_name}</TableCell>

            <TableCell>Consignee Code :</TableCell>
            <TableCell>{bh_Data?.buying_house_code}</TableCell>

            <TableCell>Contact Number :</TableCell>
            <TableCell>{bh_Data?.contact_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contact email :</TableCell>
            <TableCell>{bh_Data?.contact_email}</TableCell>

            <TableCell>Address :</TableCell>
            <TableCell
              colSpan={4}
            >{`${bh_Data?.address_line1}, ${bh_Data?.address_line2} ,${bh_Data?.city},${bh_Data?.state},${bh_Data?.country},${bh_Data?.postal_code}`}</TableCell>
          </TableRow>
        </Table>
      )}

      <Box sx={{ marginBottom: '10px' }}>
        <Table>{renderTableHeader('basicDetails', 'Basic Details')}</Table>
        <Table>
          {showTableHeading.basicDetails && (
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: '500' }}>Vendor Name</TableCell>
                <TableCell>{oprViewData.vendor_name}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>RFQ No</TableCell>
                <TableCell>{oprViewData.rfq_num}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>RFQ Date</TableCell>
                <TableCell>{oprViewData.referenceDate}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Quotation Date</TableCell>
                <TableCell>{oprViewData.quo_date}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: '500' }}>Currency</TableCell>
                <TableCell>{oprViewData.currency}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Delivery Terms</TableCell>
                <TableCell>{oprViewData.delivery_terms}</TableCell>

                <TableCell sx={{ fontWeight: '500' }}>Lead Initiated Point</TableCell>
                <TableCell>{oprViewData.lead_initiation_point}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Quote Valid Till</TableCell>
                <TableCell>{oprViewData?.quo_valid_till}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>{renderTableHeader('otherDetails', 'Logictics Details')}</Table>
        <Table>
          {showTableHeading.otherDetails && (
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: '500' }}>Country of Origin</TableCell>
                <TableCell>{oprViewData.country_origin}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Country of Supply</TableCell>
                <TableCell>{oprViewData.country_supply}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Port of Loading</TableCell>
                <TableCell>{oprViewData.port_loading}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Lead Time</TableCell>
                <TableCell>{oprViewData.lead_time}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: '500' }}>Payment Terms</TableCell>
                <TableCell>
                  {oprViewData.payment_milestones?.reduce((mainStr, obj) => {
                    return (mainStr += obj?.milestone + ' ' + obj?.percentage + '%' + ' - ' + obj?.initiated_point + ', ');
                  }, '')}
                </TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Remarks</TableCell>
                <TableCell>{oprViewData.remarks}</TableCell>
                {/* <TableCell sx={{ fontWeight: '500' }}>Product Cost</TableCell>
                <TableCell>{formatNumber(oprViewData.total_cost)}</TableCell> */}
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('ReqDocumentssDetails', 'Require Docs')}
          {showTableHeading.ReqDocumentssDetails && (
            <Table>
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={3}>
                    <Grid container spacing={2} alignItems="start">
                      <Grid item xs={12} sm={6}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <CustomTypography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Require Docs
                                </CustomTypography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ backgroundColor: '#DCDCDC' }}>
                            <TableRow>
                              <TableCell>
                                <CustomTypography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Doc Name
                                </CustomTypography>
                              </TableCell>
                              <TableCell>
                                <CustomTypography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Remarks
                                </CustomTypography>
                              </TableCell>
                              <TableCell>
                                <CustomTypography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Is Available
                                </CustomTypography>
                              </TableCell>
                            </TableRow>
                            {oprViewData?.quo_require_docs?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <CustomTypography>{item.doc_name}</CustomTypography>
                                </TableCell>
                                <TableCell>
                                  <CustomTypography>{item.doc_remarks}</CustomTypography>
                                </TableCell>
                                <TableCell>
                                  <CustomTypography>{item.isAvailable === 'true' ? 'Yes' : 'No'}</CustomTypography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <CustomTypography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Docs Details
                                </CustomTypography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ backgroundColor: '#DCDCDC' }}>
                            <TableRow>
                              <TableCell>
                                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Doc Name
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Remarks
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                  Document
                                </Typography>
                              </TableCell>
                            </TableRow>
                            {oprViewData?.QuoDocs?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography>{item.q_doc_name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{item.q_doc_remarks}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{item.q_doc_file ? 'View Document' : 'File Not Given'}</Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Table>

        {/* <Table>
          {renderTableHeader('ReqDocsDetails', 'Docs Details')}
          {showTableHeading.ReqDocsDetails && (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Doc Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Remarks
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Document
                  </Typography>
                </TableCell>
              </TableRow>
              {oprViewData?.QuoDocs?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography>{item.q_doc_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.q_doc_remarks}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.q_doc_file ? 'View Document' : 'File Not Given'}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table> */}

        <Table>
          {renderTableHeader('additinalCost', 'Additional Cost Details')}
          {showTableHeading.additinalCost && (
            <>
              {/* <TableBody>
              {oprViewData?.additional_costs?.map((cost, index) => (
                <TableRow key={index}>
                  <TableCell width={20}>
                    <CustomTypography variant="subtitle1" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {cost?.charge_name?.replace(/_/g, ' ')}
                    </CustomTypography>
                  </TableCell>
                  <TableCell width={20}>
                    <CustomTypography>{cost?.charge_amount}</CustomTypography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
              <Table sx={{ borderCollapse: 'collapse' }}>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2} sx={{ padding: 0 }}>
                      <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ width: '50%', verticalAlign: 'top', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                              <Table sx={{ width: '100%' }}>
                                <TableBody>
                                  {oprViewData?.additional_costs
                                    ?.filter((i) => !i.reference_id && i?.charges_by === 'Supplier')
                                    ?.slice(0, Math.ceil(oprViewData.additional_costs.length / 2))
                                    ?.map((cost, index) => (
                                      <TableRow key={index} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <TableCell
                                          sx={{
                                            textTransform: 'capitalize',
                                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                                            padding: '8px'
                                          }}
                                        >
                                          {cost?.charge_name?.replace(/_/g, ' ')}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px' }}>{cost?.charge_amount}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                            <TableCell sx={{ width: '50%', verticalAlign: 'top' }}>
                              <Table sx={{ width: '100%' }}>
                                <TableBody>
                                  {oprViewData?.additional_costs
                                    ?.filter((i) => !i.reference_id)
                                    ?.slice(Math.ceil(oprViewData.additional_costs.length / 2))
                                    ?.map((cost, index) => (
                                      <TableRow key={index} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <TableCell
                                          sx={{
                                            textTransform: 'capitalize',
                                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                                            padding: '8px'
                                          }}
                                        >
                                          {cost?.charge_name?.replace(/_/g, ' ')}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px' }}>{cost?.charge_amount}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </Table>

        <Table>{renderTableHeader('BreakupAmountDetails', 'Quotation Amount Breakup')}</Table>
        <Table>
          {showTableHeading.BreakupAmountDetails && (
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: '500' }}>FOB Cost</TableCell>
                <TableCell>{oprViewData.total_cost}</TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Inland Charges:</TableCell>
                <TableCell>
                  {oprViewData?.additional_costs?.reduce((acc, charge) => {
                    return charge.heading !== 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                  }, 0)}
                  {` `}
                  {oprViewData?.currency}
                </TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Freight Cost:</TableCell>
                <TableCell>
                  {oprViewData?.additional_costs?.reduce((acc, charge) => {
                    return charge.heading === 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                  }, 0)}
                  {` `}
                  {oprViewData?.currency}
                </TableCell>
                <TableCell sx={{ fontWeight: '500' }}>Quotation Amount:</TableCell>
                <TableCell>
                  {oprViewData.total_cost +
                    oprViewData?.additional_costs?.reduce((acc, charge) => {
                      return charge.heading === 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                    }, 0) +
                    oprViewData?.additional_costs?.reduce((acc, charge) => {
                      return charge.heading !== 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                    }, 0)}
                  {` `}
                  {oprViewData?.currency}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        {quotationItm && quotationItm.length > 0 && (
          <Table>
            {renderTableHeader('ItemDetails', 'Items Details')}
            {showTableHeading.ItemDetails && (
              <>
                <div style={{ overflowX: 'auto', width: '98dvw' }}>
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
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    hideFooter
                    hideFooterPagination
                    hideFooterSelectedRowCount
                  />
                </div>
              </>
            )}
          </Table>
        )}

        <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
          <Button color="primary" variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </MainCard>
  );
};

export default ViewQuotation;
