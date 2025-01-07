import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  MenuItem,
  Box,
  IconButton,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  InputAdornment,
  DialogContentText,
  TextField
} from '@mui/material';
import axios from 'axios';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { BASE_URL } from 'AppConstants';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import {
  getLoadDivisions,
  getShipmentType,
  getShipmentMode,
  getReqByDepartment,
  getVertical,
  getBuyingHouse,
  getStockitems,
  getUomByStockitemsId
} from '../../allapi/getAllAPIS';
import { toast } from 'react-toastify';
import FieldPadding from 'components/FieldPadding';
import { useDispatch, useSelector } from 'react-redux';
import ValidationStar from 'components/ValidationStar';
import { axiosInstance } from '../../utils/axiosInstance';
import { YesButton } from 'components/DialogActionsButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { errorMessageStyle } from 'components/StyleComponent';
import { getCurrentDate } from '../../utils/constantFunctions';
import SelectFieldPadding from 'components/selectFieldPadding';
import { GetSupperCategoriesTypes } from 'Redux/Apis/GetApiCalls';

const OPRForm = ({ onSuccessfulSubmit, onEditClick }) => {
  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.opr);
  const [comment, setComment] = useState();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [monthlyConsumptionDialog, setMonthlyConsumptionDialog] = useState(false);
  const [showTableBodies, setShowTableBodies] = useState({
    createOPR: true,
    itemsDetail: true,
    itemsTable: true,
    viewOprDetail: false,
    basicInfo: true,
    requestDetails: true,
    shipmentDetail: true
  });
  const initialStockItemValues = {
    stockItems: [
      {
        stockItem: '',
        qty: '',
        stockItemCode: '',
        stock_in_transit: '',
        uom: '',
        stock_in_hand: '',
        monthly_consumption: '',
        item_description: ''
      }
    ]
  };
  const [divisions, setDivisions] = useState([]);
  // const [deliveryTime, setDeliveryTime] = useState([]);
  const [shipmentMode, setShipmentMode] = useState([]);
  const [shipmentType, setShipmentType] = useState([]);
  const [reqByDept, setReqByDept] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const [verticalData, setVerticalData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [companyObject, setCompanyObject] = useState({});
  const [buyingHouseData, setBuyingHouseData] = useState([]);
  const [showBuyingHouse, setShowBuyingHouse] = useState(false);
  const [oprId, setOprId] = useState(null);
  const [oprNum, setOprNum] = useState(null);
  const [oprData, setOprData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [companyId, setCompanyId] = useState(0);
  const [formMode, setFormMode] = useState('create');
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [fileArray, setFileArray] = useState([]);
  const [initialValues, setInitialValues] = useState({
    vertical: '',
    company: '',
    division: '',
    buyFrom: '',
    buyingHouse: '',
    requestByDepartment: '',
    requestedBy: '',
    quotationsEmailAlert: '',
    shipmentMode: '',
    shipmentType: '',
    deliveryTimeline: '',
    date: getCurrentDate(),
    oprDescription: '',
    additionalRemark: '',
    potentialSuppliers: ''
  });

  const handleFileChangeFile = (e) => {
    const files = e.target.files;
    setFileArray(files);
  };

  const getusers = async () => {
    const { data } = await axiosInstance.get('/api/user/users');
    const mappedData = data.map((item, index) => ({
      key: index + 1,
      label: item.first_name,
      id: item.user_id
    }));
    setUsers(mappedData);
  };
  console.log('category data', categories);
  useEffect(() => {
    getusers();
    GetSupperCategoriesTypes(dispatch);
    const fetchData = async () => {
      try {
        const divisionData = await getLoadDivisions();
        setDivisions(divisionData);

        // const deliveryTimeData = await getDeliveryTime();
        // setDeliveryTime(deliveryTimeData);

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

  useEffect(() => {
    if (formMode === 'edit' && oprId) {
      fetchOPREditData(oprId).then(setInitialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMode, oprId]);

  const validationSchema = Yup.object().shape({
    vertical: Yup.string().required('Field is required'),
    company: Yup.string().required('Field is required'),
    division: Yup.string().required('Field is required'),
    buyFrom: Yup.string().required('Field is required'),
    // buyingHouse: Yup.string().required('Fieldis required'),
    requestByDepartment: Yup.string().required('Field is required'),
    requestedBy: Yup.string().required('Field is required'),
    quotationsEmailAlert: Yup.string().required('Field is required'),
    shipmentMode: Yup.string().required('Field is required'),
    shipmentType: Yup.string().required('Field is required'),
    deliveryTimeline: Yup.string().required('Field is required'),
    date: Yup.date().required('Field is required')
    // oprDescription: Yup.string().required('OPR Description is required'),
    // additionalRemark: Yup.string().required('Additional Remark is required'),
    // potentialSuppliers: Yup.string().required('Potential Suppliers is required')
  });

  const validationSchemaItems = Yup.object().shape({
    stockItems: Yup.array().of(
      Yup.object().shape({
        stockItem: Yup.string().required('Stock Item is required'),
        qty: Yup.number().required('OPR Quantity is required'),
        stock_in_transit: Yup.number().required('Stock In Transit is required'),
        stock_in_hand: Yup.number().required('Stock In Hand is required'),
        monthly_consumption: Yup.number().required('Monthly Consumption is required')
      })
    )
  });
  // item_description: Yup.string().required('Remarks is required')

  const handleBuyFromChange = (event, setFieldValue) => {
    const value = event.target.value;
    setFieldValue('buyFrom', value);
    setShowBuyingHouse(value === 'Buying House');
  };
  // Toggle function to switch the visibility of a specific table body
  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  // Function to render table headers with toggle icons
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <Box>
              {sectionName === 'viewOprDetail' && (
                <IconButton
                  size="large"
                  onClick={() => {
                    handleOPREdit(oprId);
                    if (onEditClick) {
                      onEditClick();
                    }
                  }}
                >
                  <EditOutlinedIcon />
                </IconButton>
              )}
              <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
                {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
              </IconButton>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const ActionCellRenderer = (props) => {
    const handleDelete = async () => {
      const { data, deleteItem } = props;
      try {
        await axiosInstance.delete(`/api/opr/draftitem?opr_item_id=${data.opr_item_id}`);
        deleteItem(data.id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };
    const handleEdit = async () => {
      const { data, editItem } = props;
      try {
        await axiosInstance.put(`/api/opr/draftitem?opr_item_id=${data.opr_item_id}`);
        editItem(data.id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };

    return (
      <>
        <IconButton onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={handleEdit} color="error">
          <EditIcon />
        </IconButton>
      </>
    );
  };

  const columns = [
    { field: 'id', headerName: 'Sr. No.', width: 50 },
    { field: 'item_type', headerName: 'Category', width: 100 },
    { field: 'city', headerName: 'Factory', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },
    { field: 'nafdacAvailable', headerName: 'SON Req.', width: 100 },
    { field: 'nafdacRequired', headerName: 'NAFDAC Req.', width: 100 },
    // { field: 'nafdacAvailable', headerName: 'NAFDAC Available', width: 150 },
    { field: 'criaRequired', headerName: 'CRIA Required', width: 150 },
    { field: 'uom', headerName: 'UOM', width: 100 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    { field: 'stock_in_transit', headerName: 'Stock In Transit', width: 100 },
    { field: 'stock_in_hand', headerName: 'Stock In Hand', width: 100 },
    { field: 'monthly_consumption', headerName: 'Monthly Consumption', width: 120 },
    { field: 'item_description', headerName: 'Remarks', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: (params) => <ActionCellRenderer {...params} deleteItem={params.context.deleteItem} />,
      width: 100
    }
  ];
  const fetchOPREditData = async (id) => {
    try {
      const response = await axiosInstance.get(`api/opr/oprs?opr_id=${id}`);
      const data = response.data[0]; // Assuming response.data contains the data
      const mappedData = {
        vertical: data.vertical_id,
        company: data.company_id,
        division: data.division_id,
        buyFrom: data.buy_from,
        buyingHouse: data.buy_house,
        requestByDepartment: data.department_id,
        requestedBy: data.requested_by,
        quotationsEmailAlert: data.no_quot_email_alert,
        shipmentMode: data.shipment_mode_id,
        shipmentType: data.shipment_type_id,
        deliveryTimeline: data.delivery_timeline_id,
        date: data.opr_date,
        oprDescription: data.opr_description,
        additionalRemark: data.remarks,
        potentialSuppliers: data.suppliers
      };
      setInitialValues(mappedData);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
    }
  };
  const getAddresses = async (id) => {
    const { data } = await axiosInstance.get(`/api/address/bycompanyid?entity_id=${id}`);
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
  };
  const handleOPREdit = (id) => {
    setOprId(id);
    setFormMode('edit');
    setShowTableBodies((prevState) => ({
      ...prevState,
      createOPR: true,
      viewOprDetail: false
    }));
    fetchOPREditData(id);
  };
  const getOprDraftData = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/opr/oprs?id=${id}`);
      const mappedData = response.data.map((item) => ({
        opr_id: item.opr_id,
        buy_from: item.buy_from,
        buy_house: item.buy_house,
        opr_date: item.opr_date,
        requested_by: item.requested_by,
        remarks: item.remarks,
        opr_description: item.item_super_group_master.item_super_group_name,
        no_quot_email_alert: item.no_quot_email_alert,
        opr_num: item.opr_num,
        shipment_type_name: item.shipment_type_master.shipment_type_name,
        status: item.status,
        created_on: item.created_on,
        created_by: item.created_by,
        vertical_name: item.vertical_name,
        company_name: item.companyMaster.company_name,
        division_name: item.division_name,
        buying_house_name: item.buying_house_name,
        shipment_mode_name: item.shipment_mode_name,
        department_name: item.dept_name,
        d_timeline_name: item.delivery_timeline_id
      }));
      setOprData(mappedData);
      setOprId(id);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
    }
  };
  const handleVerticalChange = async (event, setFieldValue) => {
    const selectedVerticalId = event.target.value;
    setFieldValue('vertical', selectedVerticalId);

    try {
      const response = await axiosInstance.get(`/api/company/v1/byvertical?vertical_id=${selectedVerticalId}`);
      const formattedCompanyData = response.data.map((item) => ({
        code: item.company_code,
        companyId: item.company_id,
        name: item.company_name,
        address: `${item.AddressMasters[0].city}, ${item.AddressMasters[0].state}, ${item.AddressMasters[0].country}`
      }));
      console.log('formattedCompanyData', response.data);
      setCompanyData(formattedCompanyData);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const sendApprovalRequest = async (opr) => {
    try {
      const { data } = await axiosInstance.post('/api/approval/logs', {
        doc_type: 'OPR',
        doc_id: opr.id,
        doc_number: opr.num,
        employee_id: 1,
        action: 'Accept',
        comments: comment,
        from_level: 0
      });
      toast.success(data?.message || 'Sent for approval');
      setComment();
    } catch (error) {
      toast.error(error.message);
      setComment();
    }
  };

  const handleOPRSubmit = async (formValues, { resetForm }) => {
    getAddresses(formValues.company);
    const stockItemsData = await getStockitems(formValues.oprDescription);
    setItemsData(stockItemsData);
    try {
      const postData = {
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
      setCompanyId(formValues.company);
      const response = await axiosInstance.post(`api/opr/opr`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setOprId(response.data.opr_id);
      setOprNum(response.data.opr_num);
      getOprDraftData(response.data.opr_id);
      setShowTableBodies((prevState) => ({
        ...prevState,
        createOPR: false,
        viewOprDetail: true
      }));
      resetForm();
      await GetOpr(dispatch, response.data.opr_id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOPRUpdate = async (values) => {
    try {
      const putData = {
        opr_id: oprId,
        vertical: values.vertical,
        company_name: values.company,
        opr_date: new Date().toISOString(),
        division_id: values.division,
        buy_from: values.buyFrom,
        buy_house: values.buyingHouse,
        shipment_mode_id: values.shipmentMode,
        shipment_type_id: values.shipmentType,
        delivery_timeline_id: values.deliveryTimeline,
        department_id: values.requestByDepartment,
        requested_by: values.requestedBy,
        quotations: values.quotationsEmailAlert,
        opr_des: values.oprDescription,
        remarks: values.additionalRemark
      };
      const response = await axios.post(`${BASE_URL}/opr/${oprId}`, putData);
      getOprDraftData(response.data.opr_id);
      setShowTableBodies((prevState) => ({
        ...prevState,
        viewOprDetail: true,
        createOPR: false
      }));
    } catch (error) {
      console.error('Error updating OPR:', error);
    }
  };
  const handleSubmitStockItems = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log('stockItems', values.stockItems);
      // Iterate over each stock item and post data
      for (let item of values.stockItems) {
        const postData = {
          opr_id: oprId,
          address_id: companyObject[0]?.id,
          company_id: companyId,
          item_id: item.stockItem,
          uom_name: item.uom,
          qty: item.qty,
          stock_in_transit: item.stock_in_transit,
          stock_in_hand: item.stock_in_hand,
          monthly_consumption: item.monthly_consumption,
          item_description: item.item_description
        };
        // Example POST request using axios
        const response = await axiosInstance.post(`/api/opr/item`, postData);
      }
      getStockItems(oprId);
      // After successful submission
      resetForm(); // Reset form after submission
    } catch (error) {
      console.error('Error submitting OPR:', error);
    } finally {
      setSubmitting(false); // Ensure form is not stuck in submitting state
    }
  };
  const getStockItems = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/opr/items?opr_id=${id}`);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        opr_item_id: item.opr_item_id,
        opr_id: item.opr_id,
        quantity: item.qty,
        stock_in_transit: item.stock_in_transit,
        stock_in_hand: item.stock_in_hand,
        monthly_consumption: item.monthly_consumption,
        item_description: item.item_description,
        status: item.status,
        item_type: item.ItemsMaster?.item_super_group_master?.item_super_group_name,
        item_code: item.ItemsMaster.item_code,
        item_name: item.ItemsMaster.item_name,
        criaRequired: item.ItemsMaster.nafdacRequired ? 'Applicable if coming from India/China' : 'No',
        nafdacAvailable: item.ItemsMaster.nafdacAvailable ? 'Yes' : 'No',
        nafdacRequired: item.ItemsMaster.nafdacRequired ? 'Yes' : 'No',
        quantity_in_stock: item.ItemsMaster.quantity_in_stock,
        quantity_on_order: item.ItemsMaster.quantity_on_order,
        nafdac_category: item.ItemsMaster.nafdac_category,
        sub_group: null,
        uom: item?.uom_name,
        hsn_code: item?.ItemsMaster?.hsn_code,
        cria: item?.ItemsMaster?.cria,
        son: null,
        opo_qty: null,
        short_close_qty: null,
        city: item?.AddressMaster?.city
      }));
      setStockData(mappedData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  };
  const handleConfirmItems = async () => {
    setOpenDialog(true);
  };

  const handleConfirmDialogClose = async (confirmed) => {
    setOpenDialog(false);
    if (confirmed) {
      try {
        await axiosInstance.post(`/api/opr/confirm/${oprId}`);
        await GetOpr(dispatch);
        sendApprovalRequest({ id: oprId, num: oprNum });
        if (onSuccessfulSubmit) {
          onSuccessfulSubmit();
        }
      } catch (error) {
        console.error('Error confirming OPR items:', error);
        // Handle error scenario if needed
      }
    }
  };
  const handleStockItem = async (event, setFieldValue, index) => {
    const selectedId = event.target.value;
    console.log(itemsData.find((item) => item.id === event.target.value));
    const selectedItem = itemsData.find((item) => item.id === selectedId);
    const Uom = await getUomByStockitemsId(itemsData.find((item) => item.id === event.target.value).uom);
    setUomData(Uom);
    setFieldValue(`stockItems.${index}.stockItem`, selectedId);
    setFieldValue(`stockItems.${index}.stockItemCode`, selectedId);
  };

  return (
    <>
      {/* ......................................OPR View  ........................... */}
      {showTableBodies.viewOprDetail && (
        <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
          <Table>
            {renderTableHeader('viewOprDetail', 'View OPR Detail')}

            {showTableBodies.viewOprDetail && oprData.length > 0 && (
              <TableBody>
                {oprData.map((oprViewData, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Vertical:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.vertical_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Company:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.company_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Division:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.buying_house_name}</Typography>
                      </TableCell>
                      {/* <IconButton size="large" onClick={() => handleEdit(sectionName)}>
                        <EditOutlinedIcon />
                      </IconButton> */}
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Buying From:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.buy_from}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Buying House Location:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.buying_house_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Department:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.department_name}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Request By Department:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.department_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Requested By:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.requested_by}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Quotations Email Alert:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.no_quot_email_alert}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Shipment Mode:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.shipment_mode_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Delivery Timeline(In Weeks):
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.d_timeline_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Shipment Type:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.shipment_type_name}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          OPR Category:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.opr_description}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Additional Remark:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.remarks}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Date:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData?.opr_date?.split('T')[0]}</Typography>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={formMode === 'create' ? handleOPRSubmit : handleOPRUpdate}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            {showTableBodies.createOPR && (
              <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Table>
                      {/* Basic Info Section */}
                      {/* {renderTableHeader('basicInfo', 'Basic Info')} */}
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Basic Info
                      </Typography>

                      {showTableBodies.basicInfo && (
                        <TableBody>
                          <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                            <TableCell colSpan={6}>
                              <Grid container spacing={2} alignItems="center">
                                {/* <Grid item xs={12} sm={1}></Grid> */}
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body2">
                                    OPR Date<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field as={FieldPadding} type="date" name="date" variant="outlined" fullWidth size="small" disabled />
                                  <ErrorMessage name="date" component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body2">
                                    Vertical<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field
                                    as={SelectFieldPadding}
                                    name="vertical"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => handleVerticalChange(e, setFieldValue)}
                                    value={values.vertical}
                                  >
                                    <MenuItem value="">
                                      <em>select</em>
                                    </MenuItem>
                                    {verticalData.map((data) => (
                                      <MenuItem key={data.id} value={data.id}>
                                        {data.name}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="vertical" component="div" style={errorMessageStyle} />

                                  {/* <ErrorMessage name="vertical" component="div" style={errorMessageStyle} /> */}
                                </Grid>
                                {/* <Grid item xs={12} sm={1}>
                            </Grid> */}
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body2">
                                    Company<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field as={SelectFieldPadding} name="company" variant="outlined" value={values.company} fullWidth>
                                    <MenuItem value="">
                                      <em>select</em>
                                    </MenuItem>
                                    {companyData.map((company) => (
                                      <MenuItem key={company.companyId} value={company.companyId}>
                                        {company.name}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="company" component="div" style={errorMessageStyle} />
                                </Grid>

                                {/* <Grid item xs={12} sm={2}>
                              <Typography variant="body1">
                                Company Country<ValidationStar>*</ValidationStar>
                              </Typography>
                              <Field as={SelectFieldPadding} name="company" variant="outlined" value={values.company} fullWidth>
                                <MenuItem value="">
                                  <em>select</em>
                                </MenuItem>
                                {companyData.map((company) => (
                                  <MenuItem key={company.companyId} value={company.companyId}>
                                    {company.name}
                                  </MenuItem>
                                ))}
                              </Field>
                              <ErrorMessage name="company" component="div" style={errorMessageStyle} />
                            </Grid> */}

                                {/* <Grid item xs={12} sm={1}>
                            </Grid> */}
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body2">
                                    Division<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field as={SelectFieldPadding} name="division" variant="outlined" value={values.division} fullWidth>
                                    <MenuItem value="">
                                      <em>select</em>
                                    </MenuItem>
                                    {divisions.map((division) => (
                                      <MenuItem key={division.id} value={division.id}>
                                        {division.name}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="division" component="div" style={errorMessageStyle} />
                                </Grid>
                                {/* <Grid item xs={12} sm={1}>
                            </Grid> */}
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body2">
                                    Buying From<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field
                                    as={SelectFieldPadding}
                                    name="buyFrom"
                                    variant="outlined"
                                    fullWidth
                                    value={values.buyFrom}
                                    onChange={(e) => handleBuyFromChange(e, setFieldValue)}
                                  >
                                    <MenuItem value="">
                                      <em>select</em>
                                    </MenuItem>
                                    <MenuItem value="Buying House">Buying House</MenuItem>
                                    <MenuItem value="Direct">Direct</MenuItem>
                                  </Field>
                                  <ErrorMessage name="buyFrom" component="div" style={errorMessageStyle} />
                                </Grid>
                                {/* {showBuyingHouse && (
                              <> */}
                                {/* <Grid item xs={12} sm={1}>
                                </Grid> */}
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body2">BH Location</Typography>
                                  <Field
                                    disabled={!showBuyingHouse}
                                    as={SelectFieldPadding}
                                    name="buyingHouse"
                                    variant="outlined"
                                    value={showBuyingHouse ? values.buyingHouse : 'Direct'}
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
                                  </Field>
                                  <ErrorMessage name="buyingHouse" component="div" style={errorMessageStyle} />
                                </Grid>
                                {/* </> */}
                                {/* )} */}
                                {/* <Grid item xs={12} sm={1}>
                            </Grid> */}
                              </Grid>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </Grid>

                  <Grid item xs={6}>
                    <Table>
                      {/* Request Details Section */}
                      {/* {renderTableHeader('requestDetails', 'Request Details')} */}
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Request Details
                      </Typography>
                      {showTableBodies.requestDetails && (
                        <TableBody>
                          <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                            <TableCell colSpan={6}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">
                                      Req Dept<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <Field
                                      as={SelectFieldPadding}
                                      name="requestByDepartment"
                                      variant="outlined"
                                      value={values.requestByDepartment}
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
                                    </Field>
                                    <ErrorMessage name="requestByDepartment" component="div" style={errorMessageStyle} />
                                  </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">
                                      Req By<ValidationStar>*</ValidationStar>
                                    </Typography>

                                    <Autocomplete
                                      options={users}
                                      getOptionLabel={(option) => option.label}
                                      onChange={(event, value) => setFieldValue('requestedBy', value ? value.label : '')}
                                      renderInput={(params) => (
                                        <FieldPadding
                                          {...params}
                                          name="requestedBy"
                                          variant="outlined"
                                          value={values.requestedBy}
                                          fullWidth
                                          size="small"
                                          error={!!values.requestedBy && !users.some((option) => option.label === values.requestedBy)}
                                        />
                                      )}
                                      sx={{
                                        '& .MuiInputBase-root': {
                                          // height: '24px'
                                        }
                                      }}
                                    />
                                    <ErrorMessage name="requestedBy" component="div" style={errorMessageStyle} />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">
                                      Quotations Email Alert<ValidationStar>*</ValidationStar>
                                    </Typography>

                                    <Field
                                      as={FieldPadding}
                                      type="number"
                                      name="quotationsEmailAlert"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                    />
                                    <ErrorMessage name="quotationsEmailAlert" component="div" style={errorMessageStyle} />
                                  </Box>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} sm={12}>
                                <Typography variant="body2">
                                  Procurement Indent<ValidationStar>*</ValidationStar>
                                </Typography>
                                <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: '5px', height: '75px' }}>
                                  <Button
                                    fullWidth
                                    component="label"
                                    sx={{ marginBottom: '0' }}
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                  >
                                    {fileArray?.length > 0
                                      ? `${fileArray?.length} ${fileArray?.length === 1 ? 'File' : 'Files'} uploaded`
                                      : 'Upload File'}
                                    <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChangeFile(e)} />
                                  </Button>
                                </Box>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </Grid>

                  <Grid item xs={6}>
                    <Table>
                      {/* Shipment Details Section */}
                      {/* {renderTableHeader('shipmentDetail', 'Shipment Details')} */}
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Shipment Details
                      </Typography>
                      {showTableBodies.shipmentDetail && (
                        <TableBody>
                          <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                            <TableCell colSpan={6}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="body2">
                                    Shipment Type<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field
                                    as={SelectFieldPadding}
                                    name="shipmentType"
                                    variant="outlined"
                                    value={values.shipmentType}
                                    fullWidth
                                  >
                                    <MenuItem value="">
                                      <em>select</em>
                                    </MenuItem>
                                    {shipmentType.map((mode) => (
                                      <MenuItem key={mode.id} value={mode.id}>
                                        {mode.name}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="shipmentType" component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                  <Typography variant="body2">
                                    Shipment Mode<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field
                                    as={SelectFieldPadding}
                                    name="shipmentMode"
                                    variant="outlined"
                                    value={values.shipmentMode}
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
                                  </Field>
                                  <ErrorMessage name="shipmentMode" component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                  <Typography variant="body2">
                                    Delivery Time<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <Field
                                    as={FieldPadding}
                                    type="number"
                                    name="deliveryTimeline"
                                    variant="outlined"
                                    value={values.deliveryTimeline}
                                    onChange={(e) => setFieldValue('deliveryTimeline', e.target.value)}
                                    fullWidth
                                    InputProps={{
                                      endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
                                    }}
                                  />
                                  <ErrorMessage name="deliveryTimeline" component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                  <Typography variant="body2">OPR Category</Typography>
                                  <Field
                                    as={SelectFieldPadding}
                                    name="oprDescription"
                                    variant="outlined"
                                    value={values.oprDescription}
                                    onChange={async (e) => {
                                      const selectedValue = e.target.value;
                                      setFieldValue('oprDescription', selectedValue);
                                      // Find the selected item based on value
                                      const selectedItem = categories.find((item) => item.item_super_group_id === selectedValue);
                                      // Set the selected name in Formik or state
                                      if (selectedItem) {
                                        setFieldValue('selectedItemName', selectedItem.item_super_group_name);
                                      }
                                      // Fetch stock items if required
                                      const item = await getStockitems(selectedValue);
                                      if (item?.length <= 0) setUpdateDialogOpen(true);
                                    }}
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
                                  </Field>
                                  <ErrorMessage name="oprDescription" component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={8}>
                                  <Typography variant="body2">Additional Remark</Typography>
                                  <Field as={FieldPadding} name="additionalRemark" variant="outlined" fullWidth size="small" />
                                  <ErrorMessage name="additionalRemark" component="div" style={errorMessageStyle} />
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </Grid>

                  <Grid item xs={12}>
                    {showTableBodies.shipmentDetail && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                        {/* <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
                      Cancel
                    </Button> */}
                        <Button variant="contained" size="small" color="primary" type="submit">
                          {formMode === 'create' ? 'Add Items' : 'Update'}
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                <Dialog
                  open={updateDialogOpen}
                  onClose={() => setUpdateDialogOpen(false)}
                  aria-labelledby="update-dialog-title"
                  aria-describedby="update-dialog-description"
                >
                  <DialogTitle
                    id="update-dialog-title"
                    style={{ backgroundColor: '#a1bcdb', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', fontSize: '15px' }}
                  >
                    <span style={{ fontWeight: '600' }}> Confirm Item</span>
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="update-dialog-description" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                      <p>
                        <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} /> No items found against category &nbsp;
                        <span style={{ color: 'black', fontWeight: 'bold' }}>
                          {' '}
                          {values.selectedItemName && <span>{values.selectedItemName}</span>}&nbsp;{' '}
                        </span>{' '}
                        Please add items to continue
                      </p>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    {/* <NoButton onClick={() => setUpdateDialogOpen(false)}>
                      <span>No</span>
                    </NoButton> */}
                    <YesButton
                      // onClick={() => handleUpdateConfirm(values, resetForm)}
                      onClick={() => setUpdateDialogOpen(false)}
                    >
                      <span>Continue</span>
                    </YesButton>
                  </DialogActions>
                </Dialog>
              </TableContainer>
            )}
          </Form>
        )}
      </Formik>

      {/* {oprId && (
        <Formik initialValues={initialStockItemValues} validationSchema={validationSchemaItems} onSubmit={handleSubmitStockItems}>
          {({ values }) => (
            <Form>
              <FieldArray name="stockItems">
                {() => (
                  <>
                    <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
                      <Table>
                        {renderTableHeader('address', 'Select address')}
                        <TableBody>
                          {values.stockItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={6}>
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={12} sm={1}>
                                    <Typography variant="body1">
                                      Select Factory<ValidationStar>*</ValidationStar>
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={2}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Field
                                        as={SelectFieldPadding}
                                        name={`stockItems.${index}.stockItem`}
                                        variant="outlined"
                                        value={companyObject.id}
                                        onChange={(e) => {
                                          console.log(companiesList?.filter((item) => item.id === e.target.value));
                                          setCompanyObject(companiesList?.filter((item) => item.id === e.target.value));
                                        }}
                                        fullWidth
                                      >
                                        <MenuItem value="">
                                          <em>select</em>
                                        </MenuItem>
                                        {companiesList?.map((data) => (
                                          <MenuItem key={data.key} value={data.id}>
                                            {data.name}
                                          </MenuItem>
                                        ))}
                                      </Field>
                                    </div>
                                    <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} />
                                  </Grid>
                                  <Grid xs={6}></Grid>
                                  <Grid container spacing={1} direction="column">
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      spacing={1}
                                      direction="row"
                                      style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', marginTop: '50px' }}
                                    >
                                      {companyObject.length === 1 &&
                                        Object.keys(companyObject[0]).map((key) => (
                                          <Grid
                                            item
                                            xs={2}
                                            key={key}
                                            style={{ textAlign: 'center', borderBottom: '1px solid #ddd', padding: '8px' }}
                                          >
                                            {key}
                                          </Grid>
                                        ))}
                                    </Grid>

                                    <Grid container item xs={12} spacing={1} direction="row">
                                      {companyObject.length === 1 &&
                                        Object.keys(companyObject[0]).map((key) => (
                                          <Grid
                                            item
                                            xs={2}
                                            key={key}
                                            style={{ textAlign: 'center', borderBottom: '1px solid #ddd', padding: '8px' }}
                                          >
                                            {companyObject[0][key]}
                                          </Grid>
                                        ))}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                                <Button variant="contained" size="small" color="primary">
                                  Proceed
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                          <DataGrid getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
                            rows={[]}
                            columns={[
                              { field: 'id', headerName: 'ID', width: 90 },
                              { field: 'addressLine1', headerName: 'Address Line 1', width: 200 },
                              { field: 'addressLine2', headerName: 'Address Line 2', width: 200 },
                              { field: 'addressType', headerName: 'Address Type', width: 150 },
                              { field: 'entityType', headerName: 'Entity Type', width: 150 },
                              { field: 'postalCode', headerName: 'Postal Code', width: 120 },
                              { field: 'name', headerName: 'Name', width: 150 },
                              { field: 'state', headerName: 'State', width: 100 }
                            ]}
                          />
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1, marginRight: '20px' }}>
                      <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={handleConfirmItems}
                        disabled={values.stockItems.length === 0}
                      >
                        Confirm Items
                      </Button>
                    </Box>
                  </>
                )}
              </FieldArray>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  severity="success"
                  sx={{
                    backgroundColor: '#2196f3', // Blue background
                    color: '#f5f5f5' // Gray text
                  }}
                  onClose={handleSnackbarClose}
                >
                  {snackbarMessage}
                </MuiAlert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      )} */}

      {oprId && (
        <Formik initialValues={initialStockItemValues} validationSchema={validationSchemaItems} onSubmit={handleSubmitStockItems}>
          {({ values, setFieldValue }) => (
            <Form>
              <FieldArray name="stockItems">
                {() => (
                  <>
                    <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
                      <Table>
                        {renderTableHeader('itemsDetail', 'Add Items')}
                        <TableBody>
                          {values.stockItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={6}>
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body2">
                                      Select Factory<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Field
                                        as={SelectFieldPadding}
                                        // name={`stockItems.${index}.stockItem`}
                                        variant="outlined"
                                        value={companyObject[0]?.id}
                                        onChange={(e) => {
                                          setCompanyObject(companiesList?.filter((item) => item.id === e.target.value));
                                        }}
                                        fullWidth
                                      >
                                        <MenuItem value="">
                                          <em>select</em>
                                        </MenuItem>
                                        {companiesList?.map((data) => (
                                          <MenuItem key={data.key} value={data.id}>
                                            {data.name}
                                          </MenuItem>
                                        ))}
                                      </Field>
                                    </div>
                                    {/* <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} /> */}
                                  </Grid>

                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">
                                      Stock Item<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Field
                                        as={SelectFieldPadding}
                                        name={`stockItems.${index}.stockItem`}
                                        variant="outlined"
                                        value={item.stockItem}
                                        onChange={(event) => handleStockItem(event, setFieldValue, index)}
                                        fullWidth
                                      >
                                        <MenuItem value="">
                                          <em>select</em>
                                        </MenuItem>
                                        {console.log('itemsData', itemsData)}
                                        {itemsData.map((data) => (
                                          <MenuItem key={data.id} value={data.id}>
                                            {data.name}
                                          </MenuItem>
                                        ))}
                                      </Field>
                                    </div>
                                    <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} />
                                  </Grid>

                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">Stock Item Code</Typography>
                                    <Field
                                      as={SelectFieldPadding}
                                      name={`stockItems.${index}.stockItemCode`}
                                      variant="outlined"
                                      onChange={(event) => handleStockItem(event, setFieldValue, index)}
                                      value={item.stockItemCode}
                                      fullWidth
                                    >
                                      <MenuItem value="">
                                        <em>select</em>
                                      </MenuItem>
                                      {console.log('itemsData', itemsData)}
                                      {itemsData.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>
                                          {data.itemCode}
                                        </MenuItem>
                                      ))}
                                    </Field>
                                    <ErrorMessage name={`stockItems.${index}.stockItemCode`} component="div" style={errorMessageStyle} />
                                  </Grid>

                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">
                                      OPR Qty<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <Field
                                      as={FieldPadding}
                                      name={`stockItems.${index}.qty`}
                                      variant="outlined"
                                      type="number"
                                      fullWidth
                                      aria-describedby="standard-weight-helper-text"
                                      inputProps={{
                                        'aria-label': 'weight'
                                      }}
                                    />
                                    <ErrorMessage name={`stockItems.${index}.qty`} component="div" style={errorMessageStyle} />
                                  </Grid>

                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">
                                      UOM<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Field
                                        as={SelectFieldPadding}
                                        // disabled={uomData.length === 1}
                                        name={`stockItems.${index}.uom`}
                                        variant="outlined"
                                        fullWidth
                                      >
                                        {uomData?.map((data) => (
                                          <MenuItem key={data.key} value={data.name} selected={uomData.length === 1 ? true : false}>
                                            {uomData.length === 1 ? <em>{data.name}</em> : data.name}
                                          </MenuItem>
                                        ))}
                                      </Field>
                                    </div>
                                    <ErrorMessage name={`stockItems.${index}.uom`} component="div" style={errorMessageStyle} />
                                  </Grid>

                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">
                                      Stock In Transit<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <Field
                                      as={FieldPadding}
                                      name={`stockItems.${index}.stock_in_transit`}
                                      variant="outlined"
                                      value={item.stock_in_transit}
                                      type="number"
                                      fullWidth
                                    />
                                    <ErrorMessage name={`stockItems.${index}.stock_in_transit`} component="div" style={errorMessageStyle} />
                                  </Grid>

                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">
                                      Stock In Hand<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <Field
                                      as={FieldPadding}
                                      name={`stockItems.${index}.stock_in_hand`}
                                      variant="outlined"
                                      value={item.stock_in_hand}
                                      type="number"
                                      fullWidth
                                    />
                                    <ErrorMessage name={`stockItems.${index}.stock_in_hand`} component="div" style={errorMessageStyle} />
                                  </Grid>
                                  <Grid item xs={12} sm={2}>
                                    <Typography variant="body1">
                                      Monthly Consumption<ValidationStar>*</ValidationStar>
                                    </Typography>
                                    <Field
                                      as={FieldPadding}
                                      name={`stockItems.${index}.monthly_consumption`}
                                      variant="outlined"
                                      value={item.monthly_consumption}
                                      onBlur={(e) => {
                                        if (
                                          Number(e.target.value) != 0 &&
                                          Number(values?.stockItems[0]?.stock_in_hand) + Number(values?.stockItems[0]?.stock_in_hand) <
                                            e.target.value
                                        ) {
                                          setMonthlyConsumptionDialog(true);
                                        }
                                      }}
                                      onChange={(e) => {
                                        setFieldValue(`stockItems.${index}.monthly_consumption`, e.target.value);
                                      }}
                                      type="number"
                                      fullWidth
                                    />
                                    <ErrorMessage
                                      name={`stockItems.${index}.monthly_consumption`}
                                      component="div"
                                      style={errorMessageStyle}
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="body1">Remarks</Typography>
                                    <Field
                                      as={FieldPadding}
                                      name={`stockItems.${index}.item_description`}
                                      variant="outlined"
                                      value={item.item_description}
                                      fullWidth
                                      // multiline
                                      // rows={2}
                                    />
                                    {/* <ErrorMessage name={`stockItems.${index}.item_description`} component="div" style={errorMessageStyle} /> */}
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                                <Button variant="contained" size="small" color="primary" type="submit">
                                  Add Items
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1, marginRight: '20px' }}>
                      <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={handleConfirmItems}
                        disabled={values.stockItems.length === 0}
                      >
                        Create OPR
                      </Button>
                    </Box>
                  </>
                )}
              </FieldArray>
              <Dialog
                open={monthlyConsumptionDialog}
                onClose={() => setMonthlyConsumptionDialog(false)}
                aria-labelledby="monthly-consumption"
                aria-describedby="update-dialog-consumption"
              >
                <DialogTitle
                  id="monthly-consumption"
                  style={{ backgroundColor: '#a1bcdb', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', fontSize: '15px' }}
                >
                  <span style={{ fontWeight: '600' }}> Warning</span>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="update-dialog-consumption" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                    <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} /> You Monthly Consumption is Larger than your stock.
                    &nbsp;
                    <span style={{ color: 'black', fontWeight: 'bold' }}>
                      {' '}
                      {values.selectedItemName && <span>{values.selectedItemName}</span>}&nbsp;{' '}
                    </span>{' '}
                    Do you still want to Continue ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <YesButton onClick={() => setMonthlyConsumptionDialog(false)}>
                    <span>Continue</span>
                  </YesButton>
                </DialogActions>
              </Dialog>
            </Form>
          )}
        </Formik>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Submit</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          Are you sure you want to create OPR?
          <TextField id="comment" label="Remark for Approval of OPR" value={comment} onChange={(e) => setComment(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDialogClose(false)} color="error">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmDialogClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* /* ...................................... Items table ........................... */}
      {oprId && (
        <>
          <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
            <Table>
              {renderTableHeader('itemsTable', 'Items Table')}
              {showTableBodies.itemsTable && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div style={{ height: '500px', width: '100%' }} className="ag-theme-alpine">
                        <DataGrid
                          getRowHeight={() => 'auto'}
                          sx={{
                            '& .MuiDataGrid-cell': {
                              border: '1px solid rgba(224, 224, 224, 1)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 'none'
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
                          rows={stockData}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default OPRForm;
