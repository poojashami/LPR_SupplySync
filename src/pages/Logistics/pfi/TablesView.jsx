import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import MainCard from 'components/MainCard';
import { Box } from '@mui/system';
import { axiosInstance } from 'utils/axiosInstance';

const FormMData = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [formMData, setFormMData] = useState([]);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/formm');
        console.log('Fetching data:', response.data);
        const formMData = response.data.map((item, index) => ({
          id: index + 1,
          ...item // Spread the original item properties
        }));
        console.log('Fetching data:', formMData);
        setFormMData(formMData);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);

  const pfiColumn = [
    {
      field: 'pfi_num',
      headerName: 'PFI No',
      width: 80,
      renderCell: (params) => (
        <Link component="button" onClick={() => onPiNoClick(params.value)}>
          {params.value}
        </Link>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem>
              <strong>None</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'Insurance No', field: 'insurance_num' },
    { headerName: 'FORM M No.', field: 'form_m_num' },
    { headerName: 'FORM M Date', field: 'form_m_date' },
    { headerName: 'PFI Description', field: 'pfi_description' },
    { headerName: 'FORM M Expiry Date', field: 'form_m_expiry_date' },
    { headerName: 'BA No.', field: 'ba_num' },
    { headerName: 'FORM M Recd Date', field: 'form_m_recd_date' }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {' '}
            <p> FORM M Details</p>
          </Box>
        }
      >
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
          }} columns={pfiColumn} rows={formMData} />
      </MainCard>
    </div>
  );
};

const InsuranceData = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [insuranceData, setInsuranceData] = useState([]);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/insurance');
        console.log('Fetching data:', response.data);
        const insuranceData = response.data.map((item, index) => ({
          id: index + 1,
          ...item
        }));
        console.log('Fetching data:', insuranceData);
        setInsuranceData(insuranceData);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);

  const insuranceColumn = [
    {
      field: 'pfi_num',
      headerName: 'PFI No',
      width: 80,
      renderCell: (params) => (
        <Link component="button" onClick={() => onPiNoClick(params.value)}>
          {params.value}
        </Link>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem>
              <strong>None</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'PI Date', field: 'pfi_date' },
    { headerName: 'Pfi Value', field: 'pfi_value' },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'Bank', field: 'bank' },
    { headerName: 'Application Date', field: 'application_date' },
    { headerName: 'Insurance Company', field: 'insurance_company' },
    { headerName: 'Insurance Clause', field: 'insurance_clause' },
    { headerName: 'Insurance Premium Rate', field: 'insurance_premium_rate' },
    { headerName: 'Insurance Certificate No.', field: 'insurance_certificate_num' },
    { headerName: 'Exchange Rate', field: 'exchange_rate' },
    { headerName: 'Sum Insured', field: 'sum_insured_usd' },
    { headerName: 'Sum Insured Naira', field: 'sum_insured_naira' },
    { headerName: 'Premium Amount Naira', field: 'premium_amount_naira' },
    { headerName: 'Payment Date', field: 'payment_date' },
    { headerName: 'Invoice No', field: 'invoice_no' },
    { headerName: 'Remarks', field: 'remarks' },
    { headerName: 'Form Applied Date', field: 'form_applied_date' }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {' '}
            <p> Insurance Details</p>
          </Box>
        }
      >
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
          }} columns={insuranceColumn} rows={insuranceData} />
      </MainCard>
    </div>
  );
};

const PaarData = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [paarData, setPaarData] = useState([]);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/pfi/paar');
        console.log('Fetching data:', response.data);
        const data = response.data.map((item, index) => ({
          id: index + 1,
          ...item
        }));
        console.log('Fetching data:', data);
        setPaarData(data);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);

  const insuranceColumn = [
    {
      field: 'pfi_num',
      headerName: 'PFI No',
      width: 80,
      renderCell: (params) => (
        <Link component="button" onClick={() => onPiNoClick(params.value)}>
          {params.value}
        </Link>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem>
              <strong>None</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'FORM M No.', field: 'form_m_num' },
    { headerName: 'PAAR No.', field: 'paar_num' },
    { headerName: 'PAAR Date', field: 'paar_date' },
    { headerName: 'Received On', field: 'received_on' },
    { headerName: 'Exchange Rate', field: 'exchange_rate' },
    { headerName: 'FOB Invoice Amount', field: 'fob_invoice_amount' },
    { headerName: 'FOB Uplift', field: 'fob_uplift' },
    { headerName: 'Freight Uplift', field: 'freight_uplift' },
    { headerName: 'Insurance Uplift.', field: 'insurance_uplift' },
    { headerName: 'CIF Value Naira', field: 'cif_value_naira' },
    { headerName: 'Remarks', field: 'remarks' }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {' '}
            <p> Insurance Details</p>
          </Box>
        }
      >
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
          }} columns={insuranceColumn} rows={paarData} />
      </MainCard>
    </div>
  );
};

export { FormMData, InsuranceData, PaarData };
