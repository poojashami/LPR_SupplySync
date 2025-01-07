import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, TextField, Box, IconButton, Button, Paper } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { styled } from '@mui/material/styles';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';

export default function DraftView({ pfiData }) {
  console.log('pfiData', pfiData);
  const [approvePfi, setApprovePfi] = useState(false);
  const [sendBack, setSendBack] = useState(false);
  console.log('Pfi Data ..............', pfiData);

  const handleApprovePfi = () => {
    setApprovePfi(true);
    setSendBack(false);
  };

  const handleSendBack = () => {
    setSendBack(true);
    setApprovePfi(false);
  };

  const [sendBackValue, setSendBackValue] = useState('');

  const handleBackInputChange = (event) => {
    setSendBackValue(event.target.value);
  };

  const handleBackSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    console.log('Form Submitted with Remarks:', sendBackValue);

    setSendBackValue('');
  };

  return (
    <>
      <Pfi_Data pfi_id={pfiData?.pfi_id} />
      {sendBack && (
        <Box component="form" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5vh', paddingLeft: '30vh' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="body1">Send Back for Amendment:</Typography>
              <TextField
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                id="insurance-basic"
                variant="outlined"
                value={sendBackValue}
                onChange={handleBackInputChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" color="error" type="button" onClick={handleBackSubmit}>
                Send Back for Amendment
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }} onClick={handleApprovePfi}>
          Approve PFI
        </Button>
        <Button variant="outlined" color="error" type="button" onClick={handleSendBack}>
          Send Back for Amendment
        </Button>
      </Box>
    </>
  );
}
