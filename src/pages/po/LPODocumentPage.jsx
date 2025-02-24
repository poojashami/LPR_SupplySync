import React, { useState, useEffect, useRef } from 'react';
import { GetPOItems } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Button, CircularProgress, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import logo from '../../assets/images/LogoB.png';
import { axiosInstance } from 'utils/axiosInstance';
import { setMailData } from 'Redux/Slices/MailSlice';
import { ToWords } from 'to-words';
import MainCard from 'components/MainCard';
import SubmitButton from 'components/CustomSubmitBtn';
import CancelButton from 'components/CustomCancelButton';
import PlusButton from 'components/CustomButton';

const LPODocumentPage = ({ poViewData, onClose }) => {
  console.log('ASDFG', poViewData);
  const toWords = new ToWords({ localeCode: 'en-US' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemsList } = useSelector((state) => state.purchaseOrder);
  const [quotationItm, setQuotationItm] = useState(null);
  const [vendorData, setVendorData] = useState({});
  const [poData, setPoData] = useState({});
  const [total, setTotal] = useState(0);
  const [totalAdd, setTotalAdd] = useState(0);
  const [in_land, setInLand] = useState(0);
  const [TotalFreightCost, setTotalFreightCost] = useState(0);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const [allData, setAllData] = useState([]);

  const fetchPoData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/po/vendor', {
        params: {
          po_id: poViewData?.po_id
        }
      });
      console.log(data[0]);
      setAllData(data[0]);
      setVendorData({
        vendor_name: data[0]?.VendorsMaster?.vendor_name,
        phone_number: data[0]?.VendorsMaster?.phone_number,
        email: data[0]?.VendorsMaster?.email
      });
      setPoData({
        po_num: data[0]?.po_num,
        created_on: data[0]?.created_on?.split('T')[0],
        address: `${data[0]?.VendorsMaster?.AddressDetailsMasters[0]?.address_line1},${data[0]?.VendorsMaster?.AddressDetailsMasters[0]?.address_line1},${data[0]?.VendorsMaster?.AddressDetailsMasters[0]?.city}`,
        reference: data[0]?.VendorsMaster?.reference_by,
        currency: data[0]?.currency,
        payment_term: data[0]?.payment_terms,
        lead_time: data[0]?.lead_time,
        delivery_term: data[0]?.delivery_terms
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPoData();
    GetPOItems(dispatch, poViewData?.po_id);
  }, []);

  useEffect(() => {
    let totalInland = poViewData?.quotation_master?.additional_costs?.reduce((acc, item) => {
      return item.heading !== 'Freight_Charges' && item?.charges_by === 'Supplier' ? acc + Number(item.charge_amount) : acc;
    }, 0);
    setInLand(totalInland);

    let totalFreight = poViewData?.quotation_master?.additional_costs?.reduce((acc, item) => {
      return item.heading === 'Freight_Charges' && item?.charges_by === 'Supplier' ? acc + Number(item.charge_amount) : acc;
    }, 0);
    setTotalFreightCost(totalFreight);

    setTotalAdd(Number(totalInland + totalFreight));
  }, []);

  useEffect(() => {
    console.log(itemsList);
    try {
      const mapdata = itemsList.map((item, index) => ({
        id: index + 1,
        item_type: item?.ItemsMaster?.item_type,
        itemSpecification: item?.po_item_description || 'SPEC NEEDED',
        itemDescription: item?.po_item_description || 'DESC NEEDED',
        item_name_label: item?.quotation_item?.item_name_label,
        item_name_vendor: item?.quotation_item?.item_name_vendor,
        uom: item?.rfq_item?.uom_name,
        item_name: item?.ItemsMaster?.item_name,
        oprQty: item.po_qty,
        opoQty: item.po_qty,
        quoteQty: item.po_qty,
        rate: item.rate,
        remarks: item.remarks,
        tolerance: item?.rfq_item?.tolerance
      }));
      const total = mapdata?.reduce((accumulator, item) => {
        return accumulator + item.rate * item.oprQty;
      }, 0);
      setTotal(total);
      setQuotationItm(mapdata);
    } catch (error) {
      toast.error(error.message);
    }
  }, [itemsList]);

  const handlePrint = () => {
    navigate('/po/email');
  };

  const lead_time_po = poViewData?.lead_time.split(',').sort();

  const mailHandler = () => {
    navigate('/po/email');
  };

  const printDataRef = useRef(null);
  return (
    <MainCard
      title={
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} fontSize={'16px'} fontWeight={600}>
          Purchase Order Doc
          <PlusButton label={'Back'} onClick={() => navigate('/po/issued_lpo')} />
        </Box>
      }
    >
      <div ref={printDataRef} className="print_data my-table">
        {/* ----------------------------------- SECOND PAGE ---------------------------------- */}
        <Grid className="firstPage" container spacing={0} justifyContent="center" sx={{ border: '1px solid black' }}>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" sx={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
              COMMERCIAL INVOICE
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" align="center" sx={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
              FULL & FINAL SHIPMENT
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px' }}>
                {poViewData?.buyer_name}
                <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                  {poViewData?.buyer_address} <div>TELEPHONE NO : {poViewData?.VendorsMaster?.phone_number}</div>
                  {/* <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                    {poViewData?.VendorsMaster?.AddressDetailsMasters[0]?.city}{' '}
                    {poViewData?.VendorsMaster?.AddressDetailsMasters[0]?.state},{' '}
                    {poViewData?.VendorsMaster?.AddressDetailsMasters[0]?.country}
                  </div> */}
                </div>
              </Grid>
              <Grid item xs={6} sx={{ paddingLeft: '10px' }}>
                <div>
                  {' '}
                  INVOICE NO:
                  <b>{poViewData?.shippment_advise_master.ci_num}</b>
                </div>
                <div>
                  {' '}
                  DATE:
                  <b>{poViewData?.updated_on}</b>
                </div>

                {/* <div style={{ fontSize: '11px' }}>
                  {poViewData?.BuyingHouse?.address_line1}, {poViewData?.BuyingHouse?.address_line2}, {poViewData?.BuyingHouse?.city},{' '}
                  {poViewData?.BuyingHouse?.state}, {poViewData?.BuyingHouse?.country}
                </div> */}
                <div style={{ fontSize: '11px' }}>
                  <div>{poViewData?.BuyingHouse?.contact_number}</div>
                  <div>{poViewData?.BuyingHouse?.contact_email}</div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px', padding: '10px' }}>
                <div> CONSIGNEE:</div>
                <div>TO THE ORDER OF</div>
                {/* {poViewData.opo_master?.OprMaster?.companyMaster?.company_name}

                <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                  {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].address_line1}{' '}
                  {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].address_line2},{' '}
                  <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                    {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].city}{' '}
                    {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].state},{' '}
                    {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].country}
                  </div>
                </div> */}
              </Grid>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px', padding: '10px' }}>
                <div> INVOICE TO:</div>
                {/* {poViewData.opo_master?.OprMaster?.companyMaster?.company_name}

                <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                  {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].address_line1}{' '}
                  {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].address_line2},{' '}
                  <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                    {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].city}{' '}
                    {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].state},{' '}
                    {poViewData?.opo_master.OprMaster.companyMaster.AddressMasters[0].country}
                  </div>
                </div>
                 */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Sl.No.</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Item</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Vendor Item Name</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Item Label Name</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Tolerance</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>QTY</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>UOM</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                    Unit Price in
                    {/* {allData?.quotation_master?.currency}{' '} */}
                  </th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>
                    Total Price in
                    {/* {poData?.currency || allData?.quotation_master?.currency} */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {poViewData?.shippment_advise_master.shipment_advise_items?.map((order, index) => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid black' }}>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{++index}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name_vendor}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name_label}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{`${order.tolerance} %`}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.oprQty}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.uom}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{formatNumber(order?.ci_rate)}</td>
                   

                    <td style={{ padding: '8px', textAlign: 'left' }}>{formatNumber((order.rate * order.oprQty)?.toFixed(2))}</td>
                  </tr>
                ))}
                <tr style={{ borderBottom: '1px solid black', height: '200px' }}>
                  <td colSpan={6} style={{ padding: '8px' }}></td>
                </tr> */}
              </tbody>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Vessel Name & Voyage</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Bill of Lading Number</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>
                    {poViewData &&
                      formatNumber(
                        (
                          poViewData?.po_items?.reduce((accumulator, num) => {
                            return accumulator + num?.rate * num?.po_qty;
                          }, 0) + in_land
                        ).toFixed(2)
                      )}
                  </b> */}
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Port of Loading</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Port of DisCharge</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Type of Containers</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Country of Origin</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Form M Number</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>Letter of Credit No.</b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  {/* <b>{formatNumber(in_land.toFixed(2))}</b> */}?
                </td>
              </tr>
            </table>
          </Grid>
        </Grid>
      </div>
      <Box display="flex" justifyContent="center" mt={2} gap={2}>
        <SubmitButton disabled={loading} onClick={mailHandler} endIcon={loading ? <CircularProgress size={'small'} /> : <SendIcon />}>
          Send via Mail
        </SubmitButton>
        <SubmitButton disabled={loading} onClick={handlePrint} endIcon={loading ? <CircularProgress size={'small'} /> : <DownloadIcon />}>
          Download CI Doc
        </SubmitButton>
        <CancelButton variant="contained" color="secondary" onClick={onClose}>
          Close
        </CancelButton>
      </Box>
    </MainCard>
  );
};

export default LPODocumentPage;
