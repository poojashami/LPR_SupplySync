import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import CustomTypography from 'components/CustomTypography';
const ViewShippingAdvice = () => {
  return (
    <div>
      {' '}
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">BL/AWB no:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography sx={{ paddingRight: 5 }}>{'REF1028'} </CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">BL/AWB Dt:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography sx={{ paddingRight: 5 }}>{'30000'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Type of BL:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography sx={{ paddingRight: 5 }}>{'Bank of Baroda'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Shipment Type:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography sx={{ paddingRight: 5 }}>{'PO86876'}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Free Days:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'12-03-2024'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Shipping/Airline:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'Indicorp'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Vessel Name/Flight Number: </CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'Vendor Bank'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Port of Loading:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'Delhi'}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Port of Discharge:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'30000'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Final Destination:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Goods Description:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Shipper Name:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">Consignee:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'30000'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Notify Party:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Free Time/Days:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Freight:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <CustomTypography variant="subtitle1">ETA:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'30000'}</CustomTypography>
            </TableCell>
            {/* <TableCell>
              <CustomTypography variant="subtitle1">Notify Party:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Free Time/Days:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Freight:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{'jhjhbjkbj'}</CustomTypography>
            </TableCell> */}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewShippingAdvice;
