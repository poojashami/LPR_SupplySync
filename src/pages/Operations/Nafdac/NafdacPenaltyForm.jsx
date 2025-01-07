import React, { useEffect, useState } from 'react';
import { Grid, TextField, MenuItem, Select, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';

const NafdacPenaltyForm = ({ NafdacData, onclose }) => {
  const [selectedPenalties, setSelectedPenalties] = useState([]);
  const [endorsementType, setEndorsementType] = useState('');
  const [FirstEndorsement, setFirstEndorsement] = useState(0);
  const [SecondEndorsement, setSecondEndorsement] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const getItemsData = async (id) => {
    try {
      console.log('id', id);
      const { data } = await axiosInstance.get('/api/shipping/advise/byid', {
        params: {
          shipment_advise_id: id
        }
      });
      const mappedData = data?.map((item, index) => ({
        id: index + 1,
        shipment_advise_item_id: item?.shipment_advise_item_id,
        item_name: item?.po_item?.item_name,
        uom: '',
        qty: item?.grn_qty,
        collected: 0,
        returned: 0,
        label_Lapse: 0,
        over_Import: 0,
        no_Permit: 0,
        false_Declaration: 0,
        no_Cria: 0,
        remarks: ''
      }));
      setInvoiceItems(mappedData);
      console.log('mappedData', mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let fromData = NafdacData?.nafdac_penalty?.nafdac_penalty_id
      ? {
          ci_id: NafdacData.ci_id,
          pfi_id: NafdacData.pfi_id,
          pfi_no: NafdacData.pfi_num,
          ci_num: NafdacData.ci_num,
          endorsement_penalty_type: endorsementType,
          first_endorsement: FirstEndorsement,
          Second_endorsement: SecondEndorsement,
          penalty_item_label: selectedPenalties.join(', '),
          invoiceItemsArr: invoiceItems,
          nafdac_penalty_id: NafdacData?.nafdac_penalty?.nafdac_penalty_id
        }
      : {
          ci_id: NafdacData.ci_id,
          pfi_id: NafdacData.pfi_id,
          pfi_no: NafdacData.pfi_num,
          ci_num: NafdacData.ci_num,
          endorsement_penalty_type: endorsementType,
          first_endorsement: FirstEndorsement,
          Second_endorsement: SecondEndorsement,
          penalty_item_label: selectedPenalties.join(', '),
          invoiceItemsArr: invoiceItems
        };
    console.log('fromData', fromData);
    try {
      const { data } = await axiosInstance.post('/api/commercial/invoice/nafdac/penalty', fromData);
      console.log('Successfully:', data);
      toast.success('Successfully');
      onclose();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
      toast.error('Error in Updated');
    }
  };

  useEffect(() => {
    if (NafdacData?.nafdac_penalty?.nafdac_penalty_id) {
      let mapped = NafdacData?.nafdac_penalty?.nafdac_penalty_items?.map((item, index) => ({
        id: index + 1,
        ...item
      }));
      setInvoiceItems(mapped);
      setEndorsementType(NafdacData?.nafdac_penalty?.endorsement_penalty_type);
      setFirstEndorsement(NafdacData?.nafdac_penalty?.first_endorsement);
      setSecondEndorsement(NafdacData?.nafdac_penalty?.Second_endorsement);
      let arr = NafdacData?.nafdac_penalty?.penalty_item_label?.split(', ');
      console.log('arr', arr);
      setSelectedPenalties(arr);
    } else {
      getItemsData(NafdacData?.shippment_advise_master?.shippment_advise_id);
    }
  }, []);

  const penaltyTypes = ['Label Lapse', 'Over Importation', 'No Import Permit', 'False Declaration', 'No CRIA'];

  const handlePenaltyChange = (event) => {
    const value = event.target.name;
    setSelectedPenalties((prev) => (prev.includes(value) ? prev.filter((penalty) => penalty !== value) : [...prev, value]));
  };

  // Handle endorsement type change
  const handleEndorsementTypeChange = (event) => {
    // console.log(selectedPenalties.join(', '));
    console.log('invoiceItems', invoiceItems);
    setEndorsementType(event.target.value);
  };

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setInvoiceItems(invoiceItems.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Columns for the DataGrid
  const columns = [
    { field: 'item_name', headerName: 'Item Name', width: 150 },
    { field: 'uom', headerName: 'UOM', width: 100 },
    { field: 'qty', headerName: 'Qty', width: 100 },
    {
      field: 'collected',
      headerName: 'Collected',
      width: 130,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'returned',
      headerName: 'Returned',
      width: 130,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'label_Lapse',
      headerName: 'Label Lapse',
      width: 150,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'over_Import',
      headerName: 'Over Import',
      width: 150,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'no_Permit',
      headerName: 'No Permit',
      width: 150,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'false_Declaration',
      headerName: 'False Declaration',
      width: 150,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'no_Cria',
      headerName: 'No CRIA',
      width: 150,
      type: 'number',
      editable: true,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
      type: 'text',
      editable: true,
      align: 'left',
      headerAlign: 'left'
    }
  ];

  return (
    <div>
      {/* Penalty Types Selection */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        {/* Endorsement Penalty Type Selection */}
        <Grid item xs={12} sm={3} style={{ marginLeft: '25px', marginTop: '15px' }}>
          <Typography variant="subtitle1">Select Endorsement Penalty Type</Typography>
          <Select
            sx={{
              '& .MuiInputBase-input': {
                padding: '6px'
              }
            }}
            fullWidth
            value={endorsementType}
            onChange={handleEndorsementTypeChange}
            displayEmpty
            defaultValue=""
          >
            <MenuItem value="1st Endorsement">1st Endorsement</MenuItem>
            <MenuItem value="2nd Endorsement">2nd Endorsement</MenuItem>
            <MenuItem value="Both">Both</MenuItem>
          </Select>
        </Grid>

        {/* Conditionally render input fields based on selected endorsement type */}
        {(endorsementType === '1st Endorsement' || endorsementType === 'Both') && (
          <Grid item xs={12} sm={2} style={{ marginLeft: '25px', marginTop: '15px' }}>
            <Typography variant="subtitle1">1st Endorsement</Typography>
            <TextField
              fullWidth
              value={FirstEndorsement}
              onChange={(e) => setFirstEndorsement(e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '6px'
                }
              }}
            />
          </Grid>
        )}

        {(endorsementType === '2nd Endorsement' || endorsementType === 'Both') && (
          <Grid item xs={12} sm={2} style={{ marginLeft: '25px', marginTop: '15px' }}>
            <Typography variant="subtitle1">2nd Endorsement</Typography>
            <TextField
              fullWidth
              value={SecondEndorsement}
              onChange={(e) => setSecondEndorsement(e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '6px'
                }
              }}
            />
          </Grid>
        )}

        {/* <Grid item xs={12} sm={12} style={{ marginLeft: '25px', marginTop: '10px' }}>
          <Typography variant="subtitle1">Select Penalty</Typography>
          {penaltyTypes.map((penalty) => (
            <FormControlLabel
              key={penalty}
              control={<Checkbox checked={selectedPenalties.includes(penalty)} onChange={handlePenaltyChange} name={penalty} />}
              label={penalty}
            />
          ))}
        </Grid> */}
      </Grid>

      {/* DataGrid for Commercial Invoice Items */}
      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          rows={invoiceItems}
          columns={columns}
          pageSize={5}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          rowHeight={30}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          disableSelectionOnClick
        />
      </div>

      {/* Submit Button */}
      <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
        {NafdacData?.nafdac_penalty?.nafdac_penalty_id ? (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Grid>
    </div>
  );
};

export default NafdacPenaltyForm;
