// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Box,
  IconButton,
  Button,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CustomTypography from 'components/CustomTypography';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { GetCIListByCiId } from 'Redux/Apis/GetApiCalls';

export default function CI_Data({ ci_id }) {
  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);
  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);
  const [CustomClearanceData, setCustomClearanceData] = useState({});

  const dispatch = useDispatch();
  const { single_ci_list, isFetching } = useSelector((state) => state.purchaseOrder);

  const fetchData = async () => {
    try {
      const shippingAllData = single_ci_list
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
          quotation_master: item?.opo_master?.quotation_master,
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
      console.log('shippingAllData', CustomClearanceData);
      shippingAllData.length > 0 && setCustomClearanceData(shippingAllData[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    GetCIListByCiId(dispatch, ci_id);
  }, []);

  useEffect(() => {
    fetchData();
  }, [single_ci_list]);

  useEffect(() => {
    let data = CustomClearanceData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
    let Freigth = data?.filter((i) => i.charge_name == 'total_freight_charges');
    Freigth?.length > 0 && setFreightAdditionalCost(Freigth[0]?.charge_amount);
    let fob = data?.reduce((acc, total) => {
      return total.heading === 'FOB' ? (acc = acc + Number(total.charge_amount)) : (acc += 0);
    }, 0);
    setFobAdditionalCost(fob);
    let Inland = data?.reduce((acc, total) => {
      return total.heading === 'Inland_Charges' ? (acc = acc + Number(total.charge_amount)) : (acc += 0);
    }, 0);
    setInlandCost(Inland);

    if (CustomClearanceData?.add_shippment_containers?.length > 0) {
      let totalContainer = CustomClearanceData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = CustomClearanceData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = CustomClearanceData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (CustomClearanceData?.shipment_advise_items?.length > 0) {
      let totalPackage = CustomClearanceData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [CustomClearanceData]);

  const [showTableHeading, setShowTableHeading] = useState({
    basicInformation: true,
    forexTable: true,
    searchOption: true,
    BreakupAmountDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <CustomTypography variant="h7" fontWeight={600}>
              {sectionLabel}
            </CustomTypography>
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
      <Table>
        {renderTableHeader('searchOption', 'Basic Information')}
        {showTableHeading.searchOption && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Number:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.pfi_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.pfi_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">OPO No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.opo_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Delivery Unit:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.company_name}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Supplier Name:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.supplier_name}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">FORM M No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.form_m_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">FORM M Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.form_m_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Expiry Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.form_m_expiry_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.ba_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">LC No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.lc_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Product Description:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.product_description}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Status:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.shipment_status}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">No of Previous shipment:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.no_of_previous_shipment}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Value Of Previous Shipment:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.value_of_previous_shipment}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BL No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.bl_awb_no}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">BL Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.bl_awb_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Free Days:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.free_days}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Mode:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.shipment_mode_name}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Vessel Name, No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{`${CustomClearanceData?.shippment_advise_master?.shipping_vehicle}, ${CustomClearanceData?.shippment_advise_master?.vehicle_description}`}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Port Of Loading:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.port_of_loading}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Port Of DC:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.port_of_dc}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">No Of Container:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{TotalContainer}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">No Of Packages:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{TotalPackage}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Net Weight:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{NetWeight}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Gross Weight:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{GrossWeight}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Commercial Invoice No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.ci_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Commercial Invoice Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.ci_date}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow></TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">FOB (A):</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{FobAdditionalCost}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Inland Transport & Doc Charge (B):</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{InlandCost}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Freight (C):</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{FreightAdditionalCost}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Supplier ETA:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.eta}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">OPR No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{CustomClearanceData?.opr_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Total (A+B+C):</CustomTypography>
              </TableCell>
              <TableCell colSpan={5}>
                <CustomTypography>{CustomClearanceData?.pfi_amount}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Rotation Number:</CustomTypography>
              </TableCell>
              <TableCell colSpan={5}>
                <CustomTypography>{CustomClearanceData?.assessment?.rotation_no}</CustomTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Table>{renderTableHeader('BreakupAmountDetails', 'Quotation Amount Breakup')}</Table>
      <Table>
        {showTableHeading.BreakupAmountDetails && (
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: '500' }}>FOB Cost</TableCell>
              <TableCell>
                {CustomClearanceData?.shippment_advise_master?.shipment_advise_items?.reduce(
                  (acc, item) => acc + Number(item.ci_line_total),
                  0
                )}
                {` `}
                {CustomClearanceData?.quotation_master?.currency}
              </TableCell>
              <TableCell sx={{ fontWeight: '500' }}>Inland Charges:</TableCell>
              <TableCell>
                {CustomClearanceData?.additional_costs?.reduce((acc, charge) => {
                  return charge.heading !== 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                }, 0)}
                {` `}
                {CustomClearanceData?.quotation_master?.currency}
              </TableCell>
              <TableCell sx={{ fontWeight: '500' }}>Freight Cost:</TableCell>
              <TableCell>
                {CustomClearanceData?.additional_costs?.reduce((acc, charge) => {
                  return charge.heading === 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                }, 0)}
                {` `}
                {CustomClearanceData?.quotation_master?.currency}
              </TableCell>
              <TableCell sx={{ fontWeight: '500' }}>Quotation Amount:</TableCell>
              <TableCell>
                {CustomClearanceData.total_cost +
                  CustomClearanceData?.additional_costs?.reduce((acc, charge) => {
                    return charge.heading === 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                  }, 0) +
                  CustomClearanceData?.additional_costs?.reduce((acc, charge) => {
                    return charge.heading !== 'Freight_Charges' ? (acc += Number(charge.charge_amount)) : acc;
                  }, 0)}
                {` `}
                {CustomClearanceData?.quotation_master?.currency}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </>
  );
}
