// import React, { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import {
//   Box,
//   Button,
//   Grid,
//   Typography,
//   TextField,
//   Table,
//   TableRow,
//   TableHead,
//   TableCell,
//   IconButton,
//   MenuItem,
//   InputAdornment,
//   Tooltip,
//   TableBody,
//   Autocomplete
// } from '@mui/material';
// import { errorMessageStyle } from 'components/StyleComponent';
// import ValidationStar from 'components/ValidationStar';
// import FieldPadding from 'components/FieldPadding';
// import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import SelectFieldPadding from 'components/selectFieldPadding';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/system';
// import ItemForm from './ItemForm';
// import ItemTable from './ItemTable';

// const CreateLPRForm = ({ onSubmit, onCancel }) => {
//   const [fileArray, setFileArray] = useState([]);
//   const [showItemForm, setShowItemForm] = useState(false);

//   const VisuallyHiddenInput = styled('input')({
//     display: 'none'
//   });
//   const [showTableHeading, setShowTableHeading] = useState({
//     viewLPR: true,
//     lprForm: true,
//     heading2: true,
//     heading3: true
//   });
//   // Validation schema
//   const validationSchema = Yup.object({
//     lprNo: Yup.string().required('LPR No is required'),
//     vertical: Yup.string().required('Vertical is required'),
//     company: Yup.string().required('Company is required'),
//     division: Yup.string().required('Division is required'),
//     lprCategory: Yup.string().required('LPR Category is required'),
//     shipmentMode: Yup.string().required('Shipment Mode is required'),
//     buyingThrough: Yup.string().required('Buying Through is required'),
//     leftForRFQ: Yup.string().required('Left for RFQ is required'),
//     deliveryTime: Yup.string().required('Delivery Time is required'),
//     requestedByDept: Yup.string().required('Requested By Department is required'),
//     requestedBy: Yup.string().required('Requested By is required'),
//     lprDate: Yup.date().required('Date is required')
//   });

//   const initialValues = {
//     lprNo: '',
//     vertical: '',
//     company: '',
//     division: '',
//     lprCategory: '',
//     shipmentMode: '',
//     buyingThrough: '',
//     leftForRFQ: '',
//     deliveryTime: '',
//     requestedByDept: '',
//     requestedBy: '',
//     lprDate: '',
//     additionalRemarks: ''
//   };
//   const toggleTableBody = (section) => {
//     setShowTableHeading((prevState) => ({
//       ...prevState,
//       [section]: !prevState[section]
//     }));
//   };
//   const handleFileChangeFile = (e) => {
//     const files = e.target.files;
//     setFileArray(files);
//   };
//   const renderTableHeader = (sectionName, sectionLabel) => (
//     <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
//       <TableRow>
//         <TableCell sx={{ padding: 0 }} colSpan={12}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography fontSize={'14px'} fontWeight={600}>
//               {sectionLabel}
//             </Typography>
//             <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
//               {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
//             </IconButton>
//           </Box>
//         </TableCell>
//       </TableRow>
//     </TableHead>
//   );
//   return (
//     <Box>
//       {!showItemForm ? (
//         <>
//           <Table>{renderTableHeader('lprForm', 'Create LPR')}</Table>
//           {showTableHeading.lprForm && (
//             <Box padding={1}>
//               <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { resetForm }) => {
//                   onSubmit(values);
//                   resetForm();
//                 }}
//               >
//                 {({ isSubmitting, resetForm }) => (
//                   <Form>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                         <Typography variant="body" style={{ fontSize: '11px' }}>
//                           LPR Date<ValidationStar>*</ValidationStar>
//                         </Typography>
//                         <Field as={FieldPadding} name="lprDate" variant="outlined" fullWidth size="small" />
//                         <ErrorMessage name="lprDate" component="div" style={errorMessageStyle} />
//                       </Grid>

