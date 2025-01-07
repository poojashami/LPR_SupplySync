/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Grid, FormControl, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { setSelectedRows } from 'Redux/Slices/RFQSlice';
import { opr_ids_set } from 'Redux/Slices/OprSlice';
import { useDispatch, useSelector } from 'react-redux';
import Opr_list from './Opr_list';

const OprItemListPage = ({ showItems, setShowItems }) => {
  const dispatch = useDispatch();
  const { opr_ids } = useSelector((state) => state.opr);
  const [rowData, setRowData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [company, setCompany] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [opr_list, setOpr_list] = useState([]);

  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}
    >
      <Typography variant="body2" color="textSecondary">
        No Items left for RFQ in selected OPRS
      </Typography>
    </Box>
  );
  useEffect(() => {
    const fetchData = async () => {
      if (opr_ids?.length <= 0) {
        try {
          dispatch(opr_ids_set({ data: opr_list }));
          const itemlist = await axiosInstance.get(`/api/opr/itemsforrfq`, {
            params: {
              opr_id_list: opr_list
            }
          });
          const mappedData = itemlist?.data.map((item, index) => ({
            id: index + 1,
            opr_id: item.OprMaster.opr_num,
            item_code: item.ItemsMaster.item_code,
            item_name: item.ItemsMaster.item_name,
            opr_item_id: item.opr_item_id,
            item_id: item.item_id,
            item_description: item.item_description,
            uom_name: item?.uom_name,
            qty: item.qty,
            company_name: item.companyMaster.company_name,
            address_id: item.address_id,
            delivery_timeline_id: item?.OprMaster?.DeliveryTimeline?.delivery_timeline_name
          }));
          console.log('mappedData', mappedData);
          setItemList(mappedData);
          const existingLabels = new Set();
          const comp_list = itemlist.data
            .filter((item) => {
              const label = item.companyMaster.company_name;
              if (!existingLabels.has(label)) {
                existingLabels.add(label);
                return true;
              }
              return false;
            })
            .map((item, index) => ({
              key: index + 1,
              label: item.companyMaster.company_name
            }));
          setCompanyList(comp_list);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        try {
          // dispatch(opr_ids_set({ data: opr_list }));
          const itemlist = await axiosInstance.get(`/api/opr/itemsforrfq`, {
            params: {
              opr_id_list: opr_ids
            }
          });
          const mappedData = itemlist?.data.map((item, index) => ({
            id: index + 1,
            opr_id_no: item.opr_id,
            opr_id: item.OprMaster.opr_num,
            item_code: item.ItemsMaster.item_code,
            item_name: item.ItemsMaster.item_name,
            opr_item_id: item.opr_item_id,
            item_id: item.item_id,
            uom_name: item?.uom_name,
            item_description: item.item_description,
            qty: item.qty,
            company_name: item.companyMaster.company_name,
            address_id: item.address_id,
            delivery_timeline_id: item?.OprMaster?.delivery_timeline_id,
            bh_id: item?.OprMaster?.buying_house_id
          }));
          setItemList(mappedData);
          const existingLabels = new Set();
          const comp_list = itemlist.data
            .filter((item) => {
              const label = item.companyMaster.company_name;
              if (!existingLabels.has(label)) {
                existingLabels.add(label);
                return true;
              }
              return false;
            })
            .map((item, index) => ({
              key: index + 1,
              label: item.companyMaster.company_name
            }));
          setCompanyList(comp_list);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opr_list, showItems]);

  useEffect(() => {
    // const mappedData = itemList?.filter((item) => item.company_name === company);
    setRowData(itemList);
    console.log('itemList', itemList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showItems, companyList]);

  const columns = [
    { field: 'id', headerName: 'Sl. No.', width: 80, filterable: false },
    { field: 'opr_id', headerName: 'OPR Number', width: 150, filterable: false },
    { field: 'company_name', headerName: 'Company Name', width: 150, filterable: false },
    { field: 'item_code', headerName: 'Item Code', width: 150, filterable: true },
    { field: 'item_name', headerName: 'Item Name', width: 200, filterable: false },
    {
      field: 'delivery_timeline_id',
      headerName: 'Delivery Timeline',
      width: 200,
      filterable: true,
      renderCell: (params) => <span>{params.value} Weeks</span>
    },
    // { field: 'item_description', headerName: 'Item Description', width: 250, filterable: false },
    { field: 'qty', headerName: 'Req Qty', width: 120, filterable: false },
    { field: 'uom_name', headerName: 'UOM', width: 120, filterable: false }
  ];

  const handleSelectionModelChange = (selectionModel) => {
    const selectedIDs = new Set(selectionModel);
    const selectedRowData = rowData.filter((row) => selectedIDs.has(row.id));
    setSelectedRows(selectedRowData);
    dispatch(setSelectedRows(selectedRowData));
  };
  return (
    <>
      {showItems ? (
        <Box style={{ height: '80vh', width: '100%' }}>
          {/* <Grid container>
            <Grid xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Select Company
            </Grid>
            <Grid xs={2}>
              <FormControl fullWidth>
                <Select onChange={(e) => setCompany(e.target.value)} value={company} id="company-list">
                  <MenuItem value={0}>Select Company</MenuItem>
                  {companyList?.map((item) => (
                    <MenuItem key={item.key} value={item.label}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid> */}
          {/* {companyList.length > 0 && ( */}
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
              '& .MuiDataGrid-checkboxInput': {
                padding: '0px' // To remove extra padding around the checkbox
              },
              '& .MuiCheckbox-root': {
                width: '18px',
                height: '18px'
              },
              '& .MuiSvgIcon-root': {
                fontSize: '20px' // Customize the size of the checkmark icon
              }
            }}
            rows={rowData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 15, 20]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionModelChange}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay
            }}
          />
          {/* )} */}
        </Box>
      ) : (
        <Opr_list setOpr_list={setOpr_list} setShowItems={setShowItems} />
      )}
    </>
  );
};

export default OprItemListPage;
