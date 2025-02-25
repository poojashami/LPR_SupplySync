// import React, { useEffect, useState } from 'react';
// import {
//   TableContainer,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
//   MenuItem,
//   Box,
//   IconButton,
//   Button,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Autocomplete,
//   InputAdornment,
//   DialogContentText,
//   TextField
// } from '@mui/material';
// import * as Yup from 'yup';

// import WarningIcon from '@mui/icons-material/Warning';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
// import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import { YesButton } from 'components/DialogActionsButton';
// import ValidationStar from 'components/ValidationStar';
// import SelectFieldPadding from 'components/selectFieldPadding';
// import { errorMessageStyle } from 'components/StyleComponent';
// import FieldPadding from 'components/FieldPadding';
// import LPRView from './LPRView';

// const ItemForm = () => {
//   const [showTableBodies, setShowTableBodies] = useState({
//     createOPR: true,
//     itemsDetail: true,
//     itemsTable: true,
//     viewOprDetail: false,
//     basicInfo: true,
//     requestDetails: true,
//     shipmentDetail: true
//   });
//   const [companyObject, setCompanyObject] = useState({});
//   const [companiesList, setCompaniesList] = useState([]);
//   const [itemsData, setItemsData] = useState([]);
//   const [uomData, setUomData] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);

//   const [monthlyConsumptionDialog, setMonthlyConsumptionDialog] = useState(false);
//   const initialStockItemValues = {
//     stockItems: [
//       {
//         stockItem: '',
//         qty: '',
//         stockItemCode: '',
//         stock_in_transit: '',
//         uom: '',
//         stock_in_hand: '',
//         monthly_consumption: '',
//         item_description: ''
//       }
//     ]
//   };
//   const validationSchemaItems = Yup.object().shape({
//     stockItems: Yup.array().of(
//       Yup.object().shape({
//         stockItem: Yup.string().required('Stock Item is required'),
//         qty: Yup.number().required('OPR Quantity is required'),
//         stock_in_transit: Yup.number().required('Stock In Transit is required'),
//         stock_in_hand: Yup.number().required('Stock In Hand is required'),
//         monthly_consumption: Yup.number().required('Monthly Consumption is required')
//       })
//     )
//   });
//   const handleSubmitStockItems = async (values, { resetForm, setSubmitting }) => {
//     try {
//       console.log('stockItems', values.stockItems);
//       // Iterate over each stock item and post data
//       for (let item of values.stockItems) {
//         const postData = {
//           opr_id: oprId,
//           shipment_type_name: oprData[0]?.shipment_type_name,
//           address_id: companyObject[0]?.id,
//           company_id: companyId,
//           item_id: item.stockItem,
//           uom_name: item.uom,
//           qty: item.qty,
//           stock_in_transit: item.stock_in_transit,
//           stock_in_hand: item.stock_in_hand,
//           monthly_consumption: item.monthly_consumption,
//           item_description: item.item_description
//         };
//         console.log('postData', postData);
//         // Example POST request using axios
//         const response = await axiosInstance.post(`/api/opr/item`, postData);
//       }
//       getStockItems(oprId);
//       // After successful submission
//       resetForm(); // Reset form after submission
//     } catch (error) {
//       console.error('Error submitting OPR:', error);
//     } finally {
//       setSubmitting(false); // Ensure form is not stuck in submitting state
//     }
//   };
//   const toggleTableBody = (section) => {
//     setShowTableBodies((prevState) => ({
//       ...prevState,
//       [section]: !prevState[section]
//     }));
//   };

