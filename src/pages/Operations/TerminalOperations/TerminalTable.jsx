import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Link } from '@mui/material';
import { axiosInstance } from 'utils/axiosInstance';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';
import TerminalView from './terminalView';
import { GetCIList } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import ShippingExpense from '../ShippingOperations/ShippingExpense';

const TerminalTable = () => {
  const dispatch = useDispatch();
  const { ci_list, isFetching } = useSelector((state) => state.purchaseOrder);

  const [terminalData, setTerminalData] = useState([]);
  const [terminalRowData, setTerminalRowData] = useState({});
  const [terminalViewData, setTerminalViewData] = useState(false);
  const handleterminalViewData = (data) => {
    console.log('data', [data]);
    setTerminalRowData(data);
    setTerminalViewData(true);
  };

  const handleCloseTerminalView = () => {
    setTerminalViewData(false);
  };

  useEffect(() => {
    GetCIList(dispatch);
  }, []);

  const fetchData = async () => {
    try {
      const assessmentAllData = ci_list
        ?.filter((item) => item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num)
        ?.map((item, index) => ({
          id: index + 1,
          pfi_id: item?.opo_master?.pfi_masters[0]?.pfi_id,
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
          ci_date: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.created_on,
          ci_description: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_description,
          opo_num: item?.opo_master?.opo_num,
          lc_num: item?.opo_master?.pfi_masters[0]?.letter_of_credits[0]?.lc_num,
          shipment_status: item?.shippment_advise_master?.shipment_status,
          no_package: item?.add_shippment_containers[0]?.shippment_container_details[0]?.no_package,
          no_of_container: item?.no_of_container,
          net_weight: item?.add_shippment_containers[0]?.net_weight,
          gross_weight: item?.add_shippment_containers[0]?.gross_weight,
          pfi_amount: item?.opo_master?.pfi_masters[0]?.amount,
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
          buyer: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          country_of_origin_of_goods: item?.opo_master?.quotation_master?.country_origin,
          country_of_supply: item?.opo_master?.quotation_master?.country_supply,
          final_destination: item?.opo_master?.quotation_master?.RfqMaster?.port_destination_name,
          country_of_final_destination: item?.opo_master.OprMaster.companyMaster.AddressMasters[0].country,
          delivery_time: item?.opo_master.quotation_master.lead_time,
          delivery_terms: item?.opo_master.quotation_master.delivery_terms_quo.delivery_terms_name,
          bank: item?.bank,
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
          additional_charges: item?.opo_master.quotation_master.additional_costs,
          add_shippment_containers: item?.add_shippment_containers,
          shippment_advise_master: item?.shippment_advise_master,
          shipment_advise_items: item?.shippment_advise_master?.shipment_advise_items,
          company_name: item?.opo_master?.OprMaster?.companyMaster?.company_name,
          eta: item?.shippment_advise_master?.eta,
          soncap_master: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.soncap_master,
          other_govt_charge: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.other_govt_charge
        }));
      console.log('Fetching data:', assessmentAllData);
      setTerminalData(assessmentAllData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ci_list]);

  const terminalColumn = [
    {
      field: 'ci_num',
      headerName: 'CI No',
      width: 80,
      renderCell: (params) => (
        <Link component="button" onClick={() => handleterminalViewData(params.row)}>
          {params.value}
        </Link>
      )
    },
    { headerName: 'CI Date', field: 'ci_date', width: 200 },
    { headerName: 'PFI Num', field: 'pfi_num', width: 200 },
    { headerName: 'BL Num', field: 'bl_awb_no', width: 200 },
    { headerName: 'Bl Date', field: 'bl_awb_date', width: 200 }
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
            {terminalViewData ? <span>Terminal Operation</span> : <span>Result - Pending Terminal</span>}
            {terminalViewData ? (
              <span>
                <PlusButton label="Back" onClick={handleCloseTerminalView} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        <div>
          {terminalViewData ? (
            <ShippingExpense provision={false} showShippingExpenseData={terminalRowData} setShowShippingExpense={setTerminalViewData} />
          ) : (
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
              columns={terminalColumn}
              rows={terminalData}
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};

export default TerminalTable;
