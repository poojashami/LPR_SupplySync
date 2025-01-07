import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Box, Button } from '@mui/material';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { GetCIList } from 'Redux/Apis/GetApiCalls';
import { toast } from 'react-toastify';

const ExchangeControllTable = () => {
  const dispatch = useDispatch();
  const { ci_list, isFetching } = useSelector((state) => state.purchaseOrder);
  const [NafdacData, setNafdacData] = useState([]);

  const fetchData = async () => {
    try {
      const sonDataMapped = ci_list
        ?.filter((item) => item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num)
        ?.map((item, index) => ({
          id: index + 1,
          pfi_id: item?.opo_master?.pfi_masters[0]?.pfi_id,
          pfi_num: item?.opo_master?.pfi_masters?.[0]?.pfi_num,
          ci_amount: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_amount,
          ci_id: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.commercial_invoice_id,
          ci_num: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num,
          bl_awb_no: item?.shippment_advise_master?.bl_awb_no,
          ba_num: item?.opo_master?.pfi_masters[0]?.form_ms[0]?.ba_num,
          revised_eta: item?.shippment_advise_master?.eta?.split('T')[0],
          tdo_dt: '',
          ecd_received: '',
          ecd_received_dt: '',
          multi_upload_copy: [],
          submitted_to_bank: '',
          multi_upload_copy_bank: []
        }));
      console.log('Fetching data:', sonDataMapped);
      setNafdacData(sonDataMapped);
    } catch (error) {
      console.error('Error fetching data:', error); // Log error
      setError(error); // Update state with error
    }
  };

  useEffect(() => {
    fetchData();
  }, [ci_list]);

  useEffect(() => {
    GetCIList(dispatch);
  }, []);

  const [file, setFile] = useState([]);

  // Custom file change handler for multi-file upload
  const handleFileChange = (event, params, name) => {
    const files = event.target.files;
    if (files.length > 0) {
      const fileNames = Array.from(files).map((file) => file.name);

      // Update NafdacData state with the filenames
      setNafdacData((prevState) => prevState.map((item) => (item.id === params?.row?.id ? { ...item, [name]: fileNames } : item)));
      setFile(files);
      console.log(`Uploaded ${files.length} files:`, files);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted:', NafdacData);

    const headers = {
      'Content-Type': 'multipart/form-data'
    };

    const formData = new FormData();

    const fileList = file;
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files[]', fileList[i]);
    }

    NafdacData.forEach((item, index) => {
      for (let key in item) {
        formData.append(`NafdacData[${index}][${key}]`, item[key]);
      }
    });

    try {
      const response = await axiosInstance.post('/api/commercial/invoice/exchange/controll', formData, {
        headers: headers
      });
      if (response.status === 201) {
        toast.success('Form submitted successfully');
      } else {
        console.error('Form submission failed:', response.status);
        toast.error('Error in Form submit');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('An error has occurred');
    }
  };

  const SonColumn = [
    { headerName: 'Sr No.', field: 'id', width: 50 }, // A simple column for the serial number.
    { headerName: 'CI Num', field: 'ci_num', width: 100 }, // A column for CI number.
    { headerName: 'BL Num', field: 'bl_awb_no', width: 150 }, // A column for BL number or AWB number.
    { headerName: 'Type of FORM M', field: 'type_of_form_m', width: 200 }, // Type of form.
    { headerName: 'BA Num', field: 'ba_num', width: 150 }, // BA number column.
    { headerName: 'CI Amount', field: 'ci_amount', width: 150 }, // CI Amount column.
    { headerName: 'ETA', field: 'revised_eta', width: 150 }, // ETA (Revised Estimated Time of Arrival).
    { headerName: 'TDO Date', field: 'tdo_dt', width: 150 }, // TDO date column.

    // Editable dropdown column for ECD received (Yes/No selection).
    {
      headerName: 'ECD Received',
      field: 'ecd_received',
      width: 200,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Yes', 'No']
    },

    // Editable date column for ECD Received Date.
    {
      headerName: 'ECD Received Date',
      field: 'ecd_received_dt',
      type: 'date',
      width: 180,
      editable: true
    },

    // Editable file upload column for multi-upload copies.
    {
      headerName: 'Upload Copy(MULTI)',
      field: 'multi_upload_copy',
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <input
            type="file"
            multiple
            onChange={(event) => handleFileChange(event, params, 'multi_upload_copy')}
            style={{ padding: '5px' }}
          />
        );
      }
    },
    // Editable dropdown column for Submitted to Bank (Yes/No selection).
    {
      headerName: 'Submitted to Bank',
      field: 'submitted_to_bank',
      width: 200,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Yes', 'No']
    },

    // Editable file upload column for Bank Acknowledgment copy.
    {
      headerName: 'Upload Bank Ack Copy',
      field: 'multi_upload_copy_bank',
      width: 200,
      renderCell: (params) => {
        return NafdacData[params?.row?.id - 1].submitted_to_bank === 'Yes' ? (
          <input
            type="file"
            multiple
            onChange={(event) => handleFileChange(event, params, 'multi_upload_copy_bank')}
            style={{ padding: '5px' }}
          />
        ) : (
          ''
        );
      }
    }
  ];

  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setNafdacData(NafdacData.map((row) => (row.id === newRow.id ? updatedRow : row)));
    console.log('NafdacData', NafdacData);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

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
            <span>EXchange Controll Doc(ECD)</span>
          </Box>
        }
      >
        <form onSubmit={handleSubmit}>
          <div>
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
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              columns={SonColumn}
              rows={NafdacData}
            />
          </div>
          <Box>
            <Button variant="contained" type="submit" onclick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </form>
      </MainCard>
    </div>
  );
};
export default ExchangeControllTable;
