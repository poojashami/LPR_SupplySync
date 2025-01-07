import { Button } from '@mui/material';
import MainCard from 'components/MainCard';
import PurchaseOrderForm from './po_form';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { BASE_URL } from 'AppConstants';
import axios from 'axios';
// import Icon from '@mdi/react';
// ==============================|| OpR PAGE ||============================== //
const rows = [
  {
    id: 1,
    vendor_id: 1,
    reference_no: 'reference_no',
    reference_date: 'Sales',
    quo_date: '2023-05-01',
    currency_id: 'Air',
    delivery_terms: '2 days',
    country_origin_id: 'Sales',
    country_supply_id: 'John Doe',
    port_loading: 'UrgentUrgentUrgentUrgentUrgentUrgentUrgent',
    lead_time: 'Supplier A',
    payment_terms: 'Item 1',
    remarks: 100,
    invalid_charges: 'STK001',
    freight_charges: 50,
    inspection_charges: 200,
    thc: 150,
    container_stuffing: 'Item Description 1'
  }
  // Add more rows as needed
];

// Define columns
const columns = [
  { field: 'quo_num', headerName: 'Sr No.', width: 60 },
  { field: 'rfq_id', headerName: 'Type', width: 100 },
  { field: 'vendor_id', headerName: 'Stock Item Code', width: 100 },
  { field: 'reference_no', headerName: 'Stock Item Name', width: 200 },
  { field: 'reference_date', headerName: 'Vendor Item Name', width: 100 },
  { field: 'quo_date', headerName: 'Vendor HS Code ', width: 100 },
  { field: 'currency_id', headerName: 'PO Qtd', width: 80 },
  { field: 'delivery_terms', headerName: 'Tolerance Qtd', width: 80 },
  { field: 'country_origin_id', headerName: 'Inaward Qtd', width: 80 },
  { field: 'country_supply_id', headerName: 'Pending Inaward Qtd', width: 80 },
  { field: 'port_loading', headerName: 'Pending Outward Qtd', width: 80 },
  { field: 'lead_time', headerName: 'Qtd UOM ', width: 80 },
  { field: 'payment_terms', headerName: 'Rate(INR)', width: 100 },
  { field: 'remarks', headerName: 'GST', width: 80 },
  { field: 'invalid_charges', headerName: 'Total Assests Value ', width: 100 },
  { field: 'freight_charges', headerName: 'Total Tax Value', width: 100 },
  { field: 'inspection_charges', headerName: 'Line Total(INR) ', width: 100 },
  { field: 'thc', headerName: 'OPO No.', width: 100 },
  { field: 'container_stuffing', headerName: 'OPO Line No.', width: 80 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Button color="primary" onClick={() => handleEdit(params.row.id)}>
        {/* <Icon path={mdiTagEdit} size={1} /> */}
      </Button>
    )
  }
];
export default function QuotationPage() {
  const [quotationData, setQuotationData] = useState([]);

  useEffect(() => {
    getQuotationData();
  });

  const getQuotationData = async () => {
    try {
      const response = await axios.get('${BASE_URL}/quotationmaster');
      // Map the data to match DataGrid columns
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        quo_num: item.quo_num,
        rfq_id: item.rfq_id,
        vendor_id: item.vendor_name,
        reference_no: item.reference_no,
        reference_date: item.reference_date,
        quo_date: item.quo_date,
        currency_id: item.currency,
        delivery_terms: item.delivery_terms,
        country_origin_id: item.origin_country,
        country_supply_id: item.supply_country,
        port_loading: item.port_loading,
        lead_time: item.lead_time,
        payment_terms: item.payment_terms,
        remarks: item.remarks,
        invalid_charges: item.invalid_charges,
        freight_charges: item.freight_charges,
        inspection_charges: item.inspection_charges,
        thc: item.thc,
        container_stuffing: item.container_stuffing,
        container_seal: item.container_seal,
        bl: item.bl,
        vgm: item.vgm,
        miscellaneous: item.miscellaneous
      }));

      setQuotationData(mappedData);
      console.log(mappedData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   oprData: 'Failed to load timeline'
      // }));
    }
  };

  return (
    <>
      <MainCard title="Purchase Order Details">
        <PurchaseOrderForm />
      </MainCard>
      <>
        <MainCard title="View All Purchase Order List ">
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
          }} rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
          </div>
        </MainCard>
      </>
    </>
  );
}
