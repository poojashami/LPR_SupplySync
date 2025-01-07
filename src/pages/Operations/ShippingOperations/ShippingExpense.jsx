import dayjs from 'dayjs';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { MenuItem, Select, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import PlusButton from 'components/CustomButton';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import FieldPadding from 'components/FieldPadding';
import { axiosInstance } from 'utils/axiosInstance';
import ValidationStar from 'components/ValidationStar';
import CustomTypography from 'components/CustomTypography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { errorMessageStyle } from 'components/StyleComponent';
import { FieldArray, Formik, Field, Form, ErrorMessage } from 'formik';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, IconButton, Button } from '@mui/material';
import SelectFieldPadding from 'components/selectFieldPadding';

export default function ShippingExpense({
  showShippingExpenseData,
  onClose,
  onSuccessfulSubmit,
  setShowShippingExpense,
  showShippingExpense,
  ShippingExpenseData,
  provision
}) {
  // const initialFormValues1 = {
  //   shipmentLine:
  //     `${showShippingExpenseData?.shippment_advise_master?.shipping_vehicle}, ${showShippingExpenseData?.shippment_advise_master?.vehicle_description}` ||
  //     '',
  //   billNo: '',
  //   billDate: dayjs(),
  //   amount: 0,
  //   vat: 0,
  //   total: 0,
  //   narration: ''
  // };

  const [initialFormValues1, setInitialFormValues1] = useState({});

  useEffect(() => {
    let nonProvisionalData = ShippingExpenseData.length > 0 && ShippingExpenseData?.filter((item) => item?.provision === 'N');
    console.log('setInitialFormValues1', nonProvisionalData);

    setInitialFormValues1(
      nonProvisionalData?.length > 0 && provision === 'N'
        ? {
            shipmentLine: nonProvisionalData[0]?.shipping_line,
            billNo: nonProvisionalData[0]?.bill_no,
            billDate: dayjs(nonProvisionalData[0]?.bill_date),
            amount: nonProvisionalData[0]?.amount,
            vat: nonProvisionalData[0]?.vat,
            total: nonProvisionalData[0]?.total,
            narration: nonProvisionalData[0]?.narration
          }
        : ShippingExpenseData?.length && provision === 'Y'
          ? {
              shipmentLine: ShippingExpenseData?.shipping_line,
              billNo: ShippingExpenseData?.bill_no,
              billDate: dayjs(ShippingExpenseData?.bill_date),
              amount: ShippingExpenseData?.amount,
              vat: ShippingExpenseData?.vat,
              total: ShippingExpenseData?.total,
              narration: ShippingExpenseData?.narration
            }
          : {
              shipmentLine: showShippingExpenseData
                ? `${showShippingExpenseData?.shippment_advise_master?.shipping_vehicle}, ${showShippingExpenseData?.shippment_advise_master?.vehicle_description}`
                : '',
              billNo: '',
              billDate: dayjs(),
              amount: 0,
              vat: 0,
              total: 0,
              narration: ''
            }
    );
    setShippingExpenseDataTable([
      {
        id: 1,
        shipping_line: ShippingExpenseData?.shipping_line,
        amount: ShippingExpenseData?.amount,
        bill_date: ShippingExpenseData?.bill_date,
        bill_no: ShippingExpenseData?.bill_no,
        vat: ShippingExpenseData?.vat,
        total: ShippingExpenseData?.total,
        provision: ShippingExpenseData?.provision,
        narration: ShippingExpenseData?.narration
      }
    ]);
    setExpenses(
      nonProvisionalData?.length > 0 && provision === 'N'
        ? nonProvisionalData[0]?.shipping_additinal_expenses?.map((item, index) => ({
            sr_no: index + 1,
            expense_head: item?.expense_head,
            amount: item?.amount
          }))
        : ShippingExpenseData?.length && provision === 'Y'
          ? ShippingExpenseData?.shipping_additinal_expenses?.map((item, index) => ({
              sr_no: index + 1,
              expense_head: item?.expense_head,
              amount: item?.amount
            }))
          : [{ sr_no: 1, expense_head: '', amount: 0 }]
    );
    setContainers(
      nonProvisionalData?.length > 0 && provision === 'N'
        ? nonProvisionalData[0]?.shipping_expenses_container_allocations?.map((item, index) => ({
            sr_no: index + 1,
            container_no: item?.container_no,
            size: showShippingExpenseData?.add_shippment_containers[index]?.container_size,
            add_shippment_container_id: item?.add_shippment_container_id,
            container_deposit: item?.container_deposit,
            fixed_container_amount: item?.fixed_container_amount,
            demurrage_amount: item?.demurrage_amount,
            from_date: dayjs(item?.from_date),
            to_date: dayjs(item?.to_date)
          }))
        : ShippingExpenseData?.length && provision === 'Y'
          ? ShippingExpenseData?.shipping_expenses_container_allocations?.map((item, index) => ({
              sr_no: index + 1,
              container_no: item?.container_no,
              size: showShippingExpenseData?.add_shippment_containers[index]?.container_size,
              add_shippment_container_id: item?.add_shippment_container_id,
              container_deposit: item?.container_deposit,
              fixed_container_amount: item?.fixed_container_amount,
              demurrage_amount: item?.demurrage_amount,
              from_date: dayjs(item?.from_date),
              to_date: dayjs(item?.to_date)
            }))
          : showShippingExpenseData?.add_shippment_containers?.map((item, index) => ({
              sr_no: index + 1,
              container_no: item?.container_no,
              size: item?.container_size,
              add_shippment_container_id: item?.add_shippment_container_id,
              container_deposit: '',
              fixed_container_amount: '',
              demurrage_amount: '',
              from_date: dayjs(),
              to_date: dayjs()
            })) || []
    );
  }, [ShippingExpenseData]);

  console.log('ShippingExpenseData', ShippingExpenseData);

  const [containers, setContainers] = useState([]);

  const handleChange = (index, field) => (e) => {
    const updatedContainers = [...containers];
    updatedContainers[index][field] = e.target.value;
    setContainers(updatedContainers);
  };

  const handleDateChange = (index, field, date) => {
    const updatedContainers = [...containers];
    updatedContainers[index][field] = date;
    setContainers(updatedContainers);
  };
  const [TotalAmount, setTotalAmount] = useState(ShippingExpenseData?.amount || 0);

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    let totalAmountContainer = containers?.reduce((acc, item) => {
      return (acc = acc + Number(item?.fixed_container_amount) + Number(item?.demurrage_amount) + Number(item?.container_deposit));
    }, 0);

    let totalExpenseContainer = expenses?.reduce((acc, item) => {
      return (acc = acc + Number(item?.amount));
    }, 0);
    setTotalAmount(ShippingExpenseData?.amount ? ShippingExpenseData?.amount : totalAmountContainer + totalExpenseContainer);
    console.log('totalAmountContainer', totalAmountContainer + totalExpenseContainer);
  }, [containers, expenses]);

  const validationSchema1 = Yup.object().shape({
    shipmentLine: Yup.string().required('This field is required'),
    billNo: Yup.string().required('This field is required'),
    billDate: Yup.string().required('This field is required')
  });

  const validationSchema2 = Yup.object().shape({
    containers: Yup.array().of(
      Yup.object().shape({
        sr_no: Yup.string().required('This field is required'),
        container_no: Yup.string().required('This field is required'),
        size: Yup.string().required('This field is required'),
        container_deposit: Yup.string().required('This field is required'),
        fixed_container_amount: Yup.string().required('This field is required'),
        demurrage_amount: Yup.string().required('This field is required'),
        from_date: Yup.string().required('This field is required'),
        to_date: Yup.string().required('This field is required')
      })
    )
  });

  const [showTableHeading, setShowTableHeading] = useState({
    shippingExpenseDetail: true,
    container: true,
    BookedShippingAddress: true,
    basicDetails: true,
    expenses: true
  });

  const [sadFile, setSadFile] = useState(null);
  const [shippingExpenseDataTable, setShippingExpenseDataTable] = useState([]);
  const navigate = useNavigate();
  const shippingDataColumn = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 80
    },
    { headerName: 'Shipping Line', field: 'shipping_line' },
    { headerName: 'Bill No', field: 'bill_no' },
    { headerName: 'Bill Date', field: 'bill_date' },
    { headerName: 'Amount', field: 'amount' },
    { headerName: 'Vat', field: 'vat' },
    { headerName: 'Total', field: 'total' },
    { headerName: 'Provisional', field: 'provision' },
    { headerName: 'Narration', field: 'narration' },
    {
      headerName: 'Document',
      width: 110,
      field: 'document',
      renderCell: (params) => (
        <Button variant="text" onClick={() => onDownloadDocument(params.value)}>
          Download
        </Button>
      )
    },
    {
      headerName: 'Action',
      field: 'action',
      renderCell: (params) => (
        <Button variant="text" color="error" onClick={() => onCancelAction(params.value)}>
          Cancel
        </Button>
      )
    }
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

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file only.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleClick = (id) => {
    document.getElementById(id).click();
  };

  const handleSubmitForm1 = async (values, actions) => {
    console.log('Form 1 values:', {
      ci_id: showShippingExpenseData?.ci_id,
      ci_num: showShippingExpenseData?.ci_num,
      pfi_id: showShippingExpenseData?.pfi_id,
      pfi_num: showShippingExpenseData?.pfi_num,
      provision: provision,
      shipmentLine: values.shipmentLine,
      billNo: values.billNo,
      billDate: values.billDate,
      amount: TotalAmount,
      vat: values.vat,
      total: Number(values.vat) + Number(TotalAmount),
      narration: values.narration,
      sadFile,
      expenses,
      containers
    });
    try {
      const { data } = await axiosInstance.post(
        '/api/commercial/invoice/shipping/expense',
        {
          ci_id: showShippingExpenseData?.ci_id,
          ci_num: showShippingExpenseData?.ci_num,
          pfi_id: showShippingExpenseData?.pfi_id,
          pfi_num: showShippingExpenseData?.pfi_num,
          provision: provision,
          shipmentLine: values.shipmentLine,
          billNo: values.billNo,
          billDate: values.billDate,
          amount: TotalAmount,
          vat: values.vat,
          total: Number(values.vat) + Number(TotalAmount),
          narration: values.narration,
          sadFile,
          expenses,
          containers
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSadFile(null);
      toast.success(data.message);
      setShowShippingExpense(false);
    } catch (error) {
      toast.error(error.message);
    }

    if (onSuccessfulSubmit) {
      onSuccessfulSubmit(values);
    }
    actions.resetForm();
    onClose();
  };

  const addNewRow = (values) => {
    const newRow = {
      sr_no: expenses?.length,
      expense_head: '',
      amount: 0
    };
    setExpenses([...values, newRow]);
    // setFieldValue('containers', [...containers, newRow]);
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
          <Typography variant="body">Size</Typography>
        </TableCell>
        {provision && (
          <TableCell>
            <Typography variant="body">Container Deposit</Typography>
          </TableCell>
        )}
        <TableCell>
          <Typography variant="body">Fixed Container Amount</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">{provision ? 'Demurrage Amount' : 'Storage Charges'}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">From Date</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">To Date</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const TableHeaderExpenses = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="body">Sr No.</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Expense Head</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body">Amount</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  console.log('provision', provision);
  const TableRowComponent = ({ value, index, handleChange, handleDateChange }) => (
    <TableRow>
      <TableCell>{value.sr_no}</TableCell>
      <TableCell>{value.container_no}</TableCell>
      <TableCell>{value.size}</TableCell>
      {provision && (
        <TableCell>
          <TextField
            name={`containers[${index}].container_deposit`}
            // value={containers.container_deposit}
            value={value.container_deposit}
            onChange={handleChange(index, 'container_deposit')}
            variant="outlined"
            fullWidth
            size="small"
          />
          {/* You can add error handling here */}
        </TableCell>
      )}
      <TableCell>
        <TextField
          name={`containers[${index}].fixed_container_amount`}
          value={value.fixed_container_amount}
          onChange={handleChange(index, 'fixed_container_amount')}
          variant="outlined"
          fullWidth
          size="small"
        />
        {/* You can add error handling here */}
      </TableCell>
      <TableCell>
        <TextField
          name={`containers[${index}].demurrage_amount`}
          value={value.demurrage_amount}
          onChange={handleChange(index, 'demurrage_amount')}
          variant="outlined"
          fullWidth
          size="small"
        />
        {/* You can add error handling here */}
      </TableCell>
      <TableCell>
        <DatePicker
          value={value.from_date}
          onChange={(date) => handleDateChange(index, 'from_date', date)}
          renderInput={(params) => <TextField {...params} variant="outlined" fullWidth size="small" />}
        />
      </TableCell>
      <TableCell>
        <DatePicker
          value={value.to_date}
          onChange={(date) => handleDateChange(index, 'to_date', date)}
          renderInput={(params) => <TextField {...params} variant="outlined" fullWidth size="small" />}
        />
      </TableCell>
    </TableRow>
  );

  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
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

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {provision ? <span>Shipping Expense Detail - Shipment Type - FCL</span> : <span>Terminal Expense</span>}
          {provision && (
            <PlusButton
              label="Back"
              onClick={() => {
                setShowShippingExpense(!showShippingExpense);
                navigate('/operations/shipping');
              }}
            />
          )}
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

      {initialFormValues1 && initialFormValues1.billDate && (
        <Formik initialValues={initialFormValues1} validationSchema={validationSchema1} onSubmit={handleSubmitForm1}>
          {({ values, resetForm, setFieldValue }) => (
            <>
              <Form>
                <Table>
                  {renderTableHeader('shippingExpenseDetail', 'Shipping Details')}
                  {showTableHeading.shippingExpenseDetail && (
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body">
                          Shipment Line<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Field as={FieldPadding} name="shipmentLine" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="shipmentLine" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Typography variant="body">
                          Bill No <ValidationStar>*</ValidationStar>
                        </Typography>
                        <Field as={FieldPadding} name="billNo" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="billNo" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body">
                          Bill Date<ValidationStar>*</ValidationStar>
                        </Typography>

                        <DatePicker
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '7px'
                            }
                          }}
                          name="billDate"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={values.billDate}
                          onChange={(date) => setFieldValue('billDate', date)}
                        />
                        <ErrorMessage name="billDate" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body">
                          Amount<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Field as={FieldPadding} value={TotalAmount} name="amount" variant="outlined" fullWidth disabled size="small" />{' '}
                        <ErrorMessage name="amount" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body">
                          VAT<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Field as={FieldPadding} name="vat" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="vat" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body">
                          Total<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Field
                          as={FieldPadding}
                          value={Number(values.vat) + Number(TotalAmount)}
                          name="total"
                          variant="outlined"
                          fullWidth
                          disabled
                          size="small"
                        />
                        <ErrorMessage name="total" component="div" style={errorMessageStyle} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="body">
                          Narration<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Field as={FieldPadding} name="narration" variant="outlined" fullWidth size="small" />
                        <ErrorMessage name="narration" component="div" style={errorMessageStyle} />
                      </Grid>

                      <Grid item xs={4}>
                        <Typography variant="body">
                          SAD Document<ValidationStar>*</ValidationStar>
                        </Typography>
                        <Grid
                          marginTop="10px"
                          item
                          borderRadius="15px"
                          style={{
                            border: '2px dashed #000',
                            padding: '30px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          onDrop={(e) => handleDrop(e, setSadFile)}
                          onDragOver={handleDragOver}
                          onClick={() => handleClick('sadFileInput')}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            <Typography variant="body1" style={{ marginBottom: '8px' }}>
                              <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                            </Typography>
                            {sadFile ? (
                              sadFile.name
                            ) : (
                              <>
                                <label htmlFor="sadFileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                                  {values?.sadDocument ? values?.sadDocument : 'Upload file'}
                                </label>
                                <input
                                  type="file"
                                  id="sadFileInput"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileSelect(e, setSadFile)}
                                  accept=".pdf"
                                />
                              </>
                            )}
                          </div>
                        </Grid>
                        <ErrorMessage name="sadDocument" component="div" style={errorMessageStyle} />
                      </Grid>
                      {/* {!ShippingExpenseData && ( */}
                      <>
                        <Grid item xs={1}>
                          <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                            Submit
                          </Button>
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            variant="outlined"
                            color="error"
                            type="button"
                            onClick={() => {
                              resetForm();
                            }}
                          >
                            Back
                          </Button>
                        </Grid>
                      </>
                      {/* )} */}
                    </Grid>
                  )}
                </Table>
              </Form>
            </>
          )}
        </Formik>
      )}
      <Grid sx={{ marginTop: 2 }}>
        <Table>
          <TableHeader />
          <TableBody>
            {containers.map((value, index) => (
              <TableRowComponent key={index} value={value} index={index} handleChange={handleChange} handleDateChange={handleDateChange} />
            ))}
          </TableBody>
        </Table>
      </Grid>

      <Grid sx={{ marginTop: 2 }}>
        <Table>
          {renderTableHeader('expenses', 'Expenses Information')}
          {showTableHeading.expenses && (
            <>
              <TableHeaderExpenses />

              <TableBody>
                {expenses?.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name={`[${index}].expense_head`} // This will help identify the field to update
                        value={value.expense_head} // Set value from the state
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const fieldName = name.split('.')[1]; // Extract field name (expense_head or amount)
                          setExpenses((prevExpenses) =>
                            prevExpenses.map((expense, idx) => (idx === index ? { ...expense, [fieldName]: value } : expense))
                          );
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name={`[${index}].amount`} // This will help identify the field to update
                        value={value.amount} // Set value from the state
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const fieldName = name.split('.')[1]; // Extract field name (expense_head or amount)
                          setExpenses((prevExpenses) =>
                            prevExpenses.map((expense, idx) => (idx === index ? { ...expense, [fieldName]: value } : expense))
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={() => addNewRow(expenses)}>
            Add Row
          </Button>
        </Box>
      </Grid>

      <Table sx={{ marginTop: 2 }}>
        {renderTableHeader('BookedShippingAddress', 'Booked Shipping Address')}
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
                  borderBottom: '2px solid rgba(224, 224, 224, 1)'
                }
              }}
              columns={shippingDataColumn}
              rows={shippingExpenseDataTable}
            />
          </>
        )}
      </Table>
    </MainCard>
  );
}
