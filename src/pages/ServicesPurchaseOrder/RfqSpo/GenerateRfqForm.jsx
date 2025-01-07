import React, { useState } from 'react';
import { Typography, Box, Select, Button, Grid, TextField, MenuItem } from '@mui/material';
import VendorList from 'pages/rfq/VendorList';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';

const GenerateRfqForm = ({ poData, onclose }) => {
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [formValues, setFormValues] = useState({});

  const handleSubmit = () => {
    let data = {
      service_type_id: formValues.service_type,
      po_id: poData.po_id,
      service_description: formValues.remarks,
      vendor_ids_list: selectedVendor.map((vendor) => vendor.vendor_id).join(', ')
    };
    console.log('data:', data);

    axiosInstance
      .post('/api/rfq/service', data)
      .then((response) => {
        console.log('Response:', response.data);
        toast.success('Generate Service RFQ ');
        onclose();
      })
      .catch((error) => {
        console.error('There was an error!', error);
        toast.error('Error in Generate Service RFQ ');
      });
  };

  return (
    <div>
      <Typography variant="h6" style={{ padding: '1vh' }}>
        <h3 style={{ padding: '0', margin: '0' }}>
          PO Number (
          <span className="text-primary" style={{ color: 'blue' }}>
            {poData.po_num}
          </span>
          ) PO Date (
          <span className="text-primary" style={{ color: 'blue' }}>
            {poData.created_on.split('T')[0]}
          </span>
          )
        </h3>
      </Typography>

      <Typography variant="h6" style={{ padding: '1vh' }}>
        <h3 style={{ padding: '0', margin: '0' }}>Vendor List</h3>
      </Typography>
      <VendorList setSelectedVendor={setSelectedVendor} selectedVendor={selectedVendor} />
      <Grid container spacing={2} alignItems="center" margin={2}>
        <Grid item xs={12} sm={1}>
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            Service Type:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Select
            variant="outlined"
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
            sx={{
              '& .MuiInputBase-input': {
                padding: '10px'
              }
            }}
            name="service_type"
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Transport">Transport</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            Remarks:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '10px'
              }
            }}
            variant="outlined"
            name="remarks"
            fullWidth
            onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
          />
        </Grid>
      </Grid>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
          Create RFQ
        </Button>
      </Box>
    </div>
  );
};

export default GenerateRfqForm;
