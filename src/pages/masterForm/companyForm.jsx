// project-imports
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
// import { CreateVendor } from '../../../Redux/Apis/PostApiCalls';
import { axiosInstance } from 'utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
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
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { GetAddressTypes, GetVerticles } from 'Redux/Apis/GetApiCalls';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import ValidationStar from 'components/ValidationStar';

const initialFormValues = {
  companyName: '',
  email: '',
  phoneNumber: '',
  alterntPhoneNumber: '',
  companyStatus: '',
  companyVerticle: '',
  registrationDate: '',
  taxId: '',
  contactPerson: '',
  contactPerPhn: '',
  ContPerEmail: '',
  remark: ''
};
export default function CompanyForm({ onClose, setFormshow, onSuccessfulSubmit }) {
  const dispatch = useDispatch();
  const { address_types, verticles } = useSelector((state) => state.static);
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
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryId, setCountryId] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!formValues.companyName) {
      errors.companyName = 'Company Name is required';
    }
    if (!formValues.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formValues.phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
    }
    // else if (!/^\d{10}$/.test(formValues.phoneNumber)) {
    //   errors.phoneNumber = 'Phone Number must be 10 digits';
    // }
    if (!formValues.alterntPhoneNumber) {
      errors.alterntPhoneNumber = 'Alternate Phone Number is required';
    }
    if (!formValues.companyStatus) {
      errors.companyStatus = 'Company Status is required';
    }
    if (!formValues.registrationDate) {
      errors.registrationDate = 'Registration Date is required';
    }
    if (!formValues.taxId) {
      errors.taxId = 'Tax Id Number is invalid';
    }
    if (!formValues.contactPerson) {
      errors.contactPerson = 'Contact person is required';
    }
    if (!formValues.contactPerPhn) {
      errors.contactPerPhn = 'Contact person Phone Number is required';
    }
    if (!formValues.ContPerEmail) {
      errors.ContPerEmail = 'ContPerEmail is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.ContPerEmail)) {
      errors.ContPerEmail = 'ContPerEmail address is invalid';
    }
    return errors;
  };

  useEffect(() => {
    address_types.length === 0 && GetAddressTypes(dispatch);
    verticles.length === 0 && GetVerticles(dispatch);
    GetCountries().then((result) => {
      setCountriesList(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const [addresses, setAddress] = useState([
    {
      address_type: 1,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    }
  ]);

  const handleChangeAddress = (e, index) => {
    const updatedAddress = [...addresses];
    updatedAddress[index] = { ...updatedAddress[index], [e.target.name]: e.target.value };
    setAddress(updatedAddress);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const mappedData = {
          company_name: formValues.companyName,
          phone_number: formValues.phoneNumber,
          alternate_phone_number: formValues.alterntPhoneNumber,
          email: formValues.email,
          contact_person: formValues.contactPerson,
          contact_person_phone: formValues.contactPerPhn,
          contact_person_email: formValues.ContPerEmail,
          registration_date: formValues.registrationDate,
          status: formValues.companyStatus,
          vertical_id: formValues.companyVerticle
        };
        const formdata = {
          companyData: mappedData,
          addressData: addresses
        };
        console.log(formdata);
        await axiosInstance.post('api/company/v1', formdata);
        setFormshow((val) => !val);
        if (onSuccessfulSubmit) {
          onSuccessfulSubmit();
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
      }

      setFormData(initialFormData);
    }

    // eslint-disable-next-line no-constant-condition
  };
  return (
    <div style={{ marginRight: '15px' }}>
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
                        Verticle <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          labelId="companyVerticle-label"
                          id="companyVerticle"
                          name="companyVerticle"
                          value={formValues.companyVerticle}
                          onChange={handleInputChange}
                          error={!!formErrors.companyVerticle}
                          helperText={formErrors.companyVerticle}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {verticles?.map((item, index) => (
                            <MenuItem key={index} value={item?.vertical_id}>
                              {item?.vertical_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Company Name<ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="companyName"
                        name="companyName"
                        variant="outlined"
                        fullWidth
                        value={formValues.companyName}
                        onChange={handleInputChange}
                        error={!!formErrors.companyName}
                        helperText={formErrors.companyName}
                        sx={{ padding: '5px' }}
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Phone Number <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.phoneNumber}
                        onChange={handleInputChange}
                        error={!!formErrors.phoneNumber}
                        helperText={formErrors.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Alternate Phone No. <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="alterntPhoneNumber"
                        name="alterntPhoneNumber"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.alterntPhoneNumber}
                        onChange={handleInputChange}
                        error={!!formErrors.alterntPhoneNumber}
                        helperText={formErrors.alterntPhoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Status <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          labelId="companyStatus-label"
                          id="companyStatus"
                          name="companyStatus"
                          value={formValues.companyStatus}
                          onChange={handleInputChange}
                          error={!!formErrors.companyStatus}
                          helperText={formErrors.companyStatus}
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
                        id="registrationDate"
                        name="registrationDate"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={formValues.registrationDate}
                        onChange={handleInputChange}
                        error={!!formErrors.registrationDate}
                        helperText={formErrors.registrationDate}
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
                        id="taxId"
                        name="taxId"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.taxId}
                        onChange={handleInputChange}
                        error={!!formErrors.taxId}
                        helperText={formErrors.taxId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Contact Person <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contactPerson"
                        name="contactPerson"
                        variant="outlined"
                        fullWidth
                        value={formValues.contactPerson}
                        onChange={handleInputChange}
                        error={!!formErrors.contactPerson}
                        helperText={formErrors.contactPerson}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Contact Phone <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contactPerPhn"
                        name="contactPerPhn"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.contactPerPhn}
                        onChange={handleInputChange}
                        error={!!formErrors.contactPerPhn}
                        helperText={formErrors.contactPerPhn}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Contact Email <ValidationStar>*</ValidationStar>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="ContPerEmail"
                        name="ContPerEmail"
                        variant="outlined"
                        fullWidth
                        value={formValues.ContPerEmail}
                        error={!!formErrors.ContPerEmail}
                        helperText={formErrors.ContPerEmail}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Remark</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="remark"
                        name="remark"
                        variant="outlined"
                        fullWidth
                        value={formValues.remark}
                        onChange={handleInputChange}
                        error={!!formErrors.remark}
                        helperText={formErrors.remark}
                      />
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
                            id="address_type"
                            name="address_type"
                            value={address.address_type}
                            onChange={(e) => handleChangeAddress(e, index)}
                          >
                            <MenuItem value={0}>
                              <em>None</em>
                            </MenuItem>
                            {address_types?.map((item, index) => (
                              <MenuItem key={index} value={item.address_type_name}>
                                {item.address_type_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {!!errors.country && <FormHelperText error>{errors.country}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}></Grid>
                      {addresses.length === index + 1 && addresses.length < 4 && (
                        <Grid item xs={12} sm={2}>
                          <Button
                            sx={{ width: '100%' }}
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
                          <Button sx={{ width: '100%' }} variant="outlined" color="error" onClick={() => removeAddress(index)}>
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  );
}
