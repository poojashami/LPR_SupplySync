import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Table } from '@mui/material';
import { axiosInstance } from 'utils/axiosInstance';

const CIItemDetail = ({ poData, paarData }) => {
  const [itemsData, setItemsData] = useState([]);
  useEffect(() => {
    console.log(paarData);
    getItemsData(paarData?.shipment_advice_id);
  }, []);
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'opoQty', headerName: 'CI Quantity', width: 150 },
    // { field: 'rate', headerName: 'PO Rate', width: 100 },
    {
      field: 'ci_rate',
      headerName: 'CI Rate',
      width: 100
    },
    { field: 'remarks', headerName: 'PO Remarks', width: 100 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150
    },
    {
      field: 'pack_type',
      headerName: 'Pack Type',
      width: 150
    },
    {
      field: 'pack_size',
      headerName: 'Pack Size',
      width: 150
    },
    {
      field: 'no_of_packs',
      headerName: 'Number of Packs',
      width: 150
    },
    {
      field: 'Total_Amount',
      headerName: 'Total Amount #',
      width: 150
    }
  ];
  const getItemsData = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/shipping/advise/byid', {
        params: {
          shipment_advise_id: id
        }
      });
      const mappedData = data?.map((item, index) => ({
        id: index + 1,
        shipment_advise_item_id: item?.shipment_advise_item_id,
        item_type: item?.po_item?.item_type,
        itemSpecification: item?.item_specification,
        itemDescription: item?.item_description,
        opoQty: item?.po_item?.po_qty,
        rate: item?.po_item?.rate,
        currency: item?.currency,
        remarks: item?.remarks,
        quantity: item?.quantity,
        pack_type: item?.pack_type_name,
        pack_size: item?.po_item?.pack_size,
        no_of_packs: item?.po_item?.no_packs,
        ci_rate: item?.ci_rate
      }));
      setItemsData(mappedData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log('Item Data of', itemsData);
  return (
    <div>
      <Table>
        <Box sx={{ overflowX: 'scroll', width: '92dvw' }}>
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(224, 224, 224, 1)',
                height: '25px !important',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }}
            rows={itemsData}
            columns={stockItemColumns}
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        </Box>
      </Table>
    </div>
  );
};

export default CIItemDetail;
