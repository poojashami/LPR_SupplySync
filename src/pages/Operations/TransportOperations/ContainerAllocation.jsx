import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import { Box, Grid, Typography, Button, MenuItem, IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import TransportExpense from './TransportExpense';

const ContainerAllocation = ({ transportOperationsData }) => {
  const [billFormView, setBillFormView] = useState(false);
  const [rowData, setRowData] = useState({});

  return (
    <div>
      {billFormView ? (
        <TransportExpense transportOperationsData={transportOperationsData} setAddBillFormView={setBillFormView} rowData={rowData} />
      ) : (
        <div>
          <ContainerAllocationTable
            transportOperationsData={transportOperationsData}
            setBillFormView={setBillFormView}
            setRowData={setRowData}
          />
          <ContainerAddBillTable transportOperationsData={transportOperationsData} />
        </div>
      )}
    </div>
  );
};

export default ContainerAllocation;

const ContainerAllocationTable = ({ setBillFormView, setRowData, transportOperationsData }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);
  const [values, setValues] = useState({
    ci_id: null,
    ci_num: null,
    bl_num: null
  });

  const [containerData, setContainerData] = useState([]);

  //container allocation by bl no-----------
  const [containerTypes, setContainerTypes] = useState([]);

  useEffect(() => {
    if (transportOperationsData) {
      // console.log();
      fetchContainerAllocation(transportOperationsData?.ci_id);
      console.log(transportOperationsData?.shippment_advise_master?.bl_awb_no);
      setValues((val) => ({
        ...val,
        ci_id: transportOperationsData?.ci_id,
        ci_num: transportOperationsData?.ci_num,
        bl_num: transportOperationsData?.shippment_advise_master?.bl_awb_no
      }));
    }
    if (transportOperationsData?.add_shippment_containers) {
      console.log(transportOperationsData?.add_shippment_containers);
      const data = transportOperationsData?.add_shippment_containers?.map((container, index) => {
        return {
          id: index + 1,
          type_of_container: container?.container_type_name,
          num_of_container: 1,
          flex: 1
        };
      });
      setContainerTypes(data);

      const data2 = transportOperationsData?.add_shippment_containers?.map((container, index) => {
        return {
          id: index + 1,
          num_of_container: container?.container_no,
          no_of_container_allocated: container?.container_no,
          type_of_container: container?.container_type_name,
          transporter: '',
          delivery_location: '',
          rate: '',
          tdo_given_date: '',
          payment_terms: '',
          flex: 1
        };
      });
      setTransporter(data2);
    }
  }, []);

  const fetchContainerAllocation = async (id) => {
    console.log(id);
    try {
      if (id) {
        const { data } = await axiosInstance.get('/api/commercial/invoice/container/allocation', {
          params: {
            ci_id: id
          }
        });
        console.log(data);
        setContainerData(data?.map((item, index) => ({ ...item, id: index, tdo_given_date: item?.tdo_given_date?.split('T')[0] })));
      }
    } catch (error) {
      toast.error('An Error has occurred while fetching Container allocation data' + error);
    }
  };

  const [Transporter, setTransporter] = useState([]);

  const handleSubmitAllocation = async () => {
    try {
      const { data } = await axiosInstance.post('/api/operation/container/allocation', {
        ...values,
        containerArr: Transporter
      });
      console.log('Submitted data' + data);
    } catch (error) {
      toast.error('An error occurred while submitting Allocation:' + error.message);
    }
  };

  const [selected, setSelected] = useState([]);
  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleAddBillClick = (data) => {
    setRowData(data);
  };

  // useEffect(() => {
  //   getContainerAllocationDetails();
  // }, []);

  // const getContainerAllocationDetails = async () => {
  //   try {
  //     const response = await axiosInstance.get('/api/operation/container/allocation');
  //     const payload = response.data.map((item, index) => ({
  //       id: index + 1,
  //       container_allocation_id: item.container_allocation_id,
  //       ci_id: item.ci_id,
  //       ci_num: item.ci_num,
  //       form_m_id: item.form_m_id,
  //       form_m_num: item.form_m_num,
  //       transporter: item.transporter,
  //       num_of_container_allocated: item.container_count,
  //       type_of_container_allocated: item.type_of_container,
  //       rate: item.rate,
  //       tds_given_date: item.tdo_given_date,
  //       delivery_location: item.delivery_location,
  //       payment_term: item.payment_term
  //     }));
  //     console.log('container response', payload);

  //     setContainerData(payload);
  //   } catch (error) {
  //     console.error('Error fetching lapse types:', error);
  //   }
  // };

  const handleSelectionModelChange = (newSelectionModel) => {
    const selectedRows = containerData.filter((row) => newSelectionModel.includes(row.id));
    setSelected(selectedRows);
  };

  const handleDelete = async () => {
    let data = selected.map((i) => i.container_allocation_id).join(', ');

    console.log(selected, selected.map((i) => i.container_allocation_id).join(', '));

    try {
      const response = await axiosInstance.delete('/api/operation/container/allocation', {
        params: { container_allocation_id: data }
      });

      console.log('Deleted successfully:', response.data);
      toast.success('Deleted successfully');
      setSelected([]);
      // getContainerAllocationDetails();
    } catch (error) {
      console.error('Error deleting container allocations:', error);
    }
  };
  const allocatedContainerDetail = [
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
                handleAddBillClick(containerData?.filter((item) => item?.transporter === params?.row?.transporter));
                setBillFormView(true);
                handleClose();
              }}
            >
              <strong>Add Bill</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { headerName: 'Transporter', field: 'transporter', width: 250 },
    { headerName: 'No. of Container Allocated', field: 'no_of_container_allocated', width: 100 },
    { headerName: 'Type of Container Allocated', field: 'type_of_container', width: 150 },
    { headerName: 'Rate', field: 'rate', width: 100 },
    { headerName: 'TDS Given Date', field: 'tdo_given_date', width: 150 },
    { headerName: 'Delivery Location', field: 'delivery_location', width: 200 },
    { headerName: 'Payment Term', field: 'payment_terms', width: 100 }
  ];

  //container allocation by bl no------------
  const containerTypeColumn = [
    { headerName: 'Container Type', field: 'type_of_container', width: 100 },
    { headerName: 'No. Of Container', field: 'num_of_container', width: 125 }
  ];

  const containerAllocationToTransporter = [
    { headerName: 'Sr. No', field: 'num_of_container', width: 75 },

    { headerName: 'No of Container Allocate', field: 'no_of_container_allocated', width: 200 },
    { headerName: 'Type of Container', field: 'type_of_container', width: 150 },
    {
      headerName: 'Select Transporter',
      field: 'transporter',
      width: 200,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Transporter 1', 'Transporter 2', 'Transporter 3']
    },
    { headerName: 'Delivery Location', field: 'delivery_location', width: 200, editable: true },
    { headerName: 'Rate', field: 'rate', width: 100, editable: true },
    { headerName: 'TDO Given on', field: 'frv', width: 125, editable: true, type: 'date' },
    { headerName: 'Payment Terms', field: 'payment_terms', width: 125, editable: true }
  ];

  const [rowModesModel, setRowModesModel] = React.useState({});
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setTransporter(Transporter.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <>
      {/* ---------------------------------------------------container details--------------------------------------------------- */}
      <Card variant="outlined" sx={{ p: 1, mt: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mr: 1 }}>
                  Bl No:
                </Typography>
                <Typography variant="body2">{values?.bl_num}</Typography>
              </Box>
              <Box>
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
                    },
                    height: '200px'
                  }}
                  rows={containerTypes}
                  columns={containerTypeColumn}
                  checkboxSelection={false}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  showCellVerticalBorder
                  showColumnVerticalBorder
                  pageSizeOptions={[5]}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={9}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, mr: 1 }}>
                Allocate Container to Transporter
              </Typography>
            </Box>
            <Box>
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
                  },
                  height: '200px'
                }}
                rows={Transporter}
                columns={containerAllocationToTransporter}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                hideFooter
                hideFooterSelectedRowCount
                hideFooterPagination
                pageSizeOptions={[5]}
              />
            </Box>
          </Grid>
        </Grid>

        <Box>
          {/* detail section */}

          <Box></Box>
          <Box>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleSubmitAllocation} color="primary" type="submit" sx={{ mr: 2 }}>
                Submit Allocation
              </Button>
            </Grid>
          </Box>
        </Box>
      </Card>

      <div style={{ paddingTop: '2vh' }}>
        <div>
          <h3>Container Allocation Details</h3>
        </div>
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
            },
            height: '200px'
          }}
          rows={containerData}
          columns={allocatedContainerDetail}
          pageSizeOptions={[5]}
          style={{ minHeight: '20vh', height: '50vh', width: '100%' }}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionModelChange}
          selectionModel={selected.map((v) => v.id)}
          filterModel={{
            items: allocatedContainerDetail.map((col) => ({
              columnField: col.field,
              operatorValue: 'contains',
              value: ''
            }))
          }}
        />

        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="standard"
            sx={{
              border: '1px solid red',
              color: 'red'
            }}
            onClick={handleDelete}
            // disabled={selectedRows.length === 0}
          >
            Delete Allocation
          </Button>
        </Grid>
      </div>
    </>
  );
};

