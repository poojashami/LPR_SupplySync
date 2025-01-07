import React, { useState, useEffect, useRef } from 'react';
import { GetQuotation, GetPOItems } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Button, CircularProgress, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../../assets/images/LogoB.png';
import { setMailData } from 'Redux/Slices/MailSlice';
import { useNavigate } from 'react-router';

const ViewQuotation = ({ oprViewData, onClose }) => {
  console.log('ADFSJVH', oprViewData);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemsList } = useSelector((state) => state.purchaseOrder);
  const [quotationItm, setQuotationItm] = useState(null);
  const [vendorData, setVendorData] = useState({});
  const [poData, setPoData] = useState({});
  const [total, setTotal] = useState(0);
  useEffect(() => {
    console.log(oprViewData);
    GetPOItems(dispatch, oprViewData?.po_id);
  }, []);

  useEffect(() => {
    setVendorData(itemsList[0]?.VendorsMaster);
    setPoData({
      po_num: itemsList[0]?.po_num,
      created_on: itemsList[0]?.created_on,
      address: `${itemsList[0]?.VendorsMaster?.AddressDetailsMasters?.address_line1},${itemsList[0]?.VendorsMaster?.AddressDetailsMasters?.address_line1},${itemsList[0]?.VendorsMaster?.AddressDetailsMasters?.city}`,
      reference: itemsList[0]?.VendorsMaster?.reference_by,
      currency: itemsList[0]?.currency,
      payment_term: itemsList[0]?.payment_terms,
      lead_time: itemsList[0]?.lead_time,
      delivery_term: itemsList[0]?.delivery_terms
    });
    // const mapdata = itemsList[0]?.po_items.map((item, index) => ({
    //   id: index + 1,
    //   item_type: 'TYPE NEEDED',
    //   itemSpecification: 'SPEC NEEDED',
    //   itemDescription: 'DESC NEEDED',
    //   uom: item.ItemsMaster.uom_id,
    //   item_name: item?.ItemsMaster?.item_name,
    //   oprQty: item.po_qty,
    //   opoQty: item.po_qty,
    //   quoteQty: item.po_qty,
    //   rate: item.rate,
    //   remarks: item.remarks
    // }));
    // const total = mapdata?.reduce((accumulator, item) => {
    //   return accumulator + item.rate * item.oprQty;
    // }, 0);
    setTotal(total);
    // setQuotationItm(mapdata);
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
                // data: {
                //   po_id: oprViewData.po_id,
                //   to: vendorData?.email,
                //   subject: `Document PO No.${oprViewData?.po_num}`,
                //   documentName: oprViewData?.po_num,
                //   attachment: blob,
                //   description: `Dear ${vendorData?.vendor_name}, </br> PFA your PO document for your kind acceptance.<br><br><br><br><br><br><br><br> Thanks, <br> Team Suppli Sync`
                // }
                data: {
                  doc_id: oprViewData?.service_quo_id,
                  doc_type: 'service_po',
                  to: 'rakeshran750@gmail.com',
                  subject: `Document PO No.5`,
                  documentName: 'docX450',
                  attachment: blob,
                  description: `Dear Rakesh, </br> Please find attached your PO document for your kind acceptance.<br>
                  PFA Purchase Order aginst Quote No. - ${oprViewData?.quotation_master?.quo_num}<br><br><br><br><br><br><br> Thanks, <br> Team Suppli Sync`
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
              Service Purchase Order
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px' }}>
                <img src={logo} alt="Company Logo" style={{ maxHeight: '100px', maxWidth: '100%' }} />
              </Grid>
              <Grid item xs={6} sx={{ paddingLeft: '10px' }}>
                <div>
                  <b>SUPPLY SYNC</b>
                </div>

                <div style={{ fontSize: '11px' }}>Unit No 245, DMCC Business Center, Level 1, Jewelry & Gemplex Dubai, UAE</div>
                <div style={{ fontSize: '11px' }}>
                  <div>+ 8436856439</div>
                  <div>email@yomail.com</div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '50px', padding: '10px' }}>
                <div>
                  <b>{vendorData?.vendor_name}</b>
                </div>

                <div style={{ fontSize: '11px', marginBottom: '15px' }}>{poData?.address}</div>
                <div style={{ fontSize: '11px' }}>
                  <div>TELEPHONE NO : {vendorData?.phone_number}</div>
                  <div>EMAIL : {vendorData?.email}</div>
                </div>
              </Grid>
              <Grid item xs={6} sx={{ paddingLeft: '10px' }}>
                <div style={{ fontSize: '11px' }}>
                  <b>PO No : {poData?.po_num}</b>
                  <br />
                  <b>PO Date : {poData?.created_on}</b> <br />
                  {/* <b>OPO No : {quotations[0].reference_no}</b> <br /> */}
                  <b>VENDER REF No : {poData?.reference}</b> <br />
                  <b>VENDER REF DATE : 1</b>
                  <br />
                  <b>TOLERANCE : 10.0</b>
                  <br />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Service</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Description</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>QTY</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Rate</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Unit Price in USD</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>UOM</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Total Price in {poData?.currency}</th>
                </tr>
              </thead>
              <tbody>
                {quotationItm?.map((order) => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid black' }}>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.item_name}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.itemDescription}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.oprQty}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.rate}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                      {order.oprQty * order?.rate?.toFixed(2)}
                    </td>

                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.uom}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{(order.rate * order.oprQty)?.toFixed(2)}</td>
                  </tr>
                ))}
                <strong style={{ textAlign: 'center', color: 'blue' }}>Service List Will Be Shown Here</strong>
                <tr style={{ borderBottom: '1px solid black', height: '200px' }}>
                  <td colSpan={6} style={{ padding: '8px' }}></td>
                </tr>
              </tbody>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={5} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>TOTAL</b>
                </td>
                <td style={{ padding: '8px', textAlign: 'left' }}>
                  <b>USD {total}</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', fontSize: '11px', padding: '8px', textAlign: 'left' }}>
                  <strong>SHIPMENT INSTRUCTION : SHIPMENT INSTRUCTION WILL BE PROVIDED AT TIME OF SHIPPING </strong>
                  <br />
                  <strong>PAYMENT TERM :{poData?.payment_term}</strong>
                  <br />
                  <strong>PACKING & FORWARDING : INCLUDED </strong>
                  <br />
                  <strong>DELIVERY TIME :{poData?.lead_time}</strong>
                  <br />
                  <strong>DELIVERY TERM :{poData?.delivery_term}</strong>
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
              <b>SUPPLY SYNC</b>
            </div>
            <div style={{ fontSize: '12px' }}>Office No. 3001, 30th Floor,</div>
            <div style={{ fontSize: '12px' }}>
              <div>One Lake Plaza Tower, Cluster T </div>
              <div>Jumeirah Lake Towers, Dubai, UAE</div>
            </div>
          </Grid>
          <Grid item xs={12} sx={{ minHeight: '50px', padding: '10PX' }}>
            <h4>
              <u>DOCUMENTATION REQUIRED : </u>
            </h4>
            <p>
              Kindly ensure that no documentation whatsoever accompanies the goods. Kindly arrange to send following documents to our office
              as soon as the goods are dispatched, within a week from shipment date. All documents listed hereunder to be drawn inEnglish:
            </p>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Original Invoice in Duplicate</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Packing list</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Certificate Of Origin</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Fumigation Certificate and/or Phytosanitary Certificate in case of wood packing -ISPM15</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Test Certificate / Operational Manual / TDS as one of the documents listed</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Warranty 12 months 24 months 36 months Other</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>Courier Waybill copy</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div> original and 3 copies of Airway Bill - prepared in accordance to UCP Rules and Our Shipping Instructions</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>
                3 originals and 5 Authentic Shipping Line N/N copies of Master Bill of Lading (photocopies of OBL not accepted) - prepared
                in accordance to UCP Rules and Our Shipping Instructions (FCL) OR 3 originals and 5 N/N copies of House Bill of Lading
                (photocopies of OBL not accepted) - prepared in accordance to UCP Rules and Our Shipping Instructions (LCL)
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>
                4 originals of Manufacturer&apos;s Certificate of Production stating standards adopted (i.e. ISO, DIN, ASTM etc.). All
                copies to be signed in original with company stamp. As per requirement of Nigeria, Form M number and Letter of Credit number
                (if applicable) will be provided in due course, must be quoted in this certificate. The Certificate to be dated after giving
                shipping instruction
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <div>
                <input type="checkbox" />
              </div>
              <div>
                Product Certificate and Certificate of Conformity issued by the third party satisfying the requirements of SONCAP, if
                requested when applying for Form M / BIVAC documents for DRC/IVC. For DRC, IVC, BIVAC inspection is mandatory at premises
                during the loading.
              </div>
            </div>
            <h5 style={{ textAlign: 'center' }}>ALL ABOVE LISTED DOCUMENTS MUST BE SENT BY EMAIL AS DRAFTS FOR APPROVAL FIRST</h5>
            <h4>
              <u>SPECIAL INSTRUCTIONS : </u>
            </h4>
            Attached to this purchase order is a confirmation of receipt required by us. We would appreciate it if you could email it back
            to us duly completed within 24 hours of receipt of our order.
            <h5>Your Faithfully,</h5>
            <h5>SUPPLY SYNC,</h5>
            <hr></hr>
            <h5 style={{ textAlign: 'center' }}>CONFIRMATION OF SAFE RECEIPT OF YOUR PURCHASE ORDER</h5>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}></Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body1">
                  <b>To: </b> SUPPLY SYNC
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}></Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body1">
                  <b>P.O NO:</b> 12345
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
