/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import QuotationForm from './quotation-form';
import RfqView from './rfq-view';
import { useSelector, useDispatch } from 'react-redux';
import { GetRfq } from 'Redux/Apis/GetApiCalls';

export default function RFQPage() {
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [rfqData, setRfqData] = useState([]);
  const [selectRfq, setSelectRfq] = useState();
  const [viewRfq, setViewRfq] = useState(false);

  const { rfqs } = useSelector((state) => state.rfq);
  const dispatch = useDispatch();

  useEffect(() => {
    GetRfq(dispatch);
  }, []);

  const handleViewClick = (quotation) => {
    setSelectRfq({ ...quotation });
    setShowQuotationForm(true);
  };

  const TableHeader = [
    {
      field: 'key',
      headerName: 'SL. NO.',
      width: 80,
      flex: 0.5
    },
    {
      field: 'rfq_num',
      headerName: 'RFQ Number',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewRFQ(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      flex: 1
    },
    { field: 'created_on', headerName: 'Created On', sort: 'desc', flex: 1 },
    // { field: 'items_count', headerName: 'Item Type Count', flex: 1 },
    // {
    //   headerName: 'Quotes Received',
    //   field: 'quotes_received',
    //   flex: 1
    // },
    { field: 'delivery_timeline_in_weeks', headerName: 'Delivery Time', width: 150, flex: 1 },
    { field: 'port_of_destination_name', headerName: 'Port of Destination', width: 150, flex: 1 },
    {
      headerName: 'Quotes Received',
      field: 'quotes_sent',
      flex: 1
    },
    { field: 'created_by', headerName: 'Created By', flex: 1 }
  ];

  const handleViewRFQ = async (quotation) => {
    setSelectRfq(quotation);
    setViewRfq(true);
  };

  useEffect(() => {
    const mappedData = rfqs?.map((item, index) => ({
      id: index + 1,
      key: index + 1,
      rfq_id: item.rfq_id,
      rfq_num: item.rfq_num,
      created_on: item.created_on.split('T')[0],
      items_count: item.items_count,
      shipment_mode: item.shipment_mode,
      shipment_type: item.shipment_type,
      created_by: item.created_by,
      // quotes_received: 1500,
      quotes_sent: `${item?.Quotation_find}/${item.vendor_list?.split(',').length}`,
      vendors: item.vendors,
      deliveryTime: `${item.deliveryTime} Weeks`,
      port_of_destination_name: item.port_of_destination_name,
      remarks: item.remarks,
      req_doc_id: item.req_doc_id,
      rfq_req_doc_masters: item.rfq_req_doc_masters,
      delivery_timeline_in_weeks: item.delivery_timeline_in_weeks && `${item.delivery_timeline_in_weeks} Weeks`,
      additionalRemarks: item?.AdditionalRemarks,
      buying_house_id: item?.buying_house_id
    }));

    setRfqData(mappedData);
  }, [rfqs]);

  const handleCloseForm = () => {
    setViewRfq(false);
    setShowQuotationForm(false);
    // setSelectedQuotation(null);
    setFormMode('create');
  };
  const handleFormSubmit = async () => {
    // await GetQuotation(dispatch);
    setShowQuotationForm(false);
  };

  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {showQuotationForm ? (
              <>
                <span>
                  Create Quotation against RFQ No. <b style={{ color: 'blue' }}>({selectRfq.rfq_num})</b>
                </span>
                <Button color="primary" variant="contained" size="small" onClick={handleCloseForm}>
                  Back
                </Button>
              </>
            ) : viewRfq ? (
              <>
                <span>
                  View RFQ No. <b style={{ color: 'blue' }}>({selectRfq.rfq_num})</b>
                </span>
                <Button color="primary" variant="contained" size="small" onClick={handleCloseForm}>
                  Back
                </Button>
              </>
            ) : (
              <span>Create Quotation - Pending RFQ</span>
            )}
          </Box>
        }
      >
        {showQuotationForm ? (
          <QuotationForm rfq={selectRfq} formMode={formMode} onClose={handleCloseForm} onFormSubmit={handleFormSubmit} />
        ) : viewRfq ? (
          <>
            <RfqView
              rfq={selectRfq}
              formMode={formMode}
              onClose={handleCloseForm}
              onFormSubmit={handleFormSubmit}
              QuotationForm={handleViewClick}
            />
          </>
        ) : (
          <>
            <Box sx={{ height: '80vh', width: '100%' }}>
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
                  }
                }}
                rows={rfqData}
                columns={TableHeader}
                getRowId={(row) => row.key}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Box>
          </>
        )}
      </MainCard>
    </>
  );
}
