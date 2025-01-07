import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { axiosInstance } from 'utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { GetPFI } from 'Redux/Apis/GetApiCalls';

const DraftPfiTable = ({ onViewPFI }) => {
  const dispatch = useDispatch();
  const { pfiData: pfi_data } = useSelector((state) => state.PFISlice);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);
  const [pfiData, setPfiData] = useState([]);
  const fetchData = async () => {
    try {
      const pfiData = pfi_data
        .filter((i) => i.status === 1)
        .map((item, index) => ({
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
          status: item.status,
          additional_charges: item?.opo_master?.quotation_master.additional_costs
        }));
      console.log('Fetching data:', pfiData);
      setPfiData(pfiData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pfi_data]);

  const pfiColumn = [
    { headerName: 'Index', field: 'id', width: 50 },
    {
      field: 'pfi_no',
      headerName: 'PI No',
      width: 150,
      renderCell: (params) => (
        <Link component="button" onClick={() => onViewPFI(params.row)}>
          {params.value}
        </Link>
      )
    },
    { headerName: 'PI Date', field: 'pi_date', width: 150 },
    { headerName: 'Consignor', field: 'consignor', width: 150 },
    { headerName: 'Consignee', field: 'consignee', width: 150 },
    { headerName: 'PFI Category', field: 'pfi_category' },
    { headerName: 'PFI General Desc', field: 'pfi_general_desc' },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'Total Value', field: 'total_value' },
    { headerName: 'Shipment Type', field: 'shipment_type', width: 120 },
    { headerName: 'Shipment Window', field: 'shipment_window', width: 200 },
    { headerName: 'PFI Created By', field: 'pfi_created_time', width: 100 }
  ];

  return (
    <div>
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
        columns={pfiColumn}
        rows={pfiData}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </div>
  );
};

export default DraftPfiTable;
