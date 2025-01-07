import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import React, { useState, useEffect } from 'react';
import { GetCIList } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';

const ShipmentAdvice_list = ({ setPo_data, setView_list, setViewData }) => {
  const dispatch = useDispatch();
  const { ci_list } = useSelector((state) => state.purchaseOrder);
  const [poData, setPoData] = useState([]);
  const itemColumn = [
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        // <div
        //   onClick={() => {
        //     setView_list(true);
        //     setPo_data(params.row);
        //     setViewData();
        //   }}
        //   style={{ cursor: 'pointer', color: 'blue' }}
        //   aria-hidden="true"
        // >
        //   {params.value}
        // </div>

        <Chip
          fullWidth
          label={params.value}
          onClick={() => {
            setView_list(true);
            setPo_data(params.row);
            setViewData();
          }}
          // onDelete={handleClose}
          // deleteIcon={params.row.isAllowed ? <DoneIcon /> : <CloseIcon />}
        />
      )
    },
    { field: 'status', headerName: 'Status #', width: 100 },
    { field: 'supplier_name_address', headerName: 'Supplier Name & Address', width: 450 },
    { field: 'shipper', headerName: 'PO Vendor', width: 200 },
    { field: 'po_value', headerName: 'PO Value', width: 150 },
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
        quo_id: item?.opo_master?.quotation_master?.quo_id,
        product_cost: item?.total_cost,
        po_value: formatNumber(item?.total_cost),
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
        buyer_name: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
        buyer_address: `${item?.opo_master?.OprMaster?.BuyingHouse?.address_line1} ${item?.opo_master?.OprMaster?.BuyingHouse?.address_line2} ${item.opo_master.OprMaster.BuyingHouse.country}`,
        shipper_po_vendor: item?.VendorsMaster?.vendor_name,
        po_number: item?.po_num,
        supplier_ref_no: item?.opo_master?.quotation_master?.quo_num,
        delivery_terms: item?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name,
        port_of_loading: item?.opo_master.quotation_master.port_loading,
        consignee: item?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name,
        ...item,
        quotation_master: item?.opo_master?.quotation_master,
        shippment_instruction: item?.shippment_instruction
      }))
      .filter((item) => item.status != 11);
    setPoData(mappedData);
    console.log(
      'mappedData[1]',
      Number(mappedData[1]?.total_cost) +
        mappedData[1]?.quotation_master?.additional_costs.reduce((acc, charge) => {
          return !charge.reference_id && charge?.heading === 'Freight_Charges' && charge?.charges_by === 'Supplier'
            ? acc + Number(charge?.charge_amount)
            : acc;
        }, 0)
    );
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
        loading={ci_list.length === 0}
        columns={itemColumn}
        rows={poData}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </>
  );
};

export default ShipmentAdvice_list;
