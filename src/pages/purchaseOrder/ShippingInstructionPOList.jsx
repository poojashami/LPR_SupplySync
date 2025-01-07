import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { GetCIList } from 'Redux/Apis/GetApiCalls';

const ShippingInstructionPOList = ({ setPo_data, setView_list, view_filled, setView_filled }) => {
  const dispatch = useDispatch();
  const { ci_list } = useSelector((state) => state.purchaseOrder);
  const [poData, setPoData] = useState([]);
  const itemColumn = [
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        <div
          onClick={() => {
            setView_list(true);
            setPo_data(params?.row);
            setView_filled(Boolean(params?.row?.shippment_instruction));
          }}
          style={{ cursor: 'pointer', color: 'blue' }}
          aria-hidden="true"
        >
          {params.value}
        </div>
      )
    },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'supplier_name_address', headerName: 'Supplier Name & Address', width: 200 },
    { field: 'shipper', headerName: 'PO Vendor', width: 200 },
    { field: 'total_cost', headerName: 'PO Value', width: 150 },
    { field: 'quo_num', headerName: 'Supplier Ref No(Quote no)', width: 120 },
    { field: 'delivery_term', headerName: 'Delivery Term', width: 150 },
    { field: 'shipment_mode', headerName: 'Shipment mode', width: 150 },
    // { field: 'inco_term', headerName: 'Inco Term', width: 150 },
    { field: 'form_m_num', headerName: 'FORM M No', width: 120 },
    { field: 'ba_num', headerName: 'BA No', width: 150 },
    { field: 'lc_num', headerName: 'LC No', width: 150 },
    { field: 'num_of_prevoious_shipment', headerName: 'No of Previous shipment', width: 150 },
    { field: 'amount_of_prevoious_shipment', headerName: 'Amount of Previous shipment', width: 120 },
    { field: 'balance_to_ship', headerName: 'Balance to Ship', width: 150 }
  ];

  useEffect(() => {
    const mappedData = ci_list
      .map((item, index) => ({
        id: index + 1,
        po_id: item.po_id,
        po_num: item.po_num,
        quo_id: 9,
        total_cost: item.total_cost,
        vendor_id: item.vendor_id,
        status: item.status,
        created_on: item.created_on?.split('T')[0],
        supplier_name_address: `${item?.opo_master?.OprMaster?.BuyingHouse?.address_line1} ${item?.opo_master?.OprMaster?.BuyingHouse?.address_line2} ${item?.opo_master?.OprMaster?.BuyingHouse.country}`,
        shipper: item?.VendorsMaster?.vendor_name,
        quo_num: item?.opo_master?.quotation_master?.quo_num,
        delivery_term: item?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name,
        shipment_mode: item?.opo_master?.OprMaster?.shipment_mode_name,
        form_m_num: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.form_m_num,
        ba_num: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.ba_num,
        lc_num: item?.opo_master?.pfi_masters[0]?.letter_of_credits[0]?.lc_number,
        ...item
      }))
      .filter((item) => item.status != 11);
    setPoData(mappedData);
  }, [ci_list]);

  useEffect(() => {
    // getpo();

    GetCIList(dispatch);
  }, []);
  return (
    <>
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
            alignItems: 'center',
            minHeight: '50px'
          },
          '& .MuiDataGrid-scrollbar': {
            height: '8px'
          }
        }}
        columns={itemColumn}
        rows={poData}
        hideFooter
        hideFooterPagination
      />
    </>
  );
};

export default ShippingInstructionPOList;
