import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Select,
  TableRow,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PlusButton from 'components/CustomButton';
import MainCard from 'components/MainCard';
import { messageOpen } from 'Redux/Slices/StaticSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ValidationStar from 'components/ValidationStar';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useDispatch, useSelector } from 'react-redux';
import { errorMessageStyle } from 'components/StyleComponent';
import { GetSupperCategoriesTypes } from 'Redux/Apis/GetApiCalls';
import {
  getBuyingHouse,
  getLoadDivisions,
  getReqByDepartment,
  getShipmentMode,
  getShipmentType,
  getStockitems,
  getUomByStockitemsId,
  getVertical
} from 'allapi/getAllAPIS';
import { axiosInstance } from 'utils/axiosInstance';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';

const EditOrp = ({ oprNumNew, oprIdNew, onclose }) => {
  // const oprNumNew = 'OPR-281-OPR';
  // const oprIdNew = 6147;

  const { oprs } = useSelector((state) => state.opr);

  const getOprData = async (oprIdNew) => {
    try {
      await GetOpr(dispatch, oprIdNew);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
    }
  };

  useEffect(() => {
    oprs.length === 0 && getOprData(oprIdNew);
  }, []);

  useEffect(() => {
    console.log(oprs);
    const mappedData = oprs?.map((item, index) => ({
      id: index + 1,
      opr_id: item?.opr_id,
      opr_num: item?.opr_num,
      vertical_id: item?.vertical_id,
      company_id: item?.company_id,
      division_id: item?.division_id,
      buying_house_id: item?.buying_house_id,
      shipment_mode_id: item?.shipment_mode_id,
      shipment_type_id: item?.shipment_type_id,
      delivery_timeline_id: item?.delivery_timeline_id,
      department_id: item?.department_id,
      item_category_id: item?.item_category_id,
      buy_from: item?.buy_from,
      buy_house: item?.buy_house,
      opr_date: item?.opr_date,
      requested_by: item?.requested_by,
      remarks: item?.remarks,
      opr_description: item?.item_super_group_master?.item_super_group_name,
      total_items: item?.total_item_count,
      remaining_items_forrfq: item?.remaining_item_count,
      suppliers: item?.suppliers,
      no_quot_email_alert: item?.no_quot_email_alert,
      status: item?.status,
      created_on: item?.created_on,
      created_by: item?.created_by,
      vertical_name: item?.vertical_name,
      company_name: item?.companyMaster?.company_name,
      division_name: item?.division_name,
      buying_house_name: item?.buying_house_name,
      shipment_mode_name: item?.shipment_mode_name,
      dept_name: item?.dept_name,
      d_timeline_name: item?.delivery_timeline_id,
      OprItems: item?.OprItems
    }));
    setOprData(mappedData[0]);
    functionVerticalChange(mappedData[0]?.vertical_id);

    console.log('setInitialValues', {
      vertical: oprData?.vertical_id,
      company: oprData?.company_id,
      division: oprData?.division_id,
      buyFrom: oprData?.buy_from,
      buyingHouse: oprData?.buying_house_id,
      requestByDepartment: oprData?.department_id,
      requestedBy: oprData?.requested_by,
      quotationsEmailAlert: oprData?.no_quot_email_alert,
      shipmentMode: oprData?.shipment_mode_id,
      shipmentType: oprData?.shipment_type_id,
      deliveryTimeline: oprData?.delivery_timeline_id,
      date: oprData?.opr_date?.split('T')[0],
      oprDescription: oprData?.item_category_id,
      additionalRemark: oprData?.remarks,
      potentialSuppliers: oprData?.suppliers
    });
    setFormValues({
      vertical: mappedData[0]?.vertical_id,
      company: mappedData[0]?.company_id,
      division: mappedData[0]?.division_id,
      buyFrom: mappedData[0]?.buy_from,
      buyingHouse: mappedData[0]?.buying_house_id,
      requestByDepartment: mappedData[0]?.department_id,
      requestedBy: mappedData[0]?.requested_by,
      quotationsEmailAlert: mappedData[0]?.no_quot_email_alert,
      shipmentMode: mappedData[0]?.shipment_mode_id,
      shipmentType: mappedData[0]?.shipment_type_id,
      deliveryTimeline: mappedData[0]?.delivery_timeline_id,
      date: mappedData[0]?.opr_date?.split('T')[0],
      oprDescription: mappedData[0]?.item_category_id,
      additionalRemark: mappedData[0]?.remarks,
      potentialSuppliers: mappedData[0]?.suppliers
    });
    setShowBuyingHouse(mappedData[0]?.buy_from === 'Buying House' ? true : false);
  }, [oprs]);

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.opr);

  const [divisions, setDivisions] = useState([]);
  const [shipmentMode, setShipmentMode] = useState([]);
  const [shipmentType, setShipmentType] = useState([]);
  const [reqByDept, setReqByDept] = useState([]);
  const [verticalData, setVerticalData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [buyingHouseData, setBuyingHouseData] = useState([]);
  const [oprData, setOprData] = useState([]);
  const [users, setUsers] = useState([]);
  const [fileArray, setFileArray] = useState([]);
  const getusers = async () => {
    const { data } = await axiosInstance.get('/api/user/users');
    const mappedData = data.map((item, index) => ({
      key: index + 1,
      label: item.first_name,
      id: item.user_id
    }));
    setUsers(mappedData);
  };
  useEffect(() => {
    getusers();
    GetSupperCategoriesTypes(dispatch);
    const fetchData = async () => {
      try {
        const divisionData = await getLoadDivisions();
        setDivisions(divisionData);

        const shipmentModeData = await getShipmentMode();
        setShipmentMode(shipmentModeData);

        const ShipmentTypeData = await getShipmentType();
        setShipmentType(ShipmentTypeData);

        const reqByDeptData = await getReqByDepartment();
        setReqByDept(reqByDeptData);

        const verticalData = await getVertical();
        setVerticalData(verticalData);

        const buyingHouseData = await getBuyingHouse();
        setBuyingHouseData(buyingHouseData);
      } catch (error) {
        toast.error('Server Error');
      }
    };

    fetchData();
  }, []);

  const functionVerticalChange = async (vertical_id) => {
    try {
      const response = await axiosInstance.get(`/api/company/v1/byvertical?vertical_id=${vertical_id}`);
      const formattedCompanyData = response.data.map((item) => ({
        code: item.company_code,
        companyId: item.company_id,
        name: item.company_name
      }));
      setCompanyData(formattedCompanyData);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const handleBuyFromChange = (event) => {
    const value = event.target.value;
    setFormValues({ ...formValues, buyFrom: value });
    setShowBuyingHouse(value === 'Buying House');
  };

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    requestDetails: true,
    otherDetails: true,
    EditDocDetails: true,
    OprItemsDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showBuyingHouse, setShowBuyingHouse] = useState(false);

  const handleChange = (name) => (event) => {
    if (name === 'oprDescription') {
      let data4 = event.target.value == oprData?.item_category_id ? true : false;
      if (!data4) {
        console.log('Sharma');
        setOpenDeleteDialog(true);
        setDocumentToDelete(event.target.value);
      } else {
        setFormValues({ ...formValues, [name]: event.target.value });
      }
    } else {
      console.log('Done');
      setFormValues({ ...formValues, [name]: event.target.value });
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For the delete confirmation dialog
  const [documentToDelete, setDocumentToDelete] = useState(null); // Store the document to delete

  // Step 2: Proceed with the deletion when confirmed
  const confirmDelete = async () => {
    setFormValues({ ...formValues, oprDescription: documentToDelete });
    setOpenDeleteDialog(false);
  };

  // Step 3: Close the dialog without doing anything (onCancel)
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleVerticalChange = (name) => (event) => {
    setFormValues({ ...formValues, [name]: event.target.value });
    functionVerticalChange(event.target.value);
  };

  const handleFileChange = (event) => {
    setFileArray(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('formValues', formValues);
    console.log('fileArray', fileArray);

    const postData = {
      opr_id: oprIdNew,
      opr_num: oprNumNew,
      vertical_id: formValues.vertical,
      company_id: formValues.company,
      opr_date: new Date().toISOString(),
      division_id: formValues.division,
      buy_from: formValues.buyFrom,
      buying_house_id: formValues.buyingHouse,
      shipment_mode_id: formValues.shipmentMode,
      shipment_type_id: formValues.shipmentType,
      delivery_timeline_id: formValues.deliveryTimeline,
      department_id: formValues.requestByDepartment,
      requested_by: formValues.requestedBy,
      no_quot_email_alert: formValues.quotationsEmailAlert,
      item_category_id: formValues.oprDescription,
      remarks: formValues.additionalRemark,
      files: fileArray
    };
    const response = await axiosInstance.put(`api/opr/opr`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    onclose();
    toast.success('Opr Updated Successfully');
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
    <MainCard
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Edit OPR No. {oprNumNew}
          <span>
            <PlusButton label="Back" onClick={onclose} />
          </span>
        </Box>
      }
    >
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Category Updation</DialogTitle>
        <DialogContent>Changing the category will remove all the items selected against previous category?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={handleSubmit}>
        <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
          <Table>
            {renderTableHeader('basicDetails', 'Basic Details')}
            {showTableHeading.basicDetails && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1">
                          Vertical<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.vertical || ''}
                          onChange={handleVerticalChange('vertical')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {verticalData.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.vertical && <div style={errorMessageStyle}>{errors.vertical}</div>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1">
                          Company<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.company || ''}
                          onChange={handleChange('company')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {companyData.map((company) => (
                            <MenuItem key={company.companyId} value={company.companyId}>
                              {company.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.company && <div style={errorMessageStyle}>{errors.company}</div>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1">
                          Division<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.division || ''}
                          onChange={handleChange('division')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {divisions.map((division) => (
                            <MenuItem key={division.id} value={division.id}>
                              {division.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.division && <div style={errorMessageStyle}>{errors.division}</div>}
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1">
                          Buying From<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues?.buyFrom || ''}
                          onChange={(event) => handleBuyFromChange(event)}
                          fullWidth
                        >
                          <MenuItem value="Buying House">Buying House</MenuItem>
                          <MenuItem value="Direct">Direct</MenuItem>
                        </Select>
                        {errors.buyFrom && <div style={errorMessageStyle}>{errors.buyFrom}</div>}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1">Buying House Location</Typography>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          disabled={!showBuyingHouse}
                          value={showBuyingHouse ? formValues.buyingHouse : 'Direct'}
                          onChange={handleChange('buyingHouse')}
                          fullWidth
                        >
                          {!showBuyingHouse && (
                            <MenuItem value="Direct">
                              <em>Direct</em>
                            </MenuItem>
                          )}
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          {buyingHouseData.map((house) => (
                            <MenuItem key={house.id} value={house.id}>
                              {house.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.buyingHouse && <div style={errorMessageStyle}>{errors.buyingHouse}</div>}
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body1">OPR Date</Typography>
                        <TextField
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={formValues.date || ''}
                          disabled
                        />
                        {errors.date && <div style={errorMessageStyle}>{errors.date}</div>}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          {/* Request Details Section */}
          <Table>
            {renderTableHeader('requestDetails', 'Request Details')}
            {showTableHeading.requestDetails && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Request By Department<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.requestByDepartment || ''}
                          onChange={handleChange('requestByDepartment')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {reqByDept.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.requestByDepartment && <div style={errorMessageStyle}>{errors.requestByDepartment}</div>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Requested By<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.requestedBy || ''}
                          onChange={handleChange('requestedBy')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {users.map((dept) => (
                            <MenuItem key={dept.label} value={dept.label}>
                              {dept.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.requestedBy && <div style={errorMessageStyle}>{errors.requestedBy}</div>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Quotations Email Alert<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          type="number"
                          name="quotationsEmailAlert"
                          variant="outlined"
                          fullWidth
                          value={formValues.quotationsEmailAlert}
                          onChange={handleChange('quotationsEmailAlert')}
                        />
                        {errors.quotationsEmailAlert && <div style={errorMessageStyle}>{errors.quotationsEmailAlert}</div>}
                      </Grid>

                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Procurement Indent<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button fullWidth component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                          {fileArray.length > 0
                            ? `${fileArray.length} ${fileArray.length === 1 ? 'File' : 'Files'} uploaded`
                            : 'Upload File'}
                          <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                        </Button>
                        {errors.procurementDocument && <div style={errorMessageStyle}>{errors.procurementDocument}</div>}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          {/* Shipment Details Section */}
          <Table>
            {renderTableHeader('otherDetails', 'Shipment Details')}
            {showTableHeading.otherDetails && (
              <TableBody>
                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                  <TableCell colSpan={6}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Shipment Type<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.shipmentType || ''}
                          onChange={handleChange('shipmentType')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {shipmentType.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.shipmentType && <div style={errorMessageStyle}>{errors.shipmentType}</div>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Shipment Mode<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={formValues.shipmentMode || ''}
                          onChange={handleChange('shipmentMode')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {shipmentMode.map((mode) => (
                            <MenuItem key={mode.id} value={mode.id}>
                              {mode.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.shipmentMode && <div style={errorMessageStyle}>{errors.shipmentMode}</div>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          Delivery Time<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          type="number"
                          variant="outlined"
                          fullWidth
                          value={formValues.deliveryTimeline}
                          onChange={handleChange('deliveryTimeline')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
                          }}
                        />
                        {errors.deliveryTime && <div style={errorMessageStyle}>{errors.deliveryTime}</div>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">
                          OPR Category<ValidationStar>*</ValidationStar>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Select
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          value={Number(formValues.oprDescription)}
                          onChange={handleChange('oprDescription')}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {categories &&
                            categories?.map((item, index) => (
                              <MenuItem key={index} value={item?.item_super_group_id}>
                                {item?.item_super_group_name}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.category && <div style={errorMessageStyle}>{errors.category}</div>}
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="body1">Additional Remark</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '6px'
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000'
                            }
                          }}
                          variant="outlined"
                          fullWidth
                          value={formValues.additionalRemark || ''}
                          onChange={handleChange('additionalRemark')}
                        />
                        {errors.additionalRemark && <div style={errorMessageStyle}>{errors.additionalRemark}</div>}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Button variant="contained" size="small" color="primary" type="submit" style={{ marginLeft: 'auto', display: 'block' }}>
            Update
          </Button>
        </TableContainer>
      </form>
      <Table style={{ width: '100%' }}>
        {renderTableHeader('EditDocDetails', 'Documents Details')}
        {showTableHeading.EditDocDetails && <EditDocOrp oprIdNew={oprIdNew} />}
      </Table>
      <Table style={{ width: '100%' }}>
        {renderTableHeader('OprItemsDetails', 'Opr Items Details')}
        {showTableHeading.OprItemsDetails && <OprItems oprIdNew={oprIdNew} oprData={oprData} />}
      </Table>
    </MainCard>
  );
};

export default EditOrp;

const EditDocOrp = ({ oprIdNew }) => {
  const dispatch = useDispatch();
  const [oprDocData, setOprDocData] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For the delete confirmation dialog
  const [documentToDelete, setDocumentToDelete] = useState(null); // Store the document to delete

  useEffect(() => {
    getStockItem();
  }, []);

  const getStockItem = async () => {
    try {
      const response = await axiosInstance.get(`/api/opr/opr/docs?opr_id=${oprIdNew}`);
      console.log(response.data);
      const data = response.data.map((item, index) => ({
        id: index + 1,
        Doc_name: item?.doc_name,
        doc_base64: item?.doc_base64,
        document_id: item?.document_id
      }));
      setOprDocData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const columnDocDefs = [
    { headerName: 'S.NO', field: 'id', width: 50 },
    { headerName: 'Doc Name', field: 'Doc_name', width: 200 },
    {
      headerName: 'View',
      field: 'view',
      renderCell: (params) => (
        <RemoveRedEyeIcon
          onClick={() => {
            handleDocView(params.row);
          }}
          style={{ color: 'grey' }}
        />
      ),
      width: 80
    },
    {
      headerName: 'Delete',
      field: 'delete',
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            handleDocDelete(params.row);
          }}
          style={{ color: 'red' }}
        />
      ),
      width: 80
    }
  ];

  const handleDocView = async (data) => {
    console.log('Viewing document:', data.doc_base64);
    dispatch(messageOpen({ type: 'base64', url: data?.doc_base64 }));
  };

  // Step 1: Open the delete confirmation dialog
  const handleDocDelete = (data) => {
    setDocumentToDelete(data); // Store the document to be deleted
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  // Step 2: Proceed with the deletion when confirmed
  const confirmDelete = async () => {
    try {
      if (documentToDelete) {
        const response = await axiosInstance.delete(`/api/document?document_id=${documentToDelete.document_id}`);
        if (response.status === 204) {
          toast.success('Delete Successfully');
          getStockItem(); // Refresh the document list
        } else {
          toast.error('Failed to delete document');
        }
      }
      setOpenDeleteDialog(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('An error occurred while deleting the document');
      setOpenDeleteDialog(false); // Close the dialog in case of an error
    }
  };

  // Step 3: Close the dialog without doing anything (onCancel)
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ width: '40%' }}>
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
        rows={oprDocData}
        columns={columnDocDefs}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
      />
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this document?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const OprItems = ({ oprIdNew, oprData }) => {
  console.log('oprData', oprData);

  const getAddresses = async () => {
    console.log('getAddresses', oprData?.company_id);
    const { data } = await axiosInstance.get(`/api/address/bycompanyid?entity_id=${oprData?.company_id}`);
    const mappedData = data?.map((item, index) => ({
      key: index + 1,
      addressLine1: item.address_line1,
      addressLine2: item.address_line2,
      addressType: item.address_type,
      entityType: item.entity_type,
      postalCode: item.postal_code,
      name: item.city,
      state: item.state,
      id: item.address_id
    }));
    setCompaniesList(mappedData);
    console.log('getAddresses', mappedData);
    const stockItemsData = await getStockitems(oprData?.item_category_id);
    console.log('stockItemsData', stockItemsData);
    setItemsData(stockItemsData);
  };

  const [oprItemsData, setOprItemsData] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [oprItemId, setOprItemId] = useState('');

  useEffect(() => {
    getStockItem();
  }, []);

  useEffect(() => {
    getAddresses();
  }, [oprData]);

  const getStockItem = async () => {
    try {
      const response = await axiosInstance.get(`/api/opr/items?opr_id=${oprIdNew}`);
      console.log('response', response.data);
      const result = response?.data?.map((item, index) => ({
        id: index + 1,
        opr_item_id: item?.opr_item_id,
        item_id: item?.item_id,
        address_id: item?.address_id,
        item_series: item?.item_series,
        item_name: item?.ItemsMaster?.item_name,
        qty: item?.qty,
        opr_item_remarks: item?.item_description,
        item_code: item?.ItemsMaster?.item_code,
        quantity_in_stock: item?.quantity_in_stock,
        quantity_on_order: item?.quantity_on_order,
        monthly_consumption: item?.monthly_consumption,
        item_description: item?.item_description,
        group_name: item?.group_name,
        sub_group: item?.ItemsMaster?.sub_group,
        item_type: item?.ItemsMaster?.item_type,
        hs_code: item?.ItemsMaster?.hsn_code,
        nafdac_name: item?.ItemsMaster?.nafdac_name,
        cria: item?.ItemsMaster?.cria,
        nafdac_category: item?.nafdac_category,
        factory: item?.factory,
        hsn_code: item?.hsn_code,
        tolerance: item?.tolerance,
        vendors: item?.vendors,
        lead_time: item?.lead_time,
        reorder_level: item?.reorder_level,
        unit_price: item?.unit_price,
        msrp: item?.msrp,
        is_discontinued: item?.is_discontinued,
        item_img: item?.item_img,
        item_img_name: item?.item_img_name,
        notes: item?.notes,
        uom_id: item?.uom_name,
        created_by: item?.created_by,
        stock_in_hand: item?.stock_in_hand,
        stock_in_transit: item?.stock_in_transit
      }));
      console.log('result', result);
      setOprItemsData(result);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const handleOprItemEdit = async (data) => {
    console.log('data', data);
    console.log('data', data.opr_item_id);
    setFormValues({
      address_id: data?.address_id,
      stockItem: data?.item_id,
      qty: data?.qty,
      stockItemCode: data?.item_code,
      stock_in_transit: data?.stock_in_transit,
      uom: data?.uom_id,
      stock_in_hand: data?.stock_in_hand,
      monthly_consumption: data?.monthly_consumption,
      item_description: data?.opr_item_remarks
    });
    const Uom = await getUomByStockitemsId(itemsData.find((item) => item.id === data?.item_id).uom);
    setUomData(Uom);
    setOprItemId(data.opr_item_id);
  };

  const columnItemsDefs = [
    { headerName: 'S.No', field: 'id', width: 60 },
    {
      headerName: 'Edit',
      field: 'edit',
      renderCell: (params) => (
        <EditIcon
          onClick={() => {
            handleOprItemEdit(params.row);
          }}
          style={{ color: 'grey' }}
        />
      ),
      width: 60
    },
    {
      headerName: 'Delete',
      field: 'delete',
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            handleOprItemDelete(params.row);
          }}
          style={{ color: 'red' }}
        />
      ),
      width: 60
    },
    { headerName: 'Category', field: 'item_type', width: 100 },
    { headerName: 'Sub Category', field: 'sub_group', width: 100 },
    { headerName: 'Stock Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 150 },
    { headerName: 'HSN Code', field: 'hs_code', width: 100 },
    {
      headerName: 'NAFDAC Req.',
      field: 'nafdac_name',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'NAFDAC Avl.',
      field: 'nafdac_available',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'CRIA Req.',
      field: 'cria',
      width: 150,
      renderCell: (params) => <span>{params.row.nafdacRequired === 'true' ? 'Applicable if goods Coming from India or China' : 'No'}</span>
    },
    { headerName: 'OPR Qty', field: 'qty', width: 100 },
    { headerName: 'UOM', field: 'uom_id', width: 80 },
    { headerName: 'Stock In Transit', field: 'stock_in_transit', width: 120 },
    { headerName: 'Stock In Hand', field: 'stock_in_hand', width: 120 },
    { headerName: 'Monthly Consumption', field: 'monthly_consumption', width: 150 },
    { headerName: 'Remarks', field: 'item_description', width: 150 }
  ];

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    requestDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For the delete confirmation dialog
  const [documentToDelete, setDocumentToDelete] = useState(null); // Store the document to delete

  // Step 1: Open the delete confirmation dialog
  const handleOprItemDelete = (data) => {
    setDocumentToDelete(data); // Store the document to be deleted
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  // Step 2: Proceed with the deletion when confirmed
  const confirmDelete = async () => {
    try {
      if (documentToDelete) {
        const response = await axiosInstance.delete(`/api/opr/draftitem?opr_item_id=${documentToDelete?.opr_item_id}`);
        if (response.status === 204) {
          toast.success('Delete Successfully');
          getStockItem(); // Refresh the document list
        } else {
          toast.error('Failed to delete document');
        }
      }
      setOpenDeleteDialog(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('An error occurred while deleting the document');
      setOpenDeleteDialog(false); // Close the dialog in case of an error
    }
  };

  // Step 3: Close the dialog without doing anything (onCancel)
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
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

  const [formValues, setFormValues] = useState({
    address_id: '',
    stockItem: '',
    qty: '',
    stockItemCode: '',
    stock_in_transit: '',
    uom: '',
    stock_in_hand: '',
    monthly_consumption: '',
    item_description: ''
  });
  const [errors, setErrors] = useState({});
  const [itemsData, setItemsData] = useState([]);
  const [uomData, setUomData] = useState([]);

  const handleChange = (name) => async (event) => {
    console.log('event.target.value', event.target.value);
    console.log('name', name);
    setFormValues({ ...formValues, [name]: event.target.value });
    if (name == 'stockItem') {
      const itemCode = itemsData.find((item) => item.id === event.target.value);
      const Uom = await getUomByStockitemsId(itemsData.find((item) => item.id === event.target.value).uom);
      setUomData(Uom);
      setFormValues({ ...formValues, stockItemCode: itemCode.itemCode, stockItem: event.target.value });
    }
  };

  const resetForm = async (event) => {
    event.preventDefault();
    setFormValues({
      address_id: '',
      stockItem: '',
      qty: '',
      stockItemCode: '',
      stock_in_transit: '',
      uom: '',
      stock_in_hand: '',
      monthly_consumption: '',
      item_description: ''
    });
    setOprItemId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('formValues', formValues);
    const postData =
      oprItemId === ''
        ? {
            opr_id: oprIdNew,
            address_id: formValues?.address_id,
            company_id: oprData?.company_id,
            item_id: formValues?.stockItem,
            uom_name: formValues?.uom,
            qty: formValues?.qty,
            stock_in_transit: formValues?.stock_in_transit,
            stock_in_hand: formValues?.stock_in_hand,
            monthly_consumption: formValues?.monthly_consumption,
            item_description: formValues?.item_description
          }
        : {
            opr_item_id: oprItemId,
            opr_id: oprIdNew,
            address_id: formValues?.address_id,
            company_id: oprData?.company_id,
            item_id: formValues?.stockItem,
            uom_name: formValues?.uom,
            qty: formValues?.qty,
            stock_in_transit: formValues?.stock_in_transit,
            stock_in_hand: formValues?.stock_in_hand,
            monthly_consumption: formValues?.monthly_consumption,
            item_description: formValues?.item_description
          };

    try {
      const response = await axiosInstance.post(`/api/opr/item`, postData);
      if (response.status === 201) {
        toast.success(oprItemId === '' ? 'Item Added Successfully' : 'Item Updated Successfully');
        resetForm();
        getStockItem();
      } else {
        toast.error('Failed to Add Item');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('An error occurred. Please try again later.');
    }
    console.log('postData', postData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Table>
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Select Factory<ValidationStar>*</ValidationStar>
                    </Typography>
                    <Select
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                      value={Number(formValues.address_id) || ''}
                      onChange={handleChange('address_id')}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>select</em>
                      </MenuItem>
                      {companiesList.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.address_id && <div style={errorMessageStyle}>{errors.address_id}</div>}
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Stock Item<ValidationStar>*</ValidationStar>
                    </Typography>
                    <Select
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                      value={Number(formValues.stockItem) || ''}
                      onChange={handleChange('stockItem')}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>select</em>
                      </MenuItem>
                      {itemsData.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.stockItem && <div style={errorMessageStyle}>{errors.stockItem}</div>}
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Stock Item Code<ValidationStar>*</ValidationStar>
                    </Typography>
                    <TextField
                      disabled
                      value={formValues.stockItemCode || ''}
                      onChange={handleChange('stockItemCode')}
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    ></TextField>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      OPR Quantity<ValidationStar>*</ValidationStar>
                    </Typography>
                    <TextField
                      id="qty"
                      name="qty"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.qty || ''}
                      onChange={handleChange('qty')}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                    {/* <Select value={formValues.qty || ''} onChange={handleChange('qty')} fullWidth>
                   
                    </Select> */}
                    {errors.qty && <div style={errorMessageStyle}>{errors.qty}</div>}
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Unit Of Measurement<ValidationStar>*</ValidationStar>
                    </Typography>
                    <Select
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                      value={formValues.uom || ''}
                      onChange={handleChange('uom')}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>select</em>
                      </MenuItem>
                      {uomData?.map((data) => (
                        <MenuItem key={data.key} value={data.name} selected={uomData.length === 1 ? true : false}>
                          {uomData.length === 1 ? <em>{data.name}</em> : data.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.uom && <div style={errorMessageStyle}>{errors.uom}</div>}
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Stock In Transit<ValidationStar>*</ValidationStar>
                    </Typography>
                    <TextField
                      id="stock_in_transit"
                      name="stock_in_transit"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.stock_in_transit || ''}
                      onChange={handleChange('stock_in_transit')}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                    {errors.stock_in_transit && <div style={errorMessageStyle}>{errors.stock_in_transit}</div>}
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Stock In Hand<ValidationStar>*</ValidationStar>
                    </Typography>
                    <TextField
                      id="stock_in_hand"
                      name="stock_in_hand"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.stock_in_hand || ''}
                      onChange={handleChange('stock_in_hand')}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                    {errors.stock_in_hand && <div style={errorMessageStyle}>{errors.stock_in_hand}</div>}
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Monthly Consumption<ValidationStar>*</ValidationStar>
                    </Typography>
                    <TextField
                      id="monthly_consumption"
                      name="monthly_consumption"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.monthly_consumption || ''}
                      onChange={handleChange('monthly_consumption')}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                    {errors.monthly_consumption && <div style={errorMessageStyle}>{errors.monthly_consumption}</div>}
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      Remarks<ValidationStar>*</ValidationStar>
                    </Typography>
                    <TextField
                      id="item_description"
                      name="item_description"
                      variant="outlined"
                      fullWidth
                      type="text"
                      value={formValues.item_description || ''}
                      onChange={handleChange('item_description')}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '6px'
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000'
                        }
                      }}
                    />
                    {errors.item_description && <div style={errorMessageStyle}>{errors.item_description}</div>}
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!oprItemId == '' && (
            <Button variant="outlined" size="small" color="primary" onClick={resetForm} style={{ marginLeft: 'auto', display: 'block' }}>
              Reset
            </Button>
          )}
          <Button variant="contained" size="small" color="primary" type="submit" style={{ marginLeft: 'auto', display: 'block' }}>
            {oprItemId === '' ? 'Submit' : 'Update'}
          </Button>
        </Box>
      </form>
      <Box sx={{ width: '100%' }}>
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
          rows={oprItemsData}
          columns={columnItemsDefs}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // hideFooter
          // hideFooterPagination
          // hideFooterSelectedRowCount
        />
        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this Item?</DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};
