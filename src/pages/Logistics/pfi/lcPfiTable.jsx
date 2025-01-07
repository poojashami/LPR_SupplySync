import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, Button, TextField } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import LcPfi from './LcPfi';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { GetPFI } from 'Redux/Apis/GetApiCalls';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const LcPfiTable = () => {
  const dispatch = useDispatch();
  const { pfiData } = useSelector((state) => state.PFISlice);
  // eslint-disable-next-line no-unused-vars
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [formMData, setFormMData] = useState([]);
  const [lcForm, setLcForm] = useState(false);
  const [lcRowData, setLcRowData] = useState({});
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpenLC = (data) => {
    setLcRowData(data);
    setLcForm(true);
  };

  const handleCloseOped = () => {
    setOpen(false);
  };

  const [pfi_data, setPfi_data] = useState(null);
  const [dataforformm, setDataforformm] = useState({});

  const set_applied_date = (e, data) => {
    try {
      handleClickOpen();
      setPfi_data(data);
      setFormMData((prev) => prev.map((item, index) => (index === data.id - 1 ? { ...item, dataforformm: e.target.value } : item)));
      setDataforformm(e.target.value);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handle_update_date = async () => {
    try {
      const { data } = await axiosInstance.post('/api/lc', {
        pfiId: pfi_data?.pfi_id,
        pfiNum: pfi_data?.pfi_no,
        lc_date: dataforformm
      });
      console?.log(data, {
        pfiId: pfi_data?.pfi_id,
        pfiNum: pfi_data?.pfi_no,
        lc_date: dataforformm
      });
      fetchData();
      handleCloseOped();
    } catch (error) {
      toast.error(error.message);
      handleCloseOped();
    }
  };

  const handleFormMClose = () => {
    setLcForm(false);
  };
  const fetchData = async () => {
    try {
      const formMDataMapped = pfiData?.map((item, index) => ({
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
        insurance_certificate_num: item?.insurances[0]?.insurance_certificate_num,
        VendorsMaster: item?.opo_master?.quotation_master.VendorsMaster,
        quotation_master: item?.opo_master?.quotation_master,
        letter_of_credits: item?.letter_of_credits,
        status: item?.letter_of_credits[0]?.letter_of_credit_id ? 'View' : item?.letter_of_credits[0]?.application_date && 'Create',
        VendorsBanksDetailsMaster: item?.VendorsBanksDetailsMaster,
        bank: item?.VendorsBanksDetailsMaster?.bank_name,
        dataforformm: item?.letter_of_credits[0]?.application_date,
        lc: item?.letter_of_credits[0]
      }));
      console.log('Fetched data:', formMDataMapped);
      setFormMData(formMDataMapped);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBanks = async () => {
    try {
      const { data } = await axiosInstance.get('/api/vendor/bankdropdn');
      setBankList(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getBanks();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfiData]);

  const FormMColumn = [
    { field: 'pfi_no', headerName: 'PFI No', width: 80, flex: 1 },
    {
      headerName: 'Status',
      field: 'status',
      renderCell: (params) => (
        <Button
          onClick={() => {
            handleOpenLC(params.row);
            handleClose();
          }}
          style={{ color: 'blue' }}
        >
          {params.row.status}
        </Button>
      )
    },
    { headerName: 'PFI Date', field: 'pfi_date' },
    {
      headerName: 'Applied Date',
      field: 'dataforformm',
      width: 180,
      renderCell: (params) => {
        return !params?.value ? (
          <TextField
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              }
            }}
            type="date"
            variant="outlined"
            name="formm_date"
            value={params.row.dataforformm?.split('T')[0]}
            onChange={(e) => set_applied_date(e, params.row)}
          />
        ) : (
          params?.value?.split('T')[0]
        );
      }
    },
    { flex: 1, headerName: 'Consignor', field: 'consignor' },
    { flex: 1, headerName: 'Consignee', field: 'consignee' },
    { flex: 1, headerName: 'PFI Category', field: 'pfi_category' },
    { flex: 1, headerName: 'PFI Desc', field: 'pfi_general_desc' },
    { flex: 1, headerName: 'Currency', field: 'currency' },
    { flex: 1, headerName: 'PI Total', field: 'total_value' },
    { flex: 1, headerName: 'Bank', field: 'bank' },
    { flex: 1, headerName: 'PI Created By', field: 'pfi_created_time' }
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
            {lcForm ? (
              <p>
                Add LC for FORM M Num : <b style={{ color: 'blue' }}> ({lcRowData?.form_ms?.form_m_num})</b>
              </p>
            ) : (
              <p>Pending LC Application</p>
            )}
            {lcForm && (
              <p>
                <PlusButton label="Back" onClick={handleFormMClose} />
              </p>
            )}
          </Box>
        }
      >
        <div>
          {lcForm ? (
            <LcPfi lcData={lcRowData} bankList={bankList} onclose={handleFormMClose} />
          ) : (
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                minHeight: '70vh',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px'
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
              columns={FormMColumn}
              rows={formMData}
              loading={formMData?.length < 1 ? true : false}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}
        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'You are updating LC Date'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You are updating Applied date for PFI No. <span style={{ color: 'red' }}>{pfi_data?.pfi_no}</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOped}>Disagree</Button>
            <Button onClick={handle_update_date} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </div>
  );
};

export default LcPfiTable;
