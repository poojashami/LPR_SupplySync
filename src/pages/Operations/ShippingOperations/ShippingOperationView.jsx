import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, TextField, Button, Grid } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CustomTypography from 'components/CustomTypography';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import CI_Data from 'components/BasicDataComponent/CI_data';
export default function ShippingOperationView({
  shippingData,
  handleClose,
  setProvision,
  GetShippingExpense,
  setShowShippingExpenseData,
  setShowShippingExpense,
  setOpenShippingupdate,
  setShowShippingContainerDetails,
  setShowShippingLpaseDetails
}) {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    revisedETA: true
  });

  console.log('shippingData', shippingData);

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

  const [RotationNumber, setRotationNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formdata = {
      rotation_num: RotationNumber,
      ci_id: shippingData.ci_id,
      assessment_id: shippingData?.assessment?.assessment_id
    };
    try {
      const { data } = await axiosInstance.post('/api/shipping/advise/rotation', formdata);
      toast.success('Rotation Submitted successfully');
    } catch (error) {
      toast.error('An error has occurred');
    }
  };

  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = shippingData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (shippingData?.add_shippment_containers?.length > 0) {
      let totalContainer = shippingData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = shippingData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = shippingData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (shippingData?.shipment_advise_items?.length > 0) {
      let totalPackage = shippingData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [shippingData]);

  return (
    <>
      <CI_Data ci_id={shippingData?.ci_id} />

      {shippingData?.assessment && !shippingData?.assessment?.rotation_no && (
        <Grid container spacing={1} alignItems="center" style={{ paddingLeft: '30px' }}>
          <Grid item xs={12} sm={1.5}>
            <Typography variant="body">Rotation Number</Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                },
                width: '100%'
              }}
              name="rotation_num"
              variant="outlined"
              fullWidth
              value={RotationNumber}
              onChange={(e) => setRotationNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }} onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      )}

      <Box style={{ paddingTop: '50px', display: 'flex', justifyContent: 'space-evenly' }}>
        <Button
          variant="contained"
          onClick={() => {
            handleClose();
            setProvision('Y');
            GetShippingExpense(shippingData?.ci_id);
            setShowShippingExpenseData(shippingData);
            setShowShippingExpense(true);
            setOpenShippingupdate(false);
          }}
        >
          Shipping Expense(Provision) #
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            console.log('Clicked');
            handleClose();
            setProvision('N');
            GetShippingExpense(shippingData?.ci_id);
            setShowShippingExpenseData(shippingData);
            setShowShippingExpense(true);
            setOpenShippingupdate(false);
          }}
        >
          Shipping Expense #
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleClose();
            setShowShippingExpenseData(shippingData);
            setShowShippingContainerDetails(true);
            setOpenShippingupdate(false);
          }}
        >
          Container Detail #
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleClose();
            setShowShippingExpenseData(shippingData);
            setShowShippingLpaseDetails(true);
            setOpenShippingupdate(false);
          }}
        >
          Lapse #
        </Button>
      </Box>
    </>
  );
}