//   // Function to render table headers with toggle icons
//   const renderTableHeader = (sectionName, sectionLabel) => (
//     <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
//       <TableRow>
//         <TableCell sx={{ padding: 0 }} colSpan={6}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography fontSize={'14px'} fontWeight={600}>
//               {sectionLabel}
//             </Typography>
//             <Box>
//               {sectionName === 'viewOprDetail' && (
//                 <IconButton
//                   size="large"
//                   onClick={() => {
//                     handleOPREdit(oprId);
//                     if (onEditClick) {
//                       onEditClick();
//                     }
//                   }}
//                 >
//                   <EditOutlinedIcon />
//                 </IconButton>
//               )}
//               <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
//                 {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
//               </IconButton>
//             </Box>
//           </Box>
//         </TableCell>
//       </TableRow>
//     </TableHead>
//   );
//   const handleConfirmItems = async () => {
//     setOpenDialog(true);
//   };
//   return (
//     <div>
//       <LPRView />
//       <Formik initialValues={initialStockItemValues} validationSchema={validationSchemaItems} onSubmit={handleSubmitStockItems}>
//         {({ values, setFieldValue }) => (
//           <Form>
//             <FieldArray name="stockItems">
//               {() => (
//                 <>
//                   <TableContainer sx={{ borderRadius: '0' }}>
//                     <Table>
//                       {renderTableHeader('itemsDetail', 'Add Items')}
//                       <TableBody>
//                         {values.stockItems.map((item, index) => (
//                           <TableRow key={index}>
//                             <TableCell colSpan={6}>
//                               <Grid container spacing={2} alignItems="center">
//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Select Factory<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <Field
//                                       as={SelectFieldPadding}
//                                       // name={`stockItems.${index}.stockItem`}
//                                       variant="outlined"
//                                       value={companyObject[0]?.id}
//                                       onChange={(e) => {
//                                         setCompanyObject(companiesList?.filter((item) => item.id === e.target.value));
//                                       }}
//                                       fullWidth
//                                     >
//                                       <MenuItem value="">
//                                         <em>select</em>
//                                       </MenuItem>
//                                       {companiesList?.map((data) => (
//                                         <MenuItem key={data.key} value={data.id}>
//                                           {data.name}
//                                         </MenuItem>
//                                       ))}
//                                     </Field>
//                                   </div>
//                                   {/* <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} /> */}
//                                 </Grid>

//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Stock Item<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <Field
//                                       as={SelectFieldPadding}
//                                       name={`stockItems.${index}.stockItem`}
//                                       variant="outlined"
//                                       value={item.stockItem}
//                                       onChange={(event) => handleStockItem(event, setFieldValue, index)}
//                                       fullWidth
//                                     >
//                                       <MenuItem value="">
//                                         <em>select</em>
//                                       </MenuItem>
//                                       {console.log('itemsData', itemsData)}
//                                       {itemsData.map((data) => (
//                                         <MenuItem key={data.id} value={data.id}>
//                                           {data.name}
//                                         </MenuItem>
//                                       ))}
//                                     </Field>
//                                   </div>
//                                   <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} />
//                                 </Grid>

//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Stock Item Code
//                                   </Typography>
//                                   <Field
//                                     as={SelectFieldPadding}
//                                     name={`stockItems.${index}.stockItemCode`}
//                                     variant="outlined"
//                                     onChange={(event) => handleStockItem(event, setFieldValue, index)}
//                                     value={item.stockItemCode}
//                                     fullWidth
//                                   >
//                                     <MenuItem value="">
//                                       <em>select</em>
//                                     </MenuItem>
//                                     {console.log('itemsData', itemsData)}
//                                     {itemsData.map((data) => (
//                                       <MenuItem key={data.id} value={data.id}>
//                                         {data.itemCode}
//                                       </MenuItem>
//                                     ))}
//                                   </Field>
//                                   <ErrorMessage name={`stockItems.${index}.stockItemCode`} component="div" style={errorMessageStyle} />
//                                 </Grid>

//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     LPR Qty<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <Field
//                                     as={FieldPadding}
//                                     name={`stockItems.${index}.qty`}
//                                     variant="outlined"
//                                     type="number"
//                                     fullWidth
//                                     aria-describedby="standard-weight-helper-text"
//                                     inputProps={{
//                                       'aria-label': 'weight'
//                                     }}
//                                   />
//                                   <ErrorMessage name={`stockItems.${index}.qty`} component="div" style={errorMessageStyle} />
//                                 </Grid>

