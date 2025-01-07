import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Link } from '@mui/material';

const PaymentTable = ({ onPaymentClick }) => {
  const paymentData = [
    {
      sno: 738,
      paymentType: 'Advance',
      po_no: 'PO21873',
      opo_no: 'OPO21873',
      vendor_name: 'Rajendra',
      po_date: '13.04.2021',
      po_description: '2024-06-28T17:27:53.660Z',
      po_value: 'null',
      advise_date: '13.04.2021',
      paymentAdviseAmount: 37788,
      paymentAdviseRemark: 'jfkhkjfdk kjnfdkjb'
    }
  ];

  const paymentColumn = [
    {
      headerName: 'Sr. No.',
      field: 'sno',
      cellRendererFramework: (params) => (
        <Link component="button" onClick={() => onPaymentClick(params.data)}>
          {params.value}
        </Link>
      )
    },
    { headerName: 'Payment Type', field: 'paymentType' },
    { headerName: 'PO No', field: 'po_no' },
    { headerName: 'OPO No', field: 'opo_no' },
    { headerName: 'Vendor Name', field: 'vendor_name' },
    { headerName: 'PO Date', field: 'po_date' },
    { headerName: 'PO Description', field: 'po_description' },
    { headerName: 'PO Value', field: 'po_value' },
    { headerName: 'Advise Date', field: 'advise_date' },
    { headerName: 'Payment Advise Amount', field: 'paymentAdviseAmount' },
    { headerName: 'Payment Advise Remarks', field: 'paymentAdviseRemark' }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 200, width: '100%' }}>
      <AgGridReact
        rowData={paymentData}
        columnDefs={paymentColumn}
        pagination={false}
        rowSelection="none"
        suppressMenuHide={true}
        suppressColumnVirtualisation={true}
      />
    </div>
  );
};

export default PaymentTable;
