import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, TextField, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const formatDate = (date) => {
  return date ? date.format('YYYY-MM-DD') : '';
};

const parseDate = (dateString) => {
  return dateString ? dayjs(dateString, 'DD-MM-YYYY') : null;
};

const Container = () => {
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    getCointainerAllocationData();
  }, []);

  const getCointainerAllocationData = async () => {
    try {
      const response = await axiosInstance.get('/api/operation/container/allocation');
      console.log('response.data:', response.data);
      const lapseKey = response.data.map((data, index) => ({
        id: index + 1,
        container_no: data?.container_allocation_id || 'N/A',
        size: data?.container_count || 'N/A',
        type: data?.container_types || 'N/A',
        seal_no: data?.seal_no || 'N/A',
        transporter: data?.transporter || 'N/A',
        tdo_handover_date: data?.tdo_given_date?.split('T')[0] || 'N/A',
        truck_gate_in_date: data?.truck_gate_in_date?.split('T')[0] || 'N/A',
        terminal_out_date: data?.terminal_out_date?.split('T')[0] || 'N/A',
        location_delivery_date: data?.location_delivery_date?.split('T')[0] || 'N/A',
        location_offloading_date: data?.location_offloading_date?.split('T')[0] || 'N/A',
        empty_return_date: data?.empty_return_date?.split('T')[0] || 'N/A',
        empty_drop_location: data?.empty_drop_location || 'N/A',
        eir_received_date: data?.eir_received_date?.split('T')[0] || 'N/A',
        eir_file: data?.eir_file_name || 'Upload File'
      }));
      console.log('lapseKey:', lapseKey);
      setRows(lapseKey);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const DateEditor = (props) => {
    const { api, value, field, row, id } = props;
    const [date, setDate] = React.useState(parseDate(value));

    const handleChange = async (newDate) => {
      setDate(newDate);
      api.setEditCellValue({ id, field, value: newDate ? formatDate(newDate) : '' });

      console.log('date2: ', formatDate(newDate), field, row.container_no);

      let data = { container_allocation_id: row.container_no, [field]: formatDate(newDate) };
      const response = await axiosInstance.put('/api/operation/container/allocation', data);
      if (response.status === 200) {
        console.log('Updated successfully:', response.data);
        getCointainerAllocationData();
        toast.success('Updated successfully');
      } else {
        console.error('Form submission failed:', response.status);
        toast.error('Error in Form submit');
      }
    };

    return <DatePicker value={date} onChange={handleChange} renderInput={(params) => <TextField {...params} />} />;
  };

  const FileUploadCell = ({ id, api, field }) => {
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        api.setEditCellValue({ id, field, value: file.name });
        console.log('File selected:', file);
      }
    };

    return (
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onChange={handleFileChange}
      >
        Upload file
        <VisuallyHiddenInput type="file" />
      </Button>
    );

    //   <TextField type="file" onChange={handleFileChange} InputProps={{ disableUnderline: true }} variant="outlined" fullWidth />;
  };

  const TransporterCell = ({ id, api, field, value, row }) => {
    const [transporter, setTransporter] = React.useState(value);
    const handleSubmit = async () => {
      api.setEditCellValue({ id, field, value: transporter });
      try {
        await axiosInstance.put('/api/operation/container/allocation', {
          container_allocation_id: row.container_no,
          transporter: transporter
        });
        toast.success('Transporter Updated successfully');
        console.log('Transporter updated successfully');
      } catch (error) {
        console.error('Error updating transporter:', error);
        toast.error('Error in Form submit');
      }
    };

    return (
      <TextField
        type="text"
        onBlur={handleSubmit}
        onChange={(e) => setTransporter(e.target.value)}
        value={transporter}
        InputProps={{ disableUnderline: true }}
        variant="outlined"
        fullWidth
      />
    );
  };

  const columns = [
    { headerName: 'SL. No.', field: 'id', width: 50 },
    { headerName: 'Container No.', field: 'container_no', width: 150 },
    { headerName: 'Size', field: 'size', width: 80 },
    { headerName: 'Type', field: 'type', width: 80 },
    { headerName: 'Seal No.', field: 'seal_no', width: 80 },
    {
      headerName: 'Transporter',
      field: 'transporter',
      width: 200,
      editable: true,
      valueFormatter: (params) => params.value,
      renderEditCell: (params) => <TransporterCell {...params} />
    },
    {
      field: 'tdo_handover_date',
      headerName: 'TDO Handover Date',
      width: 200,
      editable: true,
      renderEditCell: (params) => <DateEditor {...params} />
    },
    { headerName: 'Truck Gate In Date', field: 'truck_gate_in_date', width: 150 },
    { headerName: 'Terminal Out Date', field: 'terminal_out_date', width: 150 },
    { headerName: 'Location Delivery date', field: 'location_delivery_date', width: 150 },
    { headerName: 'Location Offloading date', field: 'location_offloading_date', width: 150 },
    { headerName: 'Empty Return Date', field: 'empty_return_date', width: 150 },
    { headerName: 'Empty Drop Location', field: 'empty_drop_location', width: 150 },
    {
      headerName: 'EIR Received Date',
      field: 'eir_received_date',
      width: 150,
      editable: true,
      renderEditCell: (params) => <DateEditor {...params} />
    },
    {
      headerName: 'EIR File',
      field: 'eir_file',
      width: 150,
      editable: true,
      valueFormatter: (params) => params.value,
      renderEditCell: (params) => <FileUploadCell {...params} />
    }
  ];

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <p> Edit Container Details</p>
        </Box>
      }
    >
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
        rows={rows}
        columns={columns}
      />
    </MainCard>
  );
};

export default Container;
