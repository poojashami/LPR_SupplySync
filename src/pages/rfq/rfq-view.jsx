import React, { useState, useEffect } from 'react';
import { Table, TableCell, TableRow, Typography, Box, TableHead, IconButton, TableBody } from '@mui/material';
import MainCard from 'components/MainCard';
import { GetRfqItemsByRfqId, GetRfqVendorsByRfqId } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const RfqView = ({ rfq }) => {
  console.log('rfq', rfq);

  const dispatch = useDispatch();
  const { rfqsItems, rfqsVendors } = useSelector((state) => state.rfq);
  const [rfqItm, setRfqItm] = useState(null);
  const [rfqDocList, setRfqDocList] = useState([]);
  const [rfqVendors, setRfqVendors] = useState(null);
  const [showTableHeading, setShowTableHeading] = useState({
    itemDetails: true,
    vendorDetail: true,
    DocList: true
  });

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  useEffect(() => {
    GetRfqItemsByRfqId(dispatch, rfq.rfq_id);
    GetRfqVendorsByRfqId(dispatch, rfq.rfq_id);

    const mapdata = rfq?.rfq_req_doc_masters?.map((item, index) => ({
      id: index + 1,
      description: item.description,
      rfq_req_doc_master_name: item.rfq_req_doc_master_name
    }));
    setRfqDocList(mapdata);
  }, []);

  useEffect(() => {
    const mapdata = rfqsVendors?.map((item, index) => ({
      id: index + 1,
      vendor_id: item.vendor_id,
      vendor_series: item.vendor_series,
      vendor_name: item.vendor_name,
      phone_number: item.phone_number,
      email: item.email,
      contact_person: item.contact_person,
      contact_person_phone: item.contact_person_phone,
      contact_person_email: item.contact_person_email
    }));
    setRfqVendors(mapdata);
  }, [rfqsVendors]);

  useEffect(() => {
    const mapdata = rfqsItems?.map((item, index) => ({
      id: index + 1,
      item_name: item.ItemsMaster?.item_name,
      item_type: item.ItemsMaster?.item_super_group_master?.item_super_group_name,
      item_code: item.ItemsMaster?.item_code,
      nafdac_required: item.ItemsMaster?.nafdacRequired ? 'Yes' : 'No',
      cria_required: item.ItemsMaster?.nafdacRequired ? 'Applicable if goods Coming from India or China' : 'No',
      uom_name: item?.uom_name,
      quantity: item.quantity,
      additional_qty: item.additional_qty === null ? 0 : item.additional_qty,
      address: `${item?.AddressMaster?.city}, ${item?.AddressMaster?.country}`
    }));
    setRfqItm(mapdata);
  }, [rfqsItems]);

  // Define columns for rfqItm table
  const ItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'item_type', headerName: 'Item Category', width: 120 },
    { field: 'nafdac_required', headerName: 'NAFDAC Required', width: 120 },
    { field: 'cria_required', headerName: 'CRIA Category', width: 250 },
    { field: 'uom_name', headerName: 'UOM', width: 100 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    { field: 'additional_qty', headerName: 'Additional Quantity', width: 100 },
    { field: 'address', headerName: 'Delivery Location', width: 150 }
  ];

  const rfqDocListColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'rfq_req_doc_master_name',
      headerName: 'Document Name',
      width: 500,
      align: 'left', // Align the cell content to the left
      headerAlign: 'left' // Align the header to the left
    }
  ];

  const VendorColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'vendor_series', headerName: 'Vendor Num', width: 120 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 250 },
    { field: 'phone_number', headerName: 'Vendor Ph. No.', width: 150 },
    { field: 'email', headerName: 'Vendor Email', width: 150 },
    { field: 'contact_person', headerName: 'Contact Person Name', width: 150 },
    { field: 'contact_person_phone', headerName: 'Contact Person Ph. No.', width: 120 },
    { field: 'contact_person_email', headerName: 'Contact Person Email', width: 200 }
  ];

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 1 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <MainCard>
      <Box
        sx={{
          padding: '0.5vh',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  RFQ Num:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{rfq.rfq_num}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Destination:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{rfq.port_of_destination_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Remarks:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{rfq.remarks}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Delivery_time:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{rfq.delivery_timeline_in_weeks}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Created On:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{rfq.created_on}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {rfqItm && rfqItm.length > 0 && (
        <Table>
          {renderTableHeader('itemDetails', 'Item Details')}
          {showTableHeading.itemDetails && (
            <Box sx={{ marginBottom: '10px', display: 'flex', overflowX: 'scroll', width: '92dvw' }}>
              <>
                <div style={{ overflow: 'hidden' }}>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        border: '1px solid rgba(224, 224, 224, 1)'
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f5f5f5',
                        border: '1px solid rgba(224, 224, 224, 1)',
                        height: '25px !important'
                      },
                      '& .MuiDataGrid-scrollbar': {
                        height: '8px'
                      }
                    }}
                    rows={rfqItm}
                    columns={ItemColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    hideFooterPagination
                    hideFooter
                  />
                </div>
              </>
            </Box>
          )}
        </Table>
      )}

      {rfqVendors && rfqVendors.length > 0 && (
        <Table>
          {renderTableHeader('vendorDetail', 'Vendor Details')}
          {showTableHeading.vendorDetail && (
            <Box sx={{ marginBottom: '10px' }}>
              <>
                <div style={{ overflow: 'hidden' }}>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        border: '1px solid rgba(224, 224, 224, 1)'
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f5f5f5',
                        border: '1px solid rgba(224, 224, 224, 1)',
                        height: '25px !important'
                      },
                      '& .MuiDataGrid-scrollbar': {
                        height: '8px'
                      }
                    }}
                    rows={rfqVendors}
                    columns={VendorColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    hideFooterPagination
                    hideFooter
                  />
                </div>
              </>
            </Box>
          )}
        </Table>
      )}

      <Table>
        {renderTableHeader('DocList', 'Document Details')}
        {showTableHeading.DocList && (
          <Box sx={{ marginBottom: '10px', width: '60vh', border: '1px solid rgba(224, 224, 224, 1)' }}>
            <>
              <div style={{ overflow: 'hidden' }}>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      height: '25px !important'
                    },
                    '& .MuiDataGrid-scrollbar': {
                      height: '8px'
                    }
                  }}
                  rows={rfqDocList}
                  columns={rfqDocListColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  hideFooterPagination
                  hideFooter
                />
              </div>
            </>
          </Box>
        )}
      </Table>
    </MainCard>
  );
};

export default RfqView;
