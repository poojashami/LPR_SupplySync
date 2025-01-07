import DocPFI from './docPfi';
import { Box, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
// import { axiosInstance } from 'utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { GetPFI } from 'Redux/Apis/GetApiCalls';

const PFI_List = () => {
  const [pfi_list, setPfiList] = useState([]);
  const [selected_pfi, setSelectedPfi] = useState(null);

  const headers = [
    {
      headerName: 'Sl.No',
      field: 'id',
      width: 80
    },
    {
      headerName: 'PFI Num',
      field: 'pfi_num',
      width: 150,
      renderCell: (params) => <Chip onClick={() => setSelectedPfi(params.row)} label={params.value} color={'success'} />
    },
    {
      headerName: 'Main OPO Num',
      field: 'opo_selected_num',
      width: 150
    },
    {
      headerName: 'QUO Num',
      field: 'quo_num',
      width: 180
    },
    {
      headerName: 'OPR Num',
      field: 'opr_num',
      width: 180
    },
    {
      headerName: 'OPO Nums',
      field: 'opo_nums',
      width: 180
    }
    // {
    //   headerName: 'Amount',
    //   field: 'amount',
    //   width: 180
    // }
  ];

  const dispatch = useDispatch();
  const { pfiData: pfi_data } = useSelector((state) => state.PFISlice);

  useEffect(() => {
    GetPFI(dispatch);
  }, []);

  const fetch_data = async () => {
    try {
      setPfiList(pfi_data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetch_data();
  }, [pfi_data]);

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
          <span>View PFI</span>
        </Box>
      }
    >
      {!selected_pfi && (
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            minHeight: '70vh',
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
          rows={pfi_list.map((item, index) => ({
            id: ++index,
            ...item,
            quo_num: item?.opo_master?.quo_num,
            opr_num: item?.opo_master?.OprMaster?.opr_num
          }))}
          columns={headers}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      )}

      {selected_pfi && <DocPFI selected_pfi={selected_pfi} setSelectedPfi={setSelectedPfi} />}
    </MainCard>
  );
};

export default PFI_List;
