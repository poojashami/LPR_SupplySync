import React, { useRef } from 'react';
import { Typography, Grid } from '@mui/material';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoUrl from '../../assets/images/LogoB.png';

const EmailView = ({ onClose }) => {
  const purchaseOrders = [
    { s_no: 1, orderId: 'PO123', hs_code: '6806100000', description: 'Description of Item A', quantity: 10, uom: 'KGS', unitPrice: 50 }

    // Add more purchase orders as needed
  ];
  const handlePrint = () => {
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
            doc.save('save.pdf');
          }
        }
      });
    });
  };

  const printDataRef = useRef(null);

  return (
    <>
      <div ref={printDataRef} className="print_data my-table pdf-content">
        {/* ----------------------------------- SECOND PAGE ---------------------------------- */}
        <Grid className="firstPage" container spacing={0} justifyContent="center" sx={{ border: '1px solid black' }}>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" sx={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
              Proforma Invoice
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" sx={{ borderBottom: '1px solid black' }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', minHeight: '80px' }}>
                <Grid container>
                  <Grid item xs={6} sm={4} container justifyContent="center" alignItems="center">
                    <img src={logoUrl} alt="Company Logo" style={{ maxHeight: '100px', maxWidth: '100%' }} />
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <div>
                      <b>SUPPLI SYNC </b>
                    </div>
                    <div style={{ fontSize: '11px' }}>Unit No 245, DMCC Business Center, Level 1, Jewelry & Gemplex Dubai, UAE</div>
                    <div style={{ fontSize: '11px' }}>
                      <div>+ 8436856439</div>
                      <div>email@yomail.com</div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} sx={{ borderRight: '1px solid black', paddingLeft: '5px', minHeight: '80px' }}>
                <div style={{ fontSize: '11px' }}>
                  <b>Proforma Invoice No : DGSJHG2788</b>
                  <br />
                  <b>Proforma Invoice No Date : 27.04.2024</b> <br />
                  <b>Country Of Origin: 27.04.2024</b> <br />
                  <b>OPR No : 25.BRL-0096-1</b> <br />
                  <b>Invoice To : </b> <br />
                  <b>WEST AFRICAN CERAMICS LTD OGORO VILLAGE, NEAR NIGER BRIDGE AJAOKUTA, AJAOKUTA, KOGI</b> <br />
                  <br />
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>SR</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Description</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>HS CODE </th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>QTY </th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>UOM</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>Unit Price in USD</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Total Price in USD</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'center' }}>
                    <b>SEMIGLOSS PAPER</b>
                  </td>
                </tr>
                {purchaseOrders.map((order) => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid black' }}>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.s_no}</td>

                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.description}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.hs_code}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.quantity}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>{order.uom}</td>
                    <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>${order.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>${(order.unitPrice * order.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ borderBottom: '1px solid black', height: '160px' }}>
                  <td colSpan={7} style={{ padding: '8px' }}></td>
                </tr>
              </tbody>

              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>INLAND FRIEGHT & DOCUMENTATION CHARGES: </b>
                </td>
                <td style={{ padding: '8px', textAlign: 'left' }}>
                  <b>225.00</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>FOB ANY SEAPORT INDIA: </b>
                </td>
                <td style={{ padding: '8px', textAlign: 'left' }}>
                  <b>225.00</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>SEA FRIEGHT, TINCAN ISLAND SEAPORT LAGOS NIGERIA: </b> <br />
                  <b>USD THREE THOUSAND TWO HUNDRED FIVE ONLY</b> <br />
                </td>
                <td style={{ padding: '8px', textAlign: 'left' }}>
                  <b>3,205</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>TOTAL CFR TINCAN ISLAND SEAPORT LAGOS NIGERIA : </b>
                </td>
                <td style={{ padding: '8px', textAlign: 'left' }}>
                  <b>2,105</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', fontSize: '11px', padding: '8px', textAlign: 'left' }}>
                  <b>COMPANY NAME : ELEVENT GLOBAL PRIVATE LIMITED </b>
                  <br />
                  <b>ACCOUNT DETAILS : 8672585983498 SWIFT CODE: UIBHUH00028 </b>
                  <br />
                  <b>BANK NAME & ADDRESS : Union Bank of India, Mahakali Caves Road, MIDC, Andheri East, Mumbai 400093 </b>
                  <br />
                  <b>CORRESPONDENCE BANK NAME : City Bank A/c No.: 10929227, SWIFT Code: CITIUS33 </b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', fontSize: '11px', padding: '8px', textAlign: 'left' }}>
                  <b>SHIPMENT : ELEVENT GLOBAL PRIVATE LIMITED </b>
                  <br />
                  <b>PORT OF SHIPMENT : ANY SEAPORT INDIA </b>
                  <br />
                  <b>PORT OF DISCHARGE : TINCAN ISLAND SEAPORT LAGOS NIGERIA </b>
                  <br />
                  <b>COUNTRY OF SUPPLY : INDIA </b>
                  <br />
                  <b>PAYMENT BY : Not Valid for Forex </b>
                </td>
              </tr>
            </table>
          </Grid>
        </Grid>
      </div>
      {/* <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" onClick={handlePrint}>
          Download PO Doc
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose} sx={{ ml: 2 }}>
          Close
        </Button>
      </Box> */}
    </>
  );
};

export default EmailView;
