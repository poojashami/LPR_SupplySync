import dayjs from 'dayjs';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import formatNumber from 'utils/functions';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import GRNItemList from '../inward/GRNItemList';
import { DatePicker } from '@mui/x-date-pickers';
import PlusButton from 'components/CustomButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from 'utils/axiosInstance';
import ValidationStar from 'components/ValidationStar';
import ShipmentAdvice_list from './ShipmentAdvice_list';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Select,
  Button,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody
  // ButtonGroup
} from '@mui/material';
// import ViewShippingAdvice from './ViewShippingAdvice';
// import { NumbersOutlined } from '@mui/icons-material';
// import ViewContainerDetail from './ViewContainerDetail';
import FullFeaturedCrudGrid from 'pages/purchaseOrder/AddMargin';
import AddFreightCharges from 'pages/Operations/ShippingOperations/AddFreightCharges';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const VisuallyHiddenInput = styled('input')({
  display: 'none'
});

function transformContainerData(data) {
  const transformedData = [];
  const containerKeys = Object.keys(data).filter((key) => key.startsWith('container_no_'));
  containerKeys.forEach((containerKey, index) => {
    const containerIndex = index + 1;
    const containerInfo = {
      container_no: data[containerKey],
      container_type: data[`pack_type${containerIndex}`],
      container_size: data[`container_size_${containerIndex}`],
      total_gross_wt: data[`total_gross_wt_${containerIndex}`],
      total_net_wt: data[`total_net_wt_${containerIndex}`],
      p_uom: data[`p_uom_${containerIndex}`],
      packing_info: []
    };

    let suffix = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const qtyKey1 = `p_qty_${suffix}_${containerIndex}`;
      const netWtKey1 = `p_net_wt_${suffix}_${containerIndex}`;
      const packageKey1 = `no_package_${suffix}_${containerIndex}`;

      const packKey1 = `pack_type_${suffix}_${containerIndex}`;
      const pUomKey1 = `p_uom_${suffix}_${containerIndex}`;

      const qtyKey2 = `p_qty_${suffix}_${containerIndex + 1}`;
      const netWtKey2 = `p_net_wt_${suffix}_${containerIndex + 1}`;
      const packageKey2 = `no_package_${suffix}_${containerIndex + 1}`;

      const packKey2 = `pack_type_${suffix}_${containerIndex + 1}`;
      const pUomKey2 = `p_uom_${suffix}_${containerIndex + 1}`;

      if (data[qtyKey1] || data[netWtKey1] || data[packageKey1]) {
        containerInfo.packing_info.push({
          p_qty: data[qtyKey1] || null,
          p_net_wt: data[netWtKey1] || null,
          no_package: data[packageKey1] || null,
          pack_type: data[packKey1] || null,
          p_uom: data[pUomKey1] || null
        });
      } else if (data[qtyKey2] || data[netWtKey2] || data[packageKey2]) {
        containerInfo.packing_info.push({
          p_qty: data[qtyKey2] || null,
          p_net_wt: data[netWtKey2] || null,
          no_package: data[packageKey2] || null,
          pack_type: data[packKey2] || null,
          p_uom: data[pUomKey2] || null
        });
      } else {
        break;
      }
      suffix++;
    }

    transformedData.push(containerInfo);
  });

  return transformedData;
}

const defaultContainerData = (id, packTypes) => {
  const data = {
    id,
    p_uom: '',
    total_net_wt: 0,
    container_no: '',
    total_gross_wt: 0,
    container_type: '',
    container_size: ''
  };
  for (let j = 1; j <= packTypes; j++) {
    data[`p_qty_${j}`] = 0;
    data[`p_net_wt_${j}`] = 0;
    data[`no_package_${j}`] = 0;

    data[`pack_type${j}`] = 0;
    data[`p_uom${j}`] = 0;
  }
  return data;
};

