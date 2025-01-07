import { Box, Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import ShippingAdvise from './ShippingAdvise';
import ContainerDetail from './ContainerDetail';
import ShippingExpense from './ShippingExpense';
import PlusButton from 'components/CustomButton';
import IconButton from '@mui/material/IconButton';
import { GetCIList } from 'Redux/Apis/GetApiCalls';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShippingOperationView from './ShippingOperationView';
import { axiosInstance } from 'utils/axiosInstance';
import ShippingLapse from './ShippingLapse';

const ShippingOperationsTable = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [shippingData, setShippingData] = useState([]);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [shippingRowData, setShippingRowData] = useState({});
  const [showShippingAdvise, setShowShippingAdvise] = useState(null);
  const [openShippingupdate, setOpenShippingupdate] = useState(false);
  const [showShippingExpense, setShowShippingExpense] = useState(false);
  const [ShippingExpenseData, setShippingExpenseData] = useState({});
  const { ci_list, isFetching } = useSelector((state) => state.purchaseOrder);
  const [showShippingExpenseData, setShowShippingExpenseData] = useState(null);
  const [showShippingContainerDetails, setShowShippingContainerDetails] = useState(false);
  const [provision, setProvision] = useState('');
  const [showShippingLpaseDetails, setShowShippingLpaseDetails] = useState(false);

  const handleOpenShippingupdate = (data) => {
    setShippingRowData(data);
    setOpenShippingupdate(true);
  };

  const handleCloseAssessmentForm = () => {
    setOpenShippingupdate(false);
  };

  const openAction = Boolean(anchorEl);
  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const GetShippingExpense = async (id) => {
    try {
      // const response = await axiosInstance.get('/api/po/list');

      const { data } = await axiosInstance.get(`/api/commercial/invoice/shipping/expense?ci_id=${id}`);
      console.log('setShippingExpenseData', data);
      setShippingExpenseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const shippingAllData = ci_list
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
          assessment: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.assessment,
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
      setShippingData(shippingAllData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    GetCIList(dispatch);
  }, []);

  useEffect(() => {
    fetchData();
  }, [ci_list]);

  const shippingColumn = [
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   width: 80,
    //   renderCell: (params) => (
    //     <div>
    //       <IconButton
    //         aria-label="more"
    //         id={`long-button-${params.row.id}`}
    //         aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
    //         aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
    //         aria-haspopup="true"
    //         onClick={(event) => handleClick(event, params.row.id)}
    //       >
    //         <MoreVertIcon />
    //       </IconButton>
    //       <Menu
    //         id="long-menu"
    //         anchorEl={anchorEl}
    //         open={openAction && anchorElRowId === params.row.id}
    //         onClose={handleClose}
    //         PaperProps={{
    //           style: {
    //             maxHeight: 48 * 4.5,
    //             width: '30ch'
    //           }
    //         }}
    //       >
    //         <MenuItem
    //           onClick={() => {
    //             handleClose();
    //             handleOpenShippingupdate(params.row);
    //           }}
    //         >
    //           <strong>View Detail</strong>
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => {
    //             handleClose();
    //             setProvision('Y');
    //             GetShippingExpense(params.row.ci_id);
    //             setShowShippingExpenseData(params.row);
    //             setShowShippingExpense(true);
    //           }}
    //         >
    //           <strong>Shipping Expense(Provision)</strong>
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => {
    //             handleClose();
    //             setProvision('N');
    //             GetShippingExpense(params.row.ci_id);
    //             setShowShippingExpenseData(params.row);
    //             setShowShippingExpense(true);
    //           }}
    //         >
    //           <strong>Shipping Expense</strong>
    //         </MenuItem>
    //         <MenuItem
    //           onClick={() => {
    //             handleClose();
    //             setShowShippingExpenseData(params.row);
    //             setShowShippingContainerDetails(true);
    //           }}
    //         >
    //           <strong>Container Detail</strong>
    //         </MenuItem>

    //         <MenuItem
    //           onClick={() => {
    //             handleClose();
    //             setShowShippingExpenseData(params.row);
    //             setShowShippingLpaseDetails(true);
    //           }}
    //         >
    //           <strong>Lapse</strong>
    //         </MenuItem>
    //       </Menu>
    //     </div>
    //   )
    // },

    {
      headerName: 'CI Num',
      field: 'ci_num',
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => {
            handleClose();
            handleOpenShippingupdate(params.row);
          }}
          style={{ color: 'blue' }}
        >
          {params.row.ci_num}
        </Button>
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
            {openShippingupdate ? (
              <span>Shipping Operation</span>
            ) : showShippingAdvise ? (
              <span>Shipping Advise</span>
            ) : (
              <span>Shipping Operation</span>
            )}
            {openShippingupdate ? (
              <span>
                <PlusButton label="Back" onClick={handleCloseAssessmentForm} />
              </span>
            ) : (
              showShippingAdvise && (
                <span>
                  <PlusButton
                    label="Back"
                    onClick={() => {
                      setShowShippingAdvise(false);
                      setShowShippingExpense(false);
                    }}
                  />
                </span>
              )
            )}
          </Box>
        }
      >
        <div>
          {showShippingAdvise ? (
            <ShippingAdvise showShippingAdvise={showShippingAdvise} />
          ) : openShippingupdate ? (
            <ShippingOperationView
              shippingData={shippingRowData}
              setOpenShippingupdate={setOpenShippingupdate}
              handleClose={handleClose}
              setProvision={setProvision}
              GetShippingExpense={GetShippingExpense}
              setShowShippingExpenseData={setShowShippingExpenseData}
              setShowShippingExpense={setShowShippingExpense}
              setShowShippingLpaseDetails={setShowShippingLpaseDetails}
              setShowShippingContainerDetails={setShowShippingContainerDetails}
            />
          ) : showShippingLpaseDetails ? (
            <ShippingLapse
              setShowShippingExpense={setShowShippingLpaseDetails}
              ShippingExpenseData={ShippingExpenseData}
              showShippingExpenseData={showShippingExpenseData}
            />
          ) : showShippingExpense ? (
            <ShippingExpense
              ShippingExpenseData={ShippingExpenseData}
              provision={provision}
              showShippingExpenseData={showShippingExpenseData}
              showShippingExpense={showShippingExpense}
              setShowShippingExpense={setShowShippingExpense}
            />
          ) : showShippingContainerDetails ? (
            <ContainerDetail
              setShowShippingContainerDetails={setShowShippingContainerDetails}
              showShippingExpenseData={showShippingExpenseData}
            />
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
              columns={shippingColumn}
              rows={shippingData}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
              // loading={isFetching}
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};

export default ShippingOperationsTable;
