import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button, TextField } from '@mui/material';
import CustomTypography from 'components/CustomTypography';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import PlusButton from 'components/CustomButton';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export default function ContainerDetail({ setShowShippingContainerDetails, showShippingExpenseData, onClose, onSuccessfulSubmit }) {
  const [showTableHeading, setShowTableHeading] = useState({
    ContainerDetailDetail: true,
    container: true,
    BookedShippingAddress: true,
    basicDetails: true
  });
  const [shippingContainerData, setShippingContainerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(showShippingExpenseData);
        const assessmentAllData = showShippingExpenseData?.add_shippment_containers?.map((item, index) => ({
          id: index + 1,
          sr_no: index + 1,
          container_no: item?.container_no,
          type: item?.container_type_name,
          free_days: showShippingExpenseData?.shippment_advise_master?.free_days,
          free_days_ending: item?.free_days_ending,
          agent: item?.agent
        }));
        setShippingContainerData(assessmentAllData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // setError(error);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (index, newValue) => {
    const updatedDetails = [...containerDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      valid_till: newValue
    };
    setContainerDetails(updatedDetails);
  };

  const shippingContainerColumn = [
    {
      field: 'sr_no',
      headerName: 'Sr.No.',
      width: 60, // You can keep a fixed width for specific columns if necessary
      flex: 0.2 // Optional, allows flexibility if you want to allocate space based on content
    },
    {
      headerName: 'Container No',
      field: 'container_no',
      // width: 120, // You can keep the width for columns that need a fixed width
      flex: 1 // Makes the column width flexible and adjust to its content
    },
    {
      headerName: 'Type',
      field: 'type',
      // width: 80, // Fixed width for this column
      flex: 1 // Flexible width based on content
    },
    {
      headerName: 'Free Days',
      field: 'free_days',
      // width: 80, // Fixed width
      flex: 1 // Flexible width based on content
    },
    {
      headerName: 'Free Days Ending On',
      field: 'free_days_ending',
      flex: 1
    }
  ];
  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);
  useEffect(() => {
    setContainerDetails(showShippingExpenseData?.add_shippment_containers);

    let data = showShippingExpenseData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (showShippingExpenseData?.add_shippment_containers?.length > 0) {
      let totalContainer = showShippingExpenseData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = showShippingExpenseData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = showShippingExpenseData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (showShippingExpenseData?.shipment_advise_items?.length > 0) {
      let totalPackage = showShippingExpenseData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [showShippingExpenseData]);

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="h6" fontWeight={600}>
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

  const [containerDetails, setContainerDetails] = useState([{ container_no: '', valid_till: '' }]);

  const handleChangeContainer = (index, e) => {
    const { name, value } = e.target;

    const updatedDetails = [...containerDetails];

    updatedDetails[index] = {
      ...updatedDetails[index],
      [name]: value
    };

    setContainerDetails(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(containerDetails);
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/shipping/expense/validity/do', {
        containerItemArr: containerDetails
      });
      toast.success(data.message);
      setShowShippingContainerDetails(false);
    } catch (error) {
      toast.error(error.message);
    }
    onClose();
  };

  const TableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="body">Sr No.</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Container No.</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Valid Till</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>DO (Delivery Order) Information</span>
          <PlusButton label="Back" onClick={() => setShowShippingContainerDetails(false)} />
        </Box>
      }
    >
      <Table>
        {renderTableHeader('basicDetails', 'Basic Details')}
        {showTableHeading.basicDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Number:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.pfi_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">PFI Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.pfi_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">OPO No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.opo_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Delivery Unit:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.company_name}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Supplier Name:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.supplier_name}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">FORM M No.:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.form_m_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">FORM M Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.form_m_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Expiry Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.form_m_expiry_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BA No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.ba_num}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">LC No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.lc_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Product Description:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.product_description}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Status:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.shipment_status}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">No of Previous shipment:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.no_of_previous_shipment}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Value Of Previous Shipment:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.value_of_previous_shipment}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">BL No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.bl_awb_no}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">BL Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.bl_awb_date}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Free Days:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.free_days}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Shipment Mode:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.shipment_mode_name}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Vessel Name, No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{`${showShippingExpenseData?.shippment_advise_master?.shipping_vehicle}, ${showShippingExpenseData?.shippment_advise_master?.vehicle_description}`}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Port Of Loading:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.port_of_loading}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Port Of DC:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.port_of_dc}</CustomTypography>
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
                <CustomTypography>{showShippingExpenseData.ci_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Commercial Invoice Date:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.ci_date}</CustomTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell>
              <CustomTypography variant="subtitle1">Sender:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData.sender}</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography variant="subtitle1">Sender Date:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData.sender_date}</CustomTypography>
            </TableCell> */}
              {/* <TableCell>
              <CustomTypography variant="subtitle1">OPR No:</CustomTypography>
            </TableCell>
            <TableCell>
              <CustomTypography>{showShippingExpenseData.opr_num}</CustomTypography>
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
                <CustomTypography>{showShippingExpenseData.eta}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">OPR No:</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography>{showShippingExpenseData.opr_num}</CustomTypography>
              </TableCell>
              <TableCell>
                <CustomTypography variant="subtitle1">Total (A+B+C):</CustomTypography>
              </TableCell>
              <TableCell colSpan={5}>
                <CustomTypography>{showShippingExpenseData.pfi_amount}</CustomTypography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <CustomTypography variant="subtitle1">Rotation Number:</CustomTypography>
              </TableCell>
              <TableCell colSpan={5}>
                <CustomTypography>{showShippingExpenseData?.assessment?.rotation_no}</CustomTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('BookedShippingAddress', 'Container DO Validity Details ')}
        {showTableHeading.BookedShippingAddress && (
          <>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              columns={shippingContainerColumn}
              rows={shippingContainerData}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          </>
        )}
      </Table>

      <form onSubmit={handleSubmit}>
        <Table>
          {renderTableHeader('container', 'Container DO Validity Details - Validation 1')}
          {showTableHeading.container && (
            <>
              <TableHeader />
              <TableBody>
                {containerDetails.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%',
                          '& .Mui-disabled': {
                            '-webkit-text-fill-color': '#000'
                          }
                        }}
                        variant="outlined"
                        name="container_no"
                        value={value.container_no}
                        disabled
                      />
                    </TableCell>
                    {/* <TableCell>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="valid_till"
                        value={value.valid_till}
                        onChange={(e) => handleChangeContainer(index, e)}
                      />
                    </TableCell> */}
                    <TableCell>
                      <DatePicker
                        name="valid_till"
                        value={value.valid_till || dayjs(value.do_validity_dt)}
                        onChange={(newValue) => handleDateChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '7px'
                              },
                              width: '100%'
                            }}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>

        {/* Add Row Button */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={addRow}>
            Add Row
          </Button>
        </Box> */}

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
            Submit
          </Button>
        </Box>
      </form>
    </MainCard>
  );
}
