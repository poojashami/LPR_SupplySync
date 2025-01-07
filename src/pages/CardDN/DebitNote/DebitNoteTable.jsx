import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { axiosInstance } from 'utils/axiosInstance';
import { Box, MenuItem, IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlusButton from 'components/CustomButton';
import DebitNoteView from './DebitNoteView';

const DebitNoteTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRowId, setAnchorElRowId] = useState(null);
  const openAction = Boolean(anchorEl);

  const [debitNoteData, setDebitNoteData] = useState([]);
  const [debitNoteRowData, setDebitNoteRowData] = useState({});
  const [debitNoteView, setDebitNoteView] = useState(false);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleView = (data) => {
    setDebitNoteRowData(data);
    setDebitNoteView(true);
  };

  const handleCloseView = () => {
    setDebitNoteView(false);
  };

  const debitNoteColumn = [
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
                handleView(params.row);
                handleClose();
              }}
            >
              <strong>View Debit Note</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'CI No.', field: 'ci_num', width: 150 },
    { headerName: 'BL No.', field: 'bl_num', width: 150 },
    { headerName: 'Importer Name', field: 'importer_name', width: 200 },
    { headerName: 'Port Of DC', field: 'port_of_dc', width: 150 },
    { headerName: 'C Num', field: 'c_num', width: 150 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/pfi/list');
        console.log('Fetching data:', response.data);
        const debitNoteDataMapped = response.data.map((item, index) => ({
          id: index + 1,
          c_num: item.c_num || 'N/A',
          ci_id: item.ci_id || 'N/A',
          port_of_dc: item.port_of_dc || 'N/A',
          ci_num: item.ci_num || 'N/A',
          importer_name: item.importer_name || 'N/A',
          bl_num: item.bl_num || 'N/A'
        }));
        console.log('Fetching data:', debitNoteDataMapped);
        setDebitNoteData(debitNoteDataMapped);
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
            {debitNoteView ? <p> Debit Note View</p> : <p>Pending Debit Note </p>}
            {debitNoteView ? (
              <span>
                <PlusButton label="Back" onClick={handleCloseView} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        {debitNoteView ? <DebitNoteView DebitNoteData={debitNoteRowData} /> : <DataGrid getRowHeight={() => 'auto'}
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
          }} columns={debitNoteColumn} rows={debitNoteData} />}
      </MainCard>
    </div>
  );
};

export default DebitNoteTable;
