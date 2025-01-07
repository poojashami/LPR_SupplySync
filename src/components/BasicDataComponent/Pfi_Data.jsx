import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { GetPFI } from 'Redux/Apis/GetApiCalls';
import React, { useState, useEffect } from 'react';
// import { axiosInstance } from 'utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton } from '@mui/material';

export default function Pfi_Data({ pfi_id }) {
  const [showTableHeading, setShowTableHeading] = useState({
    ItemDetails: true,
    bankDetails: true,
    otherDetails: true,
    basicDetails: true,
    statusDetails: true,
    additionalCharges: true
  });

  const [pfiData, setPfiData] = useState({});

  const dispatch = useDispatch();
  const { pfiData: pfi_data } = useSelector((state) => state.PFISlice);

  useEffect(() => {
    GetPFI(dispatch, pfi_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const pfiData = pfi_data.map((item, index) => ({
        ...item,
        id: index + 1,
        pfi_id: item?.pfi_id,
        pfi_no: item?.pfi_num,
        pfi_description: item?.pfi_description,
        pi_date: item?.createdAt.split('T')[0],
        consignor: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
        consignee: item?.opo_master?.OprMaster?.companyMaster?.company_name,
        pfi_category: item?.opo_master?.OprMaster?.item_super_group_master?.item_super_group_name,
        pfi_general_desc: item?.pfi_description,
        currency: item?.opo_master?.quotation_master?.currency,
        fob_value: item?.amount,
        total_value:
          item?.opo_master?.quotation_master?.additional_costs?.length > 0
            ? Number(item?.amount) +
              item?.opo_master?.quotation_master?.additional_costs?.reduce((acc, amount) => {
                return amount.reference_table_name ? (acc = Number(acc) + Number(amount.charge_amount)) : acc;
              }, 0)
            : Number(item?.amount),
        payment_terms: item?.opo_master?.quotation_master?.payment_terms,
        shipment_type: item?.opo_master?.OprMaster?.shipment_mode_name,
        shipment_window: item?.opo_master?.quotation_master.lead_time,
        pfi_created_by: item?.createdAt,
        opr_no: item?.opo_master?.OprMaster.opr_num,
        pi_sender: item?.pfi_sender_id,
        pi_sender_date: item?.pfi_sent_date,
        pfi_created_time: item?.createdAt?.split('T')[0],
        supplier: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
        buyer: item?.opo_master?.OprMaster?.companyMaster?.company_name,
        port_of_loading: item?.opo_master?.quotation_master?.port_of_loading,
        country_of_origin_of_goods: item?.opo_master?.quotation_master?.country_origin,
        country_of_supply: item?.opo_master?.quotation_master?.country_supply,
        port_of_dc: `${item?.opo_master?.quotation_master?.country_supply} ${item?.opo_master?.quotation_master.port_loading}`,
        final_destination: item?.port_of_destination_name,
        country_of_final_destination: item?.opo_master?.OprMaster.companyMaster.AddressMasters[0].country,
        delivery_time: item?.opo_master?.quotation_master.lead_time,
        delivery_terms: item?.opo_master?.quotation_master.delivery_terms_quo.delivery_terms_name,
        form_m_no: item?.form_ms[0]?.form_m_num,
        ba_num: item?.form_ms[0]?.ba_num,
        lc_num: item?.letter_of_credits[0]?.lc_number,
        bank: item?.bank,
        delivery_time1: item?.opo_master?.quotation_master.lead_time,
        delivery_date: item?.exchange_date,
        inland_charges: item?.inhand_charges,
        freight_charges: item?.freight_charges,
        inspection_charges: item?.inspection_charges,
        thc_fob: item?.thc_charges,
        container_stuffing: item?.container_stuffing,
        shipment_type_name: item?.opo_master?.OprMaster?.shipment_type_name,
        opo_selected_num: item?.opo_selected_num,
        po_num: item?.opo_master?.po_masters[0]?.po_num,
        bl: item?.bl,
        vgm: item?.vgm,
        miscellaneous_fob: item?.miscellaneous_fob,
        thc_doc: item?.thc_charges,
        advising_commission: item?.advising_commission,
        lc_commission: item?.llc_commission,
        courier: item?.courier,
        miscellaneous_doc: item?.miscellaneous_doc,
        approval_status: item?.approval_status,
        payment_mode: item?.payment_mode,
        status_updated_by: item?.status_updated_by,
        status_updated_time: item?.updatedAt,
        status_remarks: item?.status_remarks,
        status: item.status,
        additional_charges: item?.opo_master?.quotation_master.additional_costs,
        pfi_line_items: item?.pfi_line_items
      }));
      setPfiData(pfiData[0]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfi_data]);

  const [ItemData, setItemData] = useState([]);
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'bh_item_name', headerName: 'BH Item Name', width: 200 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },
    {
      headerName: 'NAFDAC Req.',
      field: 'nafdacRequired',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'SON Req.',
      field: 'son_required',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'CRIA Req.',
      field: 'cria_required',
      width: 150,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    { field: 'opo_qty', headerName: 'Quantity', width: 100 },
    { field: 'rate', headerName: `Rate (${pfiData?.currency})`, width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 }
  ];

  useEffect(() => {
    setItemData(
      pfiData?.pfi_line_items?.map((item, index) => ({
        id: index + 1,
        item_type: item?.item_type,
        item_code: item?.item_code,
        item_name: item?.item_name,
        bh_item_name: item?.bh_item_name,
        hsn_code: item?.ItemsMaster?.hsn_code,
        nafdacRequired: item?.ItemsMaster?.nafdacRequired,
        son_required: item?.ItemsMaster?.son_required,
        cria_required: item?.quotation_item?.cria_required,
        opo_qty: item?.opo_qty,
        rate: item?.rate,
        line_total: item?.line_total,
        remarks: item?.remarks,
        no_packs: item?.no_packs,
        pack_size: item?.pack_size,
        pack_type: item?.pack_type_name
      }))
    );
  }, [pfiData]);

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
  return (
    <>
      <Table style={{ padding: '2vh' }}>
        {renderTableHeader('basicDetails', 'PFI Details')}
        {showTableHeading.basicDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Supplier:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.supplier}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Buyer:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.buyer}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.pfi_no}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Created By:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography></Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.pi_date}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  OPR No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.opr_no}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Description:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.pfi_description}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  OPO Num:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.opo_selected_num}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PO Num:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.po_num}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      {/* Other Details Table */}
      <Table style={{ padding: '2vh' }}>
        {renderTableHeader('otherDetails', 'Other Details')}
        {showTableHeading.otherDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Country Of Origin Of Goods:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.country_of_origin_of_goods}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Country Of Supply:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.country_of_supply}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port Of DC:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.port_of_dc}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Final Destination:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.final_destination}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Shipment Type:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.shipment_type_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Delivery Time:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.delivery_time1}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Delivery Time:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.delivery_time}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Delivery Terms:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.delivery_terms}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  FORM M No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.form_m_no}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  BA No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.ba_num}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Payment Term:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.payment_mode}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Loading:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.port_of_loading}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  LC Num.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.lc_num}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Shipment Mode:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.shipment_type}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Table style={{ padding: '2vh' }}>
        {renderTableHeader('bankDetails', 'FORM M Bank Details')}
        {showTableHeading.bankDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank Account Number:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.VendorsBanksDetailsMaster?.bank_account_number}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank IFSC Code:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData?.VendorsBanksDetailsMaster?.bank_ifsc_code}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank Name:
                </Typography>
              </TableCell>
              <TableCell colSpan={5}>
                <Typography>{pfiData?.VendorsBanksDetailsMaster?.bank_name}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      {/* Additional Charges Table */}
      <Table>
        {renderTableHeader('additionalCharges', 'PFI Amount Breakup')}
        {showTableHeading.additionalCharges && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      FOB Cost:
                    </Typography>
                    <Typography>
                      {'  '} {pfiData?.fob_value} {pfiData?.currency}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Inland Charges:
                    </Typography>
                    <Typography>
                      {pfiData?.additional_charges?.reduce((acc, amount) => {
                        return amount.reference_table_name && amount.heading !== 'Freight_Charges'
                          ? (acc = Number(acc) + Number(amount.charge_amount))
                          : acc;
                      }, 0)}{' '}
                      {pfiData?.currency}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Freight Cost:
                    </Typography>
                    <Typography>
                      {pfiData?.additional_charges?.reduce((acc, amount) => {
                        return amount.reference_table_name && amount.heading === 'Freight_Charges'
                          ? (acc = Number(acc) + Number(amount.charge_amount))
                          : acc;
                      }, 0)}{' '}
                      {pfiData?.currency}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3} spacing={2} sx={{ display: 'flex', gap: '12px' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PFI Amount:
                    </Typography>
                    <Typography>
                      {'  '} {pfiData?.total_value} {pfiData?.currency}
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      {ItemData && (
        <>
          <Table>{renderTableHeader('ItemDetails', 'Item Details')}</Table>
          {showTableHeading.ItemDetails && (
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
              <DataGrid
                sx={{
                  minHeight: '20vh',
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
                rows={ItemData}
                columns={stockItemColumns}
                rowHeight={25}
                hideFooter
                hideFooterPagination
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
