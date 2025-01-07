import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { GetRfqItemsByRfqId, GetRfqVendorsByRfqId } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CreateIcon from '@mui/icons-material/Create';
import { axiosInstance } from 'utils/axiosInstance';
import { set_vendor_id } from 'Redux/Slices/StaticSlice';
import { Table, TableCell, TableRow, Typography, Box, TableHead, IconButton, TableBody, Button } from '@mui/material';

const RfqView = ({ rfq, QuotationForm }) => {
  const dispatch = useDispatch();
  const [rfqItm, setRfqItm] = useState(null);
  const [bh_Data, setBhData] = useState(null);
  const [rfqDocList, setRfqDocList] = useState([]);
  const [rfqVendors, setRfqVendors] = useState(null);
  const [remarks_list, setRemarks_list] = useState([]);
  const [showTableHeading, setShowTableHeading] = useState({
    itemDetails: true,
    vendorDetail: true,
    DocList: true
  });
  const { rfqsItems, rfqsVendors } = useSelector((state) => state.rfq);

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const fetch_buying_house = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/bhouse/buyinghouses?buying_house_id=${id}`);
      setBhData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log(rfq);
    if (rfq?.buying_house_id) {
      fetch_buying_house(rfq?.buying_house_id);
    }
  }, []);

  useEffect(() => {
    GetRfqItemsByRfqId(dispatch, rfq.rfq_id);
    GetRfqVendorsByRfqId(dispatch, rfq.rfq_id);

    const mapdata = rfq?.rfq_req_doc_masters?.map((item, index) => ({
      id: index + 1,
      description: item.description,
      rfq_req_doc_master_name: item.rfq_req_doc_master_name
    }));

    const mapped_data = rfq?.additionalRemarks?.map((item, index) => ({
      id: index + 1,
      created_by: item?.created_by,
      created_on: item?.updatedAt?.split('T')[0],
      remarks: item?.remarks
    }));
    setRemarks_list(mapped_data);

    setRfqDocList(mapdata);
  }, []);

  useEffect(() => {
    const mapdata = rfqsVendors?.map((item, index) => ({
      id: index + 1,
      vendor_id: item?.vendor_id,
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
      item_remark: item.opr_item_remark,
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
    { field: 'item_type', headerName: 'Item Category', width: 120 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'additional_qty', headerName: 'Additional Quantity', width: 100 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    { field: 'uom_name', headerName: 'UOM', width: 100 },
    { field: 'nafdac_required', headerName: 'Nafdac Req.', width: 120 },
    { field: 'nafdac_require', headerName: 'SON Req.', width: 120 },
    { field: 'cria_required', headerName: 'CRIA Req.', width: 200 },
    { field: 'address', headerName: 'Delivery Location', width: 150 },
    { field: 'item_remark', headerName: 'Remark', width: 100 }
  ];

  const rfqDocListColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'rfq_req_doc_master_name', headerName: 'Document Name', width: 300 }
  ];

  const remarksHeader = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    { field: 'created_on', headerName: 'Created On', width: 120 },
    // { field: 'created_at', headerName: 'Created At', width: 120 },
    { field: 'remarks', headerName: 'Remarks', flex: 1 }
  ];

  const VendorColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'action',
      headerName: 'Create',
      width: 60,
      renderCell: (params) => {
        console.log('params', params?.row?.vendor_id);
        dispatch(set_vendor_id(params?.row?.vendor_id));
        return <CreateIcon onClick={() => QuotationForm(rfq)} />;
      }
      // <Button size="small" onClick={() => QuotationForm(rfq)}>
      //   Create Quotation
      // </Button>
    },
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
                  Respond Time(Days):
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{rfq.respond_time}</Typography>
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

      <Table>
        <TableRow>
          <TableCell>Consignee Name :</TableCell>
          <TableCell>{bh_Data?.buying_house_name}</TableCell>

          <TableCell>Consignee Code :</TableCell>
          <TableCell>{bh_Data?.buying_house_code}</TableCell>

          <TableCell>Contact Number :</TableCell>
          <TableCell>{bh_Data?.contact_number}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Contact email :</TableCell>
          <TableCell>{bh_Data?.contact_email}</TableCell>

          <TableCell>Address :</TableCell>
          <TableCell
            colSpan={4}
          >{`${bh_Data?.address_line1}, ${bh_Data?.address_line2} ,${bh_Data?.city},${bh_Data?.state},${bh_Data?.country},${bh_Data?.postal_code}`}</TableCell>
        </TableRow>
      </Table>

      {rfqVendors && rfqVendors.length > 0 && (
        <Table>
          {renderTableHeader('vendorDetail', 'Vendor Details')}
          {showTableHeading.vendorDetail && (
            <Box sx={{ marginBottom: '10px', overflowX: 'auto', width: '98dvw' }}>
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
        {renderTableHeader('DocList', ' Additional Information')}
        {showTableHeading.DocList && (
          <Box sx={{ marginBottom: '10px' }}>
            <>
              <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
                <div>
                  <Typography variant="h4" color="primary">
                    Required Documents
                  </Typography>
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
                <div>
                  <Typography variant="h4" color="primary">
                    Additional Remarks
                  </Typography>
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
                    rows={remarks_list}
                    columns={remarksHeader}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    hideFooterPagination
                    hideFooter
                  />
                </div>
              </div>
            </>
          </Box>
        )}
      </Table>

      {rfqItm && rfqItm.length > 0 && (
        <Table>
          {renderTableHeader('itemDetails', 'Item Details')}
          {showTableHeading.itemDetails && (
            <Box sx={{ marginBottom: '10px' }}>
              <>
                <div style={{ overflowX: 'auto', width: '90dvw' }}>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      minHeight: '200px',
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
    </MainCard>
  );
};

export default RfqView;
