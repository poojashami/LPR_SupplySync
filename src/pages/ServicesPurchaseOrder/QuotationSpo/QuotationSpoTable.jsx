import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { axiosInstance } from 'utils/axiosInstance';
import { Box } from '@mui/material';
const QuotationSpoTable = () => {
  const [quotationData, setQuotationData] = useState([]);

  const quotationColumn = [
    { headerName: 'S.NO', field: 'id', width: 50 },
    { headerName: 'RFQ No.', field: 'quo_num', width: 150 },
    { headerName: 'Service Type', field: 'vendor_name', width: 150 },
    { headerName: 'PO No.', field: 'po_num', width: 150 },
    { headerName: 'Remarks', field: 'remarks', width: 250 },
    { headerName: 'Service Type', field: 'amount', width: 150 },
    { headerName: 'Created On', field: 'created_on', width: 150 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/quotation/service');
        console.log('Fetching data:', response.data);
        const quotationDataMapped = response.data.map((item, index) => ({
          id: index + 1,
          vendor_name: item.vendor_id || 'N/A',
          quo_num: item.service_quo_id || 'N/A',
          po_num: item.po_id || 'N/A',
          amount: item.amount || 'N/A',
          remarks: item.remarks || 'N/A',
          created_on: item?.createdAt?.split('T')[0] || 'N/A'
        }));
        console.log('Fetching data:', quotationDataMapped);
        setQuotationData(quotationDataMapped);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <p>List Quotation </p>
          </Box>
        }
      >
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
          }} columns={quotationColumn} rows={quotationData} />
      </MainCard>
    </div>
  );
};

export default QuotationSpoTable;
