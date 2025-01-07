import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import MainCard from 'components/MainCard';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { axiosInstance } from 'utils/axiosInstance';
import PlusButton from 'components/CustomButton';
import CardView from './CardView';

const CardTables = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);
  const [approvalPendingData, setApprovalPendingData] = useState([]);
  const [approvalRowData, setApprovalRowData] = useState({});
  const [openApprovalView, setOpenApprovalView] = useState(false);
  const handleOpenAssessmentForm = (data) => {
    setApprovalRowData(data);
    setOpenApprovalView(true);
  };

  const handleCloseApprovalView = () => {
    setOpenApprovalView(false);
  };

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
        const response = await axiosInstance.get('/api/pfi/list');
        console.log('Fetching data:', response.data);
        const pendingAllData = response.data.map((item, index) => ({
          id: index + 1,
          pfi_no: item.pfi_no || 'CI-000',
          inv_date: item.inv_date || 'Net 30',
          company: item.company || 'N/A',
          description_of_goods: item.description_of_goods || 'N/A',
          port_of_origin: item.port_of_origin || 'Electronic components',
          vessel: item.vessel || 'Electronics',
          received_eta_date: item.received_eta_date || 'USD',
          no_of_container: item.no_of_container || 25000,
          // for view
          co_ordinator_name: item.co_ordinator_name || 'N/A',
          inv_no: item.bl_date || 'N/A',
          // description_of_goods: item.description_of_goods || 'N/A',
          unit: item.unit || 'N/A',
          // port_of_origin: item.port_of_origin || 'N/A',
          revised_eta_date: item.revised_eta_date || 'N/A',
          no_of_container_size: item.no_of_container_size || 'N/A',
          gross_weight_cbm: item.gross_weight_cbm || 'N/A',
          cfr_amount: item.cfr_amount || 'N/A',
          remittance_terms: item.remittance_terms || 'N/A',
          awb_number: item.awb_number || 'N/A',
          form_m_no: item.form_m_no || 'N/A',
          sender: item.sender || 'N/A',
          eta: item.eta || 'N/A',
          c_no: item.c_no || 'N/A',
          free_days: item.free_days || 'N/A',
          port_of_destination: item.port_of_destination || 'N/A'
        }));
        console.log('Fetching data:', pendingAllData);
        setApprovalPendingData(pendingAllData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };
    fetchData();
  }, []);
  const pendingColumn = [
    {
      field: 'pfi_no',
      headerName: 'PFI No.',
      renderCell: (params) => (
        <Link component="button" onClick={() => handleOpenAssessmentForm(params.row)}>
          {params.value}
        </Link>
      )
    },

    { headerName: 'Inv No', field: 'inv_date' },
    { headerName: 'Company', field: 'company' },
    { headerName: 'Description Of Goods', field: 'description_of_goods' },
    { headerName: 'PORT Of Origin', field: 'port_of_origin' },
    { headerName: 'Vessel', field: 'vessel' },
    { headerName: 'Received ETA Date', field: 'received_eta_date' },
    { headerName: 'No of Container', field: 'no_of_container' }
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
            {openApprovalView ? <span>Card View Details</span> : <span>Card Details</span>}
            {openApprovalView ? (
              <span>
                <PlusButton label="Back" onClick={handleCloseApprovalView} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        <div>
          {openApprovalView ? (
            <CardView approvalViewData={approvalRowData} />
          ) : (
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
                  border: '1px solid rgba(224, 224, 224, 1)',
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={approvalPendingData}
              columns={pendingColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};

export default CardTables;
