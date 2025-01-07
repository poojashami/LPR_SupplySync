import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableRow, TableCell, TableBody, Grid } from '@mui/material';
import CustomTypography from 'components/CustomTypography';
const CheckListTableView = ({ po_data }) => {
  const [rfqReqDocBilllist, setRfqReqDocBilllist] = useState([
    { req_doc_name: 'BL NUMBER & DATE', id: 1 },
    { req_doc_name: 'SHIPPED ON BOARD DATE & SIGNATURE', id: 2 },
    { req_doc_name: 'FREE TIME/DAYS', id: 3 },
    { req_doc_name: 'FREIGHT PREPAID', id: 4 },
    { req_doc_name: 'CONTAINERS No and Type DETAILS', id: 5 },
    { req_doc_name: 'Number & Kind of Package', id: 6 },
    { req_doc_name: 'Seal Numbers', id: 7 },
    { req_doc_name: 'Gross/Net Weight to match with Packing list', id: 8 },
    { req_doc_name: 'DO NOT SHOW HS CODE ANYWHERE ON THE B/L', id: 9 },
    { req_doc_name: 'KINDLY EMAIL BL DRAFT FOR ', id: 10 }
  ]);
  const doc_table_column = [{ field: 'req_doc_name', headerName: 'Bill of Lading Check Lists', flex: 1 }];
  const [rfqReqDocLabellist, setRfqReqDocLabellist] = useState([
    { req_doc_name: 'Item name to match with PFI / Invoice item name', id: 1 },
    { req_doc_name: 'Production/Mgfg date to be mentioned', id: 2 },
    { req_doc_name: 'Expiry / Best Before date to be mentioned', id: 3 },
    { req_doc_name: 'Gross Weight & Net weight of the Item to be mentioned', id: 4 },
    { req_doc_name: 'Manufacturer Name & Address to be mentioned', id: 5 },
    { req_doc_name: 'Storage Condition to be mentioned', id: 6 },
    { req_doc_name: 'Country of Origin to be mentioned', id: 7 }
  ]);
  const doc_Label_column = [{ field: 'req_doc_name', headerName: 'Label Check Lists', flex: 1 }];

  useEffect(() => {
    const mapped = po_data?.shippment_instruction?.bill_of_loading_check?.split(',')?.map((item, index) => ({
      req_doc_name: item,
      id: index
    }));
    setRfqReqDocBilllist(mapped);

    const mappeded = po_data?.shippment_instruction?.label_check?.split(',')?.map((item, index) => ({
      req_doc_name: item,
      id: index
    }));
    setRfqReqDocLabellist(mappeded);
    // console.log(po_data);
  }, []);

  return (
    <div>
      {' '}
      <Table>
        <TableBody loading={true}>
          <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
            <TableCell colSpan={6}>
              <Grid container spacing={2} alignItems="start">
                <Grid item xs={12} sm={6}>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        border: '1px solid rgba(224, 224, 224, 1)',
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center'
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f5f5f5',
                        border: '1px solid rgba(224, 224, 224, 1)',
                        height: '25px !important',
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center'
                      },
                      '& .MuiDataGrid-scrollbar': {
                        height: '8px'
                      }
                    }}
                    rows={rfqReqDocBilllist}
                    columns={doc_table_column}
                    onRowSelectionModelChange={(val) => {
                      return setSelectedBillDocids(
                        rfqReqDocBilllist?.filter((item) => {
                          return val.includes(item.id);
                        })
                      );
                    }}
                    hideFooter
                    hideFooterPagination
                    hideFooterSelectedRowCount
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        border: '1px solid rgba(224, 224, 224, 1)',
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'start'
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f5f5f5',
                        border: '1px solid rgba(224, 224, 224, 1)',
                        height: '25px !important',
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center'
                      },
                      '& .MuiDataGrid-scrollbar': {
                        height: '8px'
                      }
                    }}
                    rows={rfqReqDocLabellist}
                    columns={doc_Label_column}
                    onRowSelectionModelChange={(val) => {
                      return setSelectedLabelDocids(
                        rfqReqDocLabellist?.filter((item) => {
                          return val.includes(item.id);
                        })
                      );
                    }}
                    hideFooter
                    hideFooterPagination
                    hideFooterSelectedRowCount
                  />
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CheckListTableView;
