import React, { useEffect, useState } from 'react';

import { TextField, Typography, Button, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Box } from '@mui/material';

const NafdacPermitView = ({ pfidata: pfiData }) => {
  return (
    <div>
      <Box sx={{ border: '1px solid gray' }}>
        <h1>Here NAFDAC Detail will show header and pdf</h1>
        {/* <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Num:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.pfi_no}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.pfi_date}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Amount:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.pfi_amount}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Currency:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.currency}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI Category:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.pfi_category}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Mode of Shipment:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.shipment_type}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Type of Shipment:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.shipment_type}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Loading:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.country_of_supply}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Consignee:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.consignee}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Consignor:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.consignor}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Discharge:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.country_of_final_destination}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Form M Opening Bank:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{pfiData.VendorsBanksDetailsMaster && pfiData.VendorsBanksDetailsMaster.bank_name}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table> */}
      </Box>
    </div>
  );
};

export default NafdacPermitView;
