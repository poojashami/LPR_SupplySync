import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import GRNItemList from './GRNItemList';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';

const InwardPOList = () => {
  const [poData, setPoData] = useState([]);
  const [grnRowData, setGrnRowData] = useState({});
  const [openGRNPage, setOpenGRNPage] = useState(false);

  const handleOpenGRNPage = (data) => {
    setGrnRowData({ ...data });
    setOpenGRNPage(true);
  };

  const handleCloseGRNPage = () => {
    setOpenGRNPage(false);
  };

  useEffect(() => {
    getPOGRNList();
  }, []);

  const getPOGRNList = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/po/forgrn`);
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        po_id: item.po_id,
        po_num: item.po_num,
        quo_id: 9,
        quo_num: item.quo_num,
        total_cost: item.total_cost,
        vendor_id: item.vendor_id,
        status: 6,
        acceptance_remarks: 'Remarks',
        created_on: item.created_on,
        created_by: null,
        updated_on: '2024-08-10T12:24:09.000Z',
        updated_by: null,
        currency: 'USD',
        lead_time: '4 weeks',
        payment_terms: 'Abcd Payment terms',
        delivery_terms: 'FOB'
      }));
      setPoData(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const itemColumn = [
    { field: 'po_id', headerName: 'PO ID', width: 80 },

    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150
    },
    { field: 'quo_num', headerName: 'Quotation Number', width: 150 },
    { field: 'vendor_id', headerName: 'Vendor Name', width: 150 },
    { field: 'total_cost', headerName: 'Total Amount', width: 150 },
    { field: 'created_on', headerName: 'PO Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <div>
          <Button variant="outlined" onClick={() => handleOpenGRNPage(params.row)}>
            Create GRN
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {openGRNPage ? <span>Create GRN</span> : <span>GRN PO List</span>}
            {openGRNPage ? (
              <span>
                <PlusButton label="Back" onClick={handleCloseGRNPage} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        <div>
          {openGRNPage ? (
            <GRNItemList poGRNData={grnRowData} />
          ) : (
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
              rows={poData}
              columns={itemColumn}
              pagination={false}
              hideFooterPagination
            />
          )}
        </div>
      </MainCard>
    </>
  );
};

export default InwardPOList;