const ShippingAdvise = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    itemDetails: true,
    viewShippingAdvise: true,
    viewContainerDetail: true
  });

  const [view_data, setViewData] = useState(false);

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

  const [rows, setRows] = useState([]);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [po_data, setPo_data] = useState({});
  const [formdata, setFormdata] = useState({});
  const [packTypes, setPackTypes] = useState([]);
  const [view_list, setView_list] = useState(false);
  const [uoms, setUoms] = useState([]);

  useEffect(() => {
    console.log('po_data', po_data);
  }, [po_data]);

  const get_pack_types = async () => {
    try {
      const { data } = await axiosInstance.get('/api/shipping/advise/container/type/dropdown');
      const { data: uoms } = await axiosInstance.get('/api/uom/uoms');
      setUoms(uoms);
      setTypes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getContSizes = async () => {
    try {
      const { data } = await axiosInstance.get('/api/operation/container/type/dropdown');
      addContainer();
      get_pack_types();
      setTimeout(() => {
        addPackType();
      }, 1000);
      if (Array.isArray(data)) {
        setCols([
          {
            field: 'container_no',
            headerName: 'Container No',
            width: 150,
            renderCell: (params) => (
              <>
                <TextField
                  name={`${params?.field}_${params?.id}`}
                  onChange={(e) => {
                    setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                />
              </>
            )
          },
          {
            field: 'container_size',
            headerName: 'Container Size',
            width: 150,
            renderCell: (params) => (
              <Select
                fullWidth
                name={`${params?.field}_${params?.id}`}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
                value={formdata[`container_size_${params?.id}`]}
                onChange={(e) => {
                  setFormdata((prevData) => ({
                    ...prevData,
                    [e.target.name]: e.target.value
                  }));
                }}
              >
                <MenuItem>
                  <em>Select</em>
                </MenuItem>
                {data.map((item) => (
                  <MenuItem key={item.container_type_master_id} value={item.container_type_master_id}>
                    {item.container_type_name}
                  </MenuItem>
                ))}
              </Select>
            )
          },
          // {
          //   field: 'container_type',
          //   headerName: 'Pack Type',
          //   width: 150,
          //   renderCell: (params) => (
          //     <Select
          //       fullWidth
          //       name={`${params?.field}_${params?.id}`}
          //       sx={{
          //         '& .MuiInputBase-input': {
          //           padding: '7px'
          //         }
          //       }}
          //       value={formdata[`pack_type${params?.id}`]}
          //       onChange={(e) => {
          //         setFormdata((prevData) => ({
          //           ...prevData,
          //           [e.target.name]: e.target.value
          //         }));
          //       }}
          //     >
          //       <MenuItem value="">
          //         <em>Select</em>
          //       </MenuItem>
          //       {types.map((item) => (
          //         <MenuItem key={item.shipping_advise_container_type_master_id} value={item.shipping_advise_container_type_master_id}>
          //           {item.container_type_name}
          //         </MenuItem>
          //       ))}
          //     </Select>
          //   )
          // },
          // {
          //   field: 'p_uom',
          //   headerName: 'UOM',
          //   width: 110,
          //   renderCell: (params) => (
          //     <Select
          //       fullWidth
          //       name={`${params?.field}_${params?.id}`}
          //       sx={{
          //         '& .MuiInputBase-input': {
          //           padding: '7px'
          //         }
          //       }}
          //       value={formdata[`container_size_${params?.id}`]}
          //       onChange={(e) => {
          //         setFormdata((prevData) => ({
          //           ...prevData,
          //           [e.target.name]: e.target.value
          //         }));
          //       }}
          //     >
          //       <MenuItem>
          //         <em>Select</em>
          //       </MenuItem>
          //       {uoms.map((item) => (
          //         <MenuItem key={item.uom_id} value={item.uom_id}>
          //           {item.uom_name}
          //         </MenuItem>
          //       ))}
          //     </Select>
          //   )
          // },
          {
            field: 'total_net_wt',
            headerName: 'Total Net Weight',
            width: 180,
            editable: false,
            renderCell: (params) => (
              <>
                <TextField
                  name={`${params?.field}_${params?.id}`}
                  onChange={(e) => {
                    setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                />
              </>
            )
          },
          {
            field: 'total_gross_wt',
            headerName: 'Total Gross Weight',
            width: 180,
            editable: false,
            renderCell: (params) => (
              <>
                <TextField
                  name={`${params?.field}_${params?.id}`}
                  onChange={(e) => {
                    setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    }
                  }}
                />
              </>
            )
          }
        ]);
        setSizes(data);
      } else {
        throw new Error('Data is not in expected format');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getContSizes();
    get_pack_types();
  }, []);

  const [cols, setCols] = useState([]);
  const [columnGroupingModel, setColumnGroupingModel] = useState([
    {
      groupId: 'Container Details',
      children: [
        {
          field: 'container_no',
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: 'container_type',
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                value={formdata[`${params?.field}_${params?.id}`]}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: 'container_size',
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        }
      ]
    },
    {
      groupId: 'Totals',
      children: [
        {
          field: 'p_uom',
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: 'total_net_wt',
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: 'total_gross_wt',
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        }
      ]
    }
  ]);

  useEffect(() => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        let totalNetWeight = 0;
        for (let i = 1; i <= packTypes; i++) {
          totalNetWeight += Number(row[`p_net_wt_${i}`]) || 0;
        }
        return { ...row, total_net_wt: totalNetWeight };
      })
    );
  }, [rows, packTypes]);

  const submit = async () => {
    try {
      const { data } = await axiosInstance.post('/api/service/container', {
        po_id: po_data.po_id,
        po_num: po_data.po_num,
        cpackageDetail: transformContainerData(formdata)
      });
      setRows([]);
      setCols([]);
      setSizes([]);
      setPo_data([]);
      setFormdata({});
      setPackTypes([]);
      setView_list(false);
      setColumnGroupingModel([]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCellEditCommit = useCallback((params) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === params.id ? { ...row, [params.field]: params.value } : row)));
  }, []);

  const addContainer = () => {
    setRows((prevRows) => [...prevRows, defaultContainerData(prevRows.length + 1, packTypes)]);
  };

  const addPackType = () => {
    const newPackTypeIndex = packTypes + 1;
    setPackTypes(newPackTypeIndex);

    const newColumnGroup = {
      groupId: `Package Info ${newPackTypeIndex}`,
      children: [
        {
          field: `p_qty_${newPackTypeIndex}`,
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: `p_net_wt_${newPackTypeIndex}`,
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: `no_package_${newPackTypeIndex}`,
          renderCell: (params) => (
            <>
              <TextField
                name={`${params?.field}_${params?.id}`}
                onChange={(e) => {
                  setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '7px'
                  }
                }}
              />
            </>
          )
        },
        {
          field: `pack_type_${newPackTypeIndex}`,
          renderCell: (params) => (
            <Select
              fullWidth
              name={`${params?.field}_${params?.id}`}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              value={formdata[`pack_type${params?.id}`]}
              onChange={(e) => {
                setFormdata((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value
                }));
              }}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {types.map((item) => (
                <MenuItem key={item.shipping_advise_container_type_master_id} value={item.shipping_advise_container_type_master_id}>
                  {item.container_type_name}
                </MenuItem>
              ))}
            </Select>
          )
        },
        {
          field: `p_uom_${newPackTypeIndex}`,
          renderCell: (params) => (
            <Select
              fullWidth
              name={`${params?.field}_${params?.id}`}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
              value={formdata[`container_size_${params?.id}`]}
              onChange={(e) => {
                setFormdata((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value
                }));
              }}
            >
              <MenuItem>
                <em>Select</em>
              </MenuItem>
              {uoms.map((item) => (
                <MenuItem key={item.uom_id} value={item.uom_id}>
                  {item.uom_name}
                </MenuItem>
              ))}
            </Select>
          )
        }
      ]
    };

    setColumnGroupingModel((prev) => [...prev, newColumnGroup]);

    const newColumns = [
      {
        field: `p_qty_${newPackTypeIndex}`,
        headerName: 'Quantity',
        width: 110,
        renderCell: (params) => (
          <>
            <TextField
              name={`${params?.field}_${params?.id}`}
              onChange={(e) => {
                setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
              }}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
            />
          </>
        )
      },
      {
        field: `p_net_wt_${newPackTypeIndex}`,
        headerName: 'Net Weight',
        width: 110,
        renderCell: (params) => (
          <>
            <TextField
              name={`${params?.field}_${params?.id}`}
              onChange={(e) => {
                setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
              }}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
            />
          </>
        )
      },
      {
        field: `no_package_${newPackTypeIndex}`,
        headerName: 'No of Package',
        width: 110,
        renderCell: (params) => (
          <>
            <TextField
              name={`${params?.field}_${params?.id}`}
              onChange={(e) => {
                setFormdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }));
              }}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '7px'
                }
              }}
            />
          </>
        )
      },
      {
        field: 'pack_type_${newPackTypeIndex}',
        headerName: 'Pack Type',
        width: 150,
        renderCell: (params) => (
          <Select
            fullWidth
            name={`${params?.field}_${params?.id}`}
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              }
            }}
            value={formdata[`pack_type${params?.id}`]}
            onChange={(e) => {
              setFormdata((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value
              }));
            }}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {types.map((item) => (
              <MenuItem key={item.shipping_advise_container_type_master_id} value={item.shipping_advise_container_type_master_id}>
                {item.container_type_name}
              </MenuItem>
            ))}
          </Select>
        )
      },
      {
        field: `p_uom_${newPackTypeIndex}`,
        headerName: 'UOM',
        width: 110,
        renderCell: (params) => (
          <Select
            fullWidth
            name={`${params?.field}_${params?.id}`}
            sx={{
              '& .MuiInputBase-input': {
                padding: '7px'
              }
            }}
            value={formdata[`container_size_${params?.id}`]}
            onChange={(e) => {
              setFormdata((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value
              }));
            }}
          >
            <MenuItem>
              <em>Select</em>
            </MenuItem>
            {uoms.map((item) => (
              <MenuItem key={item.uom_id} value={item.uom_id}>
                {item.uom_name}
              </MenuItem>
            ))}
          </Select>
        )
      }
    ];

    setCols((prev) => {
      const firstTwoCols = prev.slice(0, 2);
      const remainingCols = prev.slice(2);
      return [...firstTwoCols, ...newColumns, ...remainingCols];
    });
  };
  const [no_of_container, setNoOfContainer] = useState(0);
  const createContainer = (e) => {
    const noc = e.target.value;
    setNoOfContainer(noc);
    for (let i = 1; i < noc; i++) {
      setTimeout(() => {
        addContainer();
      }, i * 100);
    }
  };
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
          {view_list ? <span> Create Shipment Advice</span> : <span>Shipment Advice - Status</span>}

          {view_list && <PlusButton label="Back" onClick={() => setView_list(false)} />}
        </Box>
      }
    >
      {!view_list ? (
        <ShipmentAdvice_list
          // view_data={view_data}
          setViewData={setViewData}
          po_data={po_data}
          setPo_data={setPo_data}
          setView_list={setView_list}
        />
      ) : (
        <Box sx={{ width: '100%' }}>
          <Table>
            {renderTableHeader('basicDetails', 'Basic Details')}
            {showTableHeading.basicDetails && (
              <>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Supplier Name & Address
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '320px' }}>
                      <Typography>{`${po_data?.opo_master?.OprMaster?.BuyingHouse?.buying_house_name} ${po_data?.opo_master?.OprMaster?.BuyingHouse?.address_line1} ${po_data?.opo_master?.OprMaster?.BuyingHouse?.address_line2} ${po_data?.opo_master?.OprMaster?.BuyingHouse.country}`}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        PO Vendor
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.VendorsMaster?.vendor_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        PO Number
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.po_num}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        PO Value #
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{formatNumber(po_data?.po_value)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Supplier Ref No(Quote no)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.opo_master?.quotation_master?.quo_num}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Delivery Term
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name}</Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Shipment mode
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.opo_master?.OprMaster?.shipment_mode_name}</Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Inco Term
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography></Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        FORM M No
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.form_m_num}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        BA No
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.ba_num}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        LC No
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{po_data?.lc_num}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        No of Previous shipment
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography></Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Amount of Previous shipment
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Balance to Ship
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </>
            )}
          </Table>
          <ShipmentAdviseForm
            po_data={po_data}
            no_of_container={no_of_container}
            setNoOfContainer={setNoOfContainer}
            createContainer={createContainer}
            formdata={formdata}
            transformContainerData={transformContainerData}
          />
          <Table>{renderTableHeader('otherDetails', 'Container Details')}</Table>
          {showTableHeading.otherDetails && (
            <DataGrid
              getRowHeight={() => 'auto'}
              columnGroupingModel={columnGroupingModel}
              sx={{
                minHeight: '30vh',
                '& .MuiDataGrid-cell': {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'start',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '30px !important',
                  padding: '0px !important',
                  '&:hover': {
                    backgroundColor: '#e0f7fa'
                  }
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'start'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              hideFooter
              rows={rows}
              columns={cols}
              hideFooterPagination
              disableSelectionOnClick
              rowsPerPageOptions={[5]}
              hideFooterSelectedRowCount
              onCellEditCommit={handleCellEditCommit}
            />
          )}
        </Box>
      )}
      {view_list && (
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'end', alignItems: 'end', padding: '12px' }}>
          {/* <Button onClick={() => setOpen2(true)} variant="outlined" color="primary">
            Add Documents
          </Button> */}
          <Button onClick={addContainer} variant="outlined" color="primary">
            Add Container
          </Button>
          <Button onClick={addPackType} variant="outlined" color="primary">
            Add Pack Type
          </Button>
          {/* <Button onClick={submit} variant="outlined" color="primary">
            Submit
          </Button> */}
        </Box>
      )}
      {/* <Table>
        {renderTableHeader('viewShippingAdvise', 'View Shipping Advise')}
        {showTableHeading.viewShippingAdvise && <>{view_list && <ViewShippingAdvice />}</>}
      </Table>
      <Table>
        {renderTableHeader('viewContainerDetail', 'View Container Detail')}
        {showTableHeading.viewContainerDetail && (
          <>
            <ViewContainerDetail />
          </>
        )}
      </Table> */}
    </MainCard>
  );
};