//                       <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                         <Typography variant="body" style={{ fontSize: '11px' }}>
//                           Vertical<ValidationStar>*</ValidationStar>
//                         </Typography>
//                         <Field as={FieldPadding} name="vertical" variant="outlined" fullWidth size="small" />
//                         <ErrorMessage name="vertical" component="div" style={errorMessageStyle} />
//                       </Grid>

//                       <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                         <Typography variant="body" style={{ fontSize: '11px' }}>
//                           Company<ValidationStar>*</ValidationStar>
//                         </Typography>
//                         <Field as={FieldPadding} name="company" variant="outlined" fullWidth size="small" />
//                         <ErrorMessage name="company" component="div" style={errorMessageStyle} />
//                       </Grid>

//                       <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                         <Typography variant="body" style={{ fontSize: '11px' }}>
//                           Division<ValidationStar>*</ValidationStar>
//                         </Typography>
//                         <Field as={FieldPadding} name="division" variant="outlined" fullWidth size="small" />
//                         <ErrorMessage name="division" component="div" style={errorMessageStyle} />
//                       </Grid>

//                       <Grid item xs={6}>
//                         <Table>
//                           <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
//                             Request Details
//                           </Typography>
//                           <TableBody>
//                             <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
//                               <TableCell colSpan={6}>
//                                 <Grid container spacing={2} alignItems="center">
//                                   <Grid item xs={12} sm={4}>
//                                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                       <Typography variant="body2">
//                                         Req Dept<ValidationStar>*</ValidationStar>
//                                       </Typography>
//                                       <Field as={FieldPadding} name="requestedByDept" variant="outlined" fullWidth size="small" />
//                                       <ErrorMessage name="requestedByDept" component="div" style={errorMessageStyle} />
//                                     </Box>
//                                   </Grid>

//                                   <Grid item xs={12} sm={4}>
//                                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                       <Typography variant="body2">
//                                         Req By<ValidationStar>*</ValidationStar>
//                                       </Typography>

//                                       <Field as={FieldPadding} name="requestedBy" variant="outlined" fullWidth size="small" />
//                                       <ErrorMessage name="requestedBy" component="div" style={errorMessageStyle} />
//                                     </Box>
//                                   </Grid>

//                                   <Grid item xs={12} sm={4}>
//                                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                       <Typography variant="body2">
//                                         No. Min Quotation<ValidationStar>*</ValidationStar>
//                                       </Typography>

//                                       <Field as={FieldPadding} name="noMinQuote" variant="outlined" fullWidth size="small" />
//                                       <ErrorMessage name="noMinQuote" component="div" style={errorMessageStyle} />
//                                     </Box>
//                                   </Grid>

//                                   <Grid item xs={12} sm={4}>
//                                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                       <Typography variant="body2">
//                                         Quotations Email Alert<ValidationStar>*</ValidationStar>
//                                       </Typography>

//                                       <Field as={FieldPadding} name="quotationEmailAlert" variant="outlined" fullWidth size="small" />
//                                       <ErrorMessage name="quotationEmailAlert" component="div" style={errorMessageStyle} />
//                                     </Box>
//                                   </Grid>
//                                 </Grid>
//                                 <Grid item xs={12} sm={12}>
//                                   <Typography variant="body2">
//                                     Procurement Indent<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: '5px', height: '75px' }}>
//                                     <Button
//                                       fullWidth
//                                       component="label"
//                                       variant="contained"
//                                       sx={{
//                                         marginBottom: '0',
//                                         backgroundColor: '#2c6095',
//                                         color: '#fff',
//                                         '&:hover': {
//                                           backgroundColor: '#244b78'
//                                         }
//                                       }}
//                                       startIcon={<CloudUploadIcon />}
//                                     >
//                                       {fileArray?.length > 0
//                                         ? `${fileArray?.length} ${fileArray?.length === 1 ? 'File' : 'Files'} uploaded`
//                                         : 'Upload File'}
//                                       <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChangeFile(e)} />
//                                     </Button>
//                                   </Box>
//                                 </Grid>
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </Grid>