//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     UOM<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <Field
//                                       as={SelectFieldPadding}
//                                       // disabled={uomData.length === 1}
//                                       name={`stockItems.${index}.uom`}
//                                       variant="outlined"
//                                       fullWidth
//                                     >
//                                       {uomData?.map((data) => (
//                                         <MenuItem key={data.key} value={data.name} selected={uomData.length === 1 ? true : false}>
//                                           {uomData.length === 1 ? <em>{data.name}</em> : data.name}
//                                         </MenuItem>
//                                       ))}
//                                     </Field>
//                                   </div>
//                                   <ErrorMessage name={`stockItems.${index}.uom`} component="div" style={errorMessageStyle} />
//                                 </Grid>

//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Stock In Transit<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <Field
//                                     as={FieldPadding}
//                                     name={`stockItems.${index}.stock_in_transit`}
//                                     variant="outlined"
//                                     value={item.stock_in_transit}
//                                     type="number"
//                                     fullWidth
//                                   />
//                                   <ErrorMessage name={`stockItems.${index}.stock_in_transit`} component="div" style={errorMessageStyle} />
//                                 </Grid>

//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Stock In Hand<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <Field
//                                     as={FieldPadding}
//                                     name={`stockItems.${index}.stock_in_hand`}
//                                     variant="outlined"
//                                     value={item.stock_in_hand}
//                                     type="number"
//                                     fullWidth
//                                   />
//                                   <ErrorMessage name={`stockItems.${index}.stock_in_hand`} component="div" style={errorMessageStyle} />
//                                 </Grid>
//                                 <Grid item xs={12} sm={2}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Monthly Consumption<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <Field
//                                     as={FieldPadding}
//                                     name={`stockItems.${index}.monthly_consumption`}
//                                     variant="outlined"
//                                     value={item.monthly_consumption}
//                                     onBlur={(e) => {
//                                       if (
//                                         Number(e.target.value) != 0 &&
//                                         Number(values?.stockItems[0]?.stock_in_hand) + Number(values?.stockItems[0]?.stock_in_hand) <
//                                           e.target.value
//                                       ) {
//                                         setMonthlyConsumptionDialog(true);
//                                       }
//                                     }}
//                                     onChange={(e) => {
//                                       setFieldValue(`stockItems.${index}.monthly_consumption`, e.target.value);
//                                     }}
//                                     type="number"
//                                     fullWidth
//                                   />
//                                   <ErrorMessage
//                                     name={`stockItems.${index}.monthly_consumption`}
//                                     component="div"
//                                     style={errorMessageStyle}
//                                   />
//                                 </Grid>

//                                 <Grid item xs={12} sm={4}>
//                                   <Typography variant="body" style={{ fontSize: '11px' }}>
//                                     Remarks
//                                   </Typography>
//                                   <Field
//                                     as={FieldPadding}
//                                     name={`stockItems.${index}.item_description`}
//                                     variant="outlined"
//                                     value={item.item_description}
//                                     fullWidth
//                                     // multiline
//                                     // rows={2}
//                                   />
//                                   {/* <ErrorMessage name={`stockItems.${index}.item_description`} component="div" style={errorMessageStyle} /> */}
//                                 </Grid>
//                               </Grid>
//                             </TableCell>
//                           </TableRow>
//                         ))}