export default ShippingAdvise;

const ShipmentAdviseForm = ({ po_data, no_of_container, createContainer, formdata, transformContainerData }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additionalDetails: true,
    BreakupAmountDetails: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const [addAdditinalCostData, setAddAdditinalCostData] = useState([]);
  const [additinalCostData, setAdditinalCostData] = useState([]);
  const [additinalCostFreigthData, setAdditinalFreigthCostData] = useState([]);
  const [totalFreigth, setTotalFreigth] = useState(0);
  const [totalInlandFob, setTotalInlandFob] = useState(0);
  const [totalAddAdditionalCost, setTotalAddAdditionalCost] = useState(0);
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);
  const [freightChargesLength, setFreightChargesLength] = useState();

  useEffect(() => {
    const fetchAdditionalCostData = async (id, quo_id) => {
      try {
        const response = await axiosInstance.get('/api/quotation/additionalcost/freight/advise', {
          params: {
            quo_id
          }
        });

        let totalFreigth = response?.data?.reduce((accum, i) => {
          return (accum = accum + Number(i.number_container) * Number(i.rate));
        }, 0);
        setTotalFreigth(totalFreigth);

        let mapped = response.data.map((item, index) => ({
          id: index + 1,
          number_container: item?.number_container,
          type_container: Number(item?.type_container),
          rate: item?.rate,
          shipment_advise_rate: item?.rate,
          line_total: item?.total_freigth,
          isNew: true
        }));
        setAdditinalFreigthCostData(mapped);
        setFreightChargesLength(mapped?.length);

        const { data } = await axiosInstance.get('/api/quotation/additionalcost/compressdata', {
          params: {
            // pfi_id: id
            quo_id
          }
        });
        const RemoveFreigth = data.filter((i) => i.heading !== 'Freight_Charges');
        const newArr = RemoveFreigth?.map((item, index) => ({
          id: index + 1,
          _id: index,
          heading: item?.heading,
          charge_name: item?.charge_name,
          // ...item,
          charge_amount: item?.supp_charges,
          add_amount: Number(item?.supp_charges)
        }));

        let totalInlandBuy = newArr?.reduce((accum, rate) => {
          return (accum += Number(rate.charge_amount));
        }, 0);
        let totalFOBSupp = newArr?.reduce((accum, rate) => {
          return (accum += Number(rate.supp_charges));
        }, 0);

        let newArray = [
          ...newArr,
          {
            id: 203,
            _id: 203,
            heading: 'Y',
            charge_name: 'Total',
            charge_amount: Number(totalInlandBuy),
            add_amount: Number(totalInlandBuy),
            summaryRow: true
          }
        ];
        setAdditinalCostData(newArray);
      } catch (error) {
        toast.error('Server Error');
      }
    };
    fetchAdditionalCostData(po_data?.opo_master?.pfi_masters[0]?.pfi_id, po_data?.quotation_master?.quo_id);
  }, [po_data]);
  console.log('po_data', po_data);

  useEffect(() => {
    let total = Number(totalFreigth) + Number(totalInlandFob) + Number(totalAddAdditionalCost);
    setTotalAdditionalCost(total);
  }, [totalFreigth, totalInlandFob, totalAddAdditionalCost]);

  useEffect(() => {
    let totalFreight = additinalCostFreigthData?.reduce((total, item) => {
      return total + Number(item?.number_container) * Number(item?.shipment_advise_rate);
    }, 0);
    console.log('totalFreight', totalFreight);
    setTotalFreigth(totalFreight);
  }, [additinalCostFreigthData]);

  useEffect(() => {
    let totalInlandFob = additinalCostData?.reduce((total, item) => {
      return item.charge_name === 'Total' ? total + 0 : total + Number(item.add_amount);
    }, 0);
    setTotalInlandFob(totalInlandFob);
  }, [additinalCostData]);

  useEffect(() => {
    let totalInlandFob = addAdditinalCostData?.reduce((total, item) => {
      return total + Number(item.charge_amount);
    }, 0);
    setTotalAddAdditionalCost(totalInlandFob);
  }, [addAdditinalCostData]);

  const TableHeaderAdditionalCost = [
    {
      field: 'heading',
      headerName: 'Heading',
      width: 150,
      valueFormatter: (value) => (value === 'FOB' ? 'FOB Charges' : value === 'Inland_Charges' ? 'Inland Charges' : '')
    },
    {
      field: 'charge_name',
      headerName: 'Charges',
      width: 250,
      valueFormatter: (value) => (value === 'Total' ? 'Total' : value?.toUpperCase()?.replace('_', ' ')),
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    },
    {
      field: 'charge_amount',
      headerName: 'Charge Amount',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      rowSpanValueGetter: () => null,
      valueFormatter: (value) => `${value}.00`,
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : '')
    },
    {
      field: 'add_amount',
      headerName: 'Shipping Advise Amount',
      width: 200,
      headerAlign: 'right',
      align: 'right',
      rowSpanValueGetter: () => null,
      cellClassName: ({ row }) => (row.summaryRow ? 'bold' : ''),
      renderCell: (params) => {
        if (!params.row.summaryRow) {
          return (
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '6px',
                  textAlign: 'right' // Ensure text is right-aligned inside the input
                },
                '& .Mui-disabled': {
                  '-webkit-text-fill-color': '#4f4f4f'
                },
                width: '100%'
              }}
              type="number"
              name="add_amount"
              value={additinalCostData[params.row._id]?.add_amount}
              onChange={(e) => handleChangeAddAmount(e, params.row)}
              onBlur={(e) => handleBlurAddAmount(e)}
            />
          );
        }
        return (
          <span
            className="bold"
            style={{
              textAlign: 'right', // Right-align the header text
              marginRight: '20px', // Add margin to the right of the header
              fontWeight: 'bold' // Make the header text bold
            }}
          >
            {params.value}
          </span>
        );
      }
    }
  ];

  const handleChangeAddAmount = (e, row) => {
    const { value } = e.target;
    console.log('index', row?.charge_name);
    setAdditinalCostData((prevState) =>
      prevState.map((item) => (item.charge_name === row?.charge_name ? { ...item, add_amount: value } : item))
    );
    // setTotalRow({ ...totalRow, add_amount: totalRow.add_amount + Number(value) });
  };

  const handleBlurAddAmount = (e) => {
    setAdditinalCostData((prevState) =>
      prevState.map((item) => (item.charge_name === 'Total' ? { ...item, add_amount: totalInlandFob } : item))
    );
    // setTotalRow({ ...totalRow, add_amount: totalRow.add_amount + Number(value) });
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

  const [selectedLcl, setSelectedLcl] = useState(false);
  const [formValues, setFormValues] = useState({
    po_id: po_data.po_id,
    po_num: po_data.po_num,
    shipment_status: '',
    // invoice_amount: formatNumber(po_data?.total_cost + Number(totalFreigth) + Number(totalInlandFob) + Number(totalAddAdditionalCost)),
    bl_awb_no: '',
    bl_awb_date: '',
    type_of_bl: '',
    shipment_type: '',
    cbm_information: '',
    free_days: '',
    shipping_vehicle: '',
    vehicle_description: '',
    port_of_loading: po_data?.quotation_master?.port_loading || '',
    port_of_discharge: po_data?.shippment_instruction?.port_of_discharge || '',
    final_destination: po_data?.shippment_instruction?.final_destination || '',
    goods_description: po_data?.shippment_instruction?.goods_description || '',
    shipper_name: '',
    consignee_name: po_data?.buyer_name || '',
    notify_name: po_data?.shippment_instruction?.notify_party || '',
    freight: '',
    eta: null
  });
  const [grnData, setGrnData] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({
        ...formValues,
        invoice_amount: formatNumber(po_data?.total_cost + Number(totalFreigth) + Number(totalInlandFob) + Number(totalAddAdditionalCost)),
        quo_id: po_data?.quo_id,
        quo_num: po_data?.quo_num,
        additional_information: formValuesArray,
        doc_list: fileArray,
        grnData,
        cpackageDetail: transformContainerData(formdata),

        addAdditinalCostArr: addAdditinalCostData,
        additinalCostDataArr: additinalCostData,
        additinalCostFreigthDataArr: additinalCostFreigthData,
        totalFreigth: totalFreigth,
        for_delivery_term: po_data?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name
      });
      const { data } = await axiosInstance.post(
        'api/shipping/advise',
        {
          ...formValues,
          invoice_amount: formatNumber(
            po_data?.total_cost + Number(totalFreigth) + Number(totalInlandFob) + Number(totalAddAdditionalCost)
          ),
          quo_id: po_data?.quo_id,
          quo_num: po_data?.quo_num,
          additional_information: formValuesArray,
          doc_list: fileArray,
          grnData,
          cpackageDetail: transformContainerData(formdata),

          addAdditinalCostArr: addAdditinalCostData,
          additinalCostDataArr: additinalCostData,
          additinalCostFreigthDataArr: additinalCostFreigthData,
          totalFreigth: totalFreigth,
          for_delivery_term: po_data?.opo_master?.quotation_master?.delivery_terms_quo?.delivery_terms_name
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      window.location.reload();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const initialFormValues = {
    other: ''
  };

  const [formValuesArray, setFormValuesArray] = useState([initialFormValues]);
  const addForm = () => {
    setFormValuesArray([...formValuesArray, { ...initialFormValues }]);
  };

  const removeForm = (index) => {
    if (formValuesArray.length > 1) {
      setFormValuesArray(formValuesArray.filter((_, i) => i !== index));
    }
  };

  // const [file, setFile] = useState(null);

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const droppedFile = e.dataTransfer.files[0];
  //   if (droppedFile && droppedFile.type === 'application/pdf') {
  //     setFile(droppedFile);
  //   } else {
  //     alert('Please drop a PDF file.');
  //   }
  // };

  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  // const handleClick = () => {
  //   document.getElementById('fileInput').click();
  // };

  // const handleFileSelect = (e) => {
  //   const selectedFile = e.target.files;
  //   Object.values(selectedFile).forEach((file) => {
  //     if (file && file.type === 'application/pdf') {
  //       setFile(Object.values(selectedFile));
  //     } else {
  //       alert('Please select a PDF file.');
  //     }
  //   });
  // };

  const [fileArray, setFileArray] = useState([{ file: null, name: '', remark: '' }]);

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

  const removeFileEntry = (index) => {
    setFileArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  // addContainer

  return (
    <Box>
      <Table>
        {renderTableHeader('basicDetails', 'Details')}
        {showTableHeading.basicDetails && (
          <>
            <Grid container spacing={2} sx={{ padding: '20px' }}>
              <Grid item xs={2}>
                <Typography variant="body1">Shipment Status:</Typography>
                <Select
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  fullWidth
                  name="shipment_status"
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                >
                  <MenuItem value="Full & Final">Full & Final</MenuItem>
                  <MenuItem value="Partial">Partial</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">No of Container:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  value={no_of_container}
                  onChange={createContainer}
                />
              </Grid>
              {/* <Grid item xs={2}>
                <Typography variant="body1">Invoice Amount:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  disabled
                  variant="outlined"
                  name="invoice_amount"
                  value={formValues.invoice_amount}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid> */}
              <Grid container spacing={1} alignItems="center">
                <Typography variant="h5" color="primary" sx={{ margin: '20px' }}>
                  Bl Information
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">BL/AWB no:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="bl_awb_no"
                  value={formValues.bl_awb_no}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">BL/AWB Dt:</Typography>
                <DatePicker
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="bl_awb_date"
                  // value={formValues.bl_awb_date}
                  // onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                  value={formValues.bl_awb_date ? dayjs(formValues.bl_awb_date) : null}
                  onChange={(newDate) => {
                    const formattedDate = dayjs(newDate).isValid() ? dayjs(newDate).format('YYYY-MM-DD') : '';
                    setFormValues({ ...formValues, bl_awb_date: formattedDate });
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Type of BL:</Typography>
                <Select
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  fullWidth
                  name="type_of_bl"
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                >
                  <MenuItem value="HBL">HBL</MenuItem>
                  <MenuItem value="MBL">MBL</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Shipment Type:</Typography>
                <Select
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  fullWidth
                  name="shipment_type"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormValues({ ...formValues, [e.target.name]: newValue });
                    if (newValue === 'LCL') {
                      setSelectedLcl(true);
                    } else {
                      setSelectedLcl(false); // Reset if not LCL
                    }
                  }}
                >
                  <MenuItem value="FCL">FCL</MenuItem>
                  <MenuItem value="LCL">LCL</MenuItem>
                </Select>
              </Grid>
              {selectedLcl && (
                <Grid item xs={2}>
                  <Typography variant="body1">CBM Information:</Typography>
                  <TextField
                    type="text"
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '7px'
                      },
                      width: '100%'
                    }}
                    variant="outlined"
                    name="cbm_information"
                    value={formValues.cbm_information}
                    onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                  />
                </Grid>
              )}
              <Grid item xs={2}>
                <Typography variant="body1">Free Days:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="free_days"
                  value={formValues.free_days}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Shipping/Airline:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="shipping_vehicle"
                  value={formValues.shipping_vehicle}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Vessel Name/Flight Number</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="vehicle_description"
                  value={formValues.vehicle_description}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Port of Loading:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="port_of_loading"
                  value={formValues.port_of_loading}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Port of Delivery:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="port_of_discharge"
                  value={formValues.port_of_discharge}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Final Destination:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="final_destination"
                  value={formValues.final_destination}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Goods Description:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="goods_description"
                  value={formValues.goods_description}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Shipper name:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="shipper_name"
                  value={formValues.shipper_name}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Consignee:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="consignee_name"
                  value={formValues.consignee_name}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">Notify Party:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="notify_name"
                  value={formValues.notify_name}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid>
              {/* <Grid item xs={2}>
                <Typography variant="body1">Free time/days:</Typography>
                <TextField
                  type="text"
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  variant="outlined"
                  name="free_days_time"
                  value={formValues.free_days_time}
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                />
              </Grid> */}
              <Grid item xs={2}>
                <Typography variant="body1">Freight:</Typography>
                <Select
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  fullWidth
                  name="freight"
                  onChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                >
                  <MenuItem value="Prepaid">Prepaid</MenuItem>
                  <MenuItem value="Post Paid">Post Paid</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">ETA:</Typography>
                <DatePicker
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                  value={formValues.eta ? dayjs(formValues.eta) : null}
                  onChange={(newDate) => {
                    const formattedDate = dayjs(newDate).isValid() ? dayjs(newDate).format('YYYY-MM-DD') : '';
                    setFormValues({ ...formValues, eta: formattedDate });
                  }}
                />
              </Grid>

              {/* <Grid item xs={2}>
                <Typography variant="body1">Total Additinal Cost:</Typography>
                <Typography variant="body1">{totalAdditionalCost}</Typography>
              </Grid> */}
            </Grid>
          </>
        )}
      </Table>

      <GRNItemList po_id={po_data?.po_id} po_data={po_data} setGrnData={setGrnData} />

      <Table>
        {renderTableHeader('otherDetails', 'Additional Information Form')}
        {showTableHeading.otherDetails && (
          <Box>
            {formValuesArray.map((form, index) => (
              <Grid container spacing={2} sx={{ padding: '0 20px', mb: 2 }} key={index}>
                <Grid item xs={5}>
                  <Typography variant="body1">Additional Information {index + 1}</Typography>
                  <TextField
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { padding: '7px' } }}
                    id={`other-${index}`}
                    variant="outlined"
                    value={formValuesArray[index].other}
                    onChange={(e) => {
                      const newFormValues = [...formValuesArray];
                      newFormValues[index].other = e.target.value;
                      setFormValuesArray(newFormValues);
                    }}
                  />
                </Grid>
                <Grid item xs={5} style={{ display: 'flex', alignItems: 'end', justifyContent: 'start', marginBottom: '5px' }}>
                  {index === 0 ? (
                    <AddIcon sx={{ mr: 2, color: 'grey' }} onClick={addForm}>
                      Add Form
                    </AddIcon>
                  ) : (
                    <>
                      <AddIcon sx={{ mr: 2, color: 'grey' }} onClick={addForm}>
                        Add More
                      </AddIcon>
                      <DeleteIcon sx={{ color: 'red' }} onClick={() => removeForm(index)}>
                        Remove
                      </DeleteIcon>
                    </>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
      </Table>
      <Grid container xs={12} spacing={2} sx={{ padding: '20px', mb: 2 }}>
        {fileArray?.map((item, index) => (
          <Grid
            key={index + 1}
            container
            spacing={1}
            alignItems="center"
            xs={12}
            sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
          >
            <Grid item xs={12} sm={1}>
              <Typography variant="subtitle1">
                Document {index + 1}
                <ValidationStar>*</ValidationStar>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Doc Name"
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
            <Grid item xs={12} sm={2}>
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
            <Grid item xs={12} sm={2}>
              <div>
                <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                  Select
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => {
                      handleFileChangeFile(e, index);
                    }}
                  />
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sm={3}>
              {item.file && <span style={{ color: 'blue' }}>{item.file.name}</span>}
            </Grid>
            {index !== 4 && (
              <Grid item xs={12} sm={1}>
                <IconButton aria-label="add" size="large" onClick={addFileEntry}>
                  <AddCircleOutlineIcon fontSize="large" color="success" />
                </IconButton>
              </Grid>
            )}
            {fileArray.length !== 1 && (
              <Grid item xs={12} sm={1}>
                <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
                  <DeleteIcon fontSize="large" color="error" />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}
      </Grid>

      <Table>
        {renderTableHeader('additionalDetails', 'Addittional Cost')}
        {showTableHeading.additionalDetails && (
          <>
            {/* <div>
              <h4>Total Add Additinal Amount: {totalAddAdditionalCost}</h4>
            </div> */}

            <Box sx={{ marginTop: '20px' }}>
              <DataGrid
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid rgba(224, 224, 224, 1)',
                    height: '25px !important'
                  },
                  '& .bold': {
                    fontWeight: 'bolder'
                  }
                }}
                rowHeight={25}
                unstable_rowSpanning={true}
                rows={additinalCostData}
                columns={TableHeaderAdditionalCost}
                disableRowSelectionOnClick
                hideFooter
                hideFooterSelectedRowCount
                hideFooterPagination
              />{' '}
              <div>
                <FullFeaturedCrudGrid rows={addAdditinalCostData} setRows={setAddAdditinalCostData} />
              </div>
            </Box>

            <div>
              <h4>Total Inland & FOB: {Number(totalInlandFob) + Number(totalAddAdditionalCost)}</h4>
            </div>

            <div>
              <AddFreightCharges
                freightChargesLength={freightChargesLength}
                rows={additinalCostFreigthData}
                setRows={setAdditinalFreigthCostData}
              />
            </div>

            <div>
              <h4>Total Freight: {formatNumber(totalFreigth)}</h4>
            </div>
          </>
        )}
      </Table>

      <Table>{renderTableHeader('BreakupAmountDetails', 'Quotation Amount Breakup')}</Table>
      <Table>
        {showTableHeading.BreakupAmountDetails && (
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: '500' }}>FOB Cost</TableCell>
              <TableCell>{formatNumber(Number(po_data?.total_cost))}</TableCell>
              <TableCell sx={{ fontWeight: '500' }}>Inland Charges:</TableCell>
              <TableCell>{formatNumber(Number(totalInlandFob + totalAddAdditionalCost))}</TableCell>
              <TableCell sx={{ fontWeight: '500' }}>Freight Cost:</TableCell>
              <TableCell>{formatNumber(totalFreigth)}</TableCell>
              <TableCell sx={{ fontWeight: '500' }}>CI Amount:</TableCell>
              <TableCell>
                {formatNumber(po_data?.total_cost + Number(totalFreigth) + Number(totalInlandFob) + Number(totalAddAdditionalCost))}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Box sx={{ display: 'flex', justifyContent: 'end', margin: 2 }}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};