//                       <Grid item xs={6}>
//                         <Table>
//                           <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
//                             Shipment Details
//                           </Typography>

//                           <TableBody>
//                             <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
//                               <TableCell colSpan={6}>
//                                 <Grid container spacing={2} alignItems="center">
//                                   <Grid item xs={12} sm={4}>
//                                     <Typography variant="body2">
//                                       Delivery Type<ValidationStar>*</ValidationStar>
//                                     </Typography>
//                                     <Field as={SelectFieldPadding} name="deliveryType" variant="outlined" value="deliveryType" fullWidth>
//                                       <MenuItem value="EX Factory">EX Factory</MenuItem>

//                                       <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
//                                       <MenuItem value="Courier">Courier</MenuItem>
//                                     </Field>
//                                     <ErrorMessage name="shipmentMode" component="div" style={errorMessageStyle} />
//                                   </Grid>
//                                   <Grid item xs={12} sm={4}>
//                                     <Typography variant="body2">
//                                       Delivery Time<ValidationStar>*</ValidationStar>
//                                     </Typography>
//                                     <Field
//                                       as={FieldPadding}
//                                       name="deliveryTime"
//                                       variant="outlined"
//                                       fullWidth
//                                       size="small"
//                                       InputProps={{
//                                         endAdornment: (
//                                           <InputAdornment position="end" sx={{ fontSize: '8px' }}>
//                                             Days
//                                           </InputAdornment>
//                                         )
//                                       }}
//                                     />
//                                     <ErrorMessage name="deliveryTime" component="div" style={errorMessageStyle} />
//                                   </Grid>

//                                   <Grid item xs={12} sm={4}>
//                                     <Typography variant="body2">LPR Category</Typography>
//                                     <Field as={SelectFieldPadding} name="oprDescription" variant="outlined" fullWidth>
//                                       <MenuItem value="">
//                                         <em>select</em>
//                                       </MenuItem>
//                                     </Field>
//                                     <ErrorMessage name="oprDescription" component="div" style={errorMessageStyle} />
//                                   </Grid>

//                                   <Grid item xs={12} sm={8}>
//                                     <Typography variant="body2">Additional Remark</Typography>
//                                     <Field as={FieldPadding} name="additionalRemarks" variant="outlined" fullWidth size="small" />
//                                     <ErrorMessage name="additionalRemarks" component="div" style={errorMessageStyle} />
//                                   </Grid>
//                                 </Grid>
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </Grid>
//                     </Grid>
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         type="button"
//                         disabled={isSubmitting}
//                         onClick={() => setShowItemForm(true)}
//                         sx={{
//                           backgroundColor: '#2c6095',
//                           color: '#fff',
//                           '&:hover': {
//                             backgroundColor: '#244b78'
//                           }
//                         }}
//                       >
//                         Add Items
//                       </Button>
//                     </Box>
//                   </Form>
//                 )}
//               </Formik>
//             </Box>
//           )}
//         </>
//       ) : (
//         <>
//           <ItemForm />
//           <ItemTable />
//         </>
//       )}
//     </Box>
//   );
// };

// export default CreateLPRForm;

// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Grid,
//   Typography,
//   Table,
//   TableRow,
//   TableHead,
//   TableCell,
//   IconButton,
//   MenuItem,
//   InputAdornment,
//   TableBody
// } from '@mui/material';
// import { errorMessageStyle } from 'components/StyleComponent';
// import ValidationStar from 'components/ValidationStar';
// import FieldPadding from 'components/FieldPadding';
// import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import SelectFieldPadding from 'components/selectFieldPadding';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/system';
// import ItemForm from './ItemForm';
// import ItemTable from './ItemTable';

