import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import GRNItemList from './GRNItemList';
import { Button, Link, Typography } from '@mui/material';
import { Box } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { useNavigate } from 'react-router';

const InwardPOList = () => {
  const [poData, setPoData] = useState([]);
  const [grnRowData, setGrnRowData] = useState({});
  const [openGRNPage, setOpenGRNPage] = useState(false);
  const navigate = useNavigate();
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
      const { data } = await axiosInstance.get(`/api/bhouse/grn/list`);
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        grn_id: item.grn_id,
        grn_num: item.grn_num,
        buying_house_id: item.buying_house_id,
        po_id: item.po_id,
        vendor_id: item.vendor_id,
        status: item.status,
        created_by: item.created_by,
        updated_by: item.updated_by
      }));
      setPoData(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const itemColumn = [
    { field: 'grn_id', headerName: 'GRN ID' },

    {
      field: 'grn_num',
      headerName: 'GRN No',
      renderCell: (params) => (
        <Link component="button" onClick={() => handleOpenGRNPage(params.row)}>
          {params.value}
        </Link>
      )
    },
    { field: 'po_id', headerName: 'PO ID' },
    { field: 'buying_house_id', headerName: 'Buying House ID', width: 150 },
    { field: 'vendor_id', headerName: 'Vendor ID' },
    { field: 'updated_by', headerName: 'Updated By' },
    { field: 'created_by', headerName: 'Created By' },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <div>
          <Link component="button" variant="outlined" onClick={() => navigate('/logistics/ciForm')}>
            Create CI
          </Link>
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
            {openGRNPage ? <span> GRN Item List</span> : <span> Goods Received Note List</span>}
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
                  borderBottom: '2px solid rgba(224, 224, 224, 1)'
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