const ContainerAddBillTable = () => {
  const [addBillData, setAddBillData] = useState([]);

  useEffect(() => {
    getContainerAllocationDetails();
  }, []);

  const getContainerAllocationDetails = async () => {
    try {
      const response = await axiosInstance.get('/api/operation/container/allocation/add/bill');
      const payload = response.data.map((item, index) => ({
        id: index + 1,
        payment_type: item.payment_type,
        party: item.bll_party,
        invoice_num: item.bill_invoice_num,
        invoice_date: item.bill_invoice_date,
        amount: item.bill_amount,
        vat: item.bill_vat,
        deduction: item.bill_deduction,
        total: Number(item.vat + item.deduction + item.amount),
        narration: item.bill_narration,
        delivery_location: item.delivery_location,
        document: item.payment_terms || 'View Document'
      }));
      console.log('container response', payload);

      setAddBillData(payload);
    } catch (error) {
      console.error('Error fetching lapse types:', error);
    }
  };

  const allocatedContainerDetail = [
    { headerName: 'Payment Type', field: 'payment_type', width: 100 },
    { headerName: 'Party', field: 'party', width: 100 },
    { headerName: 'Invoice No.', field: 'invoice_num', width: 100 },
    { headerName: 'Invoice Date', field: 'invoice_date', width: 100 },
    { headerName: 'Amount', field: 'amount', width: 100 },
    { headerName: 'VAT', field: 'vat', width: 100 },
    { headerName: 'Deduction', field: 'deduction', width: 100 },
    { headerName: 'Total', field: 'total', width: 100 },
    { headerName: 'Narration', field: 'narration', width: 100 },
    { headerName: 'Document', field: 'document', width: 200 }
  ];

  return (
    <div style={{ paddingTop: '5vh' }}>
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
          },
          height: '200px'
        }}
        columns={allocatedContainerDetail}
        rows={addBillData}
        style={{ minHeight: '20vh' }}
      />
    </div>
  );
};
