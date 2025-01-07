// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { CreateVendor } from '../../../Redux/Apis/PostApiCalls';
import { useDispatch } from 'react-redux';
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
  Autocomplete
} from '@mui/material';
import SelectFieldPadding from 'components/selectFieldPadding';
import { Country } from 'country-state-city';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import ValidationStar from 'components/ValidationStar';

const VisuallyHiddenInput = styled('input')({
  display: 'none'
});

const initialFormValues = {
  vendor_name: '',
  email: '',
  phone_number: '',
  alternate_phone_number: '',
  vendor_type_id: '',
  vendor_status: '',
  registration_date: '',
  tax_id: '',
  contact_person: '',
  contact_person_phone: '',
  contact_person_email: '',
  payment_terms_id: '',
  reference_by: '',
  compilanceStatus: '',
  file: null,
  pan_num: '',
  tin_num: '',
  gst_num: '',
  vat_num: '',
  remark: ''
};
export default function VenderForm({ onClose, formMode, onSuccessfulSubmit }) {
  const dispatch = useDispatch();
  const [showTableHeading, setShowTableHeading] = useState({
    contactInformation: true,
    currentAddress: true,
    officeAddress: true,
    factoryAddress: true,
    permanentAddress: true,
    complianceInformation: true,
    bankDetails: true,
    otherInformation: true
  });
  function getCountry() {
    let countries = Country.getAllCountries();

    const uniqueByName = countries.reduce((accumulator, current) => {
      const nameExists = accumulator.some((item) => item.currency === current.currency);
      if (!nameExists) {
        accumulator.push({
          currency: current.currency,
          name: current.name,
          isoCode: current.isoCode
        });
      }
      return accumulator;
    }, []);
    setCountries(uniqueByName);
  }
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryId, setCountryId] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const sortedCountries = countries.sort((a, b) => {
    return a.currency.localeCompare(b.currency);
  });
  const validateForm = () => {
    let errors = {};
    if (!formValues.vendor_name) {
      errors.vendor_name = 'Vendor Name is required';
    }
    if (!formValues.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formValues.phone_number) {
      errors.phone_number = 'Phone Number is required';
    }
    // else if (!/^\d{10}$/.test(formValues.phone_number)) {
    //   errors.phone_number = 'Phone Number must be 10 digits';
    // }
    if (!formValues.alternate_phone_number) {
      errors.alternate_phone_number = 'Alternate Phone Number is required';
    }
    if (!formValues.vendor_type_id) {
      errors.vendor_type_id = 'Vendor Type is required';
    }
    if (!formValues.vendor_status) {
      errors.vendor_status = 'Vendor Status is required';
    }
    if (!formValues.registration_date) {
      errors.registration_date = 'Registration Date is required';
    }
    if (!formValues.gst_num && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}Z\d{1}$/.test(formValues.gst_num)) {
      errors.gst_num = 'GST Number is invalid';
    }
    if (!formValues.tax_id) {
      errors.tax_id = 'Tax Id Number is invalid';
    }
    if (!formValues.contact_person) {
      errors.contact_person = 'Contact person is required';
    }
    if (!formValues.contact_person_phone) {
      errors.contact_person_phone = 'Contact person Phone Number is required';
    }
    if (!formValues.contact_person_email) {
      errors.contact_person_email = 'contact_person_email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.contact_person_email)) {
      errors.contact_person_email = 'contact_person_email address is invalid';
    }
    if (!formValues.payment_terms_id) {
      errors.payment_terms_id = 'Payment Term is required';
    }
    if (!formValues.reference_by) {
      errors.reference_by = 'Reference By is required';
    }
    if (!formValues.compilanceStatus) {
      errors.compilanceStatus = 'Compliance Status is required';
    }
    return errors;
  };

  useEffect(() => {
    getCountry();
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

  const handleCountryChange = async (e, nv, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e]: nv.name };
    setAddress(updatedAddress);

    setCountryId(countriesList.filter((item) => item.name === nv.name)[0].id);
    GetState(countriesList.filter((item) => item.name === nv.name)[0].id).then((result) => {
      setStateList(result);
    });
  };
  const handleStateChange = async (e, nv, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e]: nv.name };
    setAddress(updatedAddress);

    GetCity(countryId, stateList.filter((item) => item.name === nv.name)[0].id).then((result) => {
      setCityList(result);
    });
  };

  const handleCityChange = async (e, nv, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e]: nv.name };
    setAddress(updatedAddress);
  };

  const [complianceFile, setComplianceFile] = useState(null);

  const [addresses, setAddress] = useState([
    {
      address_type_id: 1,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    }
  ]);

  const [bank, setBank] = useState([
    {
      bank_type_id: 1,
      bank_name: '',
      address: '',
      branch: '',
      country: '',
      shortCode: '',
      swiftCode: '',
      currency: '',
      bank_account_number: '',
      bank_ifsc_code: '',
      swift_code: '',
      notes: '',
      bank_ref_cheque: null
    }
  ]);

  const handleChangeBank = (e, index) => {
    const updatedBank = [...bank];
    updatedBank[index] = { ...updatedBank[index], [e.target.name]: e.target.value };
    setBank(updatedBank);
  };

  const handleChangeAddress = (e, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e.target.name]: e.target.value };
    setAddress(updatedAddress);
  };

  const vendorData = [
    { id: 10, name: 'Vendor Type 1' },
    { id: 20, name: 'Vendor Type 2' },
    { id: 30, name: 'Vendor Type 3' }
  ];

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

  const removeElement = (indexToRemove) => {
    const updatedBank = [...bank];
    updatedBank.splice(indexToRemove, 1);
    setBank(updatedBank);
  };

  const removeAddress = (indexToRemove) => {
    const updatedAdd = [...bank];
    updatedAdd.splice(indexToRemove, 1);
    setAddress(updatedAdd);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleComplianceFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setComplianceFile(file);
      setFormValues({ ...formValues, file: file });
    }
  };
  const handleChequeFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedBank = [...bank];
      updatedBank[index] = { ...updatedBank[index], cheque: file };
      setBank(updatedBank);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const formdata = {
          vendorDetails: formValues,
          bankDetails: bank,
          addressDetails: addresses
        };
        await CreateVendor(dispatch, formdata);

        if (onSuccessfulSubmit) {
          onSuccessfulSubmit();
        }
        console.log('Form submitted successfully:', response.data);
      } catch (error) {
        console.error('Error submitting the form:', error);
      }

      setFormData(initialFormData);
    }

    // eslint-disable-next-line no-constant-condition
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Table>
          {renderTableHeader('contactInformation', 'BASIC INFO')}
          {showTableHeading.contactInformation && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Vendor Name<ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="vendor_name"
                        name="vendor_name"
                        variant="outlined"
                        fullWidth
                        value={formValues.vendor_name}
                        onChange={handleInputChange}
                        error={!!formErrors.vendor_name}
                        helperText={formErrors.vendor_name}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Email <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        value={formValues.email}
                        onChange={handleInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Phone Number <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="phone_number"
                        name="phone_number"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.phone_number}
                        onChange={handleInputChange}
                        error={!!formErrors.phone_number}
                        helperText={formErrors.phone_number}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Alternate Phone No. <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="alternate_phone_number"
                        name="alternate_phone_number"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.alternate_phone_number}
                        onChange={handleInputChange}
                        error={!!formErrors.alternate_phone_number}
                        helperText={formErrors.alternate_phone_number}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Vendor Type <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          labelId="vendor_type_id-label"
                          id="vendor_type_id"
                          name="vendor_type_id"
                          value={formValues.vendor_type_id}
                          onChange={handleInputChange}
                          error={!!formErrors.vendor_type_id}
                          helperText={formErrors.vendor_type_id}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {vendorData.map((vendor) => (
                            <MenuItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Vendor Status <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          labelId="vendor_status-label"
                          id="vendor_status"
                          name="vendor_status"
                          value={formValues.vendor_status}
                          onChange={handleInputChange}
                          error={!!formErrors.vendor_status}
                          helperText={formErrors.vendor_status}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={1}>Active</MenuItem>
                          <MenuItem value={0}>Inactive</MenuItem>
                          <MenuItem value={3}>Blacklisted</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Registration Date <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="registration_date"
                        name="registration_date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={formValues.registration_date}
                        onChange={handleInputChange}
                        error={!!formErrors.registration_date}
                        helperText={formErrors.registration_date}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Tax ID <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="tax_id"
                        name="tax_id"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.tax_id}
                        onChange={handleInputChange}
                        error={!!formErrors.tax_id}
                        helperText={formErrors.tax_id}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Contact Person <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contact_person"
                        name="contact_person"
                        variant="outlined"
                        fullWidth
                        value={formValues.contact_person}
                        onChange={handleInputChange}
                        error={!!formErrors.contact_person}
                        helperText={formErrors.contact_person}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Contact Phone <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contact_person_phone"
                        name="contact_person_phone"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.contact_person_phone}
                        onChange={handleInputChange}
                        error={!!formErrors.contact_person_phone}
                        helperText={formErrors.contact_person_phone}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Contact Email <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contact_person_email"
                        name="contact_person_email"
                        variant="outlined"
                        fullWidth
                        value={formValues.contact_person_email}
                        error={!!formErrors.contact_person_email}
                        helperText={formErrors.contact_person_email}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Payment Term <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="payment_terms_id"
                        name="payment_terms_id"
                        variant="outlined"
                        fullWidth
                        value={formValues.payment_terms_id}
                        onChange={handleInputChange}
                        error={!!formErrors.payment_terms_id}
                        helperText={formErrors.payment_terms_id}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Reference By <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="reference_by"
                        name="reference_by"
                        variant="outlined"
                        fullWidth
                        value={formValues.reference_by}
                        onChange={handleInputChange}
                        error={!!formErrors.reference_by}
                        helperText={formErrors.reference_by}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Remark</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id="remark"
                        name="remark"
                        variant="outlined"
                        fullWidth
                        value={formValues.remark}
                        onChange={handleInputChange}
                        error={!!formErrors.remark}
                        helperText={formErrors.remark}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Currency</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          as={SelectFieldPadding}
                          id="currency"
                          name="currency"
                          value={[formValues.currency]}
                          onChange={handleInputChange}
                          multiple
                        >
                          <MenuItem value="">
                            <em>select</em>
                          </MenuItem>
                          {sortedCountries.map((data) => (
                            <MenuItem key={data.currency} value={data.currency}>
                              {data.currency}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.currency && <FormHelperText error>{errors.currency}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Table>
          {renderTableHeader('addresses', 'Addresses')}
          {showTableHeading.currentAddress && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  {addresses.map((address, index) => (
                    <Grid
                      sx={{ margin: '10px 0px', padding: '10px', border: '2px dashed black', borderRadius: '5px' }}
                      key={index}
                      container
                      spacing={2}
                      alignItems="center"
                    >
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Address Line 1</Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          id="address_line1"
                          name="address_line1"
                          variant="outlined"
                          fullWidth
                          value={address.address_line1}
                          onChange={(e) => handleChangeAddress(e, index)}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.address1 && <FormHelperText error>{errors.address1}</FormHelperText>}
                      </Grid>
                      {/* Address 2 */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1">Address Line 2</Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          id="address_line2"
                          name="address_line2"
                          variant="outlined"
                          fullWidth
                          value={address.address_line2}
                          onChange={(e) => handleChangeAddress(e, index)}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.address_line2 && <FormHelperText error>{errors.address_line2}</FormHelperText>}
                      </Grid>
                      {/* Country */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1" align="left">
                          Country
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          id="country"
                          name="country"
                          options={countriesList}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                          value={{ name: address.country }}
                          onChange={(event, value) => {
                            handleCountryChange('country', value, index);
                            // handleChangeAddress(e, index);
                          }}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </Grid>
                      {/* State */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1" align="left">
                          State
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          id="state"
                          name="state"
                          options={stateList}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                          value={{ name: address.state }}
                          onChange={(event, value) => {
                            handleStateChange('state', value, index);
                            // handleChangeAddress(e, index);
                          }}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </Grid>
                      {/* City */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1" align="left">
                          City
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Autocomplete
                          id="city"
                          name="city"
                          options={cityList}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                          value={{ name: address.city }}
                          onChange={(event, value) => {
                            handleCityChange('city', value, index);
                            // handleChangeAddress(e, index);
                          }}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </Grid>
                      {/* Pincode */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1" align="left">
                          Pincode
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          id="postal_code"
                          name="postal_code"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={address.postal_code}
                          onChange={(e) => handleChangeAddress(e, index)}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              padding: '8px'
                            }
                          }}
                        />
                        {!!errors.postal_code && <FormHelperText error>{errors.postal_code}</FormHelperText>}
                      </Grid>
                      {/* Address Type  */}
                      <Grid item xs={12} sm={1}>
                        <Typography variant="subtitle1" align="left">
                          Address type
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <FormControl variant="outlined" fullWidth>
                          <Select
                            id="address_type_id"
                            name="address_type_id"
                            value={address.address_type_id}
                            onChange={(e) => handleChangeAddress(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          >
                            <MenuItem value={0}>
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={1}>Current Address</MenuItem>
                            <MenuItem value={2}>Permanent Address</MenuItem>
                          </Select>
                          {!!errors.country && <FormHelperText error>{errors.country}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}></Grid>
                      {addresses.length === index + 1 && addresses.length < 4 && (
                        <Grid item xs={12} sm={2}>
                          <Button
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              setAddress((prevAddress) => [
                                ...prevAddress,
                                {
                                  address_type_id: 0,
                                  address_line1: '',
                                  address_line2: '',
                                  city: '',
                                  state: '',
                                  country: '',
                                  postal_code: ''
                                }
                              ])
                            }
                          >
                            Add More
                          </Button>
                        </Grid>
                      )}
                      {addresses.length === index + 1 && <Grid item xs={12} sm={1}></Grid>}
                      {addresses.length > 1 && (
                        <Grid item xs={12} sm={2}>
                          <Button
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                            variant="outlined"
                            color="error"
                            onClick={() => removeAddress(index)}
                          >
                            Remove
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        {/* Compliance Status */}
        <Table>
          {renderTableHeader('complianceInformation', 'Compliance Information')}
          {showTableHeading.complianceInformation && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Compliance Status</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="compilanceStatus"
                        name="compilanceStatus"
                        variant="outlined"
                        fullWidth
                        value={formValues.compilanceStatus}
                        onChange={handleInputChange}
                        error={!!formErrors.compilanceStatus}
                        helperText={formErrors.compilanceStatus}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Last Audited Docs</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div>
                        <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                          Upload File
                          <VisuallyHiddenInput
                            type="file"
                            name="last_audited_docs"
                            id="last_audited_docs"
                            onChange={handleComplianceFileChange}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Button>
                        {complianceFile?.name && <span style={{ color: 'blue' }}>{complianceFile?.name}</span>}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">PAN Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="pan_num"
                        name="pan_num"
                        variant="outlined"
                        fullWidth
                        value={formValues.pan_num}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">TIN Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="tin_num"
                        name="tin_num"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.tin_num}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">GST Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="gst_num"
                        name="gst_num"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.gst_num}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">VAT Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="vat_num"
                        name="vat_num"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.vat_num}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('bankDetails', 'Bank Detail')}
          {showTableHeading.bankDetails && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={1} alignItems="center">
                    {bank.map((item, index) => (
                      <Grid
                        container
                        key={index}
                        spacing={2}
                        sx={{ margin: '10px 0px', padding: '10px', border: '2px dashed black', borderRadius: '5px' }}
                      >
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Name</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="bank_name"
                            name="bank_name"
                            variant="outlined"
                            fullWidth
                            value={item.bank_name}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Address</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="address"
                            name="address"
                            variant="outlined"
                            fullWidth
                            value={item.address}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Branch</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="branch"
                            name="branch"
                            variant="outlined"
                            fullWidth
                            value={item.branch}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Country</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="country"
                            name="country"
                            variant="outlined"
                            fullWidth
                            value={item.country}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Short Code</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="shortCode"
                            name="shortCode"
                            variant="outlined"
                            fullWidth
                            value={item.shortCode}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Code</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="swiftCode"
                            name="swiftCode"
                            variant="outlined"
                            fullWidth
                            value={item.swiftCode}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank{index + 1} Currency</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="currency"
                            name="currency"
                            variant="outlined"
                            fullWidth
                            value={item.currency}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">A/C No.</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="bank_account_number"
                            name="bank_account_number"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={item.bank_account_number}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">IFSC Code</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="bank_ifsc_code"
                            name="bank_ifsc_code"
                            variant="outlined"
                            fullWidth
                            value={item.bank_ifsc_code}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Swift Code</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="swift_code"
                            name="swift_code"
                            variant="outlined"
                            fullWidth
                            value={item.swift_code}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Notes</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            id="notes"
                            name="notes"
                            variant="outlined"
                            fullWidth
                            value={item.notes}
                            onChange={(e) => handleChangeBank(e, index)}
                            sx={{
                              '& .MuiOutlinedInput-input': {
                                padding: '8px'
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1">Bank Ref Cheque</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <div style={{ display: 'flex', width: 'inherit' }}>
                            <Button
                              component="label"
                              sx={{
                                marginBottom: '0',
                                width: '100%',
                                '& .MuiOutlinedInput-input': {
                                  padding: '8px'
                                }
                              }}
                              variant="contained"
                              startIcon={<CloudUploadIcon />}
                              fullWidth
                            >
                              Upload File
                              <VisuallyHiddenInput
                                type="file"
                                name="bank_ref_cheque"
                                id="bank_ref_cheque"
                                onChange={(e) => handleChequeFileChange(e, index)}
                              />
                            </Button>
                            {item?.bank_ref_cheque?.name && <span style={{ color: 'blue' }}>{item?.bank_ref_cheque?.name}</span>}
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={2}></Grid>
                        <Grid item xs={12} sm={2}>
                          {bank.length > 1 && (
                            <Button
                              onClick={() => removeElement(index)}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-input': {
                                  padding: '8px'
                                }
                              }}
                              variant="outlined"
                              color="error"
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid item xs={12} sm={2}>
                      <Button
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-input': {
                            padding: '8px'
                          }
                        }}
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setBank((prevBank) => [
                            ...prevBank,
                            {
                              bank_type_id: 1,
                              bank_name: '',
                              address: '',
                              branch: '',
                              country: '',
                              shortCode: '',
                              swiftCode: '',
                              currency: '',
                              bank_account_number: '',
                              bank_ifsc_code: '',
                              notes: '',
                              bank_ref_cheque: null
                            }
                          ])
                        }
                      >
                        Add More
                      </Button>
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
      </form>
    </>
  );
}
