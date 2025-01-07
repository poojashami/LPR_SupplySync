import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, TextField, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';

const ContainerDetailstable = () => {
  const [containerData, setContainerData] = useState([
    {
      id: 1,
      sr_no: 1,
      container_no: 'C1234',
      size: '20ft',
      type: 'Dry',
      seal_no: 'S1234',
      free_days: '5',
      arrival_date: '01.01.2024',
      freedays_ending_date: '15.01.2024',
      discharge_date: dayjs(),
      transfer_date: dayjs(),
      tdo_validity_date: dayjs()
    },
    {
      id: 2,
      sr_no: 2,
      container_no: 'C5678',
      size: '40ft',
      type: '40ft',
      seal_no: 'S5678',
      free_days: '5',
      arrival_date: '02.01.2024',
      freedays_ending_date: '16.01.2024',
      discharge_date: dayjs(),
      transfer_date: dayjs(),
      tdo_validity_date: dayjs()
    }
  ]);

  const [dataToUpdate, setDataToUpdate] = useState({});
  const [idOnDataToUpdate, setIdOnDataToUpdate] = useState(0);

  const [editState, setEditState] = useState({
    rowId: null,
    originalData: {}
  });

  const handleEditClick = (rowId) => {
    setIdOnDataToUpdate(rowId);
    setEditState({
      rowId,
      originalData: containerData.find((row) => row.id === rowId)
    });
  };

  const handleInputChange = (e, field) => {
    const value = e;
    setContainerData((prevData) => prevData.map((row) => (row.id === editState.rowId ? { ...row, [field]: value } : row)));
    setDataToUpdate({ ...dataToUpdate, [field]: value });
  };

  const handleSave = async () => {
    console.log(dataToUpdate, idOnDataToUpdate);
    try {
      const { data } = await axiosInstance.post('/api/container/addcontainer', {
        shipping_id: 1,
        container_id: idOnDataToUpdate,
        ...dataToUpdate
      });
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.message);
    }

    setEditState({
      rowId: null,
      originalData: {}
    });
  };

  const handleCancel = () => {
    setContainerData((prevData) => prevData.map((row) => (row.id === editState.rowId ? editState.originalData : row)));
    setEditState({
      rowId: null,
      originalData: {}
    });
  };

  const renderCell = (params, field) => {
    const isEditing = editState.rowId === params.id;

    return isEditing ? (
      // <TextField
      //   sx={{
      //     '& .MuiInputBase-input': {
      //       padding: '7px'
      //     },
      //     width: '100%',
      //     margin: '3px'
      //   }}
      //   value={params.row[field]}
      //   onChange={(e) => handleInputChange(e, field)}
      //   fullWidth
      // />

      <DatePicker
        sx={{
          '& .MuiInputBase-input': {
            padding: '7px'
          },
          width: '100%',
          margin: '3px'
        }}
        value={params.row[field]}
        onChange={(date) => handleInputChange(date, field)}
        fullWidth
      />
    ) : (
      <DatePicker
        disabled
        sx={{
          '& .MuiInputBase-input': {
            padding: '7px'
          },
          width: '100%',
          margin: '3px'
        }}
        value={params.row[field]}
      />
    );
  };

  const containerdetialColumn = [
    {
      field: 'sr_no',
      headerName: 'Sr. No',
      width: 80
      // , renderCell: (params) => renderCell(params, 'sr_no')
    },
    {
      field: 'container_no',
      headerName: 'Container No',
      width: 150
      // , renderCell: (params) => renderCell(params, 'container_no')
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 100
      //  renderCell: (params) => renderCell(params, 'size')
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100
      //  renderCell: (params) => renderCell(params, 'type')
    },
    {
      field: 'seal_no',
      headerName: 'Seal No',
      width: 150
      // renderCell: (params) => renderCell(params, 'seal_no')
    },
    {
      field: 'free_days',
      headerName: 'Free Days',
      width: 80
      // renderCell: (params) => renderCell(params, 'freedays_ending_date')
    },
    {
      field: 'arrival_date',
      headerName: 'Arrival Date',
      width: 150
      //  renderCell: (params) => renderCell(params, 'arrival_date')
    },
    {
      field: 'freedays_ending_date',
      headerName: 'Free Days Ending Date',
      width: 200
      // renderCell: (params) => renderCell(params, 'freedays_ending_date')
    },

    { field: 'discharge_date', headerName: 'Discharge Date', width: 150, renderCell: (params) => renderCell(params, 'discharge_date') },
    { field: 'transfer_date', headerName: 'Transfer Date', width: 150, renderCell: (params) => renderCell(params, 'transfer_date') },
    {
      field: 'tdo_validity_date',
      headerName: 'TDO Valid Up To',
      width: 150,
      renderCell: (params) => renderCell(params, 'tdo_validity_date')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {editState.rowId === params.id ? (
            <>
              <IconButton size="small" onClick={handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton size="small" onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <IconButton size="small" onClick={() => handleEditClick(params.id)}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ];

  return (
    // <MainCard
    //   title={
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         justifyContent: 'space-between',
    //         alignItems: 'center'
    //       }}
    //     >
    //       <span>Container Details</span>
    //       <span>
    //         <PlusButton label="Back" />
    //       </span>
    //     </Box>
    //   }
    // >
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
          }} columns={containerdetialColumn} rows={containerData} />
    // </MainCard>
  );
};

export default ContainerDetailstable;
