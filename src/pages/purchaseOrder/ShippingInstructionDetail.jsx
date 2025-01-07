import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  Grid
  // Autocomplete,
  // InputAdornment
} from '@mui/material';
import CustomTypography from 'components/CustomTypography';
const ShippingInstructionDetail = ({ po_data }) => {
  console.log(po_data);
  return (
    <div>
      {' '}
      <Table>
        <TableBody loading={true}>
          <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
            <TableCell colSpan={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Buyer Name </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Buyer Address </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">PO vendor </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">PO Number</CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Supplier Ref No(Quote no) </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Delivery Terms </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Shipment mode</CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">No of Previous shipment </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Consignee </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Port of loading </CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Form M No</CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">BA NO.</CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">L/C No.</CustomTypography>
                  <CustomTypography>jhbdjh</CustomTypography>
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ShippingInstructionDetail;
