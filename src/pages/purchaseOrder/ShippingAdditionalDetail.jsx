import React, { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableBody, Grid, Typography } from '@mui/material';
import CustomTypography from 'components/CustomTypography';
const ShippingAdditionalDetail = ({ po_data }) => {
  const [shippingData, setShippingData] = useState(null);

  useEffect(() => {
    setShippingData(po_data?.shippment_instruction);
  }, []);

  return (
    <div>
      {' '}
      <Table>
        <TableBody loading={true}>
          <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
            <TableCell colSpan={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle2">Shipper </CustomTypography>
                  <CustomTypography>{shippingData?.shipper}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Goods Description</CustomTypography>
                  <CustomTypography>{shippingData?.goods_description}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Port of Discharge </CustomTypography>
                  <CustomTypography>{shippingData?.port_of_discharge}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Final Destination</CustomTypography>
                  <CustomTypography>{shippingData?.final_destination}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Marks and Nos </CustomTypography>
                  <CustomTypography>{shippingData?.marks_nos}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">No of Original BL Req</CustomTypography>
                  <CustomTypography>{shippingData?.no_of_og_bl_req}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Notify Party*</CustomTypography>
                  <CustomTypography>{shippingData?.notify_party}</CustomTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">No of Non Negotiable BL copy Req* </CustomTypography>
                  <CustomTypography>{shippingData?.no_of_non_negotiable_bl_copy_req}</CustomTypography>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Additional Instruction- 1 </CustomTypography>
                  <CustomTypography>{shippingData?.additional_information1}</CustomTypography>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTypography variant="subtitle1">Additional Instruction-2 </CustomTypography>
                  <CustomTypography>{shippingData?.additional_information2}</CustomTypography>
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ShippingAdditionalDetail;
