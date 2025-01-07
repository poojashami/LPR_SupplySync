import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { axiosInstance } from 'utils/axiosInstance';
import { Box, Menu, MenuItem } from '@mui/material';
import PlusButton from 'components/CustomButton';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QuotationSpoForm from './QuotationSpoForm';

const GenerateQuoTable = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);

  const [RfqData, setRfqData] = useState([]);
  const [quoRowDataData, setQuoRowData] = useState({});
  const [quotationFormView, setQuotationFormView] = useState(false);

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };

  const handleCloseView = () => {
    setQuotationFormView(false);
  };

  const handleOpenView = (data) => {
    setQuoRowData(data);
    setQuotationFormView(true);
  };

  const RfqColumn = [
    { headerName: 'S.NO', field: 'id', width: 50 },
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
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenView(params.row);
                handleCloseMenu();
              }}
            >
              <strong>Create Quotation</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: '#4680FF' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { headerName: 'Service RFQ No.', field: 'rfq_num', width: 150 },
    { headerName: 'PO No.', field: 'po_num', width: 150 },
    { headerName: 'Remarks', field: 'remarks', width: 250 },
    { headerName: 'Service Type', field: 'service_type', width: 150 },
    { headerName: 'Created On', field: 'created_on', width: 150 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/rfq/service');
        console.log('Fetching data:', response.data);
        const RfqDataMapped = response.data.map((item, index) => ({
          id: index + 1,
          po_num: item.po_id || 'N/A',
          po_id: item.po_id || 'N/A',
          remarks: item.service_description || 'N/A',
          service_type: item.service_type_id || 'N/A',
          created_on: item.createdAt || 'N/A',
          rfq_num: item.service_rfq_id || 'N/A'
        }));
        console.log('Fetching data:', RfqDataMapped);
        setRfqData(RfqDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
      }
    };
    fetchData();
  }, []);

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
            {quotationFormView ? <p> Quotation Form</p> : <p>List RFQ </p>}
            {quotationFormView ? (
              <span>
                <PlusButton label="Back" onClick={handleCloseView} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        {quotationFormView ? (
          <QuotationSpoForm rowData={quoRowDataData} onclose={handleCloseView} />
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
          }} columns={RfqColumn} rows={RfqData} />
        )}
      </MainCard>
    </div>
  );
};

export default GenerateQuoTable;
