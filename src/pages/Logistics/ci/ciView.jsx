import { Box, Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const CIView = ({ piNo }) => {
  return (
    <div>
      <h1>PI No: {piNo}</h1>
      <MainCard>
        <Typography variant="h6">
          <h3 style={{ padding: '0', margin: '0' }}>
            Vender Detail (
            <span className="text-primary" style={{ color: 'blue' }}>
              {/* {vendor.vendor_series} */}
            </span>
            )
          </h3>
        </Typography>
        {/* {vendor ? ( */}
        <Box sx={{ marginBottom: '10px' }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PFI Sender:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jdbjkfdbk</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PI Sender Date:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jhsgdj</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    OPR No. :
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>75788</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Company:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jbsdjbk</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PI No:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>sjabjkb</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Controlling Office:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jkbkjbk</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PI Date:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>sdkjhfjdb</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Currency:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>djbkjbd</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Exchange Date:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>dmsbfkj</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipment Mode:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>dmnfbkjdb</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Delivery Time:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jdksbkjf</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Delivery Terms:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>dmsbkjfbdk</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Payment Terms:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>nmdsvmv </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Country Of Origin:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>ndvjvdk</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Country Of Supply:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>dmnsvbjmvdbjk</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Container Count Type:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>mdbjbdk</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Port of Loading:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jadbkjbd</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Port Of Discharge:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>mabsdkjbdakj</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Final Destination:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>nbdjfbdskj</Typography>
                </TableCell>
              </TableRow>
              {/* .............Permanent Address.................. */}
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Country Of Final Destination:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>snabjkb</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PI Description:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jsbkdjbsak</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Freight Remark:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>smbakjbakj</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Inhand Charges:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>msabdjbjk</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Freight Charges:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>sjbajbsakjb</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Inspection Charges:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>smabjdbskj</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    FOB Charges:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jdsbjkbd</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    THC Charges:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>jhvdasjkvkj</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Container Stuffing:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>msbdjb</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Container Seal:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>nsbvnvsjh</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Bl:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>skajbjdbsk</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    VGM:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>asvbdjhas</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Miscellaneous:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>,masnkbdk</Typography>
                </TableCell>
              </TableRow>
              {/* ...................BANK Details............................. */}
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Doc Charges:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>dsakjbkjb</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Advising Commission:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>skajbdkjb</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    LLC Commission:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>sjakbjk</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Courier:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>samvdjhs</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Miscellaneous:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>sajhdvjasvj</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" color="error">
              Close
            </Button>
          </Box>
        </Box>
        {/* ) : (
          <Typography>No PFI Selected</Typography>
        )} */}
      </MainCard>
    </div>
  );
};

export default CIView;
