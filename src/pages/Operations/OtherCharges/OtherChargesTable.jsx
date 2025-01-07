import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, MenuItem, IconButton, Menu } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GovtCharges from './UpdatePayment';
import DocCharges from './DocCharges';

const OtherChargesTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const [govtChargesData, setGovtChargesData] = useState([]);
  const [govtChargesForm, setGovtChargesForm] = useState(false);
  const [govtChargesRowData, setGovtChargesRowData] = useState({});
  const [govtChargesDoc, setGovtChargesDoc] = useState(false);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleOpenDoc = () => {
    setGovtChargesDoc(true);
    setGovtChargesForm(false);
  };

  const handleOpenGovtCharges = (data) => {
    setGovtChargesRowData(data);
    setGovtChargesForm(true);
    setGovtChargesDoc(false);
  };

  const handleFormMClose = () => {
    setGovtChargesDoc(false);
    setGovtChargesForm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/commercial/invoice/');
        console.log('Fetching data:', response.data);
        const govtChargesDataMapped = response.data.map((item, index) => ({
          id: index + 1,
          pfi_id: item.pfi_id || 2,
          pfi_no: item.pfi_no || 'PI-001',
          pfi_date: item.pfi_date || '2024-07-15',
          form_m_no: item.form_m_no || 'PI-001',
          form_m_date: item.form_m_date || '2024-07-15',
          c_num: item.c_num || 'N/A',
          ci_num: item.ci_num || 'N/A',
          paar_no: item.paar_no || 'N/A',
          ci_date: item.ci_date || 'N/A',
          bl_num: item.bl_num || 'Electronics',
          bl_date: item.bl_date || 'HDFC',
          port_of_dc: item.port_of_dc || 'HDFC',
          invoice_num: item.invoice_num || 'N/A',
          importer_name: item.importer_name || 'N/A',
          shipment_type: item.shipment_type || 'N/A',
          supplier_name: item.supplier_name || 'N/A',
          no_container: item.no_container || 'N/A',
          discharge_terminal: item.discharge_terminal || 'N/A',
          transfer_terminal: item.transfer_terminal || 'N/A',
          container_count: item.container_count || 'N/A',
          revised_eta: item.revised_eta || 'N/A',
          agency: item.agency || 'N/A',
          rotation_no: item.rotation_no || 'N/A',
          idec: item.idec || 'N/A',
          agent: item.agent || 'N/A'
        }));
        console.log('Fetching data:', govtChargesDataMapped);
        setGovtChargesData(govtChargesDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error); // Update state with error
      }
    };
    fetchData();
  }, []);

  const GovtChargesColumn = [
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
            <MenuItem
              onClick={() => {
                handleOpenGovtCharges(params.row);
                handleClose();
              }}
            >
              <strong>Add Govt Charges</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'CI No.', field: 'ci_num', width: 100 },
    { headerName: 'BL No', field: 'bl_num', width: 100 },
    { headerName: 'Rotation No', field: 'rotation_no', width: 100 },
    { headerName: 'Importer', field: 'agency', width: 120 },
    { headerName: 'Agent', field: 'agent', width: 100 },
    { headerName: 'Discharge Terminal', field: 'discharge_terminal', width: 150 },
    { headerName: 'Transfer Terminal', field: 'transfer_terminal', width: 150 },
    { headerName: 'IDEC', field: 'idec', width: 120 },
    { headerName: 'Revised ETA', field: 'revised_eta', width: 120 },
    { headerName: 'PAAR No.', field: 'paar_no', width: 120 },
    { headerName: 'C No.', field: 'c_num', width: 120 }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {govtChargesForm ? (
              <span>Other Charges Details</span>
            ) : govtChargesDoc ? (
              <span>View Govt Charges Doc</span>
            ) : (
              <span>Pending Govt Charges</span>
            )}
            {govtChargesForm ? (
              <span>
                <PlusButton label="Back" onClick={handleFormMClose} />
              </span>
            ) : govtChargesDoc ? (
              <PlusButton label="Back" onClick={handleFormMClose} />
            ) : (
              ''
            )}
          </Box>
        }
      >
        <div>
          {govtChargesForm ? (
            <GovtCharges GovtChargesData={govtChargesRowData} OpenDoc={handleOpenDoc} />
          ) : govtChargesDoc ? (
            <DocCharges />
          ) : (
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
          }} columns={GovtChargesColumn} rows={govtChargesData} />
          )}
        </div>
      </MainCard>
    </div>
  );
};
export default OtherChargesTable;
