import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, MenuItem, IconButton, Menu, Button } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Son from './Son';
import { GetPFI } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';

const PfiSonTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [formMData, setFormMData] = useState([]);
  const [sonForm, setSonForm] = useState(false);
  const [sonRowData, setSonRowData] = useState({});
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleOpenSon = (data) => {
    setSonRowData(data);
    setSonForm(true);
  };

  const handleFormMClose = () => {
    setSonForm(false);
  };

  const dispatch = useDispatch();
  const { pfiData: pfi_data } = useSelector((state) => state.PFISlice);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formMDataMapped = pfi_data?.map((item, index) => ({
          id: index + 1,
          pfi_id: item?.pfi_id,
          pfi_no: item?.pfi_num,
          pfi_date: item?.createdAt?.split('T')[0],
          pfi_amount: item?.amount,
          consignor: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
          consignee: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          pfi_category: item?.opo_master?.OprMaster?.item_super_group_master?.item_super_group_name,
          pfi_general_desc: item?.pfi_description,
          currency: item?.opo_master?.quotation_master?.currency,
          total_value:
            item?.opo_master?.quotation_master?.additional_costs?.length > 0
              ? Number(item?.amount) +
                item?.opo_master?.quotation_master?.additional_costs?.reduce((acc, amount) => {
                  return amount.reference_table_name ? (acc = Number(acc) + Number(amount.charge_amount)) : acc;
                }, 0)
              : Number(item?.amount),
          payment_terms: item?.opo_master?.quotation_master.payment_terms,
          shipment_type: item?.opo_master?.OprMaster.shipment_mode_name,
          shipment_window: item?.opo_master?.quotation_master.lead_time,
          pfi_created_by: item?.createdAt,
          opr_no: item?.opo_master?.OprMaster.opr_num,
          pi_sender: item?.pfi_sender_id,
          pi_sender_date: item?.pfi_sent_date,
          pfi_description: item?.pfi_description,
          pfi_created_time: item?.createdAt?.split('T')[0],
          supplier: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
          buyer: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          port_of_loading: item?.opo_master?.quotation_master?.port_of_loading,
          country_of_origin_of_goods: item?.opo_master?.quotation_master?.country_origin,
          country_of_supply: item?.opo_master?.quotation_master?.country_supply,
          port_of_dc: `${item?.opo_master?.quotation_master?.country_supply} ${item?.opo_master?.quotation_master.port_loading}`,
          final_destination: item?.opo_master?.quotation_master?.RfqMaster?.port_destination_name,
          country_of_final_destination: item?.opo_master?.OprMaster.companyMaster.AddressMasters[0].country,
          delivery_time: item?.opo_master?.quotation_master.lead_time,
          delivery_terms: item?.opo_master?.quotation_master.delivery_terms_quo.delivery_terms_name,
          form_m_no: item?.document_name,
          bank: item?.bank,
          delivery_time1: item?.opo_master?.quotation_master.lead_time,
          delivery_date: item?.exchange_date,
          inland_charges: item?.inhand_charges,
          freight_charges: item?.freight_charges,
          inspection_charges: item?.inspection_charges,
          thc_fob: item?.thc_charges,
          container_stuffing: item?.container_stuffing,
          container_seal: item?.container_seal,
          bl: item?.bl,
          vgm: item?.vgm,
          miscellaneous_fob: item?.miscellaneous_fob,
          thc_doc: item?.thc_charges,
          advising_commission: item?.advising_commission,
          lc_commission: item?.llc_commission,
          courier: item?.courier,
          miscellaneous_doc: item?.miscellaneous_doc,
          approval_status: item?.approval_status,
          status_updated_by: item?.status_updated_by,
          status_updated_time: item?.updatedAt,
          status_remarks: item?.status_remarks,
          additional_charges: item?.opo_master?.quotation_master.additional_costs,
          status: item?.son_pfis?.length,
          VendorsBanksDetailsMaster: item?.VendorsBanksDetailsMaster
        }));
        console.log('Fetching data:', formMDataMapped);
        setFormMData(formMDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        // setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);

  const FormMColumn = [
    {
      field: 'pfi_no',
      headerName: 'PFI No',
      width: 100
    },
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
              disabled={params.row.status}
              onClick={() => {
                handleOpenSon(params.row);
                handleClose();
              }}
            >
              <strong>Create SON</strong>
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
            handleOpenSon(params.row);
            handleClose();
          }}
          style={{ color: 'blue' }}
        >
          {params.row.status != 0 ? 'View' : 'Create'}
        </Button>
      )
    },
    { headerName: 'PFI Date', field: 'pfi_date', width: 150 },
    { headerName: 'Consignor', field: 'consignor' },
    { headerName: 'Consignee', field: 'consignee' },
    { headerName: 'PFI Category', field: 'pfi_category' },
    { headerName: 'PFI Desc', field: 'pfi_general_desc' },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'PI Total', field: 'total_value' },
    { headerName: 'Bank', field: 'bank' },
    { headerName: 'PI Created By', field: 'pfi_created_time' }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {sonForm ? <p>Son Permit for FORM M</p> : <p>Pending SON Application</p>}
            {sonForm ? (
              <p>
                <PlusButton label="Back" onClick={handleFormMClose} />
              </p>
            ) : (
              ''
            )}
          </Box>
        }
      >
        <div>
          {sonForm ? (
            <Son SonData={sonRowData} onclose={handleFormMClose} />
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
                  borderBottom: '2px solid rgba(224, 224, 224, 1)'
                }
              }}
              columns={FormMColumn}
              rows={formMData}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};
export default PfiSonTable;
