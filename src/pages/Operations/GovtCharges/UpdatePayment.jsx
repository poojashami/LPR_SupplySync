import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CustomTypography from 'components/CustomTypography';
import CI_Data from 'components/BasicDataComponent/CI_data';

const UpdatePayment = ({ OpenDoc, GovtChargesData }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true
  });

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

  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = GovtChargesData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (GovtChargesData?.add_shippment_containers?.length > 0) {
      let totalContainer = GovtChargesData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = GovtChargesData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = GovtChargesData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (GovtChargesData?.shipment_advise_items?.length > 0) {
      let totalPackage = GovtChargesData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [GovtChargesData]);

  return (
    <div>
      <CI_Data ci_id={GovtChargesData?.ci_id} />
      <FORM OpenDocument={OpenDoc} GovtChargesData={GovtChargesData} />
    </div>
  );
};

export default UpdatePayment;

const FORM = ({ OpenDocument, GovtChargesData }) => {
  console.log('OpenDocument: ', GovtChargesData);

  const [file, setFile] = useState(null);
  const [openLapse, setOpenLapse] = useState(false);

  const [paymentType, setPaymentType] = useState([]);
  const [addExpense, setAddExpense] = useState([]);
  const [formValuesOther, setFormValuesOther] = useState({
    pfi_id: GovtChargesData.pfi_id,
    pfi_num: GovtChargesData?.pfi_num,
    ci_id: GovtChargesData?.ci_id,
    ci_num: GovtChargesData?.ci_num,
    other_head: '',
    other_narration: '',
    other_amount: ''
  });
  const [formValues, setFormValues] = useState({
    pfi_id: GovtChargesData?.pfi_id,
    pfi_num: GovtChargesData?.pfi_num,
    ci_id: GovtChargesData?.ci_id,
    ci_num: GovtChargesData?.ci_num,
    payment_types: '',
    add_expense: '',
    paid_to_others: '',
    invoice_num: '',
    invoice_date: null,
    amount: '',
    vat: '',
    remit_charges: '',
    narration: '',
    penalty_approval: ''
  });

  useEffect(() => {
    getPaymentType();
    getAddExpense();
    getGovtCharges();
  }, []);

  const getGovtCharges = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/operation/govt/charges?ci_id=${id}`);
      console.log('Data', data);
      const lapseKey = {
        govt_charges_id: data.govt_charges_id,
        payment_types: data.payment_types,
        add_expense: data.add_expense,
        received_on: data.received_on,
        paid_to_others: data.paid_to_others,
        invoice_num: data.invoice_num,
        invoice_date: dayjs(data.invoice_date),
        amount: data.amount,
        vat: data.vat,
        remit_charges: data.remit_charges,
        narration: data.narration,
        penalty_approval: data.penalty_approval
      };
      setFormValues(lapseKey);
      setFormValuesOther({
        other_head: data?.other_head,
        other_narration: data?.other_narration,
        other_amount: data?.other_amount
      });
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const getPaymentType = async () => {
    try {
      const response = await axiosInstance.get('/api/charges/payment/type/dropdown');
      const lapseKey = response.data.map((data) => ({
        id: data.payment_type_charges_master_id,
        name: data.payment_type_charges_name
      }));
      setPaymentType(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const getAddExpense = async () => {
    try {
      const response = await axiosInstance.get('/api/charges/add/expense/dropdown');
      const lapseKey = response.data.map((data) => ({
        id: data.add_expense_charges_master_id,
        name: data.add_expense_charges_name
      }));
      setAddExpense(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const handleOtherChargesSubmit = async (e) => {
    e.preventDefault();
    console.log('formValues:', formValues);
    try {
      const response = await axiosInstance.post('/api/operation/govt/charges/other', formValuesOther);

      if (response.status === 201) {
        console.log('Form submitted successfully:', response.data);
        toast.success('Form submitted successfully');
        setFormValues({
          other_amount: '',
          other_narration: ''
        });
      } else {
        console.error('Form submission failed:', response.status);
        toast.error('Error in Form submit');
      }
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formValues:', formValues);
    const data = {
      ...formValues,
      files: file
    };
    try {
      const response = await axiosInstance.post('/api/operation/govt/charges', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        console.log('Form submitted successfully:', response.data);
        toast.success('Form submitted successfully');
        setFormValues(initialValues);
      } else {
        console.error('Form submission failed:', response.status);
        toast.error('Error in Form submit');
      }
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true
  });

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

  return (
    <Box component="form" onSubmit={handleSubmit}>
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
            <Typography variant="body1">Head:</Typography>
            <TextField
              type="text"
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                },
                width: '100%'
              }}
              id="insurance-basic"
              variant="outlined"
              name="other_head"
              value={formValuesOther.other_head}
              onChange={(e) => setFormValuesOther({ ...formValuesOther, [e.target.name]: e.target.value })}
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
              name="other_amount"
              value={formValuesOther.other_amount}
              onChange={(e) => setFormValuesOther({ ...formValuesOther, [e.target.name]: e.target.value })}
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
              name="other_narration"
              value={formValuesOther.other_narration}
              onChange={(e) => setFormValuesOther({ ...formValuesOther, [e.target.name]: e.target.value })}
            />
          </Grid>
        </Grid>
      </>

      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <Button endIcon={<PrintIcon />} variant="contained" sx={{ mr: 2 }} onClick={OpenDocument}>
          Print
        </Button>

        <Button variant="contained" sx={{ mr: 2 }} onClick={handleOtherChargesSubmit}>
          Submit Other Charges
        </Button>
      </Box>
    </Box>
  );
};
