/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import PurchaseOrder from './PurchaseOrder';
import PlusButton from 'components/CustomButton';
import React, { useEffect, useState } from 'react';
import { GetCIList } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const PurchaseOrderTable = () => {
  const dispatch = useDispatch();
  const { ci_list, isFetching } = useSelector((state) => state.purchaseOrder);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [poData, setPoData] = useState([]);
  const [CommercialInvoiceForm, setCommercialInvoiceForm] = useState(false);
  const [CIRowData, setCIRowData] = useState({});

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleOpenCI = (data) => {
    setCIRowData(data);
    setCommercialInvoiceForm(true);
  };

  const handleFormMClose = () => {
    setCommercialInvoiceForm(false);
  };

  useEffect(() => {
    GetCIList(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sonDataMapped = ci_list?.map((item, index) => ({
      id: index + 1,
      po_id: item.po_id,
      po_num: item.po_num,
      ci_num: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num,
      quo_id: item?.opo_master?.quotation_master?.quo_id,
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
      lc_num: item?.opo_master?.pfi_masters[0]?.letter_of_credits[0]?.lc_num,
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
      shippment_instruction: item?.shippment_instruction,
      pfi_items: item?.opo_master?.pfi_masters[0]?.pfi_line_items,
      isAllowed: item?.shippment_advise_master?.shippment_advise_id ? true : false
    }));
    // .filter((item) => item.status >= 11);
    setPoData(sonDataMapped);
  }, [ci_list]);

  const POColumn = [
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        // <div
        //   onClick={() => {
        //     handleOpenCI(params.row);
        //     handleClose();
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
            params.row.isAllowed && handleOpenCI(params.row);
            handleClose();
          }}
          onDelete={handleClose}
          deleteIcon={params.row.isAllowed ? <DoneIcon /> : <CloseIcon />}
        />
      )
    },
    {
      field: 'ci_num',
      headerName: 'Commercial Inv. No.',
      width: 150,
      renderCell: (params) => (
        <div
          onClick={() => {
            handleOpenCI(params.row);
            handleClose();
          }}
          style={{ cursor: 'pointer', color: 'blue' }}
          aria-hidden="true"
        >
          {params.value}
        </div>
      )
    },
    { field: 'supplier_name_address', headerName: 'Supplier Name & Address', width: 200 },
    { field: 'shipper', headerName: 'PO Vendor', width: 200 },
    { field: 'total_cost', headerName: 'PO Value', width: 150 },
    { field: 'quo_num', headerName: 'Supplier Ref No(Quote no)', width: 120 },
    { field: 'delivery_term', headerName: 'Delivery Term', width: 150 },
    { field: 'shipment_mode', headerName: 'Shipment mode', width: 150 },
    { field: 'form_m_num', headerName: 'FORM M No', width: 120 },
    { field: 'ba_num', headerName: 'BA No', width: 150 },
    { field: 'lc_num', headerName: 'LC No', width: 150 },
    { field: 'num_of_prevoious_shipment', headerName: 'No of Previous shipment', width: 150 },
    { field: 'amount_of_prevoious_shipment', headerName: 'Amount of Previous shipment', width: 120 },
    { field: 'balance_to_ship', headerName: 'Balance to Ship', width: 150 }
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
            {CommercialInvoiceForm ? <span> Create Commercial Invoice</span> : <span>Commercial Invoice</span>}
            {CommercialInvoiceForm ? (
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
          {CommercialInvoiceForm ? (
            <PurchaseOrder poData={CIRowData} GetCIList={GetCIList} />
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
              columns={POColumn}
              rows={poData}
              // loading={isFetching}
              HideFooter
              HideFooterPagination
              HideFooterRowCount
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};
export default PurchaseOrderTable;
