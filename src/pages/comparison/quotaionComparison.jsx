import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Modal,
  Chip,
  Select,
  FormControl,
  MenuItem,
  IconButton
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { mdiInformationOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { GetRfq, GetAllQuotationsByRFQ, GetRfqDetails } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { selectRFQ } from 'Redux/Slices/RFQSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80%',
  overflowY: 'auto'
};

const QuotationComparison = () => {
  const dispatch = useDispatch();
  const { rfqs } = useSelector((state) => state.rfq);
  const { quotationsByRFQ } = useSelector((state) => state.quotation);
  const { selectedRFQDetails } = useSelector((state) => state.rfq);
  const [selectedRFQ, setSelectedRFQ] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showCompareSection, setShowCompareSection] = useState(false);
  const [rfqNumbers, setRfqNumbers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState('usd');
  const [docs, setDocs] = useState([]);

  const vendor = {
    vendorName: 'ABC Corp',
    email: 'abc@corporation.com',
    phoneNumber: '123-456-7890',
    alternate_phone_number: '098-765-4321',
    vendorType: 'Supplier',
    vendorStatus: 'Active',
    registrationDate: '2021-01-01',
    taxId: 'AB123456C',
    contactPerson: 'John Doe',
    contactPersonPhone: '111-222-3333',
    contactPersonEmail: 'john.doe@abc.com',
    paymentTerms: 'Net 30',
    reference_by: 'Jane Smith',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 400',
    pincode: '12345',
    country: 'USA',
    state: 'California',
    city: 'Los Angeles',
    addressLine11: '456 Secondary St',
    addressLine22: 'Apt 789',
    pincode1: '67890',
    country1: 'USA',
    state1: 'California',
    city1: 'San Francisco',
    complianceStatus: 'Compliant',
    last_audited_docs: '2023-06-01',
    division: 'North America',
    tin_num: '123456789',
    gst_num: '987654321',
    vat_num: '1122334455',
    bankName: 'Big Bank',
    bankAccountNumber: '1234567890',
    bankIfscCode: 'BIGB0000001',
    bank1_ref_cheque: 'Ref1234',
    buyinHouse: 'Internal',
    bankName1: 'Another Bank',
    bankAccountNumber1: '0987654321',
    bankIfscCode1: 'ANBK0000002',
    bank2_ref_cheque: 'Ref5678',
    notes: 'Preferred vendor'
  };
  const rates = {
    usd: 1,
    inr: 80,
    zar: 18
  };
  const convertCurrency = (cost, to) => {
    return (cost * rates[to]).toFixed(2);
  };
  const [quotationData, setQuotationData] = useState([]);

  const quotationColumn = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      maxWidth: 50,
      headerTooltip: 'Select All'
    },
    { headerName: 'Quotation No.', field: 'quotationNo', headerTooltip: 'Quotation No.', width: '150' },
    { headerName: 'Vendor Name', field: 'vendorName', headerTooltip: 'Vendor Name', width: '150' },
    { headerName: 'Currency', field: 'currency', headerTooltip: 'Currency', width: '100' },
    { headerName: 'Delivery Terms', field: 'deliveryTerms', headerTooltip: 'Delivery Terms', width: '150' },
    { headerName: 'Lead Time', field: 'leadTime', headerTooltip: 'Lead Time', width: '150' },
    { headerName: 'Inland Charges', field: 'inlandCharges', headerTooltip: 'Inland Charges', width: '150' },
    { headerName: 'Freight Charges', field: 'freightCharges', headerTooltip: 'Freight Charges', width: '150' },
    { headerName: 'Inspection Charges', field: 'inspectionCharges', headerTooltip: 'Inspection Charges', width: '150' },
    { headerName: 'Quotation Date', field: 'quotationDate', headerTooltip: 'Quotation Date', width: '150' },
    { headerName: 'Country of Origin', field: 'countryOfOrigin', headerTooltip: 'Country of Origin', width: '150' },
    { headerName: 'Country of Supply', field: 'countryOfSupply', headerTooltip: 'Country of Supply', width: '150' },
    { headerName: 'Port of Loading', field: 'portOfLoading', headerTooltip: 'Port of Loading', width: '150' }
  ];

  const itemColumnRFQ = [
    { headerName: 'Qty', field: 'quantity', width: '80' },
    { headerName: 'Add. Qty', field: 'additional_qty', width: '80' },
    { headerName: 'Line Total', width: '100', cellRenderer: (params) => params.data.quantity + params.data.additional_qty }
  ];

  const itemColumn = [
    { headerName: 'Qty', field: 'opr_qty', width: '80' },
    { headerName: 'Rate', field: 'rate', width: '70' },
    { headerName: 'Line Total', width: '100', cellRenderer: (params) => convertCurrency(params.data.opr_qty * params.data.rate, currency) }
  ];
  const docColumn = [
    { headerName: 'Sr No', field: 'srNo' },
    { headerName: 'Document', field: 'document' },
    { headerName: 'Document Date', field: 'documentDate' },
    { headerName: 'Title', field: 'title' },
    { headerName: 'File Name', field: 'fileName' },
    { headerName: 'Notes', field: 'notes' },
    { headerName: 'Created By', field: 'createdBy' },
    {
      headerName: 'Download File',
      field: 'downloadFile',
      cellRenderer: (params) => (
        <center>
          <IconButton aria-label="download" color="primary" onClick={() => downloadFile(params.value, params.data.fileName)}>
            <CloudDownloadIcon />
          </IconButton>
        </center>
      )
    }
  ];

  const handleRFQChange = async (event, val) => {
    selectRFQ(val);
    setSelectedRFQ(val);
    await GetRfqDetails(dispatch, val.id);
  };

  useEffect(() => {
    const mappeddata = quotationsByRFQ.map((item, index) => ({
      id: index + 1,
      quotationNo: item.quo_num,
      vendorName: item.vendor_id,
      currency: item.currency,
      deliveryTerms: item.payment_terms,
      leadTime: item.lead_time_name,
      inlandCharges: '250',
      freightCharges: '500',
      inspectionCharges: '600',
      quotationDate: item.quo_date,
      countryOfOrigin: item.country_origin,
      countryOfSupply: item.country_supply,
      portOfLoading: item.port_loading,
      items: item.items,
      isSelected: false
    }));
    setQuotationData(mappeddata);
  }, [quotationsByRFQ]);

  const handleSearch = async () => {
    await GetAllQuotationsByRFQ(dispatch, selectedRFQ.id);
  };

  const handleSelectionChanged = (params) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => {
      node.data.isSelected = true;
      return node.data;
    });
    setSelectedRows(selectedData);
  };

  const handleCompareButtonClick = () => {
    setShowCompareSection(true);
  };
  // click information icon for show vendor detail
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const downloadFile = (base64String, fileName) => {
    // Convert base64 to Blob
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Download the file
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };
  useEffect(() => {
    rfqs?.length === 0 && GetRfq(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // useEffect(() => {
  //   let temp = [];
  //   rfqs.forEach((item) => temp.push(item.rfq_id));
  //   const mData = rfqs.map((item) => ({
  //     id: item.rfq_id,
  //     name: item.rfq_num,
  //     status: item.status,
  //     date: item.created_on.split('T')[0]
  //   }));
  //   setRfqNumbers(mData);
  // }, [rfqs]);
  useEffect(() => {
    console.log(quotationsByRFQ);
    const data = quotationsByRFQ?.map((item, index) => ({
      srNo: index + 1,
      document: `Document ${1}`,
      documentDate: item.created_on,
      title: `title ${1}`,
      fileName: item.quote_doc_name,
      notes: `notes ${1}`,
      createdBy: 'User A',
      downloadFile: item.quote_doc
    }));
    console.log(data);
    setDocs(data);
  }, [quotationsByRFQ]);

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vendor Details
          </Typography>
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
                    Contact Person Email:
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
                    Reference By:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{vendor.reference_by}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Actions:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="info">
                    Confirm
                  </Button>
                </TableCell>
              </TableRow>
              {/* Add more rows for other vendor details */}
            </TableBody>
          </Table>
        </Box>
      </Modal>

      <Grid container spacing={2} style={{ alignItems: 'center', marginBottom: '10px' }} alignItems={'center'}>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            options={rfqNumbers}
            value={selectedRFQ}
            size="small"
            onChange={(event, newValue) => handleRFQChange(event, newValue)}
            getOptionLabel={(option) => option.name || ''}
            renderInput={(params) => <TextField {...params} label="Select RFQ" fullWidth />}
          />
        </Grid>

        <Grid item xs={12} sm={1}>
          <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
            <div style={{ flex: '1', fontWeight: 'bold' }}> RFQ No.:</div>
            <div style={{ flex: '1' }}>{selectedRFQ?.name}</div>
          </div>
        </Grid>
        <Grid item xs={12} sm={2}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
            <div style={{ flex: '1', fontWeight: 'bold' }}> Status:</div>
            <div style={{ flex: '1' }}>
              <div style={{ flex: '1' }}>
                {selectedRFQ?.status === '1' ? (
                  <Chip label="Active" color="success" variant="outlined" size="small" />
                ) : (
                  <Chip label="InActive" color="error" variant="outlined" size="small" />
                )}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={2}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
            <div style={{ flex: '1', fontWeight: 'bold' }}> Date:</div>
            <div style={{ flex: '1' }}>{selectedRFQ?.date}</div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginBottom={1}>
        <Grid item xs={12}>
          <Paper style={{ padding: 5 }}>
            {/* item details in table */}
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>Quotation List</span>
                    <Button color="primary" disabled={!selectedRFQ} className="plus-btn-color" onClick={handleCompareButtonClick}>
                      Compare ({selectedRows.length})
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} paddingTop={0}>
                  <div style={{ height: '210px', width: '100%' }} className="ag-theme-alpine custom-ag-grid">
                    <AgGridReact
                      rowData={quotationData}
                      columnDefs={quotationColumn}
                      pagination={false}
                      rowSelection="multiple"
                      suppressMenuHide={true}
                      suppressColumnVirtualisation={true}
                      onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                      }}
                      onSelectionChanged={handleSelectionChanged}
                    />
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* quotation compare section */}
      {showCompareSection && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 5 }}>
                <Typography
                  gutterBottom
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>RFQ Details</div>
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 5px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}>RFQ No.:</div>
                    <div style={{ flex: '1', color: `${selectedRFQ?.status === '1' ? 'green' : 'red'}` }}>{selectedRFQ?.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}>Date:</div>
                    <div style={{ flex: '1' }}>{selectedRFQ?.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                    <div style={{ flex: '1', fontWeight: 'bold' }}>Currency.:</div>
                    <div style={{ flex: '1' }}>
                      <FormControl variant="standard" size="small">
                        <Select
                          onChange={(e) => setCurrency(e.target.value)}
                          size="small"
                          labelId="Currency-label"
                          id="Currency"
                          value={currency}
                          label="Currency"
                          style={{ textTransform: 'uppercase' }}
                        >
                          {Object.keys(rates).map((cur, index) => (
                            <MenuItem key={index} value={cur} style={{ textTransform: 'uppercase' }}>
                              {cur}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: 'auto',
                    width: '100%',
                    overflowY: 'auto'
                  }}
                  className="ag-theme-alpine custom-ag-grid"
                >
                  <AgGridReact
                    rowData={selectedRFQDetails?.items}
                    columnDefs={itemColumnRFQ}
                    pagination={false}
                    rowSelection="none"
                    suppressMenuHide={true}
                    suppressColumnVirtualisation={true}
                    domLayout="autoHeight"
                  />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={9} style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '1500px', display: 'flex' }}>
                {selectedRows.map((quotation, index) => (
                  <Paper key={index} style={{ padding: 5, minWidth: '250px', marginRight: '16px' }}>
                    <Typography
                      gutterBottom
                      style={{
                        marginBottom: '1px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px'
                      }}
                    >
                      <div>{quotation.quotationNo}</div>
                      <div style={{ cursor: 'pointer' }}>
                        <Tooltip title="Vendor Details">
                          <Icon path={mdiInformationOutline} size={0.8} onClick={(e) => handleOpen(e, quotation)} />
                        </Tooltip>
                      </div>
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                      <div style={{ flex: '1', fontWeight: 'bold' }}>Vendor:</div>
                      <div style={{ flex: '1' }}>{quotation.vendorName}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                      <div style={{ flex: '1', fontWeight: 'bold' }}> Delivery Term:</div>
                      <div style={{ flex: '1' }}>{quotation.deliveryTerms}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                      <div style={{ flex: '1', fontWeight: 'bold' }}>Country of Supply:</div>
                      <div style={{ flex: '1' }}>{quotation.countryOfSupply}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                      <div style={{ flex: '1', fontWeight: 'bold' }}> Port of Loading:</div>
                      <div style={{ flex: '1' }}>{quotation.portOfLoading}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', marginBottom: '1px' }}>
                      <div style={{ flex: '1', fontWeight: 'bold' }}> Lead Time:</div>
                      <div style={{ flex: '1' }}>{quotation.leadTime}</div>
                    </div>
                    <div
                      style={{
                        height: 'auto',
                        width: '100%',
                        overflowY: 'auto'
                      }}
                      className="ag-theme-alpine custom-ag-grid"
                    >
                      <AgGridReact
                        rowData={quotation.items}
                        columnDefs={itemColumn}
                        pagination={false}
                        rowSelection="none"
                        suppressMenuHide={true}
                        suppressColumnVirtualisation={true}
                        domLayout="autoHeight"
                      />
                    </div>
                  </Paper>
                ))}
              </div>
            </Grid>
          </Grid>

          {/* Document Table */}
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Documents
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ height: '210px', width: '100%' }} className="ag-theme-alpine custom-ag-grid">
                <AgGridReact
                  rowData={docs}
                  columnDefs={docColumn}
                  pagination={false}
                  rowSelection="none"
                  suppressMenuHide={true}
                  suppressColumnVirtualisation={true}
                />
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default QuotationComparison;
