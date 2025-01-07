import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';

function EditToolbar(props) {
  const { rows, setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = rows.length === 0 ? 1 : rows.length + 1;
    setRows((oldRows) => [...oldRows, { id, number_container: 0, shipment_advise_rate: 0, type_container: '', rate: 0, line_total: 0 }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
    }));
  };

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h3>Freight Charges</h3>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Container
      </Button>
    </GridToolbarContainer>
  );
}

export default function AddFreightCharges({ rows, setRows, freightChargesLength }) {
  const { cont_sizes } = useSelector((state) => state.static);
  const [containerType, setContainerType] = React.useState([]);

  React.useEffect(() => {
    console.log('rows', rows);
  }, [rows]);

  React.useEffect(() => {
    console.log('cont_sizes', cont_sizes);
    const containerNames = cont_sizes.map((item) => ({ label: item?.container_type_name.trim(), value: item?.container_type_master_id }));
    setContainerType(containerNames);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    if (id > freightChargesLength) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedLineTotal = Number(newRow.number_container) * Number(newRow.shipment_advise_rate);
    const updatedRow = {
      ...newRow,
      line_total: updatedLineTotal,
      isNew: false
    };
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'S.No',
      type: 'number',
      width: 50,
      align: 'center',
      headerAlign: 'left'
    },
    {
      field: 'number_container',
      headerName: 'No. of Container',
      width: 120,
      headerAlign: 'right',
      align: 'center',
      editable: true
    },
    {
      field: 'type_container',
      headerName: 'Types of Container',
      width: 200,
      editable: true,
      align: 'center',
      type: 'singleSelect',
      valueOptions: containerType
    },
    {
      field: 'rate',
      headerName: 'Rate',
      headerAlign: 'right',
      align: 'right',
      width: 100
    },
    {
      field: 'shipment_advise_rate',
      headerName: 'Advise Rate',
      headerAlign: 'right',
      align: 'right',
      width: 200,
      // editable: true
      renderCell: (params) => {
        return (
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '6px',
                textAlign: 'right' // Ensure text is right-aligned inside the input
              },
              '& .Mui-disabled': {
                '-webkit-text-fill-color': '#4f4f4f'
              },
              width: '100%'
            }}
            type="number"
            name="add_amount"
            value={rows[params.row.id - 1]?.shipment_advise_rate}
            onChange={(e) => handleChangeAddAmount(e, params.row)}
            onBlur={(e) => handleBlurAddAmount(e, params.row)}
          />
        );
      }
    },
    {
      field: 'line_total',
      headerName: 'Total',
      headerAlign: 'right',
      align: 'right',
      width: 100
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main'
                }}
                onClick={handleSaveClick(id)}
              />
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </>
          ];
        }

        return [
          <>
            {id > freightChargesLength && (
              <>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />
              </>
            )}
          </>
        ];
      }
    }
  ];

  const handleChangeAddAmount = (e, row) => {
    const { value } = e.target;
    setRows((prevState) => prevState.map((item) => (item.id === row?.id ? { ...item, shipment_advise_rate: value } : item)));
  };

  const handleBlurAddAmount = (e, row) => {
    setRows((prevState) =>
      prevState.map((item) => {
        console.log(Number(item?.shipment_advise_rate) * Number(item?.number_container));
        return item.id === row?.id ? { ...item, line_total: Number(item?.shipment_advise_rate) * Number(item?.number_container) } : item;
      })
    );
  };

  return (
    <>
      <Box
        sx={{
          '& .actions': {
            color: 'text.secondary'
          },
          '& .textPrimary': {
            color: 'text.primary'
          }
        }}
      >
        <DataGrid
          getRowHeight={() => 'auto'}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          sx={{
            minHeight: '20vh',
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              padding: '0px'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              border: '1px solid rgba(224, 224, 224, 1)',
              height: '25px !important'
            },
            '& .bold': {
              fontWeight: 'bolder'
            }
          }}
          slots={{
            toolbar: EditToolbar
          }}
          slotProps={{
            toolbar: { rows, setRows, setRowModesModel }
          }}
          isCellEditable={(params) => params.row.id > freightChargesLength}
          rowHeight={25}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </Box>
    </>
  );
}
