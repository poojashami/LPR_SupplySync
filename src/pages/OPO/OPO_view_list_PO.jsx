import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import PlusButton from 'components/CustomButton';
import OpoView from './OpoView';

const OPO_view_list = () => {
  const [selected_quote, setSelected_quote] = useState(null);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [opos, setOpos] = React.useState([]);
  const [viewopo, setViewOpo] = useState(false);
  const [dataToSend, setDataToSend] = useState({});
  const [formdata, setFormdata] = React.useState({});
  const [selected_opos, setSelected_opos] = useState([]);

  const handleCloseDialogue = () => {
    setOpen(false);
  };

  const handleOpenDialogue = () => {
    setOpen(true);
  };

  const cols = [
    {
      field: 'opo_num',
      headerName: 'OPO No.',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { headerName: 'Quotation No.', field: 'quo_num', width: 120 },
    { headerName: 'Vendor No.', field: 'vendor_num', width: 120 },
    { headerName: 'Vendor Name', field: 'vendor_name', width: 180 },
    { headerName: 'Delivery Term', field: 'delivery_term', width: 100 },
    { headerName: 'Payment Term', field: 'payment_term', width: 250 },
    { headerName: 'Lead time', field: 'lead_time', width: 100 },
    { headerName: 'Total Cost', field: 'total_cost', width: 150 },
    // { headerName: 'Total Cost in USD', field: 'total_cost_usd' }
  ];

  const handleViewClick = async (data) => {
    setRowData(data);
    setViewOpo(true);
  };
  const handleClose = async () => {
    setRowData({});
    setViewOpo(false);
  };

  const fetch_data = async () => {
    try {
      const { data } = await axiosInstance.get('/api/opo');
      console.log(data);
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        quo_id: item?.quo_id,
        opo_num: item?.opo_num,
        quo_num: item?.quo_num,
        item_id: item?.opo_items,
        vendor_id: item?.vendor_id,
        opo_id: item?.opo_master_id,
        lead_time: item?.quotation_master?.lead_time,
        vendor_name: item?.VendorsMaster?.vendor_name,
        total_cost: item?.quotation_master?.total_cost +
          item?.quotation_master?.additional_costs?.reduce((acc, amount) => { return !amount.reference_table_name ? acc = Number(acc) + Number(amount.charge_amount) : acc }, 0),
        vendor_num: item?.VendorsMaster?.vendor_series,
        payment_term: item?.quotation_master?.payment_terms,
        payment_term_id: item?.quotation_master?.payment_terms,
        delivery_term: item?.quotation_master?.delivery_terms_name,
        procurement_justification: item.procurement_justification,
        delivery_term_id: item?.quotation_master?.delivery_terms,
        total_cost_usd: item?.quotation_master?.total_cost,
        unit_justification: item.unit_justification,
        quotation_master: item?.quotation_master,
        opo_description: item.opo_description,
        VendorsMaster: item?.VendorsMaster,
        OprMaster: item?.OprMaster,
        opo_items: item?.opo_items,
        status: item?.status,
        form_m_num: item?.pfi_masters[0]?.form_ms[0]?.form_m_num,
        lc_num: item?.pfi_masters[0]?.letter_of_credits[0]?.lc_num
      }));

      setOpos(mappedData);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  React.useEffect(() => {
    fetch_data();
  }, []);

  const handleSelectionModelChange = (selectionModel) => {
    const selectedIDs = new Set(selectionModel);
    const selectedRowData = opos.filter((row) => selectedIDs.has(row.id));
    const items = selectedRowData?.map((item) => item?.item_id).flat();
    console.log(selectedRowData[0]?.quo_num);
    setSelected_quote(selectedRowData[0]?.quo_num);
    const items_sum = items.reduce((acc, item) => {
      if (!acc[item.item_id]) {
        acc[item.item_id] = { ...item, opr_qty: item.opr_qty };
      } else {
        acc[item.item_id].opr_qty += item.opr_qty;
      }
      return acc;
    }, {});
    setSelected_opos(selectedRowData);
    setFormdata({
      opo_list: selectedRowData,
      items_list: Object.values(items_sum),
      total_cost: selectedRowData.reduce((accumulator, item) => Number(accumulator) + Number(item.total_cost), 0),
      quote_date: selectedRowData[0]?.quo_id
    });
  };

  const submit = async () => {
    try {
      const newDataToSend = {
        ...dataToSend,
        items_list: formdata?.items_list,
        total_cost: formdata?.total_cost,
        opo_ids: formdata?.opo_list?.map((item) => item.opo_id).join(', '),
        opo_nums: formdata?.opo_list?.map((item) => item.opo_num).join(', '),
        vendor_id: formdata?.opo_list?.[0]?.vendor_id,
        lead_time: formdata?.opo_list?.map((item) => item.lead_time).join(', '),
        payment_terms: formdata?.opo_list?.map((item) => item.payment_term_id).join(', '),
        delivery_terms: formdata?.opo_list?.map((item) => item.delivery_term_id).join(', '),
        quo_id: formdata?.quote_date
      };

      setDataToSend(newDataToSend);

      const { data } = await axiosInstance.post('/api/po/create', newDataToSend);
      toast.success(data.message);
      fetch_data();
      setFormdata({});
      setSelected_opos([]);
      setDataToSend({});
      handleCloseDialogue();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <MainCard
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {viewopo ? <span>Issued OPO </span> : <span>OPO List for PO</span>}
          {viewopo ? (
            <span>
              <PlusButton label="Back" onClick={handleClose} />
            </span>
          ) : (
            ''
          )}
        </Box>
      }
    >
      <div>
        {viewopo ? (
          <OpoView rowData={rowData} GeneratePO={true} />
        ) : (
          <Box sx={{ height: '50vh', width: '100%', marginBottom: '50px' }}>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                marginBottom: '20px',
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
                  alignItems: 'center',
                  minHeight: '30px'
                },
                '& .MuiDataGrid-checkboxInput': {
                  padding: '0px'
                },
                '& .MuiCheckbox-root': {
                  width: '18px',
                  height: '18px'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={opos}
              pageSize={5}
              columns={cols}
              // checkboxSelection
              rowsPerPageOptions={[5]}
              // onRowSelectionModelChange={handleSelectionModelChange}
              isRowSelectable={(params) =>
                selected_quote === null || selected_quote === undefined ? true : params.row.quo_num === selected_quote
              }
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  handleOpenDialogue();
                  // submit();
                }}
              >
                Submit
              </Button>
            </Box>
            <Dialog open={open} onClose={handleCloseDialogue} aria-labelledby={'merged'}>
              <DialogTitle id={'merged'}></DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {selected_opos?.length > 1 ? 'You are merging multiple OPO into one PO' : 'You are going to raise a PO from OPO No.'}
                  <ol>
                    {selected_opos.map((item, index) => (
                      <li key={index}>
                        <em style={{ color: 'red' }}>{item?.opo_num}</em>
                      </li>
                    ))}
                  </ol>
                </DialogContentText>
                <Box fullWidth sx={{ display: 'flex', gap: '12px' }}>
                  <TextField
                    fullWidth
                    id="remarks"
                    label="Remarks"
                    name="remarks"
                    value={dataToSend?.remarks}
                    onChange={(e) => setDataToSend((val) => ({ ...val, [e.target.name]: e.target.value }))}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialogue} variant="outlined" color="error">
                  Cancel
                </Button>
                <Button onClick={submit} variant="contained" color="primary">
                  Create PO
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </div>
    </MainCard>
  );
};

export default OPO_view_list;