//                         <TableRow>
//                           <TableCell colSpan={6}>
//                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
//                               <Button
//                                 variant="contained"
//                                 size="small"
//                                 color="primary"
//                                 type="submit"
//                                 sx={{
//                                   marginBottom: '0',
//                                   backgroundColor: '#2c6095',
//                                   color: '#fff',
//                                   '&:hover': {
//                                     backgroundColor: '#244b78'
//                                   }
//                                 }}
//                               >
//                                 Add Items
//                               </Button>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                     <div style={{ border: '1px solid #dbe0e5' }}></div>
//                   </TableContainer>
//                   <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1, marginRight: '20px' }}>
//                     <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="primary"
//                       onClick={handleConfirmItems}
//                       disabled={values.stockItems.length === 0}
//                       sx={{
//                         marginBottom: '0',
//                         backgroundColor: '#2c6095',
//                         color: '#fff',
//                         '&:hover': {
//                           backgroundColor: '#244b78'
//                         }
//                       }}
//                     >
//                       Create OPR
//                     </Button>
//                   </Box>
//                 </>
//               )}
//             </FieldArray>
//             <Dialog
//               open={monthlyConsumptionDialog}
//               onClose={() => setMonthlyConsumptionDialog(false)}
//               aria-labelledby="monthly-consumption"
//               aria-describedby="update-dialog-consumption"
//             >
//               <DialogTitle
//                 id="monthly-consumption"
//                 style={{ backgroundColor: '#a1bcdb', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', fontSize: '15px' }}
//               >
//                 <span style={{ fontWeight: '600' }}> Warning</span>
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="update-dialog-consumption" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
//                   <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} /> You Monthly Consumption is Larger than your stock. &nbsp;
//                   <span style={{ color: 'black', fontWeight: 'bold' }}>
//                     {' '}
//                     {values.selectedItemName && <span>{values.selectedItemName}</span>}&nbsp;{' '}
//                   </span>{' '}
//                   Do you still want to Continue ?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <YesButton onClick={() => setMonthlyConsumptionDialog(false)}>
//                   <span>Continue</span>
//                 </YesButton>
//               </DialogActions>
//             </Dialog>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default ItemForm;

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
import * as Yup from 'yup';

import WarningIcon from '@mui/icons-material/Warning';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { YesButton } from 'components/DialogActionsButton';
import ValidationStar from 'components/ValidationStar';
import SelectFieldPadding from 'components/selectFieldPadding';
import { errorMessageStyle } from 'components/StyleComponent';
import FieldPadding from 'components/FieldPadding';
import LPRView from './LPRView';
import axios from 'axios';