// const CreateLPRForm = ({ onSubmit, onCancel }) => {
//   const [fileArray, setFileArray] = useState([]);
//   const [showItemForm, setShowItemForm] = useState(false);
//   const [formValues, setFormValues] = useState({
//     lprNo: '',
//     vertical: '',
//     company: '',
//     division: '',
//     lprCategory: '',
//     shipmentMode: '',
//     buyingThrough: '',
//     leftForRFQ: '',
//     deliveryTime: '',
//     requestedByDept: '',
//     requestedBy: '',
//     lprDate: '',
//     additionalRemarks: '',
//     noMinQuote: '',
//     quotationEmailAlert: '',
//     deliveryType: '',
//     oprDescription: ''
//   });

//   const [errors, setErrors] = useState({});

//   const VisuallyHiddenInput = styled('input')({
//     display: 'none'
//   });

//   const [showTableHeading, setShowTableHeading] = useState({
//     viewLPR: true,
//     lprForm: true,
//     heading2: true,
//     heading3: true
//   });

//   const toggleTableBody = (section) => {
//     setShowTableHeading((prevState) => ({
//       ...prevState,
//       [section]: !prevState[section]
//     }));
//   };

//   const handleFileChangeFile = (e) => {
//     const files = e.target.files;
//     setFileArray(files);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formValues.lprNo) newErrors.lprNo = 'LPR No is required';
//     if (!formValues.vertical) newErrors.vertical = 'Vertical is required';
//     if (!formValues.company) newErrors.company = 'Company is required';
//     if (!formValues.division) newErrors.division = 'Division is required';
//     if (!formValues.lprCategory) newErrors.lprCategory = 'LPR Category is required';
//     if (!formValues.shipmentMode) newErrors.shipmentMode = 'Shipment Mode is required';
//     if (!formValues.buyingThrough) newErrors.buyingThrough = 'Buying Through is required';
//     if (!formValues.leftForRFQ) newErrors.leftForRFQ = 'Left for RFQ is required';
//     if (!formValues.deliveryTime) newErrors.deliveryTime = 'Delivery Time is required';
//     if (!formValues.requestedByDept) newErrors.requestedByDept = 'Requested By Department is required';
//     if (!formValues.requestedBy) newErrors.requestedBy = 'Requested By is required';
//     if (!formValues.lprDate) newErrors.lprDate = 'Date is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSubmit(formValues);
//       setFormValues({
//         lprNo: '',
//         vertical: '',
//         company: '',
//         division: '',
//         lprCategory: '',
//         shipmentMode: '',
//         buyingThrough: '',
//         leftForRFQ: '',
//         deliveryTime: '',
//         requestedByDept: '',
//         requestedBy: '',
//         lprDate: '',
//         additionalRemarks: '',
//         noMinQuote: '',
//         quotationEmailAlert: '',
//         deliveryType: '',
//         oprDescription: ''
//       });
//     }
//   };

//   const renderTableHeader = (sectionName, sectionLabel) => (
//     <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
//       <TableRow>
//         <TableCell sx={{ padding: 0 }} colSpan={12}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography fontSize={'14px'} fontWeight={600}>
//               {sectionLabel}
//             </Typography>
//             <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
//               {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
//             </IconButton>
//           </Box>
//         </TableCell>
//       </TableRow>
//     </TableHead>
//   );

//   return (
//     <Box>
//       {!showItemForm ? (
//         <>
//           <Table>{renderTableHeader('lprForm', 'Create LPR')}</Table>
//           {showTableHeading.lprForm && (
//             <Box padding={1}>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                     <Typography variant="body" style={{ fontSize: '11px' }}>
//                       LPR Date<ValidationStar>*</ValidationStar>
//                     </Typography>
//                     <FieldPadding
//                       name="lprDate"
//                       variant="outlined"
//                       fullWidth
//                       size="small"
//                       value={formValues.lprDate}
//                       onChange={handleChange}
//                     />
//                     {errors.lprDate && <div style={errorMessageStyle}>{errors.lprDate}</div>}
//                   </Grid>

