import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import GRNItemList from './GRNItemList';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import PlusButton from 'components/CustomButton';
import { axiosInstance } from 'utils/axiosInstance';
import { useNavigate } from 'react-router';
import { setPO, setPOGRN } from 'Redux/Slices/POSlice';

const Goods_Dispatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { poForGDN, poForGRN } = useSelector((state) => state.purchaseOrder);
  const [poData, setPoData] = useState([]);
  const [grnRowData, setGrnRowData] = useState({});
  const [openGRNPage, setOpenGRNPage] = useState(false);

  const handleOpenGRNPage = (data) => {
    setGrnRowData({ ...data });
    setOpenGRNPage(true);
  };

  const handleCloseGRNPage = () => {
    setOpenGRNPage(false);
    dispatch(setPO());
    dispatch(setPOGRN());
    poForGDN && navigate(-1);
    poForGRN && navigate(-1);
  };

  useEffect(() => {
    console.log(poForGDN, poForGRN);
    getPOGRNList();
  }, []);

  const getPOGRNList = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/po/list`);
      console.log(data);
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
        created_on: item.created_on?.split('T')[0],
        created_by: null,
        updated_on: '2024-08-10',
        updated_by: null,
        currency: 'USD',
        lead_time: '4 weeks',
        payment_terms: 'Abcd Payment terms',
        delivery_terms: 'FOB'
      }));
      setPoData(mappedData);
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(poForGDN?.po_id)) {
        setGrnRowData(mappedData?.filter((item) => item?.po_id === poForGDN?.po_id)[0]);
        setOpenGRNPage(true);
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(poForGRN?.po_id)) {
        setGrnRowData(mappedData?.filter((item) => item?.po_id === poForGRN?.po_id)[0]);
        setOpenGRNPage(true);
      }
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
          <Button size="small" onClick={() => handleOpenGRNPage(params.row)}>
            Create GDN
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
            {openGRNPage ? poForGDN ? <span>Create GRN</span> : <span>Create GRN</span> : <span>GDN PO List</span>}
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
            <GRNItemList poGRNData={grnRowData} isGRN={Boolean(poForGRN)} />
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
                  height: '25px !important'
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

export default Goods_Dispatch;