const ItemForm = ({ lprId }) => {
  console.log(lprId,"lprId")
  const [showTableBodies, setShowTableBodies] = useState({
    createOPR: true,
    itemsDetail: true,
    itemsTable: true,
    viewOprDetail: false,
    basicInfo: true,
    requestDetails: true,
    shipmentDetail: true
  });
  const [companyObject, setCompanyObject] = useState({});
  const [companiesList, setCompaniesList] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [monthlyConsumptionDialog, setMonthlyConsumptionDialog] = useState(false);
  const [localLprId, setLocalLprId] = useState(null);
  

  useEffect(() => {
    if (lprId) {
      setLocalLprId(lprId);
    }
  }, [lprId]);


  const initialStockItemValues = {
    stockItems: [
      {
        select_factory: '',
        stockItem: '',
        qty: '',
        stockItemCode: '',
        stock_in_transit: '',
        uom: '',
        stock_in_hand: '',
        monthly_consumption: '',
        remarks: ''
      }
    ]
  };

  const validationSchemaItems = Yup.object().shape({
    // stockItems: Yup.array().of(
    //   Yup.object().shape({
    //     select_factory: Yup.string().required('Factory selection is required'),
    //     stock_item: Yup.string().required('Stock Item is required'),
    //     lpr_qty: Yup.number().required('OPR Quantity is required'),
    //     stock_in_transit: Yup.number().required('Stock In Transit is required'),
    //     stock_in_hand: Yup.number().required('Stock In Hand is required'),
    //     monthly_consumption: Yup.number().required('Monthly Consumption is required')
    //   })
    // )
  });

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600}>
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

  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  // const handleSubmitStockItems = async (values) => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/lpr/itemCategory', values.stockItems[0]);
  //     console.log('Response:', response.data);
  //     alert('Stock Item LPR entry created successfully!');
  //   } catch (error) {
  //     console.error('Error creating Stock Item LPR entry:', error);
  //     alert('Something went wrong, please try again later.');
  //   }
  // };

  const handleSubmitStockItems = async (values) => {
    try {
      const payload = {
        ...values.stockItems[0],
        lpr_id: localLprId
      };

      const response = await axios.post('http://localhost:5000/api/lpr/itemCategory', payload);
      console.log('Response:', response.data);
      alert('Stock Item LPR entry created successfully!');
    } catch (error) {
      console.error('Error creating Stock Item LPR entry:', error);
      alert('Something went wrong, please try again later.');
    }
  };

  const handleStockItem = (event, setFieldValue, index) => {
    const selectedValue = event.target.value;
    setFieldValue(`stockItems.${index}.stockItem`, selectedValue);
    setFieldValue(`stockItems.${index}.stockItemCode`, selectedValue); // Assuming stockItemCode is the same as stockItem for simplicity
  };

  const handleConfirmItems = async () => {
    setOpenDialog(true);
  };

  return (
    <div>
      <LPRView />
      <Formik initialValues={initialStockItemValues} validationSchema={validationSchemaItems} onSubmit={handleSubmitStockItems}>
        {({ values, setFieldValue }) => (
          <Form>
            <FieldArray name="stockItems">
              {() => (
                <>
                  <TableContainer sx={{ borderRadius: '0' }}>
                    <Table>
                      {renderTableHeader('itemsDetail', 'Add Items')}
                      <TableBody>
                        {values.stockItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={6}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
                                    Select Factory<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Field
                                      as={SelectFieldPadding}
                                      name={`stockItems.${index}.select_factory`}
                                      variant="outlined"
                                      value={item.select_factory}
                                      // onChange={(event) => handleStockItem(event, setFieldValue, index)}
                                      fullWidth
                                    >
                                      <MenuItem value="">
                                        <em>select</em>
                                      </MenuItem>
                                      <MenuItem value="Sant Jones">Sant Jones</MenuItem>
                                    </Field>
                                  </div>
                                  <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
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
                                      <MenuItem value="IU-009-TW">Salt</MenuItem>
                                    </Field>
                                  </div>
                                  <ErrorMessage name={`stockItems.${index}.stockItem`} component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
                                    Stock Item Code
                                  </Typography>
                                  <Field
                                    as={SelectFieldPadding}
                                    name={`stockItems.${index}.stockItemCode`}
                                    variant="outlined"
                                    value={item.stockItemCode}
                                    fullWidth
                                  >
                                    <MenuItem value="">
                                      <em>select</em>
                                    </MenuItem>
                                    <MenuItem value="IU-009-TW">IU-009-TW</MenuItem>
                                  </Field>
                                  <ErrorMessage name={`stockItems.${index}.stockItemCode`} component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
                                    LPR Qty<ValidationStar>*</ValidationStar>
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
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
                                    UOM<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Field as={SelectFieldPadding} name={`stockItems.${index}.uom`} variant="outlined" fullWidth>
                                      <MenuItem value="">
                                        <em>select</em>
                                      </MenuItem>
                                      <MenuItem value="Kg">Kg</MenuItem>
                                      <MenuItem value="TON">TON</MenuItem>
                                    </Field>
                                  </div>
                                  <ErrorMessage name={`stockItems.${index}.uom`} component="div" style={errorMessageStyle} />
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
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
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
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
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
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
                                  <Typography variant="body" style={{ fontSize: '11px' }}>
                                    Remarks
                                  </Typography>
                                  <Field
                                    as={FieldPadding}
                                    name={`stockItems.${index}.item_description`}
                                    variant="outlined"
                                    value={item.item_description}
                                    fullWidth
                                  />
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                type="submit"
                                sx={{
                                  marginBottom: '0',
                                  backgroundColor: '#2c6095',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: '#244b78'
                                  }
                                }}
                              >
                                Add Items
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div style={{ border: '1px solid #dbe0e5' }}></div>
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
                      sx={{
                        marginBottom: '0',
                        backgroundColor: '#2c6095',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#244b78'
                        }
                      }}
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
                  <WarningIcon style={{ color: '#ffb300', marginRight: '8px' }} /> You Monthly Consumption is Larger than your stock. &nbsp;
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
    </div>
  );
};

export default ItemForm;
