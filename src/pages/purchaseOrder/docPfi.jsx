import React, { useRef, useState, useEffect } from 'react';
import { Typography, Grid, Button, CircularProgress, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoUrl from '../../assets/images/LogoB.png';
import { useDispatch } from 'react-redux';
import { setMailData } from 'Redux/Slices/MailSlice';
import { useNavigate } from 'react-router';
import { ToWords } from 'to-words';
import { axiosInstance } from 'utils/axiosInstance';

const DocPFI = ({ selected_pfi, setSelectedPfi }) => {
  console.log(selected_pfi);
  const toWords = new ToWords({ localeCode: 'en-US' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const [TotalFreightCost, setTotalFreightCost] = useState(0);
  const [TotalFOBCost, setTotalFOBCost] = useState(0);
  const [TotalInlandCost, setTotalInlandCost] = useState(0);

  useEffect(() => {
    // getData();
    console.log('selected_pfi', selected_pfi);

    let getAdditionalCharges = async (pfi_id) => {
      const { data } = await axiosInstance.get('/api/quotation/additionalcost/compressdata', {
        params: {
          pfi_id: pfi_id
        }
      });
      console.log('data', data);

      let totalFreight = data.reduce((acc, item) => {
        return item.heading === 'Freight_Charges' ? acc + Number(item.charge_amount) : acc;
      }, 0);
      setTotalFreightCost(totalFreight);

      let totalFOB = data.reduce((acc, item) => {
        return item.heading === 'FOB' ? acc + Number(item.charge_amount) : acc;
      }, 0);
      setTotalFOBCost(totalFOB);

      let totalInland = data.reduce((acc, item) => {
        return item.heading !== 'Freight_Charges' ? acc + Number(item.charge_amount) : acc;
      }, 0);
      setTotalInlandCost(totalInland);
    };
    getAdditionalCharges(selected_pfi?.pfi_id);
  }, []);

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
                //   to: quotations[0]?.vendor_email,
                //   subject: `Document PO No.${oprViewData?.po_num}`,
                //   documentName: oprViewData?.po_num,
                //   attachment: blob,
                //   description: `Dear ${quotations[0]?.vendorName}, </br> PFA your PO document for your kind acceptance.<br><br><br><br><br><br><br><br> Thanks, <br> Team Suppli Sync`
                // }
                data: {
                  doc_id: 1,
                  doc_type: 'pfi',
                  to: 'suryapratap88599@gmail.com',
                  subject: `Document PFI No. 117`,
                  documentName: selected_pfi && selected_pfi?.pfi_num,
                  attachment: blob,
                  description: `Dear ${selected_pfi && selected_pfi?.opo_master?.OprMaster?.companyMaster?.company_name}, </br> PFA your PFI document for your kind acceptance.<br><br><br><br><br><br><br><br> Thanks, <br> Team Suppli Sync`
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
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={6} sm={4} container justifyContent="center" alignItems="center">
                    <img src={logoUrl} alt="Company Logo" style={{ maxHeight: '100px', maxWidth: '100%' }} />
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <div>
                      <b>{selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name} </b>
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      {selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.address_line1},{' '}
                      {selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.address_line2}, <br />
                      {selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.city}, <br />
                      {selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.state},{' '}
                      {selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.country},{' '}
                      {selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.postal_code}
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      <div>{selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.contact_number}</div>
                      <div>{selected_pfi && selected_pfi?.opo_master?.OprMaster?.BuyingHouse?.contact_email}</div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', paddingLeft: '5px', minHeight: '80px' }}>
                <div style={{ width: '1px', background: 'black', display: 'flex', marginRight: '12px' }} />
                <div style={{ fontSize: '11px', margin: '12px 0' }}>
                  <b>Proforma Invoice No : {selected_pfi && selected_pfi?.pfi_num}</b>
                  <br />
                  <b>Proforma Invoice No Date : {selected_pfi && selected_pfi?.createdAt.split('T')[0]}</b> <br />
                  <b>Country Of Origin: {selected_pfi && selected_pfi?.opo_master?.quotation_master?.country_origin}</b> <br />
                  <b>OPP No : {selected_pfi && selected_pfi?.opo_selected_num}</b> <br />
                  <b>Invoice To : </b> <br />
                  <b>{selected_pfi && selected_pfi?.opo_master?.OprMaster?.companyMaster?.company_name}</b> <br />
                  <b>{selected_pfi && selected_pfi?.opo_master?.OprMaster?.companyMaster?.AddressMasters[0]?.address_line1}</b> <br />
                  <b>{selected_pfi && selected_pfi?.opo_master?.OprMaster?.companyMaster?.AddressMasters[0]?.address_line2}</b> <br />
                  <b>
                    {selected_pfi && selected_pfi?.opo_master?.OprMaster?.companyMaster?.AddressMasters[0]?.city}{' '}
                    {selected_pfi?.opo_master?.OprMaster?.companyMaster?.AddressMasters[0]?.state}, Original Invoice in Duplicate
                    {selected_pfi?.opo_master?.OprMaster?.companyMaster?.AddressMasters[0]?.country},{' '}
                    {selected_pfi?.opo_master?.OprMaster?.companyMaster?.AddressMasters[0]?.postal_code}
                  </b>{' '}
                  <br />
                  <br />
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>SR</th>
                  {/* <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>Item</th> */}
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>BH Item Name</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>HS CODE </th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>QTY </th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>UOM</th>
                  <th style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>
                    Unit Price in {selected_pfi && selected_pfi?.opo_master?.quotation_master?.currency}
                  </th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>
                    Total Price in {selected_pfi && selected_pfi?.opo_master?.quotation_master?.currency}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selected_pfi &&
                  selected_pfi?.pfi_line_items?.map((order, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid black' }}>
                      <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>{index + 1}</td>
                      {/* <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>{order?.item_name}</td> */}
                      <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>{order?.bh_item_name}</td>
                      <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>{order?.ItemsMaster?.hsn_code}</td>
                      <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>{formatNumber(order?.opo_qty)}</td>
                      <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>{order?.rfq_item?.uom_name}</td>
                      <td style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'right' }}>
                        {formatNumber(Number(order.rate).toFixed(2))}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        {formatNumber(Number(Number(order.rate).toFixed(2) * order.opo_qty).toFixed(2))}
                      </td>
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
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  <b>{formatNumber(TotalInlandCost.toFixed(2))}</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>FOB - ANY SEAPORT IN INDIA: </b>
                </td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  <b>
                    {selected_pfi &&
                      formatNumber(
                        (
                          selected_pfi?.pfi_line_items?.reduce((accumulator, num) => {
                            return accumulator + num?.rate * num?.opo_qty;
                          }, 0) + TotalInlandCost
                        ).toFixed(2)
                      )}
                  </b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ textTransform: 'uppercase', borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>SEA FREIGHT, {selected_pfi && selected_pfi?.opo_master?.quotation_master?.port_of_loading} LAGOS NIGERIA: </b> <br />
                </td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  <b>{formatNumber(TotalFreightCost.toFixed(2))}</b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ textTransform: 'uppercase', borderRight: '1px solid black', padding: '8px', textAlign: 'left' }}>
                  <b>TOTAL CFR {selected_pfi && selected_pfi?.opo_master?.quotation_master?.port_of_loading} LAGOS NIGERIA : </b>
                  <br />
                  <b style={{ textTransform: 'uppercase' }}>
                    {' '}
                    {toWords.convert(
                      Number(
                        Number(TotalInlandCost) +
                          Number(TotalFreightCost) +
                          Number(
                            selected_pfi?.pfi_line_items?.reduce((acc, item) => acc + Number(Number(item?.rate * item?.opo_qty) || 0), 0)
                          )
                      )
                    )}
                  </b>{' '}
                  <br />
                </td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  <b>
                    {selected_pfi &&
                      formatNumber(
                        Number(
                          Number(TotalInlandCost) +
                            Number(TotalFreightCost) +
                            Number(
                              selected_pfi?.pfi_line_items?.reduce((acc, item) => acc + Number(Number(item?.rate * item?.opo_qty) || 0), 0)
                            )
                        ).toFixed(2)
                      )}
                  </b>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', fontSize: '11px', padding: '8px', textAlign: 'left' }}>
                  <b>
                    CONTAINER DETAILS:{' '}
                    {selected_pfi &&
                      selected_pfi?.opo_master?.quotation_master?.additional_cost_freigths?.map(
                        (item, index) =>
                          item.reference_table_name === 'pfi_master' &&
                          `${index}. (${item?.number_container} X ${item?.containertype_name} ), `
                      )}{' '}
                  </b>
                  <br />
                  <b>SHIPMENT MODE: {selected_pfi && selected_pfi?.opo_master?.OprMaster?.shipment_mode_name} </b>
                  <br />
                  <b>SHIPMENT TYPE: {selected_pfi && selected_pfi?.opo_master?.OprMaster?.shipment_type_name} </b>
                  <br />
                  <b>Tolerance # :# </b>
                  <br />
                  <b>PORT OF SHIPMENT : {selected_pfi && selected_pfi?.opo_master?.quotation_master?.port_loading} </b>
                  <br />
                  <b>PORT OF DISCHARGE :{selected_pfi && selected_pfi?.port_of_destination_name}</b>
                  <br />
                  <b>COUNTRY OF SUPPLY : {selected_pfi && selected_pfi?.opo_master?.quotation_master?.country_supply} </b>
                  <br />
                  <b>PAYMENT BY : {selected_pfi && selected_pfi?.payment_mode} </b>
                </td>
              </tr>
              {/* <tr style={{ borderTop: '1px solid black' }}>
                <td colSpan={6} style={{ borderRight: '1px solid black', fontSize: '11px', padding: '8px', textAlign: 'left' }}>
                  <b>SHIPMENT : {selected_pfi && selected_pfi?.opo_master?.OprMaster?.companyMaster?.company_name} </b>
                  <br />
                  <b>PORT OF SHIPMENT : ANY SEAPORT INDIA </b>
                  <br />
                  <b>PORT OF DISCHARGE : TINCAN ISLAND SEAPORT LAGOS NIGERIA </b>
                  <br />
                  <b>COUNTRY OF SUPPLY : INDIA </b>
                  <br />
                  <b>PAYMENT BY : Not Valid for Forex </b>
                </td>
              </tr> */}
            </table>
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
          Download PFI Doc
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setSelectedPfi(null)}>
          Close
        </Button>
      </Box>
    </>
  );
};

export default DocPFI;
