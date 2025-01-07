import React, { useEffect, useState } from 'react';
import { axiosInstance } from 'utils/axiosInstance';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { Box } from '@mui/system';

const ViewForTables = () => {
  const [fetchedDataSon, setFetchedDataSon] = useState([]);
  const [fetchedDataLC, setFetchedDataLC] = useState([]);
  const [fetchedDataCI, setFetchedDataCI] = useState([]);
  const headersSON = [
    {
      field: 'son_pfi_id',
      headerName: 'SON ID',
      width: 80
    },
    {
      field: 'permit_type',
      headerName: 'Permit Type',
      width: 80
    },
    {
      field: 'son_date',
      headerName: 'Son Date',
      width: 120
    },
    {
      field: 'invoice_received_date',
      headerName: 'Invoice Received date',
      width: 120
    },
    {
      field: 'pfi_num',
      headerName: 'PFI No.',
      width: 120
    },
    {
      field: 'permit_num',
      headerName: 'Permit Num',
      width: 120
    },
    {
      field: 'pay_not',
      headerName: 'Pay',
      width: 120
    }
  ];
  const headersLC = [
    {
      field: 'letter_of_credit_id',
      headerName: 'LC ID',
      width: 80
    },
    {
      field: 'pfi_num',
      headerName: 'PFI NUM',
      width: 120
    },
    {
      field: 'lc_type',
      headerName: 'LC type',
      width: 120
    },
    {
      field: 'lc_tolerance',
      headerName: 'LC Tolerance',
      width: 120
    },
    {
      field: 'payment_terms',
      headerName: 'Payment Terms',
      width: 120
    },
    {
      field: 'tenor_days',
      headerName: 'Tenor Days',
      width: 120
    },
    {
      field: 'offshore_charges_borne',
      headerName: 'OffShore Charges',
      width: 120
    },
    {
      field: 'confirmation_charges_borne',
      headerName: 'Confirmation Charges',
      width: 120
    },
    {
      field: 'form_m_num',
      headerName: 'Form M No.',
      width: 80
    },
    {
      field: 'lc_date',
      headerName: 'LC Date',
      width: 120
    },
    {
      field: 'application_date',
      headerName: 'Application date',
      width: 120
    }
  ];
  const headersCI = [
    {
      field: 'commercial_invoice_id',
      headerName: 'CI ID',
      width: 80
    },
    {
      field: 'pfi_num',
      headerName: 'PFI No.',
      width: 120
    },
    {
      field: 'ci_sender_date',
      headerName: 'CI sending Date',
      width: 120
    },
    {
      field: 'invoice_date',
      headerName: 'Invoice date',
      width: 120
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 120
    },
    {
      field: 'invoice_num',
      headerName: 'Invoice Num',
      width: 120
    },
    {
      field: 'opr_num',
      headerName: 'OPR No.',
      width: 120
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 120
    },
    {
      field: 'bl_num',
      headerName: 'BL No.',
      width: 120
    },
    {
      field: 'bl_date',
      headerName: 'BL Date',
      width: 120
    }
  ];
  const handleGetSON = async () => {
    const { data: son } = await axiosInstance.get('/api/pfi/son');
    const { data: lc } = await axiosInstance.get('/api/lc');
    const { data: ci } = await axiosInstance.get('/api/commercial/invoice');
    const mappedDataCI = ci.map((item, index) => ({
      key: index,
      id: index,
      commercial_invoice_id: item.commercial_invoice_id,
      pfi_num: item.pfi_num,
      ci_sender_date: item?.ci_sender_date?.split('T')[0],
      invoice_date: item?.invoice_date?.split('T')[0],
      customer: item.customer,
      invoice_num: item.invoice_num,
      opr_num: item.opr_num,
      currency: item.currency,
      bl_num: item.bl_num,
      bl_date: item.bl_date
    }));
    const mappedDataLC = lc.map((item, index) => ({
      key: index,
      id: index,
      letter_of_credit_id: item.letter_of_credit_id,
      form_m_num: item.form_m_num,
      lc_date: item?.lc_date?.split('T')[0],
      application_date: item?.application_date?.split('T')[0],
      pfi_num: item.pfi_num,
      lc_type: item.lc_type,
      lc_tolerance: item.lc_tolerance,
      payment_terms: item.payment_terms,
      tenor_days: item.tenor_days,
      offshore_charges_borne: item.offshore_charges_borne,
      confirmation_charges_borne: item.confirmation_charges_borne
    }));
    const mappedDataSON = son.map((item, index) => ({
      key: index,
      id: index,
      son_pfi_id: item.son_pfi_id,
      permit_type: item.permit_type,
      son_date: item?.son_date?.split('T')[0],
      invoice_received_date: item?.invoice_received_date?.split('T')[0],
      pay_not: item.pay_not,
      permit_num: item.permit_num,
      pfi_num: item.pfi_num
    }));
    setFetchedDataSon(mappedDataSON);
    setFetchedDataLC(mappedDataLC);
    setFetchedDataCI(mappedDataCI);
  };
  useEffect(() => {
    handleGetSON();
  }, []);
  return (
    <>
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
            {' '}
            <p> Son List</p>
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
          }} columns={headersSON} rows={fetchedDataSon} />
      </MainCard>
      <Typography variant="body1" color="initial">
        LC LIST
      </Typography>
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
          }} columns={headersLC} rows={fetchedDataLC} />
      <Typography variant="body1" color="initial">
        CI LIST
      </Typography>
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
          }} columns={headersCI} rows={fetchedDataCI} />
    </>
  );
};

export default ViewForTables;
