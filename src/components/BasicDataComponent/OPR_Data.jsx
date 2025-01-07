/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { GetOpr } from 'Redux/Apis/GetApiCalls';
import { axiosInstance } from 'utils/axiosInstance';

const OPR_Data = ({ opr_id, ItemStatus }) => {
  const dispatch = useDispatch();
  const { oprs } = useSelector((state) => state.opr);
  const [oprItemData, setOprItemData] = useState([]);
  const [oprData, setOprData] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  console.log('oprData', stockItems);

  useEffect(() => {
    console.log(oprs);
    const mappedData = oprs?.map((item, index) => ({
      id: index + 1,
      opr_id: item.opr_id,
      opr_num: item.opr_num,
      buy_from: item.buy_from,
      buy_house: item.buy_house,
      opr_date: item?.opr_date,
      requested_by: item.requested_by,
      remarks: item.remarks,
      opr_description: item?.item_super_group_master?.item_super_group_name,
      total_items: item.total_item_count,
      remaining_items_forrfq: item.remaining_item_count,
      suppliers: item.suppliers,
      no_quot_email_alert: item.no_quot_email_alert,
      status: item.status,
      created_on: item?.created_on,
      created_by: item?.created_by,
      vertical_name: item.vertical_name,
      company_name: item?.companyMaster?.company_name,
      division_name: item.division_name,
      buying_house_name: item.buying_house_name,
      shipment_mode_name: item.shipment_mode_name,
      dept_name: item.dept_name,
      d_timeline_name: item.delivery_timeline_id
    }));
    setOprData(mappedData[0]);
  }, [oprs]);

  const getStockItem = async (opr_id) => {
    try {
      const response = await axiosInstance.get(`/api/opr/items?opr_id=${opr_id}`);
      console.log(response.data);
      const result = response.data.map((item, index) => ({
        id: index + 1,
        item_id: item.item_id,
        item_series: item.item_series,
        item_name: item.ItemsMaster.item_name,
        qty: item.qty,
        item_code: item.ItemsMaster.item_code,
        quantity_in_stock: item.quantity_in_stock,
        quantity_on_order: item.quantity_on_order,
        monthly_consumption: item.monthly_consumption,
        item_description: item.item_description,
        group_name: item.group_name,
        sub_group: item?.ItemsMaster?.sub_group,
        item_type: item?.ItemsMaster?.item_type,
        hs_code: item?.ItemsMaster?.hsn_code,
        nafdac_name: item?.ItemsMaster?.nafdac_name,
        cria: item?.ItemsMaster?.cria,
        nafdac_category: item.nafdac_category,
        factory: item.factory,
        hsn_code: item.hsn_code,
        tolerance: item.tolerance,
        vendors: item.vendors,
        lead_time: item.lead_time,
        reorder_level: item.reorder_level,
        unit_price: item.unit_price,
        msrp: item.msrp,
        is_discontinued: item.is_discontinued,
        item_img: item.item_img,
        item_img_name: item.item_img_name,
        notes: item.notes,
        uom_id: item.ItemsMaster.UomMaster.uom_name,
        created_by: item.created_by,
        stock_in_hand: item.stock_in_hand,
        stock_in_transit: item.stock_in_transit
      }));
      console.log('result', result);

      setStockItems(result);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data');
      return [];
    }
  };

  const getOprData = async () => {
    try {
      await GetOpr(dispatch, 1098);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
    }
  };

  useEffect(() => {
    oprs.length === 0 && getOprData();
    getStockItem(opr_id);
  }, []);

  const stockItemColumns = [
    { headerName: 'S.No', field: 'id', width: 60 },
    { headerName: 'Type', field: 'item_type', width: 100 },
    { headerName: 'Sub Group', field: 'sub_group', width: 100 },
    { headerName: 'Stock Item Code', field: 'item_code', width: 100 },
    { headerName: 'Item Name', field: 'item_name', width: 150 },
    { headerName: 'HSN Code', field: 'hs_code', width: 100 },
    { headerName: 'NAFDAC', field: 'nafdac_name', width: 100 },
    { headerName: 'Cria', field: 'cria', width: 100 },
    { headerName: 'OPR Qty', field: 'qty', width: 100 },
    { headerName: 'UOM', field: 'uom_id', width: 80 },
    { headerName: 'Stock In Transit', field: 'stock_in_transit', width: 100 },
    { headerName: 'Stock In Hand', field: 'stock_in_hand', width: 100 },
    { headerName: 'Monthly Consumption', field: 'monthly_consumption', width: 100 },
    { headerName: 'Remarks', field: 'item_description', width: 150 }
  ];

  useEffect(() => {
    console.log(stockItems);
    const mappedData = stockItems?.map((item, index) => ({
      id: index + 1,
      item_type: item?.item_type,
      sub_group: item?.sub_group,
      item_code: item?.item_code,
      item_name: item?.item_name,
      item_description: item?.item_description,
      hs_code: item?.hs_code,
      nafdac_name: item?.nafdac_name,
      cria: item?.cria,
      uom_id: item?.uom_id,
      stock_in_transit: item?.stock_in_transit,
      stock_in_hand: item?.stock_in_hand,
      monthly_consumption: item?.monthly_consumption,
      qty: item?.qty
    }));
    console.log('mappedData', mappedData);
    setOprItemData(mappedData);
  }, []);

  return (
    <>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>
          OPR Detail (
          <span className="text-primary" style={{ color: 'blue' }}>
            {oprData?.opr_num}
          </span>
          )
        </h3>
      </Typography>
      <Box sx={{ marginBottom: '10px' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Vertical:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.vertical_name}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Company:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.company_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Division:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.division_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Buying From:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.buy_from}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Buying House Location:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.buying_house_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Request By Department:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.dept_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Requested By:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.requested_by}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Quotations Email Alert:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.no_quot_email_alert}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  OPR Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.opr_date}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Shipment Mode:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.shipment_mode_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Delivery Timeline (<i>weeks</i>):
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.d_timeline_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  OPR Category:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.opr_description}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Additional Remark:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{oprData?.remarks}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {stockItems && stockItems.length > 0 && ItemStatus && (
          <Box sx={{ maxHeight: 400, minHeight: '100PX', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h3>Item Details</h3>
            </div>
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
                  height: '25px !important',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-scrollbar': {
                  height: '8px'
                }
              }}
              rows={oprItemData}
              columns={stockItemColumns}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default OPR_Data;
