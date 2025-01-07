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
  Tab
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import { axiosInstance } from 'utils/axiosInstance';
import CustomTypography from 'components/CustomTypography';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

const Soncap = ({ SonData, onclose }) => {
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
    let data = SonData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (SonData?.add_shippment_containers?.length > 0) {
      let totalContainer = SonData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = SonData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = SonData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (SonData?.shipment_advise_items?.length > 0) {
      let totalPackage = SonData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [SonData]);

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
      SonData?.soncap_master?.pfi_id && IsNormalPenaity
        ? {
            soncap_master_id: SonData?.soncap_master?.soncap_master_id,
            bill_num: SonData?.soncap_master?.bill_num,
            bill_dt: dayjs(SonData?.soncap_master?.bill_dt, 'YYYY-MM-DD'),
            Amount: SonData?.soncap_master?.Amount,
            vat: SonData?.soncap_master?.vat,
            inv_total: SonData?.soncap_master?.inv_total,
            remita_charges: SonData?.soncap_master?.remita_charges,
            remita_vat: SonData?.soncap_master?.remita_vat,
            payment_total: SonData?.soncap_master?.payment_total,
            ref_no: SonData?.soncap_master?.ref_no,
            payment_bank: SonData?.soncap_master?.payment_bank,
            payment_bank_account_num: SonData?.soncap_master?.payment_bank_account_num,
            penalty_amount: SonData?.soncap_master?.penalty_amount,
            penalty_vat: SonData?.soncap_master?.penalty_vat,
            penalty_total: SonData?.soncap_master?.penalty_total,
            penalty_remita_charges: SonData?.soncap_master?.penalty_remita_charges,
            penalty_remita_vat: SonData?.soncap_master?.penalty_remita_vat,
            penalty_payment_total: SonData?.soncap_master?.penalty_payment_total,
            penalty_approved_by: SonData?.soncap_master?.penalty_approved_by,
            penalty_approved_dt: dayjs(SonData?.soncap_master?.penalty_approved_dt, 'YYYY-MM-DD'),
            remarks: SonData?.soncap_master?.remarks
          }
        : IsNormalPenaity
          ? {
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
          : IsNormal && SonData?.soncap_master?.pfi_id
            ? {
                soncap_master_id: SonData?.soncap_master?.soncap_master_id,
                bill_num: SonData?.soncap_master?.bill_num,
                bill_dt: dayjs(SonData?.soncap_master?.bill_dt, 'YYYY-MM-DD'),
                Amount: SonData?.soncap_master?.Amount,
                vat: SonData?.soncap_master?.vat,
                inv_total: SonData?.soncap_master?.inv_total,
                remita_charges: SonData?.soncap_master?.remita_charges,
                remita_vat: SonData?.soncap_master?.remita_vat,
                payment_total: SonData?.soncap_master?.payment_total,
                ref_no: SonData?.soncap_master?.ref_no,
                payment_bank: SonData?.soncap_master?.payment_bank,
                payment_bank_account_num: SonData?.soncap_master?.payment_bank_account_num
              }
            : IsNormal
              ? {
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
                  payment_bank_account_num: ''
                }
              : IsPenaity && SonData?.soncap_master?.pfi_id
                ? {
                    soncap_master_id: SonData?.soncap_master?.soncap_master_id,
                    penalty_amount: SonData?.soncap_master?.penalty_amount,
                    penalty_vat: SonData?.soncap_master?.penalty_vat,
                    penalty_total: SonData?.soncap_master?.penalty_total,
                    penalty_remita_charges: SonData?.soncap_master?.penalty_remita_charges,
                    penalty_remita_vat: SonData?.soncap_master?.penalty_remita_vat,
                    penalty_payment_total: SonData?.soncap_master?.penalty_payment_total,
                    penalty_approved_by: SonData?.soncap_master?.penalty_approved_by,
                    penalty_approved_dt: dayjs(SonData?.soncap_master?.penalty_approved_dt, 'YYYY-MM-DD'),
                    remarks: SonData?.soncap_master?.remarks
                  }
                : {
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
  }, [IsNormalPenaity, IsNormal, IsNormal, SonData]);

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
    console.log(ContainerRows);
    let SendFormdata = {
      ci_id: SonData.ci_id,
      pfi_id: SonData.pfi_id,
      pfi_no: SonData.pfi_num,
      ci_num: SonData.ci_num,
      bl_num: SonData.bl_awb_no,
      ...formData,
      ConatinerArr: ContainerRows
    };
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/soncap', SendFormdata);
      console.log('Successfully:', data);
      toast.success('Successfully');
      onclose();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
      toast.error('Error in Updated');
    }
  };

  const ContainerColumns = [
    {
      headerName: 'Container',
      field: 'container',
      width: 150
    },
    { headerName: 'Type', field: 'type', width: 200 },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 200,
      renderCell: (params) => {
        return (
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '6px',
                textAlign: 'right' // Ensure text is right-aligned inside the input
              },
              '& .Mui-disabled': {
                '-webkit-text-fill-color': '#4f4f4f'
              },
              width: '100%'
            }}
            type="number"
            name="add_amount"
            value={params.value}
            onChange={(e) => handleChangeAddAmount(e, params.row)}
          />
        );
      }
    }
  ];

  const handleChangeAddAmount = (e, row) => {
    const { value } = e.target;
    setContainerRows((prevState) => prevState.map((item) => (item.id === row?.id ? { ...item, amount: value } : item)));
  };

  const [ContainerRows, setContainerRows] = useState([]);

  useEffect(() => {
    let mapped = SonData?.add_shippment_containers?.map((item, index) => ({
      id: index + 1,
      add_shippment_container_id: item?.add_shippment_container_id,
      container: item?.container_no,
      type: item?.container_type_name,
      amount: item?.soncap_amount ? item?.soncap_amount : 0
    }));
    setContainerRows(mapped);
  }, []);

  return (
    <div>
      <Table>
        {renderTableHeader('basicDetails', 'Basic Details')}
        {showTableHeading.basicDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Number:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.pfi_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.pfi_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">OPO No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.opo_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Delivery Unit:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.company_name}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Supplier Name:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.supplier_name}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">FORM M No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.form_m_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">FORM M Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.form_m_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Expiry Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.form_m_expiry_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.ba_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">LC No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.lc_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Product Description:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.product_description}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Status:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.shipment_status}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">No of Previous shipment:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.no_of_previous_shipment}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Value Of Previous Shipment:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.value_of_previous_shipment}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BL No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.bl_awb_no}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">BL Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.bl_awb_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Free Days:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.free_days}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Mode:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.shipment_mode_name}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Vessel Name, No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{`${SonData?.shippment_advise_master?.shipping_vehicle}, ${SonData?.shippment_advise_master?.vehicle_description}`}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Port Of Loading:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.port_of_loading}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Port Of DC:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.port_of_dc}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">No Of Container:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{TotalContainer}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">No Of Packages:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{TotalPackage}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Net Weight:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{NetWeight}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Gross Weight:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{GrossWeight}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Commercial Invoice No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.ci_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Commercial Invoice Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.ci_date}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell>
              <CustomTypography variant="subtitle1">Sender:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{SonData.sender}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Sender Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{SonData.sender_date}</CustomTypography>
            </TableCell> */}
              {/* <TableCell>
              <CustomTypography variant="subtitle1">OPR No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{SonData.opr_num}</CustomTypography>
            </TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">FOB (A):</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{FobAdditionalCost}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Inland Transport & Doc Charge (B):</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{InlandCost}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Freight (C):</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{FreightAdditionalCost}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Supplier ETA:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.eta}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">OPR No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{SonData.opr_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Total (A+B+C):</CustomTypography>
              </TableCell>
              <TableCell colSpan={5}>
                <CustomTypography>{SonData.pfi_amount}</CustomTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Box style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}>
        <Tabs aria-label="disabled tabs example">
          <Tab label="Normal" onClick={() => handleTabChange('normal')} />
          <Tab label="Penalty" onClick={() => handleTabChange('penaity')} />
          <Tab label="Normal & Penalty" onClick={() => handleTabChange('normalPenaity')} />
        </Tabs>
      </Box>

      <Table>
        {renderTableHeader('updateDetails', 'Form Details')}
        {showTableHeading.updateDetails && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
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
                    {SonData?.soncap_master?.pfi_id ? (
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

      <div>
        <h4>Container Details</h4>
      </div>

      <Box style={{ width: '70vh' }}>
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          columns={ContainerColumns}
          rows={ContainerRows}
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </Box>
    </div>
  );
};

export default Soncap;
