import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import ValidationStar from 'components/ValidationStar';
import { TextField } from '@mui/material';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomTypography from 'components/CustomTypography';
import { DataGrid } from '@mui/x-data-grid';
import CI_Data from 'components/BasicDataComponent/CI_data';

const ShippingEntry = ({ ShippingEntryData, onclose }) => {
  console.log('ShippingEntryData:', ShippingEntryData);
  const [FreightAdditionalCost, setFreightAdditionalCost] = useState(0);
  const [FobAdditionalCost, setFobAdditionalCost] = useState(0);
  const [InlandCost, setInlandCost] = useState(0);
  const [TotalContainer, setTotalContainer] = useState(0);

  const DatesColumns = [
    {
      headerName: 'Name',
      field: 'name',
      width: 250,
      valueFormatter: (params) => {
        console.log('params', params);
        return formatFieldName(params);
      }
    },
    { headerName: 'Date', field: 'date', width: 200 },
    { headerName: 'BY', field: 'by', width: 200 }
  ];

  function formatFieldName(fieldName) {
    console.log('fieldName', fieldName);
    return fieldName?.replace(/_/g, ' ')?.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const [DatesRows, setDatesRows] = useState([]);

  const [NetWeight, setNetWeight] = useState(0);
  const [GrossWeight, setGrossWeight] = useState(0);
  const [TotalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    let data = ShippingEntryData?.additional_charges?.filter((item) => item.reference_table_name === 'shippment_advise_master');
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

    if (ShippingEntryData?.add_shippment_containers?.length > 0) {
      let totalContainer = ShippingEntryData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.container_no));
      }, 0);
      setTotalContainer(totalContainer);
      let grossContainer = ShippingEntryData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.gross_weight));
      }, 0);
      setGrossWeight(grossContainer);
      let netContainer = ShippingEntryData?.add_shippment_containers?.reduce((acc, total) => {
        return (acc += Number(total.net_weight));
      }, 0);
      setNetWeight(netContainer);
    }

    if (ShippingEntryData?.shipment_advise_items?.length > 0) {
      let totalPackage = ShippingEntryData?.shipment_advise_items?.reduce((acc, total) => {
        return (acc += Number(total.no_of_packs));
      }, 0);
      setTotalPackage(totalPackage);
    }
  }, [ShippingEntryData]);

  const [open3, setOpen3] = useState(false);
  const [fileArray, setFileArray] = useState([
    { file: null, name: 'Commercial invoice', remark: '' },
    { file: null, name: 'Packing List', remark: '' },
    { file: null, name: 'Bill of Lading', remark: '' },
    { file: null, name: 'Certificate of Origin', remark: '' },
    { file: null, name: 'Manufacturer Certificate of Production', remark: '' },
    { file: null, name: 'Certificate of Analysis', remark: '' }
  ]);
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    updateDetails: true,
    etaDetails: true
  });

  const handleInputChangeFile = (e, index, field) => {
    const { value } = e.target;
    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleFileChangeFile = (e, index) => {
    const file = e.target.files[0];

    setFileArray((prevArray) => prevArray.map((item, i) => (i === index ? { ...item, file: file } : item)));
  };

  const addFileEntry = () => {
    setFileArray((prevArray) => [...prevArray, { file: null, name: '', remark: '' }]);
  };

  const VisuallyHiddenInput = styled('input')({
    display: 'none'
  });

  const handleSave3 = async () => {
    try {
      const mappedData = fileArray?.map((item) => ({
        linked_id: ShippingEntryData?.ci_id,
        table_name: 'commercial_invoice',
        type: item.name,
        doc: item.file,
        title: item.remark
      }));
      const { data } = await axiosInstance.post('/api/document/create', mappedData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setOpen3(false);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeFileEntry = (index) => {
    setFileArray((prevArray) => prevArray.filter((_, i) => i !== index));
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

  const [shippingEntryPort, setShippingEntryPort] = useState(
    ShippingEntryData?.ci_doc_movement_master?.agency
      ? {
          nafdac: ShippingEntryData?.ci_doc_movement_master?.nafdac_clearance_req,
          son: ShippingEntryData?.ci_doc_movement_master?.son_clearance_req,
          idec: ShippingEntryData?.ci_doc_movement_master?.idec_applicable,
          idec_name: ShippingEntryData?.ci_doc_movement_master?.idec_number,
          cria: ShippingEntryData?.ci_doc_movement_master?.cria_clearance_req,
          cria_doc_available: ShippingEntryData?.ci_doc_movement_master?.cria_doc_available,
          fast_track_clearing: ShippingEntryData?.ci_doc_movement_master?.fast_track_clearance,
          agency_name: ShippingEntryData?.ci_doc_movement_master?.agency,
          agent: ShippingEntryData?.ci_doc_movement_master?.agent
        }
      : {
          nafdac: '',
          son: '',
          idec: '',
          idec_name: '',
          cria: '',
          cria_doc_available: '',
          fast_track_clearing: '',
          agency_name: '',
          agent: ''
        }
  );

  const [IsDocBhRevise, setIsDocBhRevise] = useState(false);
  const [IsDocBhReviseYN, setIsDocBhReviseYN] = useState(false);

  const [IsDocBhRevisePH, setIsDocBhRevisePH] = useState(false);
  const [IsDocBhReviseYNPH, setIsDocBhReviseYNPH] = useState(false);

  const [IsDocBhReviseAgent, setIsDocBhReviseAgent] = useState(false);
  const [IsDocBhReviseYNAgent, setIsDocBhReviseYNAgent] = useState(false);

  useEffect(() => {
    let mapped = ShippingEntryData?.ci_doc_movement_master?.ci_shipping_doc_movement_dts?.map((item, index) => ({
      id: index + 1,
      name: item?.activity_name,
      date: item?.activity_date,
      by: item?.activity_authority
    }));
    console.log('mapped', mapped);

    setDatesRows(mapped);

    let filter = ShippingEntryData?.ci_doc_movement_master?.ci_shipping_doc_movement_dts?.filter(
      (item) => item.activity_name === 'scan_doc_sending_date' && item.activity_authority === 'BH'
    );
    console.log('filter', filter);
    filter?.length > 0 && setIsDocBhRevise(true);
    setOblData(
      filter?.length > 0
        ? [
            {
              scan_doc_sending_date: dayjs(getdate('scan_doc_sending_date', 'BH')?.activity_date),
              courier_name: getdate('scan_doc_sending_date', 'BH')?.courier_name,
              courier_date: dayjs(getdate('scan_doc_sending_date', 'BH')?.courier_date),
              tracking_no: getdate('scan_doc_sending_date', 'BH')?.tracking_no
            },
            {
              original_doc_to_advising_bank: dayjs(getdate('original_doc_to_advising_bank', 'BH')?.activity_date),
              courier_name: getdate('original_doc_to_advising_bank', 'BH')?.courier_name,
              courier_date: dayjs(getdate('original_doc_to_advising_bank', 'BH')?.courier_date),
              tracking_no: getdate('original_doc_to_advising_bank', 'BH')?.tracking_no
            },
            {
              original_doc_to_lc_opening_bank: dayjs(getdate('original_doc_to_lc_opening_bank', 'BH')?.activity_date),
              courier_name: getdate('original_doc_to_lc_opening_bank', 'BH')?.courier_name,
              courier_date: dayjs(getdate('original_doc_to_lc_opening_bank', 'BH')?.courier_date),
              tracking_no: getdate('original_doc_to_lc_opening_bank', 'BH')?.tracking_no
            },
            {
              original_doc_to_unit: dayjs(getdate('original_doc_to_unit', 'BH')?.activity_date),
              courier_name: getdate('original_doc_to_unit', 'BH')?.courier_name,
              courier_date: dayjs(getdate('original_doc_to_unit', 'BH')?.courier_date),
              tracking_no: getdate('original_doc_to_unit', 'BH')?.tracking_no
            }
          ]
        : [
            { scan_doc_sending_date: null, courier_name: '', courier_date: null, tracking_no: '' },
            { original_doc_to_advising_bank: null, courier_name: '', courier_date: null, tracking_no: '' },
            { original_doc_to_lc_opening_bank: null, courier_name: '', courier_date: null, tracking_no: '' },
            { original_doc_to_unit: null, courier_name: '', courier_date: null, tracking_no: '' }
          ]
    );
    // setOblData(
    //   filter?.length > 0
    //     ? {
    //         scan_doc_sending_date: dayjs(getdate('scan_doc_sending_date', 'BH')?.activity_date),
    //         original_doc_to_advising_bank: dayjs(getdate('original_doc_to_advising_bank', 'BH')?.activity_date),
    //         original_doc_to_lc_opening_bank: dayjs(getdate('original_doc_to_lc_opening_bank', 'BH')?.activity_date),
    //         original_doc_to_unit: dayjs(getdate('original_doc_to_unit', 'BH')?.activity_date)
    //       }
    //     : {
    //         scan_doc_sending_date: dayjs(),
    //         original_doc_to_advising_bank: dayjs(),
    //         original_doc_to_lc_opening_bank: dayjs(),
    //         original_doc_to_unit: dayjs()
    //       }
    // );

    let filterPH = ShippingEntryData?.ci_doc_movement_master?.ci_shipping_doc_movement_dts?.filter(
      (item) => item.activity_name === 'scan_doc_sending_dt_to_agent' && item.activity_authority === 'PH'
    );
    console.log('filterPH', filterPH);
    filterPH?.length > 0 && setIsDocBhRevisePH(true);
    setOblDataPH(
      filterPH?.length > 0
        ? {
            scan_doc_receiving_date: getdate('scan_doc_receiving_date', 'PH'),
            original_doc_receiving_bank: getdate('original_doc_receiving_bank', 'PH'),
            scan_doc_sending_dt_to_agent: getdate('scan_doc_sending_dt_to_agent', 'PH'),
            original_doc_sending_dt_to_agent: getdate('original_doc_sending_dt_to_agent', 'PH')
          }
        : {
            scan_doc_receiving_date: dayjs(),
            original_doc_receiving_bank: dayjs(),
            scan_doc_sending_dt_to_agent: dayjs(),
            original_doc_sending_dt_to_agent: dayjs()
          }
    );

    let filterAgent = ShippingEntryData?.ci_doc_movement_master?.ci_shipping_doc_movement_dts?.filter(
      (item) => item.activity_name === 'scan_doc_receiving_date' && item.activity_authority === 'Agent'
    );
    filterAgent?.length > 0 && setIsDocBhReviseAgent(true);
    setOblDataAgent(
      filterAgent?.length > 0
        ? {
            scan_doc_receiving_date: getdate('scan_doc_receiving_date', 'Agent'),
            original_doc_receiving_bank: getdate('original_doc_receiving_bank', 'Agent')
          }
        : {
            scan_doc_receiving_date: dayjs(),
            original_doc_receiving_bank: dayjs()
          }
    );

    let filterEta = ShippingEntryData?.ci_doc_movement_master?.ci_shipping_doc_movement_dts?.find(
      (item) => item?.activity_name === 'eta_revising_dt' && item?.status == 1
    );
    console.log('filterEta', filterEta?.activity_date);
    setUpdatedEta(filterEta && Object.values(filterEta).length > 0 ? dayjs(filterEta?.activity_date, 'YYYY-MM-DD') : dayjs());
  }, []);

  let getdate = (name, authority) => {
    let filter = ShippingEntryData?.ci_doc_movement_master?.ci_shipping_doc_movement_dts?.filter(
      (item) => item.activity_name === name && item.status == 1 && item.activity_authority === authority
    );
    console.log('getdate', filter);
    return authority === 'BH' ? filter[0] : dayjs(filter[0]?.activity_date);
  };

  const [oblData, setOblData] = useState([
    { scan_doc_sending_date: null, courier_name: '', courier_date: null, tracking_no: '' },
    { original_doc_to_advising_bank: null, courier_name: '', courier_date: null, tracking_no: '' },
    { original_doc_to_lc_opening_bank: null, courier_name: '', courier_date: null, tracking_no: '' },
    { original_doc_to_unit: null, courier_name: '', courier_date: null, tracking_no: '' }
  ]);
  const [oblDataPH, setOblDataPH] = useState({});
  const [oblDataAgent, setOblDataAgent] = useState({});

  const [updatedEta, setUpdatedEta] = useState(dayjs());

  const handleUpdateOblBh = async () => {
    let formdata = {
      ci_id: ShippingEntryData.ci_id,
      pfi_id: ShippingEntryData.pfi_id,
      pfi_no: ShippingEntryData.pfi_num,
      ci_num: ShippingEntryData.ci_num,
      activity_authority: 'BH',
      oblData
    };
    console.log('formdata', formdata);
    try {
      const { data } = await axiosInstance.put('/api/shipping/create', formdata);
      toast.success(data.msg);
      onclose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateOblPh = async () => {
    let formdata = {
      ci_id: ShippingEntryData.ci_id,
      pfi_id: ShippingEntryData.pfi_id,
      pfi_no: ShippingEntryData.pfi_num,
      ci_num: ShippingEntryData.ci_num,
      activity_authority: 'PH',
      oblData: oblDataPH
    };
    console.log('formdata', formdata);
    try {
      const { data } = await axiosInstance.put('/api/shipping/create', formdata);
      toast.success(data.msg);
      onclose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateOblAgent = async () => {
    let formdata = {
      ci_id: ShippingEntryData.ci_id,
      pfi_id: ShippingEntryData.pfi_id,
      pfi_no: ShippingEntryData.pfi_num,
      ci_num: ShippingEntryData.ci_num,
      activity_authority: 'Agent',
      oblData: oblDataAgent
    };
    console.log('formdata', formdata);
    try {
      const { data } = await axiosInstance.put('/api/shipping/create', formdata);
      toast.success(data.msg);
      onclose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateShipment = async () => {
    try {
      let formdata = {
        ci_id: ShippingEntryData.ci_id,
        pfi_id: ShippingEntryData.pfi_id,
        pfi_no: ShippingEntryData.pfi_num,
        ci_num: ShippingEntryData.ci_num,
        ...shippingEntryPort
      };
      console.log('formdata', formdata);
      const { data } = await axiosInstance.put('/api/shipping/addcompliance', formdata);
      toast.success(data);
      onclose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateClick = async () => {
    console.log(updatedEta);

    try {
      let formdata = {
        ci_id: ShippingEntryData.ci_id,
        pfi_id: ShippingEntryData.pfi_id,
        pfi_no: ShippingEntryData.pfi_num,
        ci_num: ShippingEntryData.ci_num,
        oblData: { eta_revising_dt: updatedEta }
      };
      console.log('formdata', formdata);
      const { data } = await axiosInstance.put('/api/shipping/create', formdata);
      toast.success(data);
      onclose();
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <CI_Data ci_id={ShippingEntryData?.ci_id} />

      <Table>
        {renderTableHeader('updateDetails', 'Update Details')}
        {showTableHeading.updateDetails && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={12}
                style={{
                  borderTop: '3px dotted black',
                  borderRight: '3px dotted black',
                  borderLeft: '3px dotted black',
                  borderBottom: 'none'
                }}
              >
                <Typography variant="h4" color="primary">
                  Document Movement
                </Typography>
                <Typography variant="h4" color="primary">
                  Buying House
                </Typography>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Scan Doc Sending Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[0]?.scan_doc_sending_date}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[0] = {
                                ...updatedData[0],
                                scan_doc_sending_date: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Name:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="courier_name"
                        value={oblData[0]?.courier_name}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[0] = {
                                ...updatedData[0],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[0]?.courier_date}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[0] = {
                                ...updatedData[0],
                                courier_date: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Tracking No.:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="number"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="tracking_no"
                        value={oblData[0]?.tracking_no}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[0] = {
                                ...updatedData[0],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Original Doc to Advising Bank:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[1]?.original_doc_to_advising_bank}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[1] = {
                                ...updatedData[1],
                                original_doc_to_advising_bank: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                          // setOblData({ ...oblData[1], original_doc_to_advising_bank: date });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Name:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="courier_name"
                        value={oblData[1]?.courier_name}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[1] = {
                                ...updatedData[1],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[1]?.courier_date}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[1] = {
                                ...updatedData[1],
                                courier_date: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Tracking No.:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="number"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="tracking_no"
                        value={oblData[1]?.tracking_no}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[1] = {
                                ...updatedData[1],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Original Doc to LC Opening Bank:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[2]?.original_doc_to_lc_opening_bank}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[2] = {
                                ...updatedData[2],
                                original_doc_to_lc_opening_bank: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                          // setOblData({ ...oblData[2], original_doc_to_lc_opening_bank: date });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Name:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="courier_name"
                        value={oblData[2]?.courier_name}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[2] = {
                                ...updatedData[2],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[2]?.courier_date}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[2] = {
                                ...updatedData[2],
                                courier_date: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Tracking No.:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="number"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="tracking_no"
                        value={oblData[2]?.tracking_no}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[2] = {
                                ...updatedData[2],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Original Doc to Unit:</Typography>
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={oblData[3]?.original_doc_to_unit}
                      onChange={(date) => {
                        setOblData((prev) => {
                          if (Array.isArray(prev)) {
                            const updatedData = [...prev];
                            updatedData[3] = {
                              ...updatedData[3],
                              original_doc_to_unit: date
                            };
                            return updatedData;
                          } else {
                            return prev;
                          }
                        });
                        // setOblData({ ...oblData[3], original_doc_to_unit: date });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Name:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="text"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="courier_name"
                        value={oblData[3]?.courier_name}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[3] = {
                                ...updatedData[3],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Courier Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblData[3]?.courier_date}
                        onChange={(date) => {
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[3] = {
                                ...updatedData[3],
                                courier_date: date
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevise && 'Revising'} Tracking No.:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <TextField
                        type="number"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        variant="outlined"
                        name="tracking_no"
                        value={oblData[3]?.tracking_no}
                        onChange={(e) =>
                          setOblData((prev) => {
                            if (Array.isArray(prev)) {
                              const updatedData = [...prev];
                              updatedData[3] = {
                                ...updatedData[3],
                                [e.target.name]: e.target.value
                              };
                              return updatedData;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {IsDocBhRevise && IsDocBhReviseYN ? (
                      <>
                        <Button onClick={handleUpdateOblBh} variant="contained">
                          Revise
                        </Button>
                        <Button style={{ display: 'flex' }} onClick={() => setIsDocBhReviseYN(false)} variant="outlined">
                          Cancel
                        </Button>
                      </>
                    ) : IsDocBhRevise ? (
                      <Button onClick={() => setIsDocBhReviseYN(true)} variant="contained">
                        Want to Revise Dates
                      </Button>
                    ) : (
                      <Button onClick={handleUpdateOblBh} variant="contained">
                        Submit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={12}
                style={{
                  borderTop: '3px dotted black',
                  borderRight: '3px dotted black',
                  borderLeft: '3px dotted black',
                  borderBottom: 'none'
                }}
              >
                <Typography variant="h4" color="primary">
                  Document Movement
                </Typography>
                <Typography variant="h4" color="primary">
                  Processing House
                </Typography>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevisePH && 'Revising'} Scan Doc Receiving Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblDataPH.scan_doc_receiving_date}
                        onChange={(date) => {
                          setOblDataPH({ ...oblDataPH, scan_doc_receiving_date: date });
                        }}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevisePH && 'Revising'} Original Doc Receiving Bank:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblDataPH.original_doc_receiving_bank}
                        onChange={(date) => {
                          setOblDataPH({ ...oblDataPH, original_doc_receiving_bank: date });
                        }}
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevisePH && 'Revising'} Scan Doc Sending Dt to Agent:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblDataPH.scan_doc_sending_dt_to_agent}
                        onChange={(date) => {
                          setOblDataPH({ ...oblDataPH, scan_doc_sending_dt_to_agent: date });
                        }}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhRevisePH && 'Revising'} Original Doc Sending Dt to Agent:</Typography>
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={oblDataPH.original_doc_sending_dt_to_agent}
                      onChange={(date) => {
                        setOblDataPH({ ...oblDataPH, original_doc_sending_dt_to_agent: date });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {IsDocBhRevisePH && IsDocBhReviseYNPH ? (
                      <>
                        <Button onClick={handleUpdateOblPh} variant="contained">
                          Revise
                        </Button>
                        <Button style={{ display: 'flex' }} onClick={() => setIsDocBhReviseYNPH(false)} variant="outlined">
                          Cancel
                        </Button>
                      </>
                    ) : IsDocBhRevisePH ? (
                      <Button onClick={() => setIsDocBhReviseYNPH(true)} variant="contained">
                        Want to Revise Dates
                      </Button>
                    ) : (
                      <Button onClick={handleUpdateOblPh} variant="contained">
                        Submit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={12}
                style={{
                  borderTop: '3px dotted black',
                  borderRight: '3px dotted black',
                  borderLeft: '3px dotted black',
                  borderBottom: 'none'
                }}
              >
                <Typography variant="h4" color="primary">
                  Document Movement
                </Typography>
                <Typography variant="h4" color="primary">
                  Agent
                </Typography>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhReviseAgent && 'Revising'} Scan Doc Receiving Date:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblDataAgent.scan_doc_receiving_date}
                        onChange={(date) => {
                          setOblDataAgent({ ...oblDataAgent, scan_doc_receiving_date: date });
                        }}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{IsDocBhReviseAgent && 'Revising'} Original Doc Receiving Bank:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <DatePicker
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '7px'
                          },
                          width: '100%'
                        }}
                        value={oblDataAgent.original_doc_receiving_bank}
                        onChange={(date) => {
                          setOblDataAgent({ ...oblDataAgent, original_doc_receiving_bank: date });
                        }}
                      />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {IsDocBhReviseAgent && IsDocBhReviseYNAgent ? (
                      <>
                        <Button onClick={handleUpdateOblAgent} variant="contained">
                          Revise
                        </Button>
                        <Button style={{ display: 'flex' }} onClick={() => setIsDocBhReviseYNAgent(false)} variant="outlined">
                          Cancel
                        </Button>
                      </>
                    ) : IsDocBhReviseAgent ? (
                      <Button onClick={() => setIsDocBhReviseYNAgent(true)} variant="contained">
                        Want to Revise Dates
                      </Button>
                    ) : (
                      <Button onClick={handleUpdateOblAgent} variant="contained">
                        Submit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={12}
                style={{
                  borderBottom: '3px dotted black',
                  borderRight: '3px dotted black',
                  borderLeft: '3px dotted black',
                  borderTop: 'none'
                }}
              >
                <Typography variant="h4" color="primary">
                  Shipping Entry Port
                </Typography>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">NAFDAC Clearance Req:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="nafdac"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.nafdac}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">SON Clearance Req:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="son"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.son}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">IDEC:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="idec"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.idec}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </TableCell>
                  {shippingEntryPort?.idec === 'Yes' && (
                    <>
                      <TableCell>
                        <Typography variant="body1">IDEC Name:</Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          id="idec_name"
                          type="text"
                          name="idec_name"
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '7px'
                            },
                            width: '100%'
                          }}
                          value={shippingEntryPort?.idec_name}
                          onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                        />
                      </TableCell>
                    </>
                  )}

                  <TableCell>
                    <Typography variant="body1">Fast Track Clearance:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="fast_track_clearing"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.fast_track_clearing}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'yes'}>Yes</MenuItem>
                      <MenuItem value={'no'}>No</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">CRIA Clearance Req:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="cria"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.cria}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'yes'}>Yes</MenuItem>
                      <MenuItem value={'no'}>No</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">CRIA Doc Available:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="cria_doc_available"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.cria_doc_available}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">Agency:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="agency_name"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.agency_name}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'H.C.L. Pvt. Ltd'}>H.C.L. Pvt. Ltd.</MenuItem>
                      <MenuItem value={'Apple Inc'}>Apple Inc.</MenuItem>
                      <MenuItem value={'Lenovo'}>Lenovo</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">Agent:</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      id="shipping-entry-select"
                      name="agent"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={shippingEntryPort?.agent}
                      onChange={(e) => setShippingEntryPort({ ...shippingEntryPort, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'Surya'}>Surya</MenuItem>
                      <MenuItem value={'Rakesh'}>Rakesh</MenuItem>
                      <MenuItem value={'Deepanshu'}>Deepanshu</MenuItem>
                      <MenuItem value={'Pooja'}>Pooja</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell colSpan={12}>
                    {ShippingEntryData?.ci_doc_movement_master?.agency ? (
                      // <Button fullWidth onClick={handleUpdateShipment} variant="contained">
                      //   Update
                      // </Button>
                      ''
                    ) : (
                      <Button fullWidth onClick={handleUpdateShipment} variant="contained">
                        Submit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Table>
        {renderTableHeader('etaDetails', 'ETA as per Shipping Doc')}
        {showTableHeading.etaDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Revised ETA:</Typography>
              </TableCell>
              <TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DatePicker
                      fullWidth
                      name="exchange_date"
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '7px'
                        },
                        width: '100%'
                      }}
                      value={updatedEta}
                      onChange={(date) => {
                        setUpdatedEta(date);
                      }}
                    />
                    <Button onClick={handleUpdateClick} variant="contained" color="primary" style={{ marginLeft: 8 }}>
                      Revise
                    </Button>
                  </div>
                </TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">
                  {/* Scanned Shipping Doc Receipt Date-Port: */}
                  Scanned Shipping Documents
                </Typography>
              </TableCell>
              <TableCell>
                {!open3 && (
                  <Button onClick={() => setOpen3(true)} variant="contained">
                    Upload Docs
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      {open3 && (
        <div style={{ padding: '20px' }}>
          {fileArray?.map((item, index) => (
            <Grid
              key={index + 1}
              container
              spacing={1}
              alignItems="center"
              sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
            >
              <Grid item xs={12} sm={1}>
                <Typography variant="subtitle1">
                  {index + 1}
                  <ValidationStar>*</ValidationStar>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Doc Name"
                  disabled={index <= 5}
                  value={item.name}
                  onChange={(e) => handleInputChangeFile(e, index, 'name')}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Remark"
                  onChange={(e) => handleInputChangeFile(e, index, 'remark')}
                  value={item.remark}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <div>
                  <Button fullWidth component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                    Select
                    <VisuallyHiddenInput type="file" onChange={(e) => handleFileChangeFile(e, index)} />
                  </Button>
                </div>
              </Grid>
              {index >= 5 && (
                <Grid item xs={12} sm={1}>
                  <IconButton aria-label="add" size="large" onClick={addFileEntry}>
                    <AddCircleOutlineIcon fontSize="large" color="success" />
                  </IconButton>
                </Grid>
              )}
              {index >= 6 && (
                <Grid fullWidth item xs={12} sm={1}>
                  <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
                    <DeleteIcon fontSize="large" color="error" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}

          <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button onClick={() => setOpen3(false)} color="primary" variant="outlined">
              Close
            </Button>
            <Button onClick={() => handleSave3()} color="primary" variant="contained">
              Upload Docs
            </Button>
          </Box>
        </div>
      )}

      <div>
        <h4>Revised Data</h4>
      </div>

      <Box>
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          columns={DatesColumns}
          rows={DatesRows}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </Box>
    </div>
  );
};

export default ShippingEntry;
