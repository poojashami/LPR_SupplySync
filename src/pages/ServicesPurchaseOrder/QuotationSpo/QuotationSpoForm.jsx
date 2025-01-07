import { Box, Button, Grid, MenuItem, Select, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';

const QuotationSpoForm = ({ rowData, onclose }) => {
  console.log('rowData', rowData);

  const [formValues, setFormValues] = useState({
    po_id: rowData?.po_id,
    service_rfq_id: rowData?.rfq_num
  });

  const handleSubmit = () => {
    try {
      console.log(formValues);
      axiosInstance.post('api/quotation/service', { ...formValues }).then((response) => {
        console.log('Response:', response.data);
        toast.success('Generate Service Quotation ');
        onclose();
      });
    } catch (error) {
      console.error('There was an error!', error.message);
      toast.error('Error in Generate Service Quotation ');
    }
  };

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6}>
              <Grid container spacing={2} alignItems="center" marginTop={1}>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    PO Num:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography>{rowData.po_num}</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    RFQ Num:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography>{rowData.rfq_num}</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    Service Type:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography>{rowData.service_type}</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    Remarks:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography>{rowData.remarks}</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    Created On:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Typography>{rowData.created_on}</Typography>
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vendor Code:</Typography>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              variant="outlined"
              name="vendor_code"
              fullWidth
              value={formValues?.vendor_code}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Valid from:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="valid_from"
              value={formValues?.valid_from}
              onChange={(date) => setFormValues({ ...formValues, ['valid_from']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Valid to:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="valid_to"
              value={formValues?.valid_to}
              onChange={(date) => setFormValues({ ...formValues, ['valid_to']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Shipping line:</Typography>
            <Select
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              fullWidth
              name="shipping_line"
              value={formValues?.shipping_line}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.name })}
            >
              <MenuItem value={10}>VRL Logistics</MenuItem>
              <MenuItem value={20}>Vijay Laxmi Transports</MenuItem>
              <MenuItem value={30}>WheelsEye Logistics</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">From Port:</Typography>
            <Select
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              fullWidth
              name="from_port"
              value={formValues?.from_port}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            >
              <MenuItem value={10}>PORT 1</MenuItem>
              <MenuItem value={20}>PORT 2</MenuItem>
              <MenuItem value={30}>PORT 3</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">To Port:</Typography>
            <Select
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              fullWidth
              name="to_port"
              value={formValues?.to_port}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            >
              <MenuItem value={10}>PORT 1</MenuItem>
              <MenuItem value={20}>PORT 2</MenuItem>
              <MenuItem value={30}>PORT 3</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vehicle Schedule ETS:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="vehicle_schedule_ets"
              value={formValues?.vehicle_schedule_ets}
              onChange={(date) => setFormValues({ ...formValues, ['vehicle_schedule_ets']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vehicle Schedule ETS 2:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="vehicle_schedule_ets2"
              value={formValues?.vehicle_schedule_ets2}
              onChange={(date) => setFormValues({ ...formValues, ['vehicle_schedule_ets2']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vehicle Schedule ETS 3:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="vehicle_schedule_ets3"
              value={formValues?.vehicle_schedule_ets3}
              onChange={(date) => setFormValues({ ...formValues, ['vehicle_schedule_ets3']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vehicle Schedule ETA:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="vehicle_schedule_eta"
              value={formValues?.vehicle_schedule_eta}
              onChange={(date) => setFormValues({ ...formValues, ['vehicle_schedule_eta']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vehicle Schedule ETA 2:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="vehicle_schedule_eta2"
              value={formValues?.vehicle_schedule_eta2}
              onChange={(date) => setFormValues({ ...formValues, ['vehicle_schedule_eta2']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Vehicle Schedule ETA 3:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="vehicle_schedule_eta3"
              value={formValues?.vehicle_schedule_eta3}
              onChange={(date) => setFormValues({ ...formValues, ['vehicle_schedule_eta3']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Currency:</Typography>
            <Select
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              fullWidth
              name="currency"
              value={formValues?.currency}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            >
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'Naira'}>Naira</MenuItem>
              <MenuItem value={'INR'}>INR</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Amount:</Typography>
            <TextField
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              variant="outlined"
              name="amount"
              value={formValues?.amount}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Quote Date:</Typography>
            <DatePicker
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              name="quote_date"
              value={formValues?.quote_date}
              onChange={(date) => setFormValues({ ...formValues, ['quote_date']: date })}
            />
          </Grid>

          <Grid item xs={12} sm={1.75}>
            <Typography variant="subtitle1">Container Type:</Typography>
            <Select
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              fullWidth
              name="container_type"
              value={formValues?.container_type}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            >
              <MenuItem value={'flat_bed'}>Flat Bed</MenuItem>
              <MenuItem value={'normal'}>Normal</MenuItem>
              <MenuItem value={'close_top'}>Close Top</MenuItem>
              <MenuItem value={'open_top'}>Open Top</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={3.5}>
            <Typography variant="subtitle1">Remarks:</Typography>
            <TextField
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              variant="outlined"
              name="remarks"
              value={formValues?.remarks}
              onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            />
          </Grid>
        </Grid>

        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" sx={{ mr: 2, marginTop: '20px' }} onClick={handleSubmit}>
            Service Create Quotation
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default QuotationSpoForm;