//                   <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                     <Typography variant="body" style={{ fontSize: '11px' }}>
//                       Vertical<ValidationStar>*</ValidationStar>
//                     </Typography>
//                     <FieldPadding
//                       name="vertical"
//                       variant="outlined"
//                       fullWidth
//                       size="small"
//                       value={formValues.vertical}
//                       onChange={handleChange}
//                     />
//                     {errors.vertical && <div style={errorMessageStyle}>{errors.vertical}</div>}
//                   </Grid>

//                   <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                     <Typography variant="body" style={{ fontSize: '11px' }}>
//                       Company<ValidationStar>*</ValidationStar>
//                     </Typography>
//                     <FieldPadding
//                       name="company"
//                       variant="outlined"
//                       fullWidth
//                       size="small"
//                       value={formValues.company}
//                       onChange={handleChange}
//                     />
//                     {errors.company && <div style={errorMessageStyle}>{errors.company}</div>}
//                   </Grid>

//                   <Grid item xs={12} sm={3} paddingTop={'20px'}>
//                     <Typography variant="body" style={{ fontSize: '11px' }}>
//                       Division<ValidationStar>*</ValidationStar>
//                     </Typography>
//                     <FieldPadding
//                       name="division"
//                       variant="outlined"
//                       fullWidth
//                       size="small"
//                       value={formValues.division}
//                       onChange={handleChange}
//                     />
//                     {errors.division && <div style={errorMessageStyle}>{errors.division}</div>}
//                   </Grid>

//                   <Grid item xs={6}>
//                     <Table>
//                       <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
//                         Request Details
//                       </Typography>
//                       <TableBody>
//                         <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
//                           <TableCell colSpan={6}>
//                             <Grid container spacing={2} alignItems="center">
//                               <Grid item xs={12} sm={4}>
//                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                   <Typography variant="body2">
//                                     Req Dept<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <FieldPadding
//                                     name="requestedByDept"
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     value={formValues.requestedByDept}
//                                     onChange={handleChange}
//                                   />
//                                   {errors.requestedByDept && <div style={errorMessageStyle}>{errors.requestedByDept}</div>}
//                                 </Box>
//                               </Grid>

//                               <Grid item xs={12} sm={4}>
//                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                   <Typography variant="body2">
//                                     Req By<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <FieldPadding
//                                     name="requestedBy"
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     value={formValues.requestedBy}
//                                     onChange={handleChange}
//                                   />
//                                   {errors.requestedBy && <div style={errorMessageStyle}>{errors.requestedBy}</div>}
//                                 </Box>
//                               </Grid>

//                               <Grid item xs={12} sm={4}>
//                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                   <Typography variant="body2">
//                                     No. Min Quotation<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <FieldPadding
//                                     name="noMinQuote"
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     value={formValues.noMinQuote}
//                                     onChange={handleChange}
//                                   />
//                                   {errors.noMinQuote && <div style={errorMessageStyle}>{errors.noMinQuote}</div>}
//                                 </Box>
//                               </Grid>

//                               <Grid item xs={12} sm={4}>
//                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                   <Typography variant="body2">
//                                     Quotations Email Alert<ValidationStar>*</ValidationStar>
//                                   </Typography>
//                                   <FieldPadding
//                                     name="quotationEmailAlert"
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     value={formValues.quotationEmailAlert}
//                                     onChange={handleChange}
//                                   />
//                                   {errors.quotationEmailAlert && <div style={errorMessageStyle}>{errors.quotationEmailAlert}</div>}
//                                 </Box>
//                               </Grid>
//                             </Grid>
//                             <Grid item xs={12} sm={12}>
//                               <Typography variant="body2">
//                                 Procurement Indent<ValidationStar>*</ValidationStar>
//                               </Typography>
//                               <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: '5px', height: '75px' }}>
//                                 <Button
//                                   fullWidth
//                                   component="label"
//                                   variant="contained"
//                                   sx={{
//                                     marginBottom: '0',
//                                     backgroundColor: '#2c6095',
//                                     color: '#fff',
//                                     '&:hover': {
//                                       backgroundColor: '#244b78'
//                                     }
//                                   }}
//                                   startIcon={<CloudUploadIcon />}
//                                 >
//                                   {fileArray?.length > 0
//                                     ? `${fileArray?.length} ${fileArray?.length === 1 ? 'File' : 'Files'} uploaded`
//                                     : 'Upload File'}
//                                   <VisuallyHiddenInput type="file" multiple onChange={(e) => handleFileChangeFile(e)} />
//                                 </Button>
//                               </Box>
//                             </Grid>
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </Grid>

