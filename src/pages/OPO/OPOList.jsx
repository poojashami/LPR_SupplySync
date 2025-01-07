import React, { useState } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
import PlusButton from 'components/CustomButton';
import OpoView from './OpoView';

const OPOList = () => {
  const [rowData, setRowData] = useState({});
  const [opos, setOpos] = React.useState([]);
  const [viewopo, setViewOpo] = useState(false);

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
        // total_cost_usd: item?.quotation_master?.total_cost,
        unit_justification: item.unit_justification,
        quotation_master: item?.quotation_master,
        opo_description: item.opo_description,
        VendorsMaster: item?.VendorsMaster,
        OprMaster: item?.OprMaster,
        opo_items: item?.opo_items,
        status: item?.status,
        form_m_num: item?.pfi_masters[0]?.form_ms[0]?.form_m_num,
        lc_num: item?.pfi_masters[0]?.letter_of_credits[0]?.lc_num,
        quo_require_docs: item?.quotation_master?.quo_require_docs
      }));
      setOpos(mappedData);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  React.useEffect(() => {
    fetch_data();
  }, []);

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
          {viewopo ? <span>OPO View </span> : <span>OPO List</span>}
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
          <OpoView rowData={rowData} />
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
              rowsPerPageOptions={[5]}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          </Box>
        )}
      </div>
    </MainCard>
  );
};

export default OPOList;
