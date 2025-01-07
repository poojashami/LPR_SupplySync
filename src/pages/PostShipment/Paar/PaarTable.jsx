import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, MenuItem, IconButton, Menu, Button } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paar from './Paar';

const PaarTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [paarData, setPaarData] = useState([]);
  const [paarForm, setPaarForm] = useState(false);
  const [paarRowData, setPaarRowData] = useState({});
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleOpenPaar = (data) => {
    setPaarRowData(data);
    setPaarForm(true);
  };

  const handleFormMClose = () => {
    setPaarForm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/po/list');
        const paarDataMapped = response.data
          ?.filter((item) => item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num)
          ?.map((item, index) => ({
            id: index + 1,
            pfi_id: item?.opo_master?.pfi_masters?.[0]?.pfi_id,
            pfi_num: item?.opo_master?.pfi_masters?.[0]?.pfi_num,
            pfi_date: item?.opo_master?.pfi_masters?.[0]?.pfi_date,
            importer_name: item?.opo_master?.OprMaster?.companyMaster?.company_name,
            consignee: item?.shippment_advise_master?.consignee_name,
            shipment_mode_name: item?.opo_master?.OprMaster?.shipment_mode_name,
            shipment_type: item?.shippment_advise_master?.shipment_type,
            product_description: item?.opo_master?.pfi_masters[0]?.pfi_description,
            supplier_name: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
            port_of_loading: item?.shippment_advise_master?.port_of_loading,
            port_of_dc: item?.shippment_instruction?.port_of_discharge,
            form_m_num: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.form_m_num,
            form_m_date: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.form_m_date,
            form_m_expiry_date: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.form_m_expiry_date,
            ba_num: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.ba_num,
            invoice_no: item?.opo_master?.pfi_masters[0]?.insurances[0]?.invoice_no,
            invoice_date: item?.opo_master?.pfi_masters[0]?.createdAt,
            bl_awb_no: item?.shippment_advise_master?.bl_awb_no,
            bl_awb_date: item?.shippment_advise_master?.bl_awb_date,
            free_days: item?.shippment_advise_master?.free_days,
            eta_date: item?.shippment_advise_master?.eta,
            revised_eta: item?.shippment_advise_master?.eta,
            ci_id: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.commercial_invoice_id,
            ci_num: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num,
            ci_date: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_date,
            ci_description: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_description,
            opo_num: item?.opo_master?.opo_num,
            lc_num: item?.opo_master?.pfi_masters[0]?.letter_of_credits[0]?.lc_num,
            shipment_status: item?.shippment_advise_master?.shipment_status,
            no_package: item?.add_shippment_containers[0]?.shippment_container_details[0]?.no_package,
            no_of_container: item?.no_of_container,
            net_weight: item?.add_shippment_containers[0]?.net_weight,
            gross_weight: item?.add_shippment_containers[0]?.gross_weight,
            consignor: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
            pfi_category: item?.opo_master?.OprMaster?.item_super_group_master?.item_super_group_name,
            pfi_general_desc: item?.pfi_description,
            currency: item?.opo_master.quotation_master?.currency,
            total_value: item?.amount,
            payment_terms: item?.opo_master.quotation_master.payment_terms,
            shipment_window: item?.opo_master.quotation_master.lead_time,
            pfi_created_by: item?.createdAt,
            opr_num: item?.opo_master?.opr_num,
            pi_sender: item?.pfi_sender_id,
            pi_sender_date: item?.pfi_sent_date,
            pfi_created_time: item?.createdAt?.split('T')[0],
            pfi_amount: item?.opo_master?.pfi_masters[0]?.amount,
            buyer: item?.opo_master?.OprMaster?.companyMaster?.company_name,
            country_of_origin_of_goods: item?.opo_master?.quotation_master?.country_origin,
            country_of_supply: item?.opo_master?.quotation_master?.country_supply,
            final_destination: item?.opo_master?.quotation_master?.RfqMaster?.port_destination_name,
            country_of_final_destination: item?.opo_master.OprMaster.companyMaster.AddressMasters[0].country,
            delivery_time: item?.opo_master.quotation_master.lead_time,
            delivery_terms: item?.opo_master.quotation_master.delivery_terms_quo.delivery_terms_name,
            bank: item?.opo_master?.pfi_masters[0]?.VendorsBanksDetailsMaster?.bank_name,
            delivery_time1: item?.opo_master.quotation_master.lead_time,
            delivery_date: item?.exchange_date,
            inland_charges: item?.inhand_charges,
            freight_charges: item?.freight_charges,
            inspection_charges: item?.inspection_charges,
            thc_fob: item?.thc_charges,
            container_stuffing: item?.container_stuffing,
            container_seal: item?.container_seal,
            vgm: item?.vgm,
            miscellaneous_fob: item?.miscellaneous_fob,
            thc_doc: item?.thc_charges,
            advising_commission: item?.advising_commission,
            courier: item?.courier,
            miscellaneous_doc: item?.miscellaneous_doc,
            approval_status: item?.approval_status,
            status_updated_by: item?.status_updated_by,
            status_updated_time: item?.updatedAt,
            status_remarks: item?.status_remarks,
            ci_value: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_amount,
            additional_charges: item?.opo_master.quotation_master.additional_costs,
            status: item?.opo_master?.pfi_masters[0]?.paar?.paar_num ? 1 : 0,
            shipment_advice_id: item?.shippment_advise_master?.shippment_advise_id,
            paar_data: item?.opo_master?.pfi_masters[0]?.paar
          }));
        console.log('Fetching data:', paarDataMapped);
        setPaarData(paarDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);

  const PaarColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenPaar(params.row);
                handleClose();
              }}
            >
              <strong>SONCAP Details</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      renderCell: (params) => (
        <Button
          onClick={() => {
            handleOpenPaar(params.row);
            handleClose();
          }}
          style={{ color: 'blue' }}
        >
          {params.row.status != 0 ? 'View' : 'Create'}
        </Button>
      )
    },
    { headerName: 'CI Num', field: 'ci_num', width: 100 },
    { headerName: 'CI Date', field: 'ci_date', width: 100 },
    { headerName: 'CI Description', field: 'ci_description', width: 250 },
    { headerName: 'Consignee', field: 'consignee', flex: 1 },
    { headerName: 'BL Num', field: 'bl_awb_no', width: 100 },
    { headerName: 'FORM M Num', field: 'form_m_num', width: 100 },
    { headerName: 'Bank', field: 'bank', flex: 1 },
    { headerName: 'CI Value', field: 'ci_value', width: 100 },
    { headerName: 'ETA', field: 'revised_eta', width: 100 }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {paarForm ? <span> PAAR</span> : <span>Pending PAAR</span>}
            {paarForm ? (
              <span>
                <PlusButton label="Back" onClick={handleFormMClose} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        <div>
          {paarForm ? (
            <Paar PaarData={paarRowData} />
          ) : (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '70vh',
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
              columns={PaarColumn}
              rows={paarData}
              HideFooter
              HideFooterPagination
              hideFooterSelectedRowCount
              loading={paarData?.length === 0}
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};
export default PaarTable;
