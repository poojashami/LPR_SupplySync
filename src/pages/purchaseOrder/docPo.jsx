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

const ViewQuotation = ({ oprViewData, onClose }) => {
  console.log('ASDFG', oprViewData);
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
          po_id: oprViewData?.po_id
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
    GetPOItems(dispatch, oprViewData?.po_id);
  }, []);

  useEffect(() => {
    let totalInland = oprViewData?.quotation_master?.additional_costs?.reduce((acc, item) => {
      return item.heading !== 'Freight_Charges' && item?.charges_by === 'Supplier'
        ? acc + Number(item.charge_amount)
        : acc;
    }, 0);
    setInLand(totalInland);

    let totalFreight = oprViewData?.quotation_master?.additional_costs?.reduce((acc, item) => {
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
    setLoading(true);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const elements = document.querySelectorAll('.my-table');
    const padding = 20;

    elements.forEach((element, index) => {
      if (index > 0) {
        doc.addPage();
      }

      doc.html(element, {
        x: padding,
        y: padding,
        width: 595.28 - 2 * padding, // A4 width - padding
        windowWidth: 595.28, // Ensure the width matches A4 width in points
        callback: () => {
          if (index === elements.length - 1) {
            setLoading(false);
            doc.save('save.pdf');
          }
        }
      });
    });
  };

  const lead_time_po = oprViewData?.lead_time.split(',').sort();

  const mailHandler = () => {
    setLoading(true);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const elements = document.querySelectorAll('.my-table');
    const padding = 20;

    elements.forEach((element, index) => {
      if (index > 0) {
        doc.addPage();
      }

      doc.html(element, {
        x: padding,
        y: padding,
        width: 595.28 - 2 * padding, // A4 width - padding
        windowWidth: 595.28, // Ensure the width matches A4 width in points
        callback: () => {
          if (index === elements.length - 1) {
            const blob = doc.output('blob');
            dispatch(
              setMailData({
                data: {
                  doc_id: oprViewData.po_id,
                  doc_type: 'po',
                  to: vendorData?.email,
                  subject: `Document PO No.${oprViewData?.po_num}`,
                  documentName: oprViewData?.po_num,
                  attachment: blob,
                  description: `Dear ${oprViewData?.VendorsMaster?.contact_person},</br>${oprViewData?.companyMaster?.company_name}
                  <br><br> Greetings! <br>
                   Please find attached PO against Quotation No. ${oprViewData?.quotation_master?.quo_num}.<br>
                   Kindly send us signed and stamped copy of the PO along with Proforma Invoice for further processing.<br><br><br><br><br><br><br> Thanks, <br> Team ${oprViewData?.BuyingHouse?.buying_house_name}`
                }
              })
            );
            setLoading(false);
            navigate('/email');
          }
        }
      });
    });
  };

  const printDataRef = useRef(null);
  return (
    <>
      <div ref={printDataRef} className="print_data my-table">
        {/* ----------------------------------- SECOND PAGE ---------------------------------- */}
        <Grid className="firstPage" container spacing={0} justifyContent="center" sx={{ border: '1px solid black' }}>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" sx={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
              Purchase Order
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px' }}>
                <img src={logo} alt="Company Logo" style={{ maxHeight: '100px', maxWidth: '100%' }} />
              </Grid>
              <Grid item xs={6} sx={{ paddingLeft: '10px' }}>
                <div>
                  <b>{oprViewData?.BuyingHouse?.buying_house_name}</b>
                </div>

                <div style={{ fontSize: '11px' }}>
                  {oprViewData?.BuyingHouse?.address_line1}, {oprViewData?.BuyingHouse?.address_line2}, {oprViewData?.BuyingHouse?.city},{' '}
                  {oprViewData?.BuyingHouse?.state}, {oprViewData?.BuyingHouse?.country}
                </div>
                <div style={{ fontSize: '11px' }}>
                  <div>{oprViewData?.BuyingHouse?.contact_number}</div>
                  <div>{oprViewData?.BuyingHouse?.contact_email}</div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px', padding: '10px' }}>
                <div>
                  <b>{oprViewData?.VendorsMaster?.vendor_name}</b>
                </div>

                <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                  {oprViewData?.VendorsMaster?.AddressDetailsMasters[0]?.address_line1}{' '}
                  {oprViewData?.VendorsMaster?.AddressDetailsMasters[0]?.address_line2},{' '}
                  <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                    {oprViewData?.VendorsMaster?.AddressDetailsMasters[0]?.city}{' '}
                    {oprViewData?.VendorsMaster?.AddressDetailsMasters[0]?.state},{' '}
                    {oprViewData?.VendorsMaster?.AddressDetailsMasters[0]?.country}
                  </div>
                </div>
                <div style={{ fontSize: '11px' }}>
                  <div>TELEPHONE NO : {oprViewData?.VendorsMaster?.phone_number}</div>
                  <div>EMAIL : {oprViewData?.VendorsMaster?.contact_person_email}</div>
                </div>
              </Grid>
              <Grid item xs={6} sx={{ paddingLeft: '10px' }}>
                <div style={{ fontSize: '11px' }}>
                  <b>PO No : {oprViewData?.po_num}</b>
                  <br />
                  <b>PO Date : {oprViewData?.created_on}</b> <br />
                  {/* <b>OPO No : {quotations[0].reference_no}</b> <br /> */}
                  <b>VENDOR QUOTATION No : {oprViewData?.quotation_master?.quo_num}</b> <br />
                  <b>VENDOR QUOTATION DATE : {oprViewData?.quotation_master?.quo_date}</b>
                  <br />
                  {/* <b>TOLERANCE : </b> */}
                  <br />
                </div>
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
                    Unit Price in {allData?.quotation_master?.currency}{' '}
                  </th>
                  {/* <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Total</th> */}
                  <th style={{ padding: '8px', textAlign: 'left' }}>
                    Total Price in {poData?.currency || allData?.quotation_master?.currency}
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotationItm?.map((order, index) => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid black' }}>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{++index}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name_vendor}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name_label}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{`${order.tolerance} %`}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.oprQty}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.uom}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{formatNumber(order?.rate)}</td>
                    {/* <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                      {formatNumber(order.oprQty * order?.rate)}
                    </td> */}

                    <td style={{ padding: '8px', textAlign: 'left' }}>{formatNumber((order.rate * order.oprQty)?.toFixed(2))}</td>
                  </tr>
                ))}
                <tr style={{ borderBottom: '1px solid black', height: '200px' }}>
                  <td colSpan={6} style={{ padding: '8px' }}></td>
                </tr>
              </tbody>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>INLAND FREIGHT & DOCUMENTATION CHARGES: </b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  <b>{formatNumber(in_land.toFixed(2))}</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>FOB - ANY SEAPORT IN INDIA: </b>
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  <b>
                    {oprViewData &&
                      formatNumber(
                        (
                          oprViewData?.po_items?.reduce((accumulator, num) => {
                            return accumulator + num?.rate * num?.po_qty;
                          }, 0) + in_land
                        ).toFixed(2)
                      )}
                  </b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ textTransform: 'uppercase', borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>
                    SEA FREIGHT,
                    {oprViewData && oprViewData?.quotation_master?.port_of_loading} LAGOS NIGERIA:
                  </b>{' '}
                  <br />
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  <b>{formatNumber(TotalFreightCost.toFixed(2))}</b>
                </td>
              </tr>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>TOTAL: </b>
                  <b style={{ textTransform: 'uppercase' }}>
                    {allData?.quotation_master?.currency} {toWords.convert(total + totalAdd)} only
                  </b>
                  <br />
                </td>
                <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>
                  <b>{formatNumber(total + totalAdd)}</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', fontSize: '11px', padding: '8px', textAlign: 'left' }}>
                  <strong>SHIPMENT INSTRUCTION : SHIPMENT INSTRUCTION WILL BE PROVIDED AT TIME OF SHIPPING </strong>
                  <br />
                  <strong>
                    PAYMENT TERM :{' '}
                    {oprViewData?.quotation_master?.payment_milestones.map((milestone, index) => (
                      <span key={index}>
                        {' '}
                        {milestone.milestone} {milestone.percentage}%,
                      </span>
                    ))}
                  </strong>
                  <br />
                  <strong>PACKING & FORWARDING : </strong>
                  <br />
                  <strong>DELIVERY TIME :{lead_time_po[0]}</strong>
                  <br />
                  <strong>DELIVERY TERM : {oprViewData?.quotation_master?.delivery_terms_quo?.delivery_terms_name}</strong>
                  <br />
                  <strong>MARKS & NO. : </strong>
                </td>
              </tr>
            </table>
          </Grid>
        </Grid>
        {/* ----------------------------------- SECOND PAGE ---------------------------------- */}
        <Grid className="secondPage" container spacing={0} sx={{ border: '1px solid black', marginTop: '40px' }}>
          <Grid item xs={8} sx={{ minHeight: '50px' }}></Grid>
          <Grid item xs={4} sx={{ paddingLeft: '10px', justifyContent: 'end' }}>
            <div style={{ fontSize: '20px' }}>
              <b>{oprViewData?.BuyingHouse?.buying_house_name}</b>
            </div>
            <div style={{ fontSize: '12px' }}>
              <div>
                {oprViewData?.BuyingHouse?.address_line1}, {oprViewData?.BuyingHouse?.address_line2},{' '}
              </div>
              <div style={{ fontSize: '12px' }}>
                {oprViewData?.BuyingHouse?.city}, {oprViewData?.BuyingHouse?.state}, {oprViewData?.BuyingHouse?.country}
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sx={{ minHeight: '50px', padding: '10PX' }}>
            <h4>
              <u>DOCUMENTATION REQUIRED : </u>
            </h4>
            <p>
              Kindly ensure that no documentation whatsoever accompanies the goods. Kindly arrange to send following documents to our office
              as soon as the goods are dispatched, within a week from shipment date. All documents listed hereunder to be drawn in English:
            </p>
            {allData?.quotation_master?.quo_require_docs?.length > 0 ? (
              allData.quotation_master.quo_require_docs.map((item, index) => {
                return (
                  <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }} key={index}>
                    <div>
                      <input type="checkbox" />
                    </div>
                    <div>{item?.doc_name}</div>
                  </div>
                );
              })
            ) : (
              <div>No documents available</div>
            )}
            <h5>ALL ABOVE LISTED DOCUMENTS MUST BE SENT BY EMAIL AS DRAFTS FOR APPROVAL FIRST</h5>
            <h4>
              <u>SPECIAL INSTRUCTIONS : </u>
            </h4>
            Kindly send us signed and stamped copy of Purchase Order along with Proforma Invoice for further processing.
            <h5>Your Faithfully,</h5>
            <h5>{oprViewData?.BuyingHouse?.buying_house_name},</h5>
            <hr></hr>
            <h5 style={{ textAlign: 'center' }}>CONFIRMATION OF SAFE RECEIPT OF YOUR PURCHASE ORDER</h5>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}></Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">
                  <b>To: </b> {oprViewData?.BuyingHouse?.buying_house_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}></Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body1">
                  <b>P.O NO:</b> {oprViewData?.po_num}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}></Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">
                  <b>ATTN:</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}></Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">
                  <b>SUP:</b>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Box display="flex" justifyContent="center" mt={2} gap={2}>
        <Button
          disabled={loading}
          variant="contained"
          onClick={mailHandler}
          endIcon={loading ? <CircularProgress size={'large'} sx={{ color: 'primary' }} /> : <SendIcon />}
        >
          Send via Mail
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          onClick={handlePrint}
          endIcon={loading ? <CircularProgress size={'large'} sx={{ color: 'primary' }} /> : <DownloadIcon />}
        >
          Download PO Doc
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </>
  );
};

export default ViewQuotation;
