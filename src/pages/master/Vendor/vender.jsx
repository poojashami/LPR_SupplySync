import { Button, Box, Link } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';
import VenderForm from './venderForm';
import ViewVendor from './venderView';
import { GetVendors, GetPaymentTerms } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import PlusButton from 'components/CustomButton';
// ==============================|| Vendor Page ||============================== //

export default function VendorsPages() {
  const dispatch = useDispatch();
  const { isFetching, vendors } = useSelector((state) => state.vendorMaster);
  const { paymentTerms } = useSelector((state) => state.paymentTerms);
  const [showVenderForm, setShowVenderForm] = useState(false);
  const [showViewVendor, setShowViewVendor] = useState(false);
  const [selectedVender, setSelectedVender] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [venderData, setVenderData] = useState([]);

  useEffect(() => {
    GetPaymentTerms();
    getVenderAPI();
  }, []);

  useEffect(() => {
    console.log(paymentTerms);
  }, [paymentTerms]);

  useEffect(() => {
    const mappedData = vendors.map((item, index) => ({
      id: index + 1,
      vendor_series: item.vendor_series,
      vendorName: item.vendor_name,
      addressLine1: item.address_line1,
      addressLine2: item.address_line2,
      city: item.city_name,
      country: item.country_name,
      state: item.state_name,
      pincode: item.postal_code,
      addressLine11: item.address_line3,
      addressLine22: item.address_line4,
      city1: item.city_name1,
      country1: item.country_name1,
      state1: item.state_name1,
      pincode1: item.postal_code1,
      phoneNumber: item.phone_number,
      alternate_phone_number: item.alternate_phone_number,
      email: item.email,
      contactPerson: item.contact_person,
      contactPersonPhone: item.contact_person_phone,
      contactPersonEmail: item.contact_person_email,
      taxId: item.tax_id,
      paymentTerms: item.payment_terms,
      currentAddress: `${item?.address_line1} ${item?.address_line2} ${item?.city_name} ${item?.state_name} ${item?.country_name} ${item?.postal_code}`,
      permanentAddress: `${item?.address_line3} ${item?.address_line4} ${item?.city_name1} ${item?.state_name1} ${item?.country_name1} ${item?.postal_code1}`,
      bankName: item.bank1_name,
      bankName1: item.bank2_name,
      bankAccountNumber: item.bank1_account_number,
      bankAccountNumber1: item.bank2_account_number,
      bankIfscCode: item.bank1_ifsc_code,
      bankIfscCode1: item.bank2_ifsc_code,
      bank1_ref_cheque: item.bank1_ref_cheque,
      bank1_ref_cheque_name: item.bank1_ref_cheque_name,
      bank2_ref_cheque: item.bank2_ref_cheque,
      bank2_ref_cheque_name: item.bank2_ref_cheque_name,
      last_audited_docs: item.last_audited_docs,
      last_audited_docs_name: item.last_audited_docs_name,
      pan_num: item.pan_num,
      tin_num: item.tin_num,
      gst_num: item.gst_num,
      vat_num: item.vat_num,
      reference_by: item.reference_by,
      vendorType: item.vendor_type,
      vendorStatus: item.vendor_status,
      registrationDate: item.registration_date,
      complianceStatus: item.compliance_status,
      notes: item.notes
    }));

    setVenderData(mappedData);
  }, [vendors]);

  // Define columns
  const headingName = [
    // { field: 'vendor_series', headerName: 'Vendor Code', width: 120 },
    {
      field: 'vendor_series',
      headerName: 'Vendor Code',
      width: 120,
      renderCell: (params) => (
        <Link component="button" onClick={() => handleView(params.row.id)}>
          {params.row.vendor_series}
        </Link>
      )
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      width: 150
    },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'vendorType', headerName: 'Vendor Type', width: 150 },
    { field: 'vendorStatus', headerName: 'Vendor Status', width: 150 },
    { field: 'currentAddress', headerName: 'Current Address', width: 200 },
    { field: 'permanentAddress', headerName: 'Permanent Address', width: 200 },
    { field: 'contactPerson', headerName: 'Contact Person', width: 150 },
    { field: 'contactPersonPhone', headerName: 'Contact Person Phone', width: 150 },
    { field: 'contactPersonEmail', headerName: 'Contact Person Email', width: 200 },
    { field: 'taxId', headerName: 'Tax ID', width: 150 },
    { field: 'registrationDate', headerName: 'Registration Date', width: 150 },
    { field: 'complianceStatus', headerName: 'Compliance Status', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button color="primary" onClick={() => handleEdit(params.row.id)}>
            <Icon path={mdiTagEdit} size={1} />
          </Button>
        </Box>
      )
    }
  ];

  const getVenderAPI = async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/vendor`);
      // console.log('vender data', response);
      // const mappedData = response.data.map((item, index) => ({
      //   id: index + 1,
      //   // vendor_id: 'dkjhs',
      //   vendor_series: item.vendor_series,
      //   vendorName: item.vendor_name,
      //   addressLine1: item.address_line1,
      //   addressLine2: item.address_line2,
      //   city: item.city_name,
      //   country: item.country_name,
      //   state: item.state_name,
      //   pincode: item.postal_code,
      //   addressLine11: item.address_line3,
      //   addressLine22: item.address_line4,
      //   city1: item.city_name1,
      //   country1: item.country_name1,
      //   state1: item.state_name1,
      //   pincode1: item.postal_code1,
      //   phoneNumber: item.phone_number,
      //   alternate_phone_number: item.alternate_phone_number,
      //   email: item.email,
      //   contactPerson: item.contact_person,
      //   contactPersonPhone: item.contact_person_phone,
      //   contactPersonEmail: item.contact_person_email,
      //   taxId: item.tax_id,
      //   paymentTerms: item.payment_terms,
      //   currentAddress: `${item?.address_line1} ${item?.address_line2} ${item?.city_name} ${item?.state_name} ${item?.country_name} ${item?.postal_code}`,
      //   permanentAddress: `${item?.address_line3} ${item?.address_line4} ${item?.city_name1} ${item?.state_name1} ${item?.country_name1} ${item?.postal_code1}`,
      //   bankName: item.bank1_name,
      //   bankName1: item.bank2_name,
      //   bankAccountNumber: item.bank1_account_number,
      //   bankAccountNumber1: item.bank2_account_number,
      //   bankIfscCode: item.bank1_ifsc_code,
      //   bankIfscCode1: item.bank2_ifsc_code,
      //   bank1_ref_cheque: item.bank1_ref_cheque,
      //   bank1_ref_cheque_name: item.bank1_ref_cheque_name,
      //   bank2_ref_cheque: item.bank2_ref_cheque,
      //   bank2_ref_cheque_name: item.bank2_ref_cheque_name,
      //   last_audited_docs: item.last_audited_docs,
      //   last_audited_docs_name: item.last_audited_docs_name,
      //   pan_num: item.pan_num,
      //   tin_num: item.tin_num,
      //   gst_num: item.gst_num,
      //   vat_num: item.vat_num,
      //   reference_by: item.reference_by,
      //   vendorType: item.vendor_type,
      //   vendorStatus: item.vendor_status,
      //   registrationDate: item.registration_date,
      //   complianceStatus: item.compliance_status,
      //   notes: item.notes
      // }));
      await GetVendors(dispatch);
      setVenderData(mappedData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        venderData: 'Failed to load timeline'
      }));
    }
  };

  const handleCreateVender = () => {
    setSelectedVender(null);
    setFormMode('create');
    setShowVenderForm(true);
    setShowViewVendor(false);
  };

  const handleEdit = (id) => {
    const user = venderData.find((user) => user.id === id);
    setSelectedVender(user);
    setFormMode('edit');
    setShowVenderForm(true);
    setShowViewVendor(false);
  };

  const handleView = (id) => {
    const vendor = venderData.find((vendor) => vendor.id === id);
    setSelectedVender(vendor);
    setShowViewVendor(true);
    setShowVenderForm(false);
  };

  const handleCloseForm = () => {
    setShowVenderForm(false);
    setShowViewVendor(false);
    setSelectedVender(null);
    setFormMode('create');
  };

  const handleSuccessfulSubmit = () => {
    setShowVenderForm(false);
  };
  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showVenderForm && !showViewVendor ? (
              <span>Vendor list</span>
            ) : (
              <span>{showVenderForm ? 'Create Vendor' : 'Vendor Details'}</span>
            )}

            {!showVenderForm && !showViewVendor ? (
              <PlusButton label="+Create Vendor" onClick={handleCreateVender} />
            ) : (
              <PlusButton label="Back" onClick={handleCloseForm} />
            )}
          </Box>
        }
      >
        {showVenderForm ? (
          <VenderForm user={selectedVender} onSuccessfulSubmit={handleSuccessfulSubmit} formMode={formMode} onClose={handleCloseForm} />
        ) : showViewVendor ? (
          <ViewVendor vendor={selectedVender} onClose={handleCloseForm} />
        ) : (
          <div>
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
                  border: '1px solid rgba(224, 224, 224, 1)'
                }
              }}
              loading={isFetching}
              rows={venderData}
              columns={headingName}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        )}
      </MainCard>
    </>
  );
}