//                   <Grid item xs={6}>
//                     <Table>
//                       <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
//                         Shipment Details
//                       </Typography>
//                       <TableBody>
//                         <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
//                           <TableCell colSpan={6}>
//                             <Grid container spacing={2} alignItems="center">
//                               <Grid item xs={12} sm={4}>
//                                 <Typography variant="body2">
//                                   Delivery Type<ValidationStar>*</ValidationStar>
//                                 </Typography>
//                                 <SelectFieldPadding
//                                   name="deliveryType"
//                                   variant="outlined"
//                                   value={formValues.deliveryType}
//                                   onChange={handleChange}
//                                   fullWidth
//                                 >
//                                   <MenuItem value="EX Factory">EX Factory</MenuItem>
//                                   <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
//                                   <MenuItem value="Courier">Courier</MenuItem>
//                                 </SelectFieldPadding>
//                                 {errors.shipmentMode && <div style={errorMessageStyle}>{errors.shipmentMode}</div>}
//                               </Grid>
//                               <Grid item xs={12} sm={4}>
//                                 <Typography variant="body2">
//                                   Delivery Time<ValidationStar>*</ValidationStar>
//                                 </Typography>
//                                 <FieldPadding
//                                   name="deliveryTime"
//                                   variant="outlined"
//                                   fullWidth
//                                   size="small"
//                                   value={formValues.deliveryTime}
//                                   onChange={handleChange}
//                                   InputProps={{
//                                     endAdornment: (
//                                       <InputAdornment position="end" sx={{ fontSize: '8px' }}>
//                                         Days
//                                       </InputAdornment>
//                                     )
//                                   }}
//                                 />
//                                 {errors.deliveryTime && <div style={errorMessageStyle}>{errors.deliveryTime}</div>}
//                               </Grid>

//                               <Grid item xs={12} sm={4}>
//                                 <Typography variant="body2">LPR Category</Typography>
//                                 <SelectFieldPadding
//                                   name="oprDescription"
//                                   variant="outlined"
//                                   value={formValues.oprDescription}
//                                   onChange={handleChange}
//                                   fullWidth
//                                 >
//                                   <MenuItem value="">
//                                     <em>select</em>
//                                   </MenuItem>
//                                 </SelectFieldPadding>
//                                 {errors.oprDescription && <div style={errorMessageStyle}>{errors.oprDescription}</div>}
//                               </Grid>

//                               <Grid item xs={12} sm={8}>
//                                 <Typography variant="body2">Additional Remark</Typography>
//                                 <FieldPadding
//                                   name="additionalRemarks"
//                                   variant="outlined"
//                                   fullWidth
//                                   size="small"
//                                   value={formValues.additionalRemarks}
//                                   onChange={handleChange}
//                                 />
//                                 {errors.additionalRemarks && <div style={errorMessageStyle}>{errors.additionalRemarks}</div>}
//                               </Grid>
//                             </Grid>
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </Grid>
//                 </Grid>
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     type="button"
//                     onClick={() => setShowItemForm(true)}
//                     sx={{
//                       backgroundColor: '#2c6095',
//                       color: '#fff',
//                       '&:hover': {
//                         backgroundColor: '#244b78'
//                       }
//                     }}
//                   >
//                     Add Items
//                   </Button>
//                 </Box>
//               </form>
//             </Box>
//           )}
//         </>
//       ) : (
//         <>
//           <ItemForm />
//           <ItemTable />
//         </>
//       )}
//     </Box>
//   );
// };

