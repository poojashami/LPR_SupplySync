import { Box, Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

export default function ViewVendor({ vendor, onClose }) {
  console.log('Vender data in View mode', vendor);
  return (
    <>
      <MainCard>
        <Typography variant="h6">
          <h3 style={{ padding: '0', margin: '0' }}>
            Vender Detail (
            <span className="text-primary" style={{ color: 'blue' }}>
              {vendor.vendor_series}
            </span>
            )
          </h3>
        </Typography>
        {vendor ? (
          <Box sx={{ marginBottom: '10px' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Name:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.vendorName}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Email:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Phone Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.phoneNumber}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Alternate Phone Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.alternate_phone_number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Type:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.vendorType}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Status:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.vendorStatus}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Registration Date:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.registrationDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Tax ID:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.taxId}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Contact Person:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.contactPerson}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Contact Person Phone:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.contactPersonPhone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Contact Person Email :
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.contactPersonEmail}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Payment Term:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.paymentTerms}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Reference By :
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.reference_by}</Typography>
                  </TableCell>
                </TableRow>
                {/* ................Current Address............... */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Address 1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.addressLine1}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Address 2:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.addressLine2}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Pincode:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.pincode}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Country:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.country}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      State:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.state}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      City:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.city}</Typography>
                  </TableCell>
                </TableRow>
                {/* .............Permanent Address.................. */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Address 1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.addressLine11}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Address 2:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.addressLine22}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Pincode:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.pincode1}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Country:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.country1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      State:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.state1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      City:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.city1}</Typography>
                  </TableCell>
                </TableRow>
                {/* .............Compliance Information.................. */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Compliance Status:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.complianceStatus}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Last Audited Docs:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.last_audited_docs}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Uploaded File:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.division}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      PAN Number :
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.phoneNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      TIN Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.tin_num}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      GST Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.gst_num}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      VAT Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.vat_num}</Typography>
                  </TableCell>
                </TableRow>
                {/* ...................BANK Details............................. */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Bank Name :
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bankName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Account Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bankAccountNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      IFSC Code :
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bankIfscCode}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Bank Ref Cheque:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bank1_ref_cheque}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Uploaded File:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.buyinHouse}</Typography>
                  </TableCell>
                </TableRow>
                {/* .................................Bank Details 2................... */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Bank Name1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bankName1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Account Number1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bankAccountNumber1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      IFSC Code1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bankIfscCode1}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Bank Ref Cheque1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.bank2_ref_cheque}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Uploaded File1:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.buyinHouse}</Typography>
                  </TableCell>
                </TableRow>
                {/* .................................Other Details 2................... */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Remark:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.notes}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" color="error" onClick={onClose}>
                Close
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>No vendor selected</Typography>
        )}
      </MainCard>
    </>
  );
}
