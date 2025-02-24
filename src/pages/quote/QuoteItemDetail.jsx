import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const QuoteItemDetail = () => {
  const TableHeader = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'item_cat', headerName: 'Item Category', width: 120 },
    { field: 'group', headerName: 'Group', width: 100 },
    { field: 'subgroup', headerName: 'Sub Group', width: 120 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 120 },
    {
      field: 'item_name_vendor',
      headerName: 'Vendor Item Name',
      width: 250
    },

    // { field: 'address', headerName: 'Shipping address', width: 200 },
    { field: 'uom', headerName: 'UOM', width: 70 },
    { field: 'quantity', headerName: 'LPR Qty', width: 75 },
    {
      field: 'quote_qtd',
      headerName: `Quote Qty`,
      width: 150
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 100
    },
    {
      field: 'total_cost',
      headerName: 'Amount',
      width: 100
    },
    {
      field: 'pack_type',
      headerName: 'Pack Type',
      width: 120
    },
    {
      field: 'pack_uom',
      headerName: 'Pack UOM',
      width: 100
    },
    {
      field: 'pack_size',
      headerName: 'Pack Size',
      width: 100
    },
    {
      field: 'no_packs',
      headerName: 'No. of Packs',
      width: 100
    },
    {
      field: 'opr_remark',
      headerName: 'LPR Item Remarks',
      width: 200
    },
    {
      field: 'remarks',
      headerName: 'Vendor Item Remarks',
      width: 200
    },
    {
      field: 'vatRate',
      headerName: 'VAT Rate',
      width: 200
    },
    {
      field: 'itemVatTotal',
      headerName: 'Item VAT Total',
      width: 200
    },
    {
      field: 'roundOfVat',
      headerName: 'Round off VAT',
      width: 200
    },
    {
      field: 'itemAmount',
      headerName: 'Item Amount Incl. VAT',
      width: 200
    }
  ];
  const faqItemData = [
    {
      id: 1,
      shipment_type: 'Air',
      item_type: 'Electronics',
      item_code: 'ELEC001',
      item_name: 'Smartphone',
      item_name_vendor: 'VendorPhone',
      item_name_label: 'LabelPhone',
      cria_req: 'true',
      nafdac_req: 'true',
      uom: 'PCS',
      quantity: 100,
      quote_qtd: 90,
      rate: 500,
      total_cost: 45000,
      pack_type: 'Box',
      pack_size: 10,
      no_packs: 9,
      opr_remark: 'Handle with care',
      remarks: 'Urgent shipment'
    },
    {
      id: 2,
      shipment_type: 'Sea',
      item_type: 'Apparel',
      item_code: 'APP002',
      item_name: 'T-Shirt',
      item_name_vendor: 'VendorTShirt',
      item_name_label: 'LabelTShirt',
      cria_req: 'false',
      nafdac_req: 'false',
      uom: 'PCS',
      quantity: 200,
      quote_qtd: 180,
      rate: 20,
      total_cost: 3600,
      pack_type: 'Bundle',
      pack_size: 20,
      no_packs: 9,
      opr_remark: 'Fold neatly',
      remarks: 'Pack in eco-friendly material'
    },
    {
      id: 3,
      shipment_type: 'Land',
      item_type: 'Furniture',
      item_code: 'FURN003',
      item_name: 'Chair',
      item_name_vendor: 'VendorChair',
      item_name_label: 'LabelChair',
      cria_req: 'true',
      nafdac_req: 'false',
      uom: 'PCS',
      quantity: 50,
      quote_qtd: 45,
      rate: 100,
      total_cost: 4500,
      pack_type: 'Crate',
      pack_size: 5,
      no_packs: 9,
      opr_remark: 'Fragile item',
      remarks: 'Double-check for damage'
    },
    {
      id: 4,
      shipment_type: 'Air',
      item_type: 'Pharmaceuticals',
      item_code: 'PHAR004',
      item_name: 'Vaccine',
      item_name_vendor: 'VendorVaccine',
      item_name_label: 'LabelVaccine',
      cria_req: 'true',
      nafdac_req: 'true',
      uom: 'Vials',
      quantity: 1000,
      quote_qtd: 950,
      rate: 15,
      total_cost: 14250,
      pack_type: 'Box',
      pack_size: 50,
      no_packs: 19,
      opr_remark: 'Store in cold chain',
      remarks: 'Priority shipment'
    },
    {
      id: 5,
      shipment_type: 'Sea',
      item_type: 'Chemicals',
      item_code: 'CHEM005',
      item_name: 'Sodium Chloride',
      item_name_vendor: 'VendorSodium',
      item_name_label: 'LabelSodium',
      cria_req: 'false',
      nafdac_req: 'false',
      uom: 'Kg',
      quantity: 500,
      quote_qtd: 450,
      rate: 10,
      total_cost: 4500,
      pack_type: 'Bag',
      pack_size: 50,
      no_packs: 9,
      opr_remark: 'Ensure dry storage',
      remarks: 'Standard packaging'
    }
  ];
  return (
    <Box padding={1}>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          border: '1px solid rgba(224, 224, 224, 1)',
          '& .MuiDataGrid-cell': {
            border: '1px solid rgba(224, 224, 224, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0'
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
        // rows={faqItemData.map((row) => ({
        //   ...row,
        //   handleInputChange: (e, field) => handleRFQInputChange(e, field, row.id)
        // }))}
        rows={faqItemData}
        columns={TableHeader}
        rowsPerPageOptions={[5]}
        hideFooterPagination
        disableColumnSorting
        hideFooter
        hideFooterSelectedRowCount
        rowHeight={35}
      />
    </Box>
  );
};

export default QuoteItemDetail;
