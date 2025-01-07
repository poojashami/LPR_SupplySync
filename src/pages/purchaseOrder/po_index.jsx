import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import QuotationForm from '../rfq/quotation/quotation-form';
import QuotationView from './quotationView';
import { GetQuotation } from 'Redux/Apis/GetApiCalls';
import { GetQuotationItem } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import PlusButton from 'components/CustomButton';

export default function QuotationPage() {
  const dispatch = useDispatch();
  const { quotations } = useSelector((state) => state.quotation);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [quotationData, setQuotationData] = useState([]);
  const [quotationItems, setQuotationItems] = useState(null);
  useEffect(() => {
    GetQuotation(dispatch);
  }, []);
  const TableHeader = [
    { field: 'quo_id', headerName: 'Quotation ID', width: 100 },
    {
      field: 'quo_num',
      headerName: 'Quotation Number',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'rfq_num', headerName: 'RFQ Number', width: 150 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 150 },
    { field: 'referenceNo', headerName: 'Reference Number', width: 150 },
    { field: 'referenceDate', headerName: 'Reference Date', width: 150 },
    { field: 'quo_date', headerName: 'Quotation Date', width: 150 },
    { field: 'currency', headerName: 'Currency', width: 150 },
    { field: 'delivery_terms', headerName: 'Delivery Terms', width: 150 },
    { field: 'country_origin', headerName: 'Country of Origin', width: 150 },
    { field: 'country_supply', headerName: 'Country of Supply', width: 150 },
    { field: 'port_loading', headerName: 'Port of Loading', width: 150 },
    { field: 'lead_time', headerName: 'Lead Time', width: 150 },
    { field: 'payment_terms', headerName: 'Payment Terms', width: 150 },
    { field: 'remarks', headerName: 'Remarks', width: 250 },
    { field: 'total_cost', headerName: 'Total Cost', width: 80 }
  ];

  const handleViewClick = async (quotation) => {
    await GetQuotationItem(dispatch, quotation.quo_id);
    setQuotationItems({ ...quotation });
  };
  useEffect(() => {
    const mappedData = quotations
      ?.map((item, index) => ({
        id: index + 1,
        quo_id: item.quo_id,
        quo_num: item.quo_num,
        rfq_id: item.rfq_id,
        rfq_num: item.rfq_num,
        vendor_name: item.vendorName,
        vendor_id: item.vendor_id,
        referenceNo: item.reference_no,
        referenceDate: item.reference_date,
        quo_date: item.quo_date,
        currency: item.currency,
        delivery_terms: item.delivery_terms_name,
        country_origin: item.country_origin,
        country_supply: item.country_supply,
        port_loading: item.port_loading,
        lead_time: item.lead_time_name,
        payment_terms: item.payment_terms,
        remarks: item.remarks,
        total_cost: item.total_cost
      }))
      .filter((item) => item.po_status !== '1');
    console.log(quotations);
    setQuotationData(mappedData);
  }, [quotations]);
  const handleCloseForm = () => {
    setShowQuotationForm(false);
    setSelectedQuotation(null);
    setFormMode('create');
  };
  const handleViewClose = () => {
    setQuotationItems(null);
  };
  const handleFormSubmit = () => {
    quotations();
    setShowQuotationForm(false);
  };
  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {quotationItems ? <span> View Quotation </span> : <span>Quotation List</span>}
            {quotationItems && <PlusButton label="Back" onClick={handleViewClose} />}
          </Box>
        }
      >
        {quotationItems ? (
          <QuotationView oprViewData={quotationItems} onClose={handleViewClose} />
        ) : (
          <div>
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
          }} rows={quotationData} columns={TableHeader} pageSize={5} rowsPerPageOptions={[5]} />
          </div>
        )}
      </MainCard>
    </>
  );
}
