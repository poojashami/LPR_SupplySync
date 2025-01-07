import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { axiosInstance } from 'utils/axiosInstance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import QuotationCompare from './QuotationCompare';

const RfqSpoTable = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const [compareMode, setCompareMode] = useState(null);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const cols = [
    { headerName: 'S.NO', field: 'id', width: 50 },
    {
      headerName: 'Actions',
      field: 'status',
      width: 100,
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
                // navigate('/postshipmemt/paar/view');
                handleClose();
                setCompareMode(params.row);
              }}
              // disabled={params.value === 2}
            >
              <strong> {params.value !== 2 ? 'PO Sent' : 'Compare Quotes'} </strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'Service RFQ No.', field: 'rfq_num', width: 150 },
    { headerName: 'Service PO No.', field: 'po_num', width: 150 },
    { headerName: 'Remarks', field: 'remarks', width: 250 },
    { headerName: 'Service Type', field: 'service_type', width: 150 },
    { headerName: 'Created On', field: 'created_on', width: 150 }
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get('/api/pfi/list');
  //       const mapped = response.data.map((item, index) => ({
  //         id: index + 1,
  //         po_num: item.po_num || 'N/A',
  //         po_id: item.po_id || 'N/A',
  //         remarks: item.remarks || 'N/A',
  //         service_type: item.service_type || 'N/A',
  //         created_on: item.created_on || 'N/A',
  //         rfq_num: item.rfq_num || 'N/A'
  //       }));
  //       setData(mapped);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/rfq/service');
        console.log('Fetching data:', response.data);
        const debitNoteDataMapped = response.data.map((item, index) => ({
          id: index + 1,
          po_num: item.po_id || 'N/A',
          po_id: item.po_id || 'N/A',
          remarks: item.service_description || 'N/A',
          service_type: item.service_type_id,
          created_on: item.createdAt || 'N/A',
          rfq_num: item.service_rfq_id || 'N/A',
          status: item.status || 0
        }));
        console.log('Fetching data:', debitNoteDataMapped);
        setData(debitNoteDataMapped);
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
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {compareMode ? <span>Compare Quotation</span> : <p> List Service RFQ</p>}
          </Box>
        }
      >
        {compareMode ? (
          <QuotationCompare setCompareMode={setCompareMode} compareMode={compareMode} />
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
                borderBottom: '2px solid rgba(224, 224, 224, 1)'
              }
            }}
            columns={cols}
            rows={data}
          />
        )}
      </MainCard>
    </div>
  );
};

export default RfqSpoTable;