// export default CreateLPRForm;





import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  MenuItem,
  InputAdornment,
  TableBody
} from '@mui/material';
import { errorMessageStyle } from 'components/StyleComponent';
import ValidationStar from 'components/ValidationStar';
import FieldPadding from 'components/FieldPadding';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SelectFieldPadding from 'components/selectFieldPadding';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ItemForm from './ItemForm';
import ItemTable from './ItemTable';

const CreateLPRForm = ({ onSubmit, onCancel }) => {
  const [fileArray, setFileArray] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [formValues, setFormValues] = useState({
    vertical: '',
    company: '',
    division: '',
    lprCategory: '',
    leftForRFQ: '',
    deliveryTime: '',
    requestedByDept: '',
    requestedBy: '',
    lprDate: '',
    additionalRemarks: '',
    noMinQuote: '',
    quotationEmailAlert: '',
    deliveryType: '',
    oprDescription: ''
  });

  const [errors, setErrors] = useState({});

  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });

  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    heading2: true,
    heading3: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleFileChangeFile = (e) => {
    const files = e.target.files;
    setFileArray(files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.vertical) newErrors.vertical = 'Vertical is required';
    if (!formValues.company) newErrors.company = 'Company is required';
    if (!formValues.division) newErrors.division = 'Division is required';
    if (!formValues.lprCategory) newErrors.lprCategory = 'LPR Category is required';
    if (!formValues.leftForRFQ) newErrors.leftForRFQ = 'Left for RFQ is required';
    if (!formValues.deliveryTime) newErrors.deliveryTime = 'Delivery Time is required';
    if (!formValues.requestedByDept) newErrors.requestedByDept = 'Requested By Department is required';
    if (!formValues.requestedBy) newErrors.requestedBy = 'Requested By is required';
    if (!formValues.lprDate) newErrors.lprDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formValues);
      setFormValues({
        vertical: '',
        company: '',
        division: '',
        lprCategory: '',
        leftForRFQ: '',
        deliveryTime: '',
        requestedByDept: '',
        requestedBy: '',
        lprDate: '',
        additionalRemarks: '',
        noMinQuote: '',
        quotationEmailAlert: '',
        deliveryType: '',
        oprDescription: ''
      });
    }
  };

  const handleAddItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/create/lpr-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data posted successfully:', data);

      // Optionally, you can set the showItemForm state to true after successful post
      setShowItemForm(true);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600}>
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
    <Box>
      {!showItemForm ? (
        <>
          <Table>{renderTableHeader('lprForm', 'Create LPR')}</Table>
          {showTableHeading.lprForm && (
            <Box padding={1}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      LPR Date<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="lprDate"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.lprDate}
                      onChange={handleChange}
                    />
                    {errors.lprDate && <div style={errorMessageStyle}>{errors.lprDate}</div>}
                  </Grid>

                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Vertical<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="vertical"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.vertical}
                      onChange={handleChange}
                    />
                    {errors.vertical && <div style={errorMessageStyle}>{errors.vertical}</div>}
                  </Grid>

                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Company<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="company"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.company}
                      onChange={handleChange}
                    />
                    {errors.company && <div style={errorMessageStyle}>{errors.company}</div>}
                  </Grid>

                  <Grid item xs={12} sm={3} paddingTop={'20px'}>
                    <Typography variant="body" style={{ fontSize: '11px' }}>
                      Division<ValidationStar>*</ValidationStar>
                    </Typography>
                    <FieldPadding
                      name="division"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={formValues.division}
                      onChange={handleChange}
                    />
                    {errors.division && <div style={errorMessageStyle}>{errors.division}</div>}
                  </Grid>

                  <Grid item xs={6}>
                    <Table>
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Request Details
                      </Typography>
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    Req Dept<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="requestedByDept"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.requestedByDept}
                                    onChange={handleChange}
                                  />
                                  {errors.requestedByDept && <div style={errorMessageStyle}>{errors.requestedByDept}</div>}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    Req By<ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="requestedBy"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.requestedBy}
                                    onChange={handleChange}
                                  />
                                  {errors.requestedBy && <div style={errorMessageStyle}>{errors.requestedBy}</div>}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    No. Min Quotation
                                    <ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="noMinQuote"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.noMinQuote}
                                    onChange={handleChange}
                                  />
                                  {errors.noMinQuote && <div style={errorMessageStyle}>{errors.noMinQuote}</div>}
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Typography variant="body2">
                                    Quotations Email Alert
                                    <ValidationStar>*</ValidationStar>
                                  </Typography>
                                  <FieldPadding
                                    name="quotationEmailAlert"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formValues.quotationEmailAlert}
                                    onChange={handleChange}
                                  />
                                  {errors.quotationEmailAlert && <div style={errorMessageStyle}>{errors.quotationEmailAlert}</div>}
                                </Box>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Typography variant="body2">
                                Procurement Indent
                                <ValidationStar>*</ValidationStar>
                              </Typography>
                              <Box
                                sx={{
                                  p: 2,
                                  border: '1px dashed grey',
                                  borderRadius: '5px',
                                  height: '75px'
                                }}
                              >
                                <Button
                                  fullWidth
                                  component="label"
                                  variant="contained"
                                  sx={{
                                    marginBottom: '0',
                                    backgroundColor: '#2c6095',
                                    color: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#244b78'
                                    }
                                  }}
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
                    </Table>
                  </Grid>

                  <Grid item xs={6}>
                    <Table>
                      <Typography variant="body2" sx={{ pl: 1, fontWeight: 600 }}>
                        Shipment Details
                      </Typography>
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                  Delivery Type
                                  <ValidationStar>*</ValidationStar>
                                </Typography>
                                <SelectFieldPadding
                                  name="deliveryType"
                                  variant="outlined"
                                  value={formValues.deliveryType}
                                  onChange={handleChange}
                                  fullWidth
                                >
                                  <MenuItem value="EX Factory">EX Factory</MenuItem>
                                  <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
                                  <MenuItem value="Courier">Courier</MenuItem>
                                </SelectFieldPadding>
                                
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2">
                                  Delivery Time
                                  <ValidationStar>*</ValidationStar>
                                </Typography>
                                <FieldPadding
                                  name="deliveryTime"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={formValues.deliveryTime}
                                  onChange={handleChange}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end" sx={{ fontSize: '8px' }}>
                                        Days
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                {errors.deliveryTime && <div style={errorMessageStyle}>{errors.deliveryTime}</div>}
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2">LPR Category</Typography>
                                <SelectFieldPadding
                                  name="deliveryType"
                                  variant="outlined"
                                  value={formValues.deliveryType}
                                  onChange={handleChange}
                                  fullWidth
                                >
                                  <MenuItem value="EX Factory">EX Factory</MenuItem>
                                  <MenuItem value="Factory Delivered">Factory Delivered</MenuItem>
                                  <MenuItem value="Courier">Courier</MenuItem>
                                </SelectFieldPadding>
                                {errors.oprDescription && <div style={errorMessageStyle}>{errors.oprDescription}</div>}
                              </Grid>

                              <Grid item xs={12} sm={8}>
                                <Typography variant="body2">Additional Remark</Typography>
                                <FieldPadding
                                  name="additionalRemarks"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={formValues.additionalRemarks}
                                  onChange={handleChange}
                                />
                                {errors.additionalRemarks && <div style={errorMessageStyle}>{errors.additionalRemarks}</div>}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size="small"
                    type="button"
                    onClick={handleAddItems} // Updated onClick handler
                    sx={{
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
              </form>
            </Box>
          )}
        </>
      ) : (
        <>
          <ItemForm />
          <ItemTable />
        </>
      )}
    </Box>
  );
};

export default CreateLPRForm;
