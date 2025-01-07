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
import CI_Data from 'components/BasicDataComponent/CI_data';

const OtherGovtCharges = ({ GovtChData, onclose }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    updateDetails: true,
    etaDetails: true
  });

  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = GovtChData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (GovtChData?.add_shippment_containers?.length > 0) {
      let totalContainer = GovtChData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = GovtChData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = GovtChData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (GovtChData?.shipment_advise_items?.length > 0) {
      let totalPackage = GovtChData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [GovtChData]);

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
    console.log('GovtChData?.other_govt_charge?.agency', GovtChData?.other_govt_charge?.agency.toString());
    setFormData(
      GovtChData?.other_govt_charge?.pfi_id && IsNormalPenaity
        ? {
            other_govt_charges_id: GovtChData?.other_govt_charge?.other_govt_charges_id,
            agency: GovtChData?.other_govt_charge?.agency,
            payment_mode_to: GovtChData?.other_govt_charge?.payment_mode_to,
            bill_num: GovtChData?.other_govt_charge?.bill_num,
            bill_dt: dayjs(GovtChData?.other_govt_charge?.bill_dt, 'YYYY-MM-DD'),
            Amount: GovtChData?.other_govt_charge?.Amount,
            vat: GovtChData?.other_govt_charge?.vat,
            inv_total: GovtChData?.other_govt_charge?.inv_total,
            remita_charges: GovtChData?.other_govt_charge?.remita_charges,
            remita_vat: GovtChData?.other_govt_charge?.remita_vat,
            payment_total: GovtChData?.other_govt_charge?.payment_total,
            ref_no: GovtChData?.other_govt_charge?.ref_no,
            payment_bank: GovtChData?.other_govt_charge?.payment_bank,
            payment_dt: dayjs(GovtChData?.other_govt_charge?.payment_dt, 'YYYY-MM-DD'),
            payment_bank_account_num: GovtChData?.other_govt_charge?.payment_bank_account_num,
            penalty_amount: GovtChData?.other_govt_charge?.penalty_amount,
            penalty_vat: GovtChData?.other_govt_charge?.penalty_vat,
            penalty_total: GovtChData?.other_govt_charge?.penalty_total,
            penalty_remita_charges: GovtChData?.other_govt_charge?.penalty_remita_charges,
            penalty_remita_vat: GovtChData?.other_govt_charge?.penalty_remita_vat,
            penalty_payment_total: GovtChData?.other_govt_charge?.penalty_payment_total,
            penalty_approved_by: GovtChData?.other_govt_charge?.penalty_approved_by,
            penalty_approved_dt: dayjs(GovtChData?.other_govt_charge?.penalty_approved_dt, 'YYYY-MM-DD'),
            remarks: GovtChData?.other_govt_charge?.remarks
          }
        : IsNormalPenaity
          ? {
              payment_mode_to: '',
              agency: '',
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
          : IsNormal && GovtChData?.other_govt_charge?.pfi_id
            ? {
                other_govt_charges_id: GovtChData?.other_govt_charge?.other_govt_charges_id,
                agency: GovtChData?.other_govt_charge?.agency,
                payment_mode_to: GovtChData?.other_govt_charge?.payment_mode_to,
                bill_num: GovtChData?.other_govt_charge?.bill_num,
                bill_dt: dayjs(GovtChData?.other_govt_charge?.bill_dt, 'YYYY-MM-DD'),
                Amount: GovtChData?.other_govt_charge?.Amount,
                vat: GovtChData?.other_govt_charge?.vat,
                inv_total: GovtChData?.other_govt_charge?.inv_total,
                remita_charges: GovtChData?.other_govt_charge?.remita_charges,
                remita_vat: GovtChData?.other_govt_charge?.remita_vat,
                payment_total: GovtChData?.other_govt_charge?.payment_total,
                ref_no: GovtChData?.other_govt_charge?.ref_no,
                payment_bank: GovtChData?.other_govt_charge?.payment_bank,
                payment_dt: dayjs(GovtChData?.other_govt_charge?.payment_dt, 'YYYY-MM-DD'),
                payment_bank_account_num: GovtChData?.other_govt_charge?.payment_bank_account_num
              }
            : IsNormal
              ? {
                  payment_mode_to: '',
                  agency: '',
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
              : IsPenaity && GovtChData?.other_govt_charge?.pfi_id
                ? {
                    other_govt_charges_id: GovtChData?.other_govt_charge?.other_govt_charges_id,
                    agency: GovtChData?.other_govt_charge?.agency,
                    payment_mode_to: GovtChData?.other_govt_charge?.payment_mode_to,
                    penalty_amount: GovtChData?.other_govt_charge?.penalty_amount,
                    penalty_vat: GovtChData?.other_govt_charge?.penalty_vat,
                    penalty_total: GovtChData?.other_govt_charge?.penalty_total,
                    penalty_remita_charges: GovtChData?.other_govt_charge?.penalty_remita_charges,
                    penalty_remita_vat: GovtChData?.other_govt_charge?.penalty_remita_vat,
                    penalty_payment_total: GovtChData?.other_govt_charge?.penalty_payment_total,
                    penalty_approved_by: GovtChData?.other_govt_charge?.penalty_approved_by,
                    penalty_approved_dt: dayjs(GovtChData?.other_govt_charge?.penalty_approved_dt, 'YYYY-MM-DD'),
                    remarks: GovtChData?.other_govt_charge?.remarks
                  }
                : {
                    payment_mode_to: '',
                    agency: '',
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
  }, [IsNormalPenaity, IsNormal, IsNormal, GovtChData]);

  const [formData, setFormData] = useState({});

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
      ci_id: GovtChData.ci_id,
      pfi_id: GovtChData.pfi_id,
      pfi_no: GovtChData.pfi_num,
      ci_num: GovtChData.ci_num,
      ...formData
    };
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/other/govt/charges', SendFormdata);
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
      <CI_Data ci_id={GovtChData?.ci_id} />
      <Box style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}>
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

      <Table>
        {renderTableHeader('updateDetails', 'Form Details')}
        {showTableHeading.updateDetails && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
                  {/* Select Agency */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Select Agency</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      value={formData?.agency || ''}
                      name="agency"
                      onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select an Agency
                      </MenuItem>
                      <MenuItem value="ABC Pvt Ltd">ABC Pvt Ltd</MenuItem>
                      <MenuItem value="XYZ Pvt Ltd">XYZ Pvt Ltd</MenuItem>
                    </Select>
                  </Grid>

                  {/* Payment made to */}
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Payment made to</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      fullWidth
                      value={formData?.payment_mode_to || ''}
                      name="payment_mode_to"
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
                      <MenuItem value="CRFFN">CRFFN</MenuItem>
                      <MenuItem value="NESREA">NESREA</MenuItem>
                    </Select>
                  </Grid>

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
                    {GovtChData?.other_govt_charge?.pfi_id ? (
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
    </div>
  );
};

export default OtherGovtCharges;
