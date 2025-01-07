import React, { useState } from 'react';
import { Box, Select, MenuItem, Grid, TextField, Typography, Button, Table, TableBody, TableRow, TableCell } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PrintIcon from '@mui/icons-material/Print';

const UpdatePayment = ({ OpenDoc, GovtChargesData }) => {
  // console.log('OpenDoc: ', OpenDoc);
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Invoice Num:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.invoice_num}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                BL Num:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.bl_num}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Importer Name:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.importer_name}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Shipment Type:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.shipment_type}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                No. of Container:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.no_container}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Discharge Terminal:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.discharge_terminal}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Transfer Terminal:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{GovtChargesData.transfer_terminal}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <FORM OpenDocument={OpenDoc} />
    </div>
  );
};

export default UpdatePayment;

const FORM = ({ OpenDocument }) => {
  console.log('OpenDocument: ', OpenDocument);

  const [file, setFile] = useState(null);
  const [openLapse, setOpenLapse] = useState(true);
  const [formValues, setFormValues] = useState({});
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files;
    Object.values(selectedFile).forEach((file) => {
      if (file && file.type === 'application/pdf') {
        setFile(Object.values(selectedFile));
      } else {
        alert('Please select a PDF file.');
      }
    });
  };
  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {openLapse ? (
        <>
          <Typography variant="body1" sx={{ fontWeight: '600', padding: '1vh', backgroundColor: '#cbdcee94' }}>
            Add Other Charges
          </Typography>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Amount:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>15100 USD</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Narration:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>15100 USD</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid item xs={2}>
              <Typography variant="body1">Amount:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="amount_lapse"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Narration:</Typography>
              <TextField
                type="text"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                variant="outlined"
                name="narration_lapse"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ fontWeight: '600', padding: '1vh', backgroundColor: '#cbdcee94' }}>
            Add Govt Charges
          </Typography>
          <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid item xs={2}>
              <Typography variant="body1">Payment Type:</Typography>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                fullWidth
                defaultValue={1}
                name="payment_types"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              >
                <MenuItem value={1} selected>
                  Not Selected
                </MenuItem>
                <MenuItem value={2}>Normal</MenuItem>
                <MenuItem value={3}>Penalty</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Add Expense:</Typography>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                fullWidth
                defaultValue={1}
                name="payment_types"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              >
                <MenuItem value={1} selected>
                  Not Selected
                </MenuItem>
                <MenuItem value={2}>CRFFN</MenuItem>
                <MenuItem value={3}>NESRA</MenuItem>
                <MenuItem value={4}>Others</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Invoice No:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="amount"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body1">Invoice Date:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="amount"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Amount:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="amount"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Remita Charges:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="remit_charges"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">VAT:</Typography>
              <TextField
                type="number"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="vat"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Total:</Typography>
              <TextField
                disabled
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Narration:</Typography>
              <TextField
                disabled
                type="text"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                variant="outlined"
                name="narration"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Penalty Approved BY:</Typography>
              <TextField
                disabled
                type="text"
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                id="insurance-basic"
                variant="outlined"
                name="penalty_approved"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Penalty Approved Date:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                name="penalty_approved_date"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Penalty Payment Date:</Typography>
              <DatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  },
                  width: '100%'
                }}
                name="penalty_payment_date"
                onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
              />
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
              <Grid
                marginTop="10px"
                item
                xs={12}
                sm={4}
                borderRadius="15px"
                style={{
                  border: '2px dashed #000',
                  padding: '30px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClick}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" style={{ marginBottom: '8px' }}>
                    <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                  </Typography>
                  {file ? (
                    <ol>
                      {file.map((item, index) => (
                        <Typography component="li" key={index} variant="body1" style={{ marginBottom: '8px', textAlign: 'left' }}>
                          {item.name}
                        </Typography>
                      ))}
                    </ol>
                  ) : (
                    <>
                      <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                        {/* {values?.documentName ? values?.documentName : 'Upload file'} */}
                        Document
                      </label>
                      <input multiple type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                    </>
                  )}
                </div>
              </Grid>
              {/* <ErrorMessage name="documentName" component="div" style={errorMessageStyle} /> */}
            </Grid>
          </Grid>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
        {openLapse ? (
          <Box>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenLapse(false)}>
              Add Govt Charges
            </Button>

            <Button endIcon={<PrintIcon />} variant="contained" sx={{ mr: 2 }} onClick={OpenDocument}>
              Print
            </Button>

            <Button variant="contained" sx={{ mr: 2 }} onClick={() => setOpenLapse(false)}>
              Submit Other Charges
            </Button>
          </Box>
        ) : (
          <Box>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenLapse(true)}>
              Add Other Charges
            </Button>
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
              Submit Govt Charges
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
