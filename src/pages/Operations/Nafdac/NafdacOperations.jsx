import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableRow,
  IconButton,
  TableCell,
  TableHead,
  Box,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import { axiosInstance } from 'utils/axiosInstance';
import CustomTypography from 'components/CustomTypography';
import dayjs from 'dayjs';
import NafdacPenaltyForm from './NafdacPenaltyForm';
import CI_Data from 'components/BasicDataComponent/CI_data';

const NafdacOperations = ({ NafdacData, onclose }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    updateDetails: true,
    etaDetails: true,
    ClearingDetails: true,
    penaltyDetails: true
  });

  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = NafdacData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
    let Freigth = data?.filter((i) => i.charge_name == 'total_freight_charges');
    setFreightAdditionalCost(Freigth[0]?.charge_amount);
    let fob = data?.reduce((acc, total) => {
      return total.heading === 'FOB' ? (acc = acc + Number(total.charge_amount)) : (acc += 0);
    }, 0);
    setFobAdditionalCost(fob);
    let Inland = data?.reduce((acc, total) => {
      return total.heading === 'Inland_Charges' ? (acc = acc + Number(total.charge_amount)) : (acc += 0);
    }, 0);
    setInlandCost(Inland);

    if (NafdacData?.add_shippment_containers?.length > 0) {
      let totalContainer = NafdacData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = NafdacData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = NafdacData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (NafdacData?.shipment_advise_items?.length > 0) {
      let totalPackage = NafdacData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [NafdacData]);

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const [IsNormal, setIsNormal] = useState(true);
  const [IsPenaity, setIsPenaity] = useState(false);
  const [IsNormalPenaity, setIsNormalPenaity] = useState(false);

  const handleTabChange = (tab) => {
    setIsNormal(false);
    setIsPenaity(false);
    setIsNormalPenaity(false);

    if (tab === 'normal') {
      setIsNormal(true);
    } else if (tab === 'penaity') {
      setIsPenaity(true);
    } else if (tab === 'normalPenaity') {
      setIsNormalPenaity(true);
    }
  };

  useEffect(() => {
    setFormData(
      NafdacData?.nafdac_inspection_expense?.pfi_id && IsNormalPenaity
        ? {
            nafdac_inspection_expense_id: NafdacData?.nafdac_inspection_expense?.nafdac_inspection_expense_id,
            penalty_type: NafdacData?.nafdac_inspection_expense?.penalty_type,
            bill_num: NafdacData?.nafdac_inspection_expense?.bill_num,
            bill_dt: dayjs(NafdacData?.nafdac_inspection_expense?.bill_dt, 'YYYY-MM-DD'),
            Amount: NafdacData?.nafdac_inspection_expense?.Amount,
            vat: NafdacData?.nafdac_inspection_expense?.vat,
            inv_total: NafdacData?.nafdac_inspection_expense?.inv_total,
            remita_charges: NafdacData?.nafdac_inspection_expense?.remita_charges,
            remita_vat: NafdacData?.nafdac_inspection_expense?.remita_vat,
            payment_total: NafdacData?.nafdac_inspection_expense?.payment_total,
            ref_no: NafdacData?.nafdac_inspection_expense?.ref_no,
            payment_bank: NafdacData?.nafdac_inspection_expense?.payment_bank,
            payment_dt: dayjs(NafdacData?.nafdac_inspection_expense?.payment_dt, 'YYYY-MM-DD'),
            payment_bank_account_num: NafdacData?.nafdac_inspection_expense?.payment_bank_account_num,
            penalty_amount: NafdacData?.nafdac_inspection_expense?.penalty_amount,
            penalty_vat: NafdacData?.nafdac_inspection_expense?.penalty_vat,
            penalty_total: NafdacData?.nafdac_inspection_expense?.penalty_total,
            penalty_remita_charges: NafdacData?.nafdac_inspection_expense?.penalty_remita_charges,
            penalty_remita_vat: NafdacData?.nafdac_inspection_expense?.penalty_remita_vat,
            penalty_payment_total: NafdacData?.nafdac_inspection_expense?.penalty_payment_total,
            penalty_approved_by: NafdacData?.nafdac_inspection_expense?.penalty_approved_by,
            penalty_approved_dt: dayjs(NafdacData?.nafdac_inspection_expense?.penalty_approved_dt, 'YYYY-MM-DD'),
            remarks: NafdacData?.nafdac_inspection_expense?.remarks
          }
        : IsNormalPenaity
          ? {
              penalty_type: '',
              bill_num: '',
              bill_dt: null,
              Amount: '',
              vat: '',
              inv_total: '',
              remita_charges: '',
              remita_vat: '',
              payment_total: '',
              ref_no: '',
              payment_bank: '',
              payment_dt: null,
              payment_bank_account_num: '',
              penalty_amount: '',
              penalty_vat: '',
              penalty_total: '',
              penalty_remita_charges: '',
              penalty_remita_vat: '',
              penalty_payment_total: '',
              penalty_approved_by: '',
              penalty_approved_dt: null,
              remarks: ''
            }
          : IsNormal && NafdacData?.nafdac_inspection_expense?.pfi_id
            ? {
                nafdac_inspection_expense_id: NafdacData?.nafdac_inspection_expense?.nafdac_inspection_expense_id,
                penalty_type: NafdacData?.nafdac_inspection_expense?.penalty_type,
                bill_num: NafdacData?.nafdac_inspection_expense?.bill_num,
                bill_dt: dayjs(NafdacData?.nafdac_inspection_expense?.bill_dt, 'YYYY-MM-DD'),
                Amount: NafdacData?.nafdac_inspection_expense?.Amount,
                vat: NafdacData?.nafdac_inspection_expense?.vat,
                inv_total: NafdacData?.nafdac_inspection_expense?.inv_total,
                remita_charges: NafdacData?.nafdac_inspection_expense?.remita_charges,
                remita_vat: NafdacData?.nafdac_inspection_expense?.remita_vat,
                payment_total: NafdacData?.nafdac_inspection_expense?.payment_total,
                ref_no: NafdacData?.nafdac_inspection_expense?.ref_no,
                payment_bank: NafdacData?.nafdac_inspection_expense?.payment_bank,
                payment_dt: dayjs(NafdacData?.nafdac_inspection_expense?.payment_dt, 'YYYY-MM-DD'),
                payment_bank_account_num: NafdacData?.nafdac_inspection_expense?.payment_bank_account_num
              }
            : IsNormal
              ? {
                  penalty_type: '',
                  bill_num: '',
                  bill_dt: null,
                  Amount: '',
                  vat: '',
                  inv_total: '',
                  remita_charges: '',
                  remita_vat: '',
                  payment_total: '',
                  ref_no: '',
                  payment_bank: '',
                  payment_dt: null,
                  payment_bank_account_num: ''
                }
              : IsPenaity && NafdacData?.nafdac_inspection_expense?.pfi_id
                ? {
                    nafdac_inspection_expense_id: NafdacData?.nafdac_inspection_expense?.nafdac_inspection_expense_id,
                    penalty_type: NafdacData?.nafdac_inspection_expense?.penalty_type,
                    penalty_amount: NafdacData?.nafdac_inspection_expense?.penalty_amount,
                    penalty_vat: NafdacData?.nafdac_inspection_expense?.penalty_vat,
                    penalty_total: NafdacData?.nafdac_inspection_expense?.penalty_total,
                    penalty_remita_charges: NafdacData?.nafdac_inspection_expense?.penalty_remita_charges,
                    penalty_remita_vat: NafdacData?.nafdac_inspection_expense?.penalty_remita_vat,
                    penalty_payment_total: NafdacData?.nafdac_inspection_expense?.penalty_payment_total,
                    penalty_approved_by: NafdacData?.nafdac_inspection_expense?.penalty_approved_by,
                    penalty_approved_dt: dayjs(NafdacData?.nafdac_inspection_expense?.penalty_approved_dt, 'YYYY-MM-DD'),
                    remarks: NafdacData?.nafdac_inspection_expense?.remarks
                  }
                : {
                    penalty_type: '',
                    penalty_amount: '',
                    penalty_vat: '',
                    penalty_total: '',
                    penalty_remita_charges: '',
                    penalty_remita_vat: '',
                    penalty_payment_total: '',
                    penalty_approved_by: '',
                    penalty_approved_dt: null,
                    remarks: ''
                  }
    );
  }, [IsNormalPenaity, IsNormal, IsNormal, NafdacData]);

  useEffect(() => {
    console.log('nafdac_clearance', NafdacData?.nafdac_clearance);
    setFormDataClearing(
      NafdacData?.nafdac_clearance?.nafdac_clearance_id
        ? {
            nafdac_clearance_id: NafdacData?.nafdac_clearance?.nafdac_clearance_id,
            nafdac_applied_dt: dayjs(NafdacData?.nafdac_clearance?.nafdac_applied_dt, 'YYYY-MM-DD'),
            nafdac_clearance_type: NafdacData?.nafdac_clearance?.nafdac_clearance_type,
            invoice_received_dt: dayjs(NafdacData?.nafdac_clearance?.invoice_received_dt, 'YYYY-MM-DD'),
            invoice_type: NafdacData?.nafdac_clearance?.invoice_type,
            first_endorsement_received_dt: dayjs(NafdacData?.nafdac_clearance?.first_endorsement_received_dt, 'YYYY-MM-DD'),
            second_endorsement_received_dt: dayjs(NafdacData?.nafdac_clearance?.second_endorsement_received_dt, 'YYYY-MM-DD'),
            release_type: NafdacData?.nafdac_clearance?.release_type,
            full_release_date: dayjs(NafdacData?.nafdac_clearance?.full_release_date, 'YYYY-MM-DD'),
            partial_release_date: dayjs(NafdacData?.nafdac_clearance?.partial_release_date, 'YYYY-MM-DD'),
            full_release_received: NafdacData?.nafdac_clearance?.full_release_received,
            full_release_received_date: dayjs(NafdacData?.nafdac_clearance?.full_release_received_date, 'YYYY-MM-DD'),
            sample_collected_dt: dayjs(NafdacData?.nafdac_clearance?.sample_collected_dt, 'YYYY-MM-DD'),
            sample_collected_qty: NafdacData?.nafdac_clearance?.sample_collected_qty,
            sample_return: NafdacData?.nafdac_clearance?.sample_return,
            sample_return_date: dayjs(NafdacData?.nafdac_clearance?.sample_return_date, 'YYYY-MM-DD'),
            sample_return_qty: NafdacData?.nafdac_clearance?.sample_return_qty
          }
        : {
            nafdac_applied_dt: null,
            nafdac_clearance_type: '',
            invoice_received_dt: null,
            invoice_type: '',
            first_endorsement_received_dt: null,
            second_endorsement_received_dt: null,
            release_type: '',
            full_release_date: null,
            partial_release_date: null,
            full_release_received: '',
            full_release_received_date: null,
            sample_collected_dt: null,
            sample_collected_qty: '',
            sample_return: '',
            sample_return_date: null,
            sample_return_qty: ''
          }
    );
  }, []);

  const [formData, setFormData] = useState({});

  const [formDataClearing, setFormDataClearing] = useState({
    nafdac_applied_dt: null,
    nafdac_clearance_type: '',
    invoice_received_dt: null,
    invoice_type: '',
    first_endorsement_received_dt: null,
    second_endorsement_received_dt: null,
    release_type: '',
    full_release_date: null,
    partial_release_date: null,
    full_release_received: '',
    full_release_received_date: null,
    sample_collected_dt: null,
    sample_collected_qty: '',
    sample_return: '',
    sample_return_date: null,
    sample_return_qty: ''
  });

  const handleChangeClearing = (e) => {
    const { name, value } = e.target;
    if (name === 'invoice_type') {
      setFormDataClearing((prevData) => ({
        ...prevData,
        [name]: value
      }));

      setIsNormal(false);
      setIsPenaity(false);
      setIsNormalPenaity(false);

      if (value === 'Normal') {
        setIsNormal(true);
      } else if (value === 'Penalty') {
        setIsPenaity(true);
      } else if (value === 'Normal with Penalty') {
        setIsNormalPenaity(true);
      }
    } else {
      setFormDataClearing((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleDateChangeClearing = (name, value) => {
    setFormDataClearing((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmitClearing = async (e) => {
    e.preventDefault();
    console.log('formDataClearing', formDataClearing);
    let SendFormdata = {
      ci_id: NafdacData.ci_id,
      pfi_id: NafdacData.pfi_id,
      pfi_no: NafdacData.pfi_num,
      ci_num: NafdacData.ci_num,
      ...formDataClearing
    };
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/nafdac/clearance', SendFormdata);
      console.log('Successfully:', data);
      toast.success('Successfully');
      onclose();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
      toast.error('Error in Updated');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let SendFormdata = {
      ci_id: NafdacData.ci_id,
      pfi_id: NafdacData.pfi_id,
      pfi_no: NafdacData.pfi_num,
      ci_num: NafdacData.ci_num,
      ...formData,
      ...formDataClearing
    };
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/nafdac/inspection/expense', SendFormdata);
      console.log('Successfully:', data);
      toast.success('Successfully');
      onclose();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
      toast.error('Error in Updated');
    }
  };

  return (
    <div>
      <CI_Data ci_id={NafdacData?.ci_id} />

      <Table>
        {renderTableHeader('ClearingDetails', 'Clearing Information')}
        {showTableHeading.ClearingDetails && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                <Grid container spacing={1} component="form" onSubmit={handleSubmitClearing}>
                  {/* NAFDAC Applied Date */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">NAFDAC Applied Dt</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      value={formDataClearing.nafdac_applied_dt}
                      onChange={(value) => handleDateChangeClearing('nafdac_applied_dt', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                    />
                  </Grid>

                  {/* NAFDAC Clearance Type */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">NAFDAC Clearance Type</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                      value={formDataClearing.nafdac_clearance_type}
                      name="nafdac_clearance_type"
                      onChange={(e) => handleChangeClearing(e)}
                    >
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Restricted">Restricted</MenuItem>
                      <MenuItem value="Controlled">Controlled</MenuItem>
                    </Select>
                  </Grid>

                  {/* Invoice Received Date */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Invoice Received Dt</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      value={formDataClearing.invoice_received_dt}
                      onChange={(value) => handleDateChangeClearing('invoice_received_dt', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                    />
                  </Grid>

                  {/* Select Invoice Type */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Select Invoice Type</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                      value={formDataClearing.invoice_type}
                      name="invoice_type"
                      onChange={(e) => handleChangeClearing(e)}
                    >
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Penalty">Penalty</MenuItem>
                      <MenuItem value="Normal with Penalty">Normal with Penalty</MenuItem>
                    </Select>
                  </Grid>

                  {/* Endorsement Receive Dates */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">1st Endorsement Receive Dt</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      value={formDataClearing.first_endorsement_received_dt}
                      onChange={(value) => handleDateChangeClearing('first_endorsement_received_dt', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">2nd Endorsement Receive Dt</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      value={formDataClearing.second_endorsement_received_dt}
                      onChange={(value) => handleDateChangeClearing('second_endorsement_received_dt', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>

                  {/* Release Type */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Release Type</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                      value={formDataClearing.release_type}
                      name="release_type"
                      onChange={(e) => handleChangeClearing(e)}
                    >
                      <MenuItem value="Full">Full</MenuItem>
                      <MenuItem value="Partial">Partial</MenuItem>
                    </Select>
                  </Grid>

                  {/* Full Release Date */}
                  {formDataClearing.release_type === 'Full' && (
                    <>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Full Release Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formDataClearing.full_release_date}
                          onChange={(value) => handleDateChangeClearing('full_release_date', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Partial Release Date */}
                  {formDataClearing.release_type === 'Partial' && (
                    <>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Partial Release Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formDataClearing.partial_release_date}
                          onChange={(value) => handleDateChangeClearing('partial_release_date', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Full Release Pending</Typography>
                      </Grid> */}
                    </>
                  )}

                  {/* Full Release Received */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Full Release Received</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                      value={formDataClearing.full_release_received}
                      name="full_release_received"
                      onChange={(e) => handleChangeClearing(e)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </Grid>
                  {formDataClearing.full_release_received === 'Yes' && (
                    <>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Full Release Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formDataClearing.full_release_received_date}
                          onChange={(value) => handleDateChangeClearing('full_release_received_date', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Sample Collection Details */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Sample Collected Dt</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      value={formDataClearing.sample_collected_dt}
                      onChange={(value) => handleDateChangeClearing('sample_collected_dt', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Sample Collected Qty</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      value={formDataClearing.sample_collected_qty}
                      name="sample_collected_qty"
                      onChange={handleChangeClearing}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                    />
                  </Grid>

                  {/* Sample Return */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Sample Return</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                      value={formDataClearing.sample_return}
                      name="sample_return"
                      onChange={(e) => handleChangeClearing(e)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </Grid>
                  {formDataClearing.sample_return === 'Yes' && (
                    <>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Sample Return Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formDataClearing.sample_return_date}
                          onChange={(value) => handleDateChangeClearing('sample_return_date', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Qty Collected Back</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formDataClearing.sample_return_qty}
                          name="sample_return_qty"
                          onChange={handleChangeClearing}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* Submit Button */}
                {/* <Grid item xs={12} sm={12} style={{ justifyContent: 'flex-end', display: 'flex' }}>
                  {NafdacData?.nafdac_clearance?.nafdac_clearance_id ? (
                    <Button variant="contained" color="primary" type="submit">
                      Update
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                  )}
                </Grid> */}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Table>
        {renderTableHeader('updateDetails', 'Inspection Expense')}
        {showTableHeading.updateDetails && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                {/* <>
                  <Box style={{ justifyContent: 'center', display: 'flex' }}>
                    <Tabs aria-label="disabled tabs example">
                      <Tab
                        label="Normal"
                        onClick={() => handleTabChange('normal')}
                        sx={{
                          color: IsNormal ? 'blue' : 'default', // Change text color to blue when active
                          fontWeight: IsNormal ? 'bold' : 'normal' // Optional: make the text bold when active
                        }}
                      />
                      <Tab
                        label="Penalty"
                        onClick={() => handleTabChange('penaity')}
                        sx={{
                          color: IsPenaity ? 'blue' : 'default',
                          fontWeight: IsPenaity ? 'bold' : 'normal'
                        }}
                      />
                      <Tab
                        label="Normal & Penalty"
                        onClick={() => handleTabChange('normalPenaity')}
                        sx={{
                          color: IsNormalPenaity ? 'blue' : 'default',
                          fontWeight: IsNormalPenaity ? 'bold' : 'normal'
                        }}
                      />
                    </Tabs>
                  </Box>
                </> */}
                <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
                  {(IsNormal || IsNormalPenaity) && (
                    <>
                      {/* -------------------------------Normal------------------------- */}
                      <Grid item xs={12} sm={12}>
                        <Typography variant="h5" style={{ color: 'blue' }}>
                          Normal
                        </Typography>
                      </Grid>

                      {/* Bill Number */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Bill Number</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.bill_num}
                          name="bill_num"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Bill Date */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Bill Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formData.bill_dt}
                          onChange={(value) => handleDateChange('bill_dt', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Amount */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Amount</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.Amount}
                          name="Amount"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* VAT */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">VAT</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.vat}
                          name="vat"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Invoice Total */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Invoice Total</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.inv_total}
                          name="inv_total"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Remita Charges */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Remita Charges</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.remita_charges}
                          name="remita_charges"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Remita Vat */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Remita Vat</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.remita_vat}
                          name="remita_vat"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Payment Total */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Payment Total</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.payment_total}
                          name="payment_total"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Payment Bank */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Payment Bank</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.payment_bank}
                          name="payment_bank"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Payment Bank */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Payment Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formData.payment_dt}
                          onChange={(value) => handleDateChange('payment_dt', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Referance No. */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Referance No.</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.ref_no}
                          name="ref_no"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Payment Bank Account Number */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Payment Bank Account</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.payment_bank_account_num}
                          name="payment_bank_account_num"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* -------------------------------Penalty------------------------- */}
                  {(IsPenaity || IsNormalPenaity) && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <Typography variant="h5" style={{ color: 'blue' }}>
                          Penalty
                        </Typography>
                      </Grid>

                      {/* Penalty Amount */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Amount</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_amount}
                          name="penalty_amount"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Payment made to */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Type</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          fullWidth
                          value={formData?.penalty_type || ''}
                          name="penalty_type"
                          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        >
                          {/* Replace these options with the actual agencies */}
                          <MenuItem value="" disabled>
                            Select an Payment mode
                          </MenuItem>
                          <MenuItem value="Item Related">Item Related</MenuItem>
                          <MenuItem value="Endorsement related">Endorsement related</MenuItem>
                          <MenuItem value="Item with Endorsement related">Item with Endorsement related</MenuItem>
                        </Select>
                      </Grid>

                      {/* Penalty VAT */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty VAT</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_vat}
                          name="penalty_vat"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Penalty Total */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Total</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_total}
                          name="penalty_total"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Penalty Approved By */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Approved By</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_approved_by}
                          name="penalty_approved_by"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Penalty Payment Total */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Payment Total</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_payment_total}
                          name="penalty_payment_total"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Penalty Remita Charges */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Remita Charges</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_remita_charges}
                          name="penalty_remita_charges"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Penalty Remita Vat */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Remita Vat</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.penalty_remita_vat}
                          name="penalty_remita_vat"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Penalty Approved Date */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Penalty Approved Date</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <DatePicker
                          value={formData.penalty_approved_dt}
                          onChange={(value) => handleDateChange('penalty_approved_dt', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>

                      {/* Remarks */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Remarks</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={formData.remarks}
                          name="remarks"
                          onChange={handleChange}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Submit Button */}
                  <Grid item xs={12} sm={12} style={{ justifyContent: 'flex-end', display: 'flex' }}>
                    {NafdacData?.nafdac_inspection_expense?.pfi_id ? (
                      <Button variant="contained" color="primary" type="submit">
                        Update
                      </Button>
                    ) : (
                      <Button variant="contained" color="primary" type="submit">
                        Submit
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <div style={{ maxHeight: '900px', overflowY: 'auto' }}>
        <Table>
          {renderTableHeader('penaltyDetails', 'Penalty')}
          {showTableHeading.penaltyDetails && (
            <div>
              <NafdacPenaltyForm NafdacData={NafdacData} onclose={onclose} />
            </div>
          )}
        </Table>
      </div>
    </div>
  );
};

export default NafdacOperations;
