// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/system';
import { CreateItem } from '../../../Redux/Apis/PostApiCalls';
import { GetVendors } from '../../../Redux/Apis/GetApiCalls';
import {
  GetItemCategories,
  GetItemUOMs,
  GetNafdacsCategories,
  GetCrias,
  GetNafdacNames,
  GetCategory,
  GetSubCategory,
  GetItemSuperCategoriesTypes
} from '../../../Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import { styled } from '@mui/material/styles';
import SelectFieldPadding from 'components/selectFieldPadding';
import CustomNumberField from 'components/NoArrowTextField';
import FieldPadding from 'components/FieldPadding';

const VisuallyHiddenInput = styled('input')({
  display: 'none'
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
  };
}

export default function ItemForm({ onClose, onFormSubmit, formMode }) {
  const dispatch = useDispatch();

  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setFieldValue('unitOfMeasurement', value);
  };

  const {
    itemCategories,
    itemUOMs,
    nafdacs,
    crias,
    nafdacNames,
    category: group,
    subCategory,
    superCategory
  } = useSelector((state) => state.itemMaster);
  const { vendors } = useSelector((state) => state.vendorMaster);
  const [initialValues, setInitialValues] = useState({
    itemName: '',
    itemCode: '',
    baseItem: '',
    itemDescription: '',
    itemType: '',
    hsnCode: '',
    unitOfMeasurement: [],
    cria: '',
    itemImageUrl: null,
    notes: '',
    quantityInStock: '',
    maximumQty: '',
    nafdac: '',
    nafdacRequired: '',
    nafdacAvailable: '',
    criaRequired: '',
    nafdacCategory: '',
    tolerance: '',
    reorderLevel: '',
    unitPrice: '',
    msrp: '',
    isDiscontinued: '',
    venders: '',
    group: '',
    subGroup: '',
    superCategory: ''
  });
  const [showTableHeading, setShowTableHeading] = useState({
    userPersonalDetail: true,
    userAddressDetails: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState();
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    vendors.length === 0 && GetVendors(dispatch);
    itemCategories.length === 0 && GetItemCategories(dispatch);
    itemUOMs.length === 0 && GetItemUOMs(dispatch);
    nafdacs.length === 0 && GetNafdacsCategories(dispatch);
    crias.length === 0 && GetCrias(dispatch);
    nafdacNames.length === 0 && GetNafdacNames(dispatch);
    group.length === 0 && GetCategory(dispatch);
    superCategory.length === 0 && GetItemSuperCategoriesTypes(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log('uom data', itemUOMs);
  const validationSchema = Yup.object({
    itemCode: Yup.string().required('Item Code is required'),
    itemName: Yup.string().required('Item Name is required'),
    itemDescription: Yup.string().required('Item Description is required'),
    itemType: Yup.string().required('Item Type is required'),
    hsnCode: Yup.number().required('HSN Code is required').typeError('HSN Code must be a number'),
    unitOfMeasurement: Yup.string().required('Unit of Measurement is required'),
    cria: Yup.string().required('CRIA is required'),
    unitPrice: Yup.number().required('Unit Price is required').typeError('Unit Price must be a number'),
    notes: Yup.string().required('Remarks are required'),
    quantityInStock: Yup.number().typeError('Please enter only number').required('Quantity In Stock is required'),

    maximumQty: Yup.number().typeError('Please enter only number').required('Maximum Quantity is required'),
    nafdac: Yup.string().required('NAFDAC Name is required'),
    nafdacCategory: Yup.string().required('NAFDAC Category is required'),
    tolerance: Yup.number().typeError('Please enter only number').required('Tolerance is required'),
    reorderLevel: Yup.number().typeError('Please enter only number').required('Reorder Level is required'),
    msrp: Yup.number().typeError('Please enter only number').required('MSRP is required'),
    isDiscontinued: Yup.string().required('Discontinuation status is required'),
    venders: Yup.string().required('Vendors are required'),
    nafdacRequired: Yup.string().required('NAFDAC Required is required'),
    nafdacAvailable: Yup.string().required('NAFDAC Available is required'),
    criaRequired: Yup.string().required('CRIA Required is required'),
    group: Yup.string().required('Group is required'),
    subGroup: Yup.string().required('Subgroup is required')
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (e.target.name === 'group') {
      await GetSubCategory(dispatch, e.target.value);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file);

      setFormValues({ ...formValues, itemImageUrl: file });
    }
  };
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={8}>
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const mapFrontendToBackendKeys = (formValues) => {
      const formData = new FormData();
      formData.append('item_name', formValues.itemName);
      formData.append('item_code', formValues.itemCode);
      formData.append('item_type', formValues.itemType);
      formData.append('item_description', formValues.itemDescription);
      formData.append('uom_id', formValues.unitOfMeasurement.join(','));
      formData.append('cria', formValues.cria);
      formData.append('hsn_code', formValues.hsnCode);
      formData.append('quantity_in_stock', formValues.quantityInStock);
      formData.append('quantity_on_order', formValues.maximumQty);
      formData.append('nafdac_name', formValues.nafdac);
      formData.append('nafdac_category', formValues.nafdacCategory);
      formData.append('tolerance', formValues.tolerance);
      formData.append('reorder_level', formValues.reorderLevel);
      formData.append('unit_price', formValues.unitPrice);
      formData.append('msrp', formValues.msrp);
      formData.append('is_discontinued', formValues.isDiscontinued);
      formData.append('item_image', fileName);
      formData.append('nafdacRequired', formValues.nafdacRequired);
      formData.append('nafdacAvailable', formValues.nafdacAvailable);
      formData.append('criaRequired', formValues.criaRequired);
      formData.append('notes', formValues.notes);
      formData.append('vendor_id', formValues.venders);
      formData.append('superCategory', formValues.superCategory);
      formData.append('group_name', formValues.group);
      formData.append('sub_group', formValues.subGroup);
      return formData;
    };

    try {
      await CreateItem(dispatch, mapFrontendToBackendKeys(values));
      onFormSubmit();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Table>
              {renderTableHeader('userPersonalDetail', 'Basic Info')}
              {showTableHeading.userPersonalDetail && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Item Code<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="itemCode" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="itemCode" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Item Name<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="itemName" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="itemName" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Item Description<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="itemDescription" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="itemDescription" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Item Type<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="itemType" variant="outlined" value={values.itemType} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {itemCategories?.map((item, index) => (
                              <MenuItem key={index} value={item.category_name}>
                                {item.category_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="itemType" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            HSN Code<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={CustomNumberField} type="number" name="hsnCode" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="hsnCode" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            CRIA<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="cria" variant="outlined" value={values.cria} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {crias.map((item, index) => (
                              <MenuItem key={index} value={item.cria_name}>
                                {item.cria_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="cria" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">Item Image</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div>
                            <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                              Upload File
                              <VisuallyHiddenInput type="file" name="itemImageUrl" id="itemImageUrl" onChange={handleFileChange} />
                            </Button>
                            {fileName && <span style={{ color: 'blue' }}>{fileName.name}</span>}
                          </div>
                        </Grid>
                        {/* super categorie */}
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Super Category<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field
                            as={SelectFieldPadding}
                            onChange={(e) => {
                              setFieldValue('superCategory', e.target.value);
                              GetCategory(dispatch, e.target.value);
                            }}
                            name="superCategory"
                            variant="outlined"
                            value={values.superCategory}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {superCategory.map((item, index) => (
                              <MenuItem key={index} value={item.item_super_group_id}>
                                {item.item_super_group_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="super_Category" component="div" style={errorMessageStyle} />
                        </Grid>
                        {/* Category */}
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Category<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field
                            as={SelectFieldPadding}
                            name="group"
                            onChange={(e) => {
                              handleInputChange(e);
                              setFieldValue('group', e.target.value);
                            }}
                            variant="outlined"
                            value={values.group}
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {group.map((data) => (
                              <MenuItem key={data.id} value={data.item_group_id}>
                                {data.item_group_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="group" component="div" style={errorMessageStyle} />
                        </Grid>
                        {/* sub category */}
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Sub Category<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="subGroup" variant="outlined" value={values.subGroup} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {subCategory.map((item, index) => (
                              <MenuItem key={index} value={item.item_sub_group_id}>
                                {item.item_sub_group_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="subGroup" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Unit Price<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={CustomNumberField} type="number" name="unitPrice" variant="outlined" fullWidth size="small" />
                          <ErrorMessage name="unitPrice" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Unit Of Measurements<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field name="unitOfMeasurement">
                            {({ field, form }) => (
                              <FormControl variant="outlined" fullWidth size="small">
                                <Select
                                  multiple
                                  displayEmpty
                                  value={field.value}
                                  onChange={(event) => {
                                    const {
                                      target: { value }
                                    } = event;
                                    form.setFieldValue(field.name, value);
                                  }}
                                  input={<OutlinedInput />}
                                  renderValue={(selected) => {
                                    if (selected.length === 0) {
                                      return <em>select</em>;
                                    }
                                    return selected
                                      .map((id) => {
                                        const selectedItem = itemUOMs.find((item) => item.uom_id === id);
                                        return selectedItem ? selectedItem.uom_name : id;
                                      })
                                      .join(', ');
                                  }}
                                  MenuProps={MenuProps}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                >
                                  <MenuItem disabled value="">
                                    <em>select</em>
                                  </MenuItem>
                                  {itemUOMs.map((data) => (
                                    <MenuItem key={data.uom_id} value={data.uom_id} style={getStyles(data.uom_name, field.value, theme)}>
                                      {data.uom_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Field>

                          {/* {names.map((name) => (
                                    <MenuItem key={name} value={name} style={getStyles(name, field.value, theme)}>
                                      {name}
                                    </MenuItem>
                                  ))} */}
                          <ErrorMessage name="unitOfMeasurement" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} alignItems="center" marginTop={1}>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Remarks<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Field as={FieldPadding} name="notes" variant="outlined" fullWidth size="small" rows={2} />
                          <ErrorMessage name="notes" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Table>
              {renderTableHeader('userAddressDetails', 'Other Details')}
              {showTableHeading.userAddressDetails && (
                <TableBody>
                  <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <TableCell colSpan={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Quantity In Stock<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="quantityInStock" variant="outlined" fullWidth size="small" rows={2} />
                          <ErrorMessage name="quantityInStock" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Maximum Quantity<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="maximumQty" variant="outlined" fullWidth size="small" rows={2} />
                          <ErrorMessage name="maximumQty" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            NAFDAC Name<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="nafdac" variant="outlined" value={values.nafdac} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {nafdacNames?.map((item, index) => (
                              <MenuItem key={index} value={item.nafdac_name}>
                                {item.nafdac_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="nafdac" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            NAFDAC Category<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="nafdacCategory" variant="outlined" value={values.nafdacCategory} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {nafdacs?.map((item, index) => (
                              <MenuItem key={index} value={item.nafdac_category_name}>
                                {item.nafdac_category_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="nafdacCategory" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Tolerance<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="tolerance" variant="outlined" fullWidth size="small" rows={2} />
                          <ErrorMessage name="tolerance" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Reorder Level<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="reorderLevel" variant="outlined" fullWidth size="small" rows={2} />
                          <ErrorMessage name="reorderLevel" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            MSRP<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={FieldPadding} name="msrp" variant="outlined" fullWidth size="small" rows={2} />
                          <ErrorMessage name="msrp" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Is Discontinued<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="isDiscontinued" variant="outlined" value={values.isDiscontinued} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="1">Yes</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                          </Field>
                          <ErrorMessage name="isDiscontinued" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            Vendors<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="venders" variant="outlined" value={values.venders} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {vendors.map((data) => (
                              <MenuItem key={data.id} value={data.vendor_id}>
                                {data.vendor_name}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage name="venders" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            NAFDAC Required<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="nafdacRequired" variant="outlined" value={values.nafdacRequired} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Field>
                          <ErrorMessage name="nafdacRequired" component="div" style={errorMessageStyle} />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            NAFDAC Available<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="nafdacAvailable" variant="outlined" value={values.nafdacAvailable} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Field>
                          <ErrorMessage name="nafdacAvailable" component="div" style={errorMessageStyle} />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle1">
                            CRIA Required<ValidationStar>*</ValidationStar>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Field as={SelectFieldPadding} name="criaRequired" variant="outlined" value={values.criaRequired} fullWidth>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Field>
                          <ErrorMessage name="criaRequired" component="div" style={errorMessageStyle} />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                {formMode === 'create' ? 'Submit' : 'Update'}
              </Button>
              <Button variant="outlined" color="error" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
