import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
const CITable = ({ onPiNoClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleActionClick = async (quotation) => {
    // Your action logic here
    handleClose();
  };
  const pfiData = [
    {
      id: 1,
      pi_no: 'PI-001',
      pi_date: '2024-07-15',
      consignor: 'ABC Ltd.',
      consignee: 'XYZ Corp.',
      pfi_category: 'Electronics',
      pfi_general_desc: 'Electronic components',
      currency: 'USD',
      total_value: 25000,
      payment_terms: 'Net 30',
      shipment_type: 'Air',
      shipment_window: '2024-08-01 to 2024-08-10',
      pfi_created_by: 'John Doe'
    },
    {
      id: 2,
      pi_no: 'PI-002',
      pi_date: '2024-07-20',
      consignor: 'LMN Inc.',
      consignee: 'OPQ Ltd.',
      pfi_category: 'Textiles',
      pfi_general_desc: 'Cotton fabrics',
      currency: 'EUR',
      total_value: 15000,
      payment_terms: 'Net 60',
      shipment_type: 'Sea',
      shipment_window: '2024-08-05 to 2024-08-15',
      pfi_created_by: 'Jane Smith'
    }
  ];

  const pfiColumn = [
    {
      field: 'pi_no',
      headerName: 'PI No',
      width: 80,
      renderCell: (params) => (
        <Link component="button" onClick={() => onPiNoClick(params.value)}>
          {params.value}
        </Link>
      )
    },

    { headerName: 'PI Date', field: 'pi_date' },
    { headerName: 'Consignor', field: 'consignor' },
    { headerName: 'Consignee', field: 'consignee' },
    { headerName: 'PFI Category', field: 'pfi_category' },
    { headerName: 'PFI General Desc', field: 'pfi_general_desc' },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'Total Value', field: 'total_value' },
    { headerName: 'Payment Terms', field: 'payment_terms' },
    { headerName: 'Shipment Type', field: 'shipment_type' },
    { headerName: 'Shipment Window', field: 'shipment_window' },
    { headerName: 'PFI Created By', field: 'pfi_created_by' }
  ];

  return <DataGrid getRowHeight={() => 'auto'}
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
          }} rows={pfiData} columns={pfiColumn} pageSize={5} rowsPerPageOptions={[5]} />;
};

export default CITable;
